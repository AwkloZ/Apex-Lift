// Coach flow in a real browser against the Firebase emulators (never the real database).
// Run:  cd tools/rules-test && npm run e2e
// It loads firestore.rules into the emulator, creates test accounts, serves the repo and drives
// admin.html / coach.html / index.html with ?emu=1. Exit code 1 = a check failed.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECT = 'apex-lift-52a18'; // the project id the pages use (only ever the emulator here)
const AUTH_PROJECT = 'demo-apex'; // sign-in requests carry no project: the Auth emulator uses its default one
const FS = 'http://127.0.0.1:8080', AUTH = 'http://127.0.0.1:9099';
const ADMIN = { uid: 'O5aONnMMOLQI67fNpoNfu9GBrOL2', email: 'admin@apexlift.app' };
const COACH = { uid: 'coach1', email: 'coach@x.com', name: 'Coach Test' };
const COACH2 = { uid: 'coach2', email: 'coach2@x.com', name: 'Second Coach' };
const OTHER = { uid: 'other1', email: 'other@x.com' };
const CLIENT = { uid: 'client1', email: 'client@x.com' };
const PASS = 'test-pass-123';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

let failed = 0;
const check = (name, ok, extra = '') => { if (ok) console.log('ok  ', name); else { failed++; console.log('FAIL', name, extra); } };

const api = async (url, opts = {}) => {
    const r = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner', ...(opts.headers || {}) } });
    if (!r.ok) throw new Error(`${opts.method || 'GET'} ${url}: ${r.status} ${await r.text()}`);
    return r.status === 204 ? null : r.json().catch(() => null);
};
const loadRules = () => api(`${FS}/emulator/v1/projects/${PROJECT}:securityRules`, { method: 'PUT', body: JSON.stringify({ rules: { files: [{ name: 'firestore.rules', content: fs.readFileSync(path.join(ROOT, 'firestore.rules'), 'utf8') }] } }) });
const clearDb = () => api(`${FS}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' });
const clearAuth = () => api(`${AUTH}/emulator/v1/projects/${AUTH_PROJECT}/accounts`, { method: 'DELETE' });
const addUser = u => api(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${AUTH_PROJECT}/accounts:batchCreate`, { method: 'POST',
    body: JSON.stringify({ users: [{ localId: u.uid, email: u.email, emailVerified: true, rawPassword: PASS, displayName: u.name || '' }] }) });
// read / write a document as the admin of the emulator (rules off)
const docUrl = p => `${FS}/v1/projects/${PROJECT}/databases/(default)/documents/${p}`;
const toFields = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? { integerValue: String(v) } : { stringValue: String(v) }]));
const fromFields = f => Object.fromEntries(Object.entries(f || {}).map(([k, v]) => [k, 'booleanValue' in v ? v.booleanValue : 'integerValue' in v ? Number(v.integerValue) : v.stringValue]));
const setDoc = (p, o) => api(docUrl(p), { method: 'PATCH', body: JSON.stringify({ fields: toFields(o) }) });
const getDoc = async p => { try { return fromFields((await api(docUrl(p))).fields); } catch (e) { return null; } };
const listDocs = async p => { const r = await api(docUrl(p)).catch(() => null); return (r && r.documents) || []; };

const serve = () => new Promise(res => {
    const s = http.createServer((req, rsp) => {
        const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
        if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
        rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(s));
});

// open a page and sign in with email + password through the page's own Firebase (already pointed at the emulator)
const openAs = async (browser, base, page, user, extra = '') => {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const p = await ctx.newPage();
    p.errors = [];
    p.on('pageerror', e => p.errors.push(e.message));
    p.on('dialog', d => d.accept()); // "Are you sure?" questions are answered Yes
    await p.goto(`${base}/${page}?emu=1${extra}`);
    await p.waitForFunction(() => window.firebase && firebase.apps.length, null, { timeout: 15000 });
    if (user) await p.evaluate(([e, pw]) => firebase.auth().signInWithEmailAndPassword(e, pw), [user.email, PASS]);
    return p;
};
const text = p => p.evaluate(() => document.body.innerText);
const waitText = (p, re, timeout = 10000) => p.waitForFunction(r => new RegExp(r).test(document.body.innerText), re.source, { timeout }).then(() => true, () => false);

const tests = [];
const T = (name, fn) => tests.push([name, fn]);

// ---------- admin: Coaches tab ----------
T('admin invites a coach and switches them off', async ({ browser, base }) => {
    const p = await openAs(browser, base, 'admin.html', ADMIN);
    check('admin page shows a Coaches tab', await waitText(p, /Coaches/));
    await p.click('[data-tab="coaches"]');
    await p.fill('#ci-name', COACH.name);
    await p.fill('#ci-email', 'Coach@X.com');
    await p.click('#ci-go');
    check('invite link is shown', await waitText(p, /coach\.html\?invite=[A-HJ-NP-Z2-9]{8}/));
    const code = (await text(p)).match(/coach\.html\?invite=([A-HJ-NP-Z2-9]{8})/)[1];
    const inv = await getDoc(`coachInvites/${code}`);
    check('invite saved with the lower-case email', inv && inv.email === COACH.email && inv.usedBy === '', JSON.stringify(inv));
    check('invite listed as Invited', await waitText(p, /Invited/));
    // the coach accepts (done here directly; the coach app is tested below) and has one client
    await setDoc(`coachInvites/${code}`, { ...inv, usedBy: COACH.uid, usedAt: 2 });
    await setDoc(`coaches/${COACH.uid}`, { name: COACH.name, email: COACH.email, invite: code, active: true, createdAt: 2 });
    await setDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`, { code: 'KKKKKKKK', name: 'Client One', email: CLIENT.email, joinedAt: 4 });
    await setDoc(`users/${CLIENT.uid}/coach/link`, { coachId: COACH.uid, coachName: COACH.name, code: 'KKKKKKKK', joinedAt: 4 });
    await p.click('#co-reload');
    if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/admin-coaches.png`, fullPage: true });
    check('coach listed as Active with 1 client', await waitText(p, /Coach Test[\s\S]*Active[\s\S]*1 client/));
    await p.click(`[data-coach="${COACH.uid}"]`);
    check('coach panel lists the client', await waitText(p, /Client One/));
    await p.click(`[data-remove="${CLIENT.uid}"]`);
    await p.waitForTimeout(800);
    check('remove takes the client off the coach', !(await getDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`)) && !(await getDoc(`users/${CLIENT.uid}/coach/link`)));
    await p.click('#co-close');
    await p.click(`[data-toggle="${COACH.uid}"]`);
    await p.waitForTimeout(800);
    check('switch off sets active false', (await getDoc(`coaches/${COACH.uid}`)).active === false);
    check('admin page: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});

(async () => {
    await loadRules(); await clearDb(); await clearAuth();
    for (const u of [ADMIN, COACH, COACH2, OTHER, CLIENT]) await addUser(u);
    const server = await serve(), base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const only = process.argv[2];
    for (const [name, fn] of tests) {
        if (only && !name.includes(only)) continue;
        console.log(`\n# ${name}`);
        await clearDb();
        try { await fn({ browser, base }); } catch (e) { failed++; console.log('FAIL', name, e.message); }
    }
    await browser.close(); server.close();
    console.log(failed ? `\n${failed} check(s) failed` : '\nAll coach checks passed');
    process.exit(failed ? 1 : 0);
})();

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

// ---------- coach app ----------
const ICODE = 'ABCDEFGH';
const seedInvite = (email = COACH.email) => setDoc(`coachInvites/${ICODE}`, { name: COACH.name, email, by: ADMIN.uid, createdAt: 1, usedBy: '', usedAt: 0 });
const seedCoach = (active = true, c = COACH) => setDoc(`coaches/${c.uid}`, { name: c.name, email: c.email, invite: ICODE, active, createdAt: 2 });

T('coach accepts an invite', async ({ browser, base }) => {
    await seedInvite();
    const p = await openAs(browser, base, 'coach.html', COACH, `&invite=${ICODE}`);
    check('claim screen names the coach', await waitText(p, /invited as Coach Test/));
    await p.click('#accept');
    check('after accepting: client list, empty', await waitText(p, /No clients yet/));
    const c = await getDoc(`coaches/${COACH.uid}`), inv = await getDoc(`coachInvites/${ICODE}`);
    check('coach account is active and the invite is used', c && c.active === true && inv.usedBy === COACH.uid, JSON.stringify([c, inv]));
    check('invite removed from the address', !(await p.evaluate(() => location.search.includes('invite'))));
    check('coach app: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});
T('coach app: wrong account, not a coach, switched off', async ({ browser, base }) => {
    await seedInvite();
    let p = await openAs(browser, base, 'coach.html', OTHER, `&invite=${ICODE}`);
    check('invite for another email is refused', await waitText(p, /This invitation is for another email/));
    await p.context().close();
    p = await openAs(browser, base, 'coach.html', OTHER);
    check('a normal account sees "not a coach"', await waitText(p, /isn.t a coach account/));
    await p.context().close();
    await seedCoach(false);
    p = await openAs(browser, base, 'coach.html', COACH);
    check('a switched-off coach is told so', await waitText(p, /switched off/));
    check('coach app: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});
T('coach makes and deletes a client code, sees clients', async ({ browser, base }) => {
    await seedCoach();
    await setDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`, { code: 'KKKKKKKK', name: 'Client One', email: CLIENT.email, joinedAt: 4 });
    await setDoc(`users/${CLIENT.uid}`, { updatedAt: Date.now() });
    const p = await openAs(browser, base, 'coach.html', COACH);
    check('client list shows the client', await waitText(p, /Client One/));
    await p.click('#new-code');
    check('a client link is shown', await waitText(p, /\?coach=[A-HJ-NP-Z2-9]{8}/));
    const code = (await text(p)).match(/\?coach=([A-HJ-NP-Z2-9]{8})/)[1];
    const cc = await getDoc(`coachCodes/${code}`);
    check('code saved for this coach', cc && cc.coach === COACH.uid && cc.name === COACH.name, JSON.stringify(cc));
    await p.click(`[data-del-code="${code}"]`);
    await p.waitForTimeout(800);
    check('code deleted', !(await getDoc(`coachCodes/${code}`)));
    if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/coach-clients.png`, fullPage: true });
    check('coach app: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});

// ---------- client app: joining and leaving a coach ----------
const KCODE = 'KKKKKKKK', KCODE2 = 'MMMMMMMM';
const seedCode = (c = COACH, code = KCODE) => setDoc(`coachCodes/${code}`, { coach: c.uid, name: c.name, createdAt: 3 });
// the Apex Lift app, signed in as the client (sign-in screens skipped: already agreed, set up, About you filled in)
const openClient = async (browser, base, extra = '', lang = 'en') => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.route('**/require-sign-in.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
    await ctx.addInitScript(([uid, email, lang]) => {
        if (sessionStorage.getItem('e2eInit')) return; sessionStorage.setItem('e2eInit', '1');
        localStorage.setItem('workoutLang_rakan_final', lang);
        localStorage.setItem('workoutCloud_rakan_final', JSON.stringify({ uid, email, name: 'Client One', since: 1 }));
        localStorage.setItem('workoutCloudLastUid_rakan_final', uid);
        localStorage.setItem('workoutAgreed_rakan_final', JSON.stringify({ v: '2026-10.10', at: 1 }));
        localStorage.setItem('workoutIntroSeen_rakan_final', '1');
        localStorage.setItem('workoutBody_rakan_final', JSON.stringify({ birthYear: 1995, birthDate: '1995-05-20', sex: 'male', heightCm: 178, weightKg: 80, locked: true }));
    }, [CLIENT.uid, CLIENT.email, lang]);
    const p = await ctx.newPage();
    p.errors = [];
    p.on('pageerror', e => p.errors.push(e.message));
    p.on('dialog', d => d.accept());
    await p.goto(`${base}/index.html?emu=1${extra}`);
    await p.waitForFunction(() => window.firebase && firebase.apps.length && firebase.auth, null, { timeout: 15000 });
    await p.evaluate(([e, pw]) => firebase.auth().signInWithEmailAndPassword(e, pw), [CLIENT.email, PASS]);
    return p;
};
// the app's own confirm pop-up: tap its Yes button
const confirmYes = p => p.evaluate(() => { const b = document.getElementById('confirm-yes-btn'); if (b) b.click(); });
const sheetText = p => p.evaluate(() => (document.getElementById('code-body') || {}).innerText || '');
const waitSheet = (p, re, timeout = 10000) => p.waitForFunction(r => new RegExp(r).test((document.getElementById('code-body') || {}).innerText || ''), re.source, { timeout }).then(() => true, () => false);
const rowText = p => p.evaluate(() => (document.getElementById('coach-row') || {}).innerText || '');
const waitRow = (p, re, timeout = 10000) => p.waitForFunction(r => new RegExp(r).test((document.getElementById('coach-row') || {}).innerText || ''), re.source, { timeout }).then(() => true, () => false);

T('client joins a coach with a link, coach sends a routine', async ({ browser, base }) => {
    await seedCoach(); await seedCode();
    const p = await openClient(browser, base, `&coach=${KCODE}`);
    check('the link opens "Join Coach Test?"', await waitSheet(p, /Join Coach Test\?/));
    check('the sheet says what the coach will see', /will see your profile/.test(await sheetText(p)));
    // a new client answers the setup questions first: the join sheet must still be there afterwards
    await p.evaluate(() => { const W = window.appState.wiz; if (W) { Object.assign(W, { goal: 'muscle', days: '4', exp: 'mid', eq: 'gym', session: '60' }); window.appActions.wizFinish('program'); } });
    await p.waitForTimeout(4500);
    check('after the setup questions the join sheet is visible', await p.evaluate(() => { const b = document.getElementById('coach-join'); if (!b) return false; const r = b.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!hit && b.contains(hit); }));
    if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/client-join.png` });
    await p.evaluate(() => document.getElementById('coach-join').click());
    check('Profile row shows the coach', await waitRow(p, /Coach Test/));
    const m = await getDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`), l = await getDoc(`users/${CLIENT.uid}/coach/link`);
    check('member entry and link saved', m && m.code === KCODE && l && l.coachId === COACH.uid, JSON.stringify([m, l]));
    // the coach sees the client and sends a message from the coach app
    const c = await openAs(browser, base, 'coach.html', COACH);
    check('coach app lists the new client', await waitText(c, /Client One|client@x.com/));
    await c.click(`[data-client="${CLIENT.uid}"]`);
    await c.click('#c-note');
    await c.waitForSelector('#coach.open');
    await c.fill('#cb-note', 'Great work this week');
    await c.click('#cb-send');
    await c.waitForTimeout(1200);
    const plan = await getDoc(`users/${CLIENT.uid}/coach/plan`);
    check('the coach\'s message reached the client\'s account', plan && plan.mode === 'note' && plan.note === 'Great work this week', JSON.stringify(plan));
    check('the client app shows the message toast', await waitText(p, /Your coach sent you a message/));
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    check('client app: no errors', !p.errors.length, p.errors.join(' | '));
    await c.context().close(); await p.context().close();
});
T('client: bad code, switching coach, leaving, removed elsewhere', async ({ browser, base }) => {
    await seedCoach(); await seedCoach(true, COACH2); await seedCode(); await seedCode(COACH2, KCODE2);
    const p = await openClient(browser, base);
    await p.waitForTimeout(1500);
    check('no coach yet: row says Join a coach', await waitRow(p, /Join a coach/));
    await p.evaluate(() => window.appActions.openCoachSheet());
    await p.fill('#coach-in', 'ZZZZ-ZZZZ');
    await p.evaluate(() => window.appActions.coachFind());
    check('a code that doesn\'t exist is explained', await waitSheet(p, /This code doesn.t work/));
    await p.evaluate(c => window.appActions.openCoachSheet(c), KCODE);
    await p.evaluate(() => window.appActions.coachFind());
    await waitSheet(p, /Join Coach Test/);
    await p.evaluate(() => document.getElementById('coach-join').click());
    await waitRow(p, /Coach Test/);
    // switch to the second coach: the first one loses the client
    await p.evaluate(c => window.appActions.openCoachSheet(c), KCODE2);
    await p.evaluate(() => window.appActions.coachFind());
    await waitSheet(p, /Join Second Coach/);
    await p.evaluate(() => document.getElementById('coach-join').click());
    await p.waitForTimeout(500); await confirmYes(p);
    check('switching shows the new coach', await waitRow(p, /Second Coach/));
    check('switching leaves the first coach', !(await getDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`)) && !!(await getDoc(`coaches/${COACH2.uid}/members/${CLIENT.uid}`)));
    // leave
    await p.evaluate(() => window.appActions.openCoachSheet());
    await waitSheet(p, /Second Coach/);
    await p.evaluate(() => document.getElementById('coach-leave').click());
    await p.waitForTimeout(500); await confirmYes(p);
    check('after leaving: Join a coach', await waitRow(p, /Join a coach/));
    check('leaving removes both entries', !(await getDoc(`coaches/${COACH2.uid}/members/${CLIENT.uid}`)) && !(await getDoc(`users/${CLIENT.uid}/coach/link`)));
    // join again, then the admin removes the client elsewhere: the app notices when it comes back
    await p.evaluate(c => window.appActions.openCoachSheet(c), KCODE);
    await p.evaluate(() => window.appActions.coachFind());
    await waitSheet(p, /Join Coach Test/);
    await p.evaluate(() => document.getElementById('coach-join').click());
    await waitRow(p, /Coach Test/);
    await api(docUrl(`coaches/${COACH.uid}/members/${CLIENT.uid}`), { method: 'DELETE' });
    await p.evaluate(() => window.appActions.coachCheck(true));
    check('removed elsewhere: back to Join a coach', await waitRow(p, /Join a coach/));
    check('client app: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});
T('client: Arabic coach sheet has no English left', async ({ browser, base }) => {
    await seedCoach(); await seedCode();
    const p = await openClient(browser, base, `&coach=${KCODE}`, 'ar');
    await waitSheet(p, /Coach Test/);
    const t = (await sheetText(p)).replace(/Coach Test|KKKK-KKKK|ABCD-EFGH/g, '');
    check('join sheet is Arabic', !/[A-Za-z]{3,}/.test(t), t);
    await p.evaluate(() => document.getElementById('coach-join').click());
    await waitRow(p, /Coach Test/);
    const r = (await rowText(p)).replace(/Coach Test/g, '');
    check('coach row is Arabic', !/[A-Za-z]{3,}/.test(r), r);
    await p.evaluate(() => window.appActions.openCoachSheet());
    await p.waitForTimeout(500);
    const t2 = (await sheetText(p)).replace(/Coach Test/g, '');
    check('your-coach sheet is Arabic', !/[A-Za-z]{3,}/.test(t2), t2);
    check('client app: no errors', !p.errors.length, p.errors.join(' | '));
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

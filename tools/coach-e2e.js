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
const toValue = v => typeof v === 'boolean' ? { booleanValue: v } : typeof v === 'number' ? (Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v })
    : Array.isArray(v) ? { arrayValue: { values: v.map(toValue) } } : v && typeof v === 'object' ? { mapValue: { fields: toFields(v) } } : { stringValue: String(v) };
const toFields = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, toValue(v)]));
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
    await p.click('[data-tab="invite"]');
    await p.click('#new-code');
    check('a client link is shown', await waitText(p, /\?coach=[A-HJ-NP-Z2-9]{8}/));
    const code = (await text(p)).match(/\?coach=([A-HJ-NP-Z2-9]{8})/)[1];
    const cc = await getDoc(`coachCodes/${code}`);
    check('code saved for this coach', cc && cc.coach === COACH.uid && cc.name === COACH.name, JSON.stringify(cc));
    await p.click(`[data-del-code="${code}"]`);
    await p.click('.pop [data-ok]'); // the app-style "Delete this link?" pop-up
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
        localStorage.setItem('workoutAgreed_rakan_final', JSON.stringify({ v: '2026-11.04', at: 1 }));
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
    await c.click('[data-act="note"]');
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
    // join again (with a new code: each one works once), then the admin removes the client elsewhere: the app notices when it comes back
    await seedCode(COACH, 'NNNNNNNN');
    await p.evaluate(c => window.appActions.openCoachSheet(c), 'NNNNNNNN');
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

T('coach removes a client; a client who already left is handled', async ({ browser, base }) => {
    await seedCoach();
    await setDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`, { code: KCODE, name: '', email: CLIENT.email, joinedAt: 4 });
    await setDoc(`users/${CLIENT.uid}/coach/link`, { coachId: COACH.uid, coachName: COACH.name, code: KCODE, joinedAt: 4 });
    await setDoc(`users/${CLIENT.uid}`, { updatedAt: Date.now() });
    await setDoc(`coaches/${COACH.uid}/members/${OTHER.uid}`, { code: KCODE, name: 'Gone Client', email: OTHER.email, joinedAt: 4 });
    const p = await openAs(browser, base, 'coach.html', COACH);
    check('a client with no name shows their email', await waitText(p, /client@x\.com/));
    await p.click(`[data-client="${CLIENT.uid}"]`);
    await p.click('[data-act="remove"]');
    await p.click('.pop [data-ok]');
    check('after removing, the list no longer has them', await waitText(p, /Gone Client/) && !(await text(p)).includes('client@x.com'));
    check('member entry and link removed', !(await getDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`)) && !(await getDoc(`users/${CLIENT.uid}/coach/link`)));
    // this one left meanwhile (their entry is gone): Remove must not get stuck
    await p.click(`[data-client="${OTHER.uid}"]`);
    await api(docUrl(`coaches/${COACH.uid}/members/${OTHER.uid}`), { method: 'DELETE' });
    await p.click('[data-act="remove"]');
    await p.click('.pop [data-ok]');
    check('a client who already left: back to the list', await waitText(p, /No clients yet/));
    check('coach app: no errors', !p.errors.length, p.errors.join(' | '));
    await p.context().close();
});

// ---------- one-time client codes ----------
T('a client code works once', async ({ browser, base }) => {
    await seedCoach(); await seedCode();
    const p = await openClient(browser, base, `&coach=${KCODE}`);
    await waitSheet(p, /Join Coach Test\?/);
    await p.evaluate(() => document.getElementById('coach-join').click());
    check('joined', await waitRow(p, /Coach Test/));
    const cc = await getDoc(`coachCodes/${KCODE}`);
    check('the code is marked as used by the client', cc && cc.usedBy === CLIENT.uid && cc.usedAt > 0, JSON.stringify(cc));
    // the coach app lists it under Used, with the client's name
    const c = await openAs(browser, base, 'coach.html', COACH);
    await waitText(c, /Coach Test|Client One/);
    await c.click('[data-tab="invite"]');
    check('coach sees the link as used by the client', await waitText(c, /Used by (Client One|client@x\.com)/));
    await c.click('#new-code');
    await waitText(c, /Ready to send/);
    const fresh = await listDocs('coachCodes');
    check('a new link starts unused', fresh.some(d => !d.name.endsWith(KCODE) && fromFields(d.fields).usedBy === ''), JSON.stringify(fresh.map(d => d.fields)));
    // the client leaves and tries the same code again
    await p.evaluate(() => window.appActions.openCoachSheet());
    await waitSheet(p, /Coach Test/);
    await p.evaluate(() => document.getElementById('coach-leave').click());
    await p.waitForTimeout(500); await confirmYes(p);
    await waitRow(p, /Join a coach/);
    await p.evaluate(c => window.appActions.openCoachSheet(c), KCODE);
    await p.evaluate(() => window.appActions.coachFind());
    check('a used code is explained', await waitSheet(p, /already used/));
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    check('client app: no errors', !p.errors.length, p.errors.join(' | '));
    await c.context().close(); await p.context().close();
});

// ---------- chat ----------
T('coach and client chat', async ({ browser, base }) => {
    await seedCoach(); await seedCode();
    const p = await openClient(browser, base, `&coach=${KCODE}`);
    await waitSheet(p, /Join Coach Test\?/);
    await p.evaluate(() => document.getElementById('coach-join').click());
    await waitRow(p, /Coach Test/);
    const c = await openAs(browser, base, 'coach.html', COACH);
    await waitText(c, /Client One|client@x\.com/);
    await c.click('[data-tab="chats"]');
    await c.click(`[data-chat="${CLIENT.uid}"]`);
    check('coach: an empty chat says who can read it', await waitText(c, /Only you and/));
    await c.fill('#chat-in', 'Hello from your coach');
    await c.click('#chat-send');
    check('coach: the message shows', await waitText(c, /Hello from your coach/));
    check('chat: a short message bubble is only as wide as its text', await c.evaluate(() => { const m = document.querySelector('.chat-msg'), l = document.getElementById('chat-list'); return m.getBoundingClientRect().width < l.getBoundingClientRect().width * 0.6; }));
    // a smaller visible screen (like a phone with its keyboard open): the name stays on top, the box to type right above
    await c.setViewportSize({ width: 1200, height: 420 });
    await c.waitForTimeout(300);
    check('chat: with less room the name and the typing box stay visible', await c.evaluate(() => {
        const top = document.querySelector('.chat-top .page-bar-title').getBoundingClientRect(), bar = document.querySelector('.chat-bar').getBoundingClientRect();
        return top.top >= 0 && bar.bottom <= window.innerHeight + 1 && bar.top > top.bottom;
    }));
    await c.setViewportSize({ width: 1200, height: 900 });
    await c.waitForTimeout(800);
    const th = await getDoc(`users/${CLIENT.uid}/chats/${COACH.uid}`);
    check('thread summary saved', th && th.lastFrom === COACH.uid && th.lastText === 'Hello from your coach', JSON.stringify(th));
    // the client gets a dot on Profile and a toast, opens the chat and answers
    check('client: dot on Profile', await p.waitForFunction(() => !document.getElementById('chat-dot').classList.contains('hidden'), null, { timeout: 10000 }).then(() => true, () => false));
    check('client: toast for the new message', await waitText(p, /New message from Coach Test/));
    await p.evaluate(() => window.appActions.openChat());
    check('client: the coach\'s message is in the chat', await p.waitForFunction(() => /Hello from your coach/.test(document.getElementById('chat-list').innerText), null, { timeout: 10000 }).then(() => true, () => false));
    check('client: opening the chat clears the dot', await p.waitForFunction(() => document.getElementById('chat-dot').classList.contains('hidden'), null, { timeout: 5000 }).then(() => true, () => false));
    check('coach: the client saw the message', await waitText(c, /Seen/));
    await p.fill('#chat-in', 'Thanks coach!');
    await p.evaluate(() => window.appActions.chatSend());
    check('coach: the reply arrives live', await waitText(c, /Thanks coach!/));
    check('coach: "Seen" goes once the client wrote last', !/Seen/.test(await text(c)));
    if (process.env.SHOTS) { await c.screenshot({ path: `${process.env.SHOTS}/coach-chat.png` }); await p.screenshot({ path: `${process.env.SHOTS}/client-chat.png` }); }
    // back to the list: the chat is there, read
    await c.click('[data-back]');
    check('coach: back goes to the Chats list', await waitText(c, /Chats[\s\S]*Thanks coach!/));
    // the client leaves: the coach can no longer write
    await p.evaluate(() => window.appActions.closeChat());
    await p.evaluate(() => window.appActions.openCoachSheet());
    await waitSheet(p, /Coach Test/);
    await p.evaluate(() => document.getElementById('coach-leave').click());
    await p.waitForTimeout(500); await confirmYes(p);
    await waitRow(p, /Join a coach/);
    const msgs = await listDocs(`users/${CLIENT.uid}/chats/${COACH.uid}/messages`);
    check('both messages saved, from the right people', msgs.length === 2 && msgs.some(d => fromFields(d.fields).from === CLIENT.uid) && msgs.some(d => fromFields(d.fields).from === COACH.uid), JSON.stringify(msgs.map(d => d.fields)));
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    check('client app: no errors', !p.errors.length, p.errors.join(' | '));
    await c.context().close(); await p.context().close();
});

// ---------- a client's training in the coach app ----------
const seedTraining = async () => {
    const now = Date.now(), day = 86400000, k = d => { const x = new Date(now - d * day); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
    await setDoc(`coaches/${COACH.uid}/members/${CLIENT.uid}`, { code: KCODE, name: 'Client One', email: CLIENT.email, joinedAt: now - 30 * day });
    await setDoc(`users/${CLIENT.uid}`, {
        updatedAt: now, profile: { days: '4', exp: 'mid', session: '60' },
        body: { weightKg: 80, heightCm: 178, sex: 'male', birthDate: '1995-05-20', log: [{ t: now - 20 * day, kg: 82 }, { t: now - 10 * day, kg: 81 }, { t: now - day, kg: 80 }] },
        readiness: { [k(0)]: { sleep: 0, soreness: 0, energy: 1 }, [k(1)]: { sleep: 2, soreness: 2, energy: 2 } },
        activity: { n: 3, ex: 1, last: now - day, days: [k(9), k(5), k(1)], top: [] }
    });
    await setDoc(`users/${CLIENT.uid}/history/global_barbell_bench_press`, { logs: [
        { d: 'x', ts: now - 9 * day, w: '60', s: [8, 8, 7] },
        { d: 'x', ts: now - 5 * day, w: '62.5', s: [8, 7, 6], rpe: [8, 9, 10] },
        { d: 'x', ts: now - day, w: '65', s: [6, 6, 5], ws: ['65', '65', '60'] }
    ] });
};
T('coach sees a client\'s workouts, check-ins and progress', async ({ browser, base }) => {
    await seedCoach(); await seedTraining();
    const c = await openAs(browser, base, 'coach.html', COACH);
    check('home flags a low check-in today', await waitText(c, /Low check-in today/));
    await c.click(`[data-client="${CLIENT.uid}"]`);
    check('overview: check-in and training days', await waitText(c, /Daily check-in[\s\S]*Today: Low[\s\S]*3 workout days in the last 12 weeks/));
    check('overview: about the client', await waitText(c, /1 to 3 years/));
    await c.click('[data-seg="workouts"]');
    check('workouts: sets with weight × reps and RPE', await waitText(c, /Barbell Bench Press[\s\S]*65 kg × 6 · 65 kg × 6 · 60 kg × 5/) && /62\.5 kg × 6 @10/.test(await text(c)));
    await c.click('[data-seg="progress"]');
    check('progress: body weight and the exercise', await waitText(c, /Body weight[\s\S]*80[\s\S]*Barbell Bench Press[\s\S]*3 sessions/));
    await c.click('[data-ex="global_barbell_bench_press"]');
    check('progress: an exercise opens every session', await c.waitForFunction(() => document.querySelectorAll('.pop .ex-hist > div').length === 3, null, { timeout: 5000 }).then(() => true, () => false));
    await c.keyboard.press('Escape');
    // the phone's back closes the client page
    await c.goBack();
    check('back: the tabs again', await c.waitForFunction(() => !document.getElementById('dock').hidden, null, { timeout: 5000 }).then(() => true, () => false));
    if (process.env.SHOTS) await c.screenshot({ path: `${process.env.SHOTS}/coach-home.png`, fullPage: true });
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    await c.context().close();
});
T('coach builds a routine like the Plan tab', async ({ browser, base }) => {
    await seedCoach(); await seedTraining();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const c = await ctx.newPage(); c.errors = []; c.on('pageerror', e => c.errors.push(e.message));
    await c.goto(`${base}/coach.html?emu=1`);
    await c.waitForFunction(() => window.firebase && firebase.apps.length, null, { timeout: 15000 });
    await c.addStyleTag({ content: '.firebase-emulator-warning{display:none!important}' }); // the emulator's banner covers the Send bar
    await c.evaluate(([e, pw]) => firebase.auth().signInWithEmailAndPassword(e, pw), [COACH.email, PASS]);
    await c.waitForSelector(`[data-client="${CLIENT.uid}"]`);
    await c.click(`[data-client="${CLIENT.uid}"]`);
    await c.click('[data-act="routine"]');
    await c.waitForSelector('#coach.open');
    check('editor: the week with 7 days', await c.evaluate(() => document.querySelectorAll('#coach [data-day]').length === 7));
    await c.fill('#cb-name', 'Strength block');
    await c.click('[data-day="0"]');
    await c.fill('#cb-title', 'Push');
    await c.click('#cb-add');
    await c.waitForSelector('.cb-sheet.is-open');
    await c.fill('#cb-q', 'bench press');
    await c.click('.cb-row[data-add="Bench Press"]');
    check('sheet: the added exercise is marked', await c.waitForFunction(() => /In this day/.test(document.getElementById('cb-list').innerText), null, { timeout: 5000 }).then(() => true, () => false));
    // the phone's back closes the sheet, not the editor
    await c.goBack();
    check('back closes the sheet first', await c.waitForFunction(() => !document.querySelector('.cb-sheet') && document.getElementById('coach').classList.contains('open'), null, { timeout: 5000 }).then(() => true, () => false));
    check('day: the exercise card with its pill', await waitText(c, /Bench Press[\s\S]*3 × 10–12/));
    await c.click('.cb-ex[data-j="0"]');
    await c.click('.cb-pop [data-s="1"]');
    await c.click('.cb-pop [data-r="6 - 8"]');
    await c.click('.cb-pop [data-ok]');
    check('pop-up: sets and reps changed', await waitText(c, /4 × 6–8/));
    if (process.env.SHOTS) await c.screenshot({ path: `${process.env.SHOTS}/coach-builder-day.png`, fullPage: true });
    await c.goBack();
    check('back from a day: the week', await c.waitForFunction(() => document.querySelectorAll('#coach [data-day]').length === 7, null, { timeout: 5000 }).then(() => true, () => false));
    check('week: the day shows its name and size', await waitText(c, /Push[\s\S]*1 exercises? · 4 sets/));
    if (process.env.SHOTS) await c.screenshot({ path: `${process.env.SHOTS}/coach-builder-week.png`, fullPage: true });
    await c.click('#cb-send');
    await c.waitForSelector('.cb-pop [data-ok]'); // "Send anyway?" (the other days are empty)
    await c.click('.cb-pop [data-ok]');
    await c.waitForFunction(() => !document.getElementById('coach').classList.contains('open'), null, { timeout: 8000 });
    const r = await api(docUrl(`users/${CLIENT.uid}/coach/plan`));
    const v = JSON.stringify(r.fields);
    check('sent: the routine with the day and the exercise', /Strength block/.test(v) && /Push/.test(v) && /Bench Press/.test(v) && /"stringValue":"4"/.test(v) && /6 - 8/.test(v), v.slice(0, 400));
    check('after sending: back on the client page', await waitText(c, /Routine sent/) && await c.evaluate(() => !!document.querySelector('[data-seg]')));
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    await ctx.close();
});
T('coach app in Arabic', async ({ browser, base }) => {
    await seedCoach(); await seedTraining();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => localStorage.setItem('workoutLang_rakan_final', 'ar'));
    const c = await ctx.newPage(); c.errors = []; c.on('pageerror', e => c.errors.push(e.message)); c.on('dialog', d => d.accept());
    await c.goto(`${base}/coach.html?emu=1`);
    await c.waitForFunction(() => window.firebase && firebase.apps.length, null, { timeout: 15000 });
    await c.evaluate(([e, pw]) => firebase.auth().signInWithEmailAndPassword(e, pw), [COACH.email, PASS]);
    await c.waitForFunction(() => !document.getElementById('dock').hidden, null, { timeout: 15000 });
    check('page is right to left', await c.evaluate(() => document.documentElement.dir === 'rtl'));
    const english = async () => (await text(c)).replace(/Running in emulator mode\. Do not use with production credentials\./g, '').replace(/يا Coach/g, '').replace(/APEX|LIFT|Apex Coach|Apex Lift|Coach Test|Client One|client@x\.com|coach@x\.com|Barbell Bench Press|kg|e1RM|RPE|@apexlift\.app|English/g, '').match(/[A-Za-z]{3,}/g);
    for (const tb of ['home', 'clients', 'chats', 'invite', 'account']) { await c.click(`[data-tab="${tb}"]`); await c.waitForTimeout(300); const e = await english(); check(`Arabic: ${tb} tab has no English`, !e, String(e)); }
    await c.click('[data-tab="clients"]'); await c.click(`[data-client="${CLIENT.uid}"]`);
    for (const sg of ['overview', 'workouts', 'progress']) { await c.click(`[data-seg="${sg}"]`); await c.waitForTimeout(600); const e = await english(); check(`Arabic: client ${sg} has no English`, !e, String(e)); }
    await c.click('[data-act="routine"]'); await c.waitForSelector('#coach.open');
    const b = (await c.evaluate(() => document.getElementById('coach').innerText)).replace(/Coach plan|Client One|Client|Barbell Bench Press|kg|\d+ - \d+s?/g, '').match(/[A-Za-z]{3,}/g);
    check('Arabic: the routine builder has no English (program names aside)', !b || b.every(w => /^(PPL|Push|Pull|Legs|Upper|Lower|Full|Body|Bro|Split|StrongLifts|Starting|Strength|Hypertrophy|PHUL|PHAT|GZCLP|Arnold|Classic|Beginner|Intermediate|Advanced|Power|Building)$/i.test(w)), String(b));
    if (process.env.SHOTS) await c.screenshot({ path: `${process.env.SHOTS}/coach-ar.png`, fullPage: true });
    check('coach app: no errors', !c.errors.length, c.errors.join(' | '));
    await ctx.close();
});

T('coach app: signing in with the sign-in page', async ({ browser, base }) => {
    await seedCoach();
    const p = await openAs(browser, base, 'coach.html', null);
    check('signed out: the sign-in page shows', await waitText(p, /Continue with Google/));
    await p.click('#show-email');
    await p.fill('#em', COACH.email); await p.fill('#pw', 'wrong-password');
    await p.click('#si');
    check('wrong password is explained', await waitText(p, /Wrong email or password/));
    await p.fill('#pw', PASS);
    await p.click('#si');
    check('signed in: the coach sees their clients', await waitText(p, /No clients yet/));
    check('coach app: no errors', !p.errors.length, p.errors.join(' | '));
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

// Apex Lift app (index.html), part 8 of 13: Google sign-in, cloud sync, the coach plan and presence (Firebase).
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// ☁️ CLOUD BACKUP & SYNC (optional): sign in with Google; data is kept in Firebase (Firestore).
// The phone stays the main copy and keeps working offline; the cloud mirrors it and brings it to your other phones.
// Data layout: users/{uid} = routines + settings, users/{uid}/history/{exercise} = that exercise's logs.
// Security rules (only you can read/write your data) are in firestore.rules — paste them into Firebase.
const FIREBASE_CONFIG = window.APEX_FIREBASE_CONFIG; // firebase-config.js
const FB_DIR = 'vendor/firebase-12.19.0/';
const CLOUD_KEY = 'workoutCloud_rakan_final', CLOUD_LASTUID = 'workoutCloudLastUid_rakan_final', LOCAL_UPDATED_KEY = 'workoutLocalUpdated_rakan_final';
const MAIN_KEYS = new Set([BODY_KEY, StorageManager.PLAN_KEY, StorageManager.ACTIVE_WEEK, StorageManager.START_KEY, StorageManager.REST_KEY, StorageManager.RPE_KEY, StorageManager.KEY, CUSTOM_KEY, PROFILE_KEY, READY_KEY]);
const Cloud = { err: '', status: 'off', user: null, auth: null, db: null, unsub: [], sent: {}, timer: null, flushing: false, again: false, applying: false, lastSync: 0, loading: null, tries: 0, retryTimer: null, starting: false };
const getCloudFlag = () => { const v = readJSON(CLOUD_KEY, null); return isObj(v) ? v : null; };
const loadScript = src => new Promise((ok, fail) => { const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = () => fail(new Error('Could not load ' + src)); document.head.appendChild(el); });
// Firebase is only downloaded when someone uses sign-in, so the app stays fast for everyone else
const loadFirebase = () => Cloud.loading || (Cloud.loading = (async () => {
    if (!window.firebase) await loadScript(FB_DIR + 'firebase-app-compat.js');
    // sign-in and database parts only need the first file: download both at the same time
    await Promise.all([!firebase.auth && loadScript(FB_DIR + 'firebase-auth-compat.js'), !firebase.firestore && loadScript(FB_DIR + 'firebase-firestore-compat.js')]);
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    Cloud.auth = firebase.auth(); Cloud.db = firebase.firestore();
    // tests only: on this computer with ?emu=1 the app talks to the Firebase emulators (tools/rules-test), never to the real database
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('emu')) { Cloud.auth.useEmulator('http://127.0.0.1:9099'); Cloud.db.useEmulator('127.0.0.1', 8080); }
    try { await Cloud.db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* private mode or another tab: still works online */ }
    Cloud.auth.getRedirectResult().catch(e => window.appActions.showToast(cloudErrorText(e), 'error'));
    Cloud.auth.onAuthStateChanged(u => { if (u) cloudSignedIn(u); else cloudSignedOut(); });
})().catch(e => { Cloud.loading = null; throw e; }));
const cloudErrorText = e => {
    const c = (e && e.code) || '';
    if (c === 'auth/unauthorized-domain') return t('Sign-in isn\'t available on this site yet.');
    if (c === 'auth/network-request-failed' || /load/i.test((e && e.message) || '')) return t('No internet connection. Try again when online.');
    return t('Sign-in failed. Please try again.') + (c ? ` (${c})` : '');
};
const setCloudStatus = (st, e, step) => { Cloud.status = st; Cloud.err = st === 'error' ? [((e && e.code) || '').replace(/^firestore\//, ''), step].filter(Boolean).join(', ') : ''; renderAccount(); };
const scheduleFlush = (ms = 1500) => { if (!Cloud.user) return; clearTimeout(Cloud.timer); Cloud.timer = setTimeout(cloudFlush, ms); };
// Sync looks after itself (there is no Sync button): after a failure it tries again by itself (5 s, 15 s, 1 min, then every 5 min),
// and coming back to the app or getting signal back checks that everything is running
const RETRY_MS = [5000, 15000, 60000, 300000];
const cloudRetry = () => {
    clearTimeout(Cloud.retryTimer);
    Cloud.retryTimer = setTimeout(cloudKick, RETRY_MS[Math.min(Cloud.tries, RETRY_MS.length - 1)]);
    Cloud.tries++;
};
const cloudOk = () => { Cloud.tries = 0; clearTimeout(Cloud.retryTimer); };
// Firebase loaded → first merge done → live updates on → anything not uploaded yet goes up
const cloudKick = () => {
    if (!getCloudFlag() || Cloud.starting) return;
    if (!Cloud.auth) return loadFirebase().catch(() => { setCloudStatus('offline'); cloudRetry(); });
    if (!Cloud.user) return; // Firebase is still checking who is signed in
    if (!Cloud.unsub.length) return cloudSignedIn(Cloud.user);
    if (Cloud.status === 'error') Cloud.sent = {}; // compare everything again
    cloudFlush();
};
// After a while in the background the connection can be stale (phones pause web apps): reconnect so the
// live updates catch up with changes made on your other phones
const cloudResume = async stale => {
    if (stale && Cloud.db && Cloud.unsub.length) { try { await Cloud.db.disableNetwork(); await Cloud.db.enableNetwork(); } catch (e) {} }
    cloudKick();
};
cloudTouch = key => {
    if (MAIN_KEYS.has(key)) { try { localStorage.setItem(LOCAL_UPDATED_KEY, String(Date.now())); } catch (e) {} }
    if (Cloud.user && !Cloud.applying && (MAIN_KEYS.has(key) || key === StorageManager.HIST_KEY)) scheduleFlush();
};
// What the phone has (routines + settings), in a form Firestore accepts
const collectMain = () => JSON.parse(JSON.stringify({
    plan: appData, activeWeek: currentWeekId, startDay: StorageManager.getStartDay(), rest: StorageManager.getRestSeconds(),
    showRpe: StorageManager.getShowRpe(), weights: StorageManager.get(), custom: getCustomEx(), profile: getProfile(), terms: getAgree(),
    body: getBody(), account: accountSummary(), readiness: sanitizeReadiness(getReadinessAll()), activity: activitySummary()
}));
// name, email, sign-up date, last active day, language, app version, phone type and how setup ended
// (changes at most once a day, so it doesn't cause extra uploads)
const accountSummary = () => {
    if (!Cloud.user) return null;
    const f = getCloudFlag() || {};
    return { name: (Cloud.user.displayName || f.name || '').slice(0, 100), email: (Cloud.user.email || f.email || '').slice(0, 200), createdAt: Number(f.since) || Date.now(), lastSeen: dateKey(),
        lang: LANG, appVersion: APP_VERSION, platform: platformName(), installed: isInstalled(), setup: (localStorage.getItem(SETUP_KEY) || '').slice(0, 40),
        signIn: (Cloud.user.providerData || []).some(p => p && p.providerId === 'google.com') ? 'google' : 'email', verified: Cloud.user.emailVerified === true,
        tz: (() => { try { return (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 60); } catch (e) { return ''; } })(),
        locale: String(navigator.language || '').slice(0, 20), screen: `${Math.round(screen.width)}x${Math.round(screen.height)}`,
        ref: (localStorage.getItem(REF_KEY) || '').slice(0, 30), browser: browserKind() };
};
const platformName = () => {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'desktop';
};
const isInstalled = () => { try { return navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches; } catch (e) { return false; } };
// Opened inside another app (Instagram, Facebook, Snapchat, TikTok...): those built-in browsers keep their own storage
// and often clear it when they close, so you're signed out every time (and Google blocks its sign-in there)
const IN_APP = [['Instagram', 'instagram'], ['FBAN', 'facebook'], ['FBAV', 'facebook'], ['FB_IAB', 'facebook'], ['Snapchat', 'snapchat'], ['TikTok', 'tiktok'], ['musical_ly', 'tiktok'],
    ['BytedanceWebview', 'tiktok'], ['Line/', 'line'], ['Twitter', 'x'], ['LinkedInApp', 'linkedin'], ['Pinterest', 'pinterest'], ['GSA/', 'google-app'], ['; wv)', 'webview']];
const inAppBrowser = () => { const ua = navigator.userAgent || '', m = IN_APP.find(([k]) => ua.includes(k)); return m ? m[1] : ''; };
// shown on the admin page, to tell why someone keeps getting signed out
const browserKind = () => isInstalled() ? 'installed' : inAppBrowser() ? 'in-app: ' + inAppBrowser() : 'browser';
// A short summary of the training (workout days, exercises, most-done exercises), so the admin page
// can show activity and retention by reading one document per user instead of every workout.
const activitySummary = () => {
    const h = StorageManager.getHistory(), days = new Set(), count = {}; let last = 0;
    Object.keys(h).forEach(k => {
        const list = Array.isArray(h[k]) ? h[k] : [], seen = new Set();
        list.forEach(l => { const tt = logTime(l); if (isNaN(tt)) return; const dk = dateKey(tt); days.add(dk); seen.add(dk); if (tt > last) last = tt; });
        if (seen.size && !k.startsWith('temp_')) count[k] = seen.size;
    });
    const names = exerciseNames();
    const top = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 10).map(k => ({ n: keyToName(k, names).slice(0, 80), c: count[k] }));
    return { n: days.size, ex: Object.keys(count).length, last, days: [...days].sort().slice(-180), top };
};
// Put cloud routines + settings onto this phone
const applyMain = m => {
    Cloud.applying = true;
    try {
        const plan = sanitizePlan(m.plan);
        if (plan) {
            appData = plan; StorageManager.setPlan(plan);
            currentWeekId = plan.weeks.some(w => w.id === m.activeWeek) ? m.activeWeek : plan.weeks[0].id;
            StorageManager.setActiveWeek(currentWeekId);
        }
        if (DAY_NAMES.includes(m.startDay)) StorageManager.setStartDay(m.startDay);
        StorageManager.setRestSeconds(m.rest);
        StorageManager.setShowRpe(m.showRpe === true);
        if (isObj(m.weights)) { loggedWeights = sanitizeValueMap(m.weights); StorageManager.set(loggedWeights); }
        setCustomEx(sanitizeCustomEx(m.custom));
        if (isObj(m.profile)) writeItem(PROFILE_KEY, JSON.stringify(sanitizeProfile(m.profile)));
        if (isObj(m.body)) setBody(m.body);
        if (isObj(m.readiness)) writeItem(READY_KEY, JSON.stringify({ ...sanitizeReadiness(getReadinessAll()), ...sanitizeReadiness(m.readiness) }));
        if (isObj(m.account) && Number(m.account.createdAt) > 0) { const f = getCloudFlag(); if (f && f.uid && !f.since) writeItem(CLOUD_KEY, JSON.stringify({ ...f, since: Number(m.account.createdAt) })); }
        if (isObj(m.terms) && m.terms.v === TERMS_VERSION && !getAgree()) { try { localStorage.setItem(AGREE_KEY, JSON.stringify(m.terms)); } catch (e) {} }
        setRaw(LOCAL_UPDATED_KEY, String(m.updatedAt || Date.now()));
    } finally { Cloud.applying = false; }
    refreshAfterCloud();
};
const refreshAfterCloud = () => {
    const sd = document.getElementById('setting-start-day'); if (sd) sd.value = StorageManager.getStartDay();
    const rs = document.getElementById('setting-rest'); if (rs) rs.value = String(StorageManager.getRestSeconds());
    const rp = document.getElementById('setting-rpe'); if (rp) rp.checked = StorageManager.getShowRpe();
    renderNav(); renderWorkout();
    if (window.appState.currentView === 'profile') renderProfile();
    // the missing answers arrived from another phone: this phone doesn't need to ask them
    const W = window.appState.wiz; if (W && W.mode === 'complete' && !W.done && !setupMissing().length) { W.done = true; window.appActions.closeWizard(true); }
};
// The app open in two tabs (or windows) on the same phone or computer: when the other tab saves, take its data here too,
// so this tab shows the same thing and never saves over it with an older copy.
const TAB_KEYS = [StorageManager.PLAN_KEY, StorageManager.ACTIVE_WEEK, StorageManager.KEY, StorageManager.REPS_KEY, StorageManager.HIST_KEY];
window.addEventListener('storage', e => {
    if (e.storageArea !== localStorage || !TAB_KEYS.includes(e.key)) return;
    try {
        const plan = sanitizePlan(StorageManager.getPlan());
        if (plan) appData = plan;
        const aw = StorageManager.getActiveWeek();
        currentWeekId = appData.weeks.some(w => w.id === aw) ? aw : appData.weeks[0].id;
        loggedWeights = StorageManager.get(); loggedReps = StorageManager.getReps();
        refreshAfterCloud();
    } catch (err) { console.warn('Other tab update', err); }
});
// Combine two lists of logs without duplicates (same time, weight and reps = same log)
const mergeLogs = (a, b, del) => {
    const gone = new Set(del || []), m = new Map();
    [...(a || []), ...(b || [])].forEach(l => { const g = logSig(l); if (!gone.has(g)) m.set(g, l); });
    return [...m.values()].sort((x, y) => (logTime(x) || 0) - (logTime(y) || 0)).slice(-HIST_CAP);
};
const unionDel = (a, b) => [...new Set([...(a || []), ...(b || [])])].slice(-200);
const safeDecode = id => { try { const k = decodeURIComponent(id); return safeKey(k) ? k : null; } catch (e) { return null; } };
const histPath = (uid, k) => `users/${uid}/history/${encodeURIComponent(k)}`;
const coachPath = uid => `users/${uid}/coach/plan`;

// 🧑‍🏫 COACH PLAN: the coach writes users/{uid}/coach/plan from the admin page:
//   { mode: 'add' | 'replace' | 'note', routine: {id, name, schedule}, targetId, activate, note, coach, sentAt, appliedAt }
// The phone puts the routine into the plan (a backup is made first when a routine is replaced), makes it the
// active one, then sets appliedAt so it isn't applied twice. The normal sync then takes it to the user's other phones.
const applyCoach = async (uid, c) => {
    const sentAt = Number(c.sentAt) || 0;
    if (!sentAt || Number(c.appliedAt) >= sentAt || !Cloud.user || Cloud.user.uid !== uid) return;
    const ack = () => Cloud.db.doc(coachPath(uid)).update({ appliedAt: sentAt }).catch(e => console.warn('Coach plan: could not confirm', e));
    const mine = getCoach();
    // already applied on this phone (a saved date in the future is ignored: it would block every later plan)
    if (mine && Number(mine.sentAt) >= sentAt && Number(mine.sentAt) <= Date.now() + 600000) return ack();
    // never change the plan in the middle of a workout: try again a bit later
    if (window.appState.sess) { clearTimeout(Cloud.coachTimer); Cloud.coachTimer = setTimeout(() => applyCoach(uid, c), 60000); return; }
    if (Cloud.coachBusy) return; Cloud.coachBusy = true;
    try {
        let routine = '';
        if (c.mode !== 'note') {
            const clean = sanitizePlan({ weeks: [c.routine] });
            if (!clean) return;
            const wk = clean.weeks[0];
            const target = (c.mode === 'replace' && appData.weeks.find(w => w.id === c.targetId)) || appData.weeks.find(w => w.id === wk.id)
                || (appData.weeks.length >= 5 ? appData.weeks.find(w => w.id === currentWeekId) : null);
            // a routine is about to be replaced: keep a copy so it can be restored
            if (target) { try { await cloudBackup('before-coach'); } catch (e) { console.warn('Backup before coach update failed', e); } }
            if (target) { target.name = wk.name; target.schedule = wk.schedule; }
            else appData.weeks.push(wk);
            // activate: false = keep their current routine active (a full set of 5 always activates, since the active one was replaced)
            if (c.activate !== false || !appData.weeks.some(w => w.id === currentWeekId)) currentWeekId = (target || wk).id;
            StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId);
            routine = wk.name;
        }
        writeItem(COACH_KEY, JSON.stringify({ sentAt, at: Date.now(), routine, note: cut(c.note, 1000), hidden: false }));
        await ack();
        refreshAfterCloud(); renderSidePanel();
        window.appActions.showToast(t(c.mode === 'note' ? 'Your coach sent you a message' : 'Your coach updated your routine'), 'success');
    } catch (e) { console.warn('Coach plan failed', e); }
    finally { Cloud.coachBusy = false; }
};
Object.assign(window.appActions, {
    dismissCoach: () => { const c = getCoach(); if (c) writeItem(COACH_KEY, JSON.stringify({ ...c, hidden: true })); renderWorkout(); }
});

// First time on this phone: merge the phone's workouts with the cloud's, then keep both in step
const cloudSignedIn = async user => {
    if (Cloud.starting) return; Cloud.starting = true;
    // ask the browser to keep the app's storage (the sign-in lives there) when the phone is low on space.
    // Not on Firefox, which asks with a pop-up.
    try { if (navigator.storage && navigator.storage.persist && !/Firefox/.test(navigator.userAgent)) navigator.storage.persist().catch(() => {}); } catch (e) {}
    const prevUid = localStorage.getItem(CLOUD_LASTUID);
    Cloud.user = user;
    const oldFlag = getCloudFlag() || {};
    writeItem(CLOUD_KEY, JSON.stringify({ uid: user.uid, name: user.displayName || '', email: user.email || '', photo: user.photoURL || '', since: oldFlag.uid === user.uid && oldFlag.since ? oldFlag.since : (user.metadata && Date.parse(user.metadata.creationTime)) || Date.now() }));
    setCloudStatus('syncing');
    // signed in from the welcome screen: close it; the setup questions come after the account is loaded
    const fromWelcome = welcomeOpen();
    if (fromWelcome) hideWelcome();
    try {
        const uid = user.uid;
        const [snap, hs] = await Promise.all([Cloud.db.doc(`users/${uid}`).get(), Cloud.db.collection(`users/${uid}/history`).get()]);
        const cloudHist = {}, cloudDel = {};
        const cloudReset = {};
        hs.forEach(d => { const x = d.data(), k = safeDecode(d.id); if (!k) return; if (x && Array.isArray(x.logs)) cloudHist[k] = x.logs; if (x && Array.isArray(x.del)) cloudDel[k] = x.del.map(String); if (x && Number(x.resetAt) > 0) cloudReset[k] = Number(x.resetAt); });
        const clean = sanitizeHistory(cloudHist);
        // a different account was used on this phone before: its workouts are already in that account, so start from this account's
        const switched = !!prevUid && prevUid !== uid;
        const local = switched ? {} : StorageManager.getHistory(), merged = { ...local }, del = switched ? {} : getDeleted();
        // workouts: keep everything from both sides (except records deleted on either side)
        const resets = switched ? {} : getResets();
        Object.keys(clean).forEach(k => {
            // a backup was restored on another phone after this one last synced: take the cloud's list as it is
            if ((cloudReset[k] || 0) > (resets[k] || 0)) { resets[k] = cloudReset[k]; del[k] = cloudDel[k] || []; merged[k] = clean[k]; return; }
            del[k] = unionDel(del[k], cloudDel[k]); merged[k] = mergeLogs(local[k], clean[k], del[k]);
        });
        Cloud.applying = true; StorageManager.setHistory(merged); setDeleted(del); setResets(resets); Cloud.applying = false;
        // routines + settings: the account wins on a new phone, otherwise the newest change wins
        if (snap.exists) {
            const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
            if (prevUid !== uid || (m.updatedAt || 0) > localU) applyMain(m);
        }
        Cloud.sent = {};
        Object.keys(clean).forEach(k => { Cloud.sent['h:' + k] = JSON.stringify(clean[k]); });
        setRaw(CLOUD_LASTUID, uid);
        refreshAfterCloud();
        // this account already has a plan: no need for the setup questions
        // this account finished the setup on another phone (or has workouts): no need for the setup questions here
        const sm = snap.exists ? snap.data() || {} : {}, setupDone = isObj(sm.account) && typeof sm.account.setup === 'string' && sm.account.setup && !sm.account.setup.startsWith('left:');
        if ((isObj(sm.profile) && sm.profile.goal) || setupDone || hs.size > 0) StorageManager.setOnboard();
        if (fromWelcome) window.appActions.initOnboarding();
        await cloudFlush();
        cloudSubscribe(uid);
        maybeAutoBackup();
        openPendingCode();
        window.appActions.coachCheck(true).then(openPendingCoach);
    } catch (e) { console.warn('Cloud sync failed', e); setCloudStatus('error', e, 'read'); cloudRetry(); if (fromWelcome) window.appActions.initOnboarding(); }
    finally { Cloud.starting = false; }
};
// Upload whatever changed since the last upload
const cloudFlush = async () => {
    if (!Cloud.user) return;
    if (Cloud.flushing) { Cloud.again = true; return; }
    Cloud.flushing = true; clearTimeout(Cloud.timer);
    let slow = null;
    try {
        const uid = Cloud.user.uid, ops = [];
        const main = collectMain(), mj = JSON.stringify(main);
        if (mj !== Cloud.sent.main) { ops.push(['set', `users/${uid}`, { ...main, updatedAt: Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || Date.now() }]); Cloud.sent.main = mj; }
        const h = StorageManager.getHistory();
        const del = getDeleted(), resets = getResets();
        Object.keys(h).forEach(k => { const j = JSON.stringify(h[k]); if (j !== Cloud.sent['h:' + k]) { ops.push(['set', histPath(uid, k), { logs: h[k], del: del[k] || [], resetAt: resets[k] || 0, updatedAt: Date.now() }]); Cloud.sent['h:' + k] = j; } });
        if (ops.length) {
            setCloudStatus(navigator.onLine === false ? 'offline' : 'syncing');
            // weak gym signal: the change is already saved on the phone, it just hasn't reached the cloud yet
            slow = setTimeout(() => { if (Cloud.flushing && navigator.onLine === false) setCloudStatus('offline'); }, 5000);
            for (let i = 0; i < ops.length; i += 400) {
                const b = Cloud.db.batch();
                ops.slice(i, i + 400).forEach(([op, path, data]) => op === 'set' ? b.set(Cloud.db.doc(path), JSON.parse(JSON.stringify(data))) : b.delete(Cloud.db.doc(path)));
                await b.commit(); // offline: waits here and finishes when the phone is back online
            }
        }
        Cloud.lastSync = Date.now(); cloudOk(); setCloudStatus('synced');
    } catch (e) { console.warn('Cloud upload failed', e); Cloud.sent = {}; setCloudStatus('error', e, 'save'); cloudRetry(); }
    finally { clearTimeout(slow); Cloud.flushing = false; if (Cloud.again) { Cloud.again = false; scheduleFlush(300); } }
};
// Live updates from your other phones
// 🟢 PRESENCE + VISITS (users/{uid}/presence/app): while the app is open on screen it says "I'm here" every 5 minutes (and once when it is hidden),
// so the admin page can show who is using the app right now, how many times each user opened it and for how long.
// A visit = one stretch of use; coming back after 30 minutes away starts a new one. The last 30 visits are kept.
const PRES_MS = 300000, VISIT_GAP = 30 * 60000;
const presPath = uid => `users/${uid}/presence/app`;
const presence = { timer: null, doc: null, uid: null };
const presenceBeat = async (off = false) => {
    if (!Cloud.user || (!off && document.visibilityState !== 'visible')) return;
    const uid = Cloud.user.uid, now = Date.now();
    if (presence.uid !== uid) { presence.doc = null; presence.uid = uid; }
    if (!presence.doc) { try { const snap = await Cloud.db.doc(presPath(uid)).get(); presence.doc = snap.exists ? snap.data() : {}; } catch (e) { presence.doc = {}; } }
    const p = presence.doc, recent = (Array.isArray(p.recent) ? p.recent : []).filter(v => isObj(v) && Number(v.s) > 0 && Number(v.e) >= Number(v.s)).slice(-30);
    let visits = Number(p.visits) || 0;
    const last = recent[recent.length - 1];
    if (last && now - last.e < VISIT_GAP) last.e = now;
    else if (!off) { recent.push({ s: now, e: now }); visits++; }
    presence.doc = { at: now, off, visits, recent: recent.slice(-30) };
    Cloud.db.doc(presPath(uid)).set(presence.doc).catch(e => console.warn('Presence', e));
};
const presenceStart = () => { clearInterval(presence.timer); presenceBeat(); presence.timer = setInterval(() => presenceBeat(), PRES_MS); };
const presenceStop = () => { clearInterval(presence.timer); presence.timer = null; presence.doc = null; presence.uid = null; };
document.addEventListener('visibilitychange', () => { if (Cloud.user && presence.timer) presenceBeat(document.visibilityState !== 'visible'); });

const cloudSubscribe = uid => {
    Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
    presenceStart();
    Cloud.unsub.push(Cloud.db.doc(`users/${uid}`).onSnapshot(snap => {
        if (!snap.exists || snap.metadata.hasPendingWrites) return;
        const m = snap.data(), localU = Number(localStorage.getItem(LOCAL_UPDATED_KEY)) || 0;
        if ((m.updatedAt || 0) > localU) { applyMain(m); Cloud.sent.main = JSON.stringify(collectMain()); }
    }, e => console.warn(e)));
    Cloud.unsub.push(Cloud.db.doc(coachPath(uid)).onSnapshot(snap => {
        if (snap.exists && !snap.metadata.hasPendingWrites) applyCoach(uid, snap.data() || {});
    }, e => console.warn(e)));
    Cloud.unsub.push(Cloud.db.collection(`users/${uid}/history`).onSnapshot(qs => {
        const h = StorageManager.getHistory(), del = getDeleted(), resets = getResets(); let changed = false, delChanged = false, behind = false;
        qs.docChanges().forEach(ch => {
            if (ch.doc.metadata.hasPendingWrites) return; // our own upload coming back
            const k = safeDecode(ch.doc.id); if (!k) return; // a damaged name can't stop the sync
            // removed in the cloud (account deleted elsewhere): the workouts on this phone stay
            if (ch.type === 'removed') { delete Cloud.sent['h:' + k]; return; }
            const data = ch.doc.data() || {}, logs = sanitizeHistory({ [k]: data.logs })[k] || [];
            const rr = Number(data.resetAt) || 0;
            if (rr > (resets[k] || 0)) { // restored from a backup on another phone: take it as it is
                resets[k] = rr; del[k] = Array.isArray(data.del) ? data.del.map(String) : []; delChanged = true;
                if (JSON.stringify(h[k] || null) !== JSON.stringify(logs)) { h[k] = logs; changed = true; }
                Cloud.sent['h:' + k] = JSON.stringify(logs); return;
            }
            if (Array.isArray(data.del)) { const d2 = unionDel(del[k], data.del.map(String)); if (d2.length !== (del[k] || []).length) { del[k] = d2; delChanged = true; } }
            // both lists together, so a phone that was behind can never erase workouts from another phone
            const mine = JSON.stringify(h[k] || null), next = mergeLogs(h[k], logs, del[k]);
            if (JSON.stringify(next) !== mine) { h[k] = next; changed = true; }
            Cloud.sent['h:' + k] = JSON.stringify(logs);
            if (JSON.stringify(next) !== JSON.stringify(logs)) behind = true; // the cloud is missing some of ours
        });
        if (changed || delChanged) { Cloud.applying = true; if (changed) StorageManager.setHistory(h); setDeleted(del); setResets(resets); Cloud.applying = false; }
        if (changed) refreshAfterCloud();
        if (behind) scheduleFlush();
    }, e => console.warn(e)));
};
const cloudSignedOut = () => {
    presenceStop(); cloudOk();
    if (sheetOpen('account-overlay')) window.appActions.closeAccount(); // the account page belongs to the account that left
    Cloud.unsub.forEach(u => u()); Cloud.unsub = []; Cloud.user = null; Cloud.sent = {};
    const hadAccount = !!(getCloudFlag() || {}).uid; // not a sign-in still on its way, or Firebase loading early with nobody signed in
    try { localStorage.removeItem(CLOUD_KEY); } catch (e) {}
    if (window.appActions.coachCheck) setCoachLink(null); // the coach belongs to the account that left
    setCloudStatus('off');
    // an account is needed to use the app: back to the sign-in page (workouts stay on the phone)
    if (gateOn() && hadAccount && requireSignIn()) {
        // the setup questions (if open) belong to the account that just left: close them so the sign-in page is on top
        const W = window.appState.wiz; if (W && !W.done) { W.done = true; popBack('wizard'); closeModal('onboarding-overlay', 'onboarding-box', 300); }
        showWelcome(true);
    }
};
window.addEventListener('online', () => cloudResume(true));
window.addEventListener('offline', () => { if (Cloud.user) setCloudStatus('offline'); });
// Leaving the app (home button, lock screen): upload now, because the phone pauses the app's timers in the background.
// Coming back: reconnect if it was away for a while, then make sure sync is running.
let cloudHiddenAt = 0;
document.addEventListener('visibilitychange', () => {
    if (!getCloudFlag()) return;
    if (document.visibilityState === 'hidden') { cloudHiddenAt = Date.now(); if (Cloud.user && Cloud.unsub.length) cloudFlush(); return; }
    cloudResume(cloudHiddenAt > 0 && Date.now() - cloudHiddenAt > 30000);
    if (window.appActions.coachCheck) window.appActions.coachCheck(); // removed by the coach meanwhile? (at most once a minute)
});
window.addEventListener('pageshow', e => { if (e.persisted) cloudResume(true); });

// Profile → account card
const GOOGLE_G = '<svg viewBox="0 0 48 48" class="w-5 h-5" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const renderAccount = () => {
    const el = document.getElementById('account-card'); if (!el) return;
    const flag = getCloudFlag(), u = Cloud.user || (flag && flag.uid ? flag : null);
    if (!u) {
        el.innerHTML = `<div class="glass-card p-5 border border-white/10">
                <div class="flex items-center gap-3 mb-3"><span class="w-11 h-11 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="cloud" class="w-6 h-6"></i></span>
                <div><div class="text-[16px] font-black text-white">${t('Back up & sync')}</div><div class="text-[12px] font-bold text-slate-400 leading-snug">${t('Sign in to keep your workouts safe in the cloud and use them on any phone.')}</div></div></div>
                <button data-on-click="window.appActions.cloudSignIn()" ${Cloud.status === 'loading' ? 'disabled' : ''} class="w-full py-3.5 rounded-xl bg-white text-[#1f1f1f] text-[14px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-60">${GOOGLE_G}${Cloud.status === 'loading' ? t('Signing in…') : t('Continue with Google')}</button>
                <button data-on-click="window.appActions.openEmail('in')" class="w-full mt-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] font-bold flex items-center justify-center gap-3 tap-feedback"><i data-lucide="mail" class="w-5 h-5"></i>${t('Continue with email')}</button></div>`;
    } else {
        const name = u.displayName || u.name || '', email = u.email || '', photo = u.photoURL || u.photo || '';
        // sync runs by itself: nothing is shown while it works, only when it can't
        const st = { offline: ['bg-slate-400', t('Offline')], error: ['bg-red-500', t('Sync problem')] }[Cloud.status];
        // the whole card opens Account (personal details and account settings)
        el.innerHTML = `<div class="glass-card border border-white/10">
                <button data-on-click="window.appActions.openAccount()" ${Cloud.user ? '' : 'disabled'} class="w-full px-4 py-3.5 flex items-center gap-3 text-start tap-feedback" aria-label="${esc(t('Account'))}">
                    ${avatarHTML(u, 'w-11 h-11 text-[18px]')}
                    <span class="min-w-0 flex-1">
                        <span class="block text-[16px] font-black text-white truncate leading-tight">${esc(name || email)}</span>
                        ${name && email ? `<span class="block text-[12px] font-bold text-slate-400 truncate mt-0.5">${esc(email)}</span>` : ''}
                    </span>
                    ${st ? `<span class="shrink-0 flex items-center gap-1.5 text-[12px] font-bold text-slate-400" title="${esc(Cloud.err)}"><span class="w-1.5 h-1.5 rounded-full ${st[0]}"></span><span class="max-w-[110px] truncate">${esc(st[1])}</span></span>` : ''}
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 shrink-0"></i>
                </button></div>`;
    }
    if (window.lucide) window.lucide.createIcons({ root: el });
    if (welcomeOpen()) updateWelcomeUI(); // "Signing in…" on the welcome page too
};
// Profile → Account pages
Object.assign(window.appActions, {
    openAccount: () => { if (!Cloud.user) return; renderAccountSheet(); openSheet('account-overlay', 'account-box'); pushBack('account', () => window.appActions.closeAccount()); },
    closeAccount: () => { popBack('account'); closeSheet('account-overlay', 'account-box'); },
    // Profile → Workout / App (full pages)
    openSettings: which => { const id = which === 'app' ? 'appset' : 'workset'; window.appState.settingsOpen = id; openSheet(id + '-overlay', id + '-box'); pushBack('settings', () => window.appActions.closeSettings()); },
    closeSettings: () => { const id = window.appState.settingsOpen; if (!id) return; window.appState.settingsOpen = null; popBack('settings'); closeSheet(id + '-overlay', id + '-box'); },
    closeEdit: () => { popBack('edit'); if (document.activeElement) document.activeElement.blur(); closeModal('edit-overlay', 'edit-box'); },
    editName: () => {
        if (!Cloud.user) return;
        openEdit(editHead(t('Name')) + `<form data-on-submit="event.preventDefault(); window.appActions.saveName(document.getElementById('edit-name').value)">
                <input id="edit-name" type="text" autocomplete="name" maxlength="60" value="${esc(Cloud.user.displayName || '')}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30" dir="auto" aria-label="${esc(t('Name'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
        setTimeout(() => { const i = document.getElementById('edit-name'); if (i) { i.focus(); i.select(); } }, 320);
    },
    // date of birth (the age shown comes from it): same limits as the setup
    editBirth: () => {
        const b = getBody(), n = new Date(), iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const max = iso(new Date(n.getFullYear() - MIN_AGE, n.getMonth(), n.getDate())), min = iso(new Date(n.getFullYear() - 100, 0, 1));
        openEdit(editHead(t('Date of birth')) + `<form data-on-submit="event.preventDefault(); window.appActions.saveBirth(document.getElementById('edit-birth').value)">
                <input id="edit-birth" type="date" min="${min}" max="${max}" value="${esc(b.birthDate || '')}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30 num" dir="ltr" aria-label="${esc(t('Date of birth'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
    },
    saveBirth: v => {
        const err = m => window.appActions.showToast(m, 'error');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return err(t('Enter your date of birth.'));
        const age = ageOf({ birthDate: v });
        if (age < MIN_AGE) return err(t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }));
        if (age > 100) return err(t('Check your date of birth.'));
        setBody({ ...getBody(), birthDate: v });
        window.appActions.closeEdit(); renderAccountSheet();
        window.appActions.showToast(t('Saved'));
    },
    saveName: async v => {
        const name = String(v || '').trim().slice(0, 60);
        if (!Cloud.user) return;
        if (!name) return window.appActions.showToast(t('Please enter your name.'), 'error');
        window.appActions.closeEdit();
        try {
            await Cloud.user.updateProfile({ displayName: name });
            const f = getCloudFlag(); if (f) writeItem(CLOUD_KEY, JSON.stringify({ ...f, name }));
            Cloud.sent.main = ''; scheduleFlush(300);
            renderAccount(); renderAccountSheet();
            window.appActions.showToast(t('Saved'), 'success');
        } catch (e) { window.appActions.showToast(authErrorText(e), 'error'); renderAccountSheet(); }
    }
});
Object.assign(window.appActions, {
    cloudSignIn: async () => {
        if (Cloud.signingIn) return; // a double tap opens one Google window, not two
        Cloud.signingIn = true;
        try { await window.appActions.cloudSignInOnce(); } finally { Cloud.signingIn = false; }
    },
    cloudSignInOnce: async () => {
        setCloudStatus('loading');
        try { await loadFirebase(); } catch (e) { window.appActions.showToast(t('No internet connection. Try again when online.'), 'error'); return setCloudStatus('off'); }
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        // Installed on the home screen: Google's pop-up window can't report back to the app there, so the app waited
        // forever and had to be restarted. Sign in on the full page instead (it comes back to the app when done).
        if (isInstalled()) {
            writeItem(CLOUD_KEY, JSON.stringify({ pending: true }));
            try { return await Cloud.auth.signInWithRedirect(provider); }
            catch (e) { try { localStorage.removeItem(CLOUD_KEY); } catch (x) {} window.appActions.showToast(cloudErrorText(e), 'error'); return setCloudStatus('off'); }
        }
        try { await Cloud.auth.signInWithPopup(provider); }
        catch (e) {
            // Home-screen apps and some browsers block pop-ups: use a full-page sign-in instead
            if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) {
                writeItem(CLOUD_KEY, JSON.stringify({ pending: true }));
                return Cloud.auth.signInWithRedirect(provider);
            }
            if (e.code !== 'auth/popup-closed-by-user') window.appActions.showToast(cloudErrorText(e), 'error');
            if (!Cloud.user) setCloudStatus('off');
        }
    },
    // if the first connection failed (no live updates yet), start over; otherwise just upload everything again
    cloudSignOut: () => window.appActions.showConfirm(t('Sign out?'), t('Your workouts stay on this phone. Sign in again anytime to sync.'), async () => {
        try { await Promise.race([cloudFlush(), new Promise(r => setTimeout(r, 4000))]); } catch (e) {}
        Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
        try { await Cloud.auth.signOut(); } catch (e) {}
        cloudSignedOut();
        window.appActions.showToast(t('Signed out'), 'success');
    }),
    // email accounts confirm their password first, so the account can really be deleted after its data
    cloudDelete: () => window.appActions.showConfirm(t('Delete your account?'), t('This deletes your cloud backup and your account. The workouts on this phone stay.'), () => {
        if (!Cloud.user) return;
        if (isPasswordUser()) return window.appActions.openEmail('reauth', () => window.appActions.cloudDeleteNow());
        window.appActions.cloudDeleteNow();
    }, true),
    cloudDeleteNow: async () => {
        if (!Cloud.user) return;
        setCloudStatus('syncing');
        try {
            const uid = Cloud.user.uid;
            Cloud.unsub.forEach(u => u()); Cloud.unsub = [];
            const qs = await Cloud.db.collection(`users/${uid}/history`).get(), paths = [];
            qs.forEach(d => paths.push(`users/${uid}/history/${d.id}`));
            // every account backup (and its parts) goes too
            const bs = await Cloud.db.collection(`users/${uid}/backups`).get();
            bs.forEach(d => { const n = Number((d.data() || {}).parts) || 1; for (let i = 0; i < n; i++) paths.push(`users/${uid}/backups/${d.id}/parts/${i}`); paths.push(`users/${uid}/backups/${d.id}`); });
            // your chats with coaches (every message, then the thread)
            try {
                const cs = await Cloud.db.collection(`users/${uid}/chats`).get();
                for (const c of cs.docs) { const ms = await c.ref.collection('messages').get(); ms.forEach(m => paths.push(m.ref.path)); paths.push(c.ref.path); }
            } catch (e) { console.warn('Chats', e); }
            // routines you shared with a code stop working too
            try { const ss = await Cloud.db.collection('shared').where('by', '==', uid).get(); ss.forEach(d => paths.push(`shared/${d.id}`)); } catch (e) { console.warn('Shared routines', e); }
            presenceStop();
            // leave the coach too (their client list and your link, together: the rules need both in one step)
            try { const ls = await Cloud.db.doc(`users/${uid}/coach/link`).get(); if (ls.exists) await leaveBatch(uid, (ls.data() || {}).coachId); } catch (e) { console.warn('Coach link', e); }
            paths.push(coachPath(uid), presPath(uid), `users/${uid}`);
            for (let i = 0; i < paths.length; i += 400) { const b = Cloud.db.batch(); paths.slice(i, i + 400).forEach(x => b.delete(Cloud.db.doc(x))); await b.commit(); }
            try { await Cloud.auth.currentUser.delete(); }
            catch (e) {
                if (e.code !== 'auth/requires-recent-login') throw e;
                await Cloud.auth.currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());
                await Cloud.auth.currentUser.delete();
            }
            try { localStorage.removeItem(CLOUD_LASTUID); } catch (e) {}
            cloudSignedOut();
            window.appActions.showToast(t('Account deleted'), 'success');
        } catch (e) { console.warn(e); setCloudStatus('error', e); window.appActions.showToast(cloudErrorText(e), 'error'); }
    }
});

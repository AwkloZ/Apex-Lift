// Apex Lift app (index.html), part 12 of 13: The welcome pages and sign-in gate, account backups and the one-time hints.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see app/README in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 👋 WELCOME: intro pages you swipe through, then Google sign-in (required).
// Automated tests run without the sign-in page unless they ask for it (localStorage workoutTestGate = 1).
const INTRO_KEY = 'workoutIntroSeen_rakan_final';
// ⚙️ SWITCH: the file require-sign-in.js turns this on (an account is needed to use the app).
// Delete that file and sign-in becomes optional again ("Not now" on the sign-in page).
const REQUIRE_SIGN_IN = window.APEX_REQUIRE_SIGN_IN === true;
const requireSignIn = () => { try { return REQUIRE_SIGN_IN || localStorage.getItem('workoutForceSignIn') === '1'; } catch (e) { return REQUIRE_SIGN_IN; } };
const gateOn = () => { try { return !navigator.webdriver || localStorage.getItem('workoutTestGate') === '1'; } catch (e) { return true; } };
const isSignedIn = () => { const f = getCloudFlag(); return !!(f && f.uid); };
const welcomeOpen = () => document.getElementById('welcome-overlay').classList.contains('flex');
const W_SLIDES = [
    { icon: 'dumbbell', title: 'Your training, organised', text: 'Your weekly plan, every set you lift and your progress — all in one place.', art: 'plan' },
    { icon: 'check-circle-2', title: 'Log a set in one tap', text: 'Your weights from last time are filled in. Tap ✓ after each set and the rest timer starts by itself.', art: 'sets' },
    { icon: 'trending-up', title: 'Watch yourself get stronger', text: 'The app tells you when to add weight, and shows your records and weekly volume per muscle.', art: 'chart' },
    { icon: 'shield-check', title: 'Sign in to start', text: 'Your workouts are saved to your account and kept in sync on all your phones.', art: 'gate' }
];
const welcomeArt = a => {
    if (a === 'plan') return `<div class="w-full max-w-[290px] space-y-2.5">${[['Push', '6'], ['Pull', '6'], ['Legs', '5']].map(([n, c], i) => `<div class="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 float-${i}"><span class="w-9 h-9 rounded-full ${i === 0 ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'} flex items-center justify-center text-[12px] font-bold">${(d => d.charAt(0) + d.slice(1).toLowerCase())(tDay(['SAT', 'SUN', 'MON'][i]).slice(0, 3))}</span><span class="flex-1 text-[15px] font-black text-white">${t(n)}</span><span class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: c })}</span></div>`).join('')}</div>`;
    if (a === 'sets') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-2" dir="ltr">${[['60', '10', 1], ['60', '9', 1], ['60', '8', 0]].map(([w, r, d], i) => `<div class="grid grid-cols-[28px_1fr_1fr_44px] gap-2 items-center"><span class="w-7 h-7 rounded-full ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[12px] font-bold flex items-center justify-center">${i + 1}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-[#d4af37]">${w}</span><span class="h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-[15px] font-black text-white">${r}</span><span class="h-10 rounded-lg flex items-center justify-center ${d ? 'bg-[#22c55e] text-black' : 'bg-white/5 border border-white/10 text-slate-400'} ${i === 1 ? 'pop-loop' : ''}"><i data-lucide="check" class="w-5 h-5"></i></span></div>`).join('')}<div class="mt-1 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/25 px-3 py-2 flex items-center gap-2 text-[#22c55e] text-[12px] font-bold"><i data-lucide="timer" class="w-4 h-4"></i>${t('Rest')} <span class="text-white text-[16px]">1:30</span></div></div>`;
    if (a === 'chart') return `<div class="w-full max-w-[290px] rounded-2xl bg-white/[0.04] border border-white/10 p-4"><div class="flex items-center justify-between mb-2"><span class="text-[13px] font-bold text-white ex-name">Bench Press</span><span class="text-[12px] font-bold text-[#22c55e]" dir="ltr">+12.5kg</span></div><svg viewBox="0 0 260 110" class="w-full h-auto" dir="ltr"><defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d4af37" stop-opacity=".35"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></linearGradient></defs><path d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18 L255 110 L5 110 Z" fill="url(#wg)"/><path class="draw-line" d="M5 95 L45 85 L85 80 L125 62 L165 58 L205 40 L255 18" fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="255" cy="18" r="5" fill="#d4af37"/></svg><div class="mt-2 inline-flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-md border text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20"><i data-lucide="arrow-up-circle" class="w-3 h-3"></i>${t('Add weight:')} <span dir="ltr">62.5kg × 8</span></div></div>`;
    return `<div class="relative w-28 h-28 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center glow-ring"><i data-lucide="cloud" class="w-14 h-14 text-[#d4af37]"></i></div>`;
};
let welcomeIdx = 0;
const renderWelcome = () => {
    const box = document.getElementById('welcome-slides');
    const review = isSignedIn();
    box.innerHTML = W_SLIDES.map(sl => review && sl.art === 'gate' ? { ...sl, title: 'Please review and agree', text: 'To keep using Apex Lift, please agree to our Terms of Use and Privacy Policy.' } : sl).map(sl => `<section class="w-full shrink-0 snap-center flex flex-col items-center justify-center px-7 text-center gap-7" dir="${isAR ? 'rtl' : 'ltr'}">
            ${welcomeArt(sl.art)}
            <div><h2 class="text-[28px] font-black text-white leading-tight mb-3">${t(sl.title)}</h2><p class="text-[15px] font-bold text-slate-400 leading-relaxed max-w-[320px] mx-auto">${t(sl.text)}</p></div>
            ${sl.art === 'gate' ? '<div id="welcome-gate" class="w-full max-w-[340px]"></div>' : ''}
        </section>`).join('');
    const lang = document.getElementById('welcome-lang');
    lang.textContent = isAR ? 'English' : 'العربية';
    lang.onclick = () => window.appActions.setLanguage(isAR ? 'en' : 'ar');
    if (window.lucide) window.lucide.createIcons({ root: document.getElementById('welcome-overlay') });
    updateWelcomeUI();
};
const updateWelcomeUI = () => {
    const last = welcomeIdx === W_SLIDES.length - 1, loading = Cloud.status === 'loading';
    document.getElementById('welcome-dots').innerHTML = W_SLIDES.map((_, i) => `<span class="h-2 rounded-full transition-all duration-300 ${i === welcomeIdx ? 'w-6 bg-[#d4af37]' : 'w-2 bg-white/20'}"></span>`).join('');
    const gate = document.getElementById('welcome-gate');
    // the Terms and Privacy Policy are agreed in a pop-up after choosing Google or email (see needAgree)
    if (gate) gate.innerHTML = `${isSignedIn()
            ? `<button id="welcome-continue" onclick="window.appActions.welcomeContinue()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback disabled:opacity-40 transition-opacity">${t('Continue')}</button>`
            : `<button id="welcome-google" onclick="window.appActions.welcomeSignIn()" ${loading ? 'disabled' : ''} class="w-full py-4 rounded-2xl bg-white text-[#1f1f1f] text-[15px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-40 transition-opacity">${GOOGLE_G}${loading ? t('Signing in…') : t('Continue with Google')}</button>
                   <button id="welcome-email" onclick="window.appActions.openEmail('in')" ${loading ? 'disabled' : ''} class="w-full mt-2.5 py-4 rounded-2xl bg-white/5 border border-white/15 text-white text-[15px] font-bold flex items-center justify-center gap-3 tap-feedback disabled:opacity-40 transition-opacity"><i data-lucide="mail" class="w-5 h-5"></i>${t('Continue with email')}</button>`}
               <p class="text-[12px] font-bold text-slate-400 text-center mt-4"><a href="terms.html" target="_blank" rel="noopener" class="underline underline-offset-2">${t('Terms of Use')}</a> · <a href="privacy.html" target="_blank" rel="noopener" class="underline underline-offset-2">${t('Privacy Policy')}</a></p>`;
    if (gate && !isSignedIn() && inAppBrowser()) gate.insertAdjacentHTML('afterbegin', inAppNoteHTML());
    if (gate && !isSignedIn() && !requireSignIn()) gate.insertAdjacentHTML('beforeend', `<button id="welcome-later" onclick="window.appActions.welcomeLater()" class="w-full mt-3 py-3 text-[13px] font-bold text-slate-400 tap-feedback">${t('Not now')}</button>`);
    document.getElementById('welcome-actions').innerHTML = last ? '' : `<div class="flex gap-3"><button onclick="window.appActions.welcomeGo(${W_SLIDES.length - 1})" class="px-5 py-4 rounded-2xl text-[13px] font-bold text-slate-400 tap-feedback">${t('Skip')}</button><button onclick="window.appActions.welcomeGo(${welcomeIdx + 1})" class="flex-1 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button></div>`;
    if (window.lucide) window.lucide.createIcons({ root: document.getElementById('welcome-overlay') });
};
// inside another app's browser: how to open Apex Lift in the phone's real browser, so the sign-in is kept
const inAppNoteHTML = () => {
    const ios = platformName() === 'ios', url = location.origin + location.pathname;
    const btn = 'flex-1 min-h-[44px] px-3 whitespace-nowrap rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-bold flex items-center justify-center gap-2 tap-feedback';
    return `<div class="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-start" role="note">
            <div class="flex items-start gap-3"><i data-lucide="triangle-alert" class="w-5 h-5 text-slate-300 shrink-0 mt-0.5"></i>
                <div><p class="text-[13px] font-bold text-white leading-snug">${t('Open Apex Lift in your browser')}</p>
                <p class="text-[12px] font-bold text-slate-400 leading-snug mt-1">${t(ios ? "You're inside another app, which signs you out when it closes. Tap ••• or the share button, then Open in Safari." : "You're inside another app, which signs you out when it closes. Open Apex Lift in Chrome to stay signed in.")}</p></div></div>
            <div class="flex gap-2 mt-3">
                ${ios ? '' : `<a href="intent://${esc(location.host + location.pathname)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end" class="${btn}"><i data-lucide="external-link" class="w-4 h-4"></i>${t('Open in Chrome')}</a>`}
                <button type="button" onclick="window.appActions.copyAppLink()" class="${btn}"><i data-lucide="copy" class="w-4 h-4"></i>${t('Copy link')}</button>
            </div></div>`;
};
Object.assign(window.appActions, {
    copyAppLink: async () => {
        const url = location.origin + location.pathname;
        try { await navigator.clipboard.writeText(url); window.appActions.showToast(t('Link copied'), 'success'); }
        catch (e) { window.prompt(t('Copy link'), url); }
    }
});
const showWelcome = (toLast = false) => {
    const o = document.getElementById('welcome-overlay');
    if (!welcomeOpen()) { o.classList.remove('hidden'); o.classList.add('flex'); welcomeIdx = 0; renderWelcome(); }
    if (toLast) window.appActions.welcomeGo(W_SLIDES.length - 1, true);
    // get the sign-in ready while the welcome pages are read: tapping Google then opens its window straight away
    // (downloading it after the tap took seconds, and some phones then block or lose Google's window)
    if (!Cloud.auth && navigator.onLine !== false) setTimeout(() => loadFirebase().catch(() => {}), 1500);
};
const hideWelcome = () => {
    const o = document.getElementById('welcome-overlay'); if (!welcomeOpen()) return;
    try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
    o.classList.add('fade-out'); setTimeout(() => { o.classList.add('hidden'); o.classList.remove('flex', 'fade-out'); uncoverApp(); }, 350);
};
// require-sign-in.js covers the app until you are signed in: take the cover away
const uncoverApp = () => document.documentElement.classList.remove('apex-gate');
document.getElementById('welcome-slides').addEventListener('scroll', e => {
    const el = e.currentTarget, i = Math.round(Math.abs(el.scrollLeft) / Math.max(1, el.clientWidth));
    if (i !== welcomeIdx) { welcomeIdx = Math.max(0, Math.min(W_SLIDES.length - 1, i)); updateWelcomeUI(); }
}, { passive: true });

// 💾 ACCOUNT BACKUPS: dated copies of everything, kept in your account, so a mistake can be undone
const BK_KEEP = 10, BK_CHUNK = 400000, BK_AUTO_MS = 20 * 3600000;
const bkPath = uid => `users/${uid}/backups`;
const countWorkouts = h => { const days = new Set(); Object.values(h).forEach(list => (list || []).forEach(l => { const tt = logTime(l); if (!isNaN(tt)) days.add(dateKey(tt)); })); return days.size; };
// (withTimeout, above: a request the person waits for gives up instead of spinning forever on bad gym signal)
// Several callers at the same moment (Backups page opened + auto backup) share one download instead of each asking Firestore
let backupsReq = null;
const listBackups = () => backupsReq || (backupsReq = (async () => {
    const qs = await withTimeout(Cloud.db.collection(bkPath(Cloud.user.uid)).get()), out = [];
    qs.forEach(d => { const x = d.data() || {}; if (Number(x.createdAt) > 0) out.push({ id: d.id, ...x }); });
    return out.sort((a, b) => b.createdAt - a.createdAt);
})().finally(() => { backupsReq = null; }));
const deleteBackup = async b => {
    const uid = Cloud.user.uid, batch = Cloud.db.batch();
    for (let i = 0; i < (b.parts || 1); i++) batch.delete(Cloud.db.doc(`${bkPath(uid)}/${b.id}/parts/${i}`));
    batch.delete(Cloud.db.doc(`${bkPath(uid)}/${b.id}`));
    await batch.commit();
};
// keep: a backup id that must not be cleaned up (the one being restored right now)
const cloudBackup = async (kind, keep) => {
    if (!Cloud.user) throw new Error('signed out');
    const uid = Cloud.user.uid, h = StorageManager.getHistory();
    const json = JSON.stringify({ v: 1, main: collectMain(), history: h, deleted: getDeleted() }), id = String(Date.now());
    const parts = []; for (let i = 0; i < json.length; i += BK_CHUNK) parts.push(json.slice(i, i + BK_CHUNK));
    const batch = Cloud.db.batch();
    parts.forEach((d, i) => batch.set(Cloud.db.doc(`${bkPath(uid)}/${id}/parts/${i}`), { d }));
    batch.set(Cloud.db.doc(`${bkPath(uid)}/${id}`), { createdAt: Date.now(), kind, parts: parts.length, workouts: countWorkouts(h), exercises: Object.keys(h).filter(k => (h[k] || []).length).length, routines: appData.weeks.length, size: json.length });
    await batch.commit();
    // keep the newest 10 automatic and 10 other copies
    try {
        const all = await listBackups(), auto = all.filter(b => b.kind === 'auto'), other = all.filter(b => b.kind !== 'auto');
        await Promise.all([...auto.slice(BK_KEEP), ...other.slice(BK_KEEP)].filter(b => b.id !== keep).map(deleteBackup));
    } catch (e) { console.warn('Backup clean-up failed', e); }
    return id;
};
// once a day, after the first sync
const maybeAutoBackup = async () => {
    try {
        if (!Cloud.user) return;
        const h = StorageManager.getHistory(); if (!Object.values(h).some(l => (l || []).length)) return;
        const last = (await listBackups()).find(b => b.kind === 'auto');
        if (!last || Date.now() - last.createdAt > BK_AUTO_MS) await cloudBackup('auto');
    } catch (e) { console.warn('Auto backup failed', e); }
};
const loadBackup = async id => {
    const uid = Cloud.user.uid, meta = (await withTimeout(Cloud.db.doc(`${bkPath(uid)}/${id}`).get())).data() || {};
    // all parts at once, not one after the other
    const n = Math.min(30, Number(meta.parts) || 1);
    const parts = await withTimeout(Promise.all(Array.from({ length: n }, (_, i) => Cloud.db.doc(`${bkPath(uid)}/${id}/parts/${i}`).get())), 30000);
    return JSON.parse(parts.map(p => (p.data() || {}).d || '').join(''));
};
const restoreSnapshot = data => {
    if (!isObj(data) || !isObj(data.main)) throw new Error('Backup is damaged');
    applyMain({ ...data.main, updatedAt: Date.now() });
    const cur = StorageManager.getHistory(), snap = sanitizeHistory(data.history), del = isObj(data.deleted) ? data.deleted : {}, resets = getResets(), now = Date.now();
    // the copy wins everywhere: every exercise gets a new reset time, exercises added later are emptied
    Object.keys(cur).forEach(k => { if (!(k in snap)) snap[k] = []; });
    Object.keys(snap).forEach(k => { resets[k] = now; if (!Array.isArray(del[k])) del[k] = []; });
    Cloud.applying = true; StorageManager.setHistory(snap); setDeleted(del); setResets(resets); Cloud.applying = false;
    loggedWeights = StorageManager.get();
    refreshAfterCloud();
    Cloud.sent = {}; return cloudFlush();
};
const kindLabel = k => k === 'auto' ? t('Automatic') : k === 'before-restore' ? t('Before restore') : k === 'before-import' ? t('Before import') : k === 'before-coach' ? t('Before coach update') : t('Manual');
let backupsDraw = 0;
const renderBackups = async () => {
    const list = document.getElementById('backups-list'), mine = ++backupsDraw;
    list.innerHTML = `<div class="px-5" role="status" aria-label="${esc(t('Loading…'))}">${'<div class="flex items-center gap-3 py-3.5 border-b border-white/5"><span class="skeleton w-10 h-10 shrink-0" style="border-radius:9999px"></span><span class="flex-1 space-y-2"><span class="skeleton block h-3.5" style="width:40%;border-radius:6px"></span><span class="skeleton block h-3" style="width:60%;border-radius:6px"></span></span><span class="skeleton w-16 h-8 shrink-0" style="border-radius:8px"></span></div>'.repeat(3)}</div>`;
    try {
        const all = await listBackups();
        if (mine !== backupsDraw) return; // a newer refresh started meanwhile: let that one draw
        if (!all.length) { list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-slate-400">${t('No backups yet. Tap Back up now to make the first one.')}</div>`; return; }
        list.innerHTML = all.map(b => `<div class="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
                <span class="w-10 h-10 rounded-full ${b.kind === 'auto' ? 'bg-white/5 text-slate-300' : 'bg-[#d4af37]/15 text-[#d4af37]'} flex items-center justify-center shrink-0"><i data-lucide="${b.kind === 'auto' ? 'clock' : b.kind === 'before-restore' || b.kind === 'before-import' ? 'rotate-ccw' : 'save'}" class="w-5 h-5"></i></span>
                <div class="flex-1 min-w-0"><div class="text-[14px] font-black text-white">${esc(fmtDate(b.createdAt, true))}</div><div class="text-[12px] font-bold text-slate-400">${esc(kindLabel(b.kind))} · ${t('{n} workouts', { n: Number(b.workouts) || 0 })} · ${t('{n} exercises', { n: Number(b.exercises) || 0 })}</div></div>
                <button onclick="window.appActions.restoreBackup(${jsArg(b.id)}, ${jsArg(fmtDate(b.createdAt, true))})" class="shrink-0 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[12px] font-bold text-white tap-feedback">${t('Restore')}</button>
            </div>`).join('');
        if (window.lucide) window.lucide.createIcons({ root: list });
    } catch (e) {
        console.warn(e);
        if (mine !== backupsDraw) return;
        list.innerHTML = `<div class="p-8 text-center text-[13px] font-bold text-red-400">${e && /permission/i.test(e.code || '') ? t('Backup isn\'t available right now. Try again later.') : t('Could not load backups. Check your connection.')}</div>`;
    }
};

// 💡 HINTS: one small tip per screen for new users, shown once, pointing at the thing it explains
const HINTS_KEY = 'workoutHints_rakan_final';
let hintBox = null;
const hintSeen = id => !!(readJSON(HINTS_KEY, {}) || {})[id];
const hintBlocked = () => welcomeOpen() || ['onboarding-overlay', 'custom-confirm-overlay', 'summary-overlay', 'picker-overlay', 'exedit-overlay', 'swapsetup-overlay'].some(id => { const o = document.getElementById(id); return o && o.classList.contains('flex'); });
const closeHint = () => {
    if (!hintBox) return;
    const { el, target, id } = hintBox; hintBox = null;
    try { const m = readJSON(HINTS_KEY, {}) || {}; m[id] = 1; localStorage.setItem(HINTS_KEY, JSON.stringify(m)); } catch (e) {}
    if (target) target.classList.remove('hint-ring');
    el.classList.add('opacity-0'); setTimeout(() => el.remove(), 250);
};
// another tab opened: take the tip away without marking it seen (it shows again next time on its own screen)
const dropHint = () => { if (!hintBox) return; const { el, target } = hintBox; hintBox = null; if (target) target.classList.remove('hint-ring'); el.remove(); };
const hint = (id, sel, text, delay = 650) => {
    if (!gateOn() && !localStorage.getItem('workoutTestHints')) return; // automated tests: no hints unless asked
    if (hintSeen(id) || hintBox) return;
    setTimeout(() => {
        if (hintSeen(id) || hintBox || hintBlocked()) return;
        const target = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!target) return;
        const r = target.getBoundingClientRect(); if (!r.width || r.top < 0 || r.bottom > window.innerHeight) return;
        // only when the thing is really on screen (not covered by a sheet or pop-up)
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20));
        if (!top || !(target === top || target.contains(top))) return;
        const el = document.createElement('div'), below = r.bottom + 150 < window.innerHeight;
        el.className = 'fixed z-[9600] max-w-[300px] rounded-2xl bg-[#1a1a1a] border border-[#d4af37]/50 shadow-[0_15px_40px_rgba(0,0,0,0.7)] p-4 transition-opacity duration-200 hint-in';
        el.setAttribute('dir', isAR ? 'rtl' : 'ltr');
        el.innerHTML = `<div class="flex items-start gap-2.5"><i data-lucide="lightbulb" class="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5"></i><p class="text-[13px] font-bold text-white leading-snug flex-1">${esc(text)}</p></div><div class="flex justify-end mt-2.5"><span class="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-[12px] font-extrabold">${t('Got it')}</span></div>`;
        document.body.appendChild(el);
        const w = el.offsetWidth, left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2));
        el.style.left = left + 'px';
        el.style.top = below ? (r.bottom + 12) + 'px' : Math.max(12, r.top - el.offsetHeight - 12) + 'px';
        if (window.lucide) window.lucide.createIcons({ root: el });
        target.classList.add('hint-ring');
        hintBox = { el, target, id };
        // any tap closes the tip (and still does what it was meant to)
        setTimeout(() => document.addEventListener('pointerdown', closeHint, { once: true, capture: true }), 50);
    }, delay);
};
const todayHints = () => {
    hint('today-ex', '#workout-container .ex-card', t('Tap an exercise to see its details and start it.'));
    if (hintSeen('today-ex')) hint('today-days', '#today-week', t('Tap a day, or swipe left or right, to see another day of your plan.'));
};

Object.assign(window.appActions, {
    welcomeGo: (i, instant = false) => {
        const box = document.getElementById('welcome-slides');
        welcomeIdx = Math.max(0, Math.min(W_SLIDES.length - 1, i));
        box.scrollTo({ left: welcomeIdx * box.clientWidth, behavior: instant ? 'auto' : 'smooth' });
        updateWelcomeUI();
    },
    // Terms of Use + Privacy Policy pop-up, shown once after choosing Google or email (or Continue, when a new
    // version needs agreeing). Agree runs the chosen sign-in straight away, in the same tap (so Google's window can open).
    needAgree: next => {
        if (getAgree()) return next();
        window.appState.agreeNext = next;
        const link = (href, txt) => `<a href="${href}" target="_blank" rel="noopener" class="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-white tap-feedback">${txt}<i data-lucide="arrow-up-right" class="w-4 h-4 text-slate-400 shrink-0"></i></a>`;
        const box = document.getElementById('agree-box');
        box.innerHTML = `<div class="text-center" dir="${isAR ? 'rtl' : 'ltr'}">
                <span class="w-14 h-14 mx-auto mb-4 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center"><i data-lucide="shield-check" class="w-7 h-7"></i></span>
                <h3 id="agree-title" class="text-xl font-black text-white mb-2">${t('Before you continue')}</h3>
                <p class="text-[13px] font-bold text-slate-400 leading-relaxed mb-5">${t('Review the Terms of Use and Privacy Policy to continue.')}</p>
                <div class="space-y-2 mb-5 text-start">${link('terms.html', t('Terms of Use'))}${link('privacy.html', t('Privacy Policy'))}</div>
                <button id="agree-yes" onclick="window.appActions.agreeYes()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-extrabold tap-feedback">${t('I agree, continue')}</button>
                <button onclick="window.appActions.agreeNo()" class="w-full mt-2 py-3 text-[13px] font-bold text-slate-400 tap-feedback">${t('Cancel')}</button>
            </div>`;
        if (window.lucide) window.lucide.createIcons({ root: box });
        const o = document.getElementById('agree-overlay');
        if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('agree-overlay', 'agree-box'); pushBack('agree', () => window.appActions.agreeNo()); }
    },
    agreeYes: () => {
        try { localStorage.setItem(AGREE_KEY, JSON.stringify({ v: TERMS_VERSION, at: Date.now() })); } catch (e) {}
        const next = window.appState.agreeNext; window.appState.agreeNext = null;
        popBack('agree'); closeModal('agree-overlay', 'agree-box');
        if (next) next();
    },
    agreeNo: () => { window.appState.agreeNext = null; popBack('agree'); closeModal('agree-overlay', 'agree-box'); },
    // body weight (Profile and Progress → Body); everything else in Your profile is set in the setup
    // only body weight can change after the setup; returns true when it was saved
    setAbout: (field, value) => {
        if (field !== 'weightKg') { window.appActions.showToast(t("This can't be changed."), 'error'); return false; }
        const b = getBody(), w = parseFloat(latinDigits(String(value)).trim().replace(/[\u066B\u060C,]/g, '.'));
        if (!(w >= 25 && w <= 350)) { window.appActions.showToast(t('Enter your weight in kg (25–350).'), 'error'); renderAccountSheet(); return false; }
        b.weightKg = Math.round(w * 10) / 10;
        b.log = [...(b.log || []).filter(x => dateKey(x.t) !== dateKey()), { t: Date.now(), kg: b.weightKg }];
        setBody(b);
        return true;
    },
    welcomeLater: () => { if (requireSignIn() && !isSignedIn()) return; hideWelcome(); window.appActions.initOnboarding(); },
    welcomeContinue: () => {
        if (!getAgree()) return window.appActions.needAgree(() => window.appActions.welcomeContinue());
        hideWelcome(); window.appActions.initOnboarding();
        if (Cloud.user) { Cloud.sent.main = ''; scheduleFlush(300); } // save the agreement to the account
    },
    welcomeSignIn: () => {
        if (navigator.onLine === false) return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error');
        window.appActions.needAgree(() => window.appActions.cloudSignIn());
    },
    openBackups: () => { if (!Cloud.user) return; openSheet('backups-overlay', 'backups-box'); pushBack('backups', () => window.appActions.closeBackups()); renderBackups(); },
    closeBackups: () => { popBack('backups'); closeSheet('backups-overlay', 'backups-box'); },
    backupNow: async () => {
        const b = document.getElementById('backups-now'); if (b.disabled) return;
        b.disabled = true; b.classList.add('opacity-60');
        try { await cloudBackup('manual'); window.appActions.showToast(t('Backup saved to your account'), 'success'); renderBackups(); }
        catch (e) { console.warn(e); window.appActions.showToast(e && /permission/i.test(e.code || '') ? t('Backup isn\'t available right now. Try again later.') : t('Could not save the backup. Check your connection.'), 'error'); }
        finally { b.disabled = false; b.classList.remove('opacity-60'); }
    },
    restoreBackup: (id, label) => window.appActions.showConfirm(t('Restore this backup?'), t('Your routines, settings and workouts go back to {date}, on all your phones. A copy of how things are now is saved first.', { date: label }), async () => {
        if (Cloud.restoring) return; // one restore at a time, even after a double tap
        Cloud.restoring = true;
        try {
            window.appActions.showToast(t('Restoring…'), 'success');
            // download the chosen copy and save "how things are now" at the same time
            // (the clean-up after that save must not delete the copy being restored)
            const [data] = await Promise.all([loadBackup(id), cloudBackup('before-restore', id)]);
            await restoreSnapshot(data);
            window.appActions.closeBackups();
            window.appActions.showToast(t('Backup restored'), 'success');
        } catch (e) { console.warn(e); window.appActions.showToast(t('Could not restore. Check your connection.'), 'error'); }
        finally { Cloud.restoring = false; }
    }, true)
});

const themeChoice = () => { try { const v = localStorage.getItem('workoutTheme_rakan_final'); return ['light', 'system'].includes(v) ? v : 'dark'; } catch (e) { return 'dark'; } };
const phoneLight = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
const applyTheme = () => {
    const v = themeChoice(), light = v === 'light' || (v === 'system' && !!phoneLight && phoneLight.matches);
    if (light) document.documentElement.setAttribute('data-theme', 'light'); else document.documentElement.removeAttribute('data-theme');
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f3f0' : '#12100d');
};
if (phoneLight && phoneLight.addEventListener) phoneLight.addEventListener('change', () => { if (themeChoice() === 'system') applyTheme(); });
// Apply the language to the fixed parts of the page (index.html) and set right-to-left for Arabic

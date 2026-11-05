// Apex Lift app (index.html), part 13 of 13: Arabic digits, then starting the app (first screen, settings, sign-in, offline copy). Loaded last.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🔢 ARABIC DIGITS: in Arabic, numbers shown on screen use ٠١٢٣٤٥٦٧٨٩ and the Arabic decimal mark (like iOS).
// Done on the page itself, so every screen, chart and toast is covered; stored data and typed boxes keep 0-9.
// Routine codes (.code-big, .latin-num) stay in 0-9 so they can be read out and typed in.
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
// also "60kg" → "60 كجم": units written in the code are translated where they are shown
const toArDigits = str => str.replace(/(\d)\s?kg\b/g, '$1 كجم').replace(/\bkg\b/g, 'كجم').replace(/(\d)\.(?=\d)/g, '$1٫').replace(/\d/g, d => AR_DIGITS[d]);
const arDigitsIn = root => {
    if (!isAR || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => /\d|\bkg\b/.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest('script, style, textarea, .code-big, .latin-num')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    const list = []; while (w.nextNode()) list.push(w.currentNode);
    list.forEach(n => { n.nodeValue = toArDigits(n.nodeValue); });
};
if (isAR) {
    new MutationObserver(ms => ms.forEach(m => { if (m.type === 'characterData') arDigitsIn(m.target.parentNode); else m.addedNodes.forEach(n => n.nodeType === 3 ? arDigitsIn(n.parentNode) : n.nodeType === 1 && arDigitsIn(n)); }))
        .observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener('DOMContentLoaded', () => arDigitsIn(document.body));
    arDigitsIn(document.body);
}
const applyStaticLanguage = () => {
    document.documentElement.lang = LANG;
    // Arabic keeps the English layout (nothing moves); only the text lines start from the right (style.css)
    document.documentElement.dir = 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-label]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nLabel)));
    document.querySelectorAll('#setting-start-day option').forEach(o => { o.textContent = tDay(o.value); });
    const ls = document.getElementById('setting-lang'); if (ls) ls.value = LANG;
    const th = document.getElementById('setting-theme'); if (th) th.value = themeChoice();
    const ver = document.getElementById('app-version'); if (ver) ver.textContent = APP_VERSION;
};
applyStaticLanguage();
window.appActions.switchTab('today');
enableSwipeDown(document.getElementById('picker-box'), () => window.appActions.closePicker());
enableEdgeBack(document.getElementById('history-modal-box'), () => window.appActions.closeHistoryModal());
// full pages: swipe from the left edge = back
enableEdgeBack(document.getElementById('workset-box'), () => window.appActions.closeSettings());
enableEdgeBack(document.getElementById('appset-box'), () => window.appActions.closeSettings());
enableEdgeBack(document.getElementById('account-box'), () => window.appActions.closeAccount());
enableEdgeBack(document.getElementById('backups-box'), () => window.appActions.closeBackups());
enableEdgeBack(document.getElementById('chat-box'), () => window.appActions.closeChat());
enableEdgeBack(document.getElementById('active-workout-box'), () => window.appActions.minimizeSession());
enableSwipeDown(document.getElementById('programs-box'), () => window.appActions.closePrograms());
enableSwipeDown(document.getElementById('code-box'), () => window.appActions.closeCodeSheet());
enableSwipeDown(document.getElementById('ai-box'), () => window.appActions.closeAI());
enableDaySwipe(document.querySelector('.scrollable-content')); // the whole Today screen, so rest days (one small card) swipe too
// An unfinished Log/Focus session (e.g. the phone closed the app during rest) comes back minimized
(() => {
    const dr = readJSON(SESSION_KEY, null);
    const ok = isObj(dr) && Array.isArray(dr.exercises) && dr.exercises.length && Array.isArray(dr.rows)
        && typeof dr.startedAt === 'number' && Date.now() - dr.startedAt < 72 * 3600000 && getActiveSchedule().some(d => d.id === dr.dayId);
    if (!ok) { clearSessionDraft(); return; }
    dr.exercises = dr.exercises.filter(isObj).slice(0, 40).map(x => ({ k: toStr(x.k), name: toStr(x.name), muscle: toStr(x.muscle), sets: parseInt(x.sets) || 1, repsStr: toStr(x.repsStr), timed: isTimed(toStr(x.repsStr)), offset: parseInt(x.offset) || 0, pw: toStr(x.pw), pr: parseInt(x.pr) || 8, sg: isObj(x.sg) && SUGG[x.sg.type] ? { type: x.sg.type, w: parseFloat(x.sg.w) || 0, r: parseInt(x.sg.r) || 0 } : null }));
    dr.rows = dr.rows.filter(isObj).slice(0, 200).map(r => ({ e: parseInt(r.e) || 0, w: toStr(r.w), r: toStr(r.r), rpe: toStr(r.rpe), done: r.done === true }));
    dr.title = toStr(dr.title);
    if (typeof dr.weekId !== 'string' || !appData.weeks.some(w => w.id === dr.weekId)) dr.weekId = currentWeekId;
    window.appActions.startWorkout(dr.dayId, dr);
    // forgot to tap Finish yesterday? keep the sets and remind instead of throwing them away
    if (Date.now() - dr.startedAt > 6 * 3600000) setTimeout(() => window.appActions.showToast(t('You have an unfinished workout. Finish it to save your sets.'), 'error'), 800);
})();
document.getElementById('setting-start-day').value = StorageManager.getStartDay();
const rpeEl = document.getElementById('setting-rpe');
if (rpeEl) rpeEl.checked = StorageManager.getShowRpe();
const restEl = document.getElementById('setting-rest');
if (restEl) restEl.value = String(StorageManager.getRestSeconds());

renderAccount();
cloudKick();
// First launch (or signed out): intro pages + sign-in. Signed in: straight to the app (setup questions if needed).
setTimeout(() => {
    const introSeen = localStorage.getItem(INTRO_KEY) === '1', pending = !!(getCloudFlag() || {}).pending;
    // back from Google's full-page sign-in: the sign-in page shows "Signing in…" until the account is loaded
    if (pending && Cloud.status === 'off') setCloudStatus('loading');
    if (gateOn() && ((!isSignedIn() && (requireSignIn() || !introSeen)) || (isSignedIn() && !getAgree()))) showWelcome(introSeen || isSignedIn() || pending);
    else { uncoverApp(); window.appActions.initOnboarding(); }
    openAuthLink();
}, 300);
// Coming back to the app on a new day: jump to today (unless a workout is open)
let lastToday = getTodayId();
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (window.appState.sess) return;
    const now = getTodayId();
    if (now !== lastToday) { lastToday = now; activeDay = now; renderNav(); renderWorkout(); }
});
// 📶 OFFLINE SUPPORT: save a copy of the app on the phone (see sw.js)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline mode unavailable:', err)));
}

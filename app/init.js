// Apex Lift app (index.html), part 2 of 13: Start-up state, the exercise picker data, the phone's back button, swipe gestures, screen wake lock and the workout session draft.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// ⚙️ 3. APP INITIALIZATION
const savedPlan = StorageManager.getPlan();
let appData = sanitizePlan(savedPlan);
if (!appData) {
    // Saved plan missing or unusable: keep a copy of the unusable one, then start from the default plan
    if (savedPlan !== null) { try { localStorage.setItem(StorageManager.PLAN_KEY + '_damaged', JSON.stringify(savedPlan)); } catch (e) {} }
    appData = { weeks: [{ id: 'w_' + Date.now(), name: t('Week 1'), schedule: JSON.parse(JSON.stringify(defaultWorkoutData)) }] };
}
let currentWeekId = StorageManager.getActiveWeek() || appData.weeks[0].id;
if (!appData.weeks.find(w => w.id === currentWeekId)) { currentWeekId = appData.weeks[0].id; StorageManager.setActiveWeek(currentWeekId); }

window.appState = { currentView: 'today', sortableInstance: null, awTimer: null };    let loggedWeights = StorageManager.get();    let loggedReps = StorageManager.getReps();

const getActiveSchedule = () => (appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0]).schedule;
const getTodayId = () => ((new Date().getDay() - DAY_NAMES.indexOf(StorageManager.getStartDay()) + 7) % 7) + 1;
const isDayIncomplete = d => (!d.exercises || d.exercises.length === 0) && d.isRest !== true;

const getWeekStart = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const startDayIdx = DAY_NAMES.indexOf(StorageManager.getStartDay());
    const currentDayIdx = d.getDay();
    const diff = (currentDayIdx - startDayIdx + 7) % 7;
    d.setDate(d.getDate() - diff);
    return d;
};

// Which day of the routine (1-7) a log belongs to. New logs remember it (dayId);
// for older logs we work it out from the date they were logged.
const logDayId = log => {
    if (typeof log.dayId === 'number') return log.dayId;
    const t = logTime(log);
    if (isNaN(t)) return null;
    return ((new Date(t).getDay() - DAY_NAMES.indexOf(StorageManager.getStartDay()) + 7) % 7) + 1;
};
// Sets logged this week for one exercise on one specific day of the active routine
const setsThisWeekForDay = (h, dayId) => {
    const weekStart = getWeekStart().getTime();
    return (h || []).reduce((sum, log) => {
        const t = logTime(log);
        if (isNaN(t) || t < weekStart) return sum;
        if (log.weekId && log.weekId !== currentWeekId) return sum;
        if (logDayId(log) !== dayId) return sum;
        return sum + logSets(log).length;
    }, 0);
};

// Sets done this week vs planned sets for one day (each exercise counts up to its planned sets)
const dayProgress = (d, history = StorageManager.getHistory()) => {
    let done = 0, planned = 0;
    (d.exercises || []).forEach((ex, i) => {
        const p = parseInt(ex.sets) || 0;
        planned += p;
        done += Math.min(p, setsThisWeekForDay(history[getExKey(currentWeekId, d.id, i, ex.name)], d.id));
    });
    return { done, planned, pct: planned ? Math.round(done / planned * 100) : 0 };
};

const isDayCompleted = (d, history = StorageManager.getHistory()) => {
    if (d.isRest) return true;
    if (!d.exercises || d.exercises.length === 0) return false;
    const pr = dayProgress(d, history);
    return pr.planned > 0 && pr.done >= pr.planned;
};

// One-time upgrade: give older logs an exact timestamp (their text date is kept as-is)
(() => {
    const h = StorageManager.getHistory();
    let changed = false;
    Object.keys(h).forEach(k => { if (Array.isArray(h[k])) h[k].forEach(log => {
        if (log && typeof log.ts !== 'number') { const t = parseLogDate(log.d); if (!isNaN(t)) { log.ts = t; changed = true; } }
    }); });
    if (changed) StorageManager.setHistory(h);
})();

// The app always opens on today
let activeDay = getTodayId();

// Build a 7-day schedule from a program, starting on the user's first day of the week.
// exp (training experience): 'none' = just starting: one set less on every exercise (at least 2),
// 'new' = under a year: one set less on accessories, 'mid' = 1–3 years: as written,
// 'adv' = 3–5 years: one set more on the first two lifts of each day (never more than 4),
// 'pro' = over 5 years: one set more on the first three lifts (never more than 5)
const EXP_LEVELS = ['none', 'new', 'mid', 'adv', 'pro'];
const PROFILE_KEY = 'workoutProfile_rakan_final';
// Training answers from the setup. Each one changes the program: goal, days a week, experience, equipment
// and workout length (minutes: shorter workouts get fewer exercises a day)
const SESSION_OPTS = ['30', '45', '60', '90'];
const sanitizeProfile = raw => {
    const p = isObj(raw) ? raw : {}, out = {};
    ['goal', 'days', 'exp', 'eq', 'session'].forEach(k => { if (typeof p[k] === 'string' && p[k] && p[k].length <= 20) out[k] = p[k]; });
    return out;
};
// Where a new user came from: the link they opened (?ref=instagram or utm_source=...), or "friend" for a routine-code
// link. Read once, on the first visit, and kept on this phone until it goes up with the account.
const REF_KEY = 'workoutRef_rakan_final';
try {
    const q = new URLSearchParams(location.search), ref = (q.get('ref') || q.get('utm_source') || (q.get('r') ? 'friend' : '')).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    if (ref && !localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, ref);
    if (q.has('ref') || q.has('utm_source')) { ['ref', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(k => q.delete(k)); history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash); }
} catch (e) {}
const getProfile = () => sanitizeProfile(readJSON(PROFILE_KEY, {}));
const PROFILE_STEPS = ['sex', 'birth', 'body'], TRAINING_STEPS = ['goal', 'exp', 'days', 'session', 'eq'];
// is this setup question answered already?
const setupAnswered = (k, b = getBody(), pr = getProfile()) => ({
    sex: !!b.sex, birth: !!b.birthDate, body: !!(b.heightCm && b.weightKg),
    goal: !!pr.goal, exp: EXP_LEVELS.includes(pr.exp), days: !!pr.days, session: SESSION_OPTS.includes(pr.session), eq: !!pr.eq
})[k];
// the questions still to answer (asked once on the next visit after an update)
const setupMissing = () => { const b = getBody(), pr = getProfile(); return [...PROFILE_STEPS, ...TRAINING_STEPS].filter(k => !setupAnswered(k, b, pr)); };
// Your profile (set in the setup): date of birth, sex, height, body weight + a log of body weight over time.
// After the setup (locked) date of birth, sex and height can't be changed; body weight can.
const BODY_KEY = 'workoutBody_rakan_final';
const MIN_AGE = 13;
const thisYear = () => new Date().getFullYear();
const sanitizeBody = raw => {
    const b = isObj(raw) ? raw : {}, out = {};
    const y = parseInt(latinDigits(b.birthYear)); if (y >= thisYear() - 100 && y <= thisYear() - 5) out.birthYear = y;
    const bd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.birthDate || ''));
    if (bd && +bd[1] >= thisYear() - 100 && +bd[1] <= thisYear() - 5 && +bd[2] >= 1 && +bd[2] <= 12 && +bd[3] >= 1 && +bd[3] <= 31) { out.birthDate = bd[0]; out.birthYear = +bd[1]; }
    if (['male', 'female', 'na'].includes(b.sex)) out.sex = b.sex;
    const h = parseFloat(latinDigits(b.heightCm)); if (h >= 100 && h <= 250) out.heightCm = Math.round(h);
    const w = parseFloat(latinDigits(b.weightKg)); if (w >= 25 && w <= 350) out.weightKg = Math.round(w * 10) / 10;
    if (Array.isArray(b.log)) out.log = b.log.filter(x => isObj(x) && typeof x.t === 'number' && isFinite(x.t) && parseFloat(x.kg) >= 25 && parseFloat(x.kg) <= 350)
        .map(x => ({ t: x.t, kg: Math.round(parseFloat(x.kg) * 10) / 10 })).sort((a, c) => a.t - c.t).slice(-200);
    if (b.locked === true) out.locked = true;
    return out;
};
const getBody = () => sanitizeBody(readJSON(BODY_KEY, {}));
const setBody = b => writeItem(BODY_KEY, JSON.stringify(sanitizeBody(b)));
// age in whole years (from the date of birth, or the birth year for older accounts)
const ageOf = b => {
    if (b.birthDate) { const [y, m, d] = b.birthDate.split('-').map(Number), n = new Date(); return n.getFullYear() - y - ((n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) ? 1 : 0); }
    return b.birthYear ? thisYear() - b.birthYear : null;
};
const LOCKED_ABOUT = ['birthYear', 'birthDate', 'heightCm', 'sex'];
// session (workout length in minutes): 30 → at most 4 exercises a day, 45 → 5, 60 or more → the whole day
const SESSION_CAP = { 30: 4, 45: 5 };
const programSchedule = (prog, exp, session = getProfile().session) => {
    const start = DAY_NAMES.indexOf(StorageManager.getStartDay()), cap = SESSION_CAP[session] || 99;
    return prog.week.map((slot, i) => {
        const base = { id: i + 1, day: DAY_NAMES[(start + i) % 7], savedTitle: '' };
        if (slot === 'R') return { ...base, title: 'Complete Rest', isRest: true, recoveryType: 'complete', exercises: [] };
        if (slot === 'A') return { ...base, title: 'Active Rest', isRest: true, recoveryType: 'active', exercises: [] };
        const [title, list] = WORKOUTS[slot];
        return { ...base, title, savedTitle: title, isRest: false, recoveryType: null, exercises: list.slice(0, cap).map(([name, muscle, sets, reps], j) => {
            let n = parseInt(sets);
            if (exp === 'none') n = Math.max(2, n - 1);
            if (exp === 'new' && j >= 2) n = Math.max(2, n - 1);
            if (exp === 'adv' && j < 2) n = Math.max(n, Math.min(4, n + 1));
            if (exp === 'pro' && j < 3) n = Math.max(n, Math.min(5, n + 1));
            return { muscle, name, sets: String(n), reps };
        }) };
    });
};
// Which program fits the answers best
const recommendProgram = a => {
    if (a.eq === 'db') return 'db3';
    const d = parseInt(a.days) || 4;
    // just starting: simple programs, at most 4 days, so the body can get used to training
    if (a.exp === 'none') return a.goal === 'strength' ? 's5x5' : d <= 3 ? 'fb3' : 'ul4';
    // women training 4 days for muscle or fat loss: the glutes and legs program
    if (a.sex === 'female' && d === 4 && (a.goal === 'muscle' || a.goal === 'fat')) return 'glutes4';
    // over 5 years: programs with more volume
    if (a.exp === 'pro') {
        if (a.goal === 'strength') return d <= 3 ? 's5x5' : 'phul';
        if (a.goal === 'muscle' && d >= 6) return 'arnold6';
    }
    if (a.goal === 'strength') return d <= 3 ? 's5x5' : 'phul';
    if (a.goal === 'fat') return d <= 3 ? 'fb3' : d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
    if (d <= 3) return a.exp === 'new' ? 'fb3' : 'ppl3';
    return d === 4 ? 'ul4' : d === 5 ? 'hybrid5' : 'ppl6';
};
// Put a routine into the app: as a new routine (keeps your current one) or replacing the current one (always when there are 5)
const putRoutine = (name, schedule, { replace = false, undo = false, targetId = null } = {}) => {
    const snap = { weeks: JSON.stringify(appData.weeks), weekId: currentWeekId, day: activeDay }, target = targetId && appData.weeks.find(x => x.id === targetId);
    if (target) { target.schedule = schedule; target.name = name; currentWeekId = target.id; StorageManager.setActiveWeek(target.id); }
    else if (replace || appData.weeks.length >= 5) { const w = appData.weeks.find(x => x.id === currentWeekId); w.schedule = schedule; w.name = name; }
    else { const wid = 'w_' + Date.now(); appData.weeks.push({ id: wid, name, schedule }); currentWeekId = wid; StorageManager.setActiveWeek(wid); }
    StorageManager.setPlan(appData);
    activeDay = getTodayId();
    window.appActions.switchTab('today');
    window.appActions.showToast(t('{name} is ready', { name }), 'success', undo ? { label: t('Undo'), fn: () => {
        appData.weeks = JSON.parse(snap.weeks); currentWeekId = snap.weekId; activeDay = snap.day;
        StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId); window.appActions.switchTab('plan');
    } } : null);
};
// Short week preview: "Sat Push · Sun Pull · ..."
const programPreviewHTML = prog => {
    const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
    return `<div class="grid grid-cols-7 gap-1 mt-3">${prog.week.map((slot, i) => {
        const rest = slot === 'R' || slot === 'A';
        return `<div class="rounded-lg py-1.5 px-0.5 text-center ${rest ? 'bg-white/5 text-slate-400' : 'bg-[#d4af37]/15 text-[#d4af37]'}"><div class="text-[12px] font-bold">${esc(dayShort(DAY_NAMES[(start + i) % 7]))}</div><div class="pv-wo mt-0.5">${rest ? '—' : esc(t(WORKOUTS[slot][0]))}</div></div>`;
    }).join('')}</div>`;
};

// One day of a program preview: rest, or the workout with its exercises, sets and reps
const programDayCardHTML = d => d.isRest
        ? `<div class="glass-card ex-card flex items-center gap-3 opacity-70"><i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-5 h-5 text-slate-400 shrink-0"></i><span class="text-[12px] font-bold text-slate-400 w-10 shrink-0">${esc(dayShort(d.day))}</span><span class="text-[14px] font-black text-slate-300">${t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest')}</span></div>`
        : `<div class="glass-card ex-card">
                <div class="flex items-baseline justify-between gap-2 mb-2"><span class="min-w-0"><span class="block text-[12px] font-bold text-[#d4af37]">${esc(dayLong(d.day))}</span><span class="block text-[17px] font-black text-white leading-tight">${esc(t(d.title))}</span></span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} exercises', { n: d.exercises.length })}</span></div>
                ${d.exercises.map((ex, k) => `<div class="flex items-center gap-3 py-2 ${k ? 'border-t border-white/5' : ''}"><span class="w-6 text-center text-[12px] font-bold text-slate-400 shrink-0">${k + 1}</span><span class="flex-1 min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold text-slate-400 truncate">${esc(tm(ex.muscle))}</span></span><span class="ex-pill" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span></div>`).join('')}
            </div>`;

// 🔎 EXERCISE PICKER DATA
const CUSTOM_KEY = 'workoutCustomEx_rakan_final';
const sanitizeCustomEx = raw => Array.isArray(raw) ? raw.filter(isObj).map(x => ({ name: toStr(x.name).trim().slice(0, 60), muscle: muscleOptions.includes(x.muscle) ? x.muscle : 'Chest' })).filter(x => x.name) : [];
const getCustomEx = () => sanitizeCustomEx(readJSON(CUSTOM_KEY, []));
const setCustomEx = list => writeItem(CUSTOM_KEY, JSON.stringify(list));
// Every exercise under every muscle it belongs to (built-in + your own)
const catalogue = () => {
    const out = [];
    Object.keys(exerciseDictionary).forEach(m => exerciseDictionary[m].forEach(name => out.push({ name, muscle: m })));
    getCustomEx().forEach(x => out.push({ ...x, custom: true }));
    return out;
};
const TIMED_DEFAULT = ['Plank', 'Weighted Plank', 'Hollow Body Hold', 'Wall Sit', 'Copenhagen Plank', 'Side Plank', 'L-Sit', 'Dead Hang', 'Stomach Vacuum', 'Mountain Climber'];
const newExercise = (name, muscle) => ({ muscle, name, sets: '3', reps: TIMED_DEFAULT.includes(name) ? '30 - 45s' : '10 - 12' });
const REPS_PRESETS = ['6 - 8', '8 - 10', '8 - 12', '10 - 12', '12 - 15', '15 - 20', '30 - 45s'];

// Bottom sheets slide up from the bottom; the page behind them is frozen so nothing jumps
// a full page (.page-box) slides in from the side; a sheet slides up from the bottom
const hiddenCls = b => b.classList.contains('page-box') ? 'translate-x-full' : 'translate-y-full';
const openSheet = (overlayId, boxId) => {
    const o = document.getElementById(overlayId), b = document.getElementById(boxId);
    const sc = document.querySelector('.scrollable-content'); if (sc) sc.style.overflow = 'hidden';
    o.classList.remove('hidden'); o.classList.add('flex');
    requestAnimationFrame(() => { o.classList.remove('opacity-0'); b.classList.remove(hiddenCls(b)); });
};
const closeSheet = (overlayId, boxId) => {
    const o = document.getElementById(overlayId), b = document.getElementById(boxId);
    if (document.activeElement) document.activeElement.blur();
    o.classList.add('opacity-0'); b.classList.add(hiddenCls(b));
    setTimeout(() => {
        if (!o.classList.contains('opacity-0')) return; // opened again in the meantime: leave it open
        o.classList.add('hidden'); o.classList.remove('flex');
        if (document.querySelectorAll('.sheet-overlay.flex').length === 0) { const sc = document.querySelector('.scrollable-content'); if (sc) sc.style.overflow = ''; }
    }, 300);
};

// 📱 PHONE BACK BUTTON: closes the top window instead of leaving the app.
// One extra history entry ("guard") is added while windows are open. When the last window is closed by its own
// button, the guard is taken away again (history.back() only when the page is on the guard, so it can never leave
// the app): the next window adds a fresh one. In a phone's browser tab the swipe-back then shows the right screen
// behind the page, not the screen from when the first window of the visit was opened.
const backStack = []; let backGuard = false, backPending = false;
const removeBack = id => { const i = backStack.map(x => x.id).lastIndexOf(id); if (i >= 0) backStack.splice(i, 1); };
const pushBack = (id, fn) => {
    removeBack(id); // one entry per window, even if it was opened twice
    backStack.push({ id, fn });
    if (!backGuard && !backPending) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} }
};
// Phone back button during a workout: the workout stays open (finish it or discard it with ✕ to leave)
const sessionBack = () => window.appActions.minimizeSession(); // back = keep the workout running in the small bar
const popBack = id => {
    removeBack(id);
    if (backStack.length || !backGuard || backPending) return;
    try { if (history.state && history.state.apexGuard) { backPending = true; backGuard = false; history.back(); } } catch (e) { backPending = false; }
};
window.addEventListener('popstate', () => {
    // our own history.back() above: no window to close; a window opened in the meantime gets its guard now
    if (backPending) { backPending = false; if (backStack.length && !backGuard) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} } return; }
    backGuard = false;
    const top = backStack.pop();
    if (top) { top.fn(); if (backStack.length) { try { history.pushState({ apexGuard: 1 }, ''); backGuard = true; } catch (e) {} } }
});

// 👇 SWIPE DOWN to close a bottom sheet (from its top, or when its list is scrolled to the top).
// Sideways swipes (the muscle chips row) never move the sheet.
const enableSwipeDown = (box, onClose) => {
    if (!box) return;
    let x0 = 0, y0 = null, dy = 0, t0 = 0, scroller = null, down = false;
    box.addEventListener('touchstart', e => {
        if (e.target.closest('input, select, textarea, .scrollbar-hide, .overflow-x-auto')) { y0 = null; return; }
        scroller = e.target.closest('.sheet-scroll, #picker-list, #history-modal-content');
        if (scroller && scroller.scrollTop > 0) { y0 = null; return; }
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); down = false;
    }, { passive: true });
    box.addEventListener('touchmove', e => {
        if (y0 === null) return;
        dy = e.touches[0].clientY - y0;
        const dx = e.touches[0].clientX - x0;
        if (!down) { if (Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) { y0 = null; dy = 0; return; } if (dy > 8) down = true; }
        if (dy <= 0 || (scroller && scroller.scrollTop > 0)) { box.style.transition = ''; box.style.transform = ''; if (dy < -10) y0 = null; return; }
        box.style.transition = 'none'; box.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    box.addEventListener('touchend', () => {
        if (y0 === null) return;
        box.style.transition = '';
        if (dy > 140 || (dy > 60 && Date.now() - t0 < 250)) {
            box.style.transform = 'translateY(100%)';
            onClose();
            setTimeout(() => { box.style.transform = ''; }, 350);
        } else box.style.transform = '';
        y0 = null; dy = 0;
    });
};

// 👉 SWIPE from the left edge of a full page to go back (like the back button)
// In a browser tab on iPhone / iPad the browser has its own swipe-back (it goes back in history, which closes the page
// through PHONE BACK BUTTON above): the app's swipe is left out there, so the two don't run together.
const browserSwipesBack = (() => { try { const ua = navigator.userAgent || ''; return (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) && !(navigator.standalone === true || matchMedia('(display-mode: standalone)').matches); } catch (e) { return false; } })();
const enableEdgeBack = (box, onBack) => {
    if (!box || browserSwipesBack) return;
    let x0 = null, y0 = 0, dx = 0;
    box.addEventListener('touchstart', e => { const x = e.touches[0].clientX; x0 = x < 28 && e.touches.length === 1 ? x : null; y0 = e.touches[0].clientY; dx = 0; }, { passive: true });
    box.addEventListener('touchmove', e => {
        if (x0 === null) return;
        dx = e.touches[0].clientX - x0;
        if (Math.abs(e.touches[0].clientY - y0) > Math.abs(dx) && dx < 30) { x0 = null; box.style.transform = ''; return; }
        box.style.transition = 'none'; box.style.transform = `translateX(${Math.max(0, dx)}px)`;
    }, { passive: true });
    box.addEventListener('touchend', () => {
        if (x0 === null) return;
        box.style.transition = ''; x0 = null;
        if (dx > 90) { onBack(); setTimeout(() => { box.style.transform = ''; }, 320); } else box.style.transform = '';
    });
};

// 👈 SWIPE left / right on Today to go to the next / previous day (the layout is the same in Arabic, so the swipe is too)
const enableDaySwipe = el => {
    if (!el) return;
    let x0 = null, y0 = 0, t0 = 0;
    el.addEventListener('touchstart', e => {
        if (window.appState.currentView !== 'today' || window.appState.todayEdit || e.touches.length > 1 || e.target.closest('input, select, textarea, .scrollbar-hide')) { x0 = null; return; }
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    el.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6 || Date.now() - t0 > 600) return;
        window.appActions.setActiveDay(((activeDay - 1 + (dx < 0 ? 1 : 6)) % 7) + 1);
    });
};

// 🔒 Keep the screen on during a Focus session (where supported)
let wakeLock = null;
const keepAwake = async on => {
    try {
        if (on && 'wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
        else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { wakeLock = null; }
};
document.addEventListener('visibilitychange', () => { const S = window.appState.sess; if (document.visibilityState === 'visible' && S && !S.quick) keepAwake(true); });

// 🏋️ LOG / FOCUS SESSION helpers. An unsaved session is kept in storage so it survives the app being closed.
const SESSION_KEY = 'workoutSession_rakan_final';
const fmtClock = sec => { const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), x = String(sec % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${String(m).padStart(2, '0')}:${x}`; };
// All sets of the last session before today (for the "Previous" column)
const lastSessionSets = hA => {
    const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !isToday(logTime(l)));
    if (!logs.length) return [];
    const day = startOfDay(logTime(logs[logs.length - 1]));
    return logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails);
};
// Last session in one line: date + "60kg × 10 · 10 · 9" (the weight per set only when they differ)
const lastSessionText = (hA, timed) => {
    const sets = lastSessionSets(hA); if (!sets.length) return null;
    const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !isToday(logTime(l))), u = timed ? 's' : '';
    const body = sets.every(x => x.w === sets[0].w) ? `${fmtW(sets[0].w)} × ${sets.map(x => x.r + u).join(' · ')}` : sets.map(x => `${fmtW(x.w)} × ${x.r}${u}`).join(' · ');
    return { when: fmtDate(logTime(logs[logs.length - 1]), false), body };
};
// "Last time" in the exercise pop-up: every set from the last date this exercise was done on this day of the plan
// (today included, all of that date's sessions together); falls back to any day if it was never done on this one
const lastDaySets = (hA, dayId) => {
    const valid = (hA || []).filter(l => !isNaN(logTime(l))), mine = valid.filter(l => logDayId(l) === dayId), logs = mine.length ? mine : valid;
    if (!logs.length) return null;
    const ts = Math.max(...logs.map(logTime)), day = startOfDay(ts);
    return { ts, sets: logs.filter(l => startOfDay(logTime(l)) === day).flatMap(logSetDetails) };
};
const sessionRows = () => [...document.querySelectorAll('#aw-sets-container .aw-row')].map(r => {
    const i = r.dataset.i, val = id => ((document.getElementById(id) || {}).value || '').trim();
    return { i, e: Number(r.dataset.e), w: val(`aw-w-${i}`), r: val(`aw-rep-${i}`), rpe: val(`aw-rpe-${i}`), done: r.dataset.done === '1', logged: r.dataset.logged === '1' };
});
const sessionHasData = () => !!window.appState.sess && sessionRows().some(x => !x.logged && (x.r !== '' || x.done));
const saveSessionDraft = () => { const S = window.appState.sess; if (S) writeItem(SESSION_KEY, JSON.stringify({ ...S, rows: sessionRows() })); };
const clearSessionDraft = () => { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} };

// Opens / closes a pop-up window (overlay + box) with the fade & zoom animation
const openModal = (overlayId, boxId) => {
    const o = document.getElementById(overlayId), b = document.getElementById(boxId);
    o.classList.remove('hidden'); o.classList.add('flex');
    requestAnimationFrame(() => { o.classList.remove('opacity-0'); b.classList.remove('scale-95'); });
    if (window.lucide) window.lucide.createIcons({ root: b });
};
const closeModal = (overlayId, boxId, ms = 300, after) => {
    const o = document.getElementById(overlayId), b = document.getElementById(boxId);
    o.classList.add('opacity-0'); b.classList.add('scale-95');
    setTimeout(() => { if (o.classList.contains('opacity-0')) { o.classList.add('hidden'); o.classList.remove('flex'); } if (after) after(); }, ms);
};

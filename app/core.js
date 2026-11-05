// Apex Lift app (index.html), part 1 of 13: Language, data validation, storage, coach note and daily check-in: the basics every other file uses.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// esc: escapes any value for safe use inside HTML text or attributes; isObj: a plain object (admin-utils.js, shared)
const { esc, isObj } = window.ApexAdminUtils;
// 👆 BUTTON ACTIONS without inline JavaScript (the site's security policy forbids inline scripts, so injected code can't run).
// An element says what to do with data-on-<event>="code" (click, change, input, submit, keydown, focus, blur). The same code,
// compiled ahead of time in app/handlers.js (built by: node tools/build-handlers.js), runs with this = that element, like
// onclick="code" used to. Values that change (an id, a name) are never pasted into the code: they go in
// data-a-<event>="${hArgs(a, b)}" and the code reads them as @0, @1, … e.g.
//   <button data-on-click="window.appActions.openPlanDay(@0)" data-a-click="${hArgs(day.id)}">
const APP_HANDLERS = {}; // code → function (this, event, a), filled by app/handlers.js
// the values for data-a-<event>, as JSON escaped for an HTML attribute
const hArgs = (...vals) => esc(JSON.stringify(vals));
// a value as text (null / undefined → ''), for names and ids (handles names like "Farmer's Walk")
const hStr = v => (v === null || v === undefined ? '' : String(v));
(() => {
    const run = (el, type, e) => {
        const code = el.getAttribute('data-on-' + type), fn = APP_HANDLERS[code];
        if (!fn) return console.warn(`No handler for data-on-${type}="${code}": run node tools/build-handlers.js`);
        let a = [];
        const raw = el.getAttribute('data-a-' + type);
        if (raw) { try { a = JSON.parse(raw); } catch (x) { return console.warn('Bad data-a-' + type, raw); } }
        // an error in one action is reported but doesn't stop the others (like separate onclick handlers)
        try { if (fn.call(el, e, a) === false) e.preventDefault(); } // "return false" in the code, as in onclick
        catch (x) { if (window.reportError) window.reportError(x); else setTimeout(() => { throw x; }); }
    };
    // bubbling events: each element on the event's path, from the target up (stopPropagation() in the code stops it).
    // composedPath() is the path when the event started, so a parent still gets it after the code redraws the screen.
    ['click', 'change', 'input', 'submit', 'keydown'].forEach(type => document.addEventListener(type, e => {
        for (const el of e.composedPath()) {
            if (el === document) break;
            if (el.nodeType === 1 && el.hasAttribute('data-on-' + type)) run(el, type, e);
            if (e.cancelBubble) break;
        }
    }));
    // focus and blur don't bubble: only the element itself
    'focus blur'.split(' ').forEach(type => document.addEventListener(type, e => {
        const el = e.target; if (el && el.nodeType === 1 && el.hasAttribute('data-on-' + type)) run(el, type, e);
    }, true));
})();

// 🌐 LANGUAGE (English / Arabic). Text is written in English in the code and wrapped in t('...');
// the Arabic version comes from AR below. Exercise names stay in English in both languages.
const LANG_KEY = 'workoutLang_rakan_final';
const LANG = (() => {
    let v = null; try { v = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (v === 'ar' || v === 'en') return v;
    return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
})();
const isAR = LANG === 'ar';
// Arabic text: AR (sentences), AR_COUNT (Arabic counting words) and MUSCLE_AR (muscle names) live in i18n.js
const { AR, AR_COUNT, MUSCLE_AR } = window.APEX_I18N;
const arCount = (n, word) => {
    const f = AR_COUNT[word], v = Number(String(n).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    if (!f) return `${n} ${word}`;
    if (!Number.isInteger(v)) return `${n} ${f[2]}`; // a range like 6–8
    return v === 1 ? f[0] : v === 2 ? f[1] : v >= 3 && v <= 10 ? `${n} ${f[2]}` : `${n} ${f[3]}`;
};
const t = (en, vars) => {
    let out = (isAR && Object.prototype.hasOwnProperty.call(AR, en) && AR[en]) || en;
    if (vars && isAR) out = out.replace(/\{(\w+)\} ([\u0600-\u06FF]+)/g, (m, k, w) => vars[k] !== undefined && AR_COUNT[w] ? arCount(vars[k], w) : m);
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
    // after قبل / من / خلال / بعد the dual takes its other form: قبل يومين, من مجموعتين
    if (isAR) out = out.replace(/(قبل|من|خلال|بعد|لمدة) ([\u0600-\u06FF]+)(تان|ان)(?=\s|$|[.،:)])/g, (m, p, w, e) => `${p} ${w}${e === 'تان' ? 'تين' : 'ين'}`);
    return out;
};
const tm = m => (isAR && Object.prototype.hasOwnProperty.call(MUSCLE_AR, (m || '').trim()) && MUSCLE_AR[(m || '').trim()]) || m || '';
const DAY_AR = { SUN:'الأحد', MON:'الاثنين', TUE:'الثلاثاء', WED:'الأربعاء', THU:'الخميس', FRI:'الجمعة', SAT:'السبت' };
const tDay = d => (isAR && Object.prototype.hasOwnProperty.call(DAY_AR, d) && DAY_AR[d]) || d;
const DAY_EN = { SUN:'Sunday', MON:'Monday', TUE:'Tuesday', WED:'Wednesday', THU:'Thursday', FRI:'Friday', SAT:'Saturday' };
const dayLong = d => isAR ? (DAY_AR[d] || d) : (DAY_EN[d] || d);
const DAY_AR_SHORT = { SUN:'أحد', MON:'اثنين', TUE:'ثلاثاء', WED:'أربعاء', THU:'خميس', FRI:'جمعة', SAT:'سبت' };
const dayShort = d => isAR ? (DAY_AR_SHORT[d] || d) : (DAY_EN[d] || d).slice(0, 3);
// Workout name short enough for the week strip: built-in names have a fixed short form,
// your own names lose filler words ("Push Day" -> "Push"); anything longer is cut after 2 lines
const SHORT_TITLE = {
    'Upper Body': ['Upper', 'علوي'], 'Lower Body': ['Lower', 'سفلي'], 'Full Body': ['Full Body', 'جسم كامل'],
    'Full Body A': ['Full A', 'كامل A'], 'Full Body B': ['Full B', 'كامل B'],
    'Upper Hypertrophy': ['Upper Hyp', 'علوي تضخيم'], 'Lower Hypertrophy': ['Lower Hyp', 'سفلي تضخيم'],
    'Glutes & Hamstrings': ['Glutes & Hams', 'ألوية وأوتار'], 'Shoulders & Arms': ['Shldr & Arms', 'أكتاف وذراعين'],
    'Lower Body & Abs': ['Lower & Abs', 'سفلي وبطن'], 'Push & Bi': ['Push & Bi', 'دفع وذات الرأسين'], 'Pull & TRI': ['Pull & TRI', 'سحب وثلاثية'], 'Complete Rest': ['Rest', 'راحة'], 'Active Rest': ['Active', 'راحة نشطة']
};
const shortTitle = title => {
    const s = SHORT_TITLE[(title || '').trim()]; if (s) return isAR ? s[1] : s[0];
    const words = t(title || '').trim().split(/\s+/), kept = words.filter(w => !/^(day|body|workout|session|يوم|تمرين)$/i.test(w));
    return (kept.length ? kept : words).join(' ');
};
// Dates are shown in the chosen language (always the normal calendar and 0-9 digits)
const fmtDate = (ts, withTime = true) => {
    const d = new Date(ts);
    if (isNaN(d)) return '';
    const opt = { day: '2-digit', month: 'short', year: 'numeric', calendar: 'gregory', numberingSystem: 'latn' };
    if (withTime) { opt.hour = 'numeric'; opt.minute = '2-digit'; }
    return new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', opt).format(d);
};
const fmtDayMonth = d => new Intl.DateTimeFormat(isAR ? 'ar' : 'en-GB', { day: 'numeric', month: 'short', calendar: 'gregory', numberingSystem: 'latn' }).format(d);

// 📦 1. DATA: muscles, exercises and programs come from library.js (shared with the admin coach builder)
const { muscleOptions, exerciseDictionary, exerciseAR, WORKOUTS, PROGRAMS } = window.APEX_LIB;
// exercise name to show: Arabic in Arabic (your own exercises keep the name you gave them)
const tx = n => (isAR && exerciseAR && Object.prototype.hasOwnProperty.call(exerciseAR, n) && exerciseAR[n]) || n || '';
// Automatically removes any duplicates caused by overlapping categories
const exerciseOptions=[...new Set(Object.values(exerciseDictionary).flat())].sort();

// Default routine (names match the exercise dictionary)
const defaultWorkoutData=[
    {id:1,day:"SAT",title:"Push & Bi",exercises:[
        {muscle:"Upper Chest",name:"Incline Bench Press",sets:"4",reps:"8 - 10"},
        {muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"10 - 12"},
        {muscle:"Shoulders",name:"Dumbbell Shoulder Press",sets:"3",reps:"10 - 12"},
        {muscle:"Side Delts",name:"Dumbbell Lateral Raise",sets:"3",reps:"8 - 10"},
        {muscle:"Biceps",name:"Preacher Curl",sets:"3",reps:"10 - 12"},
        {muscle:"Biceps",name:"Hammer Curl",sets:"3",reps:"10 - 12"}
    ]},
    {id:2,day:"SUN",title:"Pull & TRI",exercises:[
        {muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"10 - 12"},
        {muscle:"Back",name:"Chest-Supported Row",sets:"3",reps:"8 - 10"},
        {muscle:"Rear Delts",name:"Machine Reverse Fly",sets:"3",reps:"12 - 15"},
        {muscle:"Triceps",name:"Tricep Pushdown",sets:"3",reps:"12 - 15"},
        {muscle:"Triceps",name:"Overhead Tricep Extension",sets:"3",reps:"12 - 15"}
    ]},
    {id:3,day:"MON",title:"Legs A",exercises:[
        {muscle:"Quads",name:"Leg Press",sets:"4",reps:"10 - 12"},
        {muscle:"Quads",name:"Leg Extension",sets:"3",reps:"12 - 15"},
        {muscle:"Hamstrings",name:"Seated Leg Curl",sets:"3",reps:"12 - 15"},
        {muscle:"Calves",name:"Standing Calf Raise",sets:"4",reps:"15 - 20"}
    ]},
    {id:4,day:"TUE",title:"Active Rest",isRest:true,recoveryType:"active",exercises:[]},
    {id:5,day:"WED",title:"Upper Body",exercises:[
        {muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"8 - 10"},
        {muscle:"Upper Chest",name:"Incline Machine Press",sets:"2",reps:"10 - 12"},
        {muscle:"Shoulders",name:"Machine Shoulder Press",sets:"3",reps:"8 - 10"},
        {muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"8 - 10"},
        {muscle:"Back",name:"Seated Cable Row",sets:"2",reps:"10 - 12"},
        {muscle:"Biceps",name:"Machine Bicep Curl",sets:"2",reps:"10 - 12"},
        {muscle:"Triceps",name:"Tricep Pushdown",sets:"2",reps:"10 - 12"}
    ]},
    {id:6,day:"THU",title:"Lower Body & Abs",exercises:[
        {muscle:"Quads",name:"Squat",sets:"3",reps:"8 - 10"},
        {muscle:"Quads",name:"Leg Press",sets:"2",reps:"10 - 12"},
        {muscle:"Quads",name:"Leg Extension",sets:"2",reps:"10 - 12"},
        {muscle:"Hamstrings",name:"Seated Leg Curl",sets:"2",reps:"10 - 12"},
        {muscle:"Calves",name:"Machine Calf Press",sets:"3",reps:"12 - 15"},
        {muscle:"Abs",name:"Plank",sets:"3",reps:"30 - 45s"}
    ]},
    {id:7,day:"FRI",title:"Complete Rest",isRest:true,recoveryType:"complete",exercises:[]}
];


// 🛡️ DATA VALIDATION (used for saved data and imported backup files)
const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
// Arabic keyboards type ٤ or ۴: turn them into 4 so numbers always work
const latinDigits = v => String(v == null ? '' : v).replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x660).replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 0x6F0);
const toStr = (v, fb = '') => (typeof v === 'string' || typeof v === 'number') ? String(v) : fb;
// Security: names like "__proto__" can't be used as keys, and text from files/cloud is cut to a sane length
const safeKey = k => typeof k === 'string' && k.length > 0 && k.length <= 200 && k !== '__proto__' && k !== 'constructor' && k !== 'prototype';
const cut = (v, n, fb = '') => toStr(v, fb).slice(0, n);

// Returns a clean plan { weeks: [...] }, or null if the data can't be used.
// Accepts the old format too (a plain 7-day array).
const sanitizePlan = raw => {
    let weeks = null;
    if (Array.isArray(raw)) weeks = [{ id: 'w_restored', name: 'Restored Routine', schedule: raw }];
    else if (isObj(raw) && Array.isArray(raw.weeks)) weeks = raw.weeks;
    if (!weeks) return null;
    const cleanWeeks = [];
    weeks.forEach((w, wi) => {
        if (!isObj(w) || !Array.isArray(w.schedule) || w.schedule.length !== 7) return;
        const schedule = w.schedule.map((d, i) => {
            d = isObj(d) ? d : {};
            const isRest = d.isRest === true;
            return {
                id: i + 1,
                day: DAY_NAMES.includes(d.day) ? d.day : DAY_NAMES[i],
                title: cut(d.title, 80, 'New Day'),
                isRest,
                recoveryType: isRest ? (d.recoveryType === 'active' ? 'active' : 'complete') : null,
                savedTitle: cut(d.savedTitle, 80),
                exercises: Array.isArray(d.exercises) ? d.exercises.filter(isObj).slice(0, 60).map(ex => ({
                    muscle: cut(ex.muscle, 40, 'Muscle'), name: cut(ex.name, 80, 'New Exercise'), sets: latinDigits(cut(ex.sets, 10, '3')), reps: latinDigits(cut(ex.reps, 20, '10'))
                })) : []
            };
        });
        let id = cut(w.id, 60) || `w_${Date.now()}_${wi}`;
        while (cleanWeeks.some(x => x.id === id)) id += '_';
        cleanWeeks.push({ id, name: cut(w.name, 60, 'Routine'), schedule });
    });
    return cleanWeeks.length ? { weeks: cleanWeeks.slice(0, 5) } : null;
};

// Returns a clean { exerciseKey: [logs] } history object
const sanitizeHistory = raw => {
    const out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).filter(safeKey).slice(0, 600).forEach(k => {
        if (!Array.isArray(raw[k])) return;
        const logs = raw[k].slice(-HIST_CAP).filter(l => isObj(l) && typeof l.d === 'string').map(l => {
            const s = Array.isArray(l.s) ? l.s.slice(0, 30).map(x => parseInt(x)).filter(x => !isNaN(x)) : cut(l.s, 10);
            const log = { d: l.d.slice(0, 40), w: cut(l.w, 10), s };
            if (l.time !== undefined) log.time = cut(l.time, 12);
            if (l.week !== undefined) log.week = cut(l.week, 60);
            if (typeof l.ts === 'number' && isFinite(l.ts)) log.ts = l.ts;
            if (typeof l.dayId === 'number' && l.dayId >= 1 && l.dayId <= 7) log.dayId = l.dayId;
            if (l.weekId !== undefined) log.weekId = cut(l.weekId, 60);
            if (l.u === 's') log.u = 's';
            if (Array.isArray(l.ws) && Array.isArray(l.s) && l.ws.length === l.s.length) log.ws = l.ws.slice(0, 30).map(x => cut(x, 10, '0'));
            if (Array.isArray(l.rpe) && Array.isArray(l.s) && l.rpe.length === l.s.length) log.rpe = l.rpe.slice(0, 30).map(x => typeof x === 'number' && x >= 1 && x <= 10 ? x : null);
            return log;
        });
        if (logs.length) out[k] = logs;
    });
    return out;
};

// Returns a clean { exerciseKey: value } object (used for weights)
const sanitizeValueMap = raw => {
    const out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).filter(safeKey).slice(0, 1000).forEach(k => { const v = toStr(raw[k], null); if (v !== null) out[k] = v.slice(0, 20); });
    return out;
};

// 💾 2. STORAGE MANAGEMENT
// Reads JSON safely: if saved data is damaged, keep a copy of it (so nothing is lost) and use the fallback.
const readJSON = (key, fallback) => {
    let raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { return fallback; }
    if (raw === null) return fallback;
    try { return JSON.parse(raw); }
    catch (e) {
        try { if (localStorage.getItem(key + '_damaged') === null) localStorage.setItem(key + '_damaged', raw); } catch (e2) {}
        console.error(`Saved data "${key}" was damaged and has been set aside.`, e);
        return fallback;
    }
};
// Set later by the cloud module: called after every save so changes can be uploaded
let cloudTouch = () => {};
// Writes safely: shows a message instead of failing silently when storage is full.
const writeItem = (key, value) => {
    try { localStorage.setItem(key, value); cloudTouch(key); return true; }
    catch (e) {
        console.error(`Could not save "${key}"`, e);
        if (window.appActions) window.appActions.showToast(t("Storage full: data not saved. Backup & delete old records."), "error");
        return false;
    }
};

// Small values saved as they are: a full or blocked storage must not stop the action that saves them
const setRaw = (key, value) => { try { localStorage.setItem(key, value); return true; } catch (e) { console.error(`Could not save "${key}"`, e); return false; } };

// Rest timer choices in seconds (Profile → Rest Timer)
const REST_CHOICES = [45, 60, 90, 120, 150, 180, 240, 300];
const StorageManager = {
    KEY: 'workoutWeights_rakan_final', REPS_KEY: 'workoutReps_rakan_final', HIST_KEY: 'workoutHistory_rakan_final', PLAN_KEY: 'workoutPlan_rakan_final_v3', START_KEY: 'workoutStartDay_rakan_final', ACTIVE_WEEK: 'workoutActiveWeek_rakan_final', AUTO_SYNC: 'workoutAutoSync_rakan_final', LAST_DAY: 'workoutLastDay_rakan_final', ONBOARD_KEY: 'workoutOnboard_rakan_final',
    get: () => { const v = readJSON(StorageManager.KEY, {}); return isObj(v) ? v : {}; }, set: d => writeItem(StorageManager.KEY, JSON.stringify(d)),
    getReps: () => { const v = readJSON(StorageManager.REPS_KEY, {}); return isObj(v) ? v : {}; }, setReps: d => writeItem(StorageManager.REPS_KEY, JSON.stringify(d)),
    getHistory: () => { const v = readJSON(StorageManager.HIST_KEY, {}); return isObj(v) ? v : {}; }, setHistory: d => writeItem(StorageManager.HIST_KEY, JSON.stringify(d)),
    getPlan: () => readJSON(StorageManager.PLAN_KEY, null), setPlan: d => writeItem(StorageManager.PLAN_KEY, JSON.stringify(d)),
    getStartDay: () => { const v = localStorage.getItem(StorageManager.START_KEY); return DAY_NAMES.includes(v) ? v : 'SAT'; }, setStartDay: v => { setRaw(StorageManager.START_KEY, v); cloudTouch(StorageManager.START_KEY); },
    getActiveWeek: () => localStorage.getItem(StorageManager.ACTIVE_WEEK), setActiveWeek: v => { setRaw(StorageManager.ACTIVE_WEEK, v); cloudTouch(StorageManager.ACTIVE_WEEK); },
    RPE_KEY: 'workoutShowRpe_rakan_final',
    getShowRpe: () => localStorage.getItem(StorageManager.RPE_KEY) === 'true', setShowRpe: v => { setRaw(StorageManager.RPE_KEY, v ? 'true' : 'false'); cloudTouch(StorageManager.RPE_KEY); },
    REST_KEY: 'workoutRest_rakan_final',
    getRestSeconds: () => { const v = parseInt(localStorage.getItem(StorageManager.REST_KEY)); return REST_CHOICES.includes(v) ? v : 90; },
    setRestSeconds: v => { if (REST_CHOICES.includes(parseInt(v))) { setRaw(StorageManager.REST_KEY, String(parseInt(v))); cloudTouch(StorageManager.REST_KEY); } },
    getOnboard: () => localStorage.getItem(StorageManager.ONBOARD_KEY) === 'true', setOnboard: () => setRaw(StorageManager.ONBOARD_KEY, 'true')
};

const getExKey = (w, d, i, n) => (n||'').trim() === '' || (n||'').trim() === 'New Exercise' ? `temp_${w}_${d}_${i}` : `global_${(n||'').trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, '_')}`;

// 📅 Dates, sets, sessions and progression: pure maths, in calc.js
const { parseLogDate, logTime, logSig, startOfDay, isToday, formatLogDate, logSets, parseRange, isTimed, unitOf, logSetDetails, getLastSession, weightStep, roundHalf, getProgression } = window.APEX_CALC;
// Each exercise keeps its newest 400 logs (more than 2 years at 3 sessions a week)
const HIST_CAP = 400;
// Records you deleted, remembered so another phone (or an old backup) can't bring them back
const DELETED_KEY = 'workoutDeleted_rakan_final';
const getDeleted = () => { const v = readJSON(DELETED_KEY, {}); return isObj(v) ? v : {}; };
const setDeleted = d => { try { localStorage.setItem(DELETED_KEY, JSON.stringify(d)); } catch (e) {} };
// When a backup is restored, each exercise's list gets a "reset" time: a newer reset replaces the list on every phone
const RESET_KEY = 'workoutHistReset_rakan_final';
const getResets = () => { const v = readJSON(RESET_KEY, {}); return isObj(v) ? v : {}; };
const setResets = d => { try { localStorage.setItem(RESET_KEY, JSON.stringify(d)); } catch (e) {} };
// Terms of Use & Privacy Policy: which version the user agreed to, and when
const TERMS_VERSION = '2026-11.04';
const AGREE_KEY = 'workoutAgreed_rakan_final';
const getAgree = () => { const v = readJSON(AGREE_KEY, null); return isObj(v) && v.v === TERMS_VERSION ? v : null; };

// Exercises that can be logged without a load (0 / empty = bodyweight)
const BODYWEIGHT = ['Bicycle Crunch','Bird Dog','Chest Dip','Chin-up','Clamshell','Close-Grip Push-up','Copenhagen Plank','Crunch','Dead Bug','Decline Crunch','Decline Push-up','Deficit Push-up','Diamond Push-up','Dragon Flag','Fire Hydrant','Glute Bridge','Glute-Ham Raise','Hanging Knee Raise','Hanging Leg Raise','Hollow Body Hold','Incline Push-up','Inverted Row','Leg Raise','Nordic Hamstring Curl','Pistol Squat','Plank','Pull-up','Push-up','Reverse Crunch','Russian Twist','Sissy Squat','Sit-up','Superman','Toe Touch','Tricep Dip','V-up','Wall Sit','Back Extension','Frog Pump','Standing Leg Raise','Neck Curl','Neck Extension','Neck Lateral Flexion',
    'Archer Push-up','Bench Dip','Box Jump','Captain\'s Chair Leg Raise','Cossack Squat','Dead Hang','Decline Sit-up','Donkey Kick','Flutter Kick','Hanging Windshield Wiper','Hyperextension','L-Sit','Mountain Climber','Oblique Crunch','Reverse Nordic','Side Lunge','Side Plank','Side-Lying Leg Raise','Single Leg Glute Bridge','Sliding Leg Curl','Stability Ball Leg Curl','Stomach Vacuum','Wide-Grip Pull-up','Neutral Grip Pull-up','Assisted Chin-up'];
const BODYWEIGHT_LC = new Set(BODYWEIGHT.map(x => x.toLowerCase()));
const isBodyweight = name => BODYWEIGHT_LC.has((name || '').trim().toLowerCase());
const fmtW = w => (parseFloat(w) > 0 ? `${parseFloat(w)}kg` : 'BW');


// Shown on the admin page (which version each user runs). Change it together with CACHE in sw.js.
const APP_VERSION = '85';
// How the setup questions ended: 'program', 'own', 'skip', or 'left:<step>' while they are not finished
const SETUP_KEY = 'workoutSetup_rakan_final';

// 🧑‍🏫 COACH: the last routine and note the coach sent from the admin page (see applyCoach in the cloud module)
const COACH_KEY = 'workoutCoach_rakan_final';
const getCoach = () => { const v = readJSON(COACH_KEY, null); return isObj(v) ? v : null; };
const coachCardHTML = () => {
    const c = getCoach();
    if (!c || c.hidden || (!c.note && !c.routine)) return '';
    return `<div class="glass-card p-4 mb-4 border border-[#d4af37]/25">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0"><i data-lucide="message-circle" class="w-4 h-4 text-[#d4af37] shrink-0"></i><span class="text-[12px] font-bold text-white truncate">${t('Message from your coach')}</span></div>
                <button data-on-click="window.appActions.dismissCoach()" class="text-slate-400 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Dismiss'))}"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            ${c.routine ? `<div class="text-[12px] font-bold text-[#d4af37] mt-2">${esc(t('New routine from your coach: {name}', { name: c.routine }))}</div>` : ''}
            ${c.note ? `<p class="text-[12px] font-bold text-slate-300 leading-snug mt-2" style="white-space:pre-wrap">${esc(c.note)}</p>` : ''}
            ${getCoachLink() ? `<button data-on-click="window.appActions.openChat()" class="mt-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[12px] font-bold tap-feedback flex items-center gap-2"><i data-lucide="message-circle" class="w-4 h-4"></i>${t('Reply')}</button>` : ''}
        </div>`;
};

// 🔋 DAILY CHECK-IN (readiness). Each answer scores 0-2; total 0-6.
const READY_KEY = 'workoutReadiness_rakan_final';
const dateKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const getReadinessAll = () => { const v = readJSON(READY_KEY, {}); return isObj(v) ? v : {}; };
// check-ins from the cloud: only real dates and answers 0-2, last 60 days
const sanitizeReadiness = raw => {
    const out = {}, cutoff = dateKey(Date.now() - 60 * 86400000);
    if (isObj(raw)) Object.keys(raw).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k) && k >= cutoff).forEach(k => {
        const r = raw[k];
        if (isObj(r) && [r.sleep, r.soreness, r.energy].every(x => x === 0 || x === 1 || x === 2)) out[k] = { sleep: r.sleep, soreness: r.soreness, energy: r.energy };
    });
    return out;
};
const getReadinessToday = () => {
    const r = getReadinessAll()[dateKey()];
    if (!isObj(r) || ![r.sleep, r.soreness, r.energy].every(x => x === 0 || x === 1 || x === 2)) return null;
    const score = r.sleep + r.soreness + r.energy;
    return { ...r, score, level: score >= 5 ? 'high' : score >= 3 ? 'normal' : 'low' };
};

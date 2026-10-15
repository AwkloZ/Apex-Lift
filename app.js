(() => {
    'use strict';

    // Escapes any value for safe use inside HTML text or attributes
    const esc = str => (str === null || str === undefined ? '' : String(str)).replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t]));
    // Turns a value into a safe JS string argument for inline handlers, e.g. onclick="fn(${jsArg(name)})"
    // (handles names like "Farmer's Walk" and blocks code hidden in imported backups)
    const jsArg = v => esc(JSON.stringify(v === null || v === undefined ? '' : String(v)));

    // 📦 1. MINIFIED DATA (Cleaned Dictionary & Standardized Presets)
    const muscleOptions=["Abductors","Abs","Adductors","Back","Biceps","Calves","Chest","Forearms","Front Delts","Glutes","Hamstrings","Lats","Lower Back","Lower Chest","Neck","Quads","Rear Delts","Shoulders","Side Delts","Traps","Triceps","Upper Chest"];
    
    const exerciseDictionary={
        "Abs":["Ab Wheel Rollout","Bicycle Crunch","Cable Crunch","Cable Woodchopper","Crunch","Dead Bug","Decline Crunch","Dragon Flag","Hanging Knee Raise","Hanging Leg Raise","Hollow Body Hold","Leg Raise","Machine Crunch","Plank","Reverse Crunch","Russian Twist","Sit-up","Toe Touch","V-up","Weighted Plank"],
        "Abductors":["Cable Hip Abduction","Clamshell","Fire Hydrant","Machine Hip Abduction","Seated Hip Abduction","Standing Leg Raise"],
        "Adductors":["Cable Hip Adduction","Copenhagen Plank","Machine Hip Adduction","Seated Hip Adduction"],
        "Back":["Barbell Row","Cable Low Row","Chest-Supported Row","Deadlift","Dumbbell Row","High Row Machine","Incline Dumbbell Row","Inverted Row","Iso-Lateral Row","Lat Pulldown","Low Row Machine","Machine Row","Meadows Row","Pendlay Row","Pull-up","Rack Pull","Renegade Row","Seal Row","Seated Cable Row","Single-Arm Cable Row","Single-Arm Machine Row","Smith Machine Row","T-Bar Row","V-Bar Pulldown"],
        "Biceps":["Barbell Curl","Bayesian Curl","Cable Curl","Cable Hammer Curl","Cable Rope Curl","Concentration Curl","Drag Curl","Dumbbell Curl","EZ Bar Curl","Hammer Curl","High Cable Curl","Incline Dumbbell Curl","Machine Bicep Curl","Machine Preacher Curl","Preacher Curl","Reverse Curl","Spider Curl","Zottman Curl"],
        "Calves":["Calf Press on Leg Press","Donkey Calf Raise","Machine Calf Press","Seated Calf Raise","Single Leg Calf Raise","Smith Machine Calf Raise","Standing Calf Raise","Tibialis Raise"],
        "Chest":["Bench Press","Cable Chest Press","Cable Crossover","Deficit Push-up","Dumbbell Bench Press","Dumbbell Fly","Dumbbell Pullover","Floor Press","Hex Press","Iso-Lateral Chest Press","Landmine Press","Machine Chest Press","Machine Fly","Pec Deck Fly","Push-up","Smith Machine Bench Press","Spoto Press"],
        "Forearms":["Behind the Back Wrist Curl","Farmers Walk","Plate Pinch","Reverse Barbell Curl","Reverse Dumbbell Curl","Wrist Curl","Wrist Extension","Wrist Roller"],
        "Front Delts":["Arnold Press","Barbell Front Raise","Cable Front Raise","Dumbbell Front Raise","Dumbbell Shoulder Press","Military Press","Overhead Press","Plate Front Raise","Seated Barbell Press","Smith Machine Shoulder Press"],
        "Glutes":["Barbell Glute Bridge","Cable Glute Kickback","Cable Pull-Through","Deficit Reverse Lunge","Frog Pump","Glute Bridge","Glute Drive Machine","Glute Kickback","Hip Thrust","Kettlebell Swing","Lunge","Reverse Lunge","Single Leg Hip Thrust","Smith Machine Hip Thrust","Step-up","Walking Lunge"],
        "Hamstrings":["Deficit Romanian Deadlift","Glute-Ham Raise","Good Morning","Hamstring Curl","Lying Leg Curl","Nordic Hamstring Curl","Romanian Deadlift","Seated Leg Curl","Single Leg Romanian Deadlift","Stiff-Legged Deadlift","Sumo Deadlift"],
        "Lats":["Assisted Pull-up","Chin-up","Close-Grip Lat Pulldown","Dumbbell Pullover","Lat Pulldown","Machine Pullover","Neutral Grip Pulldown","Pull-up","Reverse Grip Lat Pulldown","Single-Arm Cable Pulldown","Straight Arm Pulldown","Wide-Grip Lat Pulldown"],
        "Lower Back":["Back Extension","Bird Dog","Deadlift","Deficit Deadlift","Good Morning","Rack Pull","Romanian Deadlift","Sumo Deadlift","Superman"],
        "Lower Chest":["Cable Crossover","Chest Dip","Decline Bench Press","Decline Dumbbell Fly","Decline Dumbbell Press","Decline Push-up","Decline Smith Machine Press","High-to-Low Cable Fly"],
        "Neck":["Neck Curl","Neck Extension","Neck Lateral Flexion","Shrug"],
        "Quads":["Belt Squat","Box Squat","Bulgarian Split Squat","Cyclist Squat","Front Squat","Goblet Squat","Hack Squat","Hack Squat Machine","Leg Extension","Leg Press","Paused Squat","Pendulum Squat","Pistol Squat","Sissy Squat","Smith Machine Squat","Split Squat","Squat","Step-up","V-Squat","Wall Sit","Zercher Squat"],
        "Rear Delts":["Cable Rear Delt Fly","Dumbbell Rear Delt Row","Facepull","Lying Rear Delt Fly","Machine Reverse Fly","Rear Delt Fly","Reverse Pec Deck","Rope Facepull"],
        "Shoulders":["Arnold Press","Bradford Press","Cable Lateral Raise","Dumbbell Shoulder Press","Lateral Raise","Machine Shoulder Press","Military Press","Overhead Press","Push Press","Seated Dumbbell Press","Smith Machine Shoulder Press","Upright Row","Z Press"],
        "Side Delts":["Cable Lateral Raise","Cable Y-Raise","Dumbbell Lateral Raise","Egyptian Lateral Raise","Lean-Away Lateral Raise","Machine Lateral Raise","Upright Row"],
        "Traps":["Barbell Shrug","Cable Shrug","Dumbbell Shrug","Farmers Walk","Hex Bar Shrug","Shrug","Smith Machine Shrug","Snatch Grip Shrug","Upright Row"],
        "Triceps":["Assisted Dip","Cable Tricep Kickback","Close-Grip Bench Press","Close-Grip Push-up","Cross-Body Cable Extension","Diamond Push-up","Dumbbell Tricep Extension","JM Press","Katana Extension","Machine Tricep Extension","Overhead Tricep Extension","Single-Arm Tricep Extension","Skull Crusher","Tate Press","Tricep Dip","Tricep Extension","Tricep Pushdown","Tricep Rope Pushdown","V-Bar Tricep Pushdown"],
        "Upper Chest":["Incline Bench Press","Incline Cable Fly","Incline Dumbbell Fly","Incline Dumbbell Press","Incline Machine Press","Incline Push-up","Incline Smith Machine Press","Low-to-High Cable Fly"]
    };    
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

    const compoundLifts = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Front Squat', 'Incline Bench Press', 'Romanian Deadlift', 'Barbell Row', 'T-Bar Row'];

    // 🛡️ DATA VALIDATION (used for saved data and imported backup files)
    const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    const toStr = (v, fb = '') => (typeof v === 'string' || typeof v === 'number') ? String(v) : fb;

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
                    title: toStr(d.title, 'New Day'),
                    isRest,
                    recoveryType: isRest ? (d.recoveryType === 'active' ? 'active' : 'complete') : null,
                    savedTitle: toStr(d.savedTitle),
                    exercises: Array.isArray(d.exercises) ? d.exercises.filter(isObj).map(ex => ({
                        muscle: toStr(ex.muscle, 'Muscle'), name: toStr(ex.name, 'New Exercise'), sets: toStr(ex.sets, '3'), reps: toStr(ex.reps, '10')
                    })) : []
                };
            });
            let id = toStr(w.id) || `w_${Date.now()}_${wi}`;
            while (cleanWeeks.some(x => x.id === id)) id += '_';
            cleanWeeks.push({ id, name: toStr(w.name, 'Routine'), schedule });
        });
        return cleanWeeks.length ? { weeks: cleanWeeks.slice(0, 5) } : null;
    };

    // Returns a clean { exerciseKey: [logs] } history object
    const sanitizeHistory = raw => {
        const out = {};
        if (!isObj(raw)) return out;
        Object.keys(raw).forEach(k => {
            if (!Array.isArray(raw[k])) return;
            const logs = raw[k].filter(l => isObj(l) && typeof l.d === 'string').map(l => {
                const s = Array.isArray(l.s) ? l.s.map(x => parseInt(x)).filter(x => !isNaN(x)) : toStr(l.s);
                const log = { d: l.d, w: toStr(l.w), s };
                if (l.time !== undefined) log.time = toStr(l.time);
                if (l.week !== undefined) log.week = toStr(l.week);
                if (typeof l.ts === 'number' && isFinite(l.ts)) log.ts = l.ts;
                if (typeof l.dayId === 'number' && l.dayId >= 1 && l.dayId <= 7) log.dayId = l.dayId;
                if (l.weekId !== undefined) log.weekId = toStr(l.weekId);
                if (l.u === 's') log.u = 's';
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
        Object.keys(raw).forEach(k => { const v = toStr(raw[k], null); if (v !== null) out[k] = v; });
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
    // Writes safely: shows a message instead of failing silently when storage is full.
    const writeItem = (key, value) => {
        try { localStorage.setItem(key, value); return true; }
        catch (e) {
            console.error(`Could not save "${key}"`, e);
            if (window.appActions) window.appActions.showToast("Storage full: data not saved. Backup & delete old records.", "error");
            return false;
        }
    };

    const StorageManager = {
        KEY: 'workoutWeights_rakan_final', REPS_KEY: 'workoutReps_rakan_final', HIST_KEY: 'workoutHistory_rakan_final', PLAN_KEY: 'workoutPlan_rakan_final_v3', START_KEY: 'workoutStartDay_rakan_final', BACKUP_DATE: 'workoutLastBackup_rakan_final', ACTIVE_WEEK: 'workoutActiveWeek_rakan_final', AUTO_SYNC: 'workoutAutoSync_rakan_final', LAST_DAY: 'workoutLastDay_rakan_final', ONBOARD_KEY: 'workoutOnboard_rakan_final',
        get: () => { const v = readJSON(StorageManager.KEY, {}); return isObj(v) ? v : {}; }, set: d => writeItem(StorageManager.KEY, JSON.stringify(d)),
        getReps: () => { const v = readJSON(StorageManager.REPS_KEY, {}); return isObj(v) ? v : {}; }, setReps: d => writeItem(StorageManager.REPS_KEY, JSON.stringify(d)),
        getHistory: () => { const v = readJSON(StorageManager.HIST_KEY, {}); return isObj(v) ? v : {}; }, setHistory: d => writeItem(StorageManager.HIST_KEY, JSON.stringify(d)),
        getPlan: () => readJSON(StorageManager.PLAN_KEY, null), setPlan: d => writeItem(StorageManager.PLAN_KEY, JSON.stringify(d)),
        getStartDay: () => { const v = localStorage.getItem(StorageManager.START_KEY); return DAY_NAMES.includes(v) ? v : 'SAT'; }, setStartDay: v => localStorage.setItem(StorageManager.START_KEY, v),
        getActiveWeek: () => localStorage.getItem(StorageManager.ACTIVE_WEEK), setActiveWeek: v => localStorage.setItem(StorageManager.ACTIVE_WEEK, v),
        getBackupDate: () => parseInt(localStorage.getItem(StorageManager.BACKUP_DATE)) || 0, setBackupDate: () => localStorage.setItem(StorageManager.BACKUP_DATE, Date.now()),
        getAutoSync: () => localStorage.getItem(StorageManager.AUTO_SYNC) !== 'false', setAutoSync: v => localStorage.setItem(StorageManager.AUTO_SYNC, v),
        getLastDay: () => parseInt(localStorage.getItem(StorageManager.LAST_DAY)) || 0, setLastDay: v => localStorage.setItem(StorageManager.LAST_DAY, v),
        getOnboard: () => localStorage.getItem(StorageManager.ONBOARD_KEY) === 'true', setOnboard: () => localStorage.setItem(StorageManager.ONBOARD_KEY, 'true')
    };

    const getExKey = (w, d, i, n) => (n||'').trim() === '' || (n||'').trim() === 'New Exercise' ? `temp_${w}_${d}_${i}` : `global_${(n||'').trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // 📅 DATES
    // New logs store `ts` (a timestamp). Older logs only have the text date `d` ("15 Oct 2026 • 5:03 PM"),
    // which we read with our own parser instead of relying on the browser (handles "Sept", missing year, etc).
    const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const parseLogDate = str => {
        if (typeof str !== 'string') return NaN;
        const [datePart, timePart = ''] = str.split('•').map(x => x.trim());
        const m = datePart.match(/(\d{1,2})\s+([A-Za-z]+)\.?(?:\s+(\d{4}))?/);
        if (!m) { const t = Date.parse(datePart); return isNaN(t) ? NaN : t; }
        const mon = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
        if (mon < 0) return NaN;
        const year = m[3] ? parseInt(m[3]) : new Date().getFullYear();
        let h = 12, min = 0;
        const tm = timePart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (tm) { h = parseInt(tm[1]); min = parseInt(tm[2]); if (tm[3]) h = (h % 12) + (tm[3].toUpperCase() === 'PM' ? 12 : 0); }
        return new Date(year, mon, parseInt(m[1]), h, min).getTime();
    };
    const logTime = log => typeof log.ts === 'number' ? log.ts : parseLogDate(log.d);
    const startOfDay = t => { const d = new Date(t); d.setHours(0,0,0,0); return d.getTime(); };
    const isToday = t => !isNaN(t) && startOfDay(t) === startOfDay(Date.now());
    const formatLogDate = n => { const hr = n.getHours(); return `${n.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} • ${hr%12||12}:${n.getMinutes().toString().padStart(2,'0')} ${hr>=12?'PM':'AM'}`; };

    // 🏋️ SETS, SESSIONS & PROGRESSION (one rule shared by the Workout tab and the Analytics tab)
    const logSets = log => Array.isArray(log.s) ? log.s.map(x => parseInt(x)).filter(x => x > 0) : (parseInt(log.s) > 0 ? [parseInt(log.s)] : []);
    const parseRange = repsStr => {
        const m = (repsStr || '').match(/(\d+)\s*-\s*(\d+)/);
        let minR = m ? parseInt(m[1]) : parseInt(repsStr), maxR = m ? parseInt(m[2]) : parseInt(repsStr);
        if (isNaN(minR)) minR = 8; if (isNaN(maxR)) maxR = 12;
        return { minR, maxR };
    };
    // Timed exercises use seconds instead of reps, e.g. "30 - 45s" or "60 sec"
    const isTimed = repsStr => /\d\s*(s|sec|secs|seconds)\s*$/i.test((repsStr || '').trim());
    const unitOf = repsStr => isTimed(repsStr) ? 's' : '';
    // Exercises that can be logged without a load (0 / empty = bodyweight)
    const BODYWEIGHT = ['Bicycle Crunch','Bird Dog','Chest Dip','Chin-up','Clamshell','Close-Grip Push-up','Copenhagen Plank','Crunch','Dead Bug','Decline Crunch','Decline Push-up','Deficit Push-up','Diamond Push-up','Dragon Flag','Fire Hydrant','Glute Bridge','Glute-Ham Raise','Hanging Knee Raise','Hanging Leg Raise','Hollow Body Hold','Incline Push-up','Inverted Row','Leg Raise','Nordic Hamstring Curl','Pistol Squat','Plank','Pull-up','Push-up','Reverse Crunch','Russian Twist','Sissy Squat','Sit-up','Superman','Toe Touch','Tricep Dip','V-up','Wall Sit','Back Extension','Frog Pump','Standing Leg Raise','Neck Curl','Neck Extension','Neck Lateral Flexion'];
    const isBodyweight = name => BODYWEIGHT.includes((name || '').trim());
    const fmtW = w => (parseFloat(w) > 0 ? `${parseFloat(w)}kg` : 'BW');

    // The last training session: all logs from the most recent day are combined into one session
    const getLastSession = (hA, skipToday = false) => {
        const logs = (hA || []).filter(l => !isNaN(logTime(l)) && !(skipToday && isToday(logTime(l))));
        if (!logs.length) return null;
        const last = logs[logs.length - 1], day = startOfDay(logTime(last));
        const sameDay = logs.filter(l => startOfDay(logTime(l)) === day);
        const sets = sameDay.flatMap(logSets);
        return sets.length ? { w: parseFloat(last.w) || 0, sets } : null;
    };
    // Rule: Level Up when EVERY set reached the top of the range, Deload when even the BEST set
    // was below the bottom of the range, otherwise Build (+1 rep on your weakest set).
    const getProgression = (session, repsStr) => {
        if (!session || !session.sets.length) return null;
        const { minR, maxR } = parseRange(repsStr);
        const w = session.w, low = Math.min(...session.sets), best = Math.max(...session.sets);
        if (low >= maxR) return { type: 'up', w, sets: session.sets, minR, maxR, tW: w + 2.5, tR: minR };
        if (best < minR) return { type: 'down', w, sets: session.sets, minR, maxR, tW: Math.round(w * 0.9 * 10) / 10, tR: maxR };
        return { type: 'build', w, sets: session.sets, minR, maxR, tW: w, tR: Math.min(low + 1, maxR) };
    };

    // ⚙️ 3. APP INITIALIZATION
    const savedPlan = StorageManager.getPlan();
    let appData = sanitizePlan(savedPlan);
    if (!appData) {
        // Saved plan missing or unusable: keep a copy of the unusable one, then start from the default plan
        if (savedPlan !== null) { try { localStorage.setItem(StorageManager.PLAN_KEY + '_damaged', JSON.stringify(savedPlan)); } catch (e) {} }
        appData = { weeks: [{ id: 'w_' + Date.now(), name: 'Week 1', schedule: JSON.parse(JSON.stringify(defaultWorkoutData)) }] };
    }
    let currentWeekId = StorageManager.getActiveWeek() || appData.weeks[0].id;
    if (!appData.weeks.find(w => w.id === currentWeekId)) { currentWeekId = appData.weeks[0].id; StorageManager.setActiveWeek(currentWeekId); }
    
window.appState = { menuOpen: false, currentView: 'workout', editMode: false, hasShownSetupToast: false, sortableInstance: null, mappingConfig: null, onboardSlide: 0, awKey: null, awTimer: null, awSeconds: 0 };    let loggedWeights = StorageManager.get();    let loggedReps = StorageManager.getReps();

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

    const isDayCompleted = (d, history = StorageManager.getHistory()) => {
        if (d.isRest) return true;
        if (!d.exercises || d.exercises.length === 0) return false;
        return d.exercises.every((ex, i) => {
            const k = getExKey(currentWeekId, d.id, i, ex.name);
            return setsThisWeekForDay(history[k], d.id) >= (parseInt(ex.sets) || 0);
        });
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

    let activeDay = StorageManager.getAutoSync() ? getTodayId() : (StorageManager.getLastDay() || getTodayId());
    const firstEmpty = getActiveSchedule().find(isDayIncomplete);
    if (firstEmpty) { activeDay = firstEmpty.id; window.appState.editMode = true; }
    StorageManager.setLastDay(activeDay);

    // Dropdown of exercises for a muscle (all exercises if the muscle isn't in the dictionary)
    const exerciseListHTML = (idx, muscle) => (exerciseDictionary[Object.keys(exerciseDictionary).find(k => k.toLowerCase() === (muscle || '').toLowerCase().trim())] || exerciseOptions)
        .map(e => `<button type="button" onclick="window.appActions.selectOption(${idx},'name',${jsArg(e)})" class="w-full text-left p-3 text-[14px] font-bold active:bg-[#d4af37]/20 border-b border-white/5 last:border-0">${esc(e)}</button>`).join('');

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
        setTimeout(() => { o.classList.add('hidden'); o.classList.remove('flex'); if (after) after(); }, ms);
    };

    // 🎨 4. CORE UI RENDERING
    const renderSidePanel = () => {
        document.getElementById('weeks-container').innerHTML = appData.weeks.map(w => `<div class="flex items-center gap-3 bg-black/40 p-3 rounded-xl border ${w.id===currentWeekId?'border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]':'border-white/5'} transition-all"><input type="text" value="${esc(w.name)}" onchange="window.appActions.renameWeek(${jsArg(w.id)}, this.value)" class="bg-transparent text-white text-[13px] font-bold uppercase tracking-wider w-full outline-none">${w.id===currentWeekId?`<span class="text-[#22c55e] text-[9px] font-black tracking-widest uppercase shrink-0">Active</span>`:`<button onclick="window.appActions.switchWeek(${jsArg(w.id)})" class="text-slate-400 hover:text-white text-[10px] font-bold tracking-widest uppercase tap-feedback shrink-0 px-2 py-1 bg-white/5 rounded-lg">Select</button>`}${appData.weeks.length>1?`<button onclick="window.appActions.deleteWeek(${jsArg(w.id)})" class="text-red-400 hover:text-red-300 tap-feedback p-1 bg-red-500/10 rounded-lg shrink-0 border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`).join('');
        document.getElementById('active-week-label').innerText = appData.weeks.find(w => w.id === currentWeekId).name;
        if(window.lucide) window.lucide.createIcons();
    };

    const renderNav = (shouldScroll = true) => {
        const schedule = getActiveSchedule();
        if (schedule.find(isDayIncomplete) && !window.appState.hasShownSetupToast) { window.appState.hasShownSetupToast = true; requestAnimationFrame(() => window.appActions.showToast("Schedule Incomplete: Set up empty days.", "error")); }
        const history = StorageManager.getHistory();
        document.getElementById('nav-container').innerHTML = schedule.map(d => {
            const comp = isDayCompleted(d, history);
            const checkHTML = comp && !d.isRest ? `<div class="absolute -top-1 -right-1 w-4 h-4 bg-[#22c55e] rounded-full flex items-center justify-center shadow-md border-[1.5px] border-black z-10"><i data-lucide="check" class="w-2.5 h-2.5 text-black"></i></div>` : '';
            return `<button onclick="window.appActions.setActiveDay(${d.id})" class="snap-start tap-feedback nav-pill px-5 py-4 min-w-[100px] transition-all relative ${activeDay===d.id?'active-day shadow-lg':'bg-white/5'} ${activeDay!==d.id&&(getTodayId()===d.id&&!isDayIncomplete(d)?'gold-corners':(isDayIncomplete(d)?'border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse':'border border-white/5'))}">${checkHTML}<div class="text-[8px] font-bold uppercase ${activeDay===d.id?'text-black/60':(isDayIncomplete(d)?'text-red-400':'text-[#d4af37]')} mb-1">${esc(d.day)}</div><div class="font-black text-[14px] uppercase tracking-tighter ${activeDay===d.id?'text-black':'text-white'}">DAY ${d.id}</div></button>`;
        }).join('');
        renderSidePanel();
        
        if (shouldScroll) {
            setTimeout(() => { const b = document.querySelector('.active-day'); if(b) b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); }, 50);
        }
    };

    const renderAnalytics = () => {
        const history = StorageManager.getHistory();
        const c = document.getElementById('workout-container');
        
        const activeTab = window.appState.aTab || 'action';
        
        const pG = {
            'CHEST': { l: 'Chest', s: 0, c: 0, ex: {} }, 'BACK': { l: 'Back', s: 0, c: 0, ex: {} },
            'FDELTS': { l: 'Front Delts', s: 0, c: 0, ex: {} }, 'SDELTS': { l: 'Side Delts', s: 0, c: 0, ex: {} }, 'RDELTS': { l: 'Rear Delts', s: 0, c: 0, ex: {} },
            'BICEPS': { l: 'Biceps', s: 0, c: 0, ex: {} }, 'TRICEPS': { l: 'Triceps', s: 0, c: 0, ex: {} },
            'QUADS': { l: 'Quads', s: 0, c: 0, ex: {} }, 'HAMS': { l: 'Hamstrings', s: 0, c: 0, ex: {} }, 'CALVES': { l: 'Calves', s: 0, c: 0, ex: {} },
            'GLUTES': { l: 'Glutes', s: 0, c: 0, ex: {} },
            'ABS': { l: 'Abs & Core', s: 0, c: 0, ex: {} },
            'FOREARMS': { l: 'Forearms', s: 0, c: 0, ex: {} }
        };

        let actionItems = {}; 
        let processedExKeys = new Set();
        const now = new Date();
        now.setHours(0,0,0,0);
        
        getActiveSchedule().forEach(d => { if(!d.isRest && d.exercises) d.exercises.forEach((ex,i) => {
            const k = getExKey(currentWeekId, d.id, i, ex.name);
            const h = history[k] || [];
            
            // Same rule as the Workout tab (getProgression), based on your latest session
            if (!actionItems[ex.name]) {
                const prog = getProgression(getLastSession(h), ex.reps);
                if (prog) actionItems[ex.name] = { muscle: ex.muscle, unit: unitOf(ex.reps), ...prog };
            }

            const rawSets = parseInt(ex.sets);
            const s = isNaN(rawSets) ? 0 : rawSets; 
            
            let cSets = 0;
            if (!processedExKeys.has(k)) {
                processedExKeys.add(k);
                h.forEach(log => {
                    const t = logTime(log);
                    if (isNaN(t)) return;
                    const diff = Math.round((now - startOfDay(t)) / 86400000);
                    const nSets = logSets(log).length;
                    
                    if(diff >= 0 && diff <= 6) cSets += nSets; // last 7 days
                });
            }

            const safeMuscle = ex.muscle || 'Unknown';
            const rm = safeMuscle.trim().toUpperCase(), n = ex.name||'Unknown';
            let p = null;
            if(rm.includes('CHEST')||rm==='PECS') p = 'CHEST';
            else if(rm.includes('BACK')||rm==='LATS'||rm==='TRAPS') p = 'BACK';
            else if(rm.includes('SIDE DELT')) p = 'SDELTS';
            else if(rm.includes('FRONT DELT')||rm.includes('SHOULDER')) p = 'FDELTS';
            else if(rm.includes('REAR DELT')) p = 'RDELTS';
            else if(rm.includes('BICEP')) p = 'BICEPS';
            else if(rm.includes('TRICEP')) p = 'TRICEPS';
            else if(rm.includes('QUAD')) p = 'QUADS';
            else if(rm.includes('HAMSTRING')||rm.includes('LEG CURL')||rm.includes('POST. CHAIN')) p = 'HAMS';
            else if(rm.includes('CALF')||rm.includes('CALVES')) p = 'CALVES';
            else if(rm.includes('GLUTE')||rm==='ABDUCTORS'||rm==='ADDUCTORS') p = 'GLUTES';
            else if(rm==='ABS'||rm==='CORE'||rm==='OBLIQUES') p = 'ABS';
            else if(rm.includes('FOREARM')) p = 'FOREARMS';
            
            if(p && pG[p]) { pG[p].s += s; pG[p].c += cSets; pG[p].ex[n] = (pG[p].ex[n]||0) + s; }
        });});

        let actionLevelUp = [], actionBuild = [], actionDeload = [];
        Object.keys(actionItems).forEach(name => {
            const item = { name, ...actionItems[name] };
            if (item.type === 'up') actionLevelUp.push(item);
            else if (item.type === 'build') actionBuild.push(item);
            else if (item.type === 'down') actionDeload.push(item);
        });

        const createAccordionBar = (key, g) => {
            const comp = isNaN(g.c) ? 0 : (g.c % 1 !== 0 ? g.c.toFixed(1) : g.c);
            const plan = isNaN(g.s) ? 0 : (g.s % 1 !== 0 ? g.s.toFixed(1) : g.s);
            const pct = plan > 0 ? Math.min((comp / plan) * 100, 100) : (comp > 0 ? 100 : 0);

            const isDone = plan > 0 && comp >= plan;
            const clr = isDone ? 'bg-[#22c55e]' : (comp > 0 ? 'bg-[#d4af37]' : 'bg-slate-500');

            const exTags = Object.keys(g.ex).length > 0 ? `<div class="flex flex-wrap gap-2 mt-4">` + Object.keys(g.ex).map(eName => `<span class="bg-black/40 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-300 flex items-center gap-1.5">${esc(eName)} <span class="text-white">${g.ex[eName]}s</span></span>`).join('') + `</div>` : `<div class="text-[10px] text-slate-500 italic mt-3">No exercises scheduled.</div>`;

            return `<div class="mb-2 bg-white/5 rounded-2xl overflow-hidden transition-all duration-300 border border-white/5">
                <button onclick="document.getElementById('det-${key}').classList.toggle('hidden'); document.getElementById('arr-${key}').classList.toggle('rotate-180')" class="w-full text-left p-4 tap-feedback outline-none flex justify-between items-center group">
                    <div class="flex items-center gap-3 w-full">
                        <div class="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/5 shrink-0">
                            <i data-lucide="activity" class="w-4 h-4 ${isDone ? 'text-[#22c55e]' : (comp > 0 ? 'text-[#d4af37]' : 'text-slate-500')}"></i>
                        </div>
                        <span class="text-[14px] font-black text-white tracking-wide">${g.l}</span>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <div class="text-right">
                            <div class="text-[12px] font-black ${comp > 0 ? 'text-white' : 'text-slate-500'} leading-none">${comp} <span class="text-[8px] text-slate-500">LOGGED</span></div>
                            <div class="text-[9px] font-bold text-slate-500 mt-1 leading-none">OF ${plan} SETS</div>
                        </div>
                        <i id="arr-${key}" data-lucide="chevron-down" class="w-4 h-4 text-slate-500 transition-transform duration-300 group-hover:text-white"></i>
                    </div>
                </button>
                <div id="det-${key}" class="hidden px-4 pb-4">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion</span>
                        <span class="text-[10px] font-black text-white">${Math.round(pct)}%</span>
                    </div>
                    <div class="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                        <div class="${clr} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style="width: ${pct}%;"></div>
                    </div>
                    ${exTags}
                </div>
            </div>`;
        };

        const createActionItem = (item, type) => {
            let badge = '', actionTxt = '';
            const u = item.unit === 's' ? 'SEC' : 'REPS', us = item.unit;
            const wBadge = w => w > 0 ? `<span class="block text-[14px] leading-none mb-0.5">${w}</span><span class="text-[7px]">KG</span>` : `<span class="block text-[14px] leading-none mb-0.5">BW</span><span class="text-[7px]">&nbsp;</span>`;
            if (type === 'up') {
                badge = `<div class="bg-[#22c55e]/10 text-[#22c55e] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#22c55e]/20 text-center shadow-sm w-[55px]">${wBadge(item.tW)}</div>`;
                actionTxt = `<span class="text-[#22c55e] shrink-0 whitespace-nowrap"><i data-lucide="arrow-up" class="w-3 h-3 inline -mt-0.5"></i> Target: ${fmtW(item.tW)} × ${item.tR}${us}</span>`;
            } else if (type === 'build') {
                badge = `<div class="bg-[#3b82f6]/10 text-[#3b82f6] py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#3b82f6]/20 text-center shadow-sm w-[55px]"><span class="block text-[14px] leading-none mb-0.5">${item.tR}</span><span class="text-[7px]">${u}</span></div>`;
                actionTxt = `<span class="text-[#3b82f6] shrink-0 whitespace-nowrap"><i data-lucide="refresh-cw" class="w-3 h-3 inline -mt-0.5"></i> Target: ${fmtW(item.tW)} × ${item.tR}${us}</span>`;
            } else if (type === 'down') {
                badge = `<div class="bg-red-500/10 text-red-400 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20 text-center shadow-sm w-[55px]">${wBadge(item.tW)}</div>`;
                actionTxt = `<span class="text-red-400 shrink-0 whitespace-nowrap"><i data-lucide="arrow-down" class="w-3 h-3 inline -mt-0.5"></i> Target: ${fmtW(item.tW)} × ${item.tR}${us}</span>`;
            }

            return `
            <div class="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl mb-2 last:mb-0 gap-2">
                <div class="flex-1 min-w-0">
                    <div class="text-[14px] font-black text-white leading-tight mb-1 truncate w-full">${esc(item.name)}</div>
                    <div class="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest truncate w-full">
                        <span class="text-slate-500 truncate shrink">${esc(item.muscle)}</span>
                        <span class="w-1 h-1 rounded-full bg-slate-700 shrink-0"></span>
                        ${actionTxt}
                    </div>
                </div>
                <div class="shrink-0 flex items-center gap-3">
                    <div class="text-right w-[60px]">
                        <div class="text-[12px] font-black text-slate-300 truncate">${item.w > 0 ? `${item.w}<span class="text-[8px] text-slate-500">KG</span>` : 'BW'}</div>
                        <div class="text-[10px] font-bold text-slate-400 mt-0.5 truncate" title="${esc(item.sets.join(' / '))}">× ${esc(item.sets.join('/'))}${us}</div>
                    </div>
                    ${badge}
                </div>
            </div>`;
        };

        const renderActionSection = (arr, title, type, icon, colorHex) => {
            if (arr.length === 0) return '';
            return `
            <div class="glass-card p-4 mb-4 relative overflow-hidden" style="-webkit-mask-image: -webkit-radial-gradient(white, black);">
                <div class="absolute -right-4 -top-4 w-16 h-16 bg-[${colorHex}]/10 rounded-full blur-xl pointer-events-none"></div>
                <div class="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 relative z-10">
                    <div class="w-7 h-7 rounded-lg bg-[${colorHex}]/10 flex items-center justify-center text-[${colorHex}] shadow-sm">
                        <i data-lucide="${icon}" class="w-4 h-4"></i>
                    </div>
                    <span class="text-[13px] font-black uppercase tracking-widest text-white drop-shadow-md">${title}</span>
                </div>
                <div class="flex justify-between items-center px-1 mb-2 text-[8px] font-black text-slate-500 uppercase tracking-widest relative z-10">
                    <span class="pl-1">Exercise</span>
                    <div class="flex gap-3">
                        <span class="w-[60px] text-right">Last Log</span>
                        <span class="w-[55px] text-center">Target</span>
                    </div>
                </div>
                <div class="relative z-10">${arr.map(i => createActionItem(i, type)).join('')}</div>
            </div>`;
        };

        const tabBtn = (id, label) => `<button onclick="window.appState.aTab='${id}';window.appActions.refreshUI()" class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors tap-feedback ${activeTab===id ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-slate-500 hover:text-white'}">${label}</button>`;
        const tabsHTML = `<div class="flex gap-2 border-b border-white/5 mb-5 px-1 overflow-x-auto scrollbar-hide pb-1 shrink-0">${tabBtn('action', 'Action Plan')}${tabBtn('hyper', 'Workload Tracking')}</div>`;
        let contentHTML = '';

        if (activeTab === 'action') {
            const levelUpHTML = renderActionSection(actionLevelUp, 'Ready to Level Up', 'up', 'arrow-up-circle', '#22c55e');
            const buildHTML = renderActionSection(actionBuild, 'Build Reps', 'build', 'refresh-cw', '#3b82f6');
            const deloadHTML = renderActionSection(actionDeload, 'Fatigue Warning', 'down', 'alert-triangle', '#ef4444');

            contentHTML = (levelUpHTML || buildHTML || deloadHTML) ? `${levelUpHTML}${buildHTML}${deloadHTML}` : `
                <div class="glass-card p-8 text-center border border-white/5">
                    <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="activity" class="w-6 h-6 text-[#d4af37]"></i></div>
                    <div class="text-[14px] font-black text-white uppercase tracking-wider mb-2">Action Plan Empty</div>
                    <p class="text-[11px] text-slate-400 leading-relaxed font-medium">Complete a workout and log your sets. The app will analyze your performance and generate smart weight recommendations here.</p>
                </div>`;
        } 
        else if (activeTab === 'hyper') {
            let activeKeys = Object.keys(pG).filter(k => pG[k].s > 0 || pG[k].c > 0);
            activeKeys.sort((a,b) => pG[b].c - pG[a].c);
            
            contentHTML = `
                <div class="glass-card p-4 sm:p-6 mb-4">
                    <div class="flex items-center mb-6 pb-4 border-b border-white/5 pl-1">
                        <i data-lucide="activity" class="w-4 h-4 text-[#d4af37] mr-2"></i>
                        <span class="text-[14px] font-black uppercase tracking-[3px] text-white mt-0.5">Workload Tracking</span>
                    </div>
                    <div class="flex flex-col">
                        ${activeKeys.map(k => createAccordionBar(k, pG[k])).join('')}
                    </div>
                </div>
                ${activeKeys.length === 0 ? `
                <div class="glass-card p-8 text-center border border-white/5 mt-4">
                    <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="layers" class="w-6 h-6 text-[#d4af37]"></i></div>
                    <div class="text-[14px] font-black text-white uppercase tracking-wider mb-2">No Volume Detected</div>
                    <p class="text-[11px] text-slate-400 leading-relaxed font-medium">Build a routine with exercises to see your weekly workload goals.</p>
                </div>` : ''}`;
        }

        c.innerHTML = `<div class="fade-in pb-10">${tabsHTML}${contentHTML}</div>`;
        if (window.lucide) window.lucide.createIcons();
    };
    const renderWorkout = () => {
        const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), isE = window.appState.editMode;
        const allHistory = StorageManager.getHistory();
        
        let html = `<div class="px-2 mb-4 flex justify-between items-center gap-3 h-10">${isE&&!day.isRest?`<input type="text" value="${esc(day.title)}" onfocus="if(this.value==='New Day')this.value='';" onchange="window.appActions.updateDayTitle(this.value)" class="flex-1 bg-transparent border-b-2 border-[#d4af37]/50 text-2xl font-black uppercase text-[#d4af37] outline-none h-full pb-1 leading-none">`:`<h2 class="flex-1 font-black text-2xl uppercase text-white truncate h-full flex items-end pb-1 border-b-2 border-transparent leading-none">${esc(day.title)}</h2>`}<button onclick="window.appActions.toggleEditMode(event)" class="text-[#d4af37] tap-feedback bg-white/5 rounded-xl border border-white/10 shrink-0 h-10 w-10 flex items-center justify-center"><i data-lucide="${isE?'check':'edit-2'}" class="w-5 h-5"></i></button></div>`;if (isE) {
            const opts = schedule.filter(d => d.id !== activeDay).map(d => `<option value="${d.id}">Day ${d.id}</option>`).join('');
            html += `
            <div class="px-2 mb-6 grid grid-cols-${day.isRest ? 3 : 4} gap-2">
                <div class="relative tap-feedback">
                    <select onchange="if(this.value)window.appActions.applyPreset(this.value);this.value='';" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="">Custom Week...</option><option value="PPL">PPL Split (6-Days)</option><option value="UL">Upper/Lower (4-Days)</option><option value="FB">Full Body (3-Days)</option></select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="zap" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">Template</span></div>
                </div>
                <div class="relative tap-feedback">
                    <select onchange="window.appActions.updateDayType(this.value)" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="workout" ${!day.isRest ? 'selected' : ''}>Workout</option><option value="active" ${day.isRest && day.recoveryType === 'active' ? 'selected' : ''}>Active Rest</option><option value="complete" ${day.isRest && day.recoveryType === 'complete' ? 'selected' : ''}>Complete Rest</option></select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="settings-2" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">Mode</span></div>
                </div>
                <div class="relative tap-feedback">
                    <select onchange="if(this.value){window.appActions.swapDay(parseInt(this.value));this.value='';}" class="absolute inset-0 w-full h-full opacity-0 z-10"><option value="">Swap...</option>${opts}</select>
                    <div class="glass-card flex flex-col items-center justify-center h-14 rounded-xl border border-white/10 bg-white/5"><i data-lucide="arrow-left-right" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">Swap</span></div>
                </div>
                ${!day.isRest ? `<button onclick="window.appActions.clearDay()" class="w-full glass-card flex flex-col items-center justify-center h-14 rounded-xl text-red-400 border border-red-500/20 bg-red-500/10 z-10 relative tap-feedback"><i data-lucide="trash-2" class="w-4 h-4"></i><span class="text-[8px] font-black uppercase tracking-widest mt-1">Clear</span></button>` : ''}
            </div>`;
            
            // GLOBAL SETS & REPS EDITOR
            if (!day.isRest && day.exercises.length > 0) {
                html += `
                <div class="px-2 mb-4">
                    <div class="glass-card p-4 flex items-center justify-between gap-2 shadow-lg border border-[#d4af37]/30 bg-[#d4af37]/5">
                        <div class="text-[10px] font-black uppercase text-[#d4af37] tracking-widest flex items-center"><i data-lucide="copy" class="w-3.5 h-3.5 mr-1"></i> Edit All</div>
                        <div class="flex items-center gap-2">
                            <input type="text" id="global-sets" placeholder="Sets" class="w-14 bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                            <input type="text" id="global-reps" placeholder="Reps" class="w-14 bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                            <button onclick="window.appActions.applyGlobalSetsReps()" class="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest tap-feedback shadow-sm">Apply</button>
                        </div>
                    </div>
                </div>`;
            }
        }
        
        if (day.isRest) {
            if (!isE) html += `<div class="glass-card p-12 text-center border-dashed border-[#d4af37]/20"><div class="text-[#d4af37] flex justify-center mb-4"><i data-lucide="${day.recoveryType==='active'?'footprints':'moon'}" class="w-12 h-12 ${day.recoveryType==='active'?'animate-walk':'animate-pulse-glow'}"></i></div><h3 class="font-black text-xl uppercase mb-4">${day.recoveryType==='active'?'Active Rest':'Complete Rest'}</h3></div>`;
        } else {
            if (!isE && day.exercises.length === 0) {
                html += `<div class="glass-card p-10 text-center border-dashed border-white/10 mt-4"><div class="flex justify-center mb-4"><i data-lucide="clipboard-edit" class="w-10 h-10 text-slate-500 opacity-50"></i></div><h3 class="font-black text-lg uppercase text-slate-400 tracking-wider mb-2">Empty Day</h3><p class="text-[11px] font-bold text-slate-500 leading-relaxed">Tap the floating edit button to add exercises, apply a preset, or set as a Rest Day.</p></div>`;
            } else {
                html += `<div id="sortable-list">${day.exercises.map((ex, i) => {
                    const k = getExKey(currentWeekId, activeDay, i, ex.name), v = loggedWeights[k]||'', hT = exerciseOptions.includes(ex.name);
                    if (isE) {
                        const oList = exerciseListHTML(i, ex.muscle);
                        const mList = muscleOptions.map(m=>`<button type="button" onclick="window.appActions.selectOption(${i},'muscle',${jsArg(m)})" class="w-full text-left p-3 text-[14px] font-bold active:bg-[#d4af37]/20 border-b border-white/5 last:border-0">${esc(m)}</button>`).join('');
                        
                        // ✨ COMPACT EDIT MODE CARD (MATCHES NORMAL HEIGHT, NO AUTO-SCROLL)
                        return `
                        <div class="glass-card p-4 flex flex-col justify-center relative mb-4" style="z-index:${100-i};">
                            <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-3 gap-2 w-full">
                                <div class="handle p-3 -ml-3 -my-2 text-slate-500 flex items-center justify-center cursor-grab active:cursor-grabbing hover:text-white touch-none"><i data-lucide="grip-vertical" class="w-6 h-6 pointer-events-none"></i></div>
                                <div class="relative flex-1">
                                    <input type="text" id="m-in-${i}" value="${esc(ex.muscle)}" onfocus="if(this.value==='Muscle')this.value='';else this.select(); window.appActions.showList('m-list-${i}');" onblur="setTimeout(()=>{window.appActions.hideList('m-list-${i}');},100)" oninput="window.appActions.silentUpdateEx(${i},'muscle',this.value);window.appActions.filterList('m-list-${i}',this.value)" class="bg-transparent text-[#d4af37] text-[12px] font-black uppercase tracking-widest outline-none w-full" placeholder="Muscle">
                                    <div id="m-list-${i}" class="dropdown-list hidden absolute top-full left-0 w-full glass-card border border-white/10 rounded-xl mt-2 max-h-40 overflow-y-auto p-1">${mList}</div>
                                </div>
                                <button onclick="window.appActions.deleteEx(${i})" class="text-red-400 p-2 bg-red-500/10 rounded-xl border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </div>
                            <div class="space-y-2">
                                <div class="relative">
                                    <input type="text" id="e-in-${i}" value="${esc(ex.name)}" onfocus="if(this.value==='New Exercise')this.value='';else this.select(); window.appActions.showList('e-list-${i}');" onblur="setTimeout(()=>{window.appActions.hideList('e-list-${i}');},100)" oninput="window.appActions.silentUpdateEx(${i},'name',this.value);window.appActions.filterList('e-list-${i}',this.value)" class="bg-black/40 text-[16px] font-bold px-4 py-2.5 rounded-xl outline-none w-full border border-white/5" placeholder="Exercise Name">
                                    <div id="e-list-${i}" class="dropdown-list hidden absolute top-full left-0 w-full glass-card border border-white/10 rounded-xl mt-1 max-h-48 overflow-y-auto p-1">${oList}</div>
                                </div>
                                <div class="flex gap-2">
                                    <div class="flex-1 relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">Sets</span>
                                        <input type="text" value="${esc(ex.sets)}" onfocus="this.select();" onchange="window.appActions.silentUpdateEx(${i},'sets',this.value)" class="bg-black/40 text-[15px] font-bold pl-12 pr-3 py-2.5 rounded-xl outline-none w-full border border-white/5 text-center">
                                    </div>
                                    <div class="flex-1 relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">Reps</span>
                                        <input type="text" value="${esc(ex.reps)}" onfocus="this.select();" onchange="window.appActions.silentUpdateEx(${i},'reps',this.value)" class="bg-black/40 text-[15px] font-bold pl-12 pr-3 py-2.5 rounded-xl outline-none w-full border border-white/5 text-center">
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    } else {
                        const hA = allHistory[k]||[];
                        // ✓ only counts sets logged for THIS day of the routine (not the same exercise on another day)
                        const isExCompleted = setsThisWeekForDay(hA, activeDay) >= (parseInt(ex.sets) || 1);
                        const cardBorder = isExCompleted ? 'z-10' : '';
                        const checkBadge = isExCompleted ? `<div class="absolute -top-2 -right-2 w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg border-2 border-black z-30"><i data-lucide="check" class="w-3.5 h-3.5 text-black"></i></div>` : '';
                        // Today's target comes from your last session before today (same rule as Analytics)
                        const prevSession = getLastSession(hA, true);
                        const prog = getProgression(prevSession, ex.reps), us = unitOf(ex.reps);
                        const lK = prevSession ? prevSession.w : null;
                        let dH=''; 
                        if(prog){
                            if(!v && !(loggedReps[k]||'')){ 
                                if(prog.type === 'up') {
                                    dH=`<div class="text-[9px] font-black text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-md border border-[#22c55e]/20 uppercase tracking-widest shadow-sm shadow-[#22c55e]/10 flex items-center gap-1"><i data-lucide="arrow-up-circle" class="w-3 h-3"></i> Level Up: ${fmtW(prog.tW)} × ${prog.tR}${us}</div>`;
                                } else if(prog.type === 'down') {
                                    dH=`<div class="text-[9px] font-black text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20 uppercase tracking-widest shadow-sm flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Deload: ${fmtW(prog.tW)} × ${prog.tR}${us}</div>`;
                                } else {
                                    dH=`<div class="text-[9px] font-black text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-md border border-[#d4af37]/20 uppercase tracking-widest shadow-sm shadow-[#d4af37]/10 flex items-center gap-1"><i data-lucide="refresh-cw" class="w-3 h-3"></i> Target: ${fmtW(prog.tW)} × ${prog.tR}${us}</div>`;
                                }
                            } else {
                                const df=(parseFloat(v||0)-lK).toFixed(1);
                                dH=df>0?`<div class="text-[9px] font-black text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-md border border-[#22c55e]/20 uppercase tracking-widest shadow-sm">+${df} kg</div>`:df<0?`<div class="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20 uppercase tracking-widest shadow-sm">${df} kg</div>`:`<div class="text-[9px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-widest shadow-sm">Match</div>`;
                            }
                        } else {
                            // No usable session yet: fall back to the last weight you entered
                            const lastW = hA.length ? parseFloat(hA[hA.length-1].w) : 0;
                            if (lastW > 0 && !v) dH=`<div class="text-[9px] font-black text-slate-400 bg-black/40 px-2 py-1 rounded-md border border-white/5 uppercase tracking-widest shadow-sm">Target: ${lastW+2.5}kg</div>`;
                        }
                        
                        // ✨ FLAWLESS NORMAL MODE CARD
                        return `
                        <div class="glass-card p-4 flex flex-col justify-center relative mb-4 transition-all ${cardBorder}">
                            ${checkBadge}
                            <!-- PINNED HELP ICON -->
                            ${hT?`<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name+' exercise form')}" target="_blank" class="absolute top-4 right-4 text-slate-500 hover:text-[#d4af37] tap-feedback z-10 bg-black/40 p-1.5 rounded-lg border border-white/5 shadow-sm"><i data-lucide="help-circle" class="w-4 h-4"></i></a>`:''}
                            
                            <!-- TOP SECTION: HEADER WITH SEPARATOR -->
                            <div class="border-b border-white/10 pb-3 mb-3 w-full pr-10 relative">
                                <div class="flex items-center justify-between mb-2 w-full">
                                    <span class="text-[10px] font-black text-[#d4af37] uppercase tracking-[3px] opacity-80">${esc(ex.muscle)}</span>
                                    <div id="delta-${esc(k)}">${dH}</div>
                                </div>
                                <h3 class="text-[18px] font-black tracking-tight leading-tight selectable-text text-white">${esc(ex.name)}</h3>
                            </div>
                            
                            <!-- BOTTOM SECTION: UNIFIED CONTROL BAR -->
                            <div class="bg-black/30 rounded-2xl p-3 flex items-center justify-between border border-white/5 shadow-inner w-full mb-3">
                                <div class="flex flex-col justify-between h-full py-1">
                                    <div>
                                        <div class="text-[12px] font-black text-white uppercase tracking-wider">${esc(ex.sets)} <span class="text-[8px] text-slate-500">SETS</span></div>
                                        <div class="text-[12px] font-black text-white uppercase tracking-wider mt-0.5">${esc(ex.reps)} <span class="text-[8px] text-slate-500">REPS</span></div>
                                    </div>
                                    
                                    <button onclick="window.appActions.openHistoryModal(${jsArg(k)},${jsArg(ex.name)})" class="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#d4af37] tap-feedback transition-colors bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 w-fit">
                                        <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> History
                                    </button>
                                </div>
                                
                                <div class="flex flex-col gap-2 w-[110px] shrink-0">
                                    <div class="relative w-full">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">Load</span>
                                        <input type="number" inputmode="decimal" id="input-${esc(k)}" value="${esc(v)}" 
                                            onfocus="this.select(); document.getElementById('scroll-buffer').style.height='50vh'; setTimeout(()=>this.closest('.glass-card').scrollIntoView({behavior:'smooth',block:'center'}), 200);" 
                                            oninput="window.appActions.handleTyping(${jsArg(k)}, 'load', this.value)" 
                                            onblur="window.appActions.restoreIfEmpty(${jsArg(k)}, this.value); setTimeout(()=>{if(!document.activeElement || document.activeElement.tagName !== 'INPUT') document.getElementById('scroll-buffer').style.height='0px';}, 100);" 
                                            class="w-full h-[40px] text-[16px] font-black text-[#d4af37] outline-none bg-black/40 border border-white/10 rounded-lg text-right pl-12 pr-3 transition-all focus:bg-black/60 focus:border-[#d4af37] focus:shadow-[0_0_8px_rgba(212,175,55,0.4)]" placeholder="${isBodyweight(ex.name) ? 'BW' : '—'}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex gap-2 w-full mt-1">
                                <button onclick="window.appActions.openActiveWorkout(${jsArg(k)}, ${jsArg(ex.name)}, ${parseInt(ex.sets) || 1}, ${jsArg(ex.reps)}, false)" class="flex-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest tap-feedback shadow-sm flex justify-center items-center gap-1.5 transition-all active:scale-[0.98]">
                                    <i data-lucide="play-circle" class="w-4 h-4"></i> Start Focus
                                </button>
                                <button onclick="window.appActions.openActiveWorkout(${jsArg(k)}, ${jsArg(ex.name)}, ${parseInt(ex.sets) || 1}, ${jsArg(ex.reps)}, true)" class="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest tap-feedback flex justify-center items-center gap-1.5 transition-all active:scale-[0.98]">
                                    <i data-lucide="edit-3" class="w-4 h-4"></i> Log Sets
                                </button>
                            </div>
                        </div>`;
                    }
                }).join('')}</div>`;
                if(isE) html += `<div class="px-2 mt-4 mb-10 flex gap-2"><button onclick="window.appActions.addEx()" class="flex-1 glass-card p-4 flex items-center justify-center gap-2 text-[#d4af37] font-bold uppercase tracking-widest text-[12px] tap-feedback border-dashed border-[#d4af37]/40 bg-[#d4af37]/5"><i data-lucide="plus" class="w-4 h-4"></i> Add Exercise</button></div>`;
            }
        }
        
        html += `<div id="scroll-buffer" class="w-full pointer-events-none transition-all duration-300" style="height: 0px;"></div>`;
        

        document.getElementById('workout-container').innerHTML = html;
        if(isE && !day.isRest && day.exercises.length > 0 && window.Sortable) {
            const listEl = document.getElementById('sortable-list');
            if (listEl) {
                if (window.appState.sortableInstance) window.appState.sortableInstance.destroy();
                window.appState.sortableInstance = new Sortable(listEl, { handle: '.handle', animation: 300, forceAutoScrollFallback: true, scrollSensitivity: 100, scrollSpeed: 20, fallbackClass: 'sortable-fallback', chosenClass: 'sortable-chosen', ghostClass: 'sortable-ghost', scroll: document.querySelector('.scrollable-content'), onEnd: (evt) => { if(evt.oldIndex===evt.newIndex)return; const m = day.exercises.splice(evt.oldIndex,1)[0]; day.exercises.splice(evt.newIndex,0,m); StorageManager.setPlan(appData); renderWorkout(); } });
            }
        }
        if (window.lucide) window.lucide.createIcons();
    };

    // ⚙️ 5. GLOBAL ACTIONS
    window.appActions = {
        showToast: (m, t='success') => {
            const c = document.getElementById('toast-container'); c.innerHTML=''; const d=document.createElement('div'), iS=t==='success', cS=iS?'text-[#22c55e]':'text-red-400', bS=iS?'bg-[#22c55e]/10 border-[#22c55e]/20':'bg-red-500/10 border-red-500/20';
            d.className=`glass-card p-4 flex items-center gap-3 border shadow-2xl transform translate-y-full opacity-0 transition-all duration-500 mt-2 ${bS} backdrop-blur-3xl`;
            d.innerHTML=`<i data-lucide="${iS?'check-circle':'alert-circle'}" class="w-5 h-5 shrink-0 ${cS}"></i><span class="text-[12px] font-black uppercase tracking-widest">${esc(m)}</span>`;
            c.appendChild(d); if(window.lucide) window.lucide.createIcons({root:d}); void d.offsetWidth; d.classList.remove('translate-y-full','opacity-0');
            setTimeout(()=>{if(c.contains(d)){d.classList.add('opacity-0','translate-y-full');setTimeout(()=>{if(c.contains(d))d.remove();},500);}},3500);
        },
        showConfirm: (t, m, ok, dng=false) => {
            const y = document.getElementById('confirm-yes-btn');
            document.getElementById('confirm-title').innerText=t; document.getElementById('confirm-message').innerText=m;
            y.className=`flex-1 glass-card py-3.5 text-[11px] font-black uppercase tracking-widest shadow-lg ${dng?'text-white bg-red-500/80 border-red-500/50 shadow-red-500/20':'text-black bg-[#d4af37] border-none shadow-[#d4af37]/20'}`;
            document.getElementById('confirm-icon').innerHTML=`<i data-lucide="${dng?'alert-octagon':'alert-triangle'}" class="w-6 h-6 ${dng?'text-red-500':'text-[#d4af37]'}"></i>`;
            if(window.lucide) window.lucide.createIcons({root: document.getElementById('confirm-icon')});
            const nY = y.cloneNode(true); y.parentNode.replaceChild(nY,y); nY.onclick=()=>{window.appActions.closeConfirm();setTimeout(ok,200);};
            openModal('custom-confirm-overlay','custom-confirm-box');
        },
        closeConfirm: () => closeModal('custom-confirm-overlay','custom-confirm-box'),
        refreshUI: () => window.appState.currentView==='workout'?renderWorkout():renderAnalytics(),
        showList: id => { 
            document.querySelectorAll('.dropdown-list').forEach(e=>{if(e.id!==id){e.classList.add('hidden');const c=e.closest('.glass-card');if(c)c.style.zIndex='';}}); 
            const l=document.getElementById(id);
            if(l){
                l.classList.remove('hidden');
                const c=l.closest('.glass-card');
                if(c)c.style.zIndex='999';
                
                // Expand the buffer to make room for the keyboard and list
                const buffer = document.getElementById('scroll-buffer');
                if (buffer) buffer.style.height = '65vh';
                
                // Force the card to scroll up into view
                setTimeout(() => {
                    if(c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            } 
        },
        hideList: id => { 
            const e=document.getElementById(id); 
            if(e){
                e.classList.add('hidden');
                const c=e.closest('.glass-card');
                if(c)c.style.zIndex='';
            } 
            
            // Only shrink the buffer if no other lists are open, preventing screen jumping
            setTimeout(() => {
                const anyOpen = document.querySelector('.dropdown-list:not(.hidden)');
                if (!anyOpen) {
                    const buffer = document.getElementById('scroll-buffer');
                    if (buffer) buffer.style.height = '0px';
                }
            }, 150);
        },filterList: (id, val) => { const l=document.getElementById(id); if(!l)return; const rx=new RegExp('\\b'+val.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&'),'i'); Array.from(l.children).forEach(i=>i.style.display=val.trim()===''||rx.test(i.innerText)?'block':'none'); },
        silentUpdateEx: (idx, f, v) => { const d=getActiveSchedule().find(d=>d.id===activeDay); d.exercises[idx][f]=v; StorageManager.setPlan(appData); if(f==='muscle'){const l=document.getElementById(`e-list-${idx}`);if(l)l.innerHTML=exerciseListHTML(idx, v);} },
        selectOption: (idx, f, v) => { const d=getActiveSchedule().find(d=>d.id===activeDay); d.exercises[idx][f]=v; const inEl=document.getElementById(`${f==='muscle'?'m':'e'}-in-${idx}`); if(inEl)inEl.value=v; window.appActions.hideList(`${f==='muscle'?'m':'e'}-list-${idx}`); if(f==='muscle'){d.exercises[idx].name=''; const n=document.getElementById(`e-in-${idx}`);if(n)n.value=''; const l=document.getElementById(`e-list-${idx}`);if(l)l.innerHTML=exerciseListHTML(idx, v);} StorageManager.setPlan(appData); },
        openHistoryModal: (k, t) => { window.appState.historyEditMode=false; window.appState.openHistoryKey=k; const b=document.getElementById('history-edit-btn'); if(b){b.classList.remove('text-[#d4af37]','bg-[#d4af37]/10');b.classList.add('text-slate-400','bg-white/5');} document.getElementById('history-modal-title').innerText=t; window.appActions.refreshHistoryModal(k); const o=document.getElementById('history-modal-overlay'),bx=document.getElementById('history-modal-box'); o.classList.remove('hidden'); o.classList.add('flex'); requestAnimationFrame(()=>{o.classList.remove('opacity-0');bx.classList.remove('translate-y-full','md:translate-y-0','md:scale-95');}); },
        closeHistoryModal: () => { const o=document.getElementById('history-modal-overlay'),b=document.getElementById('history-modal-box'); o.classList.add('opacity-0'); b.classList.add('translate-y-full'); if(window.innerWidth>=768)b.classList.add('md:scale-95'); setTimeout(()=>{o.classList.add('hidden');o.classList.remove('flex');},300); },
        toggleHistoryEdit: () => { window.appState.historyEditMode=!window.appState.historyEditMode; const b=document.getElementById('history-edit-btn'); if(b){b.className=`p-2 rounded-full tap-feedback transition-colors ${window.appState.historyEditMode?'text-[#d4af37] bg-[#d4af37]/10':'text-slate-400 bg-white/5 hover:text-[#d4af37]'}`;} if(window.appState.openHistoryKey)window.appActions.refreshHistoryModal(window.appState.openHistoryKey); },
        refreshHistoryModal: (k) => { const c=document.getElementById('history-modal-content'), hA=StorageManager.getHistory()[k]||[]; if(!hA.length){c.innerHTML=`<div class="text-center p-10 text-slate-500 text-[12px] font-bold uppercase tracking-widest">No records</div>`;return;} let html='',cG=''; const getDt=(h, fb=Date.now())=>{const t=logTime(h); return new Date(isNaN(t)?fb:t);}, sD=getDt(hA[0]); sD.setHours(0,0,0,0); const ms=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; [...hA].reverse().forEach((h,i)=>{const dt=getDt(h, sD.getTime()); dt.setHours(0,0,0,0); const dD=Math.max(0,Math.floor((dt.getTime()-sD.getTime())/86400000)), wN=Math.floor(dD/7)+1, cWS=new Date(sD.getTime()+((wN-1)*604800000)), cWE=new Date(cWS.getTime()+518400000), gN=`WEEK ${wN} • ${cWS.getDate()} ${ms[cWS.getMonth()]} - ${cWE.getDate()} ${ms[cWE.getMonth()]}`; if(gN!==cG){html+=`<div class="text-[10px] font-black text-[#d4af37] uppercase tracking-[2px] mt-4 mb-2 pl-1 border-b border-[#d4af37]/20 pb-1"><i data-lucide="calendar-days" class="w-3 h-3 inline mr-1 -mt-0.5"></i> ${esc(gN)}</div>`; cG=gN;}
         html+=`<div class="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-2"><div class="flex flex-col"><div class="flex items-center"><span class="text-[15px] font-black text-white">${parseFloat(h.w)>0?`${esc(h.w)} <span class="text-[10px] text-slate-400">KG</span>`:'BW'} ${h.s?`<span class="ml-2 text-[#d4af37]">${esc(Array.isArray(h.s) ? h.s.join(', ') : h.s)} <span class="text-[10px] text-slate-400">${h.u==='s'?'SEC':'REPS'}</span></span>`:''}</span></div><span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">${esc(h.d)} ${h.time ? `<span class="ml-2 text-[#22c55e]"><i data-lucide="clock" class="w-3 h-3 inline -mt-0.5"></i> ${esc(h.time)}</span>` : ''}</span></div>${window.appState.historyEditMode?`<button onclick="window.appActions.deleteHistoryRecord(${jsArg(k)}, ${hA.length-1-i})" class="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`; }); c.innerHTML=html; if(window.lucide) window.lucide.createIcons({root:c}); },
        deleteHistoryRecord: (k, i) => window.appActions.showConfirm("Delete Record", "Remove this record?", () => { let h=StorageManager.getHistory(); if(h[k]){h[k].splice(i,1); StorageManager.setHistory(h); loggedWeights[k]=h[k].length?h[k][h[k].length-1].w:''; loggedReps[k]=h[k].length?h[k][h[k].length-1].s||'':''; StorageManager.set(loggedWeights); StorageManager.setReps(loggedReps); window.appActions.refreshHistoryModal(k); renderWorkout(); window.appActions.showToast("Deleted","error");} }, true),
        handleTyping: (k, type, v) => { 
            if (type === 'load') { loggedWeights[k] = v; StorageManager.set(loggedWeights); } 
            else { loggedReps[k] = v; StorageManager.setReps(loggedReps); }
        },
        restoreIfEmpty: (k, v) => { if(v.trim()===''){const h=StorageManager.getHistory()[k]||[]; if(h.length){loggedWeights[k]=h[h.length-1].w; StorageManager.set(loggedWeights); renderWorkout();}} },
        openActiveWorkout: (k, name, sets, repsStr, isQuickLog = false) => {
            const w = loggedWeights[k];
            // Bodyweight exercises (push-ups, planks...) can be logged without a load; "0" also means bodyweight
            if((w === undefined || String(w).trim() === '') && !isBodyweight(name)) return window.appActions.showToast("Enter Load KG first (0 = bodyweight)", "error");
            const timed = isTimed(repsStr);
            
            window.appState.awKey = k;
            window.appState.awTimed = timed;
            document.getElementById('aw-title').innerText = name;
            document.getElementById('aw-load').innerText = parseFloat(w) > 0 ? `${w} KG` : 'BODYWEIGHT';
            
            const numSets = isNaN(sets) || sets < 1 ? 1 : sets;
            
            // Sets already logged this week for this day of the routine
            const setsLoggedToday = setsThisWeekForDay(StorageManager.getHistory()[k], activeDay);
            const remainingSets = (numSets - setsLoggedToday) > 0 ? (numSets - setsLoggedToday) : 1;
            
            let html = '';
            for(let i=1; i<=remainingSets; i++) {
                html += `
                <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div>
                        <div class="text-[14px] font-black text-white uppercase tracking-wider">Set ${setsLoggedToday + i}</div>
                        <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Target: ${esc(repsStr)}</div>
                    </div>
                    <div class="flex items-center bg-black/60 border border-white/10 rounded-xl overflow-hidden focus-within:border-[#d4af37]">
                        <button type="button" onclick="const i=this.nextElementSibling; i.value=Math.max(0,(parseInt(i.value)||0)-${timed ? 5 : 1})" class="w-12 h-12 text-slate-400 font-black text-2xl flex items-center justify-center bg-white/5 active:bg-white/10 border-r border-white/5">-</button>
                        <input type="number" id="aw-rep-${i}" inputmode="numeric" class="w-16 h-12 bg-transparent text-[#d4af37] font-black text-[18px] text-center outline-none" placeholder="${timed ? 'sec' : '0'}">
                        <button type="button" onclick="const i=this.previousElementSibling; i.value=(parseInt(i.value)||0)+${timed ? 5 : 1}" class="w-12 h-12 text-slate-400 font-black text-2xl flex items-center justify-center bg-white/5 active:bg-white/10 border-l border-white/5">+</button>
                    </div>
                </div>`;
            }
            document.getElementById('aw-sets-container').innerHTML = html;
            
            clearInterval(window.appState.awTimer);
            if(window.appState.awCountdownInterval) clearInterval(window.appState.awCountdownInterval);
            
            const btn = document.getElementById('aw-finish-btn');
            
            if (isQuickLog) {
                document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full bg-[#d4af37]';
                document.getElementById('aw-status-text').innerText = 'Log Mode';
                document.getElementById('aw-status-text').className = 'text-[10px] font-black text-[#d4af37] uppercase tracking-widest';
                document.getElementById('aw-timer').innerText = "LOG";
                
                document.getElementById('aw-countdown-container').classList.add('hidden');
                document.getElementById('aw-sets-container').classList.remove('hidden');
                btn.classList.remove('opacity-50', 'pointer-events-none');
                btn.innerText = 'Save Sets';
            } else {
                document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full bg-slate-500';
                document.getElementById('aw-status-text').innerText = 'Get Ready';
                document.getElementById('aw-status-text').className = 'text-[10px] font-black text-slate-400 uppercase tracking-widest';
                document.getElementById('aw-timer').innerText = "00:00";
                
                document.getElementById('aw-countdown-container').classList.remove('hidden');
                document.getElementById('aw-sets-container').classList.add('hidden');
                btn.classList.add('opacity-50', 'pointer-events-none');
                btn.innerText = 'Finish Workout';
            }
            
            openModal('active-workout-overlay','active-workout-box');

            if (isQuickLog) return;

            // Handle Countdown
            let countdown = 3;
            const cdText = document.getElementById('aw-countdown-text');
            cdText.innerText = countdown;
            cdText.className = 'text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse';

            window.appState.awCountdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    cdText.innerText = countdown;
                } else if (countdown === 0) {
                    cdText.innerText = "GO";
                    cdText.className = 'text-8xl font-black text-[#d4af37] scale-110 transition-transform';
                } else {
                    clearInterval(window.appState.awCountdownInterval);
                    document.getElementById('aw-countdown-container').classList.add('hidden');
                    document.getElementById('aw-sets-container').classList.remove('hidden');
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    
                    document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full bg-red-500 animate-pulse';
                    document.getElementById('aw-status-text').innerText = 'Active Focus';
                    document.getElementById('aw-status-text').className = 'text-[10px] font-black text-red-400 uppercase tracking-widest';

                    // Based on the real start time, so it stays correct even if the phone locks
                    window.appState.awStart = Date.now();
                    window.appState.awTimer = setInterval(() => {
                        window.appState.awSeconds = Math.floor((Date.now() - window.appState.awStart) / 1000);
                        const m = String(Math.floor(window.appState.awSeconds / 60)).padStart(2, '0');
                        const s = String(window.appState.awSeconds % 60).padStart(2, '0');
                        document.getElementById('aw-timer').innerText = `${m}:${s}`;
                    }, 1000);
                }
            }, 1000);
        },
        closeActiveWorkout: () => {
            clearInterval(window.appState.awTimer);
            clearInterval(window.appState.awCountdownInterval);
            closeModal('active-workout-overlay','active-workout-box');
        },
        finishActiveWorkout: () => {
            const k = window.appState.awKey;
            const w = loggedWeights[k] === undefined || String(loggedWeights[k]).trim() === '' ? '0' : loggedWeights[k];
            const setsInputs = document.querySelectorAll('[id^="aw-rep-"]');
            let completedReps = [];
            setsInputs.forEach(inp => {
                const val = parseInt(inp.value);
                if(!isNaN(val) && val > 0) completedReps.push(val);
            });
            
            if(completedReps.length === 0) {
                return window.appActions.showToast(window.appState.awTimed ? "Enter seconds for at least 1 set" : "Enter reps for at least 1 set", "error");
            }
            
            let h = StorageManager.getHistory(); if(!h[k]) h[k] = []; 
            const n = new Date();
            
            let timeLogged = document.getElementById('aw-timer').innerText;
            if (timeLogged === "LOG") timeLogged = "";
            
            const entry = {
                d: formatLogDate(n),   // text date (for display and older app versions)
                ts: n.getTime(),       // exact time (used for all date calculations)
                w: w, 
                s: completedReps, 
                time: timeLogged,
                week: (appData.weeks.find(x=>x.id===currentWeekId)||{}).name||'Routine',
                weekId: currentWeekId, // which routine this was logged in
                dayId: activeDay       // which day of the routine this was logged for
            };
            if (window.appState.awTimed) entry.u = 's';
            h[k].push(entry); 
            if(h[k].length>150) h[k] = h[k].slice(-150); 
            StorageManager.setHistory(h); 
            
            if(navigator.vibrate) navigator.vibrate([30,50,30]); 
            window.appActions.showToast(`Workout Completed!`, "success"); 
            window.appActions.closeActiveWorkout();
            
            const el = document.getElementById(`input-${k}`); if(el){ el.classList.add('save-glow'); setTimeout(() => el.classList.remove('save-glow'), 400); } 
            
            renderNav(false); renderWorkout();
        },
        applyGlobalSetsReps: () => {
            const s = document.getElementById('global-sets').value;
            const r = document.getElementById('global-reps').value;
            if (!s && !r) return window.appActions.showToast("Enter Sets or Reps", "error");
            const d = getActiveSchedule().find(x => x.id === activeDay);
            d.exercises.forEach(ex => {
                if(s) ex.sets = s;
                if(r) ex.reps = r;
            });
            StorageManager.setPlan(appData);
            renderWorkout();
            window.appActions.showToast("Updated all exercises", "success");
        },applyPreset: p => {
            window.appActions.showConfirm("Overwrite Week?", "This will replace your entire 7-day schedule.", () => {
                const s = getActiveSchedule();
                const dEx = {
                    "Push": [{muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"8 - 12"},{muscle:"Upper Chest",name:"Incline Machine Press",sets:"3",reps:"8 - 12"},{muscle:"Shoulders",name:"Machine Shoulder Press",sets:"3",reps:"10 - 12"},{muscle:"Side Delts",name:"Cable Lateral Raise",sets:"3",reps:"12 - 15"},{muscle:"Triceps",name:"Tricep Pushdown",sets:"3",reps:"12 - 15"},{muscle:"Triceps",name:"Overhead Tricep Extension",sets:"3",reps:"12 - 15"}],
                    "Pull": [{muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"8 - 12"},{muscle:"Back",name:"Chest-Supported Row",sets:"3",reps:"8 - 12"},{muscle:"Back",name:"Seated Cable Row",sets:"3",reps:"10 - 12"},{muscle:"Rear Delts",name:"Machine Reverse Fly",sets:"3",reps:"12 - 15"},{muscle:"Biceps",name:"Machine Bicep Curl",sets:"3",reps:"10 - 12"},{muscle:"Biceps",name:"Hammer Curl",sets:"3",reps:"12 - 15"}],
                    "Legs": [{muscle:"Quads",name:"Leg Press",sets:"3",reps:"8 - 12"},{muscle:"Quads",name:"Leg Extension",sets:"3",reps:"12 - 15"},{muscle:"Hamstrings",name:"Seated Leg Curl",sets:"3",reps:"10 - 12"},{muscle:"Calves",name:"Machine Calf Press",sets:"4",reps:"15 - 20"}],
                    "Upper": [{muscle:"Chest",name:"Machine Chest Press",sets:"3",reps:"8 - 10"},{muscle:"Upper Chest",name:"Incline Machine Press",sets:"2",reps:"10 - 12"},{muscle:"Shoulders",name:"Machine Shoulder Press",sets:"3",reps:"8 - 10"},{muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"8 - 10"},{muscle:"Back",name:"Seated Cable Row",sets:"2",reps:"10 - 12"},{muscle:"Biceps",name:"Machine Bicep Curl",sets:"2",reps:"10 - 12"},{muscle:"Triceps",name:"Tricep Pushdown",sets:"2",reps:"10 - 12"}],
                    "Lower": [{muscle:"Quads",name:"Squat",sets:"3",reps:"8 - 10"},{muscle:"Quads",name:"Leg Press",sets:"2",reps:"10 - 12"},{muscle:"Quads",name:"Leg Extension",sets:"2",reps:"10 - 12"},{muscle:"Hamstrings",name:"Seated Leg Curl",sets:"2",reps:"10 - 12"},{muscle:"Calves",name:"Standing Calf Raise",sets:"3",reps:"12 - 15"},{muscle:"Abs",name:"Plank",sets:"3",reps:"30 - 45s"}],
                    "FBA": [{muscle:"Quads",name:"Squat",sets:"3",reps:"6 - 8"},{muscle:"Chest",name:"Bench Press",sets:"3",reps:"6 - 8"},{muscle:"Lats",name:"Lat Pulldown",sets:"3",reps:"8 - 10"},{muscle:"Shoulders",name:"Machine Shoulder Press",sets:"2",reps:"8 - 10"},{muscle:"Biceps",name:"Machine Bicep Curl",sets:"2",reps:"10 - 12"},{muscle:"Triceps",name:"Tricep Pushdown",sets:"2",reps:"10 - 12"},{muscle:"Abs",name:"Plank",sets:"3",reps:"30 - 45s"}],
                    "FBB": [{muscle:"Hamstrings",name:"Seated Leg Curl",sets:"3",reps:"6 - 8"},{muscle:"Upper Chest",name:"Incline Machine Press",sets:"3",reps:"8 - 10"},{muscle:"Back",name:"Seated Cable Row",sets:"3",reps:"8 - 10"},{muscle:"Side Delts",name:"Cable Lateral Raise",sets:"2",reps:"12 - 15"},{muscle:"Quads",name:"Leg Press",sets:"2",reps:"10 - 12"},{muscle:"Calves",name:"Machine Calf Press",sets:"3",reps:"12 - 15"},{muscle:"Abs",name:"Plank",sets:"3",reps:"30 - 45s"}]
                };
                const plans = {
                    'PPL': ['Push','Pull','Legs','CR','Push','Pull','Legs'],
                    'UL': ['Upper','Lower','AR','Upper','Lower','CR','CR'],
                    'FB': ['FBA','AR','FBB','AR','FBA','CR','CR']
                };
                s.forEach((day, i) => {
                    const t = plans[p][i];
                    if (t === 'CR') { day.title = 'Complete Rest'; day.isRest = true; day.recoveryType = 'complete'; day.exercises = []; day.savedTitle = ''; }
                    else if (t === 'AR') { day.title = 'Active Rest'; day.isRest = true; day.recoveryType = 'active'; day.exercises = []; day.savedTitle = ''; }
                    else { day.title = t==='Upper'?'Upper Body':t==='Lower'?'Lower Body':t==='FBA'?'Full Body A':t==='FBB'?'Full Body B':t; day.isRest = false; day.recoveryType = null; day.exercises = JSON.parse(JSON.stringify(dEx[t])); day.savedTitle = day.title; }
                });
                StorageManager.setPlan(appData);
                window.appState.editMode = false;
                renderNav(); renderWorkout();
                window.appActions.showToast("Full Week Applied!", "success");
            }, true);
        },
        toggleEditMode: (e) => { 
            if (e) { e.preventDefault(); e.stopPropagation(); }
            
            // Capture both the container and universal window scroll positions
            const scroller = document.querySelector('.scrollable-content'); 
            const scrollerPos = scroller ? scroller.scrollTop : 0; 
            const windowPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            if (document.activeElement) document.activeElement.blur(); 
            
            // Toggle mode and rebuild the UI
            window.appState.editMode = !window.appState.editMode; 
            renderNav(false); 
            renderWorkout(); 
            
            // Instantly restore both scroll positions to freeze the screen
            if (scroller) { 
                scroller.scrollTop = scrollerPos; 
                setTimeout(() => scroller.scrollTop = scrollerPos, 10); 
            } 
            window.scrollTo(0, windowPos);
            setTimeout(() => window.scrollTo(0, windowPos), 10);
        },
        updateStartOfWeek: v => { const aD=DAY_NAMES, idx=aD.indexOf(v); if(idx===-1)return; StorageManager.setStartDay(v); appData.weeks.forEach(w=>w.schedule.forEach((d,i)=>d.day=aD[(idx+i)%7])); StorageManager.setPlan(appData); if(StorageManager.getAutoSync()){activeDay=getTodayId();StorageManager.setLastDay(activeDay);} const s=document.getElementById('setting-start-day'); if(s)s.value=v; renderNav(false); renderWorkout(); window.appActions.toggleMenu(); setTimeout(()=>window.appActions.showToast(`Week starts on ${v}`,"success"),300); },
        swapDay: tId => { const s=getActiveSchedule(), d1=s.find(d=>d.id===activeDay), d2=s.find(d=>d.id===tId); if(!d1||!d2)return; const tT=d1.title, tE=JSON.stringify(d1.exercises), tIR=d1.isRest, tRT=d1.recoveryType, tST=d1.savedTitle; d1.title=d2.title; d1.exercises=JSON.parse(JSON.stringify(d2.exercises||[])); d1.isRest=d2.isRest; d1.recoveryType=d2.recoveryType; d1.savedTitle=d2.savedTitle; d2.title=tT; d2.exercises=JSON.parse(tE||'[]'); d2.isRest=tIR; d2.recoveryType=tRT; d2.savedTitle=tST; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayTitle: v => { getActiveSchedule().find(d=>d.id===activeDay).title=v.trim()||'New Day'; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
        updateDayType: v => { const d=getActiveSchedule().find(x=>x.id===activeDay); if(v==='workout'){d.isRest=false; d.recoveryType=null; d.title=d.savedTitle||'New Workout'; if(!d.exercises||!d.exercises.length)d.exercises=[{muscle:'Muscle',name:'New Exercise',sets:'3',reps:'10'}];}else{if(!d.isRest)d.savedTitle=d.title; d.isRest=true; d.recoveryType=v; d.title=v==='active'?'Active Rest':'Complete Rest';} window.appState.editMode=true; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },        deleteEx: i => window.appActions.showConfirm("Delete Exercise", "Remove this exercise?", () => { getActiveSchedule().find(d=>d.id===activeDay).exercises.splice(i,1); StorageManager.setPlan(appData); renderWorkout(); }, true),addEx: () => { const d=getActiveSchedule().find(x=>x.id===activeDay); if(!d.title||d.title.trim().toLowerCase()==='new day'){window.appActions.showToast("Name workout first!","error"); return;} d.exercises.push({muscle:'Muscle',name:'New Exercise',sets:'3',reps:'10'}); StorageManager.setPlan(appData); renderWorkout(); setTimeout(()=>{const l=document.getElementById('sortable-list');if(l&&l.lastElementChild)l.lastElementChild.scrollIntoView({behavior:'smooth',block:'center'});},50); },
        clearDay: () => window.appActions.showConfirm("Clear Day", "Delete all exercises?", () => { const d=getActiveSchedule().find(x=>x.id===activeDay); d.exercises=[]; d.title=""; StorageManager.setPlan(appData); renderWorkout(); }, true),
        switchTab: t => { window.appState.currentView=t; window.appState.editMode=false; document.getElementById('tab-workout').className=`flex-1 glass-card py-3 text-[10px] font-black uppercase transition-all ${t==='workout'?'bg-[#d4af37] text-black border-none':'text-slate-400 hover:text-white border-white/5 border'}`; document.getElementById('tab-analytics').className=`flex-1 glass-card py-3 text-[10px] font-black uppercase transition-all ${t==='analytics'?'bg-[#d4af37] text-black border-none':'text-slate-400 hover:text-white border-white/5 border'}`; document.getElementById('nav-container').style.display=t==='workout'?'flex':'none'; t==='workout'?renderWorkout():renderAnalytics(); },
        toggleMenu: () => { window.appState.menuOpen=!window.appState.menuOpen; const o=document.getElementById('side-panel-overlay'), p=document.getElementById('side-panel'); if(window.appState.menuOpen){o.classList.remove('hidden'); setTimeout(()=>{o.classList.remove('opacity-0');p.classList.add('slide-panel-open');},10);}else{p.classList.remove('slide-panel-open'); o.classList.add('opacity-0'); setTimeout(()=>o.classList.add('hidden'),300);} },
        addWeek: () => { if(appData.weeks.length>=5)return window.appActions.showToast("Max 5 schedules","error"); const aD=DAY_NAMES, sI=aD.indexOf(StorageManager.getStartDay()); let eS=[]; for(let i=1;i<=7;i++)eS.push({id:i,day:aD[(sI+i-1)%7],title:'New Day',isRest:false,recoveryType:null,exercises:[]}); appData.weeks.push({id:'w_'+Date.now(),name:`Schedule ${appData.weeks.length+1}`,schedule:eS}); StorageManager.setPlan(appData); renderSidePanel(); },
        deleteWeek: id => { if(appData.weeks.length<=1)return; window.appActions.showConfirm("Delete Schedule","Delete this week?",()=>{appData.weeks=appData.weeks.filter(w=>w.id!==id); if(currentWeekId===id){currentWeekId=appData.weeks[0].id;StorageManager.setActiveWeek(currentWeekId);window.appActions.refreshUI();renderNav();} StorageManager.setPlan(appData); renderSidePanel(); },true); },
        renameWeek: (id, v) => { const w=appData.weeks.find(x=>x.id===id); if(w)w.name=v||'Unnamed'; StorageManager.setPlan(appData); document.getElementById('active-week-label').innerText=appData.weeks.find(x=>x.id===currentWeekId).name; },
        switchWeek: id => { currentWeekId=id; StorageManager.setActiveWeek(id); window.appState.hasShownSetupToast=false; const s=getActiveSchedule(); activeDay=s.some(d=>d.title==='New Day')?s.find(d=>d.title==='New Day').id:(StorageManager.getAutoSync()?getTodayId():(StorageManager.getLastDay()||getTodayId())); window.appState.editMode=false; StorageManager.setLastDay(activeDay); renderSidePanel(); renderNav(); window.appActions.refreshUI(); window.appActions.toggleMenu(); },
        setActiveDay: id => { activeDay=id; StorageManager.setLastDay(id); window.appState.editMode=false; renderNav(); renderWorkout(); },
        toggleAutoSync: v => { StorageManager.setAutoSync(v); if(v && window.appState.currentView==='workout'){activeDay=getTodayId(); StorageManager.setLastDay(activeDay); renderNav(); renderWorkout();} window.appActions.showToast(v ? "Day Tracker Enabled" : "Manual Mode Active", "success"); },
        openBackupModal: () => { window.appActions.toggleMenu(); openModal('smart-backup-overlay','smart-backup-box'); },
        closeBackupModal: () => closeModal('smart-backup-overlay','smart-backup-box'),
        executeSmartBackup: () => {
            const doProg = document.getElementById('backup-opt-progress').checked;
            const doSched = document.getElementById('backup-opt-schedule').checked;
            const doSet = document.getElementById('backup-opt-settings').checked;
            if (!doProg && !doSched && !doSet) return window.appActions.showToast("Select at least one option!", "error");
            StorageManager.setBackupDate();
            let d = {};
            if (doProg) { d.w = StorageManager.get(); d.h = StorageManager.getHistory(); }
            if (doSched) { d.p = StorageManager.getPlan(); d.aw = StorageManager.getActiveWeek(); }
            if (doSet) { d.s = StorageManager.getStartDay(); }
            const a = document.createElement('a'); 
            a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })); 
            const n = new Date();
            const ms = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const dStr = `${ms[n.getMonth()]}${n.getDate()}`;
            let fName = `ApexLift_Backup_${dStr}.json`;
            if (doProg && !doSched && !doSet) fName = `ApexLift_ProgressOnly_${dStr}.json`;
            else if (!doProg && doSched && !doSet) fName = `ApexLift_RoutineOnly_${dStr}.json`;
            a.download = fName; 
            a.click();
            window.appActions.closeBackupModal();
            setTimeout(() => window.appActions.showToast("Data Exported!", "success"), 300);
        },
        importData: e => {
            window.appActions.toggleMenu(); const f=e.target.files[0]; if(!f)return;
            const r=new FileReader();
            r.onload=ev=>{
                try {
                    const raw=JSON.parse(ev.target.result);
                    if(!isObj(raw)) throw new Error('Backup is not an object');
                    // Clean everything in the file before using it
                    const d = {
                        w: raw.w !== undefined ? sanitizeValueMap(raw.w) : undefined,
                        h: sanitizeHistory(raw.h),
                        p: raw.p !== undefined ? sanitizePlan(raw.p) : null,
                        aw: toStr(raw.aw) || null,
                        s: DAY_NAMES.includes(raw.s) ? raw.s : null
                    };
                    if(raw.p !== undefined && !d.p) window.appActions.showToast("Routine in file is damaged: skipped","error");
                    if(!d.w && !d.p && !d.s) throw new Error('Nothing usable in backup');
                    window.appState.pendingRestoreData = d;
                    document.getElementById('restore-progress-desc').innerText = d.w && Object.keys(d.w).length ? `${Object.keys(d.w).length} exercises found` : 'No progress found';
                    document.getElementById('restore-schedule-desc').innerText = d.p ? `Custom schedule found` : 'No schedule found';
                    document.getElementById('restore-settings-desc').innerText = d.s ? `Start Day: ${d.s}` : 'No settings found';
                    document.getElementById('restore-opt-progress').checked = !!(d.w && Object.keys(d.w).length);
                    document.getElementById('restore-opt-progress').disabled = !(d.w && Object.keys(d.w).length);
                    document.getElementById('restore-opt-schedule').checked = false; 
                    document.getElementById('restore-opt-schedule').disabled = !d.p;
                    document.getElementById('restore-opt-settings').checked = false;
                    document.getElementById('restore-opt-settings').disabled = !d.s;
                    openModal('smart-restore-overlay','smart-restore-box');
                } catch(err) { window.appActions.showToast("Invalid Backup file","error"); }
            };
            r.readAsText(f); e.target.value='';
        },
        closeRestoreModal: () => {
            closeModal('smart-restore-overlay','smart-restore-box', 300, () => { window.appState.pendingRestoreData = null; });
        },
        executeSmartRestore: () => {
            const d = window.appState.pendingRestoreData; if(!d) return;
            const doProg = document.getElementById('restore-opt-progress').checked;
            const doSched = document.getElementById('restore-opt-schedule').checked;
            const doSet = document.getElementById('restore-opt-settings').checked;
            if (doProg && d.w) {
                let targetPlan = doSched && d.p ? d.p : appData;
                let targetExMap = new Map();
                targetPlan.weeks.forEach(w => w.schedule.forEach(day => {
                    if (day.exercises) day.exercises.forEach(ex => { targetExMap.set(ex.name, ex.muscle); });
                }));
                let targetExData = Array.from(targetExMap.entries()).map(([name, muscle]) => ({name, muscle})).sort((a,b) => a.name.localeCompare(b.name));
                window.appState.mappingConfig = { d, doSched, doSet, targetExData };
                window.appActions.closeRestoreModal();
                setTimeout(() => window.appActions.openMappingModal(), 350);
            } else {
                window.appActions.finishRestore(false, doSched, doSet, d);
            }
        },
        openMappingModal: () => {
            const { d, targetExData } = window.appState.mappingConfig;
            const ml = document.getElementById('mapping-list');
            let html = '';
            const getBroadGroup = (m) => {
                m = (m||'').toLowerCase();
                if (m.includes('leg') || m.includes('quad') || m.includes('ham') || m.includes('calf') || m.includes('calves') || m.includes('glute')) return 'legs';
                if (m.includes('chest') || m.includes('shoulder') || m.includes('delt') || m.includes('tricep') || m.includes('push') || m.includes('pec')) return 'push';
                if (m.includes('back') || m.includes('lat') || m.includes('trap') || m.includes('bicep') || m.includes('pull') || m.includes('rear') || m.includes('row')) return 'pull';
                if (m.includes('abs') || m.includes('core')) return 'core';
                return 'all';
            };
            Object.keys(d.w).forEach(oldKey => {
                let readable = oldKey.replace('global_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                let oldMuscle = 'Unknown';
                if (d.p && d.p.weeks) {
                    d.p.weeks.forEach(w => w.schedule.forEach(day => {
                        if (day.exercises) day.exercises.forEach(ex => { if (getExKey('','','',ex.name) === oldKey) oldMuscle = ex.muscle; });
                    }));
                }
                if (oldMuscle === 'Unknown') {
                    if (readable.match(/leg|squat|calf|calves|ham|glute/i)) oldMuscle = 'Legs';
                    else if (readable.match(/chest|press|pushdown|tricep|fly|delt|shoulder/i)) oldMuscle = 'Chest';
                    else if (readable.match(/row|pull|bicep|curl|back|lat/i)) oldMuscle = 'Back';
                }
                let oldGroup = getBroadGroup(oldMuscle);
                let filteredTargets = targetExData;
                if (oldGroup !== 'all') {
                    let matches = targetExData.filter(t => getBroadGroup(t.muscle) === oldGroup);
                    if (matches.length > 0) filteredTargets = matches;
                }
                let autoMatch = '';
                let tKeyMatch = filteredTargets.find(tx => getExKey('','','',tx.name) === oldKey);
                if(tKeyMatch) autoMatch = tKeyMatch.name;
                let opts = `<option value="SKIP" ${!autoMatch ? 'selected' : ''}>-- Skip (Do Not Import) --</option>`;
                filteredTargets.forEach(tx => { opts += `<option value="${esc(tx.name)}" ${autoMatch === tx.name ? 'selected' : ''}>${esc(tx.name)}</option>`; });
                html += `<div class="bg-black/40 p-3 rounded-xl border border-white/5 mb-3 last:mb-0"><div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-white/5 flex justify-between items-center"><span class="truncate pr-2">Old: ${esc(readable)}</span><span class="text-[8px] text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded shadow-sm shrink-0 border border-[#d4af37]/20">${esc(oldGroup.toUpperCase())}</span></div><select id="map_${esc(oldKey)}" class="w-full bg-black/60 p-2.5 rounded-lg text-[12px] font-bold text-white outline-none cursor-pointer border border-white/10 tap-feedback">${opts}</select></div>`;
            });
            ml.innerHTML = html || `<div class="text-center text-[10px] font-bold text-slate-500 uppercase py-4">No exercises found</div>`;
            openModal('smart-mapping-overlay','smart-mapping-box');
        },
        closeMappingModal: () => {
            closeModal('smart-mapping-overlay','smart-mapping-box');
        },
        executeMappedMerge: () => {
            const { d, doSched, doSet } = window.appState.mappingConfig;
            let currW = StorageManager.get(), currH = StorageManager.getHistory();
            Object.keys(d.w).forEach(oldKey => {
                const sel = document.getElementById(`map_${oldKey}`);
                if(sel && sel.value !== 'SKIP') {
                    const newKey = getExKey('','','',sel.value);
                    currW[newKey] = d.w[oldKey];
                    let oldHist = (d.h && d.h[oldKey]) || [];
                    if(oldHist.length > 0) {
                        let mergedH = [...(currH[newKey] || []), ...oldHist];
                        let unique = [];
                        let seen = new Set();
                        mergedH.forEach(item => {
                            let str = `${item.d}_${item.w}`;
                            if(!seen.has(str)) { seen.add(str); unique.push(item); }
                        });
                        currH[newKey] = unique;
                    }
                }
            });
            StorageManager.set(currW); StorageManager.setHistory(currH); loggedWeights = currW;
            window.appActions.closeMappingModal();
            window.appActions.finishRestore(true, doSched, doSet, d);
        },
        finishRestore: (didProg, doSched, doSet, d) => {
            let count = didProg ? 1 : 0;
            if (doSched && d.p) {
                const iP = d.p; // already cleaned by sanitizePlan when the file was opened
                // Only use the saved active week if it really exists in this routine
                currentWeekId = (d.aw && iP.weeks.some(w => w.id === d.aw)) ? d.aw : iP.weeks[0].id;
                StorageManager.setActiveWeek(currentWeekId);
                StorageManager.setPlan(iP); appData = iP; count++;
            }
            if (doSet && d.s) { 
                const aD=DAY_NAMES, idx=aD.indexOf(d.s);
                if(idx!==-1){ StorageManager.setStartDay(d.s); appData.weeks.forEach(w=>w.schedule.forEach((dDay,i)=>dDay.day=aD[(idx+i)%7])); document.getElementById('setting-start-day').value = d.s; }
                count++; 
            }
            if (count > 0) { StorageManager.setPlan(appData); activeDay = StorageManager.getAutoSync() ? getTodayId() : (StorageManager.getLastDay() || getTodayId()); renderNav(); window.appActions.refreshUI(); window.appActions.showToast("Data Merged Successfully!", "success"); }
            if(!didProg) window.appActions.closeRestoreModal();
    },
    restoreDefaults: () => { window.appActions.toggleMenu(); window.appActions.showConfirm("Factory Reset","Delete all custom weeks?",()=>{const aD=DAY_NAMES, sI=aD.indexOf('SAT'); const def=JSON.parse(JSON.stringify(defaultWorkoutData)); def.forEach((d,i)=>d.day=aD[(sI+i)%7]); appData={weeks:[{id:'w_default',name:'Main Routine',schedule:def}]}; currentWeekId='w_default'; StorageManager.setActiveWeek('w_default'); StorageManager.setPlan(appData); StorageManager.setStartDay('SAT'); document.getElementById('setting-start-day').value='SAT'; activeDay=getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast("Reset Complete");},true); },
        renderOnboardingSlide: () => {
            const slides = [
                { i: 'dumbbell', t: 'Welcome to Apex Lift', d: 'Your premium personal coaching and tracking experience. Stop guessing and start growing with precision data.' },
                { i: 'activity', t: 'Track Workload', d: 'Log your sets and reps to monitor your Weekly Volume. The app will tell you when you are under-training or over-training each muscle group.' },
                { i: 'zap', t: 'Actionable Insights', d: 'Complete workouts to unlock your Action Plan. Apex Lift will automatically calculate when you should add weight, push for more reps, or deload.' }
            ];
            const s = slides[window.appState.onboardSlide];
            const c = document.getElementById('onboarding-content');
            c.style.opacity = '0';
            setTimeout(() => {
                c.innerHTML = `<div class="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.2)]"><i data-lucide="${s.i}" class="w-8 h-8 text-[#d4af37]"></i></div><h2 class="text-2xl font-black uppercase tracking-tight text-white mb-3 leading-none">${esc(s.t)}</h2><p class="text-[12px] font-bold text-slate-400 leading-relaxed">${esc(s.d)}</p>`;
                document.getElementById('onboarding-dots').innerHTML = slides.map((_, idx) => `<div class="w-2 h-2 rounded-full transition-all duration-300 ${idx === window.appState.onboardSlide ? 'bg-[#d4af37] w-6' : 'bg-white/20'}"></div>`).join('');
                document.getElementById('onboarding-btn').innerText = window.appState.onboardSlide === slides.length - 1 ? 'Start Training' : 'Next';
                if(window.lucide) window.lucide.createIcons({root: c});
                c.style.opacity = '1';
            }, 150);
        },
        nextOnboardingSlide: () => {
            if (window.appState.onboardSlide >= 2) { window.appActions.closeOnboarding(); return; }
            window.appState.onboardSlide++;
            window.appActions.renderOnboardingSlide();
        },
        closeOnboarding: () => {
            StorageManager.setOnboard();
            closeModal('onboarding-overlay','onboarding-box', 500);
        },
        initOnboarding: () => {
            if (!StorageManager.getOnboard()) {
                window.appState.onboardSlide = 0;
                window.appActions.renderOnboardingSlide();
                openModal('onboarding-overlay','onboarding-box');
            }
        }
    };

    renderNav(); renderWorkout();
    document.getElementById('setting-start-day').value = StorageManager.getStartDay();
    const autoSyncEl = document.getElementById('setting-auto-sync');
    if (autoSyncEl) autoSyncEl.checked = StorageManager.getAutoSync();

    setTimeout(() => { const lB=StorageManager.getBackupDate(); if(!lB)StorageManager.setBackupDate(); else if(Date.now()-lB>604800000) window.appActions.showConfirm("Backup Reminder","It has been over 7 days. Backup now?",()=>window.appActions.openBackupModal()); }, 1500);
    setTimeout(() => window.appActions.initOnboarding(), 500);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && StorageManager.getAutoSync()) { const tT=getTodayId(), lD=getActiveSchedule().find(isDayIncomplete); if(lD){if(activeDay!==lD.id){activeDay=lD.id; StorageManager.setLastDay(activeDay); window.appState.editMode=true;renderNav();renderWorkout();}}else if(activeDay!==tT&&!window.appState.editMode&&window.appState.currentView==='workout'){activeDay=tT; StorageManager.setLastDay(activeDay); renderNav();renderWorkout();} } });
    // 📶 OFFLINE SUPPORT: save a copy of the app on the phone (see sw.js)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
        window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(err => console.warn('Offline mode unavailable:', err)));
    }
})();
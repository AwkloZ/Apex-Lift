// Apex Lift app (index.html), part 7 of 13: The AI coach chat (Google Gemini through Firebase AI Logic).
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🤖 AI COACH: a chat with Google Gemini that builds a routine from your training answers, routine and workout history.
// Gemini is reached through Firebase AI Logic, so there is no Gemini key in the app (it stays at Google) and it stays free (Spark).
// Firebase setup (once): Firebase console → AI Logic → Get started → Gemini Developer API.
// Against misuse: App Check with Fraud Defense (reCAPTCHA Enterprise): the key ID is in AI_APP_CHECK_KEY (Google Cloud → Fraud Defense → Keys),
// registered in Firebase → App Check → Apps. Then App Check → APIs → Firebase AI Logic → Enforce.
// Gemini may only name exercises from the library; the app checks the routine (7 days, known exercises, sensible sets) before
// it can be used. The chat is kept on this phone only. Its Firebase files are only downloaded when the coach is opened.
// tried in this order for every question: the next one only when Google fails (busy, server error) or has retired the model
const AI_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-2.5-flash'];
const AI_APP_CHECK_KEY = '6LdWE_0tAAAAAJvI8b37jqVxj9-0aACe2WFj_VDJ'; // Fraud Defense key ID (not secret). Empty = no App Check
const AI_CHAT_KEY = 'workoutAiChat_rakan_final', AI_OK_KEY = 'workoutAiOk_rakan_final', AI_COUNT_KEY = 'workoutAiCount_rakan_final';
// what the coach remembers about you (injuries, likes, schedule...): short notes it writes itself, kept on this phone after "New chat"
const AI_MEM_KEY = 'workoutAiMemory_rakan_final';
const getAiMemory = () => { const v = readJSON(AI_MEM_KEY, []); return Array.isArray(v) ? v.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim().slice(0, 160)).slice(0, 20) : []; };
const AI_DAILY = 40; // questions a day on one phone, so one person can't use up the free quota
const AI_KEEP = 30, AI_CONTEXT = 10; // messages kept on the phone / sent with each question
const AI = { loading: null, gone: new Set(), noThink: new Set(), busy: false, open: -1 }; // gone: models Google said don't exist (this visit)
const loadAI = () => AI.loading || (AI.loading = (async () => {
    const [fbApp, fbAI] = await Promise.all([import('./' + FB_DIR + 'firebase-app.js'), import('./' + FB_DIR + 'firebase-ai.js')]);
    // its own Firebase app (the modular files can't share the sign-in's compat app), same project
    const app = fbApp.getApps().find(a => a.name === 'apex-ai') || fbApp.initializeApp(FIREBASE_CONFIG, 'apex-ai');
    if (AI_APP_CHECK_KEY) {
        const ac = await import('./' + FB_DIR + 'firebase-app-check.js');
        try { ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(AI_APP_CHECK_KEY), isTokenAutoRefreshEnabled: true }); } catch (e) { console.warn('App Check', e); }
    }
    return { fbAI, ai: fbAI.getAI(app, { backend: new fbAI.GoogleAIBackend() }) };
})().catch(e => { AI.loading = null; throw e; }));

const sanitizeAiChat = raw => (Array.isArray(raw) ? raw : []).filter(m => isObj(m) && (m.r === 'u' || m.r === 'm') && typeof m.x === 'string')
    .map(m => ({ r: m.r, x: m.x.slice(0, 3000), ...(isObj(m.rt) && Array.isArray(m.rt.schedule) ? { rt: m.rt } : {}), ...(m.used ? { used: true } : {}), ...(m.err ? { err: true } : {}), ...(Array.isArray(m.ch) && m.ch.length ? { ch: m.ch.filter(c => typeof c === 'string' && c.trim()).slice(0, 6).map(c => c.trim().slice(0, 60)) } : {}) })).slice(-AI_KEEP);
const AI_ERRS = ['Apex Coach is busy right now. Try again in a minute.', 'Apex Coach is not ready yet. Try again later.', 'Apex Coach could not answer. Try again.', 'No internet connection. Try again when online.',
    'The AI coach is busy right now. Try again in a minute.', 'The AI coach is not ready yet. Try again later.', 'The AI coach could not answer. Try again.'];
const getAiChat = () => sanitizeAiChat(readJSON(AI_CHAT_KEY, [])).map(m => m.r === 'm' && !m.err && !m.rt && AI_ERRS.some(e => m.x.startsWith(e) || m.x.startsWith(t(e))) ? { ...m, err: true } : m);
const setAiChat = list => writeItem(AI_CHAT_KEY, JSON.stringify(sanitizeAiChat(list)));
const aiCount = () => { const v = readJSON(AI_COUNT_KEY, null); return isObj(v) && v.d === dateKey() ? (parseInt(v.n) || 0) : 0; };
const aiCountUp = () => writeItem(AI_COUNT_KEY, JSON.stringify({ d: dateKey(), n: aiCount() + 1 }));

// The answer is always JSON: { reply, routine? } (routine = 7 days starting on the user's first day of the week)
const aiSchema = S => S.object({
    properties: {
        reply: S.string(),
        routine: S.object({ properties: {
            edit: S.boolean(),
            name: S.string(),
            days: S.array({ items: S.object({ properties: {
                title: S.string(), rest: S.boolean(),
                exercises: S.array({ items: S.object({ properties: { name: S.string(), sets: S.integer(), reps: S.string() } }) })
            } }) })
        }, optionalProperties: ['edit'] }),
        choices: S.array({ items: S.string() }),
        memory: S.array({ items: S.string() })
    },
    optionalProperties: ['routine', 'choices', 'memory']
});
// routine in the app's format ↔ the short format Gemini reads and writes
const routineToAi = rt => ({ name: rt.name, days: rt.schedule.map(d => ({ title: d.isRest ? (d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : d.title, rest: !!d.isRest, exercises: d.exercises.map(e => ({ name: e.name, sets: parseInt(e.sets) || 3, reps: e.reps })) })) });
const aiActive = () => appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0];
const routineFromAi = raw => {
    if (!isObj(raw) || !Array.isArray(raw.days) || raw.days.length !== 7) return null;
    const orig = raw.edit === true ? aiActive() : null;
    const known = new Map(); catalogue().forEach(x => { const k = x.name.trim().toLowerCase(); if (!known.has(k)) known.set(k, x); });
    const start = DAY_NAMES.indexOf(StorageManager.getStartDay()), baseDays = orig ? orig.schedule : [];
    const schedule = raw.days.map((d, i) => {
        d = isObj(d) ? d : {};
        const base = { id: i + 1, day: DAY_NAMES[(start + i) % 7], savedTitle: '' };
        if (baseDays[i]) { base.id = baseDays[i].id; base.day = baseDays[i].day; }
        // only exercises from the library (or your own), each once a day
        const seen = new Set(), exercises = (Array.isArray(d.exercises) ? d.exercises : []).filter(isObj).map(ex => {
            const hit = known.get(toStr(ex.name).trim().toLowerCase()); if (!hit || seen.has(hit.name)) return null; seen.add(hit.name);
            const reps = latinDigits(cut(ex.reps, 20)).trim();
            const kept = baseDays[i] && (baseDays[i].exercises || []).find(e => e.name === hit.name); // unchanged exercises keep their muscle
            return { muscle: kept ? kept.muscle : hit.muscle, name: hit.name, sets: String(Math.min(8, Math.max(1, parseInt(latinDigits(ex.sets)) || 3))), reps: /\d/.test(reps) ? reps : newExercise(hit.name, hit.muscle).reps };
        }).filter(Boolean).slice(0, 12);
        if (d.rest === true || !exercises.length) {
            const active = /active|نشط/i.test(toStr(d.title));
            return { ...base, title: active ? 'Active Rest' : 'Complete Rest', isRest: true, recoveryType: active ? 'active' : 'complete', exercises: [] };
        }
        const title = cut(toStr(d.title).trim(), 40) || 'Workout';
        return { ...base, title, savedTitle: title, isRest: false, recoveryType: null, exercises };
    });
    if (!schedule.some(d => !d.isRest)) return null;
    // a change to their routine keeps its name, and lists what changes
    return orig ? { name: orig.name, schedule, edit: orig.id, chg: aiChanges(orig.schedule, schedule) } : { name: cut(toStr(raw.name).trim(), 60) || t('Apex Coach program'), schedule };
};
// What a change does, day by day: exercises added, removed, or with other sets/reps; a day that becomes rest or training
const aiChanges = (before, after) => after.map((d, i) => {
    const b = before[i] || { exercises: [], isRest: true }, old = new Map(b.exercises.map(e => [e.name, e])), now = new Set(d.exercises.map(e => e.name));
    const c = { day: d.day, title: d.isRest ? '' : d.title,
        add: d.exercises.filter(e => !old.has(e.name)).map(e => [e.name, e.sets, e.reps]),
        del: b.exercises.filter(e => !now.has(e.name)).map(e => e.name),
        mod: d.exercises.filter(e => old.has(e.name) && (old.get(e.name).sets !== e.sets || old.get(e.name).reps !== e.reps)).map(e => [e.name, e.sets, e.reps]),
        rest: !!d.isRest !== !!b.isRest ? (d.isRest ? 'rest' : 'train') : '' };
    return c.add.length || c.del.length || c.mod.length || c.rest ? c : null;
}).filter(Boolean);
const aiChangesHTML = chg => !chg.length ? `<p class="text-[13px] font-bold text-slate-400 mt-3">${t('No changes to your routine.')}</p>`
    : `<div class="mt-3 space-y-2"><div class="text-[12px] font-bold text-slate-400">${t('What changes')}</div>${chg.map(c => `<div class="rounded-xl bg-white/5 px-3 py-2.5">
            <div class="text-[13px] font-black text-white">${esc(dayLong(c.day))}${c.title ? ' · ' + esc(t(c.title)) : ''}</div>
            ${c.rest ? `<div class="text-[13px] font-bold text-slate-300 mt-1">${t(c.rest === 'rest' ? 'Becomes a rest day' : 'Becomes a training day')}</div>` : ''}
            ${c.del.map(n => `<div class="text-[13px] font-bold text-slate-400 mt-1 flex gap-2"><span aria-hidden="true">−</span><span class="line-through">${esc(tx(n))}</span></div>`).join('')}
            ${c.add.map(([n, se, r]) => `<div class="text-[13px] font-bold text-slate-200 mt-1 flex gap-2"><span class="text-[#22c55e]" aria-hidden="true">+</span><span class="flex-1 min-w-0">${esc(tx(n))}</span><span dir="ltr" class="shrink-0">${esc(se)} × ${esc(fmtReps(r))}</span></div>`).join('')}
            ${c.mod.map(([n, se, r]) => `<div class="text-[13px] font-bold text-slate-300 mt-1 flex gap-2"><span aria-hidden="true">•</span><span class="flex-1 min-w-0">${esc(tx(n))}</span><span dir="ltr" class="shrink-0">${esc(se)} × ${esc(fmtReps(r))}</span></div>`).join('')}
        </div>`).join('')}</div>`;

// What Gemini knows about you: the setup answers, your active routine and a summary of the last 8 weeks
const aiContext = () => {
    const pr = getProfile(), b = getBody(), age = ageOf(b), lines = [];
    const GOAL = { muscle: 'build muscle', strength: 'get stronger', fat: 'lose fat' }, EXP = { none: 'never trained', new: 'under 1 year', mid: '1-3 years', adv: '3-5 years', pro: 'over 5 years' };
    lines.push(`- Goal: ${GOAL[pr.goal] || 'not set'}. Experience: ${EXP[pr.exp] || 'not set'}. Training days a week: ${pr.days || 'not set'}. Workout length: ${pr.session ? pr.session + ' minutes' : 'not set'}. Equipment: ${pr.eq === 'db' ? 'dumbbells only (plus bodyweight)' : pr.eq === 'gym' ? 'full gym' : 'not set'}.`);
    lines.push(`- Sex: ${b.sex === 'male' ? 'male' : b.sex === 'female' ? 'female' : 'not given'}. Age: ${age || 'not given'}. Body weight: ${b.weightKg ? b.weightKg + ' kg' : 'not given'}.`);
    const active = aiActive();
    // exactly as the app stores it, so a small change can copy the rest unchanged
    if (active) lines.push(`- Current routine (the active one${appData.weeks.length > 1 ? `, of ${appData.weeks.length} routines` : ''}): ${JSON.stringify(routineToAi(active))}`);
    const mem = getAiMemory(); if (mem.length) lines.push(`- What you remember about them from earlier chats:\n  ` + mem.join('\n  '));
    const h = StorageManager.getHistory(), since = Date.now() - 56 * 864e5, map = {};
    appData.weeks.forEach(w => w.schedule.forEach(d => d.exercises.forEach(e => { map[getExKey(0, 0, 0, e.name)] = e; })));
    const rows = Object.keys(h).map(k => {
        const logs = (h[k] || []).filter(l => { const tt = logTime(l); return !isNaN(tt) && tt >= since; });
        if (!logs.length) return null;
        const last = logs[logs.length - 1], sets = logs.flatMap(logSetDetails), best = sets.reduce((a, s) => (!a || s.w > a.w || (s.w === a.w && s.r > a.r)) ? s : a, null);
        const top = l => { const s = logSetDetails(l); return s.length ? `${s[0].w ? s[0].w + 'kg x ' : ''}${s.map(x => x.r).join('/')}` : ''; };
        const e1 = l => Math.round(Math.max(0, ...logSetDetails(l).map(e1rmOf))), a = e1(logs[0]), z = e1(last);
        return { n: logs.length, text: `${nameOfKey(k, map)}: ${logs.length} sessions, last ${dateKey(logTime(last))} ${top(last)}${best && best.w ? `, best set ${best.w}kg x ${best.r}` : ''}${logs.length > 1 && a && z ? `, estimated 1RM ${a} → ${z} kg` : ''}` };
    }).filter(Boolean).sort((a, c) => c.n - a.n).slice(0, 40);
    lines.push(rows.length ? `- Workouts in the last 8 weeks (${countWorkouts(h)} workout days in total):\n  ` + rows.map(r => r.text).join('\n  ') : '- No workouts logged in the last 8 weeks.');
    // weak points: sets a week for each muscle (last 4 weeks), muscles not trained, and lifts that stopped going up (8 weeks)
    const names = exerciseNameMap(), weekSets = {}, since4 = Date.now() - 28 * 864e5, stuck = [];
    Object.keys(h).forEach(k => {
        const muscle = (names[k] || map[k] || {}).muscle, logs = (h[k] || []).filter(l => { const tt = logTime(l); return !isNaN(tt) && tt >= since; });
        if (muscle) logs.forEach(l => { if (logTime(l) >= since4) weekSets[muscle] = (weekSets[muscle] || 0) + logSetDetails(l).length / 4; });
        const best = l => Math.max(0, ...logSetDetails(l).map(e1rmOf));
        if (logs.length >= 4 && best(logs[0]) > 0) { const half = Math.floor(logs.length / 2), a = Math.max(...logs.slice(0, half).map(best)), b = Math.max(...logs.slice(half).map(best)); if (b <= a) stuck.push(nameOfKey(k, names)); }
    });
    // how regular they are, body weight and daily check-ins
    const days = new Set(); Object.values(h).forEach(list => (list || []).forEach(l => { const tt = logTime(l); if (!isNaN(tt)) days.add(dateKey(tt)); }));
    const all = [...days].sort();
    if (all.length) {
        const wk = [7, 6, 5, 4, 3, 2, 1, 0].map(n => { const a = dateKey(Date.now() - (n + 1) * 7 * 864e5), z = dateKey(Date.now() - n * 7 * 864e5); return all.filter(d => d > a && d <= z).length; });
        lines.push(`- Training since ${all[0]}. Last workout ${all[all.length - 1]} (${Math.round((startOfDay(Date.now()) - startOfDay(Date.parse(all[all.length - 1] + 'T12:00'))) / 864e5)} days ago). Workouts per week, last 8 weeks (oldest first): ${wk.join(', ')}.`);
    }
    const bl = (b.log || []).filter(x => x.t >= Date.now() - 84 * 864e5);
    if (bl.length > 1) lines.push(`- Body weight, last 12 weeks: ${bl[0].kg} kg on ${dateKey(bl[0].t)} → ${bl[bl.length - 1].kg} kg on ${dateKey(bl[bl.length - 1].t)}.`);
    const rd = getReadinessAll(), rk = Object.keys(rd).filter(k => k >= dateKey(Date.now() - 14 * 864e5)).sort();
    if (rk.length) {
        const avg = f => round1(rk.reduce((x, k) => x + (rd[k][f] || 0), 0) / rk.length);
        lines.push(`- Daily check-ins, last 2 weeks (${rk.length}; 0 = bad, 2 = good): sleep ${avg('sleep')}, soreness ${avg('soreness')} (2 = fresh), energy ${avg('energy')}. Latest ${rk[rk.length - 1]}: sleep ${rd[rk[rk.length - 1]].sleep}, soreness ${rd[rk[rk.length - 1]].soreness}, energy ${rd[rk[rk.length - 1]].energy}.`);
    }
    if (rows.length) {
        const MAIN = ['Chest', 'Lats', 'Back', 'Side Delts', 'Rear Delts', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs'];
        const list = Object.keys(weekSets).sort((a, c) => weekSets[a] - weekSets[c]).map(m => `${m} ${round1(weekSets[m])}`);
        lines.push(`- Sets a week by muscle (last 4 weeks, fewest first): ${list.join(', ') || 'none'}.`);
        const none = MAIN.filter(m => !weekSets[m]); if (none.length) lines.push(`- Not trained in the last 4 weeks: ${none.join(', ')}.`);
        if (stuck.length) lines.push(`- Lifts with no progress in 8 weeks: ${stuck.slice(0, 10).join(', ')}.`);
    }
    return lines.join('\n');
};
const aiSystem = () => {
    const start = StorageManager.getStartDay(), order = [0, 1, 2, 3, 4, 5, 6].map(i => DAY_NAMES[(DAY_NAMES.indexOf(start) + i) % 7]).join(', ');
    const lib = muscleOptions.map(m => `${m}: ${(exerciseDictionary[m] || []).join(', ')}`).concat(getCustomEx().length ? [`Own exercises: ${getCustomEx().map(x => x.name).join(', ')}`] : []).join('\n');
    return `You are Apex Coach (in Arabic: مدرب Apex, always with "Apex" in Latin letters), the personal coach inside Apex Lift, a gym workout app. Talk like a real, experienced coach who knows this person: warm, natural and honest, in your own words. Have a real conversation: react to what they say, ask when you are curious or something matters, share your reasoning, encourage them, and push back kindly when an idea isn't good for them. Don't follow a script or a fixed list of questions.

Your only job is coaching: training, programs, exercises and technique, progression, recovery and sleep, motivation and habits, and general nutrition for training (protein, eating enough or less for their goal). If they ask about something else, answer in one friendly sentence that you're only their coach, and bring it back to their training. You are not a doctor: for pain, injury, illness, medicines or pregnancy, tell them to see a doctor or physiotherapist, and don't program around an injury yourself.

How you coach:
- Get to know them before you build a new program, like a coach at a first meeting: what they want most, their weak or lagging muscles, pain or movements to avoid, exercises they love or hate, their schedule and life. Ask what you really need, in a natural way (one thing at a time is easiest on a phone), and skip what you already know below. If they want the program right away, build it with what you know.
- Use their data like a coach who has watched them train: notice muscles that get few sets or none, lifts that stopped going up, and what they do often. Mention what you see when it helps, and ask if it matches how they feel.
- Give their weakest muscles more attention (the ones they name, or the lagging ones in their data): about twice a week, early in the workout, a few more sets, while each workout still fits their time. Say which muscle you focused on and why.
- Be flexible. When they want a small change to their current routine (an exercise they don't like or that hurts, a muscle they want more or less of, a shorter day, another day), change only that: send their current routine with "edit": true, every other day and exercise copied exactly as it is, and only the asked change made. If it's unclear what to swap in, suggest one or two options and ask. A new program only when they ask for one.
- Follow their progress like a coach who sees every workout: how regular they are, lifts going up or stuck, body weight, sleep, soreness and energy from their check-ins. When they ask how they are doing, be specific with their numbers. If something needs attention (missed weeks, stuck lifts, poor sleep or recovery), bring it up kindly and suggest what to do.
- Prefer exercises they already do, and use their history to say what to progress. Never invent numbers they didn't log.

How the app reads your answer (follow this exactly):
- "reply": what you say, in ${isAR ? 'Arabic' : 'English'}, written like a chat message on a phone: usually short, longer only when they ask for detail. Plain text; "- " for lists and **bold** are fine; no headings or tables.
- "memory": the things worth remembering about them for later chats (injuries or pain, likes and dislikes, schedule and life, goals and weak points they told you), as short notes in ${isAR ? 'Arabic' : 'English'}. Send the full updated list (up to 15 notes) only when you learned something new or something changed; leave it out otherwise.
- "choices": when you ask something, 2 to 5 short answers they can tap (up to 5 words each, in their language). Leave it out otherwise.
- "routine": only when you build or change a program ("edit": true when it is their current routine with changes, then keep its days and only change what they asked). Exactly 7 days in this order: ${order}. Rest days: rest true, title "Complete Rest" or "Active Rest", no exercises. Use their number of training days and workout length unless they ask otherwise (about 4 exercises for 30 min, 5 for 45, 7 for 60, 8 for 90). Sets 1 to 6; reps like "8 - 10", or seconds like "30 - 45s" for holds; big lifts first. Use ONLY exercise names from the list below, written exactly the same (with dumbbells only: dumbbell and bodyweight exercises). Day titles 1 to 3 words and the routine name up to 4 words, in ${isAR ? 'Arabic' : 'English'}, like ${isAR ? '"دفع", "سحب", "أرجل", "الجزء العلوي"' : '"Push", "Pull", "Legs", "Upper Body"'}. With a routine, "reply" says briefly why it fits them; they can see the days themselves.
- Today is ${dateKey()} (${DAY_NAMES[new Date().getDay()]}).

About the user:
${aiContext()}
Exercises you may use (by muscle):
${lib}`;
};

// Firebase AI errors → a message for the user
const aiErrStatus = e => (e && e.customErrorData && e.customErrorData.status) || 0;
const aiModelGone = e => aiErrStatus(e) === 404 || /model.*(not found|not supported)|is not found/i.test((e && e.message) || '');
// Google is busy: the free limit for the minute/day (429) or its servers are overloaded (5xx). The error text holds the
// request address (…:generateContent), so only status codes and whole words are checked.
const aiBusy = e => { const st = aiErrStatus(e); return st === 429 || st >= 500 || /\b(quota|exhausted|overloaded|too many requests|rate limit)\b/i.test((e && e.message) || ''); };
const aiErrorText = e => {
    const st = aiErrStatus(e), code = st ? ` (${st})` : '';
    if (navigator.onLine === false || (e && e.code === 'fetch-error' && !st)) return t('No internet connection. Try again when online.');
    if (aiBusy(e)) return t('Apex Coach is busy right now. Try again in a minute.') + code;
    if ((e && e.code === 'api-not-enabled') || st === 401 || st === 403) return t('Apex Coach is not ready yet. Try again later.') + code;
    return t('Apex Coach could not answer. Try again.') + code;
};
const aiAsk = async contents => {
    const { fbAI, ai } = await loadAI();
    const models = AI_MODELS.filter(m => !AI.gone.has(m)), list = models.length ? models : AI_MODELS; let last = null;
    for (let i = 0; i < list.length; i++) {
        const name = list[i], think = /^gemini-3/.test(name) && !AI.noThink.has(name) ? { thinkingConfig: { thinkingLevel: 'LOW' } } : {};
        const model = fbAI.getGenerativeModel(ai, { model: name, systemInstruction: aiSystem(),
            generationConfig: { responseMimeType: 'application/json', responseSchema: aiSchema(fbAI.Schema), temperature: 0.9, maxOutputTokens: 8192, ...think } });
        try { return (await model.generateContent({ contents })).response.text(); }
        catch (e) {
            last = e; console.warn('Apex Coach', name, e);
            if (think.thinkingConfig && aiErrStatus(e) === 400) { AI.noThink.add(name); i--; continue; } // same model, without the setting
            if (aiModelGone(e)) { AI.gone.add(name); continue; } // retired: never again this visit
            if (aiBusy(e)) continue; // busy or a server error at Google: the next model (each has its own free limit)
            throw e;
        }
    }
    throw last;
};
const aiParse = text => {
    let o = null; try { o = JSON.parse(String(text || '').trim().replace(/^```(?:json)?\s*|\s*```$/g, '')); } catch (e) {}
    if (!isObj(o)) return null;
    const rt = o.routine ? routineFromAi(o.routine) : null;
    const x = cut(o.reply, 3000).trim() || (rt ? t(rt.edit ? 'Here are the changes.' : 'Here is a program for you.') : '');
    if (Array.isArray(o.memory)) writeItem(AI_MEM_KEY, JSON.stringify(o.memory.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim().slice(0, 160)).slice(0, 20)));
    const ch = !rt && Array.isArray(o.choices) ? o.choices.filter(c => typeof c === 'string' && c.trim()).slice(0, 6).map(c => c.trim().slice(0, 60)) : [];
    return x || rt ? { r: 'm', x, ...(rt ? { rt } : {}), ...(ch.length ? { ch } : {}) } : null;
};

// Chat text: plain text with line breaks, "- " lists and **bold**
const aiTextHTML = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').split('\n').map(l => /^\s*[-•*]\s+/.test(l) ? `<span class="ai-li">${l.replace(/^\s*[-•*]\s+/, '')}</span>` : l).join('<br>').replace(/<\/span><br>/g, '</span>');
const aiWeekHTML = sched => `<div class="grid grid-cols-7 gap-1 mt-3">${sched.map(d => `<div class="rounded-lg py-1.5 px-0.5 text-center ${d.isRest ? 'bg-white/5 text-slate-400' : 'bg-[#d4af37]/15 text-[#d4af37]'}"><div class="text-[12px] font-bold">${esc(dayShort(d.day))}</div><div class="pv-wo mt-0.5">${d.isRest ? '—' : esc(t(d.title))}</div></div>`).join('')}</div>`;
const AI_IDEAS = ['How is my progress?', 'Build the best program for me', 'I don\'t like one exercise in my routine', 'My workouts take too long. Make them shorter.', 'Which muscle is my weakest?'];
const renderAI = (scroll = true) => {
    const list = document.getElementById('ai-list'), input = document.getElementById('ai-input'), send = document.getElementById('ai-send');
    if (!list) return;
    const ok = localStorage.getItem(AI_OK_KEY) === '1', msgs = getAiChat(), full = appData.weeks.length >= 5;
    document.getElementById('ai-compose').classList.toggle('hidden', !ok);
    document.getElementById('ai-new').classList.toggle('hidden', !ok || !msgs.length);
    if (input) input.disabled = AI.busy;
    if (send) { send.disabled = AI.busy; send.classList.toggle('opacity-50', AI.busy); }
    if (!ok) {
        list.innerHTML = `<div class="pt-4 pb-6 text-center">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-[#d4af37]"><i data-lucide="sparkles" class="w-7 h-7"></i></div>
                <h2 class="text-[22px] font-black text-white mt-4">${t('Meet Apex Coach')}</h2>
                <p class="text-[14px] font-bold text-slate-300 mt-2">${t('Tell it what you want and it builds a program for you, from your answers and your workouts.')}</p>
            </div>
            <div class="glass-card ex-card text-[13px] font-bold text-slate-300 space-y-2">
                <p class="flex gap-2"><i data-lucide="send" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('To answer, your training answers, age, sex, body weight, routines, workout history and check-ins are sent to Google Gemini. Your name and email are not sent.')}</span></p>
                <p class="flex gap-2"><i data-lucide="shield-alert" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('Its answers can be wrong. It is not medical advice: stop if something hurts and see a doctor.')}</span></p>
                <p class="flex gap-2"><i data-lucide="smartphone" class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"></i><span>${t('The chat is saved on this phone. Google and the Apex Lift team can see the questions for a limited time, so don\'t type private details.')}</span></p>
            </div>
            <a href="privacy.html${isAR ? '#ar' : ''}" target="_blank" rel="noopener" class="block text-center text-[13px] font-bold text-slate-400 underline py-3 mt-1">${t('Privacy Policy')}</a>
            <button data-on-click="window.appActions.aiAgree()" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 mt-2"><i data-lucide="check" class="w-5 h-5"></i>${t('Got it, start')}</button>`;
    } else {
        const bubble = (m, i) => m.r === 'u'
            ? `<div class="flex justify-end"><div class="ai-msg ai-me" dir="auto">${aiTextHTML(m.x)}</div></div>`
            : m.err ? `<div class="flex justify-start"><div class="ai-msg ai-bot ai-err" role="alert"><div class="flex gap-2"><i data-lucide="cloud-off" class="w-4 h-4 shrink-0 mt-1 text-slate-400"></i><span dir="auto">${aiTextHTML(m.x)}</span></div>${i === msgs.length - 1 && !AI.busy ? `<button data-on-click="window.appActions.aiRetry()" class="mt-3 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-black text-white tap-feedback flex items-center justify-center gap-2"><i data-lucide="rotate-cw" class="w-4 h-4"></i>${t('Try again')}</button>` : ''}</div></div>`
            : `<div class="flex justify-start"><div class="ai-msg ai-bot"><div dir="auto">${aiTextHTML(m.x)}</div>${m.rt ? `
                    <div class="mt-3 pt-3 border-t border-white/10">
                        <div class="flex items-center justify-between gap-2"><span class="text-[15px] font-black text-white min-w-0 truncate">${esc(m.rt.name)}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} training days', { n: m.rt.schedule.filter(d => !d.isRest).length })}</span></div>
                        ${aiWeekHTML(m.rt.schedule)}
                        ${m.rt.edit ? aiChangesHTML(m.rt.chg || []) : ''}
                        ${AI.open === i ? `<div class="space-y-2 mt-3">${m.rt.schedule.map(programDayCardHTML).join('')}</div>` : ''}
                        <div class="flex gap-2 mt-3">
                            <button data-on-click="window.appActions.aiToggle(@0)" data-a-click="${hArgs(i)}" class="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-slate-200 tap-feedback">${t(AI.open === i ? 'Hide days' : 'See all days')}</button>
                            <button data-on-click="window.appActions.aiUse(@0)" data-a-click="${hArgs(i)}" class="flex-1 py-3 rounded-xl ${m.used ? 'bg-white/5 border border-white/10 text-slate-300' : 'bg-[#d4af37] text-black'} text-[13px] font-black tap-feedback">${t(m.rt.edit ? (m.used ? 'Applied' : 'Apply changes') : m.used ? 'Use it again' : 'Use this program')}</button>
                        </div>
                        <p class="text-[12px] font-bold text-slate-400 mt-2">${m.rt.edit ? t('Only these changes are made to {name}. Your history is kept.', { name: m.rt.name }) : full ? t('It replaces your current routine. Your history is kept.') : t('It is added as a new routine. Your current routine and history are kept.')}</p>
                    </div>` : ''}</div></div>`;
        list.innerHTML = (msgs.length ? '' : `<div class="pt-2 pb-4">
                    <p class="text-[14px] font-bold text-slate-300">${t('Ask for a program, a change to your routine, or anything about training.')}</p>
                    ${getAiMemory().length ? `<div class="glass-card ex-card mt-4"><div class="flex items-center justify-between gap-2"><span class="text-[13px] font-black text-white">${t('Your coach remembers')}</span><button data-on-click="window.appActions.aiForget()" class="text-[13px] font-bold text-slate-400 underline px-2 py-2.5 tap-feedback">${t('Forget all')}</button></div>${getAiMemory().map(n => `<span class="ai-li text-[13px] font-bold text-slate-300 mt-1" dir="auto">${esc(n)}</span>`).join('')}</div>` : ''}
                    <div class="flex flex-col gap-2 mt-4">${AI_IDEAS.map(q => `<button data-on-click="window.appActions.aiSend(@0)" data-a-click="${hArgs(hStr(t(q)))}" class="w-full text-start px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[14px] font-bold text-slate-200 tap-feedback">${esc(t(q))}</button>`).join('')}</div>
                </div>`)
            + `<div class="space-y-3">${msgs.map(bubble).join('')}${!AI.busy && msgs.length && msgs[msgs.length - 1].ch ? `<div class="flex flex-wrap gap-2">${msgs[msgs.length - 1].ch.map(c => `<button data-on-click="window.appActions.aiSend(@0)" data-a-click="${hArgs(hStr(c))}" dir="auto" class="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[14px] font-bold text-slate-200 tap-feedback">${esc(c)}</button>`).join('')}</div>` : ''}${AI.busy ? `<div class="flex justify-start"><div class="ai-msg ai-bot" role="status" aria-label="${esc(t('Thinking…'))}"><span class="ai-dots"><i></i><i></i><i></i></span><span class="ai-wait">${t('Apex Coach is thinking. A full program can take up to 30 seconds.')}</span></div></div>` : ''}</div>`;
    }
    if (window.lucide) window.lucide.createIcons({ root: list });
    if (scroll) { const msgEls = list.querySelectorAll('.ai-msg'), lastEl = msgEls[msgEls.length - 1]; list.scrollTop = lastEl ? Math.min(list.scrollHeight, lastEl.parentElement.offsetTop - 12) : list.scrollHeight; }
};
Object.assign(window.appActions, {
    openAI: () => {
        AI.open = -1;
        const box = document.getElementById('ai-box');
        box.querySelectorAll('[data-ai-label]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aiLabel)));
        renderAI();
        openSheet('ai-overlay', 'ai-box');
        pushBack('ai', () => window.appActions.closeAI());
    },
    closeAI: () => { popBack('ai'); closeSheet('ai-overlay', 'ai-box'); },
    aiAgree: () => { try { localStorage.setItem(AI_OK_KEY, '1'); } catch (e) {} renderAI(); loadAI().catch(() => {}); },
    aiNew: () => {
        if (AI.busy || !getAiChat().length) return;
        window.appActions.showConfirm(t('Start a new chat?'), t('This chat is deleted from this phone. What your coach remembers about you is kept.'), () => { setAiChat([]); AI.open = -1; renderAI(); }, true);
    },
    aiToggle: i => { AI.open = AI.open === i ? -1 : i; const list = document.getElementById('ai-list'), top = list.scrollTop; renderAI(false); list.scrollTop = top; },
    aiSend: async preset => {
        const input = document.getElementById('ai-input');
        const text = cut(typeof preset === 'string' ? preset : (input ? input.value : ''), 500).trim();
        if (!text || AI.busy) return;
        if (navigator.onLine === false) return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error');
        if (aiCount() >= AI_DAILY) return window.appActions.showToast(t('That is all the questions for today. Try again tomorrow.'), 'error');
        const msgs = [...getAiChat(), { r: 'u', x: text }];
        setAiChat(msgs);
        if (input) { input.value = ''; input.style.height = ''; }
        AI.busy = true; renderAI();
        try {
            const ok = msgs.filter(m => !m.err).slice(-AI_CONTEXT), lastRt = ok.map(m => !!m.rt).lastIndexOf(true), contents = [];
            ok.forEach((m, i) => {
                const role = m.r === 'u' ? 'user' : 'model';
                const text = m.r === 'u' ? m.x : JSON.stringify({ reply: m.x, ...(m.rt && i === lastRt ? { routine: routineToAi(m.rt) } : {}) }) + (m.rt && i !== lastRt ? ` [sent the program "${m.rt.name}"]` : '');
                const prev = contents[contents.length - 1];
                if (prev && prev.role === role) prev.parts[0].text += '\n' + text; else contents.push({ role, parts: [{ text }] }); // turns take turns
            });
            while (contents.length && contents[0].role !== 'user') contents.shift(); // a chat starts with a question
            const reply = aiParse(await aiAsk(contents));
            if (reply) aiCountUp(); // only answers count towards the daily limit
            setAiChat([...getAiChat(), reply || { r: 'm', x: t('Apex Coach could not answer. Try again.'), err: true }]);
        } catch (e) {
            setAiChat([...getAiChat(), { r: 'm', x: aiErrorText(e), err: true }]);
        } finally { AI.busy = false; renderAI(); }
    },
    aiRetry: () => {
        if (AI.busy) return;
        const msgs = getAiChat(); while (msgs.length && msgs[msgs.length - 1].err) msgs.pop();
        const q = msgs.length && msgs[msgs.length - 1].r === 'u' ? msgs.pop() : null;
        setAiChat(msgs); if (q) window.appActions.aiSend(q.x); else renderAI();
    },
    aiUse: (i, sure = false) => {
        const msgs = getAiChat(), m = msgs[i]; if (!m || !m.rt) return;
        if (window.appState.sess) return window.appActions.showToast(t('Finish your workout first, then change your plan.'), 'error');
        const target = m.rt.edit && appData.weeks.find(w => w.id === m.rt.edit);
        if (!sure && !target && appData.weeks.length >= 5)
            return window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), () => window.appActions.aiUse(i, true), true);
        const clean = sanitizePlan({ weeks: [{ id: 'w_' + Date.now(), name: m.rt.name, schedule: m.rt.schedule }] });
        if (!clean) return;
        m.used = true; setAiChat(msgs);
        window.appActions.closeAI();
        putRoutine(target ? target.name : clean.weeks[0].name, clean.weeks[0].schedule, { undo: true, targetId: target ? target.id : null });
    },
    aiForget: () => window.appActions.showConfirm(t('Forget everything?'), t('Your coach forgets the notes it kept about you.'), () => { try { localStorage.removeItem(AI_MEM_KEY); } catch (e) {} renderAI(false); }, true),
    aiKey: e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(pointer: fine)').matches) { e.preventDefault(); window.appActions.aiSend(); } },
    aiGrow: el => { el.style.height = ''; el.style.height = Math.min(el.scrollHeight, 140) + 'px'; }
});

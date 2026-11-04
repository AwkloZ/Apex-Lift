// Apex Lift coach builder (admin page): build a weekly routine, or edit one of the client's routines,
// and send it straight to their account. It is written to users/{uid}/coach/plan; the client's app picks it up
// the next time it is open (instantly if it is open now), adds or replaces the routine and makes it active.
// Uses the same exercise library as the app (library.js). Saved templates live in coachTemplates (admin only).
window.ApexCoach = (() => {
    'use strict';
    const { muscleOptions, exerciseDictionary, WORKOUTS, PROGRAMS } = window.APEX_LIB;
    const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const DAY_LONG = { SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday' };
    const REPS_PRESETS = ['5', '3 - 5', '6 - 8', '8 - 10', '8 - 12', '10 - 12', '12 - 15', '15 - 20', '30 - 45s'];
    const MAX_EX = 60, NOTE_MAX = 1000;
    const { $, esc, isObj } = window.ApexAdminUtils; // admin-utils.js
    // text: Arabic in the coach app (coach-i18n.js), English on the admin page. Day titles and routine names sent to the
    // client stay as typed; the app translates the standard ones (New Day, Complete Rest, ...) itself.
    const t = (window.ApexCoachI18n && window.ApexCoachI18n.t) || ((en, v) => v ? en.replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m) : en);
    const tm = m => (window.ApexCoachI18n && window.ApexCoachI18n.muscle) ? window.ApexCoachI18n.muscle(m) : m;
    const tex = n => (window.ApexCoachI18n && window.ApexCoachI18n.isAR && window.APEX_LIB.exerciseAR && window.APEX_LIB.exerciseAR[n]) || n;
    const clone = v => JSON.parse(JSON.stringify(v));
    const muscleOf = name => Object.keys(exerciseDictionary).find(m => exerciseDictionary[m].includes(name)) || '';
    const ALL_EX = [...new Set(Object.values(exerciseDictionary).flat())].sort();

    let S = null; // { db, auth, client, mode, targetId, routine, note, dirty, templates, onSent, templatesPath }
    // templatesPath: where saved templates live: 'coachTemplates' (admin, the default) or 'coaches/{uid}/templates' (a coach)

    // ---------- routine helpers (same shape the app uses: 7 days, each { id, day, title, isRest, recoveryType, savedTitle, exercises }) ----------
    const dayOrder = startDay => { const s = Math.max(0, DAY_NAMES.indexOf(startDay)); return DAY_NAMES.map((_, i) => DAY_NAMES[(s + i) % 7]); };
    const blankDay = (i, day) => ({ id: i + 1, day, title: 'New Day', isRest: false, recoveryType: null, savedTitle: '', exercises: [] });
    const restDay = (i, day, active) => ({ id: i + 1, day, title: active ? 'Active Rest' : 'Complete Rest', isRest: true, recoveryType: active ? 'active' : 'complete', savedTitle: '', exercises: [] });
    const blankRoutine = () => ({ id: '', name: 'Coach plan', schedule: dayOrder(S.client.startDay).map((d, i) => blankDay(i, d)) });
    // the same rules the app uses for programs: newer lifters get one set less on accessories, advanced one more on the first two lifts
    const fromProgram = prog => ({
        id: '', name: prog.name, schedule: prog.week.map((slot, i) => {
            const day = dayOrder(S.client.startDay)[i];
            if (slot === 'R' || slot === 'A') return restDay(i, day, slot === 'A');
            const [title, list] = WORKOUTS[slot];
            return { id: i + 1, day, title, savedTitle: title, isRest: false, recoveryType: null, exercises: list.slice(0, ({ 30: 4, 45: 5 })[S.client.session] || 99).map(([name, muscle, sets, reps], j) => { // shorter workouts: fewer exercises (same rule as the app)
                let n = parseInt(sets);
                if (S.client.exp === 'none') n = Math.max(2, n - 1);
                if (S.client.exp === 'new' && j >= 2) n = Math.max(2, n - 1);
                if (S.client.exp === 'adv' && j < 2) n = Math.max(n, Math.min(4, n + 1));
                if (S.client.exp === 'pro' && j < 3) n = Math.max(n, Math.min(5, n + 1));
                return { muscle, name, sets: String(n), reps };
            }) };
        })
    });
    // clean anything loaded (client routine, template) into the exact shape, never more than the app accepts
    const cleanRoutine = r => {
        const order = dayOrder(S.client.startDay);
        const sched = Array.isArray(r && r.schedule) && r.schedule.length === 7 ? r.schedule : order.map((d, i) => blankDay(i, d));
        return {
            id: String((r && r.id) || '').slice(0, 60), name: String((r && r.name) || 'Coach plan').slice(0, 60),
            schedule: sched.map((d, i) => {
                d = isObj(d) ? d : {};
                const isRest = d.isRest === true;
                return { id: i + 1, day: DAY_NAMES.includes(d.day) ? d.day : order[i], title: String(d.title || (isRest ? 'Complete Rest' : 'New Day')).slice(0, 80), isRest,
                    recoveryType: isRest ? (d.recoveryType === 'active' ? 'active' : 'complete') : null, savedTitle: String(d.savedTitle || '').slice(0, 80),
                    exercises: isRest ? [] : (Array.isArray(d.exercises) ? d.exercises : []).filter(isObj).slice(0, MAX_EX).map(e => ({
                        muscle: String(e.muscle || 'Muscle').slice(0, 40), name: String(e.name || 'New Exercise').slice(0, 80), sets: String(e.sets || '3').slice(0, 10), reps: String(e.reps || '10').slice(0, 20) })) };
            })
        };
    };

    // ---------- open / close ----------
    const open = opts => {
        S = { ...opts, templates: null, dirty: false, note: '', activate: true };
        S.targetId = opts.mode === 'replace' && opts.routine ? String(opts.routine.id || '') : '';
        S.routine = opts.routine ? cleanRoutine(opts.routine) : blankRoutine();
        $('coach').classList.add('open');
        document.body.style.overflow = 'hidden';
        render();
        loadTemplates();
    };
    const close = (force = false) => {
        if (!force && S && S.dirty && !confirm(t('Close without sending? Your changes are lost.'))) return;
        $('coach').classList.remove('open'); $('coach').innerHTML = ''; document.body.style.overflow = ''; S = null;
    };
    const loadTemplates = async () => {
        try {
            const qs = await S.db.collection(S.templatesPath || 'coachTemplates').get(), list = [];
            qs.forEach(d => { const x = d.data() || {}; if (isObj(x.routine)) list.push({ id: d.id, name: String(x.name || 'Template'), routine: x.routine, updatedAt: x.updatedAt || 0 }); });
            if (!S) return;
            S.templates = list.sort((a, b) => a.name.localeCompare(b.name));
            renderStartFrom();
        } catch (e) { console.warn('Templates', e); if (S) { S.templates = []; renderStartFrom(); } }
    };

    // ---------- page ----------
    // where the routine goes: a new routine next to theirs, or into one of their routines (S.targetId)
    const destHTML = () => {
        const c = S.client;
        return `<div class="row" style="align-items:end">
            <div style="flex:2;min-width:240px"><label class="lbl" for="cb-dest">${t('Send to')}</label><select id="cb-dest" class="field">
                <option value="" ${!S.targetId ? 'selected' : ''}>${t('Add as a new routine (they keep the others)')}</option>
                ${c.routines.map(w => `<option value="${esc(w.id)}" ${S.targetId === w.id ? 'selected' : ''}>${t('Update their routine: {name}', { name: esc(w.name) })}${w.id === c.activeWeek ? ` (${t('active')})` : ''}</option>`).join('')}
            </select></div>
            <label class="check" style="padding-bottom:10px"><input type="checkbox" id="cb-active" ${S.activate ? 'checked' : ''}> ${t('Make it their active routine')}</label>
        </div><div id="cb-mode" style="margin-top:10px">${modeText()}</div>`;
    };
    const modeText = () => {
        const c = S.client, target = c.routines.find(w => w.id === S.targetId);
        if (S.mode === 'note') return `<div class="info">${t('Pins a note on the Today page of {name}\'s app, above their workout, until they close it.', { name: esc(c.name) })}</div>`;
        if (target) return `<div class="info">${t(S.activate ? 'Updates their routine "{name}" and makes it the active one. Their app saves a backup of the old version first, and their workout history is kept.' : 'Updates their routine "{name}". Their app saves a backup of the old version first, and their workout history is kept.', { name: `<b>${esc(target.name)}</b>` })}</div>`;
        if (c.routines.length >= 5) return `<div class="warn">${t('{name} already has 5 routines (the most the app allows), so a new one can\'t be added: it replaces their active routine. Their app saves a backup first. To keep all 5, choose "Update their routine" above instead.', { name: esc(c.name) })}</div>`;
        return `<div class="info">${t(S.activate ? 'Adds a new routine for {name} and makes it the active one. Their other routines and history stay.' : 'Adds a new routine for {name}. Their other routines and history stay.', { name: esc(c.name) })}</div>`;
    };
    const render = () => {
        const isNote = S.mode === 'note';
        $('coach').innerHTML = `<div class="coach-bar"><div class="in">
                <h2>${isNote ? t('Note') : t('Routine')} · ${esc(S.client.name)}</h2>
                <button class="btn" id="cb-close">${t('Cancel')}</button>
                ${isNote ? '' : `<button class="btn" id="cb-tpl">${t('Save as template')}</button>`}
                <button class="btn gold" id="cb-send">${t('Send to {name}', { name: esc(S.client.name.split(' ')[0] || t('client')) })}</button>
            </div></div>
            <div class="coach-body">
                ${isNote ? modeText() : destHTML()}
                ${isNote ? '' : `<div class="row" style="margin-top:14px;align-items:end">
                    <div style="flex:2;min-width:220px"><label class="lbl" for="cb-name">${t('Routine name')}</label><input id="cb-name" class="field" maxlength="60" value="${esc(S.routine.name)}"></div>
                    <div style="flex:2;min-width:220px"><label class="lbl" for="cb-from">${t('Start from')}</label><select id="cb-from" class="field"></select></div>
                    <button class="btn" id="cb-deltpl" hidden>${t('Delete template')}</button>
                </div>
                <div class="days" id="cb-days"></div>`}
                <div style="margin-top:16px"><label class="lbl" for="cb-note">${isNote ? t('Note') : t('Note to your client (optional)')}</label>
                    <textarea id="cb-note" rows="4" maxlength="${NOTE_MAX}" dir="auto" placeholder="${esc(isNote ? t('Great week! Next week add 2.5 kg to your squat…') : t('What changed and why, how to progress, what to focus on…'))}">${esc(S.note)}</textarea>
                    <div class="note" style="margin-top:4px" id="cb-count"></div></div>
                <p id="cb-msg" class="note"></p>
                <datalist id="cb-exlist">${ALL_EX.map(n => `<option value="${esc(n)}"${tex(n) !== n ? ` label="${esc(tex(n))}"` : ''}></option>`).join('')}</datalist>
                <datalist id="cb-reps">${REPS_PRESETS.map(n => `<option value="${esc(n)}"></option>`).join('')}</datalist>
            </div>`;
        $('cb-close').onclick = () => close();
        $('cb-send').onclick = send;
        $('cb-note').oninput = e => { S.note = e.target.value.slice(0, NOTE_MAX); S.dirty = true; $('cb-count').textContent = `${S.note.length} / ${NOTE_MAX}`; };
        $('cb-count').textContent = `${S.note.length} / ${NOTE_MAX}`;
        if (!isNote) {
            $('cb-tpl').onclick = saveTemplate;
            $('cb-name').oninput = e => { S.routine.name = e.target.value.slice(0, 60); S.dirty = true; };
            $('cb-from').onchange = e => startFrom(e.target.value);
            $('cb-deltpl').onclick = deleteTemplate;
            $('cb-active').onchange = e => { S.activate = e.target.checked; $('cb-mode').innerHTML = modeText(); };
            $('cb-dest').onchange = e => pickDest(e.target.value);
            renderStartFrom(); renderDays();
            const days = $('cb-days');
            days.addEventListener('input', onInput);
            days.addEventListener('change', onChange);
            days.addEventListener('click', onClick);
        }
    };
    const renderStartFrom = () => {
        const sel = $('cb-from'); if (!sel) return;
        const own = S.client.routines.map(w => `<option value="own:${esc(w.id)}">${esc(w.name)}${w.id === S.client.activeWeek ? ` (${t('active')})` : ''}</option>`).join('');
        const progs = PROGRAMS.map(p => `<option value="prog:${esc(p.id)}">${esc(t(p.name))} · ${t('{n} days a week', { n: p.days })}</option>`).join('');
        const tpls = S.templates === null ? `<option disabled>${t('Loading…')}</option>` : S.templates.map(x => `<option value="tpl:${esc(x.id)}">${esc(x.name)}</option>`).join('') || `<option disabled>${t('No templates yet')}</option>`;
        sel.innerHTML = `<option value="">${t('Choose…')}</option><option value="blank">${t('Empty week')}</option><optgroup label="${esc(t('Their routines'))}">${own || `<option disabled>${t('None')}</option>`}</optgroup><optgroup label="${esc(t('Programs'))}">${progs}</optgroup><optgroup label="${esc(t('Your templates'))}">${tpls}</optgroup>`;
        sel.value = S.from || '';
        $('cb-deltpl').hidden = !(S.from || '').startsWith('tpl:');
    };
    // choosing one of their routines loads it, so you add to what they already have
    const pickDest = id => {
        const w = S.client.routines.find(x => x.id === id);
        if (w && S.dirty && !confirm(t('Load "{name}" to edit it? The days you have built so far are replaced.', { name: w.name }))) { $('cb-dest').value = S.targetId; return; }
        S.targetId = w ? w.id : '';
        if (w) { S.routine = cleanRoutine(w); S.from = ''; S.dirty = false; $('cb-name').value = S.routine.name; renderStartFrom(); renderDays(); }
        $('cb-mode').innerHTML = modeText();
    };
    const startFrom = v => {
        if (!v) return;
        if (S.dirty && !confirm(t('Replace the days you have built so far?'))) { $('cb-from').value = S.from || ''; return; }
        let r = null;
        if (v === 'blank') r = blankRoutine();
        else if (v.startsWith('own:')) { const w = S.client.routines.find(x => x.id === v.slice(4)); if (w) r = { ...cleanRoutine(w), id: '' }; }
        else if (v.startsWith('prog:')) { const p = PROGRAMS.find(x => x.id === v.slice(5)); if (p) r = fromProgram(p); }
        else if (v.startsWith('tpl:')) { const tp = (S.templates || []).find(x => x.id === v.slice(4)); if (tp) r = cleanRoutine({ ...tp.routine, id: '' }); }
        if (!r) return;
        // the days follow the client's own first day of the week
        const order = dayOrder(S.client.startDay); r.schedule.forEach((d, i) => { d.day = order[i]; d.id = i + 1; });
        S.routine = { ...r, id: S.routine.id };
        S.from = v; S.dirty = v !== 'blank';
        $('cb-name').value = S.routine.name;
        renderStartFrom(); renderDays();
    };
    const exRow = (d, e, j, n) => `<div class="ex" data-d="${d.id - 1}" data-j="${j}">
            <input class="field" list="cb-exlist" data-f="name" maxlength="80" value="${esc(e.name === 'New Exercise' ? '' : e.name)}" placeholder="${esc(t('Exercise'))}" aria-label="${esc(t('Exercise name'))}">
            <select class="field" data-f="muscle" aria-label="${esc(t('Muscle'))}">${[...new Set([e.muscle, ...muscleOptions])].map(m => `<option value="${esc(m)}" ${m === e.muscle ? 'selected' : ''}>${esc(tm(m))}</option>`).join('')}</select>
            <div class="nums">
                <input class="field" data-f="sets" inputmode="numeric" maxlength="2" value="${esc(e.sets)}" aria-label="${esc(t('Sets'))}" title="${esc(t('Sets'))}">
                <input class="field" data-f="reps" list="cb-reps" maxlength="20" value="${esc(e.reps)}" aria-label="${esc(t('Reps'))}" title="${esc(t('Reps (or seconds, like 30 - 45s)'))}">
                <span class="row" style="gap:4px;flex-wrap:nowrap"><button class="icon-btn" data-a="up" ${j === 0 ? 'disabled' : ''} aria-label="${esc(t('Move up'))}">↑</button><button class="icon-btn" data-a="down" ${j === n - 1 ? 'disabled' : ''} aria-label="${esc(t('Move down'))}">↓</button><button class="icon-btn del" data-a="del" aria-label="${esc(t('Remove'))}">✕</button></span>
            </div></div>`;
    const renderDays = () => {
        const el = $('cb-days'); if (!el) return;
        const sch = S.routine.schedule;
        el.innerHTML = sch.map(d => {
            const type = d.isRest ? d.recoveryType : 'workout', sets = d.exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0);
            const copy = sch.filter(x => x.id !== d.id && !x.isRest && x.exercises.length).map(x => `<option value="${x.id - 1}">${t('Day {n}', { n: x.id })} · ${esc(t(x.title))}</option>`).join('');
            return `<div class="day ${d.isRest ? 'rest' : ''}" data-d="${d.id - 1}">
                <div class="day-h"><b>${t('Day {n}', { n: d.id })} · ${esc(t(DAY_LONG[d.day] || d.day))}</b><span class="grow"></span>
                    <select class="field" data-f="type" style="width:auto;padding:6px 8px" aria-label="${esc(t('Day type'))}"><option value="workout" ${type === 'workout' ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${type === 'active' ? 'selected' : ''}>${t('Active rest')}</option><option value="complete" ${type === 'complete' ? 'selected' : ''}>${t('Rest')}</option></select></div>
                ${d.isRest ? `<p class="note" style="margin:0">${d.recoveryType === 'active' ? t('Active rest: walking, stretching, light cardio.') : t('Complete rest.')}</p>` : `
                    <input class="field" data-f="title" maxlength="80" value="${esc(d.title === 'New Day' ? '' : d.title)}" placeholder="${esc(t('Name this day (e.g. Push)'))}" aria-label="${esc(t('Day name'))}">
                    <div class="note" style="margin:6px 0 4px">${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n: sets })}</div>
                    ${d.exercises.map((e, j) => exRow(d, e, j, d.exercises.length)).join('')}
                    <div class="row" style="margin-top:8px"><button class="btn" data-a="add" ${d.exercises.length >= MAX_EX ? 'disabled' : ''}>+ ${t('Add exercise')}</button>
                        ${copy ? `<select class="field" data-f="copy" style="width:auto;padding:8px" aria-label="${esc(t('Copy exercises from another day'))}"><option value="">${t('Copy from…')}</option>${copy}</select>` : ''}</div>`}
            </div>`;
        }).join('');
    };
    const at = el => { const ex = el.closest('.ex'), day = el.closest('.day'); const d = S.routine.schedule[+(ex || day).dataset.d]; return { d, j: ex ? +ex.dataset.j : -1 }; };
    const onInput = e => {
        const f = e.target.dataset.f; if (!f || f === 'type' || f === 'copy' || f === 'muscle') return;
        const { d, j } = at(e.target); S.dirty = true;
        if (f === 'title') { d.title = e.target.value.slice(0, 80) || 'New Day'; d.savedTitle = d.title; return; }
        const ex = d.exercises[j]; if (!ex) return;
        if (f === 'name') ex.name = e.target.value.slice(0, 80) || 'New Exercise';
        if (f === 'sets') { e.target.value = e.target.value.replace(/[^\d]/g, ''); ex.sets = e.target.value; }
        if (f === 'reps') ex.reps = e.target.value.slice(0, 20);
    };
    const onChange = e => {
        const f = e.target.dataset.f; if (!f) return;
        const { d, j } = at(e.target); S.dirty = true;
        if (f === 'type') {
            const v = e.target.value;
            if (v === 'workout') { d.isRest = false; d.recoveryType = null; d.title = d.savedTitle || 'New Day'; }
            else { if (!d.isRest) d.savedTitle = d.title; d.isRest = true; d.recoveryType = v; d.title = v === 'active' ? 'Active Rest' : 'Complete Rest'; d.keep = d.exercises; d.exercises = []; }
            if (!d.isRest && d.keep) { d.exercises = d.keep; delete d.keep; }
            return renderDays();
        }
        if (f === 'copy') {
            const from = S.routine.schedule[+e.target.value]; if (!from) return;
            if (d.exercises.length && !confirm(t('Replace the exercises of Day {n}?', { n: d.id }))) return renderDays();
            d.exercises = clone(from.exercises); if (!d.title || d.title === 'New Day') { d.title = from.title; d.savedTitle = from.title; }
            return renderDays();
        }
        const ex = d.exercises[j]; if (!ex) return;
        if (f === 'muscle') ex.muscle = e.target.value;
        // a known exercise picked from the list: fill in its muscle
        if (f === 'name') { const m = muscleOf(ex.name); if (m && ex.muscle !== m) { ex.muscle = m; renderDays(); } if (/(plank|hold|wall sit|hang|l-sit|vacuum)/i.test(ex.name) && !/s$/.test(ex.reps)) { ex.reps = '30 - 45s'; renderDays(); } }
    };
    const onClick = e => {
        const a = e.target.dataset.a; if (!a) return;
        const { d, j } = at(e.target); S.dirty = true;
        if (a === 'add') { d.exercises.push({ muscle: 'Chest', name: 'New Exercise', sets: '3', reps: '10 - 12' }); renderDays(); const rows = document.querySelectorAll(`.day[data-d="${d.id - 1}"] .ex input[data-f="name"]`); if (rows.length) rows[rows.length - 1].focus(); return; }
        if (a === 'del') d.exercises.splice(j, 1);
        if (a === 'up' && j > 0) [d.exercises[j - 1], d.exercises[j]] = [d.exercises[j], d.exercises[j - 1]];
        if (a === 'down' && j < d.exercises.length - 1) [d.exercises[j + 1], d.exercises[j]] = [d.exercises[j], d.exercises[j + 1]];
        renderDays();
    };

    // ---------- check, send, templates ----------
    const finalRoutine = () => {
        const r = cleanRoutine(S.routine);
        r.schedule.forEach(d => { delete d.keep; d.exercises = d.exercises.filter(e => e.name && e.name !== 'New Exercise'); d.exercises.forEach(e => { const n = parseInt(e.sets); e.sets = String(n >= 1 && n <= 20 ? n : 3); if (!e.reps.trim()) e.reps = '10 - 12'; }); });
        r.name = (r.name || '').trim() || 'Coach plan';
        return r;
    };
    const problems = r => {
        const out = [], train = r.schedule.filter(d => !d.isRest);
        if (!train.length) out.push(t('Every day is a rest day.'));
        train.filter(d => !d.exercises.length).forEach(d => out.push(t('Day {n} ({day}) is a workout day with no exercises.', { n: d.id, day: t(DAY_LONG[d.day]) })));
        return out;
    };
    const msg = (html, cls = 'note') => { const el = $('cb-msg'); if (el) { el.className = cls; el.innerHTML = html; } };
    const send = async () => {
        const isNote = S.mode === 'note', note = S.note.trim().slice(0, NOTE_MAX);
        if (isNote && !note) return msg(t('Write a note first.'), 'err');
        let doc;
        if (isNote) doc = { mode: 'note', targetId: '', note };
        else {
            const r = finalRoutine(), p = problems(r);
            if (p.length && !confirm(`${p.join('\n')}\n\n${t('Send anyway?')}`)) return;
            const target = S.client.routines.find(w => w.id === S.targetId);
            // a new routine gets its own id, so sending it twice (or to two phones) never makes duplicates
            r.id = target ? target.id : `coach_${Date.now()}`;
            doc = { mode: target ? 'replace' : 'add', targetId: target ? target.id : '', routine: r, note, activate: S.activate };
        }
        const me = S.auth.currentUser;
        doc = { ...doc, coach: String((me && (me.displayName || me.email)) || 'Coach').slice(0, 100), sentAt: Date.now(), appliedAt: 0 };
        const btn = $('cb-send'); btn.disabled = true; btn.textContent = t('Sending…');
        try {
            await S.db.doc(`users/${S.client.uid}/coach/plan`).set(doc);
            const done = S.onSent; S.dirty = false;
            close(true);
            if (done) done(doc);
        } catch (e) {
            console.warn(e); btn.disabled = false; btn.textContent = t('Send');
            msg(`${t('Could not send ({code}).', { code: esc(e.code || 'error') })} ${/permission/i.test(e.code || '') ? t('Publish the new firestore.rules in the Firebase console first.') : t('Check the connection and try again.')}`, 'err');
        }
    };
    const saveTemplate = async () => {
        const r = finalRoutine();
        const cur = (S.from || '').startsWith('tpl:') ? (S.templates || []).find(x => x.id === S.from.slice(4)) : null;
        const name = (prompt(t('Template name'), cur ? cur.name : r.name) || '').trim().slice(0, 60); if (!name) return;
        const same = (S.templates || []).find(x => x.name.toLowerCase() === name.toLowerCase());
        if (same && !confirm(t('Replace the template "{name}"?', { name: same.name }))) return;
        try {
            const ref = same ? S.db.collection(S.templatesPath || 'coachTemplates').doc(same.id) : S.db.collection(S.templatesPath || 'coachTemplates').doc();
            const routine = { name: r.name, schedule: r.schedule };
            await ref.set({ name, routine, updatedAt: Date.now() });
            msg(t('Saved as template "{name}".', { name: esc(name) }), 'ok');
            S.from = `tpl:${ref.id}`;
            await loadTemplates();
        } catch (e) { console.warn(e); msg(t('Could not save the template ({code}).', { code: esc(e.code || 'error') }), 'err'); }
    };
    const deleteTemplate = async () => {
        const tp = (S.templates || []).find(x => x.id === (S.from || '').slice(4)); if (!tp || !confirm(t('Delete the template "{name}"?', { name: tp.name }))) return;
        try { await S.db.collection(S.templatesPath || 'coachTemplates').doc(tp.id).delete(); S.from = ''; await loadTemplates(); msg(t('Template deleted.')); }
        catch (e) { console.warn(e); msg(t('Could not delete ({code}).', { code: esc(e.code || 'error') }), 'err'); }
    };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && S) close(); });

    return { open, close };
})();

// Apex Coach (coach.html): the routine editor, built like the Plan tab of the Apex Lift app.
// - The week: the routine's name, where it goes (a new routine or one of theirs), then the 7 days as cards
//   (tap a day to edit it), a note to the client, and Send.
// - A day: its name and type, the exercises as numbered cards with a "sets × reps" pill (tap one for the
//   sets & reps pop-up: change, move, delete), and "Add exercises" (a bottom sheet with search and muscle chips).
// Sends the same thing as the admin page's builder (admin-coach.js) to users/{uid}/coach/plan, which the client's
// app applies. Saved templates live in coaches/{uid}/templates. Text in English and Arabic (coach-i18n.js).
// Shared as window.ApexCoachBuilder: open(opts), back() (the phone's back: true if it handled it), close(force).
window.ApexCoachBuilder = (() => {
    'use strict';
    const { muscleOptions, exerciseDictionary, exerciseAR, WORKOUTS, PROGRAMS } = window.APEX_LIB;
    const { $, esc, isObj } = window.ApexAdminUtils;
    const { t, isAR, muscle: tm } = window.ApexCoachI18n;
    const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const DAY_LONG = { SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday' };
    const REPS_PRESETS = ['5', '3 - 5', '6 - 8', '8 - 10', '8 - 12', '10 - 12', '12 - 15', '15 - 20', '30 - 45s'];
    const MAX_EX = 60, NOTE_MAX = 1000;
    const clone = v => JSON.parse(JSON.stringify(v));
    const muscleOf = name => Object.keys(exerciseDictionary).find(m => exerciseDictionary[m].includes(name)) || '';
    const ALL_EX = [...new Set(Object.values(exerciseDictionary).flat())].sort();
    const tex = n => (isAR && exerciseAR && exerciseAR[n]) || n;
    const dayName = d => isAR ? t(DAY_LONG[d] || d) : (DAY_LONG[d] || d).slice(0, 3);
    const dayTitle = d => d.isRest ? t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : (d.title && d.title !== 'New Day' ? t(d.title) : t('New Day'));
    const pill = e => `${parseInt(e.sets) || e.sets} × ${String(e.reps).replace(/\s*-\s*/, '–')}`;
    const icons = el => { if (window.lucide) window.lucide.createIcons({ root: el }); };
    const box = () => $('coach');

    let S = null; // { db, auth, client, mode, targetId, routine, note, activate, dirty, templates, from, view, sheet, onSent, templatesPath, coachName }

    // ---------- routines: the same shape the app uses (7 days, each { id, day, title, isRest, recoveryType, savedTitle, exercises }) ----------
    const dayOrder = startDay => { const s = Math.max(0, DAY_NAMES.indexOf(startDay)); return DAY_NAMES.map((_, i) => DAY_NAMES[(s + i) % 7]); };
    const blankDay = (i, day) => ({ id: i + 1, day, title: 'New Day', isRest: false, recoveryType: null, savedTitle: '', exercises: [] });
    const restDay = (i, day, active) => ({ id: i + 1, day, title: active ? 'Active Rest' : 'Complete Rest', isRest: true, recoveryType: active ? 'active' : 'complete', savedTitle: '', exercises: [] });
    const blankRoutine = () => ({ id: '', name: 'Coach plan', schedule: dayOrder(S.client.startDay).map((d, i) => blankDay(i, d)) });
    // the app's rules for programs: newer lifters get one set less on accessories, advanced one more on the first lifts
    const fromProgram = prog => ({
        id: '', name: prog.name, schedule: prog.week.map((slot, i) => {
            const day = dayOrder(S.client.startDay)[i];
            if (slot === 'R' || slot === 'A') return restDay(i, day, slot === 'A');
            const [title, list] = WORKOUTS[slot];
            return { id: i + 1, day, title, savedTitle: title, isRest: false, recoveryType: null, exercises: list.slice(0, ({ 30: 4, 45: 5 })[S.client.session] || 99).map(([name, muscle, sets, reps], j) => {
                let n = parseInt(sets);
                if (S.client.exp === 'none') n = Math.max(2, n - 1);
                if (S.client.exp === 'new' && j >= 2) n = Math.max(2, n - 1);
                if (S.client.exp === 'adv' && j < 2) n = Math.max(n, Math.min(4, n + 1));
                if (S.client.exp === 'pro' && j < 3) n = Math.max(n, Math.min(5, n + 1));
                return { muscle, name, sets: String(n), reps };
            }) };
        })
    });
    // anything loaded (their routine, a template) cleaned into the exact shape, never more than the app accepts
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
    const finalRoutine = () => {
        const r = cleanRoutine(S.routine);
        r.schedule.forEach(d => { d.exercises = d.exercises.filter(e => e.name && e.name !== 'New Exercise'); d.exercises.forEach(e => { const n = parseInt(e.sets); e.sets = String(n >= 1 && n <= 20 ? n : 3); if (!e.reps.trim()) e.reps = '10 - 12'; }); });
        r.name = (r.name || '').trim() === 'Coach plan' ? t('Coach plan') : ((r.name || '').trim() || t('Coach plan'));
        return r;
    };
    const problems = r => {
        const out = [], train = r.schedule.filter(d => !d.isRest);
        if (!train.length) out.push(t('Every day is a rest day.'));
        train.filter(d => !d.exercises.length).forEach(d => out.push(t('Day {n} ({day}) is a workout day with no exercises.', { n: d.id, day: t(DAY_LONG[d.day]) })));
        return out;
    };
    const setsOf = d => d.exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0);

    // ---------- small pop-ups (the coach app's look) ----------
    const pop = (html, cls = '') => {
        const o = document.createElement('div');
        o.className = `pop cb-pop ${cls}`; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
        o.innerHTML = `<div class="pop-card">${html}</div>`;
        document.body.appendChild(o); icons(o);
        return o;
    };
    const topPop = () => [...document.querySelectorAll('.cb-pop')].pop();
    const ask = (title, text, okLabel, danger = false) => new Promise(done => {
        const o = pop(`<h3>${esc(title)}</h3>${text ? `<p style="white-space:pre-line">${esc(text)}</p>` : ''}<div class="pop-actions"><button class="btn tap" data-no>${t('Cancel')}</button><button class="btn tap ${danger ? 'is-danger' : 'gold'}" data-ok>${esc(okLabel)}</button></div>`);
        o.close = v => { o.remove(); done(v); };
        o.onclick = e => { if (e.target === o) o.close(false); };
        o.querySelector('[data-no]').onclick = () => o.close(false);
        o.querySelector('[data-ok]').onclick = () => o.close(true);
        o.querySelector('[data-ok]').focus();
    });
    const askText = (title, value, okLabel) => new Promise(done => {
        const o = pop(`<h3>${esc(title)}</h3><input class="field" maxlength="60" value="${esc(value)}" dir="auto" aria-label="${esc(title)}"><div class="pop-actions"><button class="btn tap" data-no>${t('Cancel')}</button><button class="btn gold tap" data-ok>${esc(okLabel)}</button></div>`);
        const inp = o.querySelector('input');
        o.close = v => { o.remove(); done(v); };
        o.onclick = e => { if (e.target === o) o.close(''); };
        o.querySelector('[data-no]').onclick = () => o.close('');
        o.querySelector('[data-ok]').onclick = () => o.close(inp.value.trim().slice(0, 60));
        inp.onkeydown = e => { if (e.key === 'Enter') o.close(inp.value.trim().slice(0, 60)); };
        inp.focus(); inp.select();
    });
    let flashTimer = 0;
    const flash = (text, bad = false) => {
        const old = document.querySelector('.cb-flash'); if (old) old.remove();
        const el = document.createElement('div');
        el.className = `toast cb-flash${bad ? ' is-bad' : ''}`; el.setAttribute('role', 'status');
        el.innerHTML = `<i data-lucide="${bad ? 'alert-circle' : 'check-circle'}"></i><span>${esc(text)}</span>`;
        document.body.appendChild(el); icons(el);
        clearTimeout(flashTimer); flashTimer = setTimeout(() => el.remove(), 2500);
    };

    // ---------- open / close / back ----------
    const open = opts => {
        S = { ...opts, templates: null, dirty: false, note: '', activate: true, from: '', view: 'week', sheet: null };
        S.targetId = opts.mode === 'replace' && opts.routine ? String(opts.routine.id || '') : '';
        S.routine = opts.routine ? cleanRoutine(opts.routine) : blankRoutine();
        box().classList.add('open');
        document.documentElement.classList.add('in-builder');
        render();
        if (S.mode !== 'note') loadTemplates();
    };
    const close = async (force = false) => {
        if (!S) return;
        if (!force && S.dirty && !(await ask(t('Close without sending?'), t('Your changes are lost.'), t('Close'), true))) return;
        document.querySelectorAll('.cb-pop, .cb-sheet').forEach(x => x.remove());
        box().classList.remove('open'); box().innerHTML = '';
        document.documentElement.classList.remove('in-builder');
        S = null;
    };
    // the phone's back, Escape, a swipe: the top thing closes first. true = handled (the editor stays open)
    const back = () => {
        if (!S) return false;
        const p = topPop(); if (p) { if (p.close) p.close(false); else p.remove(); if (S && S.view !== 'week') renderDay(); return true; }
        if (S.sheet) { closeSheet(); return true; }
        if (S.view !== 'week') { S.view = 'week'; render(); return true; }
        if (S.dirty) { close(); return true; } // asks first
        close(true); return false;
    };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && S) { e.preventDefault(); back(); } });
    const loadTemplates = async () => {
        try {
            const qs = await S.db.collection(S.templatesPath).get(), list = [];
            qs.forEach(d => { const x = d.data() || {}; if (isObj(x.routine)) list.push({ id: d.id, name: String(x.name || 'Template').slice(0, 60), routine: x.routine }); });
            if (!S) return;
            S.templates = list.sort((a, b) => a.name.localeCompare(b.name));
            renderFrom();
        } catch (e) { console.warn('Templates', e); if (S) { S.templates = []; renderFrom(); } }
    };

    // ---------- the week ----------
    const bar = (title, label) => `<div class="page-bar">
            <button class="back-btn tap" data-cb-back aria-label="${esc(label)}"><i data-lucide="chevron-left" class="rtl-flip"></i></button>
            <div class="page-bar-title">${esc(title)}</div><span></span></div>`;
    const target = () => S.client.routines.find(w => w.id === S.targetId);
    const modeText = () => {
        const c = S.client, tg = target();
        if (tg) return t(S.activate ? 'Updates their routine "{name}" and makes it the active one. Their app saves a backup of the old version first, and their workout history is kept.' : 'Updates their routine "{name}". Their app saves a backup of the old version first, and their workout history is kept.', { name: esc(tg.name) });
        if (c.routines.length >= 5) return t('{name} already has 5 routines (the most the app allows), so a new one can\'t be added: it replaces their active routine. Their app saves a backup first. To keep all 5, choose "Update their routine" above instead.', { name: esc(c.name) });
        return t(S.activate ? 'Adds a new routine for {name} and makes it the active one. Their other routines and history stay.' : 'Adds a new routine for {name}. Their other routines and history stay.', { name: esc(c.name) });
    };
    const render = () => {
        if (S.mode === 'note') return renderNote();
        if (S.view !== 'week') return renderDay();
        const c = S.client, tg = target();
        box().innerHTML = `<div class="cb-page fade-in">
            ${bar(tg ? t('Edit routine') : t('New routine'), t('Cancel'))}
            <p class="cb-for">${t('For {name}', { name: `<b>${esc(c.name)}</b>` })}</p>
            <div class="pf-group">
                <label class="pf-row"><span class="pf-ic"><i data-lucide="pencil"></i></span><span class="pf-label">${t('Routine name')}</span>
                    <input id="cb-name" class="cb-inline" maxlength="60" dir="auto" value="${esc(S.routine.name === 'Coach plan' ? '' : S.routine.name)}" placeholder="${esc(t('Coach plan'))}"></label>
                <label class="pf-row"><span class="pf-ic"><i data-lucide="layers"></i></span><span class="pf-label">${t('Start from')}</span>
                    <select id="cb-from" class="pf-select" aria-label="${esc(t('Start from'))}"></select><i data-lucide="chevrons-up-down" class="pf-chev"></i></label>
                <label class="pf-row"><span class="pf-ic"><i data-lucide="send"></i></span><span class="pf-label">${t('Send as')}</span>
                    <select id="cb-dest" class="pf-select" aria-label="${esc(t('Send as'))}">
                        <option value="" ${!S.targetId ? 'selected' : ''}>${t('A new routine')}</option>
                        ${c.routines.map(w => `<option value="${esc(w.id)}" ${S.targetId === w.id ? 'selected' : ''}>${esc(t('Update their routine: {name}', { name: w.name }))}</option>`).join('')}
                    </select><i data-lucide="chevrons-up-down" class="pf-chev"></i></label>
                <label class="pf-row"><span class="pf-ic"><i data-lucide="star"></i></span><span class="pf-label">${t('Make it their active routine')}</span>
                    <input type="checkbox" id="cb-active" class="cb-switch" ${S.activate ? 'checked' : ''}></label>
            </div>
            <p class="pf-note" id="cb-mode">${modeText()}</p>
            <div class="cb-h"><div><b>${t('The week')}</b><span>${t('Tap a day to edit it')}</span></div></div>
            ${S.routine.schedule.map((d, i) => `<button class="cb-day tap" data-day="${i}">
                <span class="cb-dl"><small>${t('Day {n}', { n: d.id })}</small><b>${esc(dayName(d.day))}</b></span>
                <span class="cb-dc glass-card${d.isRest ? ' is-rest' : ''}">
                    ${d.isRest ? `<i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}"></i>` : ''}
                    <span class="cb-dt"><b>${esc(dayTitle(d))}</b>${d.isRest ? '' : `<small>${d.exercises.length ? esc(`${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n: setsOf(d) })}`) : t('No exercises yet')}</small>`}</span>
                    <i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></span></button>`).join('')}
            <span class="pf-h">${t('Note to your client (optional)')}</span>
            <textarea id="cb-note" class="cb-note" rows="3" maxlength="${NOTE_MAX}" dir="auto" placeholder="${esc(t('What changed and why, how to progress, what to focus on…'))}">${esc(S.note)}</textarea>
            <div class="cb-foot"><div class="cb-foot-in">
                <button class="btn tap" id="cb-tpl"><i data-lucide="bookmark"></i>${t('Save as template')}</button>
                <button class="btn gold tap" id="cb-send"><i data-lucide="send"></i>${esc(t('Send to {name}', { name: c.name.split(' ')[0] || t('client') }))}</button>
            </div></div>
        </div>`;
        icons(box());
        const b = box();
        b.querySelector('[data-cb-back]').onclick = () => back(); // closing takes its history entry away (coach.js)
        $('cb-name').oninput = e => { S.routine.name = e.target.value.slice(0, 60) || 'Coach plan'; S.dirty = true; };
        $('cb-from').onchange = e => startFrom(e.target.value);
        $('cb-dest').onchange = e => pickDest(e.target.value);
        $('cb-active').onchange = e => { S.activate = e.target.checked; $('cb-mode').innerHTML = modeText(); };
        $('cb-note').oninput = e => { S.note = e.target.value.slice(0, NOTE_MAX); S.dirty = true; };
        b.querySelectorAll('[data-day]').forEach(x => x.onclick = () => { S.view = +x.dataset.day; render(); window.scrollTo(0, 0); b.scrollTop = 0; });
        $('cb-tpl').onclick = saveTemplate;
        $('cb-send').onclick = send;
        renderFrom();
    };
    const renderFrom = () => {
        const sel = $('cb-from'); if (!sel || !S) return;
        const own = S.client.routines.map(w => `<option value="own:${esc(w.id)}">${esc(w.name)}</option>`).join('');
        const progs = PROGRAMS.map(p => `<option value="prog:${esc(p.id)}">${esc(t(p.name))} · ${t('{n} days a week', { n: p.days })}</option>`).join('');
        const tpls = S.templates === null ? `<option disabled>${t('Loading…')}</option>` : S.templates.map(x => `<option value="tpl:${esc(x.id)}">${esc(x.name)}</option>`).join('') || `<option disabled>${t('No templates yet')}</option>`;
        sel.innerHTML = `<option value="">${t('Choose…')}</option><option value="blank">${t('Empty week')}</option><optgroup label="${esc(t('Their routines'))}">${own || `<option disabled>${t('None')}</option>`}</optgroup><optgroup label="${esc(t('Programs'))}">${progs}</optgroup><optgroup label="${esc(t('Your templates'))}">${tpls}</optgroup>`;
        sel.value = S.from || '';
    };
    const replaceWith = async (r, from) => {
        if (S.dirty && !(await ask(t('Replace the days you have built so far?'), '', t('Replace')))) { $('cb-from').value = S.from || ''; return; }
        const order = dayOrder(S.client.startDay); r.schedule.forEach((d, i) => { d.day = order[i]; d.id = i + 1; });
        S.routine = { ...r, id: S.routine.id }; S.from = from; S.dirty = from !== 'blank';
        render();
    };
    const startFrom = v => {
        if (!v) return;
        if (v === 'blank') return replaceWith(blankRoutine(), v);
        if (v.startsWith('own:')) { const w = S.client.routines.find(x => x.id === v.slice(4)); if (w) return replaceWith({ ...cleanRoutine(w), id: '' }, v); }
        if (v.startsWith('prog:')) { const p = PROGRAMS.find(x => x.id === v.slice(5)); if (p) return replaceWith(fromProgram(p), v); }
        if (v.startsWith('tpl:')) { const tp = (S.templates || []).find(x => x.id === v.slice(4)); if (tp) return replaceWith(cleanRoutine({ ...tp.routine, id: '' }), v); }
    };
    // choosing one of their routines loads it, so you edit what they already have
    const pickDest = async id => {
        const w = S.client.routines.find(x => x.id === id);
        if (w && S.dirty && !(await ask(t('Load "{name}" to edit it?', { name: w.name }), t('The days you have built so far are replaced.'), t('Load')))) { $('cb-dest').value = S.targetId; return; }
        S.targetId = w ? w.id : '';
        if (w) { S.routine = cleanRoutine(w); S.from = ''; S.dirty = false; }
        render();
    };

    // ---------- one day ----------
    const curDay = () => S.routine.schedule[S.view];
    const renderDay = () => {
        const d = curDay(), type = d.isRest ? d.recoveryType : 'workout';
        const copy = S.routine.schedule.filter(x => x.id !== d.id && !x.isRest && x.exercises.length);
        box().innerHTML = `<div class="cb-page">
            ${bar(t('The week'), t('Back to the week'))}
            <div class="cb-dayhead">
                <small>${esc(t('Day {n}', { n: d.id }))} · ${esc(t(DAY_LONG[d.day]))}</small>
                ${d.isRest ? `<h2>${esc(dayTitle(d))}</h2>` : `<input id="cb-title" class="cb-title" maxlength="80" dir="auto" value="${esc(d.title === 'New Day' ? '' : t(d.title))}" placeholder="${esc(t('Name this day (e.g. Push)'))}" aria-label="${esc(t('Day name'))}">`}
                ${d.isRest ? `<p>${d.recoveryType === 'active' ? t('Active rest: walking, stretching, light cardio.') : t('Complete rest.')}</p>` : `<p>${esc(`${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n: setsOf(d) })}`)}</p>`}
                <div class="cb-chips">
                    <label class="cb-chip"><select id="cb-type" aria-label="${esc(t('Day type'))}"><option value="workout" ${type === 'workout' ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${type === 'active' ? 'selected' : ''}>${t('Active rest')}</option><option value="complete" ${type === 'complete' ? 'selected' : ''}>${t('Rest')}</option></select><i data-lucide="chevron-down"></i></label>
                    ${!d.isRest && copy.length ? `<label class="cb-chip"><i data-lucide="copy"></i><select id="cb-copy" aria-label="${esc(t('Copy exercises from another day'))}"><option value="">${t('Copy from…')}</option>${copy.map(x => `<option value="${x.id - 1}">${esc(t('Day {n}', { n: x.id }))} · ${esc(dayTitle(x))}</option>`).join('')}</select><i data-lucide="chevron-down"></i></label>` : ''}
                </div>
            </div>
            ${d.isRest ? '' : `${d.exercises.length ? `<p class="pf-note cb-tip">${t('Tap an exercise to change its sets and reps, move it or delete it.')}</p>` : ''}
                <div id="cb-exs">${d.exercises.map((e, j) => `<button class="cb-ex glass-card tap" data-j="${j}">
                    <span class="cb-n num">${j + 1}</span>
                    <span class="cb-et"><b>${esc(tex(e.name))}</b><small>${esc(tm(e.muscle))}</small></span>
                    <span class="cb-pill num" dir="ltr">${esc(pill(e))}</span></button>`).join('')}</div>
                ${d.exercises.length ? '' : `<div class="cb-empty glass-card"><i data-lucide="dumbbell"></i><span>${t('No exercises yet. Add some from the library.')}</span></div>`}
                <button class="btn gold tap" id="cb-add" ${d.exercises.length >= MAX_EX ? 'disabled' : ''}><i data-lucide="plus"></i>${t('Add exercises')}</button>`}
        </div>`;
        icons(box());
        const b = box();
        b.querySelector('[data-cb-back]').onclick = () => back();
        const ti = $('cb-title'); if (ti) ti.oninput = e => { d.title = e.target.value.slice(0, 80) || 'New Day'; d.savedTitle = d.title; S.dirty = true; };
        $('cb-type').onchange = e => {
            const v = e.target.value; S.dirty = true;
            if (v === 'workout') { d.isRest = false; d.recoveryType = null; d.title = d.savedTitle || 'New Day'; if (d.keep) { d.exercises = d.keep; delete d.keep; } }
            else { if (!d.isRest) { d.savedTitle = d.title; d.keep = d.exercises; } d.isRest = true; d.recoveryType = v; d.title = v === 'active' ? 'Active Rest' : 'Complete Rest'; d.exercises = []; }
            renderDay();
        };
        const cp = $('cb-copy'); if (cp) cp.onchange = async e => {
            const from = S.routine.schedule[+e.target.value]; if (!from) return;
            if (d.exercises.length && !(await ask(t('Replace the exercises of Day {n}?', { n: d.id }), '', t('Replace')))) return renderDay();
            d.exercises = clone(from.exercises); if (!d.title || d.title === 'New Day') { d.title = from.title; d.savedTitle = from.title; }
            S.dirty = true; renderDay();
        };
        b.querySelectorAll('[data-j]').forEach(x => x.onclick = () => exPop(+x.dataset.j));
        const add = $('cb-add'); if (add) add.onclick = openSheet;
    };

    // sets & reps pop-up for one exercise: change, move up / down, delete
    const exPop = j => {
        const d = curDay(), e = d.exercises[j]; if (!e) return;
        let sets = Math.min(20, Math.max(1, parseInt(e.sets) || 3)), reps = e.reps;
        const o = pop(`<h3>${esc(tex(e.name))}</h3>
            <label class="cb-mus"><span>${t('Muscle')}</span><select class="pf-select" data-f="muscle" aria-label="${esc(t('Muscle'))}">${[...new Set([e.muscle, ...muscleOptions])].map(m => `<option value="${esc(m)}" ${m === e.muscle ? 'selected' : ''}>${esc(tm(m))}</option>`).join('')}</select></label>
            <div class="cb-lbl">${t('Sets')}</div>
            <div class="cb-step"><button class="tap" data-s="-1" aria-label="${esc(t('Fewer sets'))}"><i data-lucide="minus"></i></button><b class="num" data-f="sets">${sets}</b><button class="tap" data-s="1" aria-label="${esc(t('More sets'))}"><i data-lucide="plus"></i></button></div>
            <div class="cb-lbl">${t('Reps (or seconds, like 30 - 45s)')}</div>
            <div class="cb-reps">${REPS_PRESETS.map(r => `<button class="chip tap${r === reps ? ' is-on' : ''}" data-r="${esc(r)}" dir="ltr">${esc(r.replace(/\s*-\s*/, '–'))}</button>`).join('')}</div>
            <input class="field" data-f="reps" maxlength="20" dir="ltr" value="${esc(reps)}" aria-label="${esc(t('Reps'))}">
            <div class="cb-tools">
                <button class="mini-btn tap" data-m="-1" ${j === 0 ? 'disabled' : ''}><i data-lucide="arrow-up"></i>${t('Move up')}</button>
                <button class="mini-btn tap" data-m="1" ${j === d.exercises.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down"></i>${t('Move down')}</button>
                <button class="mini-btn is-icon is-danger tap" data-del aria-label="${esc(t('Delete'))}"><i data-lucide="trash-2"></i></button>
            </div>
            <button class="btn gold tap" data-ok style="margin:14px 0 0">${t('Done')}</button>`, 'is-ex');
        const sEl = o.querySelector('[data-f="sets"]'), rIn = o.querySelector('[data-f="reps"]');
        const save = () => { e.sets = String(sets); e.reps = (rIn.value.trim() || '10 - 12').slice(0, 20); e.muscle = o.querySelector('[data-f="muscle"]').value; S.dirty = true; };
        o.close = () => { save(); o.remove(); renderDay(); };
        o.onclick = ev => { if (ev.target === o) o.close(); };
        o.querySelectorAll('[data-s]').forEach(x => x.onclick = () => { sets = Math.min(20, Math.max(1, sets + +x.dataset.s)); sEl.textContent = sets; });
        o.querySelectorAll('[data-r]').forEach(x => x.onclick = () => { rIn.value = x.dataset.r; o.querySelectorAll('[data-r]').forEach(y => y.classList.toggle('is-on', y === x)); });
        rIn.oninput = () => o.querySelectorAll('[data-r]').forEach(y => y.classList.toggle('is-on', y.dataset.r === rIn.value.trim()));
        o.querySelectorAll('[data-m]').forEach(x => x.onclick = () => { save(); const k = j + +x.dataset.m; [d.exercises[j], d.exercises[k]] = [d.exercises[k], d.exercises[j]]; o.remove(); renderDay(); });
        o.querySelector('[data-del]').onclick = () => { d.exercises.splice(j, 1); S.dirty = true; o.remove(); renderDay(); flash(t('Exercise removed')); };
        o.querySelector('[data-ok]').onclick = () => o.close();
    };

    // ---------- Add exercises: a bottom sheet with search and muscle chips (like the app) ----------
    const openSheet = () => {
        S.sheet = { q: '', m: '' };
        const w = document.createElement('div');
        w.className = 'cb-sheet'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', t('Add exercises'));
        w.innerHTML = `<div class="cb-sheet-box">
            <button class="cb-grab" data-close aria-label="${esc(t('Close'))}"><span></span></button>
            <h3>${t('Add exercises')}</h3>
            <div class="search"><i data-lucide="search"></i><input id="cb-q" type="search" autocomplete="off" placeholder="${esc(t('Search exercises'))}" aria-label="${esc(t('Search exercises'))}"></div>
            <div class="cb-mchips">${['', ...Object.keys(exerciseDictionary)].map(m => `<button class="chip tap${m ? '' : ' is-on'}" data-m="${esc(m)}">${esc(m ? tm(m) : t('All'))}</button>`).join('')}</div>
            <div class="cb-list" id="cb-list"></div>
        </div>`;
        document.body.appendChild(w); icons(w);
        requestAnimationFrame(() => w.classList.add('is-open'));
        w.onclick = e => { if (e.target === w) closeSheet(); };
        w.querySelector('[data-close]').onclick = closeSheet;
        w.querySelector('#cb-q').oninput = e => { S.sheet.q = e.target.value; renderList(); };
        w.querySelectorAll('[data-m]').forEach(x => x.onclick = () => { S.sheet.m = x.dataset.m; w.querySelectorAll('[data-m]').forEach(y => y.classList.toggle('is-on', y === x)); renderList(); });
        // swipe down (from the top, or with the list at the top) closes it
        const sb = w.querySelector('.cb-sheet-box'), list = w.querySelector('.cb-list');
        let y0 = null, dy = 0;
        sb.addEventListener('touchstart', e => { if (e.target.closest('.cb-mchips, input') || (e.target.closest('.cb-list') && list.scrollTop > 0)) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
        sb.addEventListener('touchmove', e => { if (y0 === null) return; dy = e.touches[0].clientY - y0; if (dy > 0) { sb.style.transition = 'none'; sb.style.transform = `translateY(${dy}px)`; } }, { passive: true });
        sb.addEventListener('touchend', () => { if (y0 === null) return; y0 = null; sb.style.transition = ''; sb.style.transform = ''; if (dy > 120) closeSheet(); });
        renderList();
    };
    const closeSheet = () => {
        const w = document.querySelector('.cb-sheet'); S.sheet = null;
        if (w) { w.classList.remove('is-open'); setTimeout(() => w.remove(), 250); }
        if (S.view !== 'week') renderDay();
    };
    const norm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const renderList = () => {
        const el = $('cb-list'); if (!el || !S.sheet) return;
        const d = curDay(), q = norm(S.sheet.q.trim()), inDay = new Set(d.exercises.map(e => e.name));
        const pool = S.sheet.m ? exerciseDictionary[S.sheet.m] || [] : ALL_EX;
        const list = pool.filter(n => !q || norm(n).includes(q) || norm(tex(n)).includes(q)).slice(0, 150);
        const custom = S.sheet.q.trim() && !ALL_EX.some(n => norm(n) === q) ? S.sheet.q.trim().slice(0, 80) : '';
        el.innerHTML = `${list.map(n => `<button class="cb-row tap" data-add="${esc(n)}"><span><b>${esc(tex(n))}</b><small>${esc(tm(S.sheet.m || muscleOf(n)))}${inDay.has(n) ? ` · ${t('In this day')}` : ''}</small></span><span class="cb-plus${inDay.has(n) ? ' is-on' : ''}"><i data-lucide="${inDay.has(n) ? 'check' : 'plus'}"></i></span></button>`).join('')}
            ${custom ? `<button class="cb-row tap" data-add="${esc(custom)}" data-custom="1"><span><b>${esc(t('Add “{name}”', { name: custom }))}</b><small>${t('Your own exercise')}</small></span><span class="cb-plus"><i data-lucide="plus"></i></span></button>` : ''}
            ${!list.length && !custom ? `<p class="pf-note" style="text-align:center;margin:20px 0">${t('No exercise found.')}</p>` : ''}`;
        icons(el);
        el.querySelectorAll('[data-add]').forEach(x => x.onclick = () => {
            if (d.exercises.length >= MAX_EX) return flash(t('A day can have up to 60 exercises.'), true);
            const name = x.dataset.add, m = muscleOf(name) || S.sheet.m || 'Muscle';
            d.exercises.push({ muscle: m, name, sets: '3', reps: /(plank|hold|wall sit|hang|l-sit|vacuum)/i.test(name) ? '30 - 45s' : '10 - 12' });
            if (!d.title || d.title === 'New Day') { /* the coach names the day */ }
            S.dirty = true;
            flash(t('{name} added', { name: tex(name) }));
            renderList();
        });
    };

    // ---------- a note only (pinned on their Today screen) ----------
    const renderNote = () => {
        box().innerHTML = `<div class="cb-page fade-in">
            ${bar(t('Pin a note'), t('Cancel'))}
            <p class="cb-for">${t('For {name}', { name: `<b>${esc(S.client.name)}</b>` })}</p>
            <p class="pf-note" style="margin:0 6px 12px">${t("Pins a note on the Today page of {name}'s app, above their workout, until they close it.", { name: esc(S.client.name) })}</p>
            <textarea id="cb-note" class="cb-note" rows="6" maxlength="${NOTE_MAX}" dir="auto" placeholder="${esc(t('Great week! Next week add 2.5 kg to your squat…'))}">${esc(S.note)}</textarea>
            <div class="cb-foot"><div class="cb-foot-in"><button class="btn gold tap" id="cb-send" style="grid-column:1/-1"><i data-lucide="send"></i>${esc(t('Send to {name}', { name: S.client.name.split(' ')[0] || t('client') }))}</button></div></div>
        </div>`;
        icons(box());
        box().querySelector('[data-cb-back]').onclick = () => back();
        $('cb-note').oninput = e => { S.note = e.target.value.slice(0, NOTE_MAX); S.dirty = true; };
        $('cb-send').onclick = send;
        setTimeout(() => { const n = $('cb-note'); if (n && matchMedia('(pointer: fine)').matches) n.focus(); }, 50);
    };

    // ---------- send, templates ----------
    const send = async () => {
        const isNote = S.mode === 'note', note = S.note.trim().slice(0, NOTE_MAX);
        if (isNote && !note) return flash(t('Write a note first.'), true);
        let doc;
        if (isNote) doc = { mode: 'note', targetId: '', note };
        else {
            const r = finalRoutine(), p = problems(r);
            if (p.length && !(await ask(t('Send anyway?'), p.join('\n'), t('Send')))) return;
            const tg = target();
            // a new routine gets its own id, so sending it twice (or to two phones) never makes duplicates
            r.id = tg ? tg.id : `coach_${Date.now()}`;
            doc = { mode: tg ? 'replace' : 'add', targetId: tg ? tg.id : '', routine: r, note, activate: S.activate };
        }
        const me = S.auth.currentUser;
        doc = { ...doc, coach: String(S.coachName || (me && (me.displayName || me.email)) || 'Coach').slice(0, 100), sentAt: Date.now(), appliedAt: 0 };
        const btn = $('cb-send'); btn.disabled = true;
        try {
            await S.db.doc(`users/${S.client.uid}/coach/plan`).set(doc);
            const done = S.onSent; S.dirty = false;
            close(true);
            if (done) done(doc);
        } catch (e) {
            console.warn(e); btn.disabled = false;
            flash(`${t('Could not send ({code}).', { code: e.code || 'error' })} ${t('Check the connection and try again.')}`, true);
        }
    };
    const saveTemplate = async () => {
        const r = finalRoutine();
        const cur = (S.from || '').startsWith('tpl:') ? (S.templates || []).find(x => x.id === S.from.slice(4)) : null;
        const name = await askText(t('Template name'), cur ? cur.name : r.name, t('Save')); if (!name || !S) return;
        const same = (S.templates || []).find(x => x.name.toLowerCase() === name.toLowerCase());
        if (same && !(await ask(t('Replace the template "{name}"?', { name: same.name }), '', t('Replace')))) return;
        try {
            const col = S.db.collection(S.templatesPath), ref = same ? col.doc(same.id) : col.doc();
            await ref.set({ name, routine: { name: r.name, schedule: r.schedule }, updatedAt: Date.now() });
            flash(t('Saved as template "{name}".', { name }));
            S.from = `tpl:${ref.id}`;
            await loadTemplates();
        } catch (e) { console.warn(e); flash(t('Could not save the template ({code}).', { code: e.code || 'error' }), true); }
    };

    return Object.freeze({ open, back, close, isOpen: () => !!S });
})();

// Apex Coach (coach.html): the routine editor. It works like the Plan tab of the Apex Lift app, made for phones:
// - The week: the routine's settings (name, start from, send as, active), "This week" with the weekdays on the start
//   side and one card per day (tap to edit, ⋮ to copy or clear it, ✏️ to drag the days to other weekdays),
//   the week's muscle balance, a note to the client, and Save as template / Send at the bottom.
// - A day: the dashed gold day card (name, Day type, Same sets & reps for all), the exercises as cards
//   (hold ⋮⋮ to drag, swipe left to delete, tap to edit), and Add exercise.
// - An exercise (pop-up): change it, sets − / +, reps per set (presets or your own).
// - Add / change exercise (bottom sheet): search, muscle chips, the exercises already in their routines first.
// Every change can be undone from the message that follows it, and the work is kept on the phone as a draft until it
// is sent (so a closed page or a lost signal loses nothing). Sends the same document as the admin page's builder
// (admin-coach.js) to users/{uid}/coach/plan, which the client's app applies. Templates: coaches/{uid}/templates.
// Text in English and Arabic (coach-i18n.js, falling back to the app's i18n.js). Drag & drop: vendor/sortable (loaded
// the first time a list can be dragged). Shared as window.ApexCoachBuilder: open(opts), back(), close(force).
window.ApexCoachBuilder = (() => {
    'use strict';
    const { muscleOptions, exerciseDictionary, exerciseAR, WORKOUTS, PROGRAMS } = window.APEX_LIB;
    const { $, esc, isObj } = window.ApexAdminUtils;
    const { t, isAR, muscle: tm } = window.ApexCoachI18n;
    const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const DAY_LONG = { SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday' };
    const REPS_PRESETS = ['6 - 8', '8 - 10', '8 - 12', '10 - 12', '12 - 15', '15 - 20', '30 - 45s']; // the app's
    const BALANCE = [['Chest', ['Chest', 'Upper Chest', 'Lower Chest'], 8], ['Back', ['Back', 'Lats', 'Traps', 'Lower Back'], 8], ['Legs', ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Adductors', 'Abductors'], 8], ['Shoulders', ['Shoulders', 'Front Delts', 'Side Delts', 'Rear Delts'], 6], ['Arms', ['Biceps', 'Triceps', 'Forearms'], 6], ['Core', ['Abs'], 3]];
    const DAY_KEYS = ['title', 'isRest', 'recoveryType', 'savedTitle', 'exercises'];
    const MAX_EX = 60, NOTE_MAX = 1000;
    const GRIP = '<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>';
    const clone = v => JSON.parse(JSON.stringify(v));
    const muscleOf = name => Object.keys(exerciseDictionary).find(m => exerciseDictionary[m].includes(name)) || '';
    const ALL_EX = [...new Set(Object.values(exerciseDictionary).flat())].sort();
    const tex = n => (isAR && exerciseAR && exerciseAR[n]) || n;
    const fmtReps = r => String(r == null ? '' : r).trim().replace(/\s*[-–]\s*/g, '–');
    const isTimed = r => /s$/i.test(String(r || '').trim());
    const dayShort = d => isAR ? t(DAY_LONG[d] || d) : (DAY_LONG[d] || d).slice(0, 3);
    const dayTitle = d => d.isRest ? t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : d.title && d.title !== 'New Day' ? t(d.title) : t(d.exercises.length ? 'New Day' : 'Empty');
    const setsOf = d => d.exercises.reduce((s, e) => s + (parseInt(e.sets) || 0), 0);
    const icons = el => { if (window.lucide) window.lucide.createIcons({ root: el }); };
    const box = () => $('coach');
    const buzz = () => { try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} };

    let S = null; // { db, auth, client, mode, targetId, routine, note, activate, dirty, templates, from, view, weekEdit, sameAll, menu, onSent, templatesPath, coachName, coachUid }
    let sortable = null;

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
    // anything loaded (their routine, a template, a draft) cleaned into the exact shape, never more than the app accepts
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
        const name = (r.name || '').trim();
        r.name = !name || name === 'Coach plan' ? t('Coach plan') : name;
        return r;
    };
    const problems = r => {
        const out = [], train = r.schedule.filter(d => !d.isRest);
        if (!train.length) out.push(t('Every day is a rest day.'));
        train.filter(d => !d.exercises.length).forEach(d => out.push(t('Day {n} ({day}) is a workout day with no exercises.', { n: d.id, day: t(DAY_LONG[d.day]) })));
        return out;
    };

    // ---------- the draft: kept on this phone until it is sent (or the coach starts over) ----------
    const draftKey = () => `apexCoachDraft:${S.coachUid || ''}:${S.client.uid}:${S.mode === 'note' ? 'note' : S.targetId || 'new'}`;
    let draftTimer = 0;
    const touch = () => { S.dirty = true; clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 400); };
    const saveDraft = () => { if (!S || !S.dirty) return; try { localStorage.setItem(draftKey(), JSON.stringify({ at: Date.now(), routine: S.routine, note: S.note, activate: S.activate, from: S.from })); } catch (e) {} };
    const dropDraft = () => { if (!S) return; clearTimeout(draftTimer); try { localStorage.removeItem(draftKey()); } catch (e) {} };
    const readDraft = () => { try { const d = JSON.parse(localStorage.getItem(draftKey()) || 'null'); return isObj(d) && d.at ? d : null; } catch (e) { return null; } };
    const fmtWhen = ts => { const d = new Date(ts), sameDay = new Date().toDateString() === d.toDateString(); return `${sameDay ? t('Today') : d.toLocaleDateString(isAR ? 'ar' : 'en-GB', { day: 'numeric', month: 'short' })} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

    // ---------- pop-ups and messages (the coach app's look) ----------
    const pop = (html, cls = '') => {
        const o = document.createElement('div');
        o.className = `pop cb-pop ${cls}`; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
        o.innerHTML = `<div class="pop-card">${html}</div>`;
        document.body.appendChild(o); icons(o);
        return o;
    };
    const topPop = () => [...document.querySelectorAll('.cb-pop')].pop();
    const ask = (title, text, okLabel, danger = false, noLabel = t('Cancel')) => new Promise(done => {
        const o = pop(`<h3>${esc(title)}</h3>${text ? `<p style="white-space:pre-line">${esc(text)}</p>` : ''}<div class="pop-actions"><button class="btn tap" data-no>${esc(noLabel)}</button><button class="btn tap ${danger ? 'is-danger' : 'gold'}" data-ok>${esc(okLabel)}</button></div>`);
        // true = yes, false = the "no" button, null = closed without choosing (a tap outside, the phone's back)
        o.close = (v = null) => { o.remove(); done(v); };
        o.onclick = e => { if (e.target === o) o.close(null); };
        o.querySelector('[data-no]').onclick = () => o.close(false);
        o.querySelector('[data-ok]').onclick = () => o.close(true);
        o.querySelector('[data-ok]').focus();
    });
    const askText = (title, value, okLabel) => new Promise(done => {
        const o = pop(`<h3>${esc(title)}</h3><input class="field" maxlength="60" value="${esc(value)}" dir="auto" enterkeyhint="done" aria-label="${esc(title)}"><div class="pop-actions"><button class="btn tap" data-no>${t('Cancel')}</button><button class="btn gold tap" data-ok>${esc(okLabel)}</button></div>`);
        const inp = o.querySelector('input');
        o.close = v => { o.remove(); done(v || ''); };
        o.onclick = e => { if (e.target === o) o.close(''); };
        o.querySelector('[data-no]').onclick = () => o.close('');
        o.querySelector('[data-ok]').onclick = () => o.close(inp.value.trim().slice(0, 60));
        inp.onkeydown = e => { if (e.key === 'Enter') o.close(inp.value.trim().slice(0, 60)); };
        inp.focus(); inp.select();
    });
    // a message at the bottom, with Undo when a change can be taken back
    let flashTimer = 0;
    const flash = (text, bad = false, undo = null) => {
        const old = document.querySelector('.cb-flash'); if (old) old.remove();
        const el = document.createElement('div');
        el.className = `toast cb-flash${bad ? ' is-bad' : ''}`; el.setAttribute('role', 'status');
        el.innerHTML = `<i data-lucide="${bad ? 'alert-circle' : 'check-circle'}"></i><span>${esc(text)}</span>${undo ? `<button class="cb-undo tap">${t('Undo')}</button>` : ''}`;
        if (undo) el.querySelector('.cb-undo').onclick = () => { el.remove(); undo(); };
        document.body.appendChild(el); icons(el);
        clearTimeout(flashTimer); flashTimer = setTimeout(() => el.remove(), undo ? 5000 : 2500);
    };
    // keep a copy of the routine before a change, so the message can undo it
    const snap = () => clone(S.routine.schedule);
    const undoTo = before => () => { if (!S) return; S.routine.schedule = before; touch(); renderView(); };

    // ---------- open / close / back ----------
    const open = opts => {
        S = { ...opts, templates: null, dirty: false, note: '', activate: true, from: '', view: 'week', weekEdit: false, sameAll: false, menu: null };
        S.targetId = opts.mode === 'replace' && opts.routine ? String(opts.routine.id || '') : '';
        S.routine = opts.routine ? cleanRoutine(opts.routine) : blankRoutine();
        box().classList.add('open'); box().scrollTop = 0;
        document.documentElement.classList.add('in-builder');
        renderView();
        if (S.mode !== 'note') loadTemplates();
        // work that wasn't sent last time: continue it or start over
        const d = readDraft();
        if (d) ask(t('Continue your draft?'), t('You started this for {name} ({when}) and didn\'t send it.', { name: S.client.name, when: fmtWhen(d.at) }), t('Continue'), false, t('Start over')).then(yes => {
            if (!S) return;
            if (yes) { if (d.routine) S.routine = cleanRoutine(d.routine); S.note = String(d.note || '').slice(0, NOTE_MAX); S.activate = d.activate !== false; S.from = String(d.from || ''); S.dirty = true; renderView(); }
            else if (yes === false) dropDraft(); // "Start over" (closing the question keeps the draft for next time)
        });
    };
    const close = async (force = false) => {
        if (!S) return;
        if (!force && S.dirty) {
            if (!(await ask(t('Close without sending?'), t('Your work is kept as a draft on this phone. You can continue it next time.'), t('Close')))) return;
            saveDraft();
        }
        if (sortable) { sortable.destroy(); sortable = null; }
        document.querySelectorAll('.cb-pop, .cb-sheet, .cb-flash').forEach(x => x.remove());
        box().classList.remove('open'); box().innerHTML = '';
        document.documentElement.classList.remove('in-builder');
        S = null;
    };
    // the phone's back, Escape, a swipe from the edge: the top thing closes first. true = handled (the editor stays open)
    const back = () => {
        if (!S) return false;
        const p = topPop(); if (p) { if (p.close) p.close(); else p.remove(); return true; }
        if (document.querySelector('.cb-sheet')) { closeSheet(); return true; }
        if (S.menu) { S.menu = null; renderView(); return true; }
        if (S.view !== 'week') { S.view = 'week'; S.sameAll = false; renderView(); box().scrollTop = 0; return true; }
        if (S.weekEdit) { S.weekEdit = false; renderView(); return true; }
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
    // drag & drop: the library is downloaded the first time a list can be dragged
    let sortLoading = false;
    const needSortable = () => {
        if (window.Sortable || sortLoading) return;
        sortLoading = true;
        const el = document.createElement('script'); el.src = 'vendor/sortable-1.15.7.min.js';
        el.onload = () => { if (S) renderView(); };
        el.onerror = () => { sortLoading = false; el.remove(); };
        document.head.appendChild(el);
    };
    const makeSortable = (list, onMove) => {
        if (sortable) { sortable.destroy(); sortable = null; }
        if (!list) return;
        needSortable();
        if (!window.Sortable) return;
        sortable = new window.Sortable(list, {
            handle: '.handle', animation: 220, forceFallback: true, fallbackOnBody: true, fallbackTolerance: 3,
            scroll: box(), scrollSensitivity: 60, scrollSpeed: 10, bubbleScroll: false,
            chosenClass: 'plan-chosen', ghostClass: 'plan-ghost', fallbackClass: 'plan-drag', dragClass: 'plan-drag',
            onStart: buzz,
            onEnd: evt => { if (evt.oldIndex !== evt.newIndex) onMove(evt.oldIndex, evt.newIndex); }
        });
    };
    const renderView = () => { if (!S) return; if (S.mode === 'note') return renderNote(); if (S.view === 'week') return renderWeek(); renderDay(); };

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
    const balanceHTML = () => {
        const sched = S.routine.schedule;
        const sets = BALANCE.map(([g, ms, low]) => ({ g, low, n: sched.reduce((a, d) => a + (d.isRest ? 0 : d.exercises.filter(e => ms.includes(e.muscle)).reduce((b, e) => b + (parseInt(e.sets) || 0), 0)), 0) }));
        if (!sets.some(x => x.n)) return '';
        const top = Math.max(20, ...sets.map(x => x.n));
        return `<div class="glass-card cb-balance">
            <div class="cb-bal-h"><span>${t('Muscle balance')}</span><span>${t('Sets per week')}</span></div>
            ${sets.map(x => { const lo = x.n < x.low; return `<div class="cb-bal-row${lo ? ' is-low' : ''}"><span class="cb-bal-g">${esc(t(x.g))}</span><span class="cb-bal-bar" dir="ltr"><span style="width:${Math.max(x.n ? 4 : 0, Math.round(x.n / top * 100))}%"></span></span><span class="cb-bal-n"><span class="num" dir="ltr">${x.n}</span>${lo ? ` · ${t('Low')}` : ''}</span></div>`; }).join('')}
            <p class="muted" style="margin-top:10px">${t('Aim for about 10–20 sets a week for each muscle.')}</p>
        </div>`;
    };
    const renderWeek = () => {
        const c = S.client, tg = target(), sched = S.routine.schedule, editing = S.weekEdit;
        const dayRow = d => {
            const empty = !d.isRest && !d.exercises.length, open = S.menu === d.id;
            const meta = d.isRest ? '' : empty ? `<span class="cb-add-hint">＋ ${t('Add exercises')}</span>` : esc(`${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n: setsOf(d) })}`);
            return `<div class="glass-card plan-ex plan-day${d.isRest ? ' is-rest' : ''}${editing ? ' is-editing' : ''}${open ? ' is-menu' : ''}" data-row="${d.id - 1}">
                ${editing ? `<span class="handle" aria-label="${esc(t('Drag to reorder'))}" role="img">${GRIP}</span>` : ''}
                <button class="cb-dopen tap" data-day="${d.id - 1}" aria-label="${esc(`${t(DAY_LONG[d.day])} · ${dayTitle(d)}`)}">
                    ${d.isRest ? `<i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="cb-rest-ic"></i>` : empty ? '<span class="cb-red-dot"></span>' : ''}
                    <span class="cb-dt"><b class="${d.isRest || empty ? 'is-quiet' : ''}">${esc(dayTitle(d))}</b>${meta ? `<small>${meta}</small>` : ''}</span>
                </button>
                ${editing ? '' : `<button class="cb-dots tap${open ? ' is-on' : ''}" data-menu="${d.id}" aria-haspopup="menu" aria-expanded="${open}" aria-label="${esc(`${t('Day options')} · ${t(DAY_LONG[d.day])}`)}"><i data-lucide="ellipsis-vertical"></i></button>`}
                ${open ? `<div class="cb-menu" role="menu">
                    <label class="cb-mi" role="menuitem"><i data-lucide="copy"></i>${t('Copy to another day')}<select data-copy-to="${d.id - 1}" aria-label="${esc(t('Copy to another day'))}"><option value="">${t('Copy to another day')}</option>${sched.filter(x => x.id !== d.id).map(x => `<option value="${x.id - 1}">${esc(t(DAY_LONG[x.day]))} · ${esc(dayTitle(x))}</option>`).join('')}</select></label>
                    ${!d.isRest && d.exercises.length ? `<button class="cb-mi is-danger tap" role="menuitem" data-clear="${d.id - 1}"><i data-lucide="trash-2"></i>${t('Clear this day')}</button>` : ''}
                </div>` : ''}
            </div>`;
        };
        box().innerHTML = `<div class="cb-page">
            ${bar(tg ? t('Edit routine') : t('New routine'), t('Cancel'))}
            <p class="cb-for">${t('For {name}', { name: `<b>${esc(c.name)}</b>` })}</p>
            <div class="pf-group">
                <label class="pf-row"><span class="pf-ic"><i data-lucide="pencil"></i></span><span class="pf-label">${t('Routine name')}</span>
                    <input id="cb-name" class="cb-inline" maxlength="60" dir="auto" enterkeyhint="done" autocomplete="off" value="${esc(S.routine.name === 'Coach plan' ? '' : S.routine.name)}" placeholder="${esc(t('Coach plan'))}"></label>
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
            <div class="cb-weekhead">
                <span><b>${t('This week')}</b><small class="${editing ? 'is-gold' : ''}">${t(editing ? 'Drag the days to move them' : 'Tap a day to edit it')}</small></span>
                <button class="week-edit-btn tap${editing ? ' is-on' : ''}" id="cb-weekedit" aria-pressed="${editing}" aria-label="${esc(t(editing ? 'Done' : 'Move days'))}">${editing ? `<i data-lucide="check"></i><span>${t('Done')}</span>` : '<i data-lucide="pencil"></i>'}</button>
            </div>
            <div class="cb-week">
                <div class="cb-wdays" aria-hidden="true">${sched.map(d => `<div><span>${esc(dayShort(d.day))}</span><small class="num">${d.id}</small></div>`).join('')}</div>
                <div class="cb-wlist" id="cb-wlist">${sched.map(dayRow).join('')}</div>
            </div>
            ${balanceHTML()}
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
        $('cb-name').oninput = e => { S.routine.name = e.target.value.slice(0, 60) || 'Coach plan'; touch(); };
        $('cb-from').onchange = e => startFrom(e.target.value);
        $('cb-dest').onchange = e => pickDest(e.target.value);
        $('cb-active').onchange = e => { S.activate = e.target.checked; $('cb-mode').innerHTML = modeText(); touch(); };
        $('cb-note').oninput = e => { S.note = e.target.value.slice(0, NOTE_MAX); touch(); };
        $('cb-weekedit').onclick = () => { S.weekEdit = !S.weekEdit; S.menu = null; renderWeek(); };
        b.querySelectorAll('[data-day]').forEach(x => x.onclick = () => { if (S.weekEdit) return; S.view = +x.dataset.day; S.menu = null; renderView(); box().scrollTop = 0; });
        b.querySelectorAll('[data-menu]').forEach(x => x.onclick = e => { e.stopPropagation(); S.menu = S.menu === +x.dataset.menu ? null : +x.dataset.menu; renderWeek(); });
        b.querySelectorAll('[data-copy-to]').forEach(x => x.onchange = () => {
            const from = sched[+x.dataset.copyTo], to = sched[+x.value]; if (!from || !to) return;
            const before = snap();
            DAY_KEYS.forEach(k => { to[k] = clone(from[k]); }); S.menu = null; touch(); renderWeek();
            flash(t('Copied to {day}', { day: t(DAY_LONG[to.day]) }), false, undoTo(before));
        });
        b.querySelectorAll('[data-clear]').forEach(x => x.onclick = () => {
            const d = sched[+x.dataset.clear], before = snap(); d.exercises = []; S.menu = null; touch(); renderWeek();
            flash(t('Day cleared'), false, undoTo(before));
        });
        $('cb-tpl').onclick = saveTemplate;
        $('cb-send').onclick = send;
        renderFrom();
        // ✏️ on: drag a day to another weekday (the weekdays stay, the workouts move)
        if (editing) makeSortable($('cb-wlist'), (from, to) => {
            const before = snap(), take = () => sched.map(d => { const o = {}; DAY_KEYS.forEach(k => { o[k] = d[k]; }); return o; });
            const next = take(); next.splice(to, 0, next.splice(from, 1)[0]);
            sched.forEach((d, i) => Object.assign(d, next[i]));
            buzz(); touch(); renderWeek();
            flash(t('Week order saved'), false, undoTo(before));
        });
        else if (sortable) { sortable.destroy(); sortable = null; }
    };
    // a tap anywhere else closes the ⋮ menu
    document.addEventListener('click', e => { if (S && S.menu && !e.target.closest('.cb-menu, [data-menu]')) { S.menu = null; renderWeek(); } });
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
        S.routine = { ...r, id: S.routine.id }; S.from = from;
        if (from !== 'blank') touch();
        renderWeek();
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
        renderWeek();
    };

    // ---------- one day ----------
    const curDay = () => S.routine.schedule[S.view];
    const renderDay = () => {
        const d = curDay(), n = setsOf(d), mins = Math.max(10, Math.round(n * 2.5 / 5) * 5), hasEx = !d.isRest && d.exercises.length > 0;
        const type = d.isRest ? d.recoveryType : 'workout';
        box().innerHTML = `<div class="cb-page">
            <div class="cb-backbar"><button class="back-btn tap" data-cb-back aria-label="${esc(t('This week'))}"><i data-lucide="chevron-left" class="rtl-flip"></i></button><button class="cb-backtxt tap" data-cb-back>${t('This week')}</button></div>
            <div class="cb-dayhead">
                <small>${esc(t(DAY_LONG[d.day]))}</small>
                ${d.isRest ? `<h2>${esc(dayTitle(d))}</h2>` : `<input id="cb-title" class="cb-title" maxlength="80" dir="auto" enterkeyhint="done" autocomplete="off" value="${esc(d.title === 'New Day' ? '' : t(d.title))}" placeholder="${esc(t('Name this day'))}" aria-label="${esc(t('Name this day'))}">`}
                <p>${d.isRest ? t('Recover well. See you next session.') : esc(`${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n })}${n ? ` · ${t('~{n} min', { n: mins })}` : ''}`)}</p>
                <div class="cb-chips" role="toolbar" aria-label="${esc(t('Day tools'))}">
                    <label class="cb-chip"><select id="cb-type" aria-label="${esc(t('Day type'))}"><option value="workout" ${type === 'workout' ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${type === 'active' ? 'selected' : ''}>${t('Active Rest')}</option><option value="complete" ${type === 'complete' ? 'selected' : ''}>${t('Complete Rest')}</option></select>${t('Day type')}<i data-lucide="chevron-down"></i></label>
                    ${hasEx ? `<button class="cb-chip tap${S.sameAll ? ' is-on' : ''}" id="cb-same" aria-pressed="${S.sameAll}"><i data-lucide="list-checks"></i>${t('Same sets & reps for all')}</button>` : ''}
                </div>
                ${hasEx && S.sameAll ? `<div class="cb-same">
                    <span>${t('Same for all')}</span>
                    <input id="cb-gsets" inputmode="numeric" maxlength="2" placeholder="${esc(t('Sets'))}" aria-label="${esc(t('Sets'))}" dir="ltr">
                    <input id="cb-greps" maxlength="20" placeholder="${esc(t('Reps'))}" aria-label="${esc(t('Reps'))}" dir="ltr">
                    <button class="btn gold tap" id="cb-gapply">${t('Apply')}</button>
                </div>` : ''}
            </div>
            ${d.isRest ? '' : `${d.exercises.length ? `<p class="cb-tip">${t(d.exercises.length > 1 ? 'Hold ⋮⋮ to move · swipe left to delete' : 'Swipe left to delete')}</p>` : ''}
                <div id="cb-exs" class="cb-exs">${d.exercises.map((e, j) => `<div class="swipe-row" data-i="${j}"><div class="swipe-del" aria-hidden="true"><i data-lucide="trash-2"></i>${t('Delete')}</div>
                    <div class="swipe-fg glass-card plan-ex">
                        ${d.exercises.length > 1 ? `<span class="handle" aria-label="${esc(t('Drag to reorder'))}" role="img">${GRIP}</span>` : '<span class="handle-gap"></span>'}
                        <button class="cb-ex tap" data-j="${j}">
                            <span class="cb-n num">${j + 1}</span>
                            <span class="cb-et"><b>${esc(tex(e.name))}</b><small>${esc(tm(e.muscle))}</small></span>
                            <span class="cb-pill num" dir="ltr">${esc(`${e.sets} × ${fmtReps(e.reps)}`)}</span>
                        </button>
                    </div></div>`).join('')}</div>
                <button class="cb-addex tap" id="cb-add" ${d.exercises.length >= MAX_EX ? 'disabled' : ''}><i data-lucide="plus"></i>${t('Add Exercise')}</button>`}
        </div>`;
        icons(box());
        const b = box();
        b.querySelectorAll('[data-cb-back]').forEach(x => x.onclick = () => back());
        const ti = $('cb-title'); if (ti) ti.oninput = e => { d.title = e.target.value.slice(0, 80) || 'New Day'; d.savedTitle = d.title; touch(); };
        $('cb-type').onchange = e => {
            const v = e.target.value; touch();
            if (v === 'workout') { d.isRest = false; d.recoveryType = null; d.title = d.savedTitle || 'New Day'; if (d.keep) { d.exercises = d.keep; delete d.keep; } }
            else { if (!d.isRest) { d.savedTitle = d.title; d.keep = d.exercises; } d.isRest = true; d.recoveryType = v; d.title = v === 'active' ? 'Active Rest' : 'Complete Rest'; d.exercises = []; }
            renderDay();
        };
        const same = $('cb-same'); if (same) same.onclick = () => { S.sameAll = !S.sameAll; renderDay(); if (S.sameAll) $('cb-gsets').focus(); };
        const ga = $('cb-gapply'); if (ga) ga.onclick = () => {
            const sv = parseInt($('cb-gsets').value), rv = $('cb-greps').value.trim().slice(0, 20);
            if (!(sv >= 1 && sv <= 20) && !rv) return flash(t('Type sets, reps or both.'), true);
            const before = snap();
            d.exercises.forEach(e => { if (sv >= 1 && sv <= 20) e.sets = String(sv); if (rv) e.reps = rv; });
            S.sameAll = false; touch(); renderDay();
            flash(t('Applied to all exercises'), false, undoTo(before));
        };
        b.querySelectorAll('[data-j]').forEach(x => x.onclick = e => { if ($('cb-exs').dataset.swiped) return; exPop(+x.dataset.j); });
        const add = $('cb-add'); if (add) add.onclick = () => openSheet('add');
        const list = $('cb-exs');
        if (list && d.exercises.length > 1) makeSortable(list, (from, to) => {
            const before = snap();
            d.exercises.splice(to, 0, d.exercises.splice(from, 1)[0]);
            touch(); renderDay();
            flash(t('Order saved'), false, undoTo(before));
        });
        else if (sortable) { sortable.destroy(); sortable = null; }
        swipeDelete(list);
    };
    const deleteEx = j => {
        const d = curDay(), before = snap(), e = d.exercises[j]; if (!e) return;
        d.exercises.splice(j, 1); touch(); renderDay();
        flash(t('{name} deleted', { name: tex(e.name) }), false, undoTo(before));
    };
    // swipe an exercise card from right to left to delete it; a short swipe springs back (the app's gesture)
    const swipeDelete = list => {
        if (!list) return;
        let row = null, fg = null, x0 = 0, y0 = 0, dx = 0, mode = null;
        list.addEventListener('touchstart', e => {
            row = e.target.closest('.swipe-row'); mode = null; dx = 0;
            if (!row || e.touches.length > 1 || e.target.closest('.handle')) { row = null; return; }
            fg = row.querySelector('.swipe-fg'); x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
        }, { passive: true });
        list.addEventListener('touchmove', e => {
            if (!row) return;
            const mx = e.touches[0].clientX - x0, my = e.touches[0].clientY - y0;
            if (!mode) { if (Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) mode = 'x'; else if (Math.abs(my) > 10) { row = null; return; } else return; }
            dx = Math.min(0, mx); fg.style.transition = 'none'; fg.style.transform = `translateX(${dx}px)`;
            row.classList.toggle('is-armed', dx < -row.offsetWidth * 0.35);
        }, { passive: true });
        const end = () => {
            if (!row) return;
            const r = row, f = fg, del = mode === 'x' && dx < -r.offsetWidth * 0.35; row = null;
            if (mode === 'x') { list.dataset.swiped = '1'; setTimeout(() => { delete list.dataset.swiped; }, 350); }
            f.style.transition = 'transform 0.22s ease';
            if (del) { f.style.transform = 'translateX(-110%)'; buzz(); setTimeout(() => deleteEx(+r.dataset.i), 200); }
            else { f.style.transform = ''; r.classList.remove('is-armed'); }
        };
        list.addEventListener('touchend', end); list.addEventListener('touchcancel', end);
    };

    // ---------- one exercise (pop-up): change it, sets − / +, reps per set ----------
    const exPop = j => {
        const d = curDay(), e = d.exercises[j]; if (!e) return;
        let custom = !REPS_PRESETS.includes(e.reps);
        const o = pop('', 'is-ex');
        const draw = () => {
            const sets = parseInt(e.sets) || 3, isCustom = !REPS_PRESETS.includes(e.reps);
            o.querySelector('.pop-card').innerHTML = `
                <div class="cb-ex-top"><small>${esc(tm(e.muscle))}</small><button class="cb-ex-del tap" data-del aria-label="${esc(t('Delete'))}"><i data-lucide="trash-2"></i></button></div>
                <h3 class="cb-ex-name">${esc(tex(e.name))}</h3>
                <button class="btn tap cb-change" data-change><i data-lucide="replace"></i>${t('Change exercise')}</button>
                <div class="cb-lbl">${t('Sets')}</div>
                <div class="cb-step" dir="ltr"><button class="tap" data-s="-1" aria-label="${esc(t('Fewer sets'))}"><i data-lucide="minus"></i></button><b class="num">${sets}</b><button class="tap" data-s="1" aria-label="${esc(t('More sets'))}"><i data-lucide="plus"></i></button></div>
                <div class="cb-lbl">${t(isTimed(e.reps) ? 'Seconds per set' : 'Reps per set')}</div>
                <div class="cb-reps" dir="ltr">${REPS_PRESETS.map(r => `<button class="tap${e.reps === r ? ' is-on' : ''}" data-r="${esc(r)}">${esc(fmtReps(r))}</button>`).join('')}<button class="tap is-custom${isCustom ? ' is-on' : ''}" data-custom>${isCustom ? esc(fmtReps(e.reps)) : `<i data-lucide="plus"></i>${t('Custom')}`}</button></div>
                ${custom ? `<div class="cb-customrow"><input class="field" data-f="reps" maxlength="20" dir="ltr" enterkeyhint="done" value="${isCustom ? esc(e.reps) : ''}" placeholder="${esc(t('Custom reps, e.g. 5 or 6 - 8'))}" aria-label="${esc(t('Reps'))}"><button class="btn gold tap" data-cok aria-label="${esc(t('Done'))}"><i data-lucide="check"></i></button></div>` : ''}
                <button class="btn gold tap" data-ok style="margin:16px 0 0"><i data-lucide="check"></i>${t('Done')}</button>`;
            icons(o);
            o.querySelectorAll('[data-s]').forEach(x => x.onclick = () => { e.sets = String(Math.min(20, Math.max(1, sets + +x.dataset.s))); touch(); draw(); });
            o.querySelectorAll('[data-r]').forEach(x => x.onclick = () => { e.reps = x.dataset.r; custom = false; touch(); draw(); });
            o.querySelector('[data-custom]').onclick = () => { custom = true; draw(); const i = o.querySelector('[data-f="reps"]'); if (i) i.focus(); };
            const ci = o.querySelector('[data-f="reps"]');
            if (ci) { const ok = () => { const v = ci.value.trim().slice(0, 20); if (v) { e.reps = v; touch(); } custom = false; draw(); }; o.querySelector('[data-cok]').onclick = ok; ci.onkeydown = ev => { if (ev.key === 'Enter') ok(); }; }
            o.querySelector('[data-del]').onclick = () => { o.remove(); deleteEx(j); };
            o.querySelector('[data-change]').onclick = () => { o.remove(); openSheet('replace', j); };
            o.querySelector('[data-ok]').onclick = () => o.close();
        };
        o.close = () => { const ci = o.querySelector('[data-f="reps"]'); if (ci && ci.value.trim()) { e.reps = ci.value.trim().slice(0, 20); touch(); } o.remove(); renderDay(); };
        o.onclick = ev => { if (ev.target === o) o.close(); };
        draw();
    };

    // ---------- Add / change exercise: a bottom sheet with search and muscle chips (like the app) ----------
    let sheet = null; // { mode: 'add' | 'replace', j, q, m }
    const openSheet = (mode, j = -1) => {
        sheet = { mode, j, q: '', m: '' };
        const w = document.createElement('div');
        w.className = 'cb-sheet'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', t(mode === 'replace' ? 'Change exercise' : 'Add exercises'));
        w.innerHTML = `<div class="cb-sheet-box">
            <button class="cb-grab" data-close aria-label="${esc(t('Close'))}"><span></span></button>
            <h3>${t(mode === 'replace' ? 'Change exercise' : 'Add exercises')}</h3>
            <div class="search"><i data-lucide="search"></i><input id="cb-q" type="search" autocomplete="off" enterkeyhint="search" placeholder="${esc(t('Search exercises'))}" aria-label="${esc(t('Search exercises'))}"></div>
            <div class="cb-mchips">${['', ...muscleOptions.filter(m => exerciseDictionary[m])].map(m => `<button class="chip tap${m ? '' : ' is-on'}" data-m="${esc(m)}">${esc(m ? tm(m) : t('All'))}</button>`).join('')}</div>
            <div class="cb-list" id="cb-list"></div>
        </div>`;
        document.body.appendChild(w); icons(w);
        requestAnimationFrame(() => w.classList.add('is-open'));
        w.onclick = e => { if (e.target === w) closeSheet(); };
        w.querySelector('[data-close]').onclick = closeSheet;
        w.querySelector('#cb-q').oninput = e => { sheet.q = e.target.value; renderList(); };
        w.querySelectorAll('[data-m]').forEach(x => x.onclick = () => { sheet.m = x.dataset.m; w.querySelectorAll('[data-m]').forEach(y => y.classList.toggle('is-on', y === x)); x.scrollIntoView({ inline: 'nearest', block: 'nearest' }); renderList(); });
        // swipe down (from the top, or with the list at the top) closes it
        const sb = w.querySelector('.cb-sheet-box'), list = w.querySelector('.cb-list');
        let y0 = null, dy = 0;
        sb.addEventListener('touchstart', e => { if (e.target.closest('.cb-mchips, input') || (e.target.closest('.cb-list') && list.scrollTop > 0)) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; }, { passive: true });
        sb.addEventListener('touchmove', e => { if (y0 === null) return; dy = e.touches[0].clientY - y0; if (dy > 0) { sb.style.transition = 'none'; sb.style.transform = `translateY(${dy}px)`; } }, { passive: true });
        sb.addEventListener('touchend', () => { if (y0 === null) return; y0 = null; sb.style.transition = ''; sb.style.transform = ''; if (dy > 120) closeSheet(); });
        renderList();
    };
    const closeSheet = () => {
        const w = document.querySelector('.cb-sheet'), was = sheet; sheet = null;
        if (w) { w.classList.remove('is-open'); setTimeout(() => w.remove(), 250); }
        if (S && S.view !== 'week') { renderDay(); if (was && was.mode === 'replace' && curDay().exercises[was.j]) exPop(was.j); }
    };
    const norm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    const renderList = () => {
        const el = $('cb-list'); if (!el || !sheet) return;
        const d = curDay(), q = norm(sheet.q.trim()), inDay = new Set(d.exercises.map(e => e.name));
        const match = n => (!q || norm(n).includes(q) || norm(tex(n)).includes(q)) && (!sheet.m || muscleOf(n) === sheet.m || (exerciseDictionary[sheet.m] || []).includes(n));
        // exercises already in their routines come first (like "In your routines" in the app)
        const theirs = [...new Set(S.client.routines.flatMap(w => (Array.isArray(w.schedule) ? w.schedule : []).flatMap(x => (isObj(x) && Array.isArray(x.exercises) ? x.exercises : []).map(e => isObj(e) ? String(e.name || '') : ''))).concat(S.routine.schedule.flatMap(x => x.exercises.map(e => e.name))))].filter(n => n && n !== 'New Exercise');
        const used = theirs.filter(match).slice(0, 40), usedSet = new Set(used);
        const rest = (sheet.m ? exerciseDictionary[sheet.m] || [] : ALL_EX).filter(n => !usedSet.has(n) && match(n)).slice(0, 200);
        const custom = sheet.q.trim() && !ALL_EX.some(n => norm(n) === q) && !theirs.some(n => norm(n) === q) ? sheet.q.trim().slice(0, 80) : '';
        const replace = sheet.mode === 'replace';
        const row = n => { const on = inDay.has(n); return `<button class="cb-row tap" data-add="${esc(n)}"><span><b>${esc(tex(n))}</b><small>${esc(tm(muscleOf(n) || (d.exercises.find(e => e.name === n) || {}).muscle || ''))}${on ? ` · ${t('In this day')}` : ''}</small></span><span class="cb-plus${on && !replace ? ' is-on' : ''}"><i data-lucide="${replace ? 'replace' : on ? 'check' : 'plus'}"></i></span></button>`; };
        el.innerHTML = `${used.length ? `<div class="cb-sec is-gold">${t('In their routines')}</div>${used.map(row).join('')}` : ''}
            ${rest.length ? `${used.length ? `<div class="cb-sec">${t('All exercises')}</div>` : ''}${rest.map(row).join('')}` : ''}
            ${custom ? `<button class="cb-row tap" data-add="${esc(custom)}"><span><b>${esc(t('Add “{name}”', { name: custom }))}</b><small>${t('Your own exercise')}</small></span><span class="cb-plus"><i data-lucide="plus"></i></span></button>` : ''}
            ${!used.length && !rest.length && !custom ? `<p class="pf-note" style="text-align:center;margin:20px 0">${t('No exercise found.')}</p>` : ''}`;
        icons(el);
        el.querySelectorAll('[data-add]').forEach(x => x.onclick = () => {
            const name = x.dataset.add, m = muscleOf(name) || sheet.m || ((d.exercises.find(e => e.name === name) || {}).muscle) || 'Muscle';
            if (replace) {
                const e = d.exercises[sheet.j]; if (!e) return closeSheet();
                const before = snap(); e.name = name; e.muscle = m; touch();
                flash(t('Changed to {name}', { name: tex(name) }), false, undoTo(before));
                return closeSheet();
            }
            if (d.exercises.length >= MAX_EX) return flash(t('A day can have up to 60 exercises.'), true);
            d.exercises.push({ muscle: m, name, sets: '3', reps: /(plank|hold|wall sit|hang|l-sit|vacuum)/i.test(name) ? '30 - 45s' : '10 - 12' });
            touch(); buzz();
            flash(t('{name} added', { name: tex(name) }));
            renderList();
        });
    };

    // ---------- a note only (pinned on their Today screen) ----------
    const renderNote = () => {
        box().innerHTML = `<div class="cb-page">
            ${bar(t('Pin a note'), t('Cancel'))}
            <p class="cb-for">${t('For {name}', { name: `<b>${esc(S.client.name)}</b>` })}</p>
            <p class="pf-note" style="margin:0 6px 12px">${t("Pins a note on the Today page of {name}'s app, above their workout, until they close it.", { name: esc(S.client.name) })}</p>
            <textarea id="cb-note" class="cb-note" rows="6" maxlength="${NOTE_MAX}" dir="auto" placeholder="${esc(t('Great week! Next week add 2.5 kg to your squat…'))}">${esc(S.note)}</textarea>
            <div class="cb-foot"><div class="cb-foot-in"><button class="btn gold tap" id="cb-send" style="grid-column:1/-1"><i data-lucide="send"></i>${esc(t('Send to {name}', { name: S.client.name.split(' ')[0] || t('client') }))}</button></div></div>
        </div>`;
        icons(box());
        box().querySelector('[data-cb-back]').onclick = () => back();
        $('cb-note').oninput = e => { S.note = e.target.value.slice(0, NOTE_MAX); touch(); };
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
            const done = S.onSent; dropDraft(); S.dirty = false;
            close(true);
            if (done) done(doc);
        } catch (e) {
            console.warn(e); btn.disabled = false;
            flash(`${t('Could not send ({code}).', { code: e.code || 'error' })} ${t('Your work is kept as a draft on this phone. You can continue it next time.')}`, true);
            saveDraft();
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

    // swipe from the left edge = back (a day → the week), like the app's full pages
    (() => {
        let x0 = null, y0 = 0, dx = 0;
        document.addEventListener('touchstart', e => { const x = e.touches[0].clientX; x0 = S && !document.querySelector('.cb-pop, .cb-sheet') && x < 24 && e.touches.length === 1 ? x : null; y0 = e.touches[0].clientY; dx = 0; }, { passive: true });
        document.addEventListener('touchmove', e => { if (x0 === null) return; dx = e.touches[0].clientX - x0; if (Math.abs(e.touches[0].clientY - y0) > Math.abs(dx) && dx < 30) x0 = null; }, { passive: true });
        document.addEventListener('touchend', () => { if (x0 === null) return; x0 = null; if (dx > 90 && S && S.view !== 'week') back(); });
    })();

    return Object.freeze({ open, back, close, isOpen: () => !!S });
})();

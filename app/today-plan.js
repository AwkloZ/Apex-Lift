// Apex Lift app (index.html), part 5 of 13: The Today tab, the day editor (Today and Plan) and the Plan tab.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🏠 TODAY: the selected day: a small day card, then its exercises. Tap an exercise to open it: Start (that exercise only) and History
// Cards slide in when you open a different tab or day, but not when the same screen just refreshes
let lastAnimKey = '';
const enterClass = key => { const k = `${window.appState.currentView}|${currentWeekId}|${activeDay}|${key || ''}`; if (k === lastAnimKey) return ''; lastAnimKey = k; return 'stagger'; };
// Exercises of a day that are finished: all planned sets done this week, or trained today (even with some sets skipped)
const exercisesFinished = (day, history) => day.exercises.map((ex, i) => {
    const hA = history[getExKey(currentWeekId, day.id, i, ex.name)] || [], planned = parseInt(ex.sets) || 0;
    return (planned > 0 && setsThisWeekForDay(hA, day.id) >= planned) || hA.some(l => logDayId(l) === day.id && isToday(logTime(l)));
});
// The whole day's summary once its last exercise is done: every set logged for this day today
const daySummary = (day, h) => {
    let sets = 0, volume = 0, start = Date.now(); const prs = [], seen = new Set();
    day.exercises.forEach((ex, i) => {
        const k = getExKey(currentWeekId, day.id, i, ex.name); if (seen.has(k)) return; seen.add(k);
        const all = h[k] || [], mine = all.filter(l => logDayId(l) === day.id && isToday(logTime(l)));
        if (!mine.length) return;
        const best = Math.max(0, ...all.filter(l => !isToday(logTime(l))).flatMap(logSetDetails).map(x => x.w));
        const top = Math.max(0, ...mine.flatMap(logSetDetails).map(x => x.w));
        if (best > 0 && top > best) prs.push({ name: ex.name, w: top, plus: Math.round((top - best) * 10) / 10 });
        mine.forEach(l => { start = Math.min(start, logTime(l)); logSetDetails(l).forEach(x => { sets++; if (l.u !== 's') volume += x.r * x.w; }); });
    });
    return { title: day.title, duration: Math.floor((Date.now() - start) / 1000), sets, volume, prs };
};
// "8 - 10" -> "8–10" (one dash, no spaces) so a rep range never reads like a sum
const fmtReps = r => String(r == null ? '' : r).trim().replace(/\s*[-–]\s*/g, '–');
// Today's target as a sentence: "60 kg for 10 reps" (no × or - signs)
const targetSentence = (sg, timed) => sg.w > 0
    ? t(timed ? '{w} kg for {r} sec' : '{w} kg for {r} reps', { w: fmtW(sg.w).replace('kg', ''), r: sg.r })
    : t(timed ? '{r} sec' : '{r} reps', { r: sg.r });
// Number circle on a Today card with a ring that fills as this week's sets get done (all done = green with a tick)
// a long exercise name gets a smaller font (down to 12px) so it stays on one line without "…"
const fitNames = root => requestAnimationFrame(() => (root ? root.querySelectorAll('.ex-fit') : []).forEach(el => {
    el.style.fontSize = ''; let size = parseFloat(getComputedStyle(el).fontSize) || 15;
    while (el.scrollWidth > el.clientWidth + 1 && size > 12) { size -= 0.5; el.style.fontSize = size + 'px'; }
    el.classList.toggle('truncate', el.scrollWidth > el.clientWidth + 1);
}));
window.addEventListener('resize', () => fitNames(document.getElementById('ex-sheet-content')));
const progressRing = (done, total, n) => {
    const r = 16, c = 2 * Math.PI * r, p = total > 0 ? Math.min(1, done / total) : 0, full = p >= 1;
    return `<span class="ex-ring ${full ? 'is-full' : ''}"><svg viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="19" r="${r}" class="ex-ring-bg"/>${p > 0 && !full ? `<circle cx="19" cy="19" r="${r}" class="ex-ring-fg" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}"/>` : ''}</svg><span class="ex-ring-n">${full ? '<i data-lucide="check" class="w-4 h-4"></i>' : n}</span></span>`;
};
// Today's edit mode: a gold bar on top (Done / plan the whole week), then the same day editor as Plan
const todayEditBar = () => `<div class="plan-strip flex items-center gap-2.5 px-3.5 py-2.5 mb-2.5 rounded-2xl bg-white/5 border border-white/10">
            <i data-lucide="pencil-line" class="w-[18px] h-[18px] text-[#d4af37] shrink-0"></i>
            <span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-[#d4af37]">${t('Editing this day')}</span><button data-on-click="window.appActions.planWholeWeek()" class="block text-[12px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Plan the whole week →')}</button></span>
            <button id="today-edit-done" data-on-click="window.appActions.setTodayEdit(false)" class="shrink-0 h-9 px-4 rounded-full bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4"></i>${t('Done')}</button>
        </div>`;
const renderToday = () => {
    const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), history = StorageManager.getHistory();
    const isT = activeDay === getTodayId(), S = window.appState.sess;
    if (window.appState.todayEdit && S) window.appState.todayEdit = false; // never edit the plan while a workout is running
    if (window.appState.todayEdit) return renderPlanDay(todayEditBar());
    const editBtn = ''; // Today is for training: days and exercises are edited in Plan
    const weekTop = `<div id="today-week" class="today-week">${weekNavHTML()}</div>`;
    const dayLabel = `<div class="text-[12px] font-bold text-[#d4af37]">${esc(isT ? t('Today') : dayLong(day.day))}</div>`;
    let html = '';
    if (day.isRest) {
        html += `<div class="glass-card today-card">${weekTop}<div class="today-body is-row"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${day.recoveryType==='active'?t('Active Rest'):t('Complete Rest')}</h2><div class="text-[12px] font-bold text-slate-400 mt-1">${t('Recover well. See you next session.')}</div></div><i data-lucide="${day.recoveryType==='active'?'footprints':'moon'}" class="w-9 h-9 text-[#d4af37] shrink-0 ${day.recoveryType==='active'?'animate-walk':'animate-pulse-glow'}"></i>${editBtn}</div></div>` + coachCardHTML();
        // Point to the next training day so a rest day is never a dead end
        const nextDay = [1, 2, 3, 4, 5, 6].map(o => schedule.find(d => d.id === ((activeDay - 1 + o) % 7) + 1)).find(d => d && !d.isRest && d.exercises.length);
        if (nextDay) html += `<button data-on-click="window.appActions.setActiveDay(@0)" data-a-click="${hArgs(nextDay.id)}" class="w-full glass-card p-4 mt-3 flex items-center gap-3 text-start tap-feedback"><span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-clock" class="w-5 h-5"></i></span><span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400">${t('Next workout')}</span><span class="block text-[15px] font-black text-white truncate">${esc(dayLong(nextDay.day))} · ${esc(t(nextDay.title))}</span></span><i data-lucide="chevron-right" class="w-5 h-5 text-slate-400 shrink-0"></i></button>`;
    } else if (!day.exercises.length) {
        html += `<div class="glass-card today-card">${weekTop}<div class="today-body"><div class="flex items-start gap-2"><div class="flex-1 min-w-0">${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${t('No exercises yet')}</h2></div>${editBtn}</div><div class="text-[12px] font-bold text-slate-400">${t('Add exercises to start training on this day.')}</div><button data-on-click="window.appActions.switchTab('plan'); window.appActions.openPlanDay(@0)" data-a-click="${hArgs(day.id)}" class="self-start px-5 py-2.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback">${t('Plan this day')}</button></div></div>` + coachCardHTML();
    } else {
        const pr = dayProgress(day, history), fin = exercisesFinished(day, history);
        const finished = (pr.planned > 0 && pr.done >= pr.planned) || fin.every(Boolean);
        const mins = Math.max(10, Math.round(pr.planned * 2.5 / 5) * 5);
        const running = S && S.dayId === day.id && (!S.weekId || S.weekId === currentWeekId);
        html += `<div class="glass-card today-card ${finished ? 'border border-[#22c55e]/30' : ''}">${weekTop}<div class="today-body">
                <div class="flex items-start gap-2">
                    <div class="flex-1 min-w-0">
                        <div class="text-[12px] font-bold text-[#d4af37]">${esc(isT ? t('Today') : dayLong(day.day))}${finished ? ` · <span class="text-[#22c55e]">${t('Done')}</span>` : ''}</div>
                        <h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${esc(t(day.title))}</h2>
                    </div>
                    ${editBtn}
                </div>
                <div class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: pr.planned })} · ${t('~{n} min', { n: mins })}</div>
                ${pr.done > 0 ? `<div><div class="flex justify-between text-[12px] font-bold mb-1.5"><span class="text-slate-400">${t('Done this week')}</span><span class="${finished ? 'text-[#22c55e]' : 'text-white'}" dir="ltr">${pr.done} / ${pr.planned}</span></div><div class="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div class="bar-fill h-full rounded-full ${finished ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pr.pct}%"></div></div></div>` : ''}
                ${isT && !finished ? checkInChip() : ''}
            </div></div>` + coachCardHTML();
        if (isT && !finished && window.appState.ciOpen) html += checkInHTML();
        html += `<div class="space-y-2">` + day.exercises.map((ex, i) => {
            const isRun = running && (S.exIdx === i || S.exIdx == null), planned = parseInt(ex.sets) || 0;
            const doneSets = setsThisWeekForDay(history[getExKey(currentWeekId, day.id, i, ex.name)] || [], day.id), extra = Math.max(0, doneSets - planned);
            const full = planned > 0 && doneSets >= planned, part = doneSets > 0 && !full;
            const plan = `${t('{n} sets', { n: planned })} · ${t(isTimed(ex.reps) ? '{r} sec' : '{r} reps', { r: `<span dir="ltr">${esc(fmtReps(ex.reps))}</span>` })}`;
            return `<button id="ex-card-${i}" data-on-click="window.appActions.openExSheet(@0)" data-a-click="${hArgs(i)}" class="w-full glass-card ex-card ${full ? 'is-full' : part ? 'is-part' : ''} flex items-center gap-3 text-start tap-feedback">
                    ${progressRing(doneSets, planned, i + 1)}
                    <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold mt-0.5 truncate ${full ? 'text-[#22c55e]' : 'text-slate-400'}">${full ? t('Done this week') : plan}</span></span>
                    <span class="flex items-center gap-1.5 shrink-0" dir="ltr">${extra ? `<span class="ex-pill-extra">+${extra}</span>` : ''}<span class="ex-pill" dir="auto">${t('{n} sets', { n: `<span dir="ltr">${doneSets}/${planned}</span>` })}</span></span>
                </button>`;
        }).join('') + `</div>`;
    }
    document.getElementById('workout-container').innerHTML = `<div class="${enterClass()}">${html}</div>`;
    if (window.lucide) window.lucide.createIcons();
    if (typeof todayHints === 'function' && !day.isRest && day.exercises.length && !S) todayHints();
};

// Contents of the "Edit exercise" pop-up (Plan tab), same look as the exercise pop-up on Today:
// change exercise on top, then sets and reps; delete is a small icon next to close so it isn't pressed by accident
const exEditHTML = (i, ex) => {
    const sets = parseInt(ex.sets) || 0, custom = !REPS_PRESETS.includes(ex.reps);
    const label = 'px-0.5 mb-1.5 text-[12px] font-bold text-slate-400';
    return `<div class="px-5 pt-2">
                <div class="text-[12px] font-bold text-[#d4af37]">${esc(tm(ex.muscle))}</div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-0.5 whitespace-nowrap overflow-hidden">${esc(tx(ex.name))}</h3>
                <button data-on-click="window.appActions.openPicker('replace', @0)" data-a-click="${hArgs(i)}" class="w-full mt-4 py-3 rounded-2xl bg-white/5 text-white text-[12px] font-bold tap-feedback flex items-center justify-center gap-2"><i data-lucide="replace" class="w-4 h-4 text-[#d4af37]"></i>${esc(t('Change exercise'))}</button>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button data-on-click="window.appActions.exEditSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums num">${sets || esc(ex.sets)}</div>
                    <button data-on-click="window.appActions.exEditSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(ex.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button data-on-click="window.appActions.exEditReps(@0)" data-a-click="${hArgs(hStr(r))}" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback ${ex.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}<button data-on-click="window.appState.customReps=true;window.appActions.refreshExEdit()" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback flex items-center justify-center gap-1 ${custom ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300 border border-dashed border-white/20'}" aria-label="${esc(t('Custom'))}">${custom ? esc(fmtReps(ex.reps)) : `<i data-lucide="plus" class="w-3.5 h-3.5"></i>${esc(t('Custom'))}`}</button></div>
                ${window.appState.customReps ? `<div class="flex gap-2 mt-2"><input id="exedit-custom" type="text" inputmode="text" value="${custom ? esc(ex.reps) : ''}" placeholder="${esc(t('Custom reps, e.g. 5 or 6 - 8'))}" data-on-keydown="if(event.key==='Enter')this.blur()" data-on-change="window.appState.customReps=false;window.appActions.exEditReps(this.value)" class="flex-1 min-w-0 bg-white/5 border border-[#d4af37]/60 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#d4af37]" dir="ltr"><button data-on-click="const v=document.getElementById('exedit-custom').value;window.appState.customReps=false;if(v.trim())window.appActions.exEditReps(v);else window.appActions.refreshExEdit()" class="shrink-0 px-4 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback"><i data-lucide="check" class="w-4 h-4"></i></button></div>` : ''}
                <button data-on-click="window.appActions.closeExEdit()" class="w-full mt-5 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${esc(t('Done'))}</button>
            </div>`;
};
// Re-draws the open "Edit exercise" pop-up (after a change, or after the exercise was changed in the picker)
const renderExEdit = () => {
    const i = window.appState.inlineEdit, day = getActiveSchedule().find(d => d.id === activeDay), ex = day && day.exercises[i];
    if (i === null || i === undefined || !ex) return;
    const c = document.getElementById('exedit-content');
    c.innerHTML = exEditHTML(i, ex);
    if (window.lucide) window.lucide.createIcons({ root: c });
    fitNames(c);
    const ci = document.getElementById('exedit-custom'); if (ci && document.activeElement !== ci) ci.focus();
};

// Re-draw whatever tab is open
// Drag & drop is only needed on Plan, so its file is downloaded the first time a Plan list can be dragged
// (not at start-up). When it arrives, Plan is drawn again with dragging switched on.
let sortableLoading = false;
const needSortable = () => {
    if (window.Sortable || sortableLoading) return;
    sortableLoading = true;
    const el = document.createElement('script'); el.src = 'vendor/sortable-1.15.7.min.js';
    el.onload = () => { if (window.appState.currentView === 'plan') renderWorkout(); };
    el.onerror = () => { sortableLoading = false; el.remove(); };
    document.head.appendChild(el);
};
const renderWorkout = () => {
    const v = window.appState.currentView;
    if (v === 'today') renderToday();
    else if (v === 'plan') { if (window.appState.planDay == null) renderPlanWeek(); else renderPlanDay(planBackBar(), false); }
    else if (v === 'progress') renderAnalytics();
};

// 🗓️ DAY EDITOR (Today ✏️ and Plan → a day): dashed gold day card with Day type and Same sets & reps for all,
// a dashed underline on the day name (tap to rename), and gold-edged exercise cards with a ⋮⋮ grip (drag); tap a card to edit it
// the app's one back button: a round button with ‹ (pages, Plan → This week, the setup)
const backBtn = (onclick, label = t('Go back'), cls = '') => `<button data-on-click="${onclick}" class="back-btn tap-feedback ${cls}" aria-label="${esc(label)}"><i data-lucide="chevron-left" class="rtl-flip"></i></button>`;
const planBackBar = () => `<div class="flex items-center gap-3 mb-3 ps-0.5">${backBtn('window.appActions.openPlanDay(null)', t('This week'))}<button data-on-click="window.appActions.openPlanDay(null)" class="text-[16px] font-black text-white tap-feedback py-2.5">${t('This week')}</button></div>`;
const renderPlanDay = (top = '', week = true) => {
    const schedule = getActiveSchedule(), day = schedule.find(d => d.id === activeDay), S = window.appState;
    const planned = day.exercises.reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
    const mins = Math.max(10, Math.round(planned * 2.5 / 5) * 5), hasEx = !day.isRest && day.exercises.length > 0;
    const pill = 'flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full border text-[12px] font-black whitespace-nowrap';
    const dayLabel = `<div class="text-[12px] font-bold text-[#d4af37]">${esc(dayLong(day.day))}</div>`;
    let html = `<div class="glass-card today-card plan-card">${week ? `<div id="today-week" class="today-week">${weekNavHTML()}</div>` : ''}<div class="today-body${week ? '' : ' no-week'}">
            ${!day.isRest
            ? `<div>${dayLabel}<input type="text" value="${esc(day.title === 'New Day' ? '' : t(day.title))}" placeholder="${esc(t('Name this day'))}" data-on-change="window.appActions.updateDayTitle(this.value)" aria-label="${esc(t('Name this day'))}" class="day-title-input w-full mt-0.5 pb-1 bg-transparent border-b-[1.5px] border-dashed border-white/25 focus:border-solid focus:border-[#d4af37] text-[21px] font-black text-white placeholder:text-slate-600 outline-none leading-tight transition-colors"></div>
                   <div class="text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: day.exercises.length })} · ${t('{n} sets', { n: planned })}${planned ? ` · ${t('~{n} min', { n: mins })}` : ''}</div>`
            : `<div>${dayLabel}<h2 class="text-[21px] font-black text-white leading-tight mt-0.5">${esc(day.recoveryType === 'active' ? t('Active Rest') : t('Complete Rest'))}</h2></div>
                   <div class="text-[12px] font-bold text-slate-400">${t('Recover well. See you next session.')}</div>`}
            <div class="flex flex-wrap gap-2" role="toolbar" aria-label="${esc(t('Day tools'))}">
                <div class="relative shrink-0 tap-feedback"><select data-on-change="window.appActions.updateDayType(this.value)" class="absolute inset-0 w-full h-full opacity-0 z-10" aria-label="${esc(t('Day type'))}"><option value="workout" ${!day.isRest ? 'selected' : ''}>${t('Workout')}</option><option value="active" ${day.isRest && day.recoveryType === 'active' ? 'selected' : ''}>${t('Active Rest')}</option><option value="complete" ${day.isRest && day.recoveryType === 'complete' ? 'selected' : ''}>${t('Complete Rest')}</option></select><div class="${pill} bg-white/5 border-white/10 text-slate-200">${t('Day type')}<i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></div></div>
                ${hasEx ? `<button data-on-click="window.appState.sameAll=!window.appState.sameAll;window.appActions.refreshUI()" class="${pill} shrink-0 tap-feedback ${S.sameAll ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'bg-white/5 border-white/10 text-slate-200'}" aria-pressed="${!!S.sameAll}"><i data-lucide="list-checks" class="w-4 h-4"></i>${t('Same sets & reps for all')}</button>` : ''}
            </div>
            ${hasEx && S.sameAll ? `<div class="flex items-center justify-between gap-2">
                <div class="text-[12px] font-bold text-slate-300 leading-tight min-w-0">${t('Same for all')}</div>
                <div class="flex items-center gap-2">
                    <input type="text" id="global-sets" placeholder="${t('Sets')}" class="w-[72px] placeholder:text-[12px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <input type="text" id="global-reps" placeholder="${t('Reps')}" class="w-[72px] placeholder:text-[12px] bg-black/40 text-white text-[14px] font-bold text-center rounded-lg py-2 border border-white/10 outline-none focus:border-[#d4af37]">
                    <button data-on-click="window.appActions.applyGlobalSetsReps()" class="bg-[#d4af37] text-black px-3 py-2 rounded-lg font-extrabold text-[12px] tap-feedback shadow-sm">${t('Apply')}</button>
                </div>
            </div>` : ''}
        </div></div>`;

    if (!day.isRest) {
        const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
        if (day.exercises.length) html += `<div class="px-1.5 mb-2 text-[12px] font-extrabold text-slate-400">${t(day.exercises.length > 1 ? 'Hold ⋮⋮ to move · swipe left to delete' : 'Swipe left to delete')}</div>`;
        // ⋮⋮ drags straight away (no waiting, no fight with scrolling); the rest of the card opens the editor
        // each card sits on a red "Delete" strip: swipe the card from right to left to delete the exercise
        html += `<div id="sortable-list" class="space-y-2">${day.exercises.map((ex, i) => `<div class="swipe-row" data-i="${i}"><div class="swipe-del" aria-hidden="true"><i data-lucide="trash-2" class="w-5 h-5"></i>${t('Delete')}</div><div class="swipe-fg glass-card plan-ex flex items-center gap-1.5">
                    <span class="handle w-9 h-11 shrink-0 flex items-center justify-center text-slate-400" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>
                    <button data-on-click="window.appActions.openExEdit(@0)" data-a-click="${hArgs(i)}" class="flex-1 min-w-0 flex items-center gap-2.5 text-start tap-feedback py-0.5">
                        <span class="plan-ex-n w-[26px] h-[26px] shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[12px] font-bold text-slate-300">${i + 1}</span>
                        <span class="flex-1 min-w-0"><span class="ex-name block text-[15px] font-black text-white leading-tight truncate">${esc(tx(ex.name))}</span><span class="block text-[12px] font-bold mt-0.5 truncate text-slate-400">${esc(tm(ex.muscle))}</span></span>
                        <span class="shrink-0 me-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37]" dir="ltr">${esc(ex.sets)} × ${esc(fmtReps(ex.reps))}</span>
                    </button>
                </div></div>`).join('')}</div>`;
        html += `<button data-on-click="window.appActions.openPicker('add')" class="w-full p-4 mt-2.5 mb-10 rounded-[20px] flex items-center justify-center gap-2 text-[#d4af37] font-bold text-[12px] tap-feedback border-[1.5px] border-dashed border-[#d4af37]/50 bg-[#d4af37]/5"><i data-lucide="plus" class="w-4 h-4"></i> ${t('Add Exercise')}</button>`;
    }

    document.getElementById('workout-container').innerHTML = `<div class="plan-scope ${enterClass('edit')}">${top}${html}</div>`;
    if (window.appState.sortableInstance) { window.appState.sortableInstance.destroy(); window.appState.sortableInstance = null; }
    const listEl = document.getElementById('sortable-list');
    if (listEl && day.exercises.length > 1) needSortable();
    if (listEl && day.exercises.length > 1 && window.Sortable) {
        window.appState.sortableInstance = new Sortable(listEl, {
            handle: '.handle', animation: 220, forceFallback: true, fallbackOnBody: true, fallbackTolerance: 3,
            scroll: document.querySelector('.scrollable-content'), scrollSensitivity: 50, scrollSpeed: 8, bubbleScroll: false,
            chosenClass: 'plan-chosen', ghostClass: 'plan-ghost', fallbackClass: 'plan-drag', dragClass: 'plan-drag',
            onStart: () => { try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} },
            onEnd: evt => {
                if (evt.oldIndex === evt.newIndex) return;
                const before = day.exercises.slice();
                const m = day.exercises.splice(evt.oldIndex, 1)[0]; day.exercises.splice(evt.newIndex, 0, m);
                StorageManager.setPlan(appData); renderWorkout();
                window.appActions.showToast(t('Order saved'), 'success', { label: t('Undo'), fn: () => { day.exercises = before; StorageManager.setPlan(appData); renderWorkout(); } });
            }
        });
    }
    if (window.lucide) window.lucide.createIcons();
    enableSwipeDelete(listEl);
    renderExEdit();
    if (typeof hint === 'function' && !day.isRest && day.exercises.length) {
        hint('plan-edit', '#sortable-list > div', t('Tap an exercise to edit it. Swipe it left to delete it. Hold ⋮⋮ and drag to change the order.'));
        if (hintSeen('plan-edit')) hint('plan-add', '#workout-container button[onclick*="openPicker(\'add\')"]', t('Add more exercises from the full library here.'));
    }
};

// 👈 SWIPE an exercise card from right to left (Plan → a day) to delete it; a short swipe springs back
const enableSwipeDelete = list => {
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
        if (del) { f.style.transform = 'translateX(-110%)'; try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} setTimeout(() => window.appActions.deleteEx(parseInt(r.dataset.i)), 200); }
        else { f.style.transform = ''; r.classList.remove('is-armed'); }
    };
    list.addEventListener('touchend', end); list.addEventListener('touchcancel', end);
    // the tap that ends a swipe doesn't open the exercise
    list.addEventListener('click', e => { if (list.dataset.swiped) { e.stopPropagation(); e.preventDefault(); } }, true);
};

// 🗓️ PLAN (whole week): one row per day (drag ⋮⋮ to move a day, tap to edit it), then the week's muscle balance.
// The weekdays stay put on the left; dragging moves the workout to another weekday.
const DAY_KEYS = ['title', 'isRest', 'recoveryType', 'savedTitle', 'exercises'];
const muscleBalanceHTML = schedule => {
    const sets = BALANCE.map(([g, ms, low]) => ({ g, low, n: schedule.reduce((a, d) => a + (d.isRest ? 0 : (d.exercises || []).filter(ex => ms.includes(ex.muscle)).reduce((b, ex) => b + (parseInt(ex.sets) || 0), 0)), 0) }));
    if (!sets.some(x => x.n)) return '';
    const top = Math.max(20, ...sets.map(x => x.n));
    return `<div class="glass-card p-4 mt-4">
            <div class="flex items-baseline justify-between mb-3"><span class="text-[12px] font-bold text-slate-400">${t('Muscle balance')}</span><span class="text-[12px] font-bold text-slate-400">${t('Sets per week')}</span></div>
            <div class="space-y-2.5">${sets.map(x => { const lo = x.n < x.low; return `<div class="flex items-center gap-3">
                <span class="w-[74px] shrink-0 text-[12px] font-bold ${lo ? 'text-orange-400' : 'text-slate-200'}">${esc(t(x.g))}</span>
                <span class="flex-1 h-2 rounded-full bg-white/10 overflow-hidden" dir="ltr"><span class="block h-full rounded-full ${lo ? 'bg-orange-400' : 'bg-[#d4af37]'}" style="width:${Math.max(x.n ? 4 : 0, Math.round(x.n / top * 100))}%"></span></span>
                <span class="w-[58px] shrink-0 text-end text-[12px] font-bold ${lo ? 'text-orange-400' : 'text-white'}"><span dir="ltr">${x.n}</span>${lo ? ` · ${t('Low')}` : ''}</span>
            </div>`; }).join('')}</div>
            <p class="text-[12px] font-bold text-slate-400 mt-3">${t('Aim for about 10–20 sets a week for each muscle.')}</p>
        </div>`;
};
const renderPlanWeek = () => {
    const schedule = getActiveSchedule(), today = getTodayId();
    const editing = !!window.appState.weekEdit; // the ✏️ next to Coach: days can be moved only while it's on
    const ws = getWeekStart(), dateOf = id => new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + id - 1);
    const grip = `<svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="4" r="1.8"/><circle cx="11" cy="4" r="1.8"/><circle cx="5" cy="10" r="1.8"/><circle cx="11" cy="10" r="1.8"/><circle cx="5" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/></svg>`;
    const dayOpts = id => schedule.filter(d => d.id !== id).map(d => `<option value="${d.id}">${esc(dayLong(d.day))}</option>`).join('');
    // ⋮ on a row: copy (the phone's own day list) and clear; moving a day is done by dragging ⋮⋮
    const mItem = 'relative w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-start text-[13px] font-extrabold tap-feedback';
    const daySelect = (fn, id, label) => `<select data-on-change="if(this.value){window.appState.weekMenu=null;window.appActions[@0](@1, parseInt(this.value));this.value='';}" data-a-change="${hArgs(fn, id)}" class="absolute inset-0 w-full h-full opacity-0 z-10" aria-label="${esc(label)}"><option value="">${esc(label)}</option>${dayOpts(id)}</select>`;
    const menu = d => window.appState.weekMenu !== d.id ? '' : `<div class="absolute end-1 top-full mt-1 z-[61] w-[230px] p-1.5 rounded-2xl bg-[#111] border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)]" role="menu">
                <div class="${mItem} text-slate-200" role="menuitem">${daySelect('copyDayFrom', d.id, t('Copy to another day'))}<i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>${t('Copy to another day')}</div>
                ${!d.isRest && (d.exercises || []).length ? `<button data-on-click="window.appState.weekMenu=null;window.appActions.clearDayFrom(@0)" data-a-click="${hArgs(d.id)}" class="${mItem} text-red-400" role="menuitem"><i data-lucide="trash-2" class="w-4 h-4"></i>${t('Clear this day')}</button>` : ''}
            </div>`;
    const row = d => {
        const empty = !d.isRest && !(d.exercises || []).length, n = (d.exercises || []).reduce((a, ex) => a + (parseInt(ex.sets) || 0), 0);
        const title = d.isRest ? t(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : empty ? t('Empty') : t(d.title);
        const meta = d.isRest ? '' : empty ? `<span class="text-[#d4af37]">＋ ${t('Add exercises')}</span>` : `${t('{n} exercises', { n: d.exercises.length })} · ${t('{n} sets', { n })}`;
        const open = window.appState.weekMenu === d.id;
        return `<div class="glass-card plan-ex plan-day ${d.isRest ? 'is-rest' : ''} ${d.id === today ? 'is-today' : ''} ${editing ? 'is-editing' : ''} h-[62px] flex items-center gap-1.5 relative ${open ? 'z-20' : ''}">
                ${editing ? `<span class="handle w-9 h-11 shrink-0 flex items-center justify-center" aria-label="${esc(t('Drag to reorder'))}" role="img">${grip}</span>` : ''}
                <button data-on-click="window.appActions.openPlanDay(@0)" data-a-click="${hArgs(d.id)}" class="flex-1 min-w-0 h-full flex items-center gap-2.5 text-start tap-feedback" aria-label="${esc(dayLong(d.day) + ' · ' + title)}">
                    ${d.isRest ? `<i data-lucide="${d.recoveryType === 'active' ? 'footprints' : 'moon'}" class="w-4 h-4 text-slate-400 shrink-0"></i>` : empty ? '<span class="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>' : ''}
                    <span class="flex-1 min-w-0"><span class="block text-[15px] font-black leading-tight truncate ${d.isRest || empty ? 'text-slate-400' : 'text-white'}">${esc(title)}</span>${meta ? `<span class="block text-[12px] font-bold text-slate-400 mt-0.5 truncate">${meta}</span>` : ''}</span>
                </button>
                <button data-on-click="window.appActions.toggleWeekMenu(@0)" data-a-click="${hArgs(d.id)}" class="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl tap-feedback ${open ? 'text-[#d4af37]' : 'text-slate-400'}" aria-haspopup="menu" aria-expanded="${open}" aria-label="${esc(t('Day options') + ' · ' + dayLong(d.day))}"><i data-lucide="ellipsis-vertical" class="w-[18px] h-[18px]"></i></button>
                ${menu(d)}
            </div>`;
    };
    let html = `<div class="flex items-center justify-between gap-2 px-1 mb-2.5">
                <span class="min-w-0"><span class="block text-[17px] font-black text-white">${t('This week')}</span><span class="block text-[12px] font-bold ${editing ? 'text-[#d4af37]' : 'text-slate-400'}">${t(editing ? 'Drag the days to move them' : 'Tap a day to edit it')}</span></span>
                <span class="shrink-0 flex items-center gap-2">
                    <button data-on-click="window.appActions.openAI()" class="coach-btn tap-feedback"><span class="coach-btn-ic" aria-hidden="true"><i data-lucide="sparkles"></i></span>${t('Coach')}</button>
                    <button data-on-click="window.appActions.toggleWeekEdit()" class="week-edit-btn ${editing ? 'is-on' : ''} tap-feedback" aria-pressed="${editing}" aria-label="${esc(t(editing ? 'Done' : 'Move days'))}">${editing ? `<i data-lucide="check"></i><span>${t('Done')}</span>` : '<i data-lucide="pencil"></i>'}</button>
                </span>
            </div>
            <div class="flex gap-2">
                <div class="w-11 shrink-0 flex flex-col gap-2" aria-hidden="true">${schedule.map(d => `<div class="h-[62px] flex flex-col items-center justify-center rounded-2xl ${d.id === today ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'text-slate-400'}"><span class="text-[12px] font-bold">${esc(dayShort(d.day))}</span><span class="text-[16px] font-black leading-tight ${d.id === today ? '' : 'text-white'}">${dateOf(d.id).getDate()}</span></div>`).join('')}</div>
                <div id="week-list" class="flex-1 min-w-0 flex flex-col gap-2">${schedule.map(row).join('')}</div>
            </div>
            ${muscleBalanceHTML(schedule)}
            <div class="h-10"></div>`;
    document.getElementById('workout-container').innerHTML = `<div class="plan-scope ${editing ? 'is-editing' : ''} ${enterClass('week')}">${html}</div>`;
    if (window.appState.sortableInstance) { window.appState.sortableInstance.destroy(); window.appState.sortableInstance = null; }
    const listEl = document.getElementById('week-list');
    if (listEl && editing) needSortable();
    if (listEl && window.Sortable && editing) {
        window.appState.sortableInstance = new Sortable(listEl, {
            handle: '.handle', animation: 220, forceFallback: true, fallbackOnBody: true, fallbackTolerance: 3,
            scroll: document.querySelector('.scrollable-content'), scrollSensitivity: 50, scrollSpeed: 8, bubbleScroll: false,
            chosenClass: 'plan-chosen', ghostClass: 'plan-ghost', fallbackClass: 'plan-drag', dragClass: 'plan-drag',
            onStart: () => { try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {} },
            onEnd: evt => {
                if (evt.oldIndex === evt.newIndex) return;
                // the weekdays stay; the workouts move between them
                const take = () => schedule.map(d => { const o = {}; DAY_KEYS.forEach(k => { o[k] = d[k]; }); return o; });
                const before = take(), next = take();
                next.splice(evt.newIndex, 0, next.splice(evt.oldIndex, 1)[0]);
                schedule.forEach((d, i) => Object.assign(d, next[i]));
                StorageManager.setPlan(appData); renderNav(); renderWorkout();
                window.appActions.showToast(t('Week order saved'), 'success', { label: t('Undo'), fn: () => { schedule.forEach((d, i) => Object.assign(d, before[i])); StorageManager.setPlan(appData); renderNav(); renderWorkout(); } });
            }
        });
    }
    if (window.lucide) window.lucide.createIcons();
    if (typeof hint === 'function') hint('plan-week', '#week-list > div', t('Tap a day to edit it. Tap ✏️ next to Coach to move days.'));
};

// Apex Lift app (index.html), part 3 of 13: Screen drawing: the tabs, the routine list and the Progress tab.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see app/README in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🎨 4. CORE UI RENDERING
// Plan tab: your routines as one folding card (shows the active routine; tap to see and manage all of them)
const renderSidePanel = () => {
    const active = appData.weeks.find(w => w.id === currentWeekId) || appData.weeks[0], open = !!window.appState.routinesOpen, inDay = window.appState.planDay != null;
    // each routine: its name (tap to rename) and one ⋮ button with Use / Share / Duplicate / Delete
    const mItem = 'w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-start text-[13px] font-extrabold tap-feedback';
    const rMenu = w => window.appState.routineMenu !== w.id ? '' : `<div class="absolute end-2 top-full mt-1 z-[61] w-[220px] p-1.5 rounded-2xl bg-[#111] border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.7)]" role="menu">
                <button onclick="window.appState.routineMenu=null;window.appActions.editRoutineName(${jsArg(w.id)})" class="${mItem} text-white" role="menuitem"><i data-lucide="pencil" class="w-4 h-4 text-slate-400"></i>${t('Rename routine')}</button>
                <button onclick="window.appState.routineMenu=null;window.appActions.shareWeek(${jsArg(w.id)})" class="${mItem} text-slate-200" role="menuitem"><i data-lucide="share-2" class="w-4 h-4 text-[#d4af37]"></i>${t('Share routine')}</button>
                <button onclick="window.appState.routineMenu=null;window.appActions.duplicateWeek(${jsArg(w.id)})" class="${mItem} text-slate-200" role="menuitem"><i data-lucide="copy" class="w-4 h-4 text-slate-400"></i>${t('Duplicate routine')}</button>
                ${appData.weeks.length > 1 ? `<button onclick="window.appState.routineMenu=null;window.appActions.deleteWeek(${jsArg(w.id)})" class="${mItem} text-red-400" role="menuitem"><i data-lucide="trash-2" class="w-4 h-4"></i>${t('Delete routine')}</button>` : ''}
            </div>`;
    const row = w => { const on = window.appState.routineMenu === w.id, cur = w.id === currentWeekId; return `<div class="relative ${on ? 'z-20' : ''} flex items-center gap-1 bg-black/40 pe-1 rounded-xl border ${cur?'border-[#d4af37]/50 shadow-[0_0_10px_rgba(212,175,55,0.1)]':'border-white/5'} transition-all"><button onclick="window.appActions.switchWeek(${jsArg(w.id)})" class="flex-1 min-w-0 min-h-[52px] ps-3 flex items-center gap-3 text-start tap-feedback" aria-pressed="${cur}"><span class="flex-1 min-w-0 text-white text-[13px] font-bold truncate">${esc(t(w.name))}</span>${cur?`<span class="text-[#22c55e] text-[12px] font-bold shrink-0">${t('Active')}</span>`:''}</button><button onclick="window.appActions.toggleRoutineMenu(${jsArg(w.id)})" class="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg tap-feedback ${on ? 'text-[#d4af37]' : 'text-slate-300'}" aria-haspopup="menu" aria-expanded="${on}" aria-label="${esc(t('Routine options') + ' · ' + w.name)}"><i data-lucide="ellipsis-vertical" class="w-[18px] h-[18px]"></i></button>${rMenu(w)}</div>`; };
    document.getElementById('weeks-container').innerHTML = inDay ? '' : `<div class="glass-card ${open ? 'border border-[#d4af37]/30' : ''} ${window.appState.routineMenu != null ? 'relative z-30' : ''}">
            <button onclick="window.appActions.toggleRoutines()" class="w-full p-4 flex items-center gap-3 text-start tap-feedback" aria-expanded="${open}">
                <span class="w-10 h-10 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0"><i data-lucide="calendar-range" class="w-5 h-5"></i></span>
                <span class="flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400">${t('My routines')}</span><span class="block text-[15px] font-black text-white truncate">${esc(t(active.name))}</span></span>
                <span class="shrink-0 text-[12px] font-bold text-slate-400" dir="ltr">${appData.weeks.length}</span>
                <i data-lucide="chevron-down" class="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}"></i>
            </button>
            ${open ? `<div class="px-4 pb-4 space-y-2.5">${appData.weeks.map(row).join('')}
                <button onclick="window.appActions.addWeek()" class="w-full py-3 flex items-center justify-center gap-2 text-[#d4af37] font-bold text-[12px] tap-feedback border border-dashed border-[#d4af37]/40 bg-[#d4af37]/5 rounded-xl"><i data-lucide="plus" class="w-4 h-4 shrink-0"></i>${t('New routine')}</button>
            </div>` : ''}
        </div>`;
    document.getElementById('active-week-label').innerText = t(active.name);
    if(window.lucide) window.lucide.createIcons();
};

// Week bar: the week's dates and how many workouts are done, then one bar with the 7 days
// (weekday, date, short workout name). Selected = gold pill, today = gold dot, done = green date (Today tab), red dot = empty day (Plan tab).
// Plan is for building workouts, so it doesn't show what was done
const weekNavHTML = () => {
    const schedule = getActiveSchedule(), history = StorageManager.getHistory(), today = getTodayId(), view = window.appState.currentView;
    const ws = getWeekStart(), dateOf = id => new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + id - 1);
    const doneOf = d => view !== 'plan' && !d.isRest && (d.exercises || []).length > 0 && isDayCompleted(d, history);
    const train = schedule.filter(d => !d.isRest && (d.exercises || []).length), doneN = train.filter(doneOf).length;
    const head = `<div class="wk-head"><span class="wk-head-t">${t('Week of {range}', { range: `<span dir="ltr">${esc(fmtDayMonth(dateOf(1)))} – ${esc(fmtDayMonth(dateOf(7)))}</span>` })}</span>${view === 'plan' ? `<span class="wk-head-s">${t('{n} workouts', { n: train.length })}</span>` : `<span class="wk-head-s">${t('{a} of {b} workouts done', { a: doneN, b: train.length })}</span>`}</div>
            ${view === 'plan' ? '' : `<div class="wk-bar">${schedule.map(d => `<i class="${d.isRest ? 'is-rest' : doneOf(d) ? 'is-on' : ''}"></i>`).join('')}</div>`}`;
    const cells = schedule.map(d => {
        const sel = activeDay === d.id, comp = doneOf(d), empty = isDayIncomplete(d), isT = today === d.id;
        const name = d.isRest ? shortTitle(d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : shortTitle(d.title);
        const mark = empty && view === 'plan' ? '<span class="wk-dot is-empty"></span>' : isT ? '<span class="wk-dot"></span>' : '';
        return `<button onclick="window.appActions.setActiveDay(${d.id})" class="wk-day tap-feedback ${sel ? 'is-sel' : ''} ${d.isRest ? 'is-rest' : ''} ${comp ? 'is-done' : ''}" aria-pressed="${sel}" aria-label="${esc(dayLong(d.day) + ' ' + dateOf(d.id).getDate() + ' · ' + (d.isRest ? name : t(d.title)) + (comp ? ' · ' + t('Done') : ''))}"><span class="wk-wd">${esc(dayShort(d.day))}</span><span class="wk-dt">${dateOf(d.id).getDate()}</span><span class="wk-wo">${esc(empty ? '—' : name)}</span><span class="wk-mk">${mark}</span></button>`;
    });
    return head + `<div class="wk-strip">${cells.join('')}</div>`;
};
// Today and Plan: the week bar at the top of the day card (#today-week)
const renderNav = () => {
    const html = weekNavHTML();
    document.getElementById('nav-container').innerHTML = html;
    const tw = document.getElementById('today-week'); if (tw) tw.innerHTML = html;
    renderSidePanel();
};

// 📈 PROGRESS HELPERS
// Muscle groups shared by the Edit tab (muscle balance) and the Progress tab (Volume), so both always agree.
// [group, muscles in it, fewest sets a week before it shows "Low"]
const BALANCE = [['Chest', ['Chest', 'Upper Chest', 'Lower Chest'], 8], ['Back', ['Back', 'Lats', 'Traps', 'Lower Back'], 8], ['Legs', ['Quads', 'Hamstrings', 'Glutes', 'Calves', 'Adductors', 'Abductors'], 8], ['Shoulders', ['Shoulders', 'Front Delts', 'Side Delts', 'Rear Delts'], 6], ['Arms', ['Biceps', 'Triceps', 'Forearms'], 6], ['Core', ['Abs'], 3]];
const groupOf = muscle => { const g = BALANCE.find(([, ms]) => ms.includes((muscle || '').trim())); return g ? g[0] : null; };
const DAY_MS = 86400000;
const round1 = x => Math.round(x * 10) / 10;
const fmtKg = v => v >= 10000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toLocaleString('en-US');
// Name of an exercise from its storage key (routines, built-in list, your own exercises)
const exerciseNameMap = () => {
    const m = {};
    catalogue().forEach(x => { m[getExKey('', '', '', x.name)] = { name: x.name, muscle: x.muscle }; });
    appData.weeks.forEach(w => w.schedule.forEach(d => (d.exercises || []).forEach(e => { m[getExKey('', '', '', e.name)] = { name: e.name, muscle: e.muscle }; })));
    return m;
};
const nameOfKey = (k, map) => (map[k] && map[k].name) || k.replace(/^global_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
// Every training day: sets, kg lifted and exercises (from all history)
const workoutDays = history => {
    const map = {};
    Object.keys(history).forEach(k => (history[k] || []).forEach(l => {
        const t0 = logTime(l); if (isNaN(t0)) return;
        const d = startOfDay(t0), m = map[d] = map[d] || { sets: 0, volume: 0, ex: new Set() };
        const det = logSetDetails(l);
        m.sets += det.length; m.ex.add(k);
        if (l.u !== 's') m.volume += det.reduce((a, x) => a + x.w * x.r, 0);
    }));
    return map;
};
// Streak: weeks in a row with at least one workout (this week counts once you've trained)
const weekStreak = dayKeys => {
    const wkD = getWeekStart(), weekAgo = n => new Date(wkD.getFullYear(), wkD.getMonth(), wkD.getDate() - 7 * n).getTime();
    let streak = 0, n = dayKeys.some(d => d >= wkD.getTime()) ? 0 : 1;
    while (dayKeys.some(d => d >= weekAgo(n) && d < weekAgo(n - 1))) { streak++; n++; }
    return streak;
};
// Estimated 1-rep max of one set (Epley); only sets of 12 reps or fewer are close enough to count
const e1rmOf = x => x.w > 0 && x.r > 0 && x.r <= 12 ? x.w * (1 + x.r / 30) : 0;
// One point per training day for an exercise: heaviest weight, most reps/seconds and best estimated 1-rep max
const exerciseSessions = hA => {
    const byDay = {};
    (hA || []).forEach(l => { const t0 = logTime(l); if (isNaN(t0)) return; const d = startOfDay(t0); (byDay[d] = byDay[d] || []).push(...logSetDetails(l)); });
    return Object.keys(byDay).map(Number).sort((a, b) => a - b).map(d => {
        const sets = byDay[d], topW = Math.max(0, ...sets.map(x => x.w));
        return { t: d, w: topW, r: Math.max(0, ...sets.map(x => x.r)), e1: Math.max(0, ...sets.map(e1rmOf)), sets };
    }).filter(x => x.sets.length);
};
// Personal records: a session that beats every session before it.
// With weight: heavier ('w'), or else a higher estimated 1-rep max ('e1', e.g. more reps with a heavy weight).
// Without weight: more reps, or a longer hold for timed exercises ('r').
const recordsOf = hA => {
    const timed = (hA || []).some(l => l.u === 's'), out = [];
    let bw = 0, be = 0, br = 0;
    exerciseSessions(hA).forEach(s => {
        const e1 = timed ? 0 : s.e1;
        if (s.w > 0) {
            if (bw > 0 && s.w > bw) out.push({ t: s.t, type: 'w', v: s.w, plus: round1(s.w - bw), unit: 'kg' });
            else if (be > 0 && Math.round(e1 - be) >= 1) out.push({ t: s.t, type: 'e1', v: Math.round(e1), plus: Math.round(e1 - be), unit: 'kg' });
        } else if (!bw && br > 0 && s.r > br) out.push({ t: s.t, type: 'r', v: s.r, plus: s.r - br, unit: timed ? 's' : '' });
        bw = Math.max(bw, s.w); be = Math.max(be, e1); br = Math.max(br, s.r);
    });
    return out;
};
const RECORD_LABEL = { w: 'Heaviest weight', e1: 'Stronger (est. 1-rep max)', r: 'Most reps' };
// Up / same / down: your latest session against the one 3 sessions earlier (or the first, if fewer)
const trendOf = ses => {
    if (ses.length < 2) return null;
    const weighted = ses.some(s => s.w > 0), val = s => weighted ? (s.e1 || s.w) : s.r;
    const a = val(ses[Math.max(0, ses.length - 4)]), b = val(ses[ses.length - 1]);
    return b > a ? 'up' : b < a ? 'down' : 'same';
};
const TREND = {
    up:   { i: 'trending-up',   c: 'text-[#22c55e]',  l: 'Improving' },
    same: { i: 'minus',         c: 'text-slate-400',  l: 'Holding steady' },
    down: { i: 'trending-down', c: 'text-orange-400', l: 'Dropping' }
};
const niceStep = raw => { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const n = (raw || 1) / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
// Single-series line chart (inline SVG): 2px gold line, soft area, dots with a surface ring,
// hairline grid, value at the end; tap/hover shows a crosshair and the value.
const lineChartHTML = (pts, unit) => {
    const W = 320, H = 150, pl = 34, pr = 40, pt = 12, pb = 22;
    const vs = pts.map(p => p.v);
    let lo = Math.min(...vs), hi = Math.max(...vs);
    const step = niceStep(((hi - lo) || Math.max(1, hi * 0.1)) / 3);
    lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step; if (hi === lo) hi = lo + step;
    const x = i => pl + (pts.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (pts.length - 1));
    const y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));
    let grid = '';
    for (let v = lo; v <= hi + 1e-9; v += step) grid += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="#262626" stroke-width="1"/><text x="${pl - 6}" y="${y(v) + 3}" text-anchor="end" font-size="12" fill="#94a3b8" font-weight="600">${Math.round(v * 10) / 10}</text>`;
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
    const area = `${line} L${x(pts.length - 1).toFixed(1)},${H - pb} L${x(0).toFixed(1)},${H - pb} Z`;
    const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4" fill="#d4af37" stroke="#111111" stroke-width="2"/>`).join('');
    const last = pts[pts.length - 1];
    const data = esc(JSON.stringify(pts.map((p, i) => ({ x: x(i), y: y(p.v), v: p.v, d: fmtDayMonth(new Date(p.t)) }))));
    return `<div class="chart-wrap relative select-none" data-pts="${data}" data-unit="${esc(unit)}" dir="ltr">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block touch-none" role="img" aria-label="${esc(t('Progress chart'))}">
                ${grid}
                <path d="${area}" fill="#d4af37" fill-opacity="0.1"/>
                <path d="${line}" fill="none" stroke="#d4af37" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
                ${dots}
                <text x="${x(pts.length - 1) + 7}" y="${y(last.v) + 3}" font-size="14" fill="#e2e8f0" font-weight="700" font-family="Barlow Condensed, Inter, sans-serif">${last.v}${esc(unit)}</text>
                <text x="${pl}" y="${H - 6}" font-size="12" fill="#94a3b8" font-weight="600">${esc(fmtDayMonth(new Date(pts[0].t)))}</text>
                <text x="${W - pr}" y="${H - 6}" text-anchor="end" font-size="12" fill="#94a3b8" font-weight="600">${esc(fmtDayMonth(new Date(last.t)))}</text>
                <line class="chart-cross" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#94a3b8" stroke-width="1" visibility="hidden"/>
                <circle class="chart-hot" r="6" fill="#d4af37" stroke="#111111" stroke-width="2" visibility="hidden"/>
            </svg>
            <div class="chart-tip hidden absolute -top-2 px-2 py-1 rounded-lg bg-black border border-white/15 text-[12px] font-bold text-white whitespace-nowrap pointer-events-none"></div>
        </div>`;
};
// Weekly bar chart (inline SVG): one gold bar per week, this week full gold, older weeks softer.
// Only this week's value is written on the chart; tap a bar to see its week and value.
const barChartHTML = bars => {
    const W = 320, H = 130, pl = 6, pr = 6, pt = 18, pb = 20, slot = (W - pl - pr) / bars.length, bw = Math.min(26, slot - 8);
    const hi = Math.max(1, ...bars.map(b => b.v)), y = v => pt + (H - pt - pb) * (1 - v / hi);
    let marks = '';
    bars.forEach((b, i) => {
        const cx = pl + slot * (i + 0.5), top = y(b.v), h = H - pb - top, last = i === bars.length - 1;
        const rr = Math.min(4, h); // 4px rounded top, flat on the baseline
        if (b.v > 0) marks += `<path d="M${cx - bw / 2},${H - pb} V${top + rr} q0,-${rr} ${rr},-${rr} h${bw - 2 * rr} q${rr},0 ${rr},${rr} V${H - pb} Z" fill="#d4af37" fill-opacity="${last ? 1 : 0.45}"/>`;
        if (last) marks += `<text x="${cx}" y="${top - 5}" text-anchor="middle" font-size="14" fill="#e2e8f0" font-weight="700" font-family="Barlow Condensed, Inter, sans-serif">${b.v}</text>`;
        if (i === 0 || last) marks += `<text x="${i === 0 && !last ? pl : last ? W - pr : cx}" y="${H - 5}" text-anchor="${i === 0 && !last ? 'start' : 'end'}" font-size="12" fill="#94a3b8" font-weight="600">${esc(b.label)}</text>`;
    });
    const data = esc(JSON.stringify(bars.map((b, i) => ({ x: pl + slot * (i + 0.5), y: y(b.v), v: b.v, d: b.tip }))));
    return `<div class="chart-wrap relative select-none" data-pts="${data}" data-unit="${esc(' ' + t('sets'))}" dir="ltr">
            <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto block touch-none" role="img" aria-label="${esc(t('Sets per week'))}">
                <line x1="${pl}" x2="${W - pr}" y1="${H - pb}" y2="${H - pb}" stroke="#262626" stroke-width="1"/>
                ${marks}
                <line class="chart-cross" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#94a3b8" stroke-width="1" visibility="hidden"/>
                <circle class="chart-hot" r="0" visibility="hidden"/>
            </svg>
            <div class="chart-tip hidden absolute -top-2 px-2 py-1 rounded-lg bg-black border border-white/15 text-[12px] font-bold text-white whitespace-nowrap pointer-events-none"></div>
        </div>`;
};
// Crosshair + tooltip for the charts inside an element
const bindCharts = root => root.querySelectorAll('.chart-wrap').forEach(wrap => {
    const pts = JSON.parse(wrap.dataset.pts), unit = wrap.dataset.unit, svg = wrap.querySelector('svg');
    const cross = svg.querySelector('.chart-cross'), hot = svg.querySelector('.chart-hot'), tip = wrap.querySelector('.chart-tip');
    const show = e => {
        const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * 320;
        const p = pts.reduce((a, b) => Math.abs(b.x - vx) < Math.abs(a.x - vx) ? b : a);
        cross.setAttribute('x1', p.x); cross.setAttribute('x2', p.x); cross.setAttribute('visibility', 'visible');
        hot.setAttribute('cx', p.x); hot.setAttribute('cy', p.y); hot.setAttribute('visibility', 'visible');
        tip.textContent = `${p.d} · ${p.v}${unit}`; tip.classList.remove('hidden');
        tip.style.left = `${Math.min(Math.max(p.x / 320 * r.width - tip.offsetWidth / 2, 0), r.width - tip.offsetWidth)}px`;
    };
    svg.addEventListener('pointermove', show); svg.addEventListener('pointerdown', show);
    svg.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); hot.setAttribute('visibility', 'hidden'); tip.classList.add('hidden'); });
});
// Stats + chart shown at the top of an exercise's history
const exerciseStatsHTML = hA => {
    const ses = exerciseSessions(hA); if (!ses.length) return '';
    const weighted = ses.some(s => s.w > 0), timed = (hA || []).some(l => l.u === 's');
    const all = ses.flatMap(s => s.sets);
    const best = weighted ? Math.max(...all.map(x => x.w)) : Math.max(...all.map(x => x.r));
    const e1rm = weighted && !timed ? Math.max(0, ...all.map(e1rmOf)) : 0;
    const tile = (v, l) => `<div class="bg-white/5 rounded-xl py-2.5 text-center"><div class="text-[17px] font-black text-white" dir="ltr">${v}</div><div class="text-[12px] font-bold text-slate-400">${l}</div></div>`;
    const unit = weighted ? 'kg' : timed ? 's' : '';
    const pts = ses.slice(-12).map(s => ({ t: s.t, v: weighted ? s.w : s.r }));
    return `<div class="grid grid-cols-3 gap-2 mb-3">${tile(`${best}${unit}`, weighted ? t('Best weight') : timed ? t('Best time') : t('Best reps'))}${tile(e1rm ? `${Math.round(e1rm)}kg` : '—', t('Est. 1-rep max'))}${tile(ses.length, t('Sessions'))}</div>`
        + (pts.length >= 2 ? `<div class="bg-white/5 rounded-2xl p-3 mb-4"><div class="text-[12px] font-bold text-slate-400 mb-2">${weighted ? t('Heaviest weight per session') : timed ? t('Longest set per session') : t('Most reps per session')}</div>${lineChartHTML(pts, unit)}</div>` : '');
};

// Shared pieces of the Progress tab
const pCard = (title, body, extra = '') => `<div class="glass-card p-4 mb-3 ${extra}">${title ? `<div class="text-[13px] font-bold text-white mb-3">${title}</div>` : ''}${body}</div>`;
const pEmpty = (icon, title, text, extra = '') => `<div class="glass-card p-8 text-center"><div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="${icon}" class="w-6 h-6 text-[#d4af37]"></i></div><div class="text-[15px] font-black text-white mb-2">${title}</div><p class="text-[12px] text-slate-400 font-bold leading-relaxed">${text}</p>${extra}</div>`;
// "+12% vs last week" under a number (green up, orange down)
const changeHTML = (now, before) => {
    if (!(before > 0)) return `<div class="text-[12px] font-bold text-slate-400 mt-1.5">${t('No data last week')}</div>`;
    const pct = Math.round((now - before) / before * 100), c = pct > 0 ? TREND.up : pct < 0 ? TREND.down : TREND.same;
    return `<div class="flex flex-wrap items-center gap-x-1 text-[12px] font-bold mt-1.5 ${c.c}"><i data-lucide="${c.i}" class="w-3.5 h-3.5 shrink-0"></i><span dir="ltr">${pct > 0 ? '+' : ''}${pct}%</span><span class="text-slate-400 font-bold">${t('vs last week')}</span></div>`;
};

// Overview: this week against the same days last week, 8 weeks of sets, the 5-week calendar, recent records
const progressOverviewHTML = history => {
    const days = workoutDays(history), dayKeys = Object.keys(days).map(Number);
    if (!dayKeys.length) return pEmpty('calendar-check', t('No workouts yet'), t('Finish your first workout to see your progress here.'), `<button onclick="window.appActions.switchTab('today')" class="mt-5 h-12 px-5 rounded-2xl bg-[#d4af37] text-black text-[14px] font-extrabold tap-feedback inline-flex items-center gap-2"><i data-lucide="play" class="w-4 h-4 fill-current"></i>${t("Go to today's workout")}</button>`);
    const wkD = getWeekStart(), wk = wkD.getTime(), today = startOfDay(Date.now());
    const weekAgo = n => new Date(wkD.getFullYear(), wkD.getMonth(), wkD.getDate() - 7 * n).getTime();
    // last week only up to the same weekday as today, so a Tuesday is never compared with a whole week
    const nowD = new Date(today), sameDayLastWeek = new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate() - 7).getTime();
    const sum = (from, to, f) => dayKeys.filter(d => d >= from && d <= to).reduce((a, d) => a + f(days[d]), 0);
    const inWeek = dayKeys.filter(d => d >= wk);
    const setsNow = sum(wk, today, x => x.sets), setsBefore = sum(weekAgo(1), sameDayLastWeek, x => x.sets);
    const volNow = sum(wk, today, x => x.volume), volBefore = sum(weekAgo(1), sameDayLastWeek, x => x.volume);
    const plannedDays = getActiveSchedule().filter(d => !d.isRest && (d.exercises || []).length).length;
    const streak = weekStreak(dayKeys);
    const tile = (icon, label, value, sub) => `<div class="glass-card p-4 min-w-0"><div class="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mb-1.5"><i data-lucide="${icon}" class="w-4 h-4 text-[#d4af37] shrink-0"></i><span class="truncate">${label}</span></div><div class="text-[26px] font-black text-white leading-none num" dir="ltr">${value}</div>${sub}</div>`;
    const plain = s => `<div class="text-[12px] font-bold text-slate-400 mt-1.5 truncate">${s}</div>`;
    let html = `<div class="text-[12px] font-bold text-slate-400 mb-2 px-1">${t('This week')}</div>
            <div class="grid grid-cols-2 gap-2.5 mb-3">
                ${tile('calendar-check', t('Workouts'), plannedDays ? `${inWeek.length}<span class="text-[15px] text-slate-400"> / ${plannedDays}</span>` : inWeek.length, plain(plannedDays ? t('{n} planned', { n: plannedDays }) : '&nbsp;'))}
                ${tile('flame', t('Week streak'), streak, plain(t('Weeks in a row')))}
                ${tile('layers', t('Sets'), setsNow, changeHTML(setsNow, setsBefore))}
                ${tile('weight', t('kg lifted'), fmtKg(volNow), changeHTML(volNow, volBefore))}
            </div>
            <p class="text-[12px] font-bold text-slate-400 mb-4 px-1">${t('Compared with the same days last week.')}</p>`;
    // 8 weeks of sets
    const bars = [];
    for (let i = 7; i >= 0; i--) {
        const from = weekAgo(i), to = weekAgo(i - 1) - 1, v = sum(from, to, x => x.sets);
        bars.push({ v, label: i ? fmtDayMonth(new Date(from)) : t('This week'), tip: i ? t('Week of {d}', { d: fmtDayMonth(new Date(from)) }) : t('This week') });
    }
    html += pCard(t('Sets per week'), `${barChartHTML(bars)}<p class="text-[12px] font-bold text-slate-400 mt-2">${t('Tap a bar to see that week.')}</p>`);
    // calendar: 5 weeks, gold = trained (darker = more sets)
    const start = weekAgo(4), startIdx = DAY_NAMES.indexOf(StorageManager.getStartDay());
    let cells = '';
    for (let i = 0; i < 35; i++) {
        const d = startOfDay(start + i * DAY_MS + 3600000), info = days[d], future = d > today;
        const lvl = info ? (info.sets >= 20 ? 1 : info.sets >= 10 ? 0.7 : 0.4) : 0;
        const label = `${fmtDate(d, false)} · ${info ? t('{n} sets', { n: info.sets }) : t('Rest')}`;
        cells += `<button onclick="document.getElementById('cal-info').textContent=${esc(JSON.stringify(label))}" class="aspect-square rounded-lg tap-feedback ${d === today ? 'ring-2 ring-white/70' : ''} ${future ? 'opacity-30' : ''}" style="background:${info ? `rgba(212,175,55,${lvl})` : 'rgba(128,128,128,0.14)'}" aria-label="${esc(label)}" title="${esc(label)}"></button>`;
    }
    html += pCard(t('Last 5 weeks'), `<div class="grid grid-cols-7 gap-1.5 mb-1.5">${DAY_NAMES.map((_, i) => `<div class="text-center text-[12px] font-bold text-slate-400 truncate">${esc(dayShort(DAY_NAMES[(startIdx + i) % 7]))}</div>`).join('')}</div>
            <div class="grid grid-cols-7 gap-1.5" dir="ltr">${cells}</div>
            <div id="cal-info" class="text-[12px] font-bold text-slate-400 mt-3 min-h-[16px]">${t('Tap a day for details.')}</div>`);
    // recent records
    const map = exerciseNameMap(), recs = [];
    Object.keys(history).forEach(k => recordsOf(history[k]).forEach(r => recs.push({ ...r, k })));
    recs.sort((a, b) => b.t - a.t);
    const recent = recs.filter(r => r.t >= today - 30 * DAY_MS).slice(0, 6);
    html += pCard(`🏆 ${t('Records (last 30 days)')}`, recent.length ? recent.map(r => `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(nameOfKey(r.k, map))})" class="w-full flex items-center justify-between gap-2 py-2.5 border-b border-white/5 last:border-0 text-start tap-feedback">
                <span class="min-w-0"><span class="ex-name block text-[14px] font-black text-white truncate">${esc(tx(nameOfKey(r.k, map)))}</span><span class="block text-[12px] font-bold text-slate-400 truncate">${esc(r.type === 'r' && r.unit === 's' ? t('Longest hold') : t(RECORD_LABEL[r.type]))} · ${esc(fmtDate(r.t, false))}</span></span>
                <span class="text-[14px] font-black text-[#22c55e] shrink-0" dir="ltr">${r.v}${r.unit} <span class="text-[12px]">(+${r.plus})</span></span></button>`).join('')
        : `<p class="text-[12px] font-bold text-slate-400">${t('No new records yet. Add weight when the app says so and they will come.')}</p>`);
    return html;
};

// Exercises: search, filter chips, and one row per exercise with its trend and what to do next time
const PEX_FILTERS = [['all', 'All'], ['up', 'Ready to add weight'], ...BALANCE.map(([g]) => [g, g])];
const progressExerciseRows = history => {
    const map = exerciseNameMap(), plan = {};
    getActiveSchedule().forEach(d => (d.exercises || []).forEach(ex => { const k = getExKey('', '', '', ex.name); if (!plan[k]) plan[k] = ex; }));
    return Object.keys(history).map(k => {
        const ses = exerciseSessions(history[k]); if (!ses.length) return null;
        const last = ses[ses.length - 1], weighted = ses.some(s => s.w > 0), timed = (history[k] || []).some(l => l.u === 's');
        const muscle = (map[k] || {}).muscle || (plan[k] || {}).muscle || '';
        // next time: the same rule as the workout cards, from your latest session (today included)
        const sg = plan[k] ? suggestionFor(history[k], plan[k], false, false) : null;
        return { k, name: nameOfKey(k, map), muscle, group: groupOf(muscle), last: last.t, n: ses.length, trend: trendOf(ses), sg, timed,
            best: weighted ? `${Math.max(...ses.map(s => s.w))}kg` : `${Math.max(...ses.map(s => s.r))}${timed ? 's' : ''}` };
    }).filter(Boolean).sort((a, b) => b.last - a.last);
};
const progressExerciseListHTML = rows => {
    const q = (window.appState.pexQ || '').trim().toLowerCase(), f = window.appState.pexF || 'all';
    const shown = rows.filter(r => (!q || r.name.toLowerCase().includes(q) || tx(r.name).includes(q) || tm(r.muscle).toLowerCase().includes(q))
        && (f === 'all' || (f === 'up' ? r.sg && r.sg.type === 'up' : r.group === f)));
    if (!shown.length) return `<div class="glass-card p-6 text-center text-[13px] font-bold text-slate-400">${t('No exercises match.')}</div>`;
    return `<div class="text-[12px] font-bold text-slate-400 mb-2 px-1">${t('{n} exercises', { n: shown.length })}</div>` + shown.map(r => {
        const tr = r.trend && TREND[r.trend];
        return `<button onclick="window.appActions.openHistoryModal(${jsArg(r.k)},${jsArg(r.name)})" class="w-full glass-card p-4 mb-2.5 flex items-center gap-3 text-start tap-feedback">
                <span class="flex-1 min-w-0">
                    <span class="ex-name block text-[15px] font-black text-white leading-tight">${esc(tx(r.name))}</span>
                    <span class="block text-[12px] font-bold text-slate-400 mt-0.5">${esc(tm(r.muscle))}${r.muscle ? ' · ' : ''}${t('{n} sessions', { n: r.n })} · ${esc(fmtDate(r.last, false))}</span>
                    ${r.sg ? `<span class="block mt-2">${suggestionChip(r.sg, r.timed)}</span>` : ''}
                </span>
                <span class="text-end shrink-0">
                    <span class="block text-[12px] font-bold text-slate-400">${t('Best')}</span>
                    <span class="block text-[15px] font-black text-white" dir="ltr">${esc(r.best)}</span>
                    ${tr ? `<span class="flex items-center justify-end gap-1 text-[12px] font-bold mt-0.5 ${tr.c}"><i data-lucide="${tr.i}" class="w-3.5 h-3.5"></i>${t(tr.l)}</span>` : ''}
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 shrink-0"></i></button>`;
    }).join('');
};
const progressExercisesHTML = history => {
    const rows = progressExerciseRows(history);
    if (!rows.length) return pEmpty('dumbbell', t('No exercises yet'), t('Finish your first workout to see your progress here.'));
    const f = window.appState.pexF || 'all';
    const chip = ([id, label]) => `<button onclick="window.appActions.progressFilter(${jsArg(id)})" class="shrink-0 inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full text-[13px] font-bold tap-feedback border ${f === id ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-slate-300 border-white/10'}">${id === 'up' ? '<i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i>' : ''}${esc(t(label))}</button>`;
    return `<div class="relative mb-3">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                <input id="pex-search" type="search" autocomplete="off" value="${esc(window.appState.pexQ || '')}" placeholder="${esc(t('Search exercises'))}" oninput="window.appActions.progressSearch(this.value)" class="w-full bg-white/5 border border-white/10 rounded-2xl ps-11 pe-4 py-3.5 text-[14px] font-bold text-white outline-none focus:border-[#d4af37]">
            </div>
            <div id="pex-chips" class="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-3 -mx-1 px-1">${PEX_FILTERS.map(chip).join('')}</div>
            <div id="pex-list">${progressExerciseListHTML(rows)}</div>`;
};

// Volume: sets logged this week per muscle group against the sets in your plan (same groups as the Edit tab)
const progressVolumeHTML = history => {
    const map = exerciseNameMap(), wk = getWeekStart().getTime(), g = {};
    BALANCE.forEach(([name, , low]) => { g[name] = { done: 0, plan: 0, low }; });
    getActiveSchedule().forEach(d => { if (!d.isRest) (d.exercises || []).forEach(ex => { const gr = groupOf(ex.muscle); if (gr) g[gr].plan += parseInt(ex.sets) || 0; }); });
    Object.keys(history).forEach(k => {
        const gr = groupOf((map[k] || {}).muscle); if (!gr) return;
        (history[k] || []).forEach(l => { const t0 = logTime(l); if (!isNaN(t0) && t0 >= wk) g[gr].done += logSetDetails(l).length; });
    });
    if (!BALANCE.some(([n]) => g[n].plan || g[n].done)) return pEmpty('layers', t('No Volume Detected'), t('Build a routine with exercises to see your weekly workload goals.'));
    const rows = BALANCE.map(([n]) => {
        const x = g[n], pct = x.plan ? Math.min(100, Math.round(x.done / x.plan * 100)) : (x.done ? 100 : 0), full = x.plan && x.done >= x.plan, low = x.plan < x.low;
        const status = full ? [t('Done'), 'text-[#22c55e] bg-[#22c55e]/10'] : low ? [t('Low in plan'), 'text-orange-400 bg-orange-400/10'] : null;
        return `<div class="py-3 border-b border-white/5 last:border-0">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-[14px] font-black text-white">${esc(t(n))}</span>
                    <span class="flex items-center gap-2 shrink-0"><span class="text-[13px] font-bold text-white" dir="ltr">${x.done} / ${x.plan}</span>${status ? `<span class="text-[12px] font-bold px-2 py-1 rounded-md ${status[1]}">${status[0]}</span>` : ''}</span>
                </div>
                <div class="h-2 rounded-full bg-white/10 overflow-hidden" dir="ltr"><div class="bar-fill h-full rounded-full ${full ? 'bg-[#22c55e]' : 'bg-[#d4af37]'}" style="width:${pct}%"></div></div>
            </div>`;
    }).join('');
    return pCard(t('Sets this week'), `<div class="flex justify-between text-[12px] font-bold text-slate-400 -mt-2 mb-1"><span>${t('Muscle')}</span><span>${t('Done / planned')}</span></div>${rows}<p class="text-[12px] font-bold text-slate-400 mt-3">${t('Aim for about 10–20 sets a week for each muscle.')} ${t('"Low in plan" means your routine has few sets for it: add some in the Plan tab.')}</p>`);
};

// Body: body weight over time (the same log as Profile → Your profile); log today's weight here too
const progressBodyHTML = () => {
    const b = getBody(), log = b.log || [];
    const form = `<div class="flex gap-2 mt-4"><input id="pb-weight" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(t('Weight (kg)'))}" class="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-center font-black outline-none focus:border-[#d4af37]" dir="ltr" onkeydown="if(event.key==='Enter')window.appActions.progressLogWeight()"><button onclick="window.appActions.progressLogWeight()" class="shrink-0 px-5 rounded-2xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback">${t('Save')}</button></div>`;
    if (!log.length) return pEmpty('scale', t('Track your body weight'), t('Log your weight once a week, at the same time of day, to see how it changes.'), form);
    const last = log[log.length - 1], monthAgo = Date.now() - 30 * DAY_MS;
    const base = [...log].reverse().find(x => x.t <= monthAgo) || log[0], diff = round1(last.kg - base.kg);
    const loggedToday = dateKey(last.t) === dateKey();
    let html = `<div class="glass-card p-5 mb-3">
            <div class="flex items-end justify-between gap-3">
                <div><div class="text-[12px] font-bold text-slate-400 mb-1">${t('Body weight')}</div><div class="text-[34px] font-black text-white leading-none num" dir="ltr">${last.kg}<span class="text-[16px] text-slate-400"> kg</span></div><div class="text-[12px] font-bold text-slate-400 mt-1.5">${esc(fmtDate(last.t, false))}${b.heightCm ? ` · BMI <span class="num text-[14px] text-slate-200" dir="ltr">${round1(last.kg / Math.pow(b.heightCm / 100, 2))}</span>` : ''}</div></div>
                ${log.length >= 2 ? `<div class="text-end"><div class="text-[18px] font-black num ${diff === 0 ? 'text-slate-300' : 'text-white'}" dir="ltr">${diff > 0 ? '+' : ''}${diff} kg</div><div class="text-[12px] font-bold text-slate-400">${base === log[0] && base.t > monthAgo ? t('since you started') : t('in 30 days')}</div></div>` : ''}
            </div>
            ${log.length >= 2 ? `<div class="mt-4">${lineChartHTML(log.slice(-20).map(x => ({ t: x.t, v: x.kg })), 'kg')}</div>` : ''}
            <div class="text-[12px] font-bold text-white mt-4">${loggedToday ? t("Update today's weight") : t("Log today's weight")}</div>
            ${form.replace('mt-4', 'mt-2')}
        </div>`;
    html += pCard(t('History'), [...log].reverse().slice(0, 8).map((x, i, arr) => {
        const prev = arr[i + 1], d = prev ? round1(x.kg - prev.kg) : null;
        return `<div class="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"><span class="text-[13px] font-bold text-slate-300">${esc(fmtDate(x.t, false))}</span><span class="flex items-center gap-3" dir="ltr"><span class="text-[12px] font-bold text-slate-400">${d === null ? '' : `${d > 0 ? '+' : ''}${d}`}</span><span class="text-[14px] font-black text-white">${x.kg} kg</span></span></div>`;
    }).join(''));
    return html + `<p class="text-[12px] font-bold text-slate-400 px-1">${t('Also in Profile → Your profile.')}</p>`;
};

// Progress tab: four sections in one rounded switcher; the chosen one slides over and is remembered
const PTAB_KEY = 'workoutProgressTab_rakan_final';
const PTABS = [['overview', 'Overview', 'layout-dashboard'], ['exercises', 'Exercises', 'dumbbell'], ['volume', 'Volume', 'layers'], ['body', 'Body', 'scale']];
const currentPTab = () => {
    if (!window.appState.aTab) { try { window.appState.aTab = localStorage.getItem(PTAB_KEY) || 'overview'; } catch (e) { window.appState.aTab = 'overview'; } }
    if (!PTABS.some(([id]) => id === window.appState.aTab)) window.appState.aTab = 'overview';
    return window.appState.aTab;
};
const renderAnalytics = () => {
    const history = StorageManager.getHistory();
    const c = document.getElementById('workout-container');
    const activeTab = currentPTab(), idx = PTABS.findIndex(([id]) => id === activeTab);
    const prev = window.appState.aTabShown, from = PTABS.findIndex(([id]) => id === prev);
    const seg = ([id, label, icon]) => `<button onclick="window.appActions.progressTab('${id}')" class="relative z-10 flex-1 min-w-0 flex flex-col items-center gap-1 py-2.5 rounded-[18px] tap-feedback transition-colors duration-300 ${activeTab === id ? 'text-black' : 'text-slate-400'}" aria-pressed="${activeTab === id}"><i data-lucide="${icon}" class="w-[18px] h-[18px]"></i><span class="text-[12px] font-bold truncate max-w-full px-0.5">${esc(t(label))}</span></button>`;
    const tabsHTML = `<div id="progress-tabs" class="p-seg relative flex mb-4" role="tablist"><span class="p-seg-pill" style="--i:${from >= 0 ? from : idx}"></span>${PTABS.map(seg).join('')}</div>`;
    const contentHTML = activeTab === 'exercises' ? progressExercisesHTML(history)
        : activeTab === 'volume' ? progressVolumeHTML(history)
        : activeTab === 'body' ? progressBodyHTML()
        : progressOverviewHTML(history);
    // a different section pops in; a refresh of the same section stays still
    c.innerHTML = `<div class="pb-10">${tabsHTML}<div class="${prev === activeTab ? '' : 'p-pop'}">${contentHTML}</div></div>`;
    window.appState.aTabShown = activeTab;
    const pill = c.querySelector('.p-seg-pill');
    if (pill && from !== idx) requestAnimationFrame(() => requestAnimationFrame(() => pill.style.setProperty('--i', idx)));
    bindCharts(c);
    if (typeof hint === 'function') hint('progress-tabs', '#progress-tabs', t('Your week, every exercise, sets per muscle and your body weight are here.'));
    if (window.lucide) window.lucide.createIcons();
};
const READY = {
    high:   { c: '#22c55e', t: 'Push Day',   i: 'zap',      d: 'Well recovered. Go for your targets.' },
    normal: { c: '#d4af37', t: 'Normal Day', i: 'activity', d: 'Follow your targets as planned.' },
    low:    { c: '#ef4444', t: 'Easy Day',   i: 'moon',     d: 'Low recovery: no weight increases today. Keep your weight, aim for the bottom of the range and stop 2 reps before failure.' }
};
// Small button in today's day card: "How do you feel?" or the result. Tap to open the check-in
const checkInChip = () => {
    const r = getReadinessToday(), open = !!window.appState.ciOpen;
    if (!r && window.appState.ciSkipped === dateKey()) return '';
    const L = r ? READY[r.level] : null, c = L ? L.c : '#d4af37';
    return `<button onclick="window.appActions.toggleCheckIn()" class="ci-chip self-start inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border text-[12px] font-bold tap-feedback" style="color:${c};border-color:${c}55;background:${c}14" aria-expanded="${open}"><i data-lucide="${L ? L.i : 'activity'}" class="w-3.5 h-3.5"></i>${L ? `${t(L.t)} <span class="text-slate-400">• ${r.score}/6</span>` : t('How do you feel?')}<i data-lucide="chevron-${open ? 'up' : 'down'}" class="w-3 h-3 opacity-70"></i></button>`;
};
// Daily check-in card (opened from the button in today's day card)
const checkInHTML = () => {
    const r = getReadinessToday();
    if (r) {
        const R = READY[r.level], L = { c: R.c, t: t(R.t), i: R.i, d: t(R.d) };
        return `<div class="glass-card p-4 mb-4 flex items-center gap-3 border" style="border-color:${L.c}55">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background:${L.c}1a;color:${L.c}"><i data-lucide="${L.i}" class="w-5 h-5"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="text-[12px] font-bold" style="color:${L.c}">${L.t} <span class="text-slate-400">• ${r.score}/6</span></div>
                    <div class="text-[12px] font-bold text-slate-400 leading-snug mt-0.5">${L.d}</div>
                </div>
                <button onclick="window.appActions.resetCheckIn()" class="text-slate-400 hover:text-white p-2 bg-white/5 rounded-lg tap-feedback shrink-0" aria-label="${esc(t('Change check-in'))}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
            </div>`;
    }
    if (window.appState.ciSkipped === dateKey()) return '';
    const draft = window.appState.ciDraft || {};
    const row = (key, label, opts) => `<div class="flex items-center justify-between gap-2 mt-3">
            <span class="text-[12px] font-bold text-slate-400 w-[70px] shrink-0">${t(label)}</span>
            <div class="flex gap-1.5 flex-1">${opts.map((o, val) => `<button onclick="window.appActions.setCheckIn('${key}', ${val})" class="flex-1 py-2 rounded-lg text-[12px] font-extrabold tap-feedback border ${draft[key] === val ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-black/40 text-slate-300 border-white/10'}">${t(o)}</button>`).join('')}</div>
        </div>`;
    return `<div class="glass-card p-4 mb-4 border border-[#d4af37]/30">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4 text-[#d4af37]"></i><span class="text-[12px] font-bold text-white">${t('Daily Check-in')}</span></div>
                <button onclick="window.appActions.skipCheckIn()" class="text-[12px] font-bold text-slate-400 hover:text-white tap-feedback">${t('Skip')}</button>
            </div>
            <p class="text-[12px] font-bold text-slate-400 mt-1">${t("3 quick taps to adjust today's targets.")}</p>
            ${row('sleep', 'Sleep', ['Poor', 'OK', 'Great'])}
            ${row('soreness', 'Soreness', ['Very', 'A bit', 'Fresh'])}
            ${row('energy', 'Energy', ['Low', 'OK', 'High'])}
        </div>`;
};

// What to lift next: from your last session (easy day keeps the weight and aims low)
// skipToday: the workout cards plan today from your last session before today; Progress uses the latest one
const suggestionFor = (hA, ex, easy, skipToday = true) => {
    const prog = getProgression(getLastSession(hA, skipToday), ex.reps);
    if (!prog) return null;
    // done with no extra weight (bodyweight, plank...): ask for more reps or seconds, never "add 2.5 kg"
    if (!(prog.w > 0) && prog.type === 'up') return { type: 'build', w: 0, r: prog.maxR + (isTimed(ex.reps) ? 5 : 1) };
    if (easy && prog.type !== 'down') return { type: 'easy', w: prog.w, r: prog.minR };
    return { type: prog.type, w: prog.tW, r: prog.tR };
};
const SUGG = {
    up:    { label: 'Add weight:', icon: 'arrow-up-circle', cls: 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20' },
    build: { label: 'Aim:',        icon: 'target',          cls: 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/20' },
    down:  { label: 'Go lighter:', icon: 'arrow-down-circle', cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
    easy:  { label: 'Easy day:',   icon: 'moon',            cls: 'text-slate-300 bg-white/5 border-white/10' }
};
const suggestionChip = (sg, timed) => {
    if (!sg) return '';
    const c = SUGG[sg.type];
    return `<span class="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-md border ${c.cls}"><i data-lucide="${c.icon}" class="w-3 h-3"></i>${t(c.label)} <span dir="ltr">${fmtW(sg.w)} × ${sg.r}${timed ? 's' : ''}</span></span>`;
};

// New first day of the week: every workout stays on its own weekday (Push on Saturday stays on Saturday),
// only the order of the week changes. Logged workouts are re-pointed so "done this week" stays right.
function setWeekStart(v) {
    const aD = DAY_NAMES, idx = aD.indexOf(v); if (idx === -1) return false;
    StorageManager.setStartDay(v);
    const h = StorageManager.getHistory(), S = window.appState.sess; let hChanged = false;
    appData.weeks.forEach(w => {
        const byDay = {}; w.schedule.forEach(d => { byDay[d.day] = d; });
        if (Object.keys(byDay).length !== 7) { w.schedule.forEach((d, i) => d.day = aD[(idx + i) % 7]); return; }
        const move = {};
        w.schedule = aD.map((_, i) => { const d = byDay[aD[(idx + i) % 7]]; move[d.id] = i + 1; d.id = i + 1; return d; });
        Object.values(h).forEach(list => list.forEach(l => { if (l.weekId === w.id && typeof l.dayId === 'number' && move[l.dayId] && move[l.dayId] !== l.dayId) { l.dayId = move[l.dayId]; hChanged = true; } }));
        if (S && S.weekId === w.id && move[S.dayId]) S.dayId = move[S.dayId];
    });
    if (hChanged) StorageManager.setHistory(h);
    StorageManager.setPlan(appData);
    return true;
}

// Apex Lift app (index.html), part 6 of 13: window.appActions: what buttons do (navigation, exercises, workouts, settings, setup).
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// ⚙️ 5. GLOBAL ACTIONS
window.appActions = {
    showToast: (m, type='success', action=null) => {
        const c = document.getElementById('toast-container'); c.innerHTML=''; const d=document.createElement('div'), iS=type==='success', cS=iS?'text-[#22c55e]':'text-red-400', bS=iS?'bg-[#22c55e]/10 border-[#22c55e]/20':'bg-red-500/10 border-red-500/20';
        d.className=`glass-card p-4 flex items-center gap-3 border shadow-2xl transform translate-y-full opacity-0 transition-all duration-500 mt-2 ${bS} backdrop-blur-3xl pointer-events-auto`;
        d.innerHTML=`<i data-lucide="${iS?'check-circle':'alert-circle'}" class="w-5 h-5 shrink-0 ${cS}"></i><span class="text-[13px] font-bold text-white leading-snug flex-1">${esc(m)}</span>${action ? `<button class="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[12px] font-bold tap-feedback">${esc(action.label)}</button>` : ''}`;
        if (action) d.querySelector('button').onclick = () => { action.fn(); d.remove(); };
        c.appendChild(d); if(window.lucide) window.lucide.createIcons({root:d}); void d.offsetWidth; d.classList.remove('translate-y-full','opacity-0');
        setTimeout(()=>{if(c.contains(d)){d.classList.add('opacity-0','translate-y-full');setTimeout(()=>{if(c.contains(d))d.remove();},500);}}, action ? 5000 : 3500);
    },
    showConfirm: (title, m, ok, dng=false, okLabel=null) => {
        const y = document.getElementById('confirm-yes-btn');
        y.innerHTML = `<span>${esc(okLabel || t('Yes, Do it'))}</span>`;
        document.getElementById('confirm-title').innerText=title; document.getElementById('confirm-message').innerText=m;
        y.className=`flex-1 rounded-xl py-3.5 text-[12px] font-extrabold shadow-lg tap-feedback ${dng?'text-white bg-red-500 shadow-red-500/20':'text-black bg-[#d4af37] shadow-[#d4af37]/20'}`;
        document.getElementById('confirm-icon').innerHTML=`<i data-lucide="${dng?'alert-octagon':'alert-triangle'}" class="w-6 h-6 ${dng?'text-red-500':'text-[#d4af37]'}"></i>`;
        if(window.lucide) window.lucide.createIcons({root: document.getElementById('confirm-icon')});
        const nY = y.cloneNode(true); y.parentNode.replaceChild(nY,y); nY.onclick=()=>{nY.onclick=null;window.appActions.closeConfirm();setTimeout(ok,200);}; // runs once, even on a double tap
        openModal('custom-confirm-overlay','custom-confirm-box');
        pushBack('confirm', () => window.appActions.closeConfirm());
    },
    closeConfirm: () => { popBack('confirm'); closeModal('custom-confirm-overlay','custom-confirm-box'); },
    setCheckIn: (key, val) => {
        const draft = window.appState.ciDraft = { ...(window.appState.ciDraft || {}), [key]: val };
        if ([draft.sleep, draft.soreness, draft.energy].every(x => x === 0 || x === 1 || x === 2)) {
            const all = getReadinessAll();
            all[dateKey()] = { sleep: draft.sleep, soreness: draft.soreness, energy: draft.energy };
            // keep only the last 60 days
            const cutoff = dateKey(Date.now() - 60 * 86400000);
            Object.keys(all).forEach(k => { if (k < cutoff) delete all[k]; });
            writeItem(READY_KEY, JSON.stringify(all));
            window.appState.ciDraft = null;
            window.appState.ciOpen = false;
            const r = getReadinessToday();
            window.appActions.showToast(t(r.level === 'low' ? 'Easy day: targets adjusted' : r.level === 'high' ? 'Push day: go get it!' : 'Check-in saved'), 'success');
        }
        renderWorkout();
    },
    resetCheckIn: () => {
        const all = getReadinessAll();
        window.appState.ciDraft = {}; // answer all 3 again
        delete all[dateKey()];
        writeItem(READY_KEY, JSON.stringify(all));
        window.appState.ciSkipped = null;
        window.appState.ciOpen = true;
        renderWorkout();
    },
    toggleCheckIn: () => { window.appState.ciOpen = !window.appState.ciOpen; renderWorkout(); },
    // Exercise pop-up on Today: everything about the exercise, Start workout (this exercise only) and History
    openExSheet: i => {
        const day = getActiveSchedule().find(d => d.id === activeDay), ex = day && day.exercises[i]; if (!ex) return;
        const history = StorageManager.getHistory(), k = getExKey(currentWeekId, day.id, i, ex.name), hA = history[k] || [];
        const S = window.appState.sess, timed = isTimed(ex.reps), planned = parseInt(ex.sets) || 0, doneSets = setsThisWeekForDay(hA, day.id);
        const easy = day.id === getTodayId() && (getReadinessToday() || {}).level === 'low', sg = suggestionFor(hA, ex, easy);
        const isRun = S && S.dayId === day.id && (!S.weekId || S.weekId === currentWeekId) && (S.exIdx === i || S.exIdx == null);
        // sets past the plan count too (4 of 3 = +1 extra); the target only shows while sets are left this week
        const lastDay = lastDaySets(hA, day.id), prev = lastDay ? lastDay.sets : [], full = planned > 0 && doneSets >= planned, shown = doneSets, extra = Math.max(0, doneSets - planned);
        const tile = (label, value) => `<div class="rounded-2xl bg-white/5 px-3.5 py-2 min-w-0"><div class="text-[12px] font-bold text-slate-400">${label}</div><div class="text-[19px] font-black text-white leading-tight mt-0.5"><span dir="ltr">${value}</span></div></div>`;
        const tgtCls = sg ? { up: 'is-up', down: 'is-down' }[sg.type] || '' : '';
        // no header bar: the muscle with How to and History on its right, then the name on the whole width (close: tap outside or back)
        document.getElementById('ex-sheet-content').innerHTML = `<div class="px-5">
                <div class="flex items-center justify-between gap-2 -mt-1">
                <div class="text-[12px] font-bold text-[#d4af37] min-w-0 truncate">${esc(tm(ex.muscle))}</div>
                <div class="flex items-center gap-1.5 shrink-0 -me-1">
                    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise form')}" target="_blank" rel="noopener" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('How to do it (YouTube)'))}" title="${esc(t('How to do it (YouTube)'))}"><i data-lucide="circle-help" class="w-[18px] h-[18px]"></i></a>
                    <button data-on-click="window.appActions.openHistoryModal(@0,@1)" data-a-click="${hArgs(hStr(k), hStr(ex.name))}" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-300 flex items-center justify-center tap-feedback" aria-label="${esc(t('History'))}" title="${esc(t('History'))}"><i data-lucide="history" class="w-[18px] h-[18px]"></i></button>
                </div>
                </div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-2.5 whitespace-nowrap overflow-hidden">${esc(tx(ex.name))}</h3>
                ${shown === 0 ? (hA.length ? '' : `<div class="ex-first mt-4"><i data-lucide="sparkles" class="w-4 h-4 shrink-0"></i>${t('First time')}</div>`) : `<div class="ex-week ${full ? 'is-full' : 'is-part'} mt-4">
                    <div class="flex items-baseline justify-between gap-2"><span class="text-[12px] font-bold">${t('Done this week')}</span><b class="text-[15px] font-black">${extra ? `${t('{a} of {b} sets', { a: shown, b: planned })} <span class="ex-extra">${t('+{n} extra', { n: extra })}</span>` : full ? t('All {n} sets', { n: planned }) : t('{a} of {b} sets', { a: shown, b: planned })}</b></div>
                    <div class="ex-segs" dir="ltr">${Array.from({ length: Math.max(planned, shown) }, (_, k) => `<i class="${k >= planned ? 'is-extra' : k < shown ? 'is-on' : ''}"></i>`).join('')}</div>
                </div>`}
                <div class="grid grid-cols-2 gap-2 mt-2.5">${tile(t('Sets'), esc(ex.sets))}${tile(t(timed ? 'Seconds per set' : 'Reps per set'), esc(fmtReps(ex.reps)))}</div>
                ${sg && !full ? `<div class="ex-target ${tgtCls} mt-2"><i data-lucide="target" class="w-[18px] h-[18px] shrink-0"></i><div class="min-w-0"><div class="ex-target-l">${t("Today's target")}${sg.type !== 'build' ? ` · ${t(SUGG[sg.type].label).replace(/[:：]\s*$/, '')}` : ''}</div><div class="text-[16px] font-black text-white">${targetSentence(sg, timed)}</div></div></div>` : ''}
                ${!hA.length ? '' : `<div class="mt-3">
                    <div class="flex justify-between px-0.5 mb-1.5 text-[12px] font-bold text-slate-400"><span>${t('Last time')}</span><span>${lastDay ? esc(isToday(lastDay.ts) ? t('Today') : fmtDate(lastDay.ts, false)) : ''}</span></div>
                    ${prev.length ? `<table class="ex-last-tbl" dir="ltr"><thead><tr><th>#</th><th>${t('kg')}</th><th>${t(timed ? 'sec' : 'reps')}</th></tr></thead><tbody>${prev.map((x, k) => `<tr><td>${t('Set {n}', { n: k + 1 })}</td><td>${x.w > 0 ? x.w : t('BW')}</td><td>${x.r}</td></tr>`).join('')}</tbody></table>`
                    : `<div class="rounded-2xl bg-white/5 px-3.5 py-3 text-[13px] font-bold text-slate-400">${t('First time doing this exercise')}</div>`}
                </div>`}
                <button data-on-click="window.appActions.closeExSheet(); window.appActions.startWorkout(@0, null, @1)" data-a-click="${hArgs(day.id, i)}" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${isRun ? '<span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>' : '<i data-lucide="play" class="w-5 h-5 fill-current"></i>'}${isRun ? t('Continue workout') : full ? t('Log more sets') : shown > 0 ? t('Continue') : t('Start workout')}</button>
            </div>`;
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('ex-sheet-box') });
        openModal('ex-sheet-overlay', 'ex-sheet-box');
        fitNames(document.getElementById('ex-sheet-content')); // the name stays on one line (smaller font if it's long)
        pushBack('exsheet', () => window.appActions.closeExSheet());
    },
    closeExSheet: () => { popBack('exsheet'); closeModal('ex-sheet-overlay', 'ex-sheet-box'); },
    // Dark (default), light, or the same as the phone ('system'); remembered on this phone
    setTheme: v => {
        v = ['light', 'system'].includes(v) ? v : 'dark';
        try { localStorage.setItem('workoutTheme_rakan_final', v); } catch (e) {}
        applyTheme();
        const sel = document.getElementById('setting-theme'); if (sel) sel.value = v;
    },
    setLanguage: v => {
        if (v !== 'ar' && v !== 'en') return;
        writeItem(LANG_KEY, v);
        location.reload();
    },
    // Copy this day (title, type and exercises) onto another day
    copyDay: targetId => {
        const s = getActiveSchedule(), from = s.find(d => d.id === activeDay), to = s.find(d => d.id === targetId);
        if (!from || !to) return;
        const doCopy = () => {
            Object.assign(to, { title: from.title, isRest: from.isRest, recoveryType: from.recoveryType, savedTitle: from.savedTitle, exercises: JSON.parse(JSON.stringify(from.exercises || [])) });
            StorageManager.setPlan(appData); renderNav(false); renderWorkout();
            window.appActions.showToast(t('Copied to {day}', { day: t('Day {n}', { n: to.id }) }), 'success');
        };
        if ((to.exercises || []).length || to.isRest) window.appActions.showConfirm(t('Replace {day}?', { day: t('Day {n}', { n: to.id }) }), t('Its current exercises will be replaced.'), doCopy, true);
        else doCopy();
    },
    skipCheckIn: () => { window.appState.ciSkipped = dateKey(); window.appState.ciOpen = false; renderWorkout(); },
    refreshUI: () => renderWorkout(),
    // Progress tab: switch section (remembered), filter and search the exercise list, log body weight
    progressTab: id => { window.appState.aTab = id; try { localStorage.setItem(PTAB_KEY, id); } catch (e) {} renderAnalytics(); window.scrollTo({ top: 0 }); },
    // the chip row keeps its scroll position after the list is redrawn
    progressFilter: id => { const row = document.getElementById('pex-chips'), x = row ? row.scrollLeft : 0; window.appState.pexF = id; renderAnalytics(); const nr = document.getElementById('pex-chips'); if (nr) nr.scrollLeft = x; },
    progressSearch: q => { window.appState.pexQ = q; clearTimeout(window.appState.pexTimer); window.appState.pexTimer = setTimeout(window.appActions.progressSearchNow, 150); }, // after the last key
    progressSearchNow: () => { const el = document.getElementById('pex-list'); if (!el) return; el.innerHTML = progressExerciseListHTML(progressExerciseRows(StorageManager.getHistory())); if (window.lucide) window.lucide.createIcons({ root: el }); },
    progressLogWeight: () => {
        const inp = document.getElementById('pb-weight'), v = inp ? latinDigits(inp.value).trim() : '';
        const w = parseFloat(v.replace(/[\u066B\u060C,]/g, '.'));
        if (!(w >= 25 && w <= 350)) { window.appActions.showToast(t('Please check this number.'), 'error'); return; }
        window.appActions.setAbout('weightKg', v);
        window.appActions.showToast(t('Weight saved'));
        renderAnalytics();
    },
    openHistoryModal: (k, title) => { window.appState.historyEditMode=false; window.appState.openHistoryKey=k; const b=document.getElementById('history-edit-btn'); if(b){b.classList.remove('text-[#d4af37]','bg-[#d4af37]/10');b.classList.add('text-slate-300','bg-white/5');} document.getElementById('history-modal-title').innerText=tx(title); const hw=document.getElementById('history-howto'); if(hw) hw.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(title+' exercise form')}`; window.appActions.refreshHistoryModal(k); openSheet('history-modal-overlay', 'history-modal-box'); pushBack('history', () => window.appActions.closeHistoryModal()); },
    closeHistoryModal: () => { popBack('history'); closeSheet('history-modal-overlay', 'history-modal-box'); },
    toggleHistoryEdit: () => { window.appState.historyEditMode=!window.appState.historyEditMode; const b=document.getElementById('history-edit-btn'); if(b){b.className=`w-11 h-11 shrink-0 flex items-center justify-center rounded-full tap-feedback transition-colors ${window.appState.historyEditMode?'text-[#d4af37] bg-[#d4af37]/10':'text-slate-300 bg-white/5'}`;} if(window.appState.openHistoryKey)window.appActions.refreshHistoryModal(window.appState.openHistoryKey); },
    refreshHistoryModal: (k) => { const c=document.getElementById('history-modal-content'), hA=StorageManager.getHistory()[k]||[]; if(!hA.length){c.innerHTML=`<div class="text-center p-10 text-slate-400 text-[12px] font-bold">${t('No records')}</div>`;return;} let html='',cG=''; const getDt=(h, fb=Date.now())=>{const t=logTime(h); return new Date(isNaN(t)?fb:t);}, sD=getDt(hA[0]); sD.setHours(0,0,0,0); [...hA].reverse().forEach((h,i)=>{const dt=getDt(h, sD.getTime()); dt.setHours(0,0,0,0); const dD=Math.max(0,Math.floor((dt.getTime()-sD.getTime())/86400000)), wN=Math.floor(dD/7)+1, cWS=new Date(sD.getTime()+((wN-1)*604800000)), cWE=new Date(cWS.getTime()+518400000), gN=`${t('Week {n}', { n: wN })} • ${fmtDayMonth(cWS)} - ${fmtDayMonth(cWE)}`; if(gN!==cG){html+=`<div class="text-[12px] font-bold text-[#d4af37] mt-4 mb-2 pl-1 border-b border-[#d4af37]/20 pb-1"><i data-lucide="calendar-days" class="w-3 h-3 inline mr-1 -mt-0.5"></i> ${esc(gN)}</div>`; cG=gN;}
     html+=`<div class="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 mb-2"><div class="flex flex-col"><div class="flex items-center"><span class="text-[15px] font-black text-white">${(h.ws || h.rpe) ? `<span class="text-[#d4af37]">${logSetDetails(h).map(x => `${x.w > 0 ? x.w : t('BW')}×${x.r}${h.u==='s'?'s':''}${x.rpe ? `<span class="text-[12px] text-slate-400">@${x.rpe}</span>` : ''}`).join(', ')}</span>` : `${parseFloat(h.w)>0?`${esc(h.w)} <span class="text-[12px] text-slate-400">${t('kg')}</span>`:t('BW')} ${h.s?`<span class="ml-2 text-[#d4af37]">${esc(Array.isArray(h.s) ? h.s.join(', ') : h.s)} <span class="text-[12px] text-slate-400">${h.u==='s'?t('sec'):t('reps')}</span></span>`:''}`}</span></div><span class="text-[12px] font-bold text-slate-400 mt-1">${esc(isNaN(logTime(h)) ? h.d : fmtDate(logTime(h)))} ${h.time ? `<span class="ml-2 text-[#22c55e]"><i data-lucide="clock" class="w-3 h-3 inline -mt-0.5"></i> ${esc(h.time)}</span>` : ''}</span></div>${window.appState.historyEditMode?`<button data-on-click="window.appActions.deleteHistoryRecord(@0, @1)" data-a-click="${hArgs(hStr(k), hA.length-1-i)}" class="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`:''}</div>`; }); c.innerHTML=exerciseStatsHTML(hA)+html; bindCharts(c); if(window.lucide) window.lucide.createIcons({root:c}); },
    deleteHistoryRecord: (k, i) => window.appActions.showConfirm(t("Delete Record"), t("Remove this record?"), () => { let h=StorageManager.getHistory(); if(h[k]&&h[k][i]){const dl=getDeleted(); dl[k]=[...(dl[k]||[]), logSig(h[k][i])].slice(-200); setDeleted(dl); h[k].splice(i,1); StorageManager.setHistory(h); loggedWeights[k]=h[k].length?h[k][h[k].length-1].w:''; loggedReps[k]=h[k].length?h[k][h[k].length-1].s||'':''; StorageManager.set(loggedWeights); StorageManager.setReps(loggedReps); window.appActions.refreshHistoryModal(k); renderWorkout(); window.appActions.showToast(t("Deleted"),"error");} }, true),
    // ---------- Workout session: the whole day on one screen ----------
    // restore = a saved unfinished workout to bring back (minimized)
    // exIdx = one exercise of the day (from its card on Today); null = the whole day
    startWorkout: (dayId = activeDay, restore = null, exIdx = null) => {
        const S0 = window.appState.sess;
        if (S0 && !restore) {
            if (S0.dayId === dayId && (!S0.weekId || S0.weekId === currentWeekId) && (S0.exIdx == null || S0.exIdx === exIdx)) return window.appActions.expandSession();
            // another workout is running: never replace it without asking
            return window.appActions.showConfirm(t('A workout is in progress'), sessionHasData() ? t('Unsaved sets for {name} will be lost.', { name: t(S0.title) }) : t('{name} is still running. Stop it and start this one?', { name: t(S0.title) }), () => { window.appActions.discardSession(); window.appActions.startWorkout(dayId, null, exIdx); }, true, t('Start new workout'));
        }
        const day = getActiveSchedule().find(x => x.id === dayId);
        if (!day || day.isRest || !day.exercises.length) return;
        if (exIdx != null && !day.exercises[exIdx]) return;
        const history = StorageManager.getHistory();
        const easy = dayId === getTodayId() && (getReadinessToday() || {}).level === 'low';
        const S = window.appState.sess = restore ? { ...restore } : {
            dayId, title: exIdx != null ? day.exercises[exIdx].name : day.title, dayTitle: day.title, exIdx, startedAt: Date.now(), weekId: currentWeekId, showRpe: StorageManager.getShowRpe(),
            exercises: day.exercises.map((ex, i) => {
                if (exIdx != null && i !== exIdx) return null;
                const k = getExKey(currentWeekId, dayId, i, ex.name), hA = history[k] || [];
                const sg = suggestionFor(hA, ex, easy), last = getLastSession(hA);
                // Pre-filled weight: suggestion, else what you typed before, else last session
                const typed = loggedWeights[k] !== undefined && String(loggedWeights[k]).trim() !== '' ? parseFloat(loggedWeights[k]) : 0;
                const pw = sg ? (sg.w > 0 ? String(sg.w) : '') : typed > 0 ? String(typed) : last && last.w > 0 ? String(last.w) : '';
                const weekStart = getWeekStart().getTime();
                const logged = hA.filter(l => { const t = logTime(l); return !isNaN(t) && t >= weekStart && (!l.weekId || l.weekId === currentWeekId) && logDayId(l) === dayId; }).flatMap(logSetDetails);
                return { k, name: ex.name, muscle: ex.muscle, sets: Math.max(1, parseInt(ex.sets) || 1), repsStr: ex.reps, timed: isTimed(ex.reps),
                    offset: setsThisWeekForDay(hA, dayId), logged, pw, pr: sg ? sg.r : parseRange(ex.reps).minR, sg };
            }).filter(Boolean)
        };
        delete S.rows;
        window.appActions.renderSession(restore ? restore.rows : null);
        clearInterval(window.appState.awTimer);
        window.appState.awTimer = setInterval(window.appActions.sessionTick, 250);
        window.appActions.sessionTick();
        keepAwake(true);
        openSheet('active-workout-overlay', 'active-workout-box'); pushBack('session', sessionBack);
        if (!restore) hint('sess-check', '[id^=aw-rep-]', t('Type the KG and reps you did. The set turns green by itself.'), 800);
        saveSessionDraft();
        renderWorkout();
    },
    renderSession: (rows = null) => {
        const S = window.appState.sess; if (!S) return;
        if (typeof S.showRpe !== 'boolean') S.showRpe = StorageManager.getShowRpe();
        const showRpe = S.showRpe;
        S.cols = showRpe ? '32px minmax(0,1fr) minmax(0,1fr) 60px' : '32px minmax(0,1fr) minmax(0,1fr)';
        S.rowSeq = 0; // rows are numbered from 1 again every time the table is built
        // one exercise: the day's name on top (the exercise's own name is right below it)
        document.getElementById('aw-title').innerText = tx(t(S.exIdx != null && S.dayTitle ? S.dayTitle : S.title));
        document.getElementById('aw-status-text').innerText = t('Workout');
        document.getElementById('aw-pulse-dot').className = 'w-2 h-2 rounded-full shrink-0 bg-red-500 animate-pulse';
        document.getElementById('aw-mini-name').innerText = tx(t(S.title));
        const head = ex => `<div class="grid items-center gap-1.5 px-2 pb-1.5 text-[12px] font-bold text-slate-400" dir="ltr" style="grid-template-columns:${S.cols}"><span class="text-center">#</span><span class="text-center">${t('kg')}</span><span class="text-center">${ex.timed ? t('sec') : t('reps')}</span>${showRpe ? '<span class="text-center">RPE</span>' : ''}</div>`;
        document.getElementById('aw-sets-container').innerHTML = S.exercises.map((ex, e) => `
                <section class="mb-6" id="aw-ex-${e}">
                    <div class="px-1 mb-2.5">
                        <div class="flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <div class="ex-name text-[17px] font-black text-white leading-tight truncate">${esc(tx(ex.name))}</div>
                                <div class="text-[12px] font-bold text-slate-400 truncate">${esc(tm(ex.muscle))}</div>
                            </div>
                            <span class="num shrink-0 text-[16px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-slate-200" dir="ltr" aria-label="${esc(t('{n} sets', { n: ex.sets }) + ' · ' + t(ex.timed ? '{r} sec' : '{r} reps', { r: fmtReps(ex.repsStr) }))}">${esc(ex.sets)} × ${esc(fmtReps(ex.repsStr))}${ex.timed ? 's' : ''}</span>
                        </div>
                        ${(() => { const last = lastSessionText(StorageManager.getHistory()[ex.k] || [], ex.timed); return `<div class="flex flex-wrap items-center gap-1.5 mt-2">
                            <span class="inline-flex items-center gap-1 min-w-0 max-w-full text-[12px] font-bold px-2 py-1 rounded-md bg-white/5 text-slate-400"><i data-lucide="history" class="w-3 h-3 shrink-0"></i>${last ? `<span class="min-w-0">${t('Last time')} · ${esc(last.when)}: <b class="text-white" dir="ltr">${last.body}</b></span>` : t('First time')}</span>
                            ${ex.sg ? `<span class="aw-sg">${suggestionChip(ex.sg, ex.timed)}</span>` : ''}
                        </div>`; })()}
                    </div>
                    ${head(ex)}
                    <div id="aw-rows-${e}" class="space-y-1.5"></div>
                    <div id="aw-note-${e}" class="hidden px-2 py-2 text-[12px] font-bold text-[#22c55e]"><i data-lucide="check" class="w-3.5 h-3.5 inline -mt-0.5"></i> ${t('Done this week')}</div>
                    <div class="flex gap-2 mt-2 px-1">
                        <button data-on-click="window.appActions.removeSetRow(@0)" data-a-click="${hArgs(e)}" class="h-11 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-300 tap-feedback" aria-label="${esc(t('Remove set'))}"><i data-lucide="minus" class="w-4 h-4"></i></button>
                        <button data-on-click="window.appActions.addSetRow(@0)" data-a-click="${hArgs(e)}" class="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-slate-200 tap-feedback flex items-center justify-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add set')}</button>
                    </div>
                </section>`).join('');
        if (rows && rows.length) rows.forEach(r => { if (S.exercises[r.e]) window.appActions.addSetRow(r.e, r, true); });
        else S.exercises.forEach((ex, e) => {
            // sets you already did (green, can't be changed), then empty ones; "Log more sets" gets one new set
            (ex.logged || []).forEach(x => window.appActions.addSetRow(e, { w: x.w > 0 ? String(x.w) : '', r: String(x.r), rpe: '', done: true, logged: true }, true));
            const n = Math.max(0, ex.sets - ex.offset) || (S.exIdx != null ? 1 : 0);
            for (let j = 0; j < n; j++) window.appActions.addSetRow(e, null, true);
        });
        S.exercises.forEach((ex, e) => { if (!document.querySelector(`#aw-rows-${e} .aw-row`)) document.getElementById(`aw-note-${e}`).classList.remove('hidden'); });
        document.getElementById('aw-next').innerHTML = '';
        document.getElementById('aw-next-btn').classList.add('hidden');
        document.getElementById('aw-finish-btn').innerText = t('Finish workout');
        window.appActions.updateSessionInfo();
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('active-workout-box') });
    },
    updateSessionInfo: () => {
        const S = window.appState.sess; if (!S) return;
        const all = document.querySelectorAll('#aw-sets-container .aw-row'), done = document.querySelectorAll('#aw-sets-container .aw-row[data-done="1"]');
        // the line stays empty until the first set is logged; then the next set is marked
        const rowsAll = [...all], nextI = done.length ? rowsAll.findIndex(r => r.dataset.done !== '1') : -1;
        const segs = rowsAll.length <= 40 ? rowsAll.map((r, j) => `<i class="${r.dataset.done === '1' ? 'is-on' : j === nextI ? 'is-now' : ''}"></i>`).join('') : `<i class="is-on" style="flex:${done.length}"></i><i style="flex:${all.length - done.length}"></i>`;
        document.getElementById('aw-info').innerHTML = `<div class="w-full"><div class="flex justify-between items-baseline text-[12px] font-bold mb-2"><span class="text-slate-400">${S.exercises.length > 1 ? t('{n} exercises', { n: S.exercises.length }) : ''}</span><span class="text-slate-400" dir="ltr"><b class="num text-[20px] font-bold text-white">${done.length}</b> / ${all.length} ${t('sets')}</span></div><div class="aw-segs" dir="ltr" role="progressbar" aria-valuemin="0" aria-valuemax="${all.length}" aria-valuenow="${done.length}">${segs}</div></div>`;
    },
    // Adds one set row to exercise e
    addSetRow: (e, r = null, building = false) => {
        const S = window.appState.sess; if (!S || !S.exercises[e]) return;
        const ex = S.exercises[e], box = document.getElementById(`aw-rows-${e}`);
        const rowsNow = box.querySelectorAll('.aw-row');
        // set number: done sets are rows here too (older saved workouts didn't show them)
        const n = rowsNow.length + 1 + (ex.logged ? 0 : ex.offset);
        if (!r) {
            // KG is filled in (the set above, else the same set last time); reps stay empty for you to type
            const above = rowsNow.length ? (document.getElementById(`aw-w-${rowsNow[rowsNow.length - 1].dataset.i}`) || {}).value : '';
            const prev = lastSessionSets(StorageManager.getHistory()[ex.k] || []), p = prev[n - 1] || prev[prev.length - 1];
            r = { w: building ? (p && p.w > 0 ? String(p.w) : '') : (above || (p && p.w > 0 ? String(p.w) : '')), r: '', rpe: '', done: false };
        }
        S.rowSeq = (S.rowSeq || 0) + 1;
        const i = S.rowSeq;
        const showRpe = S.showRpe;
        const inCls = 'aw-in w-full h-11 rounded-xl bg-black/50 border border-white/10 text-center text-[26px] font-bold text-white outline-none focus:border-[#d4af37]';
        box.insertAdjacentHTML('beforeend', `
                <div class="aw-row grid items-center gap-1.5 px-2 py-1 rounded-xl transition-colors ${r.done ? 'is-done' : ''} ${r.logged ? 'is-logged' : ''}" data-i="${i}" data-e="${e}" data-done="${r.done ? 1 : 0}" ${r.logged ? 'data-logged="1"' : ''} id="aw-row-${i}" dir="ltr" style="grid-template-columns:${S.cols}">
                    <span class="num w-8 h-8 rounded-full ${r.done ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[16px] font-bold flex items-center justify-center" id="aw-num-${i}">${n}</span>
                    <input id="aw-w-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(r.w)}" ${r.logged ? 'disabled' : ''} placeholder="${isBodyweight(ex.name) ? t('BW') : t('kg')}" data-on-focus="window.appActions.selectAll(this)" data-on-input="window.appActions.numInput(this, true)" class="${inCls} text-[#d4af37]">
                    <input id="aw-rep-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(r.r)}" ${r.logged ? 'disabled' : ''} placeholder="${ex.timed ? t('sec') : t('reps')}" data-on-focus="window.appActions.selectAll(this)" data-on-input="window.appActions.numInput(this, false)" data-on-blur="window.appActions.repsChanged(@0)" data-a-blur="${hArgs(i)}" data-on-keydown="if(event.key==='Enter')this.blur()" class="${inCls}">
                    ${showRpe ? `<select id="aw-rpe-${i}" ${r.logged ? 'disabled' : ''} data-on-change="window.appActions.sessionChanged()" class="${inCls} appearance-none text-[14px]"><option value="">–</option>${[6,7,8,9,10].map(x => `<option value="${x}" ${String(r.rpe) === String(x) ? 'selected' : ''}>${x}</option>`).join('')}</select>` : ''}
                </div>`);
        document.getElementById(`aw-note-${e}`).classList.add('hidden');
        if (!building) { if (window.lucide) window.lucide.createIcons({ root: box }); window.appActions.updateSessionInfo(); saveSessionDraft(); }
    },
    removeSetRow: e => {
        const rows = document.querySelectorAll(`#aw-rows-${e} .aw-row`);
        if (rows.length && rows[rows.length - 1].dataset.logged !== '1') { rows[rows.length - 1].remove(); if (rows.length === 1) document.getElementById(`aw-note-${e}`).classList.remove('hidden'); window.appActions.updateSessionInfo(); saveSessionDraft(); }
    },
    // Reps typed, then the box is left (keyboard Done/Enter or tapping elsewhere): the set turns green by itself; emptying it undoes that.
    // Uses blur, not change: change never fires after numInput turns Arabic digits (٨) into 8
    repsChanged: i => {
        const row = document.getElementById(`aw-row-${i}`), ok = parseInt((document.getElementById(`aw-rep-${i}`) || {}).value) > 0;
        if (row && ok !== (row.dataset.done === '1')) window.appActions.completeSet(i);
    },
    sessionChanged: () => saveSessionDraft(),
    // KG / reps boxes: Arabic digits (٤٫٥ or ٤،٥) become 4.5, anything that isn't a number is dropped
    // Tapping a KG / REPS box selects its number, so typing replaces it straight away
    // (after the tap, so phones and iPhones don't drop the selection)
    selectAll: el => setTimeout(() => { if (document.activeElement !== el) return; try { el.setSelectionRange(0, el.value.length); } catch (e) { el.select(); } }, 0),
    numInput: (el, decimal) => {
        let v = latinDigits(el.value).replace(/[\u066B\u066C\u060C\u2396,]/g, '.'); // every decimal / comma mark an Arabic keypad can type
        v = decimal ? v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 6) : v.replace(/[^0-9]/g, '').slice(0, 3);
        if (v !== el.value) el.value = v;
        saveSessionDraft();
    },
    // Marks a set done (or not done again), starts the rest timer and scrolls to the next set
    completeSet: i => {
        const row = document.getElementById(`aw-row-${i}`), inp = document.getElementById(`aw-rep-${i}`);
        if (!row || !inp) return;
        const setDone = on => {
            row.dataset.done = on ? '1' : '0';
            row.classList.toggle('is-done', on);
            const num = document.getElementById(`aw-num-${i}`);
            if (num) num.className = `num w-8 h-8 rounded-full ${on ? 'bg-[#22c55e] text-black' : 'bg-white/5 text-slate-300'} text-[16px] font-bold flex items-center justify-center`;
        };
        if (row.dataset.done === '1') { setDone(false); window.appActions.updateSessionInfo(); saveSessionDraft(); return; }
        if (!(parseInt(inp.value) > 0)) return;
        setDone(true);
        row.classList.remove('row-flash'); void row.offsetWidth; row.classList.add('row-flash');
        if (navigator.vibrate) navigator.vibrate(30);
        window.appActions.updateSessionInfo();
        const next = [...document.querySelectorAll('#aw-sets-container .aw-row')].find(r => r.dataset.done !== '1');
        if (next) {
            window.appActions.startRest(StorageManager.getRestSeconds());
            hint('sess-rest', '#aw-rest', t('Rest timer: it starts by itself. Use −15 / +15 or Skip.'), 500);
            setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
        }
        saveSessionDraft();
    },
    startRest: secs => {
        const S = window.appState.sess; if (!S) return;
        window.appState.awRestEnd = Date.now() + secs * 1000; window.appState.awRestTotal = secs * 1000; S.restOver = false;
        const bar = document.getElementById('aw-rest');
        if (bar.classList.contains('hidden')) { bar.classList.remove('hidden'); bar.classList.add('flex'); bar.classList.remove('slide-up'); void bar.offsetWidth; bar.classList.add('slide-up'); }
        document.getElementById('aw-rest-time').classList.remove('rest-urgent');
        document.getElementById('aw-rest-label').innerText = t('Rest');
        window.appActions.sessionTick();
    },
    restAdd: secs => { if (window.appState.awRestEnd) { window.appState.awRestEnd = Math.max(Date.now() + 1000, window.appState.awRestEnd + secs * 1000); window.appState.awRestTotal = Math.max(window.appState.awRestTotal || 0, window.appState.awRestEnd - Date.now()); window.appActions.sessionTick(); } },
    restSkip: () => {
        window.appState.awRestEnd = null;
        const bar = document.getElementById('aw-rest');
        if (bar) { bar.classList.add('hidden'); bar.classList.remove('flex'); }
        window.appActions.sessionTick();
    },
    updateRest: v => { StorageManager.setRestSeconds(v); window.appActions.showToast(t('Rest timer: {v}s', { v: parseInt(v) }), 'success'); },
    // Runs 4× a second while a workout is open: clock, rest countdown and the minimized bar
    sessionTick: () => {
        const S = window.appState.sess; if (!S) return;
        const clock = fmtClock(Math.floor((Date.now() - S.startedAt) / 1000));
        document.getElementById('aw-timer').innerText = clock;
        let rest = null;
        if (window.appState.awRestEnd) {
            const left = Math.ceil((window.appState.awRestEnd - Date.now()) / 1000);
            const rt = document.getElementById('aw-rest-time'), rb = document.getElementById('aw-rest-bar');
            if (rb) rb.style.width = `${Math.max(0, Math.min(100, (window.appState.awRestEnd - Date.now()) / (window.appState.awRestTotal || 1) * 100))}%`;
            if (left > 0) { rest = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; rt.innerText = rest; rt.classList.toggle('rest-urgent', left <= 3); }
            else if (!S.restOver) {
                S.restOver = true;
                document.getElementById('aw-rest-label').innerText = t('Rest over'); rt.innerText = t('GO!'); rt.classList.remove('rest-urgent'); rt.classList.add('pop');
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                setTimeout(() => { if (window.appState.sess === S && S.restOver) window.appActions.restSkip(); }, 4000);
            }
        }
        const all = document.querySelectorAll('#aw-sets-container .aw-row').length, done = document.querySelectorAll('#aw-sets-container .aw-row[data-done="1"]').length;
        document.getElementById('aw-mini-time').innerText = rest || clock;
        document.getElementById('aw-mini-sub').innerText = rest ? t('Rest') : `${done} / ${all} ${t('sets')}`;
        document.getElementById('aw-mini-dot').className = `w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${rest ? 'bg-[#22c55e]' : 'bg-red-500'}`;
    },
    // Minimize: hide the workout but keep everything (and the timer) running; a bar stays at the bottom
    minimizeSession: () => {
        if (!window.appState.sess) return;
        popBack('session');
        closeSheet('active-workout-overlay', 'active-workout-box');
        window.appActions.showMini();
        saveSessionDraft();
    },
    showMini: () => {
        const m = document.getElementById('aw-mini');
        m.classList.remove('hidden'); m.classList.add('flex');
        document.body.classList.add('has-mini');
        if (window.lucide) window.lucide.createIcons({ root: m });
        window.appActions.sessionTick();
    },
    expandSession: () => {
        if (!window.appState.sess) return;
        const m = document.getElementById('aw-mini');
        m.classList.add('hidden'); m.classList.remove('flex');
        document.body.classList.remove('has-mini');
        openSheet('active-workout-overlay', 'active-workout-box');
        pushBack('session', sessionBack);
    },
    // Throw the workout away (nothing saved)
    discardSession: () => {
        clearInterval(window.appState.awTimer);
        window.appState.awRestEnd = null;
        const wasOpen = document.getElementById('active-workout-overlay').classList.contains('flex');
        window.appState.sess = null;
        popBack('session');
        if (wasOpen) closeSheet('active-workout-overlay', 'active-workout-box');
        const m = document.getElementById('aw-mini'); m.classList.add('hidden'); m.classList.remove('flex');
        document.body.classList.remove('has-mini');
        const bar = document.getElementById('aw-rest'); bar.classList.add('hidden'); bar.classList.remove('flex');
        keepAwake(false);
        clearSessionDraft();
        renderWorkout();
    },
    closeActiveWorkout: () => {
        if (sessionHasData()) window.appActions.showConfirm(t('Discard this workout?'), t('Your unsaved sets will be lost.'), () => window.appActions.discardSession(), true);
        else window.appActions.discardSession();
    },
    // Finish: save every filled set, then show the summary
    finishActiveWorkout: (confirmed = false) => {
        const S = window.appState.sess; if (!S) return;
        const rows = sessionRows().filter(x => S.exercises[x.e] && !x.logged), filled = rows.filter(x => parseInt(x.r) > 0); // sets saved before aren't saved again
        if (!filled.length) return window.appActions.showToast(t("Enter reps for at least 1 set"), "error");
        // a weighted exercise needs a KG (type 0 for bodyweight)
        const bad = filled.find(x => x.w === '' && !isBodyweight(S.exercises[x.e].name));
        if (bad) {
            const row = document.getElementById(`aw-row-${bad.i}`); if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return window.appActions.showToast(t('Enter KG for every set (0 = bodyweight)'), 'error');
        }
        // some sets still empty: make sure that's on purpose
        const left = rows.length - filled.length;
        if (left > 0 && confirmed !== 'yes') return window.appActions.showConfirm(t('Finish workout?'), t('{n} sets are still empty. Only the sets you did will be saved.', { n: left }), () => window.appActions.finishActiveWorkout('yes'));
        // dated when the workout started (a session that runs past midnight stays on its own day)
        const h = StorageManager.getHistory(), n = new Date(S.startedAt || Date.now()), wkId = S.weekId || currentWeekId;
        const duration = Math.floor((Date.now() - S.startedAt) / 1000);
        let sets = 0, volume = 0; const prs = [];
        S.exercises.forEach((ex, e) => {
            const mine = filled.filter(x => x.e === e);
            if (!mine.length) return;
            const reps = mine.map(x => parseInt(x.r));
            const ws = mine.map(x => parseFloat(x.w) > 0 ? String(parseFloat(x.w)) : '0');
            const rpe = mine.map(x => { const v = parseFloat(x.rpe); return v >= 1 && v <= 10 ? v : null; });
            const w = String(Math.max(...ws.map(Number)));
            // personal record: heavier than anything before today
            const before = (h[ex.k] || []).filter(l => !isToday(logTime(l)));
            const best = Math.max(0, ...before.flatMap(logSetDetails).map(x => x.w));
            if (best > 0 && Number(w) > best) prs.push({ name: ex.name, w: Number(w), plus: Math.round((Number(w) - best) * 10) / 10 });
            sets += reps.length;
            if (!ex.timed) volume += reps.reduce((a, r, j) => a + r * Number(ws[j]), 0);
            const entry = {
                d: formatLogDate(n),   // text date (for display and older app versions)
                ts: n.getTime(),       // exact time (used for all date calculations)
                w, s: reps, time: fmtClock(duration),
                week: (appData.weeks.find(x => x.id === wkId) || {}).name || 'Routine',
                weekId: wkId,          // which routine this was logged in
                dayId: S.dayId         // which day of the routine this was logged for
            };
            if (ex.timed) entry.u = 's';
            if (ws.some(x => x !== w)) entry.ws = ws; // only stored when weights differ per set
            if (rpe.some(x => x !== null)) entry.rpe = rpe;
            (h[ex.k] = h[ex.k] || []).push(entry);
            if (h[ex.k].length > HIST_CAP) h[ex.k] = h[ex.k].slice(-HIST_CAP);
            loggedWeights[ex.k] = w === '0' ? '' : w;
        });
        StorageManager.setHistory(h); StorageManager.set(loggedWeights);
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        const title = S.title, day = S.exIdx != null && wkId === currentWeekId && getActiveSchedule().find(d => d.id === S.dayId);
        // One exercise from Today: a short message (you pick the next exercise yourself), unless that was the last one of the day
        if (day) {
            const fin = exercisesFinished(day, h), n = day.exercises.length;
            const next = [...Array(n).keys()].map(o => (S.exIdx + 1 + o) % n).find(i => !fin[i]);
            if (next !== undefined) {
                window.appActions.discardSession();
                renderNav();
                window.appActions.showToast(t('{name} saved · {n} sets', { name: tx(title), n: sets }) + (prs.length ? ` · ${t('New record')} 🏆` : ''), 'success');
                return;
            }
            window.appActions.discardSession();
            renderNav();
            return window.appActions.showSummary(daySummary(day, h));
        }
        window.appActions.discardSession();
        renderNav();
        window.appActions.showSummary({ title, duration, sets, volume, prs });
    },
    showSummary: ({ title, duration, sets, volume, prs }) => {
        document.getElementById('summary-title').innerText = `${t(title)} · ${fmtDate(Date.now(), false)}`;
        const stat = (v, l, count) => `<div class="bg-white/5 rounded-xl py-3"><div class="text-[18px] font-black text-white tabular-nums num" dir="ltr" ${count !== undefined ? `data-count="${count}"` : ''}>${v}</div><div class="text-[12px] font-bold text-slate-400">${l}</div></div>`;
        document.getElementById('summary-stats').innerHTML = stat(fmtClock(duration), t('Time')) + stat(0, t('sets'), sets) + stat(0, t('kg lifted'), Math.round(volume));
        document.getElementById('summary-prs').innerHTML = prs.length
            ? `<div class="text-[12px] font-bold text-[#d4af37] mb-2">🏆 ${t('New records')}</div>` + prs.map(x => `<div class="flex justify-between gap-2 py-2 border-b border-white/5 last:border-0"><span class="ex-name text-[13px] font-bold text-white truncate">${esc(tx(x.name))}</span><span class="text-[13px] font-bold text-[#22c55e] shrink-0" dir="ltr">${x.w}kg (+${x.plus})</span></div>`).join('')
            : '';
        openModal('summary-overlay', 'summary-box');
        pushBack('summary', () => window.appActions.closeSummary());
        // trophy bounces in, the numbers count up, and new records get a burst of gold
        const box = document.getElementById('summary-box'), tr = box.querySelector('.summary-trophy');
        if (tr) { tr.classList.remove('trophy-in'); void tr.offsetWidth; tr.classList.add('trophy-in'); }
        const nums = document.querySelectorAll('#summary-stats [data-count]'), t0 = performance.now();
        const step = now => { const k = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - k, 3); nums.forEach(el => { el.textContent = Math.round(Number(el.dataset.count) * e).toLocaleString('en-US'); }); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
        box.querySelectorAll('.confetti').forEach(c => c.remove());
        if (prs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const colors = ['#d4af37', '#22c55e', '#ffffff', '#f5d76e'];
            for (let k = 0; k < 28; k++) {
                const c = document.createElement('span'), a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 120;
                c.className = 'confetti'; c.style.background = colors[k % colors.length];
                c.style.setProperty('--x', `${Math.cos(a) * d}px`); c.style.setProperty('--y', `${Math.sin(a) * d - 40}px`); c.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
                c.style.animationDelay = `${0.25 + Math.random() * 0.15}s`; c.style.top = '64px';
                box.appendChild(c); setTimeout(() => c.remove(), 1700);
            }
        }
    },
    closeSummary: () => { popBack('summary'); closeModal('summary-overlay', 'summary-box'); },
    applyGlobalSetsReps: () => {
        let s = latinDigits(document.getElementById('global-sets').value).trim();
        const r = latinDigits(document.getElementById('global-reps').value).trim().slice(0, 20);
        if (s && !(parseInt(s) > 0)) return window.appActions.showToast(t("Enter Sets or Reps"), "error");
        if (s) s = String(Math.min(10, parseInt(s)));
        if (!s && !r) return window.appActions.showToast(t("Enter Sets or Reps"), "error");
        const d = getActiveSchedule().find(x => x.id === activeDay), before = d.exercises.map(ex => ({ ex, sets: ex.sets, reps: ex.reps }));
        d.exercises.forEach(ex => {
            if(s) ex.sets = s;
            if(r) ex.reps = r;
        });
        StorageManager.setPlan(appData);
        renderWorkout();
        window.appActions.showToast(t("Updated all exercises"), "success", { label: t('Undo'), fn: () => {
            before.forEach(b => { b.ex.sets = b.sets; b.ex.reps = b.reps; }); StorageManager.setPlan(appData); renderWorkout();
        } });
    },
    // Settings → Week starts on (see setWeekStart)
    updateStartOfWeek: v => {
        if (!setWeekStart(v)) return;
        activeDay=getTodayId(); const s=document.getElementById('setting-start-day'); if(s)s.value=v; renderNav(false); renderWorkout(); setTimeout(()=>window.appActions.showToast(t('Week starts on {d}', { d: tDay(v) }),"success"),300);
    },
    swapDay: tId => { const s=getActiveSchedule(), d1=s.find(d=>d.id===activeDay), d2=s.find(d=>d.id===tId); if(!d1||!d2)return; const tT=d1.title, tE=JSON.stringify(d1.exercises), tIR=d1.isRest, tRT=d1.recoveryType, tST=d1.savedTitle; d1.title=d2.title; d1.exercises=JSON.parse(JSON.stringify(d2.exercises||[])); d1.isRest=d2.isRest; d1.recoveryType=d2.recoveryType; d1.savedTitle=d2.savedTitle; d2.title=tT; d2.exercises=JSON.parse(tE||'[]'); d2.isRest=tIR; d2.recoveryType=tRT; d2.savedTitle=tST; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
    updateDayTitle: v => { getActiveSchedule().find(d=>d.id===activeDay).title=v.trim()||'New Day'; StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },
    updateDayType: v => { const d=getActiveSchedule().find(x=>x.id===activeDay); if(v==='workout'){d.isRest=false; d.recoveryType=null; d.title=d.savedTitle||'New Workout'; if(!d.exercises)d.exercises=[];}else{if(!d.isRest)d.savedTitle=d.title; d.isRest=true; d.recoveryType=v; d.title=v==='active'?'Active Rest':'Complete Rest';} StorageManager.setPlan(appData); renderWorkout(); renderNav(false); },        // Delete straight away, with an Undo button for a few seconds
    deleteEx: i => {
        const d = getActiveSchedule().find(x => x.id === activeDay);
        window.appActions.closeExEdit();
        const removed = d.exercises.splice(i, 1)[0];
        StorageManager.setPlan(appData); renderWorkout(); renderNav(false);
        window.appActions.showToast(t('Removed {name}', { name: tx(removed.name) }), 'error', { label: t('Undo'), fn: () => {
            d.exercises.splice(i, 0, removed); StorageManager.setPlan(appData); renderWorkout(); renderNav(false);
        } });
    },

    // ---------- Exercise picker ----------
    // mode 'add': choose several exercises and add them; mode 'replace': swap exercise number idx
    openPicker: (mode, idx = null) => {
        const d = getActiveSchedule().find(x => x.id === activeDay);
        const cur = mode === 'replace' ? d.exercises[idx] : null;
        window.appState.picker = { mode, idx, muscle: cur && muscleOptions.includes(cur.muscle) ? cur.muscle : 'All', q: '', sel: [] };
        document.getElementById('picker-title').innerText = mode === 'replace' ? t('Change {name}', { name: tx(cur.name) }) : t('Add exercises');
        const search = document.getElementById('picker-search'); search.value = '';
        window.appActions.renderPicker();
        openSheet('picker-overlay', 'picker-box');
        fitNames(document.getElementById('picker-box'));
        pushBack('picker', () => window.appActions.closePicker());
        // the chips row starts at the highlighted muscle (changing a Chest exercise shows Chest), not at "All"
        const chips = document.getElementById('picker-chips'), on = chips.querySelector('[data-on]');
        chips.scrollLeft = 0;
        if (on && on.previousElementSibling) requestAnimationFrame(() => { const r = chips.getBoundingClientRect(), c = on.getBoundingClientRect(); chips.scrollLeft += (c.left + c.width / 2) - (r.left + r.width / 2); });
    },
    closePicker: () => { popBack('picker'); closeSheet('picker-overlay', 'picker-box'); },
    // typing updates the search right away, but the list is only redrawn when typing pauses (not once per letter)
    pickerSearch: v => { window.appState.picker.q = v; clearTimeout(window.appState.pickerTimer); window.appState.pickerTimer = setTimeout(() => window.appActions.renderPicker(false), 150); },
    pickerMuscle: m => { clearTimeout(window.appState.pickerTimer); window.appState.picker.muscle = m; window.appActions.renderPicker(); document.getElementById('picker-list').scrollTop = 0; },
    renderPicker: (withChips = true) => {
        clearTimeout(window.appState.pickerTimer);
        const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
        const inDay = new Set(d.exercises.map(e => e.name));
        const isSel = (name, muscle) => P.sel.some(x => x.name === name && x.muscle === muscle);
        if (withChips) {
            document.getElementById('picker-chips').innerHTML = ['All', ...muscleOptions].map(m =>
                `<button data-on-click="window.appActions.pickerMuscle(@0)" data-a-click="${hArgs(hStr(m))}" ${P.muscle === m ? 'data-on="1"' : ''} class="shrink-0 h-10 px-3.5 rounded-full text-[13px] font-bold tap-feedback border ${P.muscle === m ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-slate-300 border-white/10'}">${esc(m === 'All' ? t('All') : tm(m))}</button>`).join('');
        }
        const row = x => {
            const sel = isSel(x.name, x.muscle), added = inDay.has(x.name);
            return `<button data-on-click="window.appActions.pickerTap(@0, @1)" data-a-click="${hArgs(hStr(x.name), hStr(x.muscle))}" class="cv-row w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 text-start tap-feedback ${sel ? 'bg-[#d4af37]/10' : ''}">
                    <span class="min-w-0"><span class="ex-name block text-[14px] font-bold text-white truncate">${esc(tx(x.name))}${x.custom ? ` <span class="text-[12px] text-[#d4af37]">★</span>` : ''}</span><span class="block text-[12px] font-bold text-slate-400">${esc(tm(x.muscle))}${added ? ` • ${esc(t('In this day'))}` : ''}</span></span>
                    <span class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${sel ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/20 text-slate-400'}"><i data-lucide="${P.mode === 'replace' ? 'replace' : (sel ? 'check' : 'plus')}" class="w-4 h-4"></i></span>
                </button>`;
        };
        const header = txt => `<div class="px-4 pt-4 pb-1 text-[12px] font-bold text-[#d4af37]">${esc(txt)}</div>`;
        const q = P.q.trim().toLowerCase();
        let items = catalogue();
        if (P.muscle !== 'All') items = items.filter(x => x.muscle === P.muscle);
        let html = '';
        if (q) {
            const seen = new Set();
            const hits = items.filter(x => (x.name.toLowerCase().includes(q) || tx(x.name).includes(q) || tm(x.muscle).toLowerCase().includes(q)) && !seen.has(x.name) && seen.add(x.name));
            html = hits.map(row).join('');
            if (!items.some(x => x.name.toLowerCase() === q)) {
                html += P.muscle === 'All'
                    ? `<div class="px-4 py-4 text-[12px] font-bold text-slate-400">${esc(t('Not in the list? Choose a muscle above, then add "{name}" as your own exercise.', { name: P.q.trim() }))}</div>`
                    : `<button data-on-click="window.appActions.addCustomEx()" class="w-full flex items-center gap-3 px-4 py-4 text-start text-[#d4af37] font-bold text-[13px] tap-feedback"><i data-lucide="plus-circle" class="w-5 h-5"></i>${esc(t('Add "{name}" to {muscle}', { name: P.q.trim(), muscle: tm(P.muscle) }))}</button>`;
            }
        } else if (P.muscle === 'All') {
            // Exercises already used in your routines first, then everything by muscle
            const used = [], seen = new Set();
            appData.weeks.forEach(w => w.schedule.forEach(day => (day.exercises || []).forEach(e => { if (!seen.has(e.name) && e.name && e.name !== 'New Exercise') { seen.add(e.name); used.push({ name: e.name, muscle: e.muscle }); } })));
            if (used.length) html += header(t('In your routines')) + used.map(row).join('');
            muscleOptions.forEach(m => { const list = items.filter(x => x.muscle === m); if (list.length) html += header(tm(m)) + list.map(row).join(''); });
        } else {
            html = items.map(row).join('');
        }
        const list = document.getElementById('picker-list');
        list.innerHTML = html || `<div class="p-10 text-center text-[12px] font-bold text-slate-400">${esc(t('No exercises found'))}</div>`;
        if (window.lucide) window.lucide.createIcons({ root: list });
        const btn = document.getElementById('picker-add-btn');
        btn.classList.toggle('hidden', P.mode !== 'add' || P.sel.length === 0);
        btn.innerText = P.sel.length === 1 ? t('Add 1 exercise') : t('Add {n} exercises', { n: P.sel.length });
    },
    pickerTap: (name, muscle) => {
        const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
        if (P.mode === 'replace') {
            // 1) choose sets & reps for the new exercise, 2) confirm, 3) Undo for a few seconds
            const ex = d.exercises[P.idx]; if (!ex || ex.name === name) return window.appActions.closePicker();
            const timedNew = TIMED_DEFAULT.includes(name), timedOld = isTimed(ex.reps);
            const reps = timedNew && !timedOld ? '30 - 45s' : !timedNew && timedOld ? '10 - 12' : ex.reps;
            window.appState.swapSetup = { idx: P.idx, name, muscle, sets: String(parseInt(ex.sets) || 3), reps };
            window.appActions.renderSwapSetup();
            openModal('swapsetup-overlay', 'swapsetup-box');
            pushBack('swapsetup', () => window.appActions.closeSwapSetup());
            return;
        }
        const i = P.sel.findIndex(x => x.name === name && x.muscle === muscle);
        if (i >= 0) P.sel.splice(i, 1); else P.sel.push({ name, muscle });
        const top = document.getElementById('picker-list').scrollTop;
        window.appActions.renderPicker(false);
        document.getElementById('picker-list').scrollTop = top;
    },
    // ---------- Change exercise: sets & reps pop-up (after picking the new exercise, before the confirmation) ----------
    renderSwapSetup: () => {
        const W = window.appState.swapSetup; if (!W) return;
        const label = 'px-0.5 mb-1.5 text-[12px] font-bold text-slate-400';
        const c = document.getElementById('swapsetup-content');
        c.innerHTML = `<div class="pop-head is-end">
                    <button data-on-click="window.appActions.closeSwapSetup()" class="w-11 h-11 shrink-0 rounded-full bg-white/5 text-slate-400 flex items-center justify-center tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="px-5">
                <div class="text-[12px] font-bold text-[#d4af37]">${esc(tm(W.muscle))}</div>
                <h3 class="ex-name ex-fit text-[24px] font-black text-white leading-tight mt-0.5 whitespace-nowrap overflow-hidden">${esc(tx(W.name))}</h3>
                <p class="text-[12px] font-bold text-slate-400 mt-1">${t('How many sets and reps for this exercise?')}</p>
                <div class="${label} mt-4">${esc(t('Sets'))}</div>
                <div class="flex items-center gap-3 rounded-2xl bg-white/5 p-2" dir="ltr">
                    <button data-on-click="window.appActions.swapSetSets(-1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="−">−</button>
                    <div class="flex-1 text-center text-[22px] font-black text-white tabular-nums num">${esc(W.sets)}</div>
                    <button data-on-click="window.appActions.swapSetSets(1)" class="w-11 h-11 rounded-xl bg-white/5 text-2xl font-black text-white tap-feedback" aria-label="+">+</button>
                </div>
                <div class="${label} mt-3">${esc(t(isTimed(W.reps) ? 'Seconds per set' : 'Reps per set'))}</div>
                <div class="grid grid-cols-4 gap-2" dir="ltr">${REPS_PRESETS.map(r => `<button data-on-click="window.appActions.swapSetReps(@0)" data-a-click="${hArgs(hStr(r))}" class="py-2.5 rounded-xl text-[12px] font-bold tap-feedback ${W.reps === r ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-white'}">${esc(fmtReps(r))}</button>`).join('')}</div>
                <button data-on-click="window.appActions.swapSetupNext()" class="w-full mt-4 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]">${t('Next')}<i data-lucide="${isAR ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i></button>
            </div>`;
        fitNames(c); if (window.lucide) window.lucide.createIcons({ root: c });
    },
    closeSwapSetup: () => { popBack('swapsetup'); window.appState.swapSetup = null; closeModal('swapsetup-overlay', 'swapsetup-box'); },
    swapSetSets: dlt => { const W = window.appState.swapSetup; if (!W) return; W.sets = String(Math.min(10, Math.max(1, (parseInt(W.sets) || 3) + dlt))); window.appActions.renderSwapSetup(); },
    swapSetReps: v => { const W = window.appState.swapSetup; v = latinDigits(String(v)).trim(); if (!W || !v) return; W.reps = v.slice(0, 20); window.appActions.renderSwapSetup(); },
    swapSetupNext: () => {
        const W = window.appState.swapSetup; if (!W) return;
        const d = getActiveSchedule().find(x => x.id === activeDay), ex = d && d.exercises[W.idx];
        if (!ex) return window.appActions.closeSwapSetup();
        const old = { name: ex.name, muscle: ex.muscle, sets: ex.sets, reps: ex.reps }, next = { name: W.name, muscle: W.muscle, sets: W.sets, reps: W.reps };
        window.appActions.showConfirm(t('Change to {name}?', { name: tx(next.name) }), t('{old} will be replaced with {sets} sets of {reps}.', { old: old.name, sets: next.sets, reps: fmtReps(next.reps) + (isTimed(next.reps) && !/s$/i.test(next.reps.trim()) ? 's' : '') }), () => {
            Object.assign(ex, next);
            StorageManager.setPlan(appData);
            window.appActions.closeSwapSetup(); window.appActions.closePicker(); renderWorkout();
            window.appActions.showToast(t('Changed to {name}', { name: tx(next.name) }), 'success', { label: t('Undo'), fn: () => {
                if (!d.exercises.includes(ex)) return;
                Object.assign(ex, old); StorageManager.setPlan(appData); renderWorkout();
            } });
        }, false, t('Change'));
    },
    pickerConfirm: () => {
        const P = window.appState.picker, d = getActiveSchedule().find(x => x.id === activeDay);
        if (!P.sel.length) return;
        const picked = P.sel; P.sel = []; // a double tap can't add them twice
        picked.forEach(x => d.exercises.push(newExercise(x.name, x.muscle)));
        // Give an unnamed day a name from its muscles, e.g. "Chest & Triceps"
        if (!d.title || !d.title.trim() || d.title === 'New Day' || d.title === t('New Day')) {
            const ms = [...new Set(d.exercises.map(e => tm(e.muscle)))].slice(0, 2);
            d.title = ms.join(isAR ? ' و ' : ' & ');
            d.savedTitle = d.title;
        }
        StorageManager.setPlan(appData);
        const n = picked.length;
        window.appActions.closePicker(); renderWorkout(); renderNav(false);
        window.appActions.showToast(n === 1 ? t('1 exercise added') : t('{n} exercises added', { n }), 'success');
    },
    addCustomEx: () => {
        const P = window.appState.picker, name = P.q.trim().slice(0, 60);
        if (!name || P.muscle === 'All') return;
        const list = getCustomEx();
        if (!list.some(x => x.name.toLowerCase() === name.toLowerCase())) { list.push({ name, muscle: P.muscle }); setCustomEx(list); }
        P.q = ''; document.getElementById('picker-search').value = '';
        window.appActions.pickerTap(name, P.muscle);
        if (P.mode === 'add') window.appActions.renderPicker(false);
    },

    // ---------- Edit one exercise in a pop-up (Plan tab) ----------
    openExEdit: i => {
        window.appState.inlineEdit = i; window.appState.customReps = false; renderExEdit();
        openModal('exedit-overlay', 'exedit-box');
        pushBack('exedit', () => window.appActions.closeExEdit());
    },
    refreshExEdit: () => renderExEdit(),
    closeExEdit: () => {
        window.appState.inlineEdit = null; popBack('exedit');
        if (document.getElementById('exedit-overlay').classList.contains('flex')) closeModal('exedit-overlay', 'exedit-box');
    },
    exEditSets: dlt => {
        const ex = getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit];
        if (!ex) return;
        ex.sets = String(Math.min(10, Math.max(1, (parseInt(ex.sets) || 3) + dlt)));
        StorageManager.setPlan(appData); renderWorkout();
    },
    exEditReps: v => {
        const ex = getActiveSchedule().find(x => x.id === activeDay).exercises[window.appState.inlineEdit];
        v = latinDigits(v).trim(); if (!v || !ex) return;
        ex.reps = v.slice(0, 20);
        StorageManager.setPlan(appData); renderWorkout();
    },
    clearDay: () => window.appActions.showConfirm(t("Clear Day"), t("Delete all exercises?"), () => {
        const d = getActiveSchedule().find(x => x.id === activeDay), old = { exercises: d.exercises, title: d.title };
        d.exercises = []; d.title = ""; StorageManager.setPlan(appData); renderWorkout(); renderNav();
        window.appActions.showToast(t('Day cleared'), 'error', { label: t('Undo'), fn: () => { Object.assign(d, old); StorageManager.setPlan(appData); renderWorkout(); renderNav(); } });
    }, true),
    switchTab: tab => {
        if (tab === 'workout') tab = 'today'; if (tab === 'analytics') tab = 'progress';
        if (window.appState.currentView !== tab) dropHint();
        window.appState.inlineEdit = null; window.appState.weekMenu = null; window.appState.todayEdit = false; window.appState.weekEdit = false; window.appState.planDay = null; popBack('planday'); window.appState.currentView = tab;
        const prevTab = document.querySelector('.tab-btn.text-\\[\\#d4af37\\]');
        ['today', 'plan', 'progress', 'profile'].forEach(v => { const b = document.getElementById('tabbtn-' + v); if (b) b.className = `tab-btn py-2.5 flex flex-col items-center gap-1 tap-feedback relative ${v === tab ? 'text-[#d4af37]' : 'text-slate-400'}`; });
        const ic = document.querySelector(`#tabbtn-${tab} svg`);
        if (ic && (!prevTab || prevTab.id !== 'tabbtn-' + tab)) { ic.classList.remove('hop'); void ic.getBoundingClientRect(); ic.classList.add('hop'); }
        document.getElementById('nav-container').style.display = 'none'; // Today and Plan show it inside the day card
        document.getElementById('plan-routines').classList.toggle('hidden', tab !== 'plan');
        document.getElementById('profile-view').classList.toggle('hidden', tab !== 'profile');
        document.getElementById('workout-container').classList.toggle('hidden', tab === 'profile');
        renderNav(); renderWorkout();
        const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
        if (tab === 'profile') renderProfile();
    },
    addWeek: () => { if(appData.weeks.length>=5)return window.appActions.showToast(t("Up to 5 routines"),"error"); const aD=DAY_NAMES, sI=aD.indexOf(StorageManager.getStartDay()); let eS=[]; for(let i=1;i<=7;i++)eS.push({id:i,day:aD[(sI+i-1)%7],title:'New Day',isRest:false,recoveryType:null,exercises:[]}); appData.weeks.push({id:'w_'+Date.now(),name:t('Routine {n}', { n: appData.weeks.length+1 }),schedule:eS}); StorageManager.setPlan(appData); renderSidePanel(); },
    deleteWeek: id => { if(appData.weeks.length<=1)return; window.appActions.showConfirm(t("Delete routine"),t("Delete this routine? Your history is kept."),()=>{appData.weeks=appData.weeks.filter(w=>w.id!==id); if(currentWeekId===id){currentWeekId=appData.weeks[0].id;StorageManager.setActiveWeek(currentWeekId);window.appActions.refreshUI();renderNav();} StorageManager.setPlan(appData); renderSidePanel(); },true); },
    // Today: ✏️ turns the day into the editor (not while a workout runs); Done turns it back
    setTodayEdit: on => {
        if (on && window.appState.sess) return;
        window.appState.todayEdit = !!on; window.appState.weekMenu = null; window.appState.sameAll = false;
        renderWorkout();
        const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
    },
    planWholeWeek: () => { window.appState.todayEdit = false; window.appActions.switchTab('plan'); },
    // Plan: null = the whole week, a day id = that day's editor
    openPlanDay: id => {
        window.appState.planDay = id; window.appState.weekMenu = null; window.appState.sameAll = false; window.appState.inlineEdit = null;
        if (id != null) { activeDay = id; pushBack('planday', () => window.appActions.openPlanDay(null)); } else popBack('planday');
        renderNav(); renderWorkout();
        const sc = document.querySelector('.scrollable-content'); if (sc) sc.scrollTop = 0;
    },
    copyDayFrom: (fromId, toId) => { activeDay = fromId; window.appActions.copyDay(toId); },
    // Copy a routine (e.g. a lighter "deload" week); history is shared, so nothing is lost
    duplicateWeek: id => {
        const w = appData.weeks.find(x => x.id === id); if (!w) return;
        if (appData.weeks.length >= 5) return window.appActions.showToast(t('Up to 5 routines'), 'error');
        appData.weeks.push({ id: 'w_' + Date.now(), name: t('{name} (copy)', { name: t(w.name) }).slice(0, 40), schedule: JSON.parse(JSON.stringify(w.schedule)) });
        StorageManager.setPlan(appData); renderSidePanel();
        window.appActions.showToast(t('Routine duplicated'), 'success');
    },
    // ⋮ menus (a week row, a routine); a tap anywhere outside closes it without pressing what is under it
    toggleWeekMenu: id => window.appActions.toggleMenu('weekMenu', id, renderWorkout),
    toggleRoutineMenu: id => window.appActions.toggleMenu('routineMenu', id, renderSidePanel),
    toggleMenu: (key, id, redraw) => {
        const open = window.appState[key] = window.appState[key] === id ? null : id;
        redraw();
        if (open == null) return;
        const away = e => {
            if (e.target.closest('[role="menu"], [aria-haspopup="menu"]')) return;
            document.removeEventListener('pointerdown', away, true);
            if (window.appState[key] == null) return;
            window.appState[key] = null; e.stopPropagation(); redraw();
            const eat = ev => { ev.stopPropagation(); ev.preventDefault(); };
            document.addEventListener('click', eat, { capture: true, once: true });
            setTimeout(() => document.removeEventListener('click', eat, true), 600);
        };
        setTimeout(() => document.addEventListener('pointerdown', away, true), 0);
    },
    clearDayFrom: id => { activeDay = id; window.appActions.clearDay(); },
    toggleRoutines: (open = !window.appState.routinesOpen) => { window.appState.routinesOpen = open === true; renderSidePanel(); },
    renameWeek: (id, v) => { const w=appData.weeks.find(x=>x.id===id); if(w)w.name=String(v||'').trim().slice(0,40)||t('Unnamed'); StorageManager.setPlan(appData); document.getElementById('active-week-label').innerText=t(appData.weeks.find(x=>x.id===currentWeekId).name); },
    editRoutineName: id => {
        const w = appData.weeks.find(x => x.id === id); if (!w) return;
        openEdit(editHead(t('Rename routine')) + `<form data-on-submit="event.preventDefault(); window.appActions.renameWeek(@0, document.getElementById('edit-routine').value); window.appActions.closeEdit(); window.appActions.toggleRoutines(true)" data-a-submit="${hArgs(hStr(id))}">
                <input id="edit-routine" type="text" maxlength="40" value="${esc(t(w.name))}" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-white/30" dir="auto" aria-label="${esc(t('Rename routine'))}">
                <button type="submit" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Save')}</button></form>`);
        setTimeout(() => { const i = document.getElementById('edit-routine'); if (i) { i.focus(); i.select(); } }, 320);
    },
    toggleWeekEdit: () => { window.appState.weekEdit = !window.appState.weekEdit; window.appState.weekMenu = null; renderWorkout(); },
    switchWeek: id => { currentWeekId=id; StorageManager.setActiveWeek(id); activeDay=getTodayId(); window.appState.inlineEdit=null; window.appState.planDay=null; renderNav(); renderWorkout(); },
    setActiveDay: id => { window.appState.inlineEdit=null; window.appState.weekMenu=null; if (window.appState.currentView==='today') window.appState.todayEdit=false; else if (window.appState.planDay!=null) window.appState.planDay=id; activeDay=id; renderNav(); renderWorkout(); },
    toggleRpe: v => { StorageManager.setShowRpe(v); window.appActions.showToast(t(v ? 'RPE column on' : 'RPE column off'), 'success'); },
restoreDefaults: () => { window.appActions.showConfirm(t("Reset app"),t("Your routines go back to the default. Your history is kept."),()=>{const aD=DAY_NAMES, sI=aD.indexOf('SAT'); const def=JSON.parse(JSON.stringify(defaultWorkoutData)); def.forEach((d,i)=>d.day=aD[(sI+i)%7]); appData={weeks:[{id:'w_default',name:t('Main Routine'),schedule:def}]}; currentWeekId='w_default'; StorageManager.setActiveWeek('w_default'); StorageManager.setPlan(appData); StorageManager.setStartDay('SAT'); document.getElementById('setting-start-day').value='SAT'; activeDay=getTodayId(); renderNav(); window.appActions.refreshUI(); window.appActions.showToast(t("Reset Complete"));},true); },
    // ---------- First-launch setup (also from Profile → Set up again) ----------
    // 🧭 SETUP, one question per screen, nothing can be skipped.
    //   'first'    first launch: your profile (sex, date of birth, height and weight), then your training, then the program
    //   'complete' set up before but some answers are missing (older versions): only those questions
    initOnboarding: () => {
        const W = window.appState.wiz;
        if (W && !W.done && document.getElementById('onboarding-overlay').classList.contains('flex')) return; // already open
        if (!StorageManager.getOnboard()) return window.appActions.startWizard('first');
        if (setupMissing().length) window.appActions.startWizard('complete');
    },
    startWizard: (mode = 'first') => {
        let hasLang = false; try { hasLang = localStorage.getItem(LANG_KEY) !== null; } catch (e) {}
        const pr = getProfile(), b = getBody();
        const steps = mode === 'first' ? [...(hasLang ? [] : ['lang']), ...PROFILE_STEPS.filter(k => !(b.locked && setupAnswered(k))), ...TRAINING_STEPS, 'start', 'result']
            : setupMissing();
        window.appState.wiz = { mode, firstRun: true, steps, step: 0, showAll: false,
            goal: pr.goal || null, days: pr.days || null, exp: EXP_LEVELS.includes(pr.exp) ? pr.exp : null, eq: pr.eq || null,
            session: pr.session || null };
        window.appActions.renderWizard();
        openModal('onboarding-overlay', 'onboarding-box');
        // phone Back: the previous question; on the first one it closes only when that's allowed
        const onBack = () => {
            const W = window.appState.wiz;
            if (W && W.step > 0) { window.appActions.wizBack(); pushBack('wizard', onBack); }
            else if (W && !W.firstRun) closeModal('onboarding-overlay', 'onboarding-box', 300);
            else pushBack('wizard', onBack);
        };
        pushBack('wizard', onBack);
    },
    renderWizard: () => {
        const W = window.appState.wiz, key = W.steps[W.step], b = getBody();
        // how far the setup got (for the admin page), until it is finished
        try { const sv = localStorage.getItem(SETUP_KEY); if (!sv || sv.startsWith('left:')) localStorage.setItem(SETUP_KEY, 'left:' + key); } catch (e) {}
        const opt = (val, title, sub, icon, cur) => `<button data-on-click="window.appActions.wizChoose(@0, @1)" data-a-click="${hArgs(hStr(key), hStr(val))}" class="w-full flex items-center gap-4 p-4 mb-3 rounded-2xl border text-start tap-feedback ${cur === val ? 'bg-[#d4af37]/15 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                ${icon ? `<span class="w-11 h-11 shrink-0 rounded-xl bg-black/40 flex items-center justify-center text-[#d4af37]"><i data-lucide="${icon}" class="w-5 h-5"></i></span>` : ''}
                <span class="flex-1 min-w-0"><span class="block text-[16px] font-black text-white">${title}</span>${sub ? `<span class="block text-[12px] font-bold text-slate-400 mt-0.5">${sub}</span>` : ''}</span>
                <i data-lucide="chevron-right" class="w-5 h-5 text-slate-600 shrink-0"></i></button>`;
        const part = PROFILE_STEPS.includes(key) ? t('Your profile') : TRAINING_STEPS.includes(key) || key === 'start' ? t('Your training') : key === 'result' ? t('Your program') : '';
        const head = (title, sub) => `${part ? `<div class="text-[12px] font-bold text-[#d4af37] mb-2">${part}</div>` : ''}<h2 class="text-[26px] font-black text-white leading-tight mb-2">${title}</h2>${sub ? `<p class="text-[13px] font-bold text-slate-400 mb-6">${sub}</p>` : '<div class="mb-6"></div>'}`;
        const next = (id, label = t('Next')) => `<button id="${id}" data-on-click="window.appActions.wizChoose(@0, 'next')" data-a-click="${hArgs(hStr(key))}" class="w-full mt-6 py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${label}</button>`;
        const lastLabel = W.step === W.steps.length - 1 && W.mode === 'complete' ? t('Done') : t('Next');
        const big = 'w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-white text-[22px] font-black outline-none focus:border-[#d4af37] num';
        const lockNote = `<p class="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mt-4"><i data-lucide="lock" class="w-3.5 h-3.5 shrink-0"></i>${t("Date of birth, sex and height can't be changed after setup.")}</p>`;
        let body = '';
        if (key === 'lang') body = `<div class="text-center mb-8 mt-6"><div class="text-4xl font-black italic tracking-tighter text-white logo-mark" dir="ltr">APEX <span class="text-[#d4af37]">LIFT</span></div></div>` + head('Choose your language · اختر لغتك', '') + opt('en', 'English', '', 'languages', LANG) + opt('ar', 'العربية', '', 'languages', LANG);
        if (key === 'sex') body = head(t("What's your sex?"), t('Helps pick the right program for you.')) + opt('male', t('Male'), '', 'user-round', b.sex) + opt('female', t('Female'), '', 'user-round', b.sex) + lockNote;
        if (key === 'birth') {
            const n = new Date(), iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const max = iso(new Date(n.getFullYear() - MIN_AGE, n.getMonth(), n.getDate())), min = iso(new Date(n.getFullYear() - 100, 0, 1));
            body = head(t('When were you born?'), t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }))
                + `<input id="wiz-birth" type="date" min="${min}" max="${max}" value="${esc(b.birthDate || '')}" class="${big}" dir="ltr" aria-label="${esc(t('Date of birth'))}">` + lockNote + next('wiz-birth-next', lastLabel);
        }
        if (key === 'body') {
            const hLocked = !!(b.locked && b.heightCm);
            const unit = (id, label, val, u, mode, dis) => `<label class="block flex-1 min-w-0"><span class="block text-[12px] font-bold text-slate-400 mb-1.5">${label}</span>
                    <span class="relative block"><input id="${id}" type="text" inputmode="${mode}" autocomplete="off" value="${val === undefined ? '' : esc(val)}" ${dis ? 'disabled' : ''} class="${big} pe-14 ${dis ? 'opacity-60' : ''}" dir="ltr">
                    <span class="absolute inset-y-0 end-0 pe-4 flex items-center text-[14px] font-bold text-slate-400 pointer-events-none" dir="ltr">${u}</span></span></label>`;
            body = head(t('Height and weight'), t('Starts your body weight chart and BMI in Progress.'))
                + `<div class="flex gap-3">${unit('wiz-height', t('Height'), b.heightCm, 'cm', 'numeric', hLocked)}${unit('wiz-weight', t('Weight'), b.weightKg, 'kg', 'decimal', false)}</div>` + lockNote + next('wiz-body-next', lastLabel);
        }
        if (key === 'goal') body = head(t("What's your main goal?"), '')
            + opt('muscle', t('Build muscle'), t('Get bigger and more defined'), 'dumbbell', W.goal) + opt('strength', t('Get stronger'), t('Lift heavier on the big lifts'), 'trophy', W.goal) + opt('fat', t('Lose fat'), t('Stay strong while you lean out'), 'flame', W.goal);
        if (key === 'exp') body = head(t('How long have you been training?'), '')
            + opt('none', t("I'm just starting"), t('Never trained, or back after a long break'), 'sparkles', W.exp)
            + opt('new', t('Less than 1 year'), '', 'sprout', W.exp) + opt('mid', t('1 to 3 years'), '', 'trending-up', W.exp)
            + opt('adv', t('3 to 5 years'), '', 'flame', W.exp) + opt('pro', t('More than 5 years'), '', 'trophy', W.exp);
        if (key === 'days') body = head(t('How many days a week can you train?'), t('Pick what you can keep up every week.'))
            + ['3', '4', '5', '6'].map(d => opt(d, t('{n} days', { n: d }), '', 'calendar-days', W.days)).join('');
        if (key === 'session') body = head(t('How long is each workout?'), t('Shorter workouts get fewer exercises a day.'))
            + SESSION_OPTS.map(m => opt(m, t(m === '90' ? '90+ minutes' : '{n} minutes', { n: m }), '', 'timer', W.session)).join('');
        if (key === 'eq') body = head(t('Where do you train?'), '')
            + opt('gym', t('Full gym'), t('Barbells, machines and cables'), 'building-2', W.eq) + opt('db', t('Dumbbells only'), t('Home or a small gym'), 'dumbbell', W.eq);
        if (key === 'start') body = head(t('Which day does your week start?'), '')
            + ['SAT', 'SUN', 'MON'].map(d => opt(d, esc(dayLong(d)), '', 'calendar', StorageManager.getStartDay())).join('');
        if (key === 'result') {
            const rec = PROGRAMS.find(p => p.id === recommendProgram({ ...W, sex: getBody().sex })), pick = PROGRAMS.find(p => p.id === (W.pick || rec.id));
            const card = (p, isRec) => `<button data-on-click="window.appActions.wizPick(@0)" data-a-click="${hArgs(hStr(p.id))}" class="w-full text-start p-4 mb-3 rounded-2xl border tap-feedback ${pick.id === p.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-white/5 border-white/10'}">
                    <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} days', { n: p.days })}</span></span>
                    ${isRec ? `<span class="inline-block mt-1 text-[12px] font-bold text-[#22c55e]">★ ${t('Recommended for you')}</span>` : ''}
                    <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>${pick.id === p.id ? programPreviewHTML(p) : ''}</button>`;
            // the program made for you, or an empty week to fill in yourself
            body = head(t('Your program'), t('Tap a program to see its week.')) + card(rec, true)
                + `<button data-on-click="window.appActions.wizFinish('own')" class="w-full py-3.5 mb-3 rounded-xl bg-white/5 border border-white/10 text-[13px] font-bold text-white tap-feedback flex items-center justify-center gap-2"><i data-lucide="pencil-ruler" class="w-4 h-4 text-slate-400"></i>${t("I'll build my own")}</button>`
                + `<div class="sticky bottom-0 pt-3 pb-1 bg-[#12100d]"><button data-on-click="window.appActions.wizFinish('program')" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback">${t('Start with this program')}</button>
                       <p class="text-[12px] font-bold text-slate-400 text-center mt-2">${t('You can change any day or exercise later in Plan.')}</p></div>`;
        }
        const dots = W.steps.map((_, i) => `<span class="h-1.5 rounded-full transition-all ${i === W.step ? 'w-6 bg-[#d4af37]' : i < W.step ? 'w-3 bg-[#d4af37]/50' : 'w-3 bg-white/15'}"></span>`).join('');
        document.getElementById('onboarding-box').innerHTML = `
                <div class="flex items-center justify-between py-4 shrink-0">
                    ${backBtn('window.appActions.wizBack()', t('Go back'), W.step === 0 ? 'invisible' : '')}
                    <div class="flex gap-1.5 flex-wrap justify-center max-w-[70%]" dir="ltr">${dots}</div>
                    <button data-on-click="window.appActions.closeWizard()" class="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-slate-300 tap-feedback ${W.firstRun ? 'invisible' : ''}" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                <div class="flex-1 fade-in">${body}</div>`;
        if (window.lucide) window.lucide.createIcons({ root: document.getElementById('onboarding-box') });
        document.getElementById('onboarding-box').scrollTop = 0;
    },
    wizChoose: (key, val) => {
        const W = window.appState.wiz, err = m => window.appActions.showToast(m, 'error');
        if (key === 'lang') {
            writeItem(LANG_KEY, val);
            if (val !== LANG) return location.reload(); // the setup starts again in the chosen language
        } else if (key === 'sex') setBody({ ...getBody(), sex: val });
        else if (key === 'birth') {
            const v = (document.getElementById('wiz-birth') || {}).value || '', b = getBody();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return err(t('Enter your date of birth.'));
            const age = ageOf({ birthDate: v });
            if (age < MIN_AGE) return err(t('Apex Lift is for ages {n} and up.', { n: MIN_AGE }));
            if (age > 100) return err(t('Check your date of birth.'));
            if (b.locked && b.birthYear && +v.slice(0, 4) !== b.birthYear) return err(t('This has to match the birth year on your profile ({y}).', { y: b.birthYear }));
            setBody({ ...b, birthDate: v });
        } else if (key === 'body') {
            const b = getBody(), num = id => parseFloat(latinDigits((document.getElementById(id) || {}).value || '').replace(/[٫،,]/g, '.'));
            const h = b.locked && b.heightCm ? b.heightCm : num('wiz-height'), w = num('wiz-weight');
            if (!(h >= 100 && h <= 250)) return err(t('Enter your height in cm (100–250).'));
            if (!(w >= 25 && w <= 350)) return err(t('Enter your weight in kg (25–350).'));
            const log = (b.log || []).filter(x => dateKey(x.t) !== dateKey()); log.push({ t: Date.now(), kg: w });
            setBody({ ...b, heightCm: Math.round(h), weightKg: Math.round(w * 10) / 10, log });
        } else if (key === 'start') {
            setWeekStart(val);
            const sel = document.getElementById('setting-start-day'); if (sel) sel.value = val;
            activeDay = getTodayId();
        } else W[key] = val;
        W.pick = null;
        if (W.step >= W.steps.length - 1 && W.mode === 'complete') return window.appActions.wizFinish('complete');
        W.step = Math.min(W.step + 1, W.steps.length - 1);
        window.appActions.renderWizard();
    },
    wizBack: () => { const W = window.appState.wiz; if (W.step > 0) { W.step--; window.appActions.renderWizard(); } },
    wizPick: id => { window.appState.wiz.pick = id; window.appActions.renderWizard(); },
    // ✕ (only for Update training): close, nothing changes. force = close a required setup (done, or another phone finished it)
    closeWizard: (force = false) => {
        const W = window.appState.wiz; if (!W || (W.firstRun && !force)) return;
        popBack('wizard'); closeModal('onboarding-overlay', 'onboarding-box', 300);
    },
    // the setup always ends with the chosen program
    wizFinish: (mode, sure = false) => {
        const W = window.appState.wiz;
        if (W.done) return; // double tap
        // the training answers are kept, and the profile is locked once it is complete
        const saveAnswers = () => {
            const keep = getProfile();
            writeItem(PROFILE_KEY, JSON.stringify(sanitizeProfile({ ...keep, goal: W.goal, days: W.days, exp: W.exp, eq: W.eq, session: W.session })));
            const b = getBody(); if (PROFILE_STEPS.every(k => setupAnswered(k, b)) && !b.locked) setBody({ ...b, locked: true });
        };
        if (mode === 'complete') {
            W.done = true; saveAnswers(); StorageManager.setOnboard();
            window.appActions.closeWizard(true);
            if (window.appState.currentView === 'profile') renderProfile();
            return window.appActions.showToast(t('Profile updated'), 'success');
        }
        if (mode !== 'program' && mode !== 'own') return;
        // already 5 routines: the current one would be replaced, so ask first
        if (!sure && !W.firstRun && appData.weeks.length >= 5)
            return window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), () => window.appActions.wizFinish(mode, true), true);
        W.done = true;
        try { localStorage.setItem(SETUP_KEY, mode); } catch (e) {}
        saveAnswers();
        StorageManager.setOnboard();
        popBack('wizard');
        closeModal('onboarding-overlay', 'onboarding-box', 300);
        if (mode === 'own') {
            // an empty week (every day empty), then Plan to fill it in
            const start = DAY_NAMES.indexOf(StorageManager.getStartDay());
            const empty = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, day: DAY_NAMES[(start + i) % 7], title: 'New Day', isRest: false, recoveryType: null, exercises: [] }));
            putRoutine(t('My routine'), empty, { replace: W.firstRun });
            return window.appActions.switchTab('plan');
        }
        window.appActions.applyProgram(W.pick || recommendProgram({ ...W, sex: getBody().sex }), { exp: W.exp, replace: W.firstRun });
    },
    // Put a program into the app: as a new routine (keeps your current one) or replacing the current one
    applyProgram: (id, { exp = (getProfile().exp || 'mid'), replace = false, undo = false } = {}) => {
        const prog = PROGRAMS.find(p => p.id === id); if (!prog) return;
        if (window.appState.programBusy === id) return; // double tap: add it only once
        window.appState.programBusy = id; setTimeout(() => { if (window.appState.programBusy === id) window.appState.programBusy = null; }, 1000);
        putRoutine(t(prog.name), programSchedule(prog, exp), { replace, undo });
    },
    // ---------- Program gallery (Plan → Programs): list → preview page (every day and exercise) → use it ----------
    openPrograms: () => {
        window.appState.progPick = null;
        window.appActions.renderPrograms();
        openSheet('programs-overlay', 'programs-box');
        pushBack('programs', () => window.appActions.closePrograms());
    },
    closePrograms: () => { popBack('programs'); popBack('progpreview'); closeSheet('programs-overlay', 'programs-box'); },
    previewProgram: id => {
        window.appState.progPick = id; window.appState.progExp = getProfile().exp || 'mid';
        window.appActions.renderPrograms();
        if (id) pushBack('progpreview', () => window.appActions.previewProgram(null)); else popBack('progpreview');
    },
    setProgramLevel: v => { window.appState.progExp = v; const top = document.getElementById('programs-list').scrollTop; window.appActions.renderPrograms(); document.getElementById('programs-list').scrollTop = top; },
    renderPrograms: () => {
        const list = document.getElementById('programs-list'), pick = PROGRAMS.find(p => p.id === window.appState.progPick);
        document.getElementById('programs-title').innerText = pick ? t('Program preview') : t('Programs');
        if (!pick) {
            list.innerHTML = `<button data-on-click="window.appActions.closePrograms(); setTimeout(window.appActions.openAI, 320)" class="w-[calc(100%-2rem)] mx-4 mb-3 p-4 rounded-2xl border bg-white/5 border-white/10 text-start tap-feedback flex items-center gap-3">
                    <span class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-[#d4af37] shrink-0"><i data-lucide="sparkles" class="w-5 h-5"></i></span>
                    <span class="flex-1 min-w-0"><span class="block text-[16px] font-black text-white">${t('Build with Apex Coach')}</span><span class="block text-[12px] font-bold text-slate-400 mt-1">${t('Tell it what you want: it builds a program from your answers and workouts.')}</span></span>
                    <i data-lucide="${isAR ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5 text-slate-400 shrink-0"></i>
                </button>` + PROGRAMS.map(p => `<button data-on-click="window.appActions.previewProgram(@0)" data-a-click="${hArgs(hStr(p.id))}" class="w-[calc(100%-2rem)] mx-4 mb-3 p-4 rounded-2xl border bg-white/5 border-white/10 text-start tap-feedback flex items-center gap-3">
                    <span class="flex-1 min-w-0">
                        <span class="flex items-center justify-between gap-2"><span class="text-[16px] font-black text-white">${esc(t(p.name))}</span><span class="text-[12px] font-bold text-slate-400 shrink-0">${t('{n} days', { n: p.days })}${p.eq === 'db' ? ' · ' + t('Dumbbells only') : ''}</span></span>
                        <span class="block text-[12px] font-bold text-slate-400 mt-1">${esc(t(p.desc))}</span>
                        ${programPreviewHTML(p)}
                    </span>
                    <i data-lucide="${isAR ? 'chevron-left' : 'chevron-right'}" class="w-5 h-5 text-slate-400 shrink-0"></i>
                </button>`).join('') + `<p class="mx-6 mb-6 text-[12px] font-bold text-slate-400">${t('Your current routine and all your history are kept.')}</p>`;
        } else {
            const exp = window.appState.progExp || 'mid', sched = programSchedule(pick, exp), full = appData.weeks.length >= 5;
            const lvl = (v, l) => `<button data-on-click="window.appActions.setProgramLevel(@0)" data-a-click="${hArgs(hStr(v))}" class="flex-1 py-2 rounded-xl text-[12px] font-bold tap-feedback ${exp === v ? 'bg-[#d4af37] text-black' : 'bg-white/5 text-slate-300'}">${t(l)}</button>`;
            list.innerHTML = `<div class="px-4 pb-4">
                    <button data-on-click="window.appActions.previewProgram(null)" class="flex items-center gap-1 mb-3 text-[12px] font-bold text-slate-400 tap-feedback"><i data-lucide="${isAR ? 'chevron-right' : 'chevron-left'}" class="w-4 h-4"></i>${t('All programs')}</button>
                    <h2 class="text-[24px] font-black text-white leading-tight">${esc(t(pick.name))}</h2>
                    <p class="text-[13px] font-bold text-slate-400 mt-1">${esc(t(pick.desc))}</p>
                    <div class="text-[12px] font-bold text-slate-300 mt-2">${t('{n} training days', { n: pick.days })} · ${pick.eq === 'db' ? t('Dumbbells only') : t('Full gym')}</div>
                    ${programPreviewHTML(pick)}
                    <div class="mt-4 mb-1.5 px-0.5 text-[12px] font-bold text-slate-400">${t('Level')}</div>
                    <div class="flex gap-2 mb-4">${lvl('new', 'Beginner')}${lvl('mid', 'Intermediate')}${lvl('adv', 'Advanced')}</div>
                    <div class="space-y-2">${sched.map(programDayCardHTML).join('')}</div>
                </div>
                <div class="sticky bottom-0 bg-[#111] border-t border-white/10 px-4 pt-3" style="padding-bottom: max(1rem, env(safe-area-inset-bottom));">
                    <p class="text-[12px] font-bold text-slate-400 mb-2 text-center">${full ? t('It replaces your current routine. Your history is kept.') : t('It is added as a new routine. Your current routine and history are kept.')}</p>
                    <button data-on-click="window.appActions.useProgram(@0)" data-a-click="${hArgs(hStr(pick.id))}" class="w-full py-4 rounded-2xl bg-[#d4af37] text-black text-[14px] font-black tap-feedback flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)]"><i data-lucide="check" class="w-5 h-5"></i>${t('Use this program')}</button>
                </div>`;
        }
        list.scrollTop = 0;
        if (window.lucide) window.lucide.createIcons({ root: list });
    },
    useProgram: id => {
        const exp = window.appState.progExp || getProfile().exp || 'mid';
        const go = () => { window.appActions.closePrograms(); window.appActions.applyProgram(id, { exp, replace: appData.weeks.length >= 5, undo: true }); };
        if (appData.weeks.length >= 5) window.appActions.showConfirm(t('Replace current routine?'), t('You have 5 routines (the most). The current one will be replaced; your history is kept.'), go, true);
        else go();
    }
};

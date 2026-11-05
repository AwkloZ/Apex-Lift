// Apex Lift app (index.html), part 10 of 13: Sharing a routine with an 8-letter code.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see app/README in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🔗 ROUTINE CODES: share one routine with a friend by an 8-letter code. The routine is copied to shared/{code}
// (no workouts or personal details, just the days and exercises); anyone signed in who has the code can add it.
// Letters that look alike (0/O, 1/I) are left out so a code can be read aloud. A link with ?r=CODE opens it too.
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
const SHARED_KEY = 'workoutSharedCodes_rakan_final'; // routine id → { code, sig }: the same routine, unchanged, keeps its code
const PENDING_CODE = 'workoutPendingCode';
const newCode = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, x => CODE_ABC[x % 32]).join(''); };
const cleanCode = v => { const c = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return CODE_RE.test(c) ? c : ''; };
const fmtCode = c => `${c.slice(0, 4)}-${c.slice(4)}`;
const codeLink = c => `${location.origin}${location.pathname}?r=${c}`;
const withTimeout = (p, ms = 12000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'unavailable' })), ms))]);
const sharedRoutine = w => JSON.parse(JSON.stringify({ name: cut(w.name, 60, 'Routine'), schedule: w.schedule.map(d => ({ day: d.day, title: d.title, isRest: d.isRest === true, recoveryType: d.recoveryType || null,
    exercises: (d.exercises || []).slice(0, 60).map(e => ({ name: e.name, muscle: e.muscle, sets: e.sets, reps: e.reps })) })) }));
// A friend's routine, moved onto your week: each workout stays on its weekday, starting from your first day of the week
const alignToMyWeek = schedule => {
    const aD = DAY_NAMES, idx = aD.indexOf(StorageManager.getStartDay()), byDay = {};
    schedule.forEach(d => { byDay[d.day] = d; });
    const list = Object.keys(byDay).length === 7 ? aD.map((_, i) => byDay[aD[(idx + i) % 7]]) : schedule;
    return list.map((d, i) => ({ ...d, id: i + 1, day: aD[(idx + i) % 7] }));
};
const codeErr = e => (e && (e.code === 'unavailable' || /offline|network/i.test(e.message || ''))) || navigator.onLine === false
    ? t('No internet connection. Try again when online.') : t('Something went wrong. Please try again.');
const codeSheet = (title, body) => {
    document.getElementById('code-title').textContent = title;
    const b = document.getElementById('code-body'); b.innerHTML = body;
    if (window.lucide) window.lucide.createIcons({ root: b });
    const o = document.getElementById('code-overlay');
    if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openSheet('code-overlay', 'code-box'); pushBack('code', () => window.appActions.closeCodeSheet()); }
};
const shareBody = (w, code) => `<p class="text-[13px] font-bold text-slate-400 mb-4 leading-snug">${t('Share the link, or your friend can enter the code in Plan → My routines.')}</p>
        <div class="rounded-2xl bg-black/40 border border-white/10 py-6 px-4 text-center mb-4">
            <div class="text-[12px] font-bold text-slate-400 mb-2 truncate">${esc(t(w.name))}</div>
            ${code ? `<div class="code-big" dir="ltr">${fmtCode(code)}</div>` : `<div class="flex items-center justify-center gap-2 h-[41px] text-[13px] font-bold text-slate-400"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>${t('Creating code…')}</div>`}
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4">
            <button onclick="window.appActions.copyCode(${jsArg(code)})" ${code ? '' : 'disabled'} class="py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="copy" class="w-4 h-4"></i>${t('Copy code')}</button>
            <button onclick="window.appActions.sendCode(${jsArg(code)}, ${jsArg(t(w.name))})" ${code ? '' : 'disabled'} class="py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[12px] font-bold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="share" class="w-4 h-4"></i>${t('Share')}</button>
        </div>
        <p class="text-[12px] font-bold text-slate-400 leading-snug flex gap-2"><i data-lucide="lock" class="w-4 h-4 shrink-0"></i><span>${t('Only the routine is shared. Your workouts and details stay private.')}</span></p>`;
const findBody = (code = '') => `<p class="text-[13px] font-bold text-slate-400 mb-4 leading-snug">${t('Type or paste the code a friend gave you.')}</p>
        <input id="code-in" type="text" value="${esc(code ? fmtCode(code) : '')}" maxlength="12" placeholder="ABCD-EFGH" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" class="code-input"
            oninput="window.appActions.codeTyped(this)" onkeydown="if(event.key==='Enter')window.appActions.codeFind()">
        <button id="code-find" onclick="window.appActions.codeFind()" class="w-full mt-3 py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2"><i data-lucide="search" class="w-4 h-4"></i>${t('Find routine')}</button>
        <div id="code-result" class="mt-4"></div>`;
// After a code is found: the routine and Add only (the search is gone), with a small link back to it
const foundBody = (code, wk) => `<div class="flex items-center justify-between gap-2 mb-3">
            <span class="flex items-center gap-2 text-[13px] font-bold text-[#22c55e]"><i data-lucide="check-circle" class="w-4 h-4"></i>${t('Routine found')} · <span class="text-slate-300" dir="ltr">${fmtCode(code)}</span></span>
            <button onclick="window.appActions.openCodeSheet(${jsArg(code)})" class="shrink-0 text-[12px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Use another code')}</button>
        </div>${previewHTML(wk)}`;
const previewHTML = wk => {
    const work = wk.schedule.filter(d => !d.isRest && d.exercises.length), exN = work.reduce((a, d) => a + d.exercises.length, 0), full = appData.weeks.length >= 5;
    return `<div class="glass-card p-4 border border-[#d4af37]/30 p-pop">
            <div class="text-[17px] font-black text-white truncate">${esc(t(wk.name))}</div>
            <div class="text-[12px] font-bold text-slate-400 mb-3">${t('{a} workout days · {b} exercises', { a: work.length, b: exN })}</div>
            <div class="space-y-1.5">${wk.schedule.map(d => `<div class="flex items-center gap-3 text-[13px]"><span class="w-10 shrink-0 font-black text-slate-400">${esc(dayShort(d.day))}</span><span class="flex-1 min-w-0 truncate font-bold ${d.isRest ? 'text-slate-400' : 'text-white'}">${esc(t(d.isRest ? (d.recoveryType === 'active' ? 'Active Rest' : 'Complete Rest') : d.title))}</span>${d.isRest ? '' : `<span class="shrink-0 text-[12px] font-bold text-slate-400">${t('{n} exercises', { n: d.exercises.length })}</span>`}</div>`).join('')}</div>
        </div>
        ${full ? `<p class="text-[12px] font-bold text-red-400 mt-3">${t('You have 5 routines, the maximum. Delete one in Plan first.')}</p>` : ''}
        <button onclick="window.appActions.codeAdd()" ${full ? 'disabled' : ''} class="w-full mt-3 py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-40"><i data-lucide="plus" class="w-4 h-4"></i>${t('Add to my routines')}</button>`;
};
// a ?r=CODE link: remember it, clean the address bar, and open it once you're signed in
try { const u = new URL(location.href), c = cleanCode(u.searchParams.get('r')); if (c) { sessionStorage.setItem(PENDING_CODE, c); u.searchParams.delete('r'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } } catch (e) {}
const openPendingCode = () => {
    let c = ''; try { c = sessionStorage.getItem(PENDING_CODE) || ''; sessionStorage.removeItem(PENDING_CODE); } catch (e) {}
    if (cleanCode(c)) setTimeout(() => { window.appActions.openCodeSheet(c); window.appActions.codeFind(); }, 600);
};
Object.assign(window.appActions, {
    closeCodeSheet: () => { popBack('code'); closeSheet('code-overlay', 'code-box'); },
    openCodeSheet: (code = '') => { window.appState.codeFound = null; codeSheet(t('Add a routine by code'), findBody(cleanCode(code))); },
    // keeps the code tidy while typing: capitals, a dash after 4 letters
    codeTyped: el => { const c = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); el.value = c.length > 4 ? fmtCode(c) : c; },
    codeFind: async () => {
        const inp = document.getElementById('code-in'), res = document.getElementById('code-result'), btn = document.getElementById('code-find'); if (!inp || !res) return;
        const code = cleanCode(inp.value);
        if (!code) { res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('A code has 8 letters and numbers, like ABCD-EFGH.')}</p>`; return; }
        if (!Cloud.user || !Cloud.db) { res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('Sign in to use routine codes.')}</p>`; return; }
        if (btn) btn.disabled = true;
        res.innerHTML = `<div class="flex items-center justify-center gap-2 py-4 text-[13px] font-bold text-slate-400"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>${t('Looking for the routine…')}</div>`;
        if (window.lucide) window.lucide.createIcons({ root: res });
        try {
            const snap = await withTimeout(Cloud.db.doc(`shared/${code}`).get({ source: 'server' }));
            const r = snap.exists ? (snap.data() || {}).routine : null;
            const clean = isObj(r) && Array.isArray(r.schedule) ? sanitizePlan({ weeks: [{ id: 'w_' + Date.now(), name: r.name, schedule: r.schedule }] }) : null;
            if (!clean) { window.appState.codeFound = null; res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${t('No routine found for this code. Check it and try again.')}</p>`; return; }
            const wk = clean.weeks[0]; wk.schedule = alignToMyWeek(wk.schedule);
            window.appState.codeFound = wk;
            codeSheet(t('Add a routine by code'), foundBody(code, wk));
        } catch (e) { console.warn('Routine code', e); res.innerHTML = `<p class="text-[12px] font-bold text-red-400">${esc(codeErr(e))}</p>`; }
        finally { if (btn) btn.disabled = false; }
    },
    codeAdd: () => {
        const wk = window.appState.codeFound; if (!wk) return;
        if (appData.weeks.length >= 5) return window.appActions.showToast(t('Up to 5 routines'), 'error');
        if (window.appState.sess) return window.appActions.showToast(t('Finish your workout first.'), 'error');
        const prev = currentWeekId;
        appData.weeks.push(wk); currentWeekId = wk.id;
        StorageManager.setPlan(appData); StorageManager.setActiveWeek(wk.id);
        window.appState.codeFound = null;
        window.appActions.closeCodeSheet();
        activeDay = getTodayId(); renderSidePanel(); window.appActions.switchTab('today');
        window.appActions.showToast(t('Routine added and set as active'), 'success', { label: t('Undo'), fn: () => {
            appData.weeks = appData.weeks.filter(w => w.id !== wk.id);
            currentWeekId = appData.weeks.some(w => w.id === prev) ? prev : appData.weeks[0].id;
            StorageManager.setPlan(appData); StorageManager.setActiveWeek(currentWeekId); renderSidePanel(); renderNav(); renderWorkout();
        } });
    },
    // Edit → a routine's share button: make (or reuse) its code
    shareWeek: async id => {
        const w = appData.weeks.find(x => x.id === id); if (!w) return;
        if (!Cloud.user || !Cloud.db) return window.appActions.showToast(t('Sign in to use routine codes.'), 'error');
        const routine = sharedRoutine(w), sig = JSON.stringify(routine);
        const saved = readJSON(SHARED_KEY, {}), mine = isObj(saved) && isObj(saved[id]) && saved[id].sig === sig ? cleanCode(saved[id].code) : '';
        if (mine) return codeSheet(t('Share routine'), shareBody(w, mine));
        codeSheet(t('Share routine'), shareBody(w, ''));
        try {
            if (navigator.onLine === false) throw Object.assign(new Error('offline'), { code: 'unavailable' });
            let code = '';
            // a new random code; if it is already taken the database says no and we pick another
            for (let i = 0; i < 3 && !code; i++) {
                const c = newCode();
                try { await withTimeout(Cloud.db.doc(`shared/${c}`).set({ v: 1, routine, by: Cloud.user.uid, createdAt: Date.now() })); code = c; }
                catch (e) { if (e.code !== 'permission-denied' || i === 2) throw e; }
            }
            const all = isObj(saved) ? saved : {};
            all[id] = { code, sig };
            Object.keys(all).forEach(k => { if (!appData.weeks.some(x => x.id === k)) delete all[k]; });
            try { localStorage.setItem(SHARED_KEY, JSON.stringify(all)); } catch (e) {}
            if (document.getElementById('code-overlay').classList.contains('flex')) codeSheet(t('Share routine'), shareBody(w, code));
        } catch (e) {
            console.warn('Share routine', e);
            window.appActions.closeCodeSheet();
            window.appActions.showToast(codeErr(e), 'error');
        }
    },
    copyCode: async code => {
        if (!cleanCode(code)) return;
        try { await navigator.clipboard.writeText(fmtCode(code)); window.appActions.showToast(t('Code copied'), 'success'); }
        catch (e) { window.appActions.showToast(t('Could not copy. Use Share instead.'), 'error'); }
    },
    sendCode: async (code, name) => {
        if (!cleanCode(code)) return;
        const text = t('Try my "{name}" routine in Apex Lift. Code: {code}', { name, code: fmtCode(code) });
        if (navigator.share) { try { await navigator.share({ title: 'Apex Lift', text, url: codeLink(code) }); } catch (e) {} return; }
        window.appActions.copyCode(code);
    }
});

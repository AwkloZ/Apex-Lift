// Apex Lift admin page: users, insights and coaching.
// Access is decided by firestore.rules (isAdmin). Anyone else who signs in here sees nothing but their own User UID.
// Reading cost: one document per user (+ the workout history of users still on app versions before 11, which don't send a summary).
// Workout history and backups are only read when you open a user or ask for the full workouts export.
(() => {
    'use strict';
    const FIREBASE_CONFIG = {
        apiKey: 'AIzaSyCItVZimtbvod94CGUfYx1xwgSTW_mEq0Y',
        authDomain: location.hostname === 'apex-liftt.netlify.app' ? location.host : 'apex-lift-52a18.firebaseapp.com',
        projectId: 'apex-lift-52a18',
        storageBucket: 'apex-lift-52a18.firebasestorage.app',
        messagingSenderId: '682655190858',
        appId: '1:682655190858:web:70d756fba8e17de80cbbb3'
    };
    const $ = id => document.getElementById(id);
    // every value shown comes from users, so all of it is escaped
    const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
    const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
    const DAY = 86400000;
    const fmtDate = t => num(t) ? new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const fmtShort = t => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    // dates in the CSV are 2026-10-17 so Excel sorts them as dates
    const iso = t => { if (!num(t)) return ''; const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const keyTs = k => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(k || '')); return m ? new Date(+m[1], m[2] - 1, +m[3]).getTime() : null; };
    const startOfDay = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const ago = t => { if (!num(t)) return ''; const d = Math.floor((startOfDay(Date.now()) - startOfDay(t)) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
    const LABEL = {
        goal: { muscle: 'Build muscle', strength: 'Get stronger', fat: 'Lose fat' }, exp: { none: 'Just starting', new: '< 1 year', mid: '1–3 years', adv: '3–5 years', pro: '5+ years' }, eq: { gym: 'Full gym', db: 'Dumbbells' },
        sex: { male: 'Male', female: 'Female', na: '—' }, lang: { en: 'English', ar: 'Arabic' }, platform: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' },
        setup: { program: 'Picked a program', own: 'Built their own', skip: 'Skipped' }
    };
    const lab = (k, v) => (LABEL[k] && LABEL[k][v]) || '';
    const setupLabel = v => !v ? '' : v.startsWith('left:') ? `Left at "${v.slice(5)}"` : lab('setup', v) || v;
    const logTime = l => (num(l && l.ts) !== null ? l.ts : Date.parse(l && l.d));
    // training status (gold/amber/grey/red); green is kept for "online now"
    const STATUS = { active: ['Training', 'b-train'], risk: ['At risk', 'b-risk'], inactive: ['Inactive', 'b-inactive'], none: ['Not started', 'b-none'] };
    const ONLINE_MS = 5 * 60000; // the app says "I'm here" every 2 minutes while it is open
    const fmtTime = t => new Date(t).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
    const fmtDur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`; };

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), db = firebase.firestore();
    let users = [], clients = {}, presence = {}, presUnsub = null, tab = 'users', sortKey = 'lastActive', sortDir = -1, query = '', fStatus = '', fGoal = '', fClients = false;

    // writes "who looked at what" to adminLog (append-only, see firestore.rules); never blocks the page
    const audit = (uid, action) => { const u = auth.currentUser; if (u) db.collection('adminLog').add({ uid, action, at: Date.now(), by: u.email || u.uid }).catch(e => console.warn('adminLog', e)); };

    const signInScreen = (msg = '') => {
        $('main').innerHTML = `<div class="center"><h1>Admin</h1><p>Sign in with the Apex Lift admin Google account.</p>
            <button id="go" class="btn gold">Sign in with Google</button>${msg ? `<p class="err" style="margin-top:16px">${esc(msg)}</p>` : ''}</div>`;
        $('go').onclick = async () => {
            const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
            try { await auth.signInWithPopup(p); }
            catch (e) { if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) return auth.signInWithRedirect(p); if (e.code !== 'auth/popup-closed-by-user') signInScreen(e.code || 'Sign-in failed'); }
        };
    };
    const notAdmin = u => {
        $('main').innerHTML = `<div class="center"><h1>Not an admin account</h1>
            <p>This Google account can't read other users' data.<br>To make it an admin, add this User UID to isAdmin() in <b>firestore.rules</b> and publish the rules:</p>
            <div class="uid">${esc(u.uid)}</div></div>`;
    };

    // ---------- load everything ----------
    const toUser = d => {
        const m = d.data() || {}, b = isObj(m.body) ? m.body : {}, a = isObj(m.account) ? m.account : {}, pr = isObj(m.profile) ? m.profile : {};
        const act = isObj(m.activity) ? m.activity : null;
        const plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(isObj) : [];
        const active = plan.find(w => w.id === m.activeWeek) || plan[0] || {};
        const days = act && Array.isArray(act.days) ? act.days.map(keyTs).filter(Boolean) : [];
        const lastSeen = keyTs(a.lastSeen), lastWorkout = act ? num(act.last) : null;
        const u = {
            uid: d.id, raw: m, name: String(a.name || ''), email: String(a.email || ''),
            age: num(b.birthYear) ? new Date().getFullYear() - b.birthYear : null, sex: lab('sex', b.sex), heightCm: num(b.heightCm), weightKg: num(b.weightKg),
            goal: lab('goal', pr.goal), goalKey: String(pr.goal || ''), days: String(pr.days || ''), exp: lab('exp', pr.exp), eq: lab('eq', pr.eq),
            routine: String(active.name || ''), routines: plan.length, joined: num(a.createdAt), lastSeen, lastWorkout, updatedAt: num(m.updatedAt),
            lang: lab('lang', a.lang), platform: lab('platform', a.platform), installed: a.installed === true ? 'Yes' : a.installed === false ? 'No' : '',
            version: String(a.appVersion || ''), setup: setupLabel(String(a.setup || '')), terms: isObj(m.terms) ? String(m.terms.v || '') : '',
            hasActivity: !!act, workoutDays: days, workouts: act ? (num(act.n) || 0) : null, exercises: act ? (num(act.ex) || 0) : null,
            top: act && Array.isArray(act.top) ? act.top.filter(x => isObj(x) && x.n).slice(0, 10) : [],
            readiness: isObj(m.readiness) ? m.readiness : {}, lastBackup: null, history: null, backups: null
        };
        u.lastActive = Math.max(lastSeen || 0, lastWorkout || 0, u.updatedAt || 0) || null;
        return u;
    };
    // based on real workouts only (opening the app or changing settings doesn't count)
    const statusOf = u => {
        if (!u.workouts || !u.lastWorkout) return 'none';
        const d = (Date.now() - u.lastWorkout) / DAY;
        return d <= 7 ? 'active' : d <= 30 ? 'risk' : 'inactive';
    };
    const isNew = u => u.joined && Date.now() - u.joined < 7 * DAY;
    const finish = u => {
        const p = presence[u.uid];
        u.online = !!(p && !p.off && Date.now() - (num(p.at) || 0) < ONLINE_MS);
        u.visits = p ? (num(p.visits) || 0) : null;
        u.recent = p && Array.isArray(p.recent) ? p.recent.filter(v => isObj(v) && num(v.s) && num(v.e)).sort((a, b) => b.s - a.s) : [];
        u.lastVisit = p ? num(p.at) : null;
        if (u.lastVisit) u.lastActive = Math.max(u.lastActive || 0, u.lastVisit);
        const c = clients[u.uid] || {};
        u.client = c.client === true; u.notes = String(c.notes || ''); u.followUp = String(c.followUp || '');
        u.status = statusOf(u); u.statusLabel = STATUS[u.status][0];
    };
    const loadUsers = async () => {
        $('main').innerHTML = `<div class="center"><p>Loading users…</p></div>`;
        const [qs, cs] = await Promise.all([db.collection('users').get(), db.collection('clients').get().catch(() => null)]);
        clients = {}; if (cs) cs.forEach(d => { clients[d.id] = d.data() || {}; });
        users = []; qs.forEach(d => users.push(toUser(d)));
        users.forEach(finish);
        render();
        watchPresence();
        // users on older app versions send no activity summary: work it out from their workout history
        // (only for them, and only until they open the updated app)
        const queue = users.filter(u => !u.hasActivity);
        const worker = async () => { while (queue.length) { const u = queue.shift(); try { summarize(u, await loadHistory(u)); } catch (e) { console.warn(e); } finish(u); } };
        if (queue.length) { await Promise.all([1, 2, 3, 4].map(worker)); render(); }
    };
    // who is using the app right now (live) and their visits: one query for everyone, then only changes
    const watchPresence = () => {
        if (presUnsub) presUnsub();
        presUnsub = db.collectionGroup('presence').onSnapshot(qs => {
            qs.docChanges().forEach(ch => { const uid = ch.doc.ref.parent.parent.id; if (ch.type === 'removed') delete presence[uid]; else presence[uid] = ch.doc.data() || {}; });
            refreshLive();
        }, e => console.warn('presence', e));
    };
    // online dots go out by themselves 5 minutes after the last "I'm here"
    const refreshLive = () => {
        users.forEach(finish);
        const st = document.querySelector('.stats'); if (st) st.innerHTML = kpis();
        if (tab === 'users' && $('rows')) renderRows();
    };
    setInterval(() => { if (users.length) refreshLive(); }, 30000);
    // the same summary the app sends (activitySummary in app.js), worked out here from the history
    const summarize = (u, h) => {
        const days = new Set(), count = {}; let last = 0;
        Object.keys(h).forEach(k => {
            const seen = new Set();
            h[k].forEach(l => { const t = logTime(l); if (isNaN(t)) return; const d = startOfDay(t); days.add(d); seen.add(d); if (t > last) last = t; });
            if (seen.size && !k.startsWith('temp_')) count[k] = seen.size;
        });
        u.workoutDays = [...days].sort((a, b) => a - b); u.workouts = days.size; u.exercises = Object.keys(count).length; u.lastWorkout = last || null;
        u.top = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 10).map(k => ({ n: exName(k), c: count[k] }));
        u.lastActive = Math.max(u.lastActive || 0, last) || null; u.hasActivity = true; u.legacy = true;
    };
    // full workout history of one user (only when needed)
    const loadHistory = async u => {
        if (u.history) return u.history;
        const hs = await db.collection(`users/${u.uid}/history`).get(), h = {};
        hs.forEach(d => { const x = d.data() || {}; let k = d.id; try { k = decodeURIComponent(d.id); } catch (e) {} if (Array.isArray(x.logs) && x.logs.length) h[k] = x.logs; });
        return (u.history = h);
    };
    const loadBackups = async u => {
        const bs = await db.collection(`users/${u.uid}/backups`).get(), out = [];
        bs.forEach(d => { const x = d.data() || {}; if (num(x.createdAt)) out.push({ id: d.id, ...x }); });
        return (u.backups = out.sort((a, c) => c.createdAt - a.createdAt));
    };
    const exName = k => k.replace(/^global_/, '').split('_').filter(Boolean).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');

    // ---------- small charts (inline SVG, one series, hover shows the value) ----------
    const barChart = (data, { h = 150, fmt = v => v } = {}) => {
        if (!data.length) return '<p class="note">No data yet.</p>';
        const W = 600, padB = 22, padT = 16, max = Math.max(1, ...data.map(d => d.v)), bw = W / data.length, gap = Math.min(10, bw * 0.25);
        const ticks = [0, 0.5, 1].map(f => Math.round(max * f));
        const bars = data.map((d, i) => {
            const bh = (h - padB - padT) * d.v / max, x = i * bw + gap / 2, y = h - padB - bh, w = bw - gap;
            const r = Math.min(4, w / 2, bh);
            const path = bh > 0 ? `M${x},${h - padB} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${h - padB} Z` : '';
            return `<g><title>${esc(d.label)}: ${esc(fmt(d.v))}</title><rect class="hit" x="${i * bw}" y="${padT}" width="${bw}" height="${h - padT}" fill="transparent"/>${path ? `<path class="bar" d="${path}"/>` : ''}
                ${i === data.length - 1 || d.v === max ? `<text class="val" x="${x + w / 2}" y="${y - 4}" text-anchor="middle">${esc(fmt(d.v))}</text>` : ''}
                ${data.length <= 14 || i % 2 === 0 ? `<text class="axis" x="${x + w / 2}" y="${h - 6}" text-anchor="middle">${esc(d.short || d.label)}</text>` : ''}</g>`;
        }).join('');
        const grid = ticks.slice(1).map(tk => { const y = h - padB - (h - padB - padT) * tk / max; return `<line class="grid" x1="0" x2="${W}" y1="${y}" y2="${y}"/>`; }).join('');
        return `<div class="chart"><svg viewBox="0 -4 ${W} ${h + 4}" role="img" aria-label="${esc(data.map(d => `${d.label} ${fmt(d.v)}`).join(', '))}">${grid}<line class="grid" x1="0" x2="${W}" y1="${h - padB}" y2="${h - padB}"/>${bars}</svg></div>`;
    };
    const lineChart = (pts, { h = 140, unit = '' } = {}) => {
        if (pts.length < 2) return '';
        const W = 600, pad = 18, xs = pts.map(p => p.t), ys = pts.map(p => p.v), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const sx = t => pad + (W - 2 * pad) * (t - x0) / Math.max(1, x1 - x0), sy = v => h - pad - (h - 2 * pad) * (v - y0) / Math.max(0.5, y1 - y0);
        const d = pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.t).toFixed(1)},${sy(p.v).toFixed(1)}`).join(' ');
        const dots = pts.map(p => `<g><title>${esc(fmtDate(p.t))}: ${esc(p.v)} ${unit}</title><circle cx="${sx(p.t)}" cy="${sy(p.v)}" r="10" fill="transparent"/><circle class="dot" cx="${sx(p.t)}" cy="${sy(p.v)}" r="4"/></g>`).join('');
        return `<div class="chart"><svg viewBox="0 0 ${W} ${h}" role="img" aria-label="${esc(`${pts.length} entries from ${fmtDate(x0)} to ${fmtDate(x1)}`)}">
            <text class="axis" x="0" y="10">${esc(y1)} ${unit}</text><text class="axis" x="0" y="${h - 2}">${esc(y0)} ${unit}</text>
            <path class="line" d="${d}"/>${dots}<text class="axis" x="${W}" y="${h - 2}" text-anchor="end">${esc(fmtShort(x1))}</text></svg></div>`;
    };
    const hbars = (rows, total) => {
        if (!rows.length) return '<p class="note">No data yet.</p>';
        const max = Math.max(1, ...rows.map(r => r[1]));
        return `<div class="hbars">${rows.map(([l, v]) => `<div title="${esc(l)}: ${v}${total ? ` (${Math.round(100 * v / total)}%)` : ''}"><span>${esc(l)}</span><span><i style="width:${(100 * v / max).toFixed(1)}%"></i></span><b>${total ? Math.round(100 * v / total) + '%' : v}</b></div>`).join('')}</div>`;
    };
    // 7-day periods ending today, oldest first
    const weekBuckets = n => { const end = startOfDay(Date.now()) + DAY; return Array.from({ length: n }, (_, i) => { const to = end - (n - 1 - i) * 7 * DAY; return { from: to - 7 * DAY, to }; }); };
    const countBy = (list, f) => { const m = {}; list.forEach(u => { const k = f(u); if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };

    // ---------- page ----------
    const COLS = [['name', 'Name'], ['email', 'Email'], ['statusLabel', 'Status'], ['goal', 'Goal'], ['days', 'Days/wk'], ['exp', 'Experience'], ['routine', 'Routine'], ['workouts', 'Workouts'], ['lastWorkout', 'Last workout'], ['visits', 'Visits'], ['lastActive', 'Last active'], ['joined', 'Joined'], ['age', 'Age'], ['sex', 'Sex'], ['platform', 'Phone'], ['lang', 'Language'], ['version', 'App'], ['followUp', 'Follow-up']];
    const cell = (u, k) => {
        const v = u[k];
        if (k === 'statusLabel') return `${u.online ? '<span class="badge b-online">Online now</span>' : ''}<span class="badge ${STATUS[u.status][1]}">${esc(v)}</span>${isNew(u) ? '<span class="badge b-new">New</span>' : ''}${u.client ? '<span class="badge b-client">Client</span>' : ''}`;
        if (k === 'lastActive') return u.online ? '<span class="ok">Now</span>' : esc(v ? `${fmtDate(v)}${u.lastVisit === v ? ` · ${fmtTime(v)}` : ''}` : '');
        if (k === 'visits') return v === null ? '<span class="muted">—</span>' : esc(v);
        if (k === 'joined' || k === 'lastWorkout') return esc(fmtDate(v));
        if (k === 'workouts') return v === null ? '<span class="muted">—</span>' : esc(v);
        // users on app versions before 11 never uploaded their name and email: it arrives when they next open the app
        if (k === 'name' && !v) return `<span class="muted" title="${esc(u.uid)}">Not shared yet · ${esc(u.uid.slice(0, 6))}</span>`;
        if (k === 'followUp') { const t = keyTs(v); return t ? `<span class="${t <= Date.now() ? 'err' : ''}">${esc(fmtDate(t))}</span>` : ''; }
        return esc(v === null || v === undefined ? '' : v);
    };
    // phones: one card per user (name, workouts, email, status, last active)
    const SORTS = [['lastActive', 'Last active'], ['lastWorkout', 'Last workout'], ['workouts', 'Most workouts'], ['joined', 'Newest'], ['name', 'Name']];
    const ucard = u => `<button type="button" class="ucard" data-uid="${esc(u.uid)}"><div class="ucard-t"><span class="ucard-n">${cell(u, 'name')}</span><span class="ucard-w"><b>${u.workouts === null ? '—' : esc(u.workouts)}</b>workouts</span></div>${u.email ? `<div class="ucard-e">${esc(u.email)}</div>` : ''}<div class="ucard-b">${cell(u, 'statusLabel')}<span class="when">${u.online ? '<span class="ok">Now</span>' : u.lastActive ? esc(ago(u.lastActive)) : ''}</span></div></button>`;
    const filtered = () => {
        const q = query.trim().toLowerCase();
        let list = users.filter(u => (!fStatus || (fStatus === 'online' ? u.online : fStatus === 'new' ? isNew(u) : fStatus === 'due' ? (keyTs(u.followUp) || Infinity) <= Date.now() : u.status === fStatus)) && (!fGoal || u.goalKey === fGoal) && (!fClients || u.client));
        if (q) list = list.filter(u => [u.name, u.email, u.goal, u.routine, u.uid, u.notes].some(x => String(x).toLowerCase().includes(q)));
        return list.sort((a, b) => { const x = a[sortKey], y = b[sortKey]; if (x == null || x === '') return 1; if (y == null || y === '') return -1; return (x > y ? 1 : x < y ? -1 : 0) * sortDir; });
    };
    const kpis = () => {
        const week = Date.now() - 7 * DAY, month = Date.now() - 30 * DAY, ages = users.map(u => u.age).filter(Boolean);
        const due = users.filter(u => (keyTs(u.followUp) || Infinity) <= Date.now()).length;
        return [[users.length, 'Users'], [users.filter(u => u.online).length, 'Online now'], [users.filter(u => u.lastVisit > week).length, 'Opened the app last 7 days'], [users.filter(u => u.lastWorkout > week).length, 'Trained last 7 days'], [users.filter(u => u.lastWorkout > month).length, 'Trained last 30 days'],
            [users.filter(isNew).length, 'New this week'], [users.reduce((s, u) => s + (u.workouts > 0 ? u.workouts : 0), 0), 'Workouts logged'], [users.filter(u => u.client).length, 'Coaching clients'],
            [due, 'Follow-ups due'], [ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : '—', 'Average age']]
            .map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('');
    };
    const render = () => {
        $('main').innerHTML = `<div class="tabs" role="tablist"><button data-tab="users" role="tab" aria-selected="${tab === 'users'}" class="${tab === 'users' ? 'on' : ''}">Users</button><button data-tab="insights" role="tab" aria-selected="${tab === 'insights'}" class="${tab === 'insights' ? 'on' : ''}">Insights</button></div>
            <div class="stats">${kpis()}</div><div id="view"></div>
            <p class="note">Data is used to support users and improve Apex Lift, as described in the Privacy Policy. Never sell or share it. Opening, downloading and coaching an account is recorded in the admin log.</p>`;
        document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
        if (tab === 'users') renderUsers(); else renderInsights();
    };
    const renderUsers = () => {
        const goals = Object.entries(LABEL.goal).map(([k, l]) => `<option value="${k}" ${fGoal === k ? 'selected' : ''}>${l}</option>`).join('');
        const st = [['', 'All users'], ['online', 'Online now'], ['active', 'Training (7 days)'], ['risk', 'At risk (8–30 days)'], ['inactive', 'Inactive (30+ days)'], ['none', 'Not started'], ['new', 'New this week'], ['due', 'Follow-up due']]
            .map(([k, l]) => `<option value="${k}" ${fStatus === k ? 'selected' : ''}>${l}</option>`).join('');
        $('view').innerHTML = `<div class="tools"><input id="q" type="search" placeholder="Search name, email, goal, notes…" value="${esc(query)}">
                <select id="fs" aria-label="Status">${st}</select><select id="fg" aria-label="Goal"><option value="">All goals</option>${goals}</select>
                <select id="sm" class="sort-m" aria-label="Sort">${SORTS.map(([k, l]) => `<option value="${k}" ${k === sortKey ? 'selected' : ''}>${l}</option>`).join('')}</select>
                <label class="check"><input id="fc" type="checkbox" ${fClients ? 'checked' : ''}> Clients only</label>
                <button id="csv" class="btn gold">Users (CSV)</button><button id="csvw" class="btn">All workouts (CSV)</button><button id="reload" class="btn">Refresh</button></div>
            ${users.some(u => !u.name && !u.email) ? `<div class="info" style="margin-bottom:10px">${users.filter(u => !u.name && !u.email).length} users show "Not shared yet": their phones still run an older version of the app, which didn't send their name and email. These fill in by themselves the next time each of them opens the updated app.</div>` : ''}
            <div class="note" id="count" style="margin:0 0 8px"></div>
            <div class="tablewrap"><table><thead><tr>${COLS.map(([k, l]) => `<th data-k="${k}" class="${k === sortKey ? 'sorted' : ''}">${l}${k === sortKey ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div><div class="ulist" id="ucards"></div>`;
        $('q').oninput = e => { query = e.target.value; renderRows(); };
        $('fs').onchange = e => { fStatus = e.target.value; renderRows(); };
        $('fg').onchange = e => { fGoal = e.target.value; renderRows(); };
        $('fc').onchange = e => { fClients = e.target.checked; renderRows(); };
        $('sm').onchange = e => { sortKey = e.target.value; sortDir = sortKey === 'name' ? 1 : -1; renderRows(); };
        $('csv').onclick = downloadCSV;
        $('csvw').onclick = downloadWorkoutsCSV;
        $('reload').onclick = loadUsers;
        document.querySelectorAll('th[data-k]').forEach(th => th.onclick = () => { const k = th.dataset.k; sortDir = sortKey === k ? -sortDir : -1; sortKey = k; renderUsers(); });
        $('rows').onclick = e => { const tr = e.target.closest('tr[data-uid]'); if (tr) openUser(tr.dataset.uid); };
        $('ucards').onclick = e => { const c = e.target.closest('[data-uid]'); if (c) openUser(c.dataset.uid); };
        renderRows();
    };
    const renderRows = () => {
        const list = filtered();
        $('rows').innerHTML = list.map(u => `<tr data-uid="${esc(u.uid)}">${COLS.map(([k]) => `<td class="${k === 'name' ? 'name' : k === 'email' ? 'muted' : ''}">${cell(u, k)}</td>`).join('')}</tr>`).join('')
            || `<tr><td colspan="${COLS.length}" class="muted">No users found.</td></tr>`;
        $('ucards').innerHTML = list.map(ucard).join('') || '<p class="note">No users found.</p>';
        $('count').textContent = `${list.length} of ${users.length}`;
    };

    // ---------- insights ----------
    const renderInsights = () => {
        const withAct = users.filter(u => u.hasActivity), old = users.length - withAct.length, N = 12, wk = weekBuckets(N);
        const legacy = users.filter(u => u.legacy).length;
        const signups = wk.map(b => ({ label: `${fmtShort(b.from)} – ${fmtShort(b.to - DAY)}`, short: fmtShort(b.from), v: users.filter(u => u.joined >= b.from && u.joined < b.to).length }));
        const activeW = wk.map(b => ({ label: `${fmtShort(b.from)} – ${fmtShort(b.to - DAY)}`, short: fmtShort(b.from), v: withAct.filter(u => u.workoutDays.some(t => t >= b.from && t < b.to)).length }));
        const workoutsW = wk.map(b => ({ label: `${fmtShort(b.from)} – ${fmtShort(b.to - DAY)}`, short: fmtShort(b.from), v: withAct.reduce((s, u) => s + u.workoutDays.filter(t => t >= b.from && t < b.to).length, 0) }));
        // retention: of the people who joined in a week, how many trained in their 1st, 2nd and 4th week
        const cohorts = weekBuckets(8).map(b => {
            const c = withAct.filter(u => u.joined >= b.from && u.joined < b.to);
            const pct = k => { const from = b.from + 7 * k * DAY; if (from > Date.now()) return null; if (!c.length) return null; return Math.round(100 * c.filter(u => u.workoutDays.some(t => t >= startOfDay(u.joined) + 7 * k * DAY && t < startOfDay(u.joined) + 7 * (k + 1) * DAY)).length / c.length); };
            return { label: fmtShort(b.from), n: c.length, w: [pct(0), pct(1), pct(3)] };
        }).reverse();
        const funnel = [['Signed in', users.length], ['Has a routine', users.filter(u => u.routines > 0).length], ['Logged 1+ workout', users.filter(u => u.workouts > 0).length],
            ['Logged 5+ workouts', users.filter(u => u.workouts >= 5).length], ['Logged 20+ workouts', users.filter(u => u.workouts >= 20).length], ['Active last 7 days', users.filter(u => u.status === 'active').length]];
        const topEx = {}; withAct.forEach(u => u.top.forEach(x => { const k = String(x.n); topEx[k] = topEx[k] || [0, 0]; topEx[k][0] += num(x.c) || 0; topEx[k][1]++; }));
        const topRows = Object.entries(topEx).sort((a, b) => b[1][1] - a[1][1] || b[1][0] - a[1][0]).slice(0, 12).map(([n, [c, p]]) => [n, p]);
        const routineRows = countBy(users, u => u.routine).slice(0, 10);
        const ageBand = u => !u.age ? '' : u.age < 18 ? 'Under 18' : u.age < 25 ? '18–24' : u.age < 35 ? '25–34' : u.age < 45 ? '35–44' : '45+';
        // check-ins (last 30 days): average of each answer, 0 = worst, 2 = best
        const cutoff = Date.now() - 30 * DAY, ci = { sleep: [], soreness: [], energy: [] };
        users.forEach(u => Object.entries(u.readiness).forEach(([k, r]) => { if ((keyTs(k) || 0) >= cutoff && isObj(r)) Object.keys(ci).forEach(f => { if (num(r[f]) !== null) ci[f].push(r[f]); }); }));
        const avg = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : '—';
        const card = (title, sub, body) => `<div class="card"><h3>${esc(title)}</h3>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}${body}</div>`;
        const pctCell = v => v === null ? '<td class="c muted">—</td>' : `<td class="c" style="color:${v >= 50 ? '#4ade80' : v >= 25 ? '#fbbf24' : '#f87171'}">${v}%</td>`;
        $('view').innerHTML = `${old ? `<div class="info" style="margin-bottom:12px">Still loading the workouts of ${old} users… press Refresh in a moment.</div>` : ''}${legacy ? `<div class="info" style="margin-bottom:12px">${legacy} of ${users.length} users still run an older app version: their workouts are counted, but name, email, phone, language and check-ins arrive only once they open the updated app.</div>` : ''}
            <div class="grid2">
                ${card('Sign-ups per week', 'Last 12 weeks', barChart(signups))}
                ${card('Active users per week', 'Users who logged at least one workout', barChart(activeW))}
                ${card('Workouts per week', 'Workout days logged by all users', barChart(workoutsW))}
                ${card('App visits per week', 'Times users opened the app (each user\'s last 30 visits)', barChart(wk.map(b => ({ label: `${fmtShort(b.from)} – ${fmtShort(b.to - DAY)}`, short: fmtShort(b.from), v: users.reduce((n, u) => n + u.recent.filter(v => v.s >= b.from && v.s < b.to).length, 0) }))))}
                ${card('Retention', 'Of the users who joined each week: the share who trained in their 1st, 2nd and 4th week',
                    `<div style="overflow-x:auto"><table class="mini"><thead><tr><th>Joined week of</th><th>Users</th><th>Week 1</th><th>Week 2</th><th>Week 4</th></tr></thead><tbody>${cohorts.map(c => `<tr><td>${esc(c.label)}</td><td class="c">${c.n}</td>${c.n ? c.w.map(pctCell).join('') : '<td class="c muted">—</td>'.repeat(3)}</tr>`).join('')}</tbody></table></div>`)}
                ${card('Where users drop off', 'Share of all signed-in users', hbars(funnel, users.length))}
                ${card('How setup ended', 'The setup questions after signing in', hbars(countBy(users, u => u.setup || (u.version ? '' : 'Unknown (older app)')), users.length))}
                ${card('Most trained exercises', 'Number of users who have each one in their top 10', hbars(topRows))}
                ${card('Most used routines', 'Active routine name', hbars(routineRows, users.length))}
                ${card('Goal', '', hbars(countBy(users, u => u.goal), users.length))}
                ${card('Experience', '', hbars(countBy(users, u => u.exp), users.length))}
                ${card('Days per week', '', hbars(countBy(users, u => u.days && `${u.days} days`), users.length))}
                ${card('Equipment', '', hbars(countBy(users, u => u.eq), users.length))}
                ${card('Age', 'Users who shared their birth year', hbars(countBy(users, ageBand), users.filter(u => u.age).length))}
                ${card('Sex', '', hbars(countBy(users, u => u.sex), users.filter(u => u.sex).length))}
                ${card('Phone', '', hbars(countBy(users, u => u.platform), users.filter(u => u.platform).length))}
                ${card('Installed on home screen', '', hbars(countBy(users, u => u.installed), users.filter(u => u.installed).length))}
                ${card('Language', '', hbars(countBy(users, u => u.lang), users.filter(u => u.lang).length))}
                ${card('App version', 'Users on older versions have not opened the app since it was updated', hbars(countBy(users, u => u.version ? `Version ${u.version}` : 'Older than 11'), users.length))}
                ${card('Daily check-ins (last 30 days)', `${ci.sleep.length} check-ins · average answer from 0 (worst) to 2 (best)`,
                    `<div class="kv"><div><span>Sleep</span><b>${avg(ci.sleep)}</b></div><div><span>Soreness</span><b>${avg(ci.soreness)}</b></div><div><span>Energy</span><b>${avg(ci.energy)}</b></div></div>`)}
                ${card('Admin log', 'The latest 25 actions on this page', '<div id="alog" class="list"><div><span class="note">Loading…</span></div></div>')}
            </div>`;
        db.collection('adminLog').orderBy('at', 'desc').limit(25).get().then(qs => {
            const rows = []; qs.forEach(d => { const x = d.data() || {}, u = users.find(y => y.uid === x.uid); rows.push(`<div><span>${esc(fmtDate(x.at))} · ${esc(x.action)} · ${esc(u ? (u.name || u.email) : x.uid)}</span><span>${esc(x.by)}</span></div>`); });
            if ($('alog')) $('alog').innerHTML = rows.join('') || '<div><span class="note">Nothing yet.</span></div>';
        }).catch(() => { if ($('alog')) $('alog').innerHTML = '<div><span class="note">Publish the new firestore.rules to use the admin log.</span></div>'; });
    };

    // ---------- one user ----------
    const openUser = uid => {
        const u = users.find(x => x.uid === uid); if (!u) return;
        audit(uid, 'view');
        renderUser(u);
        $('drawer').classList.add('open');
        // coach plan status (one small document)
        db.doc(`users/${uid}/coach/plan`).get().then(s => { u.coachPlan = s.exists ? s.data() : null; if ($('drawer').classList.contains('open') && $('panel').dataset.uid === uid) renderCoachStatus(u); }).catch(() => {});
    };
    const renderCoachStatus = u => {
        const el = $('coachst'); if (!el) return;
        const c = u.coachPlan;
        if (!c) { el.innerHTML = '<span class="note" style="margin:0">Nothing sent yet.</span>'; return; }
        const what = c.mode === 'note' ? 'Message' : `Routine "${esc((c.routine && c.routine.name) || '')}"${c.mode === 'replace' ? ' (replaced a routine)' : ''}`;
        el.innerHTML = `<div>${what} sent ${esc(fmtDate(c.sentAt))} · ${num(c.appliedAt) >= c.sentAt ? `<span class="ok">received ✓</span>` : '<span style="color:#fbbf24;font-weight:700">waiting: it arrives the next time they open the app</span>'}</div>${c.note ? `<div class="note" style="margin:4px 0 0;white-space:pre-wrap">"${esc(c.note)}"</div>` : ''}`;
    };
    const renderUser = u => {
        const m = u.raw, b = isObj(m.body) ? m.body : {};
        const plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(isObj) : [];
        const kv = (l, v) => `<div><span>${esc(l)}</span><b>${esc(v || v === 0 ? v : '—')}</b></div>`;
        const weights = Array.isArray(b.log) ? b.log.filter(x => isObj(x) && num(x.t) && num(parseFloat(x.kg))).map(x => ({ t: x.t, v: parseFloat(x.kg) })) : [];
        const wk = weekBuckets(12).map(bk => ({ label: `${fmtShort(bk.from)} – ${fmtShort(bk.to - DAY)}`, short: fmtShort(bk.from), v: u.workoutDays.filter(t => t >= bk.from && t < bk.to).length }));
        const rd = Object.entries(u.readiness).filter(([k]) => (keyTs(k) || 0) >= Date.now() - 30 * DAY).map(([, r]) => r).filter(isObj);
        const rAvg = f => rd.length ? (rd.reduce((s, r) => s + (num(r[f]) || 0), 0) / rd.length).toFixed(1) : '';
        $('panel').dataset.uid = u.uid;
        $('panel').innerHTML = `<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><h2>${esc(u.name || 'Name not shared yet')}</h2><div class="note" style="margin:2px 0 0">${esc(u.email || 'Their name and email arrive when they open the updated app.')}</div>
                <div style="margin-top:8px">${u.online ? '<span class="badge b-online">Online now</span>' : ''}<span class="badge ${STATUS[u.status][1]}">${esc(u.statusLabel)}</span>${isNew(u) ? '<span class="badge b-new">New</span>' : ''}${u.client ? '<span class="badge b-client">Client</span>' : ''}</div></div><button class="btn" id="close">Close</button></div>

            <h3>Coaching</h3>
            <div class="row"><button class="btn gold" id="c-new">Send a new routine</button><button class="btn" id="c-note">Send a message</button></div>
            <div id="coachst" class="info" style="margin-top:10px"><span class="note" style="margin:0">Checking…</span></div>
            <div style="margin-top:12px" class="row"><label class="check"><input type="checkbox" id="n-client" ${u.client ? 'checked' : ''}> Coaching client</label>
                <label class="check">Follow up on <input type="date" id="n-follow" class="field" style="width:auto;padding:6px 8px" value="${esc(u.followUp)}"></label></div>
            <textarea id="n-notes" rows="3" maxlength="5000" placeholder="Private notes about this client (only admins can see them)" style="margin-top:8px">${esc(u.notes)}</textarea>
            <div class="row" style="margin-top:8px"><button class="btn" id="n-save">Save notes</button><span id="n-msg" class="note" style="margin:0"></span></div>

            <h3>Routines</h3><div class="list">${plan.map(w => `<div><span>${esc(w.name)}${w.id === m.activeWeek ? ' <span class="pill">active</span>' : ''}<br><span class="note" style="margin:0">${(Array.isArray(w.schedule) ? w.schedule : []).filter(d => isObj(d) && !d.isRest && Array.isArray(d.exercises) && d.exercises.length).length} training days</span></span><span><button class="btn" data-edit="${esc(w.id)}">Edit &amp; send</button></span></div>`).join('') || '<div><span class="note">None</span></div>'}</div>

            <h3>Visits</h3>${u.visits === null ? '<p class="note">Shown once they open the updated app.</p>' : `
                <div class="kv"><div><span>Visits</span><b>${esc(u.visits)}</b></div><div><span>Average visit (last ${u.recent.length})</span><b>${u.recent.length ? esc(fmtDur(u.recent.reduce((a, v) => a + (v.e - v.s), 0) / u.recent.length)) : '—'}</b></div></div>
                <div class="list" style="margin-top:6px">${u.recent.slice(0, 10).map((v, i) => `<div><span>${esc(fmtDate(v.s))} · ${esc(fmtTime(v.s))}</span><span>${i === 0 && u.online ? '<span class="ok">Using the app now</span> · ' : ''}${esc(fmtDur(v.e - v.s))}</span></div>`).join('')}</div>`}
            <h3>Workouts per week</h3>${u.hasActivity ? barChart(wk, { h: 110 }) : '<p class="note">Shown once they open the updated app.</p>'}
            <h3>About</h3><div class="kv">${kv('Age', u.age)}${kv('Sex', u.sex)}${kv('Height', u.heightCm && u.heightCm + ' cm')}${kv('Weight', u.weightKg && u.weightKg + ' kg')}${kv('Goal', u.goal)}${kv('Days per week', u.days)}${kv('Experience', u.exp)}${kv('Equipment', u.eq)}
                ${kv('Workouts', u.workouts)}${kv('Exercises', u.exercises)}${kv('Last workout', u.lastWorkout && `${fmtDate(u.lastWorkout)} (${ago(u.lastWorkout)})`)}${kv('Last active', u.lastActive && `${fmtDate(u.lastActive)} (${ago(u.lastActive)})`)}
                ${kv('Joined', fmtDate(u.joined))}${kv('Setup', u.setup)}${kv('Phone', u.platform)}${kv('Installed', u.installed)}${kv('Language', u.lang)}${kv('App version', u.version)}${kv('Terms version', u.terms)}
                ${kv('Check-ins (30 days)', rd.length ? `${rd.length} · sleep ${rAvg('sleep')} · soreness ${rAvg('soreness')} · energy ${rAvg('energy')}` : '')}</div>
            ${weights.length >= 2 ? `<h3>Body weight</h3>${lineChart(weights, { unit: 'kg' })}` : weights.length ? `<h3>Body weight</h3><div class="list"><div><span>${esc(fmtDate(weights[0].t))}</span><span>${esc(weights[0].v)} kg</span></div></div>` : ''}
            ${u.top.length ? `<h3>Most trained exercises</h3>${hbars(u.top.map(x => [String(x.n), num(x.c) || 0]))}` : ''}

            <h3>Exercises</h3><div id="hist" class="list"><div><span class="note">Not loaded</span><span><button class="btn" id="h-load">Load workout history</button></span></div></div>
            <h3>Account backups</h3><div id="bks" class="list"><div><span class="note">Not loaded</span><span><button class="btn" id="b-load">Load backups</button></span></div></div>
            <div style="margin-top:20px"><button class="btn gold" id="dl">Download all data (JSON)</button></div>
            <p class="note">User UID: ${esc(u.uid)}</p>`;
        $('close').onclick = () => $('drawer').classList.remove('open');
        $('c-new').onclick = () => openCoach(u, { mode: 'add' });
        $('c-note').onclick = () => openCoach(u, { mode: 'note' });
        $('panel').querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => { const w = plan.find(x => x.id === btn.dataset.edit); if (w) openCoach(u, { mode: 'replace', routine: w }); });
        $('n-save').onclick = () => saveNotes(u);
        $('h-load').onclick = () => showHistory(u);
        $('b-load').onclick = () => showBackups(u);
        $('dl').onclick = async () => {
            $('dl').disabled = true; $('dl').textContent = 'Preparing…';
            try {
                const h = await loadHistory(u);
                audit(u.uid, 'download');
                saveFile(`ApexLift_${safeName(u)}_data.json`, JSON.stringify({ uid: u.uid, account: m.account || null, about: m.body || null, profile: m.profile || null, settings: { startDay: m.startDay, rest: m.rest }, checkIns: m.readiness || null, routines: m.plan || null, history: h }, null, 2));
                $('dl').textContent = 'Download all data (JSON)';
            } catch (e) { console.warn(e); $('dl').textContent = 'Failed, try again'; }
            $('dl').disabled = false;
        };
        renderCoachStatus(u);
    };
    const showHistory = async u => {
        $('hist').innerHTML = '<div><span class="note">Loading…</span></div>';
        try {
            const h = await loadHistory(u);
            $('hist').innerHTML = Object.entries(h).sort((a, b) => b[1].length - a[1].length).map(([k, l]) => {
                const last = l[l.length - 1] || {}, best = Math.max(0, ...l.map(x => Math.max(parseFloat(x.w) || 0, ...(Array.isArray(x.ws) ? x.ws.map(y => parseFloat(y) || 0) : []))));
                return `<div><span>${esc(exName(k))}</span><span>${l.length} sessions · best ${best} kg · last ${esc(fmtDate(logTime(last)))}</span></div>`;
            }).join('') || '<div><span class="note">No workouts yet.</span></div>';
        } catch (e) { console.warn(e); $('hist').innerHTML = '<div><span class="err">Could not load.</span></div>'; }
    };
    const showBackups = async u => {
        $('bks').innerHTML = '<div><span class="note">Loading…</span></div>';
        try {
            const list = await loadBackups(u);
            $('bks').innerHTML = list.map(x => `<div><span>${esc(fmtDate(x.createdAt))} · ${esc(x.kind)}</span><span><button class="btn" data-bk="${esc(x.id)}">Download</button></span></div>`).join('') || '<div><span class="note">No backups</span></div>';
            $('bks').querySelectorAll('[data-bk]').forEach(btn => btn.onclick = () => downloadBackup(u, btn.dataset.bk, btn));
        } catch (e) { console.warn(e); $('bks').innerHTML = '<div><span class="err">Could not load.</span></div>'; }
    };
    const saveNotes = async u => {
        const client = $('n-client').checked, followUp = $('n-follow').value || '', notes = $('n-notes').value.slice(0, 5000);
        $('n-save').disabled = true; $('n-msg').textContent = 'Saving…';
        try {
            await db.doc(`clients/${u.uid}`).set({ client, notes, followUp, updatedAt: Date.now() });
            clients[u.uid] = { client, notes, followUp }; finish(u); audit(u.uid, 'notes');
            $('n-msg').innerHTML = '<span class="ok">Saved</span>';
            if (tab === 'users') renderRows();
        } catch (e) { console.warn(e); $('n-msg').innerHTML = `<span class="err">Could not save (${esc(e.code || 'error')}). Are the new firestore.rules published?</span>`; }
        $('n-save').disabled = false;
    };
    const openCoach = (u, opts) => {
        const m = u.raw, plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(isObj) : [];
        window.ApexCoach.open({
            db, auth, mode: opts.mode, routine: opts.routine || null,
            client: { uid: u.uid, name: u.name || u.email || 'this user', startDay: m.startDay, exp: isObj(m.profile) ? m.profile.exp : '', routines: plan, activeWeek: m.activeWeek },
            onSent: doc => { u.coachPlan = doc; audit(u.uid, 'coach'); renderCoachStatus(u); }
        });
    };
    const safeName = u => (u.name || u.uid).replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40);
    const downloadBackup = async (u, id, btn) => {
        btn.disabled = true; btn.textContent = '…';
        try {
            const meta = (await db.doc(`users/${u.uid}/backups/${id}`).get()).data() || {}; let json = '';
            for (let i = 0; i < Math.min(30, Number(meta.parts) || 1); i++) json += ((await db.doc(`users/${u.uid}/backups/${id}/parts/${i}`).get()).data() || {}).d || '';
            saveFile(`ApexLift_${safeName(u)}_backup_${iso(meta.createdAt)}.json`, JSON.stringify(JSON.parse(json), null, 2));
            audit(u.uid, 'backup');
            btn.textContent = 'Downloaded';
        } catch (e) { btn.textContent = 'Failed'; console.warn(e); }
    };
    $('drawer').onclick = e => { if (e.target.id === 'drawer') $('drawer').classList.remove('open'); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('coach').classList.contains('open')) $('drawer').classList.remove('open'); });

    // ---------- files ----------
    const saveFile = (name, text, type = 'application/json') => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
        document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    };
    // cells starting with = + - @ are prefixed so Excel never runs them as formulas
    const csvCell = v => { let s = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
    const toCSV = rows => '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n'); // ﻿: Excel opens Arabic names correctly
    const downloadCSV = () => {
        const head = ['Name', 'Email', 'Status', 'Client', 'Follow-up', 'Age', 'Sex', 'Height (cm)', 'Weight (kg)', 'Goal', 'Days per week', 'Experience', 'Equipment', 'Routine', 'Routines', 'Workouts', 'Exercises',
            'Last workout', 'Visits', 'Last active', 'Joined', 'Setup', 'Phone', 'Installed', 'Language', 'App version', 'Terms version', 'User UID'];
        const rows = filtered().map(u => [u.name, u.email, u.statusLabel, u.client ? 'Yes' : '', u.followUp, u.age, u.sex, u.heightCm, u.weightKg, u.goal, u.days, u.exp, u.eq, u.routine, u.routines, u.workouts, u.exercises,
            iso(u.lastWorkout), u.visits, iso(u.lastActive), iso(u.joined), u.setup, u.platform, u.installed, u.lang, u.version, u.terms, u.uid]);
        saveFile(`ApexLift_users_${iso(Date.now())}.csv`, toCSV([head, ...rows]), 'text/csv;charset=utf-8');
    };
    // one row per set, for the users in the current list (reads their full history)
    const downloadWorkoutsCSV = async () => {
        const list = filtered(), btn = $('csvw');
        if (!confirm(`This reads the full workout history of ${list.length} users (about ${list.reduce((s, u) => s + (u.exercises || 5), 0)} documents). Continue?`)) return;
        btn.disabled = true;
        const rows = [['Name', 'Email', 'User UID', 'Date', 'Time', 'Exercise', 'Set', 'Weight (kg)', 'Reps / seconds', 'Unit', 'RPE', 'Routine']];
        let done = 0; const queue = list.slice();
        const worker = async () => {
            while (queue.length) {
                const u = queue.shift();
                try {
                    const h = await loadHistory(u);
                    Object.entries(h).forEach(([k, logs]) => logs.forEach(l => {
                        const t = logTime(l), d = isNaN(t) ? null : new Date(t), reps = Array.isArray(l.s) ? l.s : [l.s];
                        reps.forEach((r, i) => rows.push([u.name, u.email, u.uid, d ? iso(t) : String(l.d || ''), d ? d.toTimeString().slice(0, 5) : '', exName(k), i + 1,
                            Array.isArray(l.ws) && l.ws[i] !== undefined ? l.ws[i] : l.w, r, l.u === 's' ? 'seconds' : 'reps', Array.isArray(l.rpe) && l.rpe[i] != null ? l.rpe[i] : '', String(l.week || '')]));
                    }));
                } catch (e) { console.warn(e); }
                btn.textContent = `Reading… ${++done}/${list.length}`;
            }
        };
        await Promise.all([1, 2, 3, 4].map(worker));
        list.forEach(u => audit(u.uid, 'download'));
        saveFile(`ApexLift_workouts_${iso(Date.now())}.csv`, toCSV(rows), 'text/csv;charset=utf-8');
        btn.disabled = false; btn.textContent = 'All workouts (CSV)';
    };

    // ---------- start ----------
    $('signout').onclick = () => auth.signOut();
    auth.getRedirectResult().catch(e => signInScreen(e.code || 'Sign-in failed'));
    auth.onAuthStateChanged(async u => {
        $('signout').hidden = !u; $('who').textContent = u ? (u.email || '') : '';
        if (!u) return signInScreen();
        try { await loadUsers(); }
        catch (e) { if (/permission/i.test((e && e.code) || '')) notAdmin(u); else $('main').innerHTML = `<div class="center"><p class="err">Could not load users (${esc(e && e.code || 'error')}). Check the connection and refresh.</p></div>`; }
    });
})();

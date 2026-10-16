// Apex Lift admin page: a read-only view of all users for support and app improvement.
// Access is decided by firestore.rules (isAdmin). Anyone else who signs in here sees nothing but their own User UID.
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
    const fmtDate = t => num(t) ? new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const LABEL = { goal: { muscle: 'Build muscle', strength: 'Get stronger', fat: 'Lose fat' }, exp: { new: '< 1 year', mid: '1–3 years', adv: '3+ years' }, eq: { gym: 'Full gym', db: 'Dumbbells' }, sex: { male: 'Male', female: 'Female', na: '—' } };
    const lab = (k, v) => (LABEL[k] && LABEL[k][v]) || '';
    const dayKey = t => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
    const logTime = l => (num(l && l.ts) !== null ? l.ts : Date.parse(l && l.d));

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), db = firebase.firestore();
    let users = [], sortKey = 'lastActive', sortDir = -1, query = '';

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
            <p>This Google account can't read other users' data.<br>To make it the admin, put this User UID in <b>firestore.rules</b> (replace PUT-YOUR-ADMIN-UID-HERE) and publish the rules:</p>
            <div class="uid">${esc(u.uid)}</div></div>`;
    };

    // ---------- load everything ----------
    const loadUsers = async () => {
        $('main').innerHTML = `<div class="center"><p>Loading users…</p></div>`;
        const qs = await db.collection('users').get();
        users = [];
        qs.forEach(d => {
            const m = d.data() || {}, b = isObj(m.body) ? m.body : {}, a = isObj(m.account) ? m.account : {}, pr = isObj(m.profile) ? m.profile : {};
            const plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks : [];
            const active = plan.find(w => isObj(w) && w.id === m.activeWeek) || plan[0] || {};
            users.push({ uid: d.id, raw: m, name: String(a.name || ''), email: String(a.email || ''),
                age: num(b.birthYear) ? new Date().getFullYear() - b.birthYear : null, sex: lab('sex', b.sex), heightCm: num(b.heightCm), weightKg: num(b.weightKg),
                goal: lab('goal', pr.goal), days: String(pr.days || ''), exp: lab('exp', pr.exp), eq: lab('eq', pr.eq),
                routine: String(active.name || ''), joined: num(a.createdAt), lastActive: num(m.updatedAt), terms: isObj(m.terms) ? String(m.terms.v || '') : '',
                workouts: null, exercises: null, lastBackup: null, backups: [] });
        });
        render();
        // workout counts and backups, a few users at a time
        const queue = users.slice();
        const worker = async () => { while (queue.length) { const u = queue.shift(); try { await loadStats(u); } catch (e) { u.workouts = -1; } renderTable(); } };
        await Promise.all([1, 2, 3, 4].map(worker));
        renderStats();
    };
    const loadStats = async u => {
        const [hs, bs] = await Promise.all([db.collection(`users/${u.uid}/history`).get(), db.collection(`users/${u.uid}/backups`).get()]);
        const days = new Set(); u.history = {};
        hs.forEach(d => { const x = d.data() || {}; const logs = Array.isArray(x.logs) ? x.logs : []; let k = d.id; try { k = decodeURIComponent(d.id); } catch (e) {} u.history[k] = logs; logs.forEach(l => { const t = logTime(l); if (!isNaN(t)) days.add(dayKey(t)); }); });
        u.workouts = days.size; u.exercises = Object.values(u.history).filter(l => l.length).length;
        u.backups = []; bs.forEach(d => { const x = d.data() || {}; if (num(x.createdAt)) u.backups.push({ id: d.id, ...x }); });
        u.backups.sort((a, c) => c.createdAt - a.createdAt);
        u.lastBackup = u.backups.length ? u.backups[0].createdAt : null;
    };

    // ---------- page ----------
    const COLS = [['name', 'Name'], ['email', 'Email'], ['age', 'Age'], ['sex', 'Sex'], ['heightCm', 'Height'], ['weightKg', 'Weight'], ['goal', 'Goal'], ['days', 'Days/wk'], ['exp', 'Experience'], ['routine', 'Routine'], ['workouts', 'Workouts'], ['joined', 'Joined'], ['lastActive', 'Last active'], ['lastBackup', 'Last backup']];
    const cell = (u, k) => {
        const v = u[k];
        if (k === 'joined' || k === 'lastActive' || k === 'lastBackup') return fmtDate(v);
        if (k === 'heightCm') return v ? `${v} cm` : '';
        if (k === 'weightKg') return v ? `${v} kg` : '';
        if (k === 'workouts') return v === null ? '…' : v < 0 ? '!' : v;
        return v === null || v === undefined ? '' : v;
    };
    const filtered = () => {
        const q = query.trim().toLowerCase();
        const list = q ? users.filter(u => [u.name, u.email, u.goal, u.routine, u.uid].some(x => String(x).toLowerCase().includes(q))) : users.slice();
        return list.sort((a, b) => { const x = a[sortKey], y = b[sortKey]; if (x == null || x === '') return 1; if (y == null || y === '') return -1; return (x > y ? 1 : x < y ? -1 : 0) * sortDir; });
    };
    const renderStats = () => {
        const week = Date.now() - 7 * 86400000, ages = users.map(u => u.age).filter(Boolean);
        const total = users.reduce((s, u) => s + (u.workouts > 0 ? u.workouts : 0), 0);
        $('stats').innerHTML = [[users.length, 'Users'], [users.filter(u => u.lastActive > week).length, 'Active last 7 days'], [ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : '—', 'Average age'], [total, 'Workouts logged'], [users.filter(u => u.weightKg).length, 'Shared body data']]
            .map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('');
    };
    const renderTable = () => {
        const list = filtered();
        $('rows').innerHTML = list.map(u => `<tr data-uid="${esc(u.uid)}">${COLS.map(([k]) => `<td class="${k === 'name' ? 'name' : k === 'email' ? 'muted' : ''}">${esc(cell(u, k))}</td>`).join('')}</tr>`).join('')
            || `<tr><td colspan="${COLS.length}" class="muted">No users found.</td></tr>`;
        $('count').textContent = `${list.length} of ${users.length}`;
    };
    const render = () => {
        $('main').innerHTML = `<div id="stats" class="stats"></div>
            <div class="tools"><input id="q" type="search" placeholder="Search name, email, goal…" value="${esc(query)}"><button id="csv" class="btn gold">Download Excel (CSV)</button><button id="reload" class="btn">Refresh</button></div>
            <div class="note" id="count" style="margin:0 0 8px"></div>
            <div class="tablewrap"><table><thead><tr>${COLS.map(([k, l]) => `<th data-k="${k}" class="${k === sortKey ? 'sorted' : ''}">${l}${k === sortKey ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div>
            <p class="note">Read-only. Data is used to support users and improve Apex Lift, as described in the Privacy Policy. Never sell or share it.</p>`;
        $('q').oninput = e => { query = e.target.value; renderTable(); };
        $('csv').onclick = downloadCSV;
        $('reload').onclick = loadUsers;
        document.querySelectorAll('th').forEach(th => th.onclick = () => { const k = th.dataset.k; sortDir = sortKey === k ? -sortDir : -1; sortKey = k; render(); });
        $('rows').onclick = e => { const tr = e.target.closest('tr[data-uid]'); if (tr) openUser(tr.dataset.uid); };
        renderStats(); renderTable();
    };

    // ---------- one user ----------
    const openUser = uid => {
        const u = users.find(x => x.uid === uid); if (!u) return;
        const m = u.raw, b = isObj(m.body) ? m.body : {};
        const plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(isObj) : [];
        const kv = (l, v) => `<div><span>${esc(l)}</span><b>${esc(v || '—')}</b></div>`;
        const hist = Object.entries(u.history || {}).filter(([, l]) => l.length).map(([k, l]) => {
            const last = l[l.length - 1] || {}, best = Math.max(0, ...l.map(x => parseFloat(x.w) || 0));
            return `<div><span>${esc(k.replace(/^global_/, '').replace(/_/g, ' '))}</span><span>${l.length} sessions · best ${best} kg · last ${esc(fmtDate(logTime(last)))}</span></div>`;
        }).join('') || '<div><span class="note">No workouts yet.</span></div>';
        const weights = Array.isArray(b.log) ? b.log.filter(isObj).slice(-8).reverse().map(x => `<div><span>${esc(fmtDate(x.t))}</span><span>${esc(x.kg)} kg</span></div>`).join('') : '';
        $('panel').innerHTML = `<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><h2>${esc(u.name || 'No name')}</h2><div class="note" style="margin:2px 0 0">${esc(u.email)}</div></div><button class="btn" id="close">Close</button></div>
            <h3>About</h3><div class="kv">${kv('Age', u.age)}${kv('Sex', u.sex)}${kv('Height', u.heightCm && u.heightCm + ' cm')}${kv('Weight', u.weightKg && u.weightKg + ' kg')}${kv('Goal', u.goal)}${kv('Days per week', u.days)}${kv('Experience', u.exp)}${kv('Equipment', u.eq)}${kv('Joined', fmtDate(u.joined))}${kv('Last active', fmtDate(u.lastActive))}${kv('Workouts', u.workouts)}${kv('Terms version', u.terms)}</div>
            ${weights ? `<h3>Body weight</h3><div class="list">${weights}</div>` : ''}
            <h3>Routines</h3><div class="list">${plan.map(w => `<div><span>${esc(w.name)}${w.id === m.activeWeek ? ' <span class="pill">active</span>' : ''}</span><span>${(Array.isArray(w.schedule) ? w.schedule : []).filter(d => isObj(d) && !d.isRest).length} training days</span></div>`).join('') || '<div><span class="note">None</span></div>'}</div>
            <h3>Exercises</h3><div class="list">${hist}</div>
            <h3>Account backups</h3><div class="list">${u.backups.map(x => `<div><span>${esc(fmtDate(x.createdAt))} · ${esc(x.kind)}</span><span><button class="btn" data-bk="${esc(x.id)}">Download</button></span></div>`).join('') || '<div><span class="note">No backups</span></div>'}</div>
            <div style="margin-top:20px"><button class="btn gold" id="dl">Download all data (JSON)</button></div>
            <p class="note">User UID: ${esc(u.uid)}</p>`;
        $('close').onclick = () => $('drawer').classList.remove('open');
        $('dl').onclick = () => saveFile(`ApexLift_${safeName(u)}_data.json`, JSON.stringify({ uid: u.uid, account: m.account || null, about: m.body || null, profile: m.profile || null, settings: { startDay: m.startDay, rest: m.rest }, routines: m.plan || null, history: u.history || {} }, null, 2));
        $('panel').querySelectorAll('[data-bk]').forEach(btn => btn.onclick = () => downloadBackup(u, btn.dataset.bk, btn));
        $('drawer').classList.add('open');
    };
    const safeName = u => (u.name || u.uid).replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40);
    const downloadBackup = async (u, id, btn) => {
        btn.disabled = true; btn.textContent = '…';
        try {
            const meta = (await db.doc(`users/${u.uid}/backups/${id}`).get()).data() || {}; let json = '';
            for (let i = 0; i < Math.min(30, Number(meta.parts) || 1); i++) json += ((await db.doc(`users/${u.uid}/backups/${id}/parts/${i}`).get()).data() || {}).d || '';
            saveFile(`ApexLift_${safeName(u)}_backup_${fmtDate(meta.createdAt).replace(/ /g, '-')}.json`, JSON.stringify(JSON.parse(json), null, 2));
            btn.textContent = 'Downloaded';
        } catch (e) { btn.textContent = 'Failed'; console.warn(e); }
    };
    $('drawer').onclick = e => { if (e.target.id === 'drawer') $('drawer').classList.remove('open'); };

    // ---------- files ----------
    const saveFile = (name, text, type = 'application/json') => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
        document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    };
    const downloadCSV = () => {
        const head = ['Name', 'Email', 'Age', 'Sex', 'Height (cm)', 'Weight (kg)', 'Goal', 'Days per week', 'Experience', 'Equipment', 'Routine', 'Workouts', 'Exercises', 'Joined', 'Last active', 'Last backup', 'Terms version', 'User UID'];
        // cells starting with = + - @ are prefixed so Excel never runs them as formulas
        const q = v => { let s = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
        const rows = filtered().map(u => [u.name, u.email, u.age, u.sex, u.heightCm, u.weightKg, u.goal, u.days, u.exp, u.eq, u.routine, u.workouts >= 0 ? u.workouts : '', u.exercises, fmtDate(u.joined), fmtDate(u.lastActive), fmtDate(u.lastBackup), u.terms, u.uid]);
        const csv = '﻿' + [head, ...rows].map(r => r.map(q).join(',')).join('\r\n'); // ﻿: Excel opens Arabic names correctly
        saveFile(`ApexLift_users_${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
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

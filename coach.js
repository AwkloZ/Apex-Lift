// Apex Coach (coach.html): the app for coaches. A coach is invited by the admin (coachInvites), accepts here once,
// then invites clients with a code or link (coachCodes), sees the clients who joined (coaches/{me}/members) and sends
// them routines and messages with the same builder as the admin page (admin-coach.js → users/{uid}/coach/plan).
// What a coach may read or write is decided by firestore.rules (COACHING); this page only shows it.
// Looks like the Apex Lift app (coach.css): a floating dock with Clients, Invite and Account; a client opens as a full page.
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
    const { $, esc, isObj } = window.ApexAdminUtils; // admin-utils.js
    const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
    const newCode = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, x => CODE_ABC[x % 32]).join(''); };
    const fmtCode = c => `${c.slice(0, 4)}-${c.slice(4)}`;
    const DAY = 86400000, WEEK = 7 * DAY;
    const fmtDate = t => t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const ago = t => { if (!t) return 'not yet'; const d = Math.floor((Date.now() - t) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
    // the Apex Lift app next to this page (works on the site and in a sub-folder on your computer, e.g. Live Server)
    const clientLink = code => new URL(`./?coach=${code}`, location.href).href;
    const withTimeout = (p, ms = 20000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'timeout' })), ms))]);
    const icons = root => { if (window.lucide) window.lucide.createIcons({ root }); };
    const THEME_KEY = 'workoutTheme_rakan_final'; // the same setting as the Apex Lift app on this device

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), db = firebase.firestore();
    // tests only: on this computer with ?emu=1 the page talks to the Firebase emulators (tools/rules-test), never to the real database
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('emu')) { auth.useEmulator('http://127.0.0.1:9099'); db.useEmulator('127.0.0.1', 8080); }

    const params = new URLSearchParams(location.search);
    let invite = CODE_RE.test(params.get('invite') || '') ? params.get('invite') : '';
    let me = null, coach = null, clients = [], codes = [], tab = 'clients';
    const forgetInvite = () => { invite = ''; params.delete('invite'); history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : '')); };

    // ---------- pieces of the page ----------
    const main = $('main'), dock = $('dock');
    const draw = (html, withDock = false) => {
        main.innerHTML = `<div class="fade-in">${html}</div>`;
        dock.hidden = !withDock;
        dock.querySelectorAll('[data-tab]').forEach(b => { const on = withDock && b.dataset.tab === tab; b.classList.toggle('is-on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); });
        icons(main);
        window.scrollTo(0, 0);
    };
    const top = (right = '') => `<header class="top"><div class="logo-mark" dir="ltr">APEX <span>LIFT</span></div>${right}</header>`;
    const coachTag = '<span class="top-tag"><i data-lucide="whistle"></i>Coach</span>';
    // a status screen: soft circle with an icon, title, text, buttons
    const hero = (icon, title, text, buttons = '', bad = false) => draw(`${top()}<div class="hero"><div class="orb${bad ? ' is-bad' : ''}"><i data-lucide="${icon}"></i></div><h1>${esc(title)}</h1><p>${text}</p>${buttons}</div>`);
    const signOutBtn = '<button class="btn tap" data-signout><i data-lucide="log-out"></i>Sign out</button>';
    const bindSignOut = () => main.querySelectorAll('[data-signout]').forEach(b => b.onclick = () => auth.signOut());
    // pop-up card, like the app's confirmations; resolves true when confirmed
    const ask = (title, text, okLabel, danger = false) => new Promise(done => {
        const o = document.createElement('div');
        o.className = 'pop'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
        o.innerHTML = `<div class="pop-card"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="pop-actions"><button class="btn tap" id="c-cancel">Cancel</button><button class="btn tap ${danger ? 'is-danger' : 'gold'}" id="c-ok">${esc(okLabel)}</button></div></div>`;
        const close = v => { o.remove(); document.removeEventListener('keydown', key); done(v); };
        const key = e => { if (e.key === 'Escape') close(false); };
        o.onclick = e => { if (e.target === o) close(false); };
        document.body.appendChild(o);
        o.querySelector('#c-cancel').onclick = () => close(false);
        o.querySelector('#c-ok').onclick = () => close(true);
        document.addEventListener('keydown', key);
        o.querySelector('#c-ok').focus();
    });
    let toastTimer = 0;
    const toast = (text, bad = false) => {
        const old = document.querySelector('.toast'); if (old) old.remove();
        const t = document.createElement('div');
        t.className = `toast${bad ? ' is-bad' : ''}`; t.setAttribute('role', 'status');
        t.innerHTML = `<i data-lucide="${bad ? 'alert-circle' : 'check-circle'}"></i><span>${esc(text)}</span>`;
        document.body.appendChild(t); icons(t);
        clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 3000);
    };
    const copyText = async s => { try { await navigator.clipboard.writeText(s); toast('Link copied'); } catch (e) { toast('Could not copy. Use Share instead.', true); } };

    // ---------- signing in: coach-sign-in.js ----------
    const signInScreen = (msg = '') => { draw(''); window.ApexCoachSignIn.show({ el: main, auth, invited: !!invite, msg }); };
    const verifyScreen = () => { draw(''); window.ApexCoachSignIn.verify({ el: main, auth, user: me, onContinue: route }); };

    // ---------- which screen ----------
    const loading = () => draw(`${top()}<div class="skeleton" style="height:96px;margin-bottom:10px" aria-hidden="true"></div><div class="skeleton" style="height:72px;margin-bottom:10px" aria-hidden="true"></div><div class="skeleton" style="height:72px" aria-hidden="true"></div>`);
    const route = async () => {
        loading();
        try {
            const cs = await withTimeout(db.doc(`coaches/${me.uid}`).get());
            coach = cs.exists ? { uid: me.uid, ...cs.data() } : null;
            if (invite && (!coach || coach.invite !== invite)) return inviteScreen();
            if (invite) forgetInvite();
            if (!coach) { hero('user-x', 'This isn\'t a coach account', `You're signed in as <b>${esc(me.email || '')}</b>. To coach on Apex Lift, ask Apex Lift for an invitation and open its link.`, signOutBtn); return bindSignOut(); }
            if (!coach.active) { hero('pause-circle', 'Your coach account is switched off', 'Apex Lift switched your coach account off, so you can\'t see your clients for now. Contact Apex Lift support.', signOutBtn, true); return bindSignOut(); }
            await home();
        } catch (e) {
            console.warn(e);
            hero('wifi-off', 'Something went wrong', `Could not load your coach account (${esc(e.code || 'error')}). Check your connection and try again.`, `<button id="again" class="btn gold tap">Try again</button>${signOutBtn}`, true);
            $('again').onclick = route; bindSignOut();
        }
    };

    // ---------- accepting an invitation ----------
    const inviteScreen = async () => {
        let inv = null;
        try { const s = await withTimeout(db.doc(`coachInvites/${invite}`).get()); inv = s.exists ? s.data() : null; } catch (e) { inv = null; }
        if (!inv) { hero('mail-x', 'This invitation is for another email', `You're signed in as <b>${esc(me.email || '')}</b>. Sign out and sign in with the email the invitation was sent to, or ask Apex Lift for a new link.`, signOutBtn, true); return bindSignOut(); }
        if (inv.usedBy && inv.usedBy !== me.uid) { hero('link-2-off', 'This invitation was already used', 'Each invitation link works once. Ask Apex Lift for a new one.', signOutBtn, true); return bindSignOut(); }
        if (!me.emailVerified) return verifyScreen();
        hero('whistle', `You're invited as ${inv.name}`, `Accept to coach on Apex Lift as <b>${esc(me.email)}</b>. Your clients join you with a link you share, and you send them routines and messages.`,
            `<button id="accept" class="btn gold tap"><i data-lucide="check"></i>Accept and start coaching</button>${signOutBtn}`);
        bindSignOut();
        $('accept').onclick = async e => {
            const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true;
            try {
                const now = Date.now(), b = db.batch();
                b.update(db.doc(`coachInvites/${invite}`), { usedBy: me.uid, usedAt: now });
                b.set(db.doc(`coaches/${me.uid}`), { name: String(inv.name).slice(0, 100), email: (me.email || '').toLowerCase(), invite, active: true, createdAt: now });
                await withTimeout(b.commit());
                forgetInvite(); toast('Welcome to Apex Coach'); route();
            } catch (x) { console.warn(x); btn.disabled = false; toast('Could not accept. Try again.', true); }
        };
    };

    // ---------- data ----------
    const load = async () => {
        const [ms, cc] = await Promise.all([db.collection(`coaches/${me.uid}/members`).get(), db.collection('coachCodes').where('coach', '==', me.uid).get()]);
        codes = cc.docs.map(d => ({ code: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt);
        // each client's account (name, routines, last active), all at once
        clients = await Promise.all(ms.docs.map(async d => {
            const m = { uid: d.id, ...d.data() };
            try { const u = await db.doc(`users/${m.uid}`).get(); m.raw = u.exists ? u.data() : {}; } catch (e) { m.raw = {}; }
            // everything here was written by the client: keep only values of the right type
            const a = isObj(m.raw.account) ? m.raw.account : {}, str = v => (typeof v === 'string' ? v : '');
            const act = isObj(m.raw.activity) ? m.raw.activity : {};
            m.email = str(m.email);
            m.name = (str(m.name) || str(a.name) || m.email || 'No name').slice(0, 100);
            m.lastWorkout = Number(act.last) || 0;
            m.workouts = Number(act.n) || 0;
            m.joinedAt = Number(m.joinedAt) || 0;
            m.lastActive = Math.max(Number(m.raw.updatedAt) || 0, m.lastWorkout);
            return m;
        }));
        clients.sort((a, b) => b.lastActive - a.lastActive);
    };
    const trainedThisWeek = c => c.lastWorkout && Date.now() - c.lastWorkout < WEEK;

    // ---------- tabs ----------
    // reload: read the clients again from the database (after a change); otherwise draw what was loaded (going Back)
    const home = async (reload = true) => {
        if (reload) {
            try { await withTimeout(load()); }
            catch (e) { if (e && e.code === 'permission-denied') return route(); throw e; } // switched off meanwhile: route() says so
        }
        if (tab === 'invite') return inviteTab();
        if (tab === 'account') return accountTab();
        clientsTab();
    };
    dock.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; home(false); });

    const clientsTab = () => {
        const active = clients.filter(trainedThisWeek).length;
        const card = c => `<button class="client glass-card tap" data-client="${esc(c.uid)}">
                <span class="av" aria-hidden="true">${esc(c.name.charAt(0).toUpperCase())}${trainedThisWeek(c) ? '<span class="dot"></span>' : ''}</span>
                <span class="who"><b>${esc(c.name)}</b><span>Last workout ${esc(ago(c.lastWorkout))}</span></span>
                <i data-lucide="chevron-right" class="pf-chev"></i></button>`;
        draw(`${top(coachTag)}
            <h1 class="page-title">Clients</h1>
            <p class="page-sub">Hi ${esc(coach.name.split(' ')[0])}. Tap a client to send a routine or a message.</p>
            ${clients.length ? `<div class="stats">
                <div class="stat glass-card"><b>${clients.length}</b><span>Clients</span></div>
                <div class="stat glass-card"><b>${active}</b><span>Trained this week</span></div>
                <div class="stat glass-card"><b>${clients.length - active}</b><span>Not this week</span></div></div>
                <div id="list">${clients.map(card).join('')}</div>`
            : `<div class="glass-card hero" style="padding:28px 20px"><div class="orb is-small"><i data-lucide="users"></i></div><h2>No clients yet</h2><p>Make a client link and send it to your client. They open it in Apex Lift and tap Join.</p><button class="btn gold tap" id="go-invite"><i data-lucide="user-plus"></i>Invite a client</button></div>`}`, true);
        main.querySelectorAll('[data-client]').forEach(b => b.onclick = () => openClient(b.dataset.client));
        const gi = $('go-invite'); if (gi) gi.onclick = () => { tab = 'invite'; home(false); };
    };

    const inviteTab = () => {
        const share = !!navigator.share;
        draw(`${top(coachTag)}
            <h1 class="page-title">Invite a client</h1>
            <p class="page-sub">Send a link to your client. They open it in Apex Lift and tap Join, or type the code in Profile → Join a coach.</p>
            <button id="new-code" class="btn gold tap"><i data-lucide="plus"></i>New client link</button>
            ${codes.length ? `<span class="pf-h">Your client links</span>${codes.map(c => `<div class="code-card glass-card">
                    <div class="code-big" dir="ltr">${esc(fmtCode(c.code))}</div>
                    <div class="code-url" dir="ltr">${esc(clientLink(c.code))}</div>
                    <div class="code-actions">
                        <button class="mini-btn tap" data-${share ? 'share' : 'copy'}="${esc(c.code)}"><i data-lucide="${share ? 'share-2' : 'copy'}"></i>${share ? 'Share link' : 'Copy link'}</button>
                        ${share ? `<button class="mini-btn is-icon tap" data-copy="${esc(c.code)}" aria-label="Copy link"><i data-lucide="copy"></i></button>` : ''}
                        <button class="mini-btn is-icon is-danger tap" data-del-code="${esc(c.code)}" aria-label="Delete link"><i data-lucide="trash-2"></i></button>
                    </div></div>`).join('')}` : ''}
            <p class="pf-note"><i data-lucide="lock" style="width:13px;height:13px;vertical-align:-2px"></i> Anyone with a link can join you, so send each one only to your clients. Deleting a link stops it working; clients who already joined stay.</p>`, true);
        $('new-code').onclick = newClientCode;
        main.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copyText(clientLink(b.dataset.copy)));
        main.querySelectorAll('[data-share]').forEach(b => b.onclick = () => navigator.share({ title: 'Apex Coach', text: `Join me as your coach on Apex Lift (code ${fmtCode(b.dataset.share)})`, url: clientLink(b.dataset.share) }).catch(() => {}));
        main.querySelectorAll('[data-del-code]').forEach(b => b.onclick = () => delCode(b.dataset.delCode, b));
    };
    const newClientCode = async e => {
        const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${newCode()}`).set({ coach: me.uid, name: String(coach.name).slice(0, 100), createdAt: Date.now() })); await home(); toast('Client link ready'); }
        catch (x) { console.warn(x); btn.disabled = false; toast('Could not make a link. Try again.', true); }
    };
    const delCode = async (code, btn) => {
        if (btn.disabled || !(await ask('Delete this link?', 'It stops working. Clients who already joined stay.', 'Delete', true))) return;
        btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${code}`).delete()); await home(); toast('Link deleted'); } catch (x) { console.warn(x); btn.disabled = false; toast('Could not delete. Try again.', true); }
    };

    const accountTab = () => {
        const th = (() => { try { const v = localStorage.getItem(THEME_KEY); return ['light', 'system'].includes(v) ? v : 'dark'; } catch (e) { return 'dark'; } })();
        draw(`${top(coachTag)}
            <div class="person"><span class="av is-big" aria-hidden="true">${esc(coach.name.charAt(0).toUpperCase())}</span><h2>${esc(coach.name)}</h2><p>${esc(me.email || '')}</p></div>
            <span class="pf-h">Coach account</span>
            <div class="pf-group">
                <button class="pf-row tap" id="rename"><span class="pf-ic"><i data-lucide="pencil"></i></span><span class="pf-label">Your name<span class="pf-sub">Clients see it when they join you</span></span><span class="pf-val">${esc(coach.name)}</span><i data-lucide="chevron-right" class="pf-chev"></i></button>
                <div class="pf-row"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">Coach since</span><span class="pf-val">${esc(fmtDate(coach.createdAt))}</span></div>
            </div>
            <span class="pf-h">App</span>
            <div class="pf-group">
                <label class="pf-row"><span class="pf-ic"><i data-lucide="sun-moon"></i></span><span class="pf-label">Theme</span>
                    <select id="theme" class="pf-select" aria-label="Theme"><option value="dark" ${th === 'dark' ? 'selected' : ''}>Dark</option><option value="light" ${th === 'light' ? 'selected' : ''}>Light</option><option value="system" ${th === 'system' ? 'selected' : ''}>Phone setting</option></select>
                    <i data-lucide="chevrons-up-down" class="pf-chev"></i></label>
            </div>
            <span class="pf-h">Help</span>
            <div class="pf-group">
                <a class="pf-row tap" href="https://instagram.com/apexlift.app" target="_blank" rel="noopener noreferrer"><span class="pf-ic"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></span><span class="pf-label">Contact us<span class="pf-sub">@apexlift.app</span></span><i data-lucide="arrow-up-right" class="pf-chev"></i></a>
                <a class="pf-row tap" href="privacy.html" target="_blank" rel="noopener"><span class="pf-ic"><i data-lucide="shield-check"></i></span><span class="pf-label">Privacy Policy</span><i data-lucide="arrow-up-right" class="pf-chev"></i></a>
            </div>
            <div class="pf-group" style="margin-top:22px">
                <button class="pf-row is-danger tap" data-signout><span class="pf-ic"><i data-lucide="log-out"></i></span><span class="pf-label">Sign out</span></button>
            </div>`, true);
        bindSignOut();
        $('theme').onchange = e => {
            try { localStorage.setItem(THEME_KEY, e.target.value); } catch (x) {}
            const light = e.target.value === 'light' || (e.target.value === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
            document.documentElement.toggleAttribute('data-theme', false);
            if (light) document.documentElement.setAttribute('data-theme', 'light');
            const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f3f0' : '#12100d');
        };
        $('rename').onclick = renameSheet;
    };
    const renameSheet = () => {
        const o = document.createElement('div');
        o.className = 'pop'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
        o.innerHTML = `<div class="pop-card"><h3>Your name</h3><p>Clients see this name when they join you and on your messages.</p>
            <input id="rn" class="field" maxlength="100" value="${esc(coach.name)}" autocomplete="name">
            <div class="pop-actions"><button class="btn tap" id="rn-cancel">Cancel</button><button class="btn gold tap" id="rn-ok">Save</button></div></div>`;
        document.body.appendChild(o);
        const close = () => o.remove();
        o.onclick = e => { if (e.target === o) close(); };
        o.querySelector('#rn-cancel').onclick = close;
        o.querySelector('#rn').focus();
        o.querySelector('#rn-ok').onclick = async e => {
            const name = o.querySelector('#rn').value.trim().slice(0, 100); if (!name) return;
            e.currentTarget.disabled = true;
            try { await withTimeout(db.doc(`coaches/${me.uid}`).update({ name })); coach.name = name; close(); accountTab(); toast('Name saved'); }
            catch (x) { console.warn(x); e.currentTarget.disabled = false; toast('Could not save. Try again.', true); }
        };
    };

    // ---------- one client (a full page: back button, name in the middle) ----------
    const openClient = uid => {
        const c = clients.find(x => x.uid === uid); if (!c) return;
        const m = c.raw || {}, plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(w => isObj(w) && typeof w.id === 'string').map(w => ({ ...w, name: String(w.name || 'Routine') })) : [];
        const b = isObj(m.body) ? m.body : {}, pr = isObj(m.profile) ? m.profile : {};
        const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
        const row = (icon, label, value) => `<div class="pf-row"><span class="pf-ic"><i data-lucide="${icon}"></i></span><span class="pf-label">${esc(label)}</span><span class="pf-val">${esc(value || '—')}</span></div>`;
        draw(`<div class="page-bar"><button id="back" class="back-btn tap" aria-label="Back to clients"><i data-lucide="chevron-left"></i></button><div class="page-bar-title">${esc(c.name)}</div><span></span></div>
            <div class="person"><span class="av is-big" aria-hidden="true">${esc(c.name.charAt(0).toUpperCase())}${trainedThisWeek(c) ? '<span class="dot"></span>' : ''}</span><h2>${esc(c.name)}</h2><p>${esc(c.email)}</p></div>
            <div class="stats">
                <div class="stat glass-card"><b>${c.workouts}</b><span>Workouts</span></div>
                <div class="stat glass-card"><b>${esc(String(pr.days || '—'))}</b><span>Days a week</span></div>
                <div class="stat glass-card"><b>${c.lastWorkout ? Math.max(0, Math.floor((Date.now() - c.lastWorkout) / DAY)) : '—'}</b><span>Days since last workout</span></div>
            </div>
            <button id="c-new" class="btn gold tap"><i data-lucide="send"></i>Send a new routine</button>
            <button id="c-note" class="btn tap"><i data-lucide="message-square"></i>Send a message</button>
            <span class="pf-h">Their routines</span>
            <div class="pf-group">${plan.map(w => `<button class="pf-row tap" data-edit="${esc(w.id)}"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">${esc(w.name)}${w.id === m.activeWeek ? ' <span class="pill">Active</span>' : ''}<span class="pf-sub">Edit and send</span></span><i data-lucide="chevron-right" class="pf-chev"></i></button>`).join('')
                || '<div class="pf-row"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">No routines yet<span class="pf-sub">Send them a new routine above</span></span></div>'}</div>
            <span class="pf-h">About</span>
            <div class="pf-group">
                ${row('user-check', 'Joined you', fmtDate(c.joinedAt))}
                ${row('dumbbell', 'Last workout', ago(c.lastWorkout))}
                ${row('scale', 'Weight', num(b.weightKg) !== null ? `${b.weightKg} kg` : '')}
                ${row('ruler', 'Height', num(b.heightCm) !== null ? `${b.heightCm} cm` : '')}
            </div>
            <div class="pf-group" style="margin-top:22px">
                <button id="c-remove" class="pf-row is-danger tap"><span class="pf-ic"><i data-lucide="user-x"></i></span><span class="pf-label">Remove this client<span class="pf-sub">You can no longer see their account</span></span></button>
            </div>`);
        $('back').onclick = () => home(false);
        const open = (mode, routine = null) => window.ApexCoach.open({
            db, auth, mode, routine, templatesPath: `coaches/${me.uid}/templates`,
            client: { uid: c.uid, name: c.name, startDay: typeof m.startDay === 'string' ? m.startDay : '', exp: String(pr.exp || ''), session: String(pr.session || ''), routines: plan, activeWeek: m.activeWeek },
            onSent: () => toast(mode === 'note' ? 'Message sent' : 'Routine sent')
        });
        $('c-new').onclick = () => open('add');
        $('c-note').onclick = () => open('note');
        main.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => { const w = plan.find(x => x.id === btn.dataset.edit); if (w) open('replace', w); });
        $('c-remove').onclick = async e => {
            const btn = e.currentTarget;
            if (btn.disabled || !(await ask(`Remove ${c.name}?`, 'You can no longer see their account. They can join you again with a new link.', 'Remove', true))) return;
            btn.disabled = true;
            try {
                const bt = db.batch();
                bt.delete(db.doc(`coaches/${me.uid}/members/${c.uid}`));
                // their link too, but only if it still points to you (they may have joined someone else); their app also notices by itself
                const link = await withTimeout(db.doc(`users/${c.uid}/coach/link`).get()).catch(() => null);
                if (link && link.exists && (link.data() || {}).coachId === me.uid) bt.delete(link.ref);
                await withTimeout(bt.commit()); tab = 'clients'; await home(); toast('Client removed');
            } catch (x) { console.warn(x); tab = 'clients'; await home().catch(() => {}); } // e.g. they already left: show the list as it is now
        };
    };

    // ---------- start ----------
    auth.getRedirectResult().catch(e => signInScreen(e.code || 'Sign-in failed'));
    auth.onAuthStateChanged(u => {
        me = u; tab = 'clients';
        if (!u) return signInScreen();
        if (window.ApexCoachSignIn.needsVerify(u)) return verifyScreen();
        route();
    });
})();

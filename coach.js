// Apex Coach (coach.html): the app for coaches. A coach is invited by the admin (coachInvites), accepts here once,
// then invites clients with a code or link (coachCodes), sees the clients who joined (coaches/{me}/members) and sends
// them routines and messages with the same builder as the admin page (admin-coach.js → users/{uid}/coach/plan).
// What a coach may read or write is decided by firestore.rules (COACHING); this page only shows it.
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
    const DAY = 86400000;
    const fmtDate = t => t ? new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const ago = t => { if (!t) return 'not yet'; const d = Math.floor((Date.now() - t) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
    const clientLink = code => `${location.origin}/?coach=${code}`;
    const withTimeout = (p, ms = 20000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'timeout' })), ms))]);

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), db = firebase.firestore();
    // tests only: on this computer with ?emu=1 the page talks to the Firebase emulators (tools/rules-test), never to the real database
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('emu')) { auth.useEmulator('http://127.0.0.1:9099'); db.useEmulator('127.0.0.1', 8080); }

    const params = new URLSearchParams(location.search);
    let invite = CODE_RE.test(params.get('invite') || '') ? params.get('invite') : '';
    let me = null, coach = null, clients = [], codes = [];
    const screen = html => { $('main').innerHTML = `<div class="narrow">${html}</div>`; };
    const center = (title, text, extra = '') => screen(`<div class="center"><h1>${esc(title)}</h1><p>${text}</p>${extra}</div>`);
    const signOutBtn = '<button class="btn" id="so2">Sign out</button>';
    const bindSignOut = () => { const b = $('so2'); if (b) b.onclick = () => auth.signOut(); };
    const forgetInvite = () => { invite = ''; params.delete('invite'); history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : '')); };

    // ---------- signing in: coach-sign-in.js ----------
    const signInScreen = (msg = '') => window.ApexCoachSignIn.show({ el: $('main'), auth, invited: !!invite, msg });
    const verifyScreen = () => window.ApexCoachSignIn.verify({ el: $('main'), auth, user: me, onContinue: route });

    // ---------- which screen ----------
    const route = async () => {
        center('Apex Coach', 'Loading…');
        try {
            const cs = await withTimeout(db.doc(`coaches/${me.uid}`).get());
            coach = cs.exists ? { uid: me.uid, ...cs.data() } : null;
            if (invite && (!coach || coach.invite !== invite)) return inviteScreen();
            if (invite) forgetInvite();
            if (!coach) return center('This isn\'t a coach account', `You're signed in as <b>${esc(me.email || '')}</b>. To coach on Apex Lift, ask Apex Lift for an invitation and open its link.`, signOutBtn), bindSignOut();
            if (!coach.active) return center('Your coach account is switched off', 'Apex Lift switched your coach account off, so you can\'t see your clients for now. Contact Apex Lift support.', signOutBtn), bindSignOut();
            await home();
        } catch (e) {
            console.warn(e);
            center('Something went wrong', `Could not load your coach account (${esc(e.code || 'error')}). Check your connection and try again.`, `<button id="again" class="btn gold">Try again</button> ${signOutBtn}`);
            $('again').onclick = route; bindSignOut();
        }
    };

    // ---------- accepting an invitation ----------
    const inviteScreen = async () => {
        let inv = null;
        try { const s = await withTimeout(db.doc(`coachInvites/${invite}`).get()); inv = s.exists ? s.data() : null; } catch (e) { inv = null; }
        if (!inv) {
            center('This invitation is for another email', `You're signed in as <b>${esc(me.email || '')}</b>. Sign out and sign in with the email the invitation was sent to, or ask Apex Lift for a new link.`, signOutBtn);
            return bindSignOut();
        }
        if (inv.usedBy && inv.usedBy !== me.uid) { center('This invitation was already used', 'Each invitation link works once. Ask Apex Lift for a new one.', signOutBtn); return bindSignOut(); }
        if (!me.emailVerified) return verifyScreen();
        center(`You're invited as ${inv.name}`, `Accept to coach on Apex Lift as <b>${esc(me.email)}</b>. Your clients join you with a code you share, and you send them routines and messages.`,
            `<button id="accept" class="btn gold">Accept and start coaching</button> ${signOutBtn}`);
        bindSignOut();
        $('accept').onclick = async e => {
            const btn = e.target; if (btn.disabled) return; btn.disabled = true;
            try {
                const now = Date.now(), b = db.batch();
                b.update(db.doc(`coachInvites/${invite}`), { usedBy: me.uid, usedAt: now });
                b.set(db.doc(`coaches/${me.uid}`), { name: String(inv.name).slice(0, 100), email: (me.email || '').toLowerCase(), invite, active: true, createdAt: now });
                await withTimeout(b.commit());
                forgetInvite(); route();
            } catch (x) { console.warn(x); btn.disabled = false; btn.textContent = 'Could not accept: try again'; }
        };
    };

    // ---------- clients ----------
    const load = async () => {
        const [ms, cc] = await Promise.all([db.collection(`coaches/${me.uid}/members`).get(), db.collection('coachCodes').where('coach', '==', me.uid).get()]);
        codes = cc.docs.map(d => ({ code: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt);
        // each client's account (name, routines, last active), all at once
        clients = await Promise.all(ms.docs.map(async d => {
            const m = { uid: d.id, ...d.data() };
            try { const u = await db.doc(`users/${m.uid}`).get(); m.raw = u.exists ? u.data() : {}; } catch (e) { m.raw = {}; }
            // everything here was written by the client: keep only values of the right type
            const a = isObj(m.raw.account) ? m.raw.account : {}, str = v => (typeof v === 'string' ? v : '');
            m.email = str(m.email);
            m.name = (str(m.name) || str(a.name) || m.email || 'No name').slice(0, 100);
            m.lastWorkout = Number(isObj(m.raw.activity) && m.raw.activity.last) || 0;
            m.joinedAt = Number(m.joinedAt) || 0;
            m.lastActive = Math.max(Number(m.raw.updatedAt) || 0, m.lastWorkout);
            return m;
        }));
        clients.sort((a, b) => b.lastActive - a.lastActive);
    };
    // reload: read the clients again from the database (after a change); otherwise draw what was loaded (going Back)
    const home = async (reload = true) => {
        if (reload) {
            try { await withTimeout(load()); }
            catch (e) { if (e && e.code === 'permission-denied') return route(); throw e; } // switched off meanwhile: route() says so
        }
        $('main').innerHTML = `<div class="narrow">
            <div class="head-row"><h2>Clients</h2><span class="note" style="margin:0">${esc(coach.name)}</span></div>
            <div id="list">${clients.map(c => `<button class="client" data-client="${esc(c.uid)}"><span class="av">${esc(c.name.charAt(0).toUpperCase())}</span>
                <span class="who"><b>${esc(c.name)}</b><span>Last workout ${esc(ago(c.lastWorkout))} · joined ${esc(fmtDate(c.joinedAt))}</span></span><span class="note" style="margin:0">›</span></button>`).join('')
                || '<div class="card-block"><b style="color:#fff">No clients yet</b><p class="note" style="margin:6px 0 0">Make a client link below and send it to your client. They open it in Apex Lift and tap Join.</p></div>'}</div>
            <div class="card-block" style="margin-top:16px"><div class="head-row" style="margin-top:0"><h3 style="margin:0">Invite a client</h3><button id="new-code" class="btn gold">New client link</button></div>
                <p class="note" style="margin:0 0 6px">Anyone with a link or code can join you, so send each one only to your clients. Delete a code to stop it working (clients who already joined stay).</p>
                <div class="list">${codes.map(c => `<div><span><span class="code">${esc(c.code)}</span><br><span class="note">${esc(clientLink(c.code))}</span></span>
                    <span><button class="btn" data-copy="${esc(c.code)}">Copy link</button> <button class="btn" data-del-code="${esc(c.code)}">Delete</button></span></div>`).join('') || '<div><span class="note">No client links yet.</span></div>'}</div></div>
            </div>`;
        $('new-code').onclick = newClientCode;
        document.querySelectorAll('[data-client]').forEach(b => b.onclick = () => openClient(b.dataset.client));
        document.querySelectorAll('[data-copy]').forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(clientLink(b.dataset.copy)); b.textContent = 'Copied'; } catch (e) { b.textContent = 'Copy failed'; } });
        document.querySelectorAll('[data-del-code]').forEach(b => b.onclick = () => delCode(b.dataset.delCode, b));
    };
    const newClientCode = async e => {
        const btn = e.target; if (btn.disabled) return; btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${newCode()}`).set({ coach: me.uid, name: String(coach.name).slice(0, 100), createdAt: Date.now() })); await home(); }
        catch (x) { console.warn(x); btn.disabled = false; btn.textContent = 'Failed: try again'; }
    };
    const delCode = async (code, btn) => {
        if (btn.disabled || !confirm('Delete this client link? It stops working. Clients who already joined stay.')) return;
        btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${code}`).delete()); await home(); } catch (x) { console.warn(x); btn.disabled = false; btn.textContent = 'Failed'; }
    };

    // ---------- one client ----------
    const openClient = uid => {
        const c = clients.find(x => x.uid === uid); if (!c) return;
        const m = c.raw || {}, plan = isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(w => isObj(w) && typeof w.id === 'string').map(w => ({ ...w, name: String(w.name || 'Routine') })) : [];
        const b = isObj(m.body) ? m.body : {}, pr = isObj(m.profile) ? m.profile : {};
        const kv = (l, v) => `<div><span>${esc(l)}</span><b>${esc(v || '—')}</b></div>`;
        $('main').innerHTML = `<div class="narrow">
            <div class="head-row"><button id="back" class="btn">‹ Clients</button></div>
            <h2 style="color:#fff;margin:0">${esc(c.name)}</h2><div class="note" style="margin:2px 0 12px">${esc(c.email)} · last workout ${esc(ago(c.lastWorkout))}</div>
            <div class="kv">${kv('Joined', fmtDate(c.joinedAt))}${kv('Weight', b.weightKg && `${b.weightKg} kg`)}${kv('Height', b.heightCm && `${b.heightCm} cm`)}${kv('Days per week', pr.days)}</div>
            <h3>Send</h3>
            <div class="tools"><button id="c-new" class="btn gold">Send a new routine</button><button id="c-note" class="btn">Send a message</button></div>
            <h3>Their routines</h3><div class="list">${plan.map(w => `<div><span>${esc(w.name)}${w.id === m.activeWeek ? ' <span class="pill">active</span>' : ''}</span><span><button class="btn" data-edit="${esc(w.id)}">Edit and send</button></span></div>`).join('') || '<div><span class="note">No routines yet.</span></div>'}</div>
            <h3>Client</h3><button id="c-remove" class="btn">Remove this client</button>
            <p class="note">Removing ends your access to their account. They can join you again with a new link.</p></div>`;
        $('back').onclick = () => home(false);
        const open = (mode, routine = null) => window.ApexCoach.open({
            db, auth, mode, routine, templatesPath: `coaches/${me.uid}/templates`,
            client: { uid: c.uid, name: c.name, startDay: typeof m.startDay === 'string' ? m.startDay : '', exp: String(pr.exp || ''), session: String(pr.session || ''), routines: plan, activeWeek: m.activeWeek },
            onSent: () => {}
        });
        $('c-new').onclick = () => open('add');
        $('c-note').onclick = () => open('note');
        document.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => { const w = plan.find(x => x.id === btn.dataset.edit); if (w) open('replace', w); });
        $('c-remove').onclick = async e => {
            const btn = e.target; if (btn.disabled || !confirm(`Remove ${c.name}? You can no longer see their account.`)) return;
            btn.disabled = true;
            try {
                const bt = db.batch();
                bt.delete(db.doc(`coaches/${me.uid}/members/${c.uid}`));
                // their link too, but only if it still points to you (they may have joined someone else); their app also notices by itself
                const link = await withTimeout(db.doc(`users/${c.uid}/coach/link`).get()).catch(() => null);
                if (link && link.exists && (link.data() || {}).coachId === me.uid) bt.delete(link.ref);
                await withTimeout(bt.commit()); await home();
            } catch (x) { console.warn(x); await home().catch(() => {}); } // e.g. they already left: show the list as it is now
        };
        window.scrollTo(0, 0);
    };

    // ---------- start ----------
    $('signout').onclick = () => auth.signOut();
    auth.getRedirectResult().catch(e => signInScreen(e.code || 'Sign-in failed'));
    auth.onAuthStateChanged(u => {
        me = u; $('signout').hidden = !u; $('who').textContent = u ? (u.email || '') : '';
        if (!u) return signInScreen();
        if (window.ApexCoachSignIn.needsVerify(u)) return verifyScreen();
        route();
    });
})();

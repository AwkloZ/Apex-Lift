// Apex Lift admin page: the Coaches tab. The admin invites coaches (coachInvites), sees each coach and their clients
// (coaches/{coach}/members), switches a coach on or off, and can take a client off a coach.
// Access is decided by firestore.rules (COACHING). Loaded after admin-utils.js, before admin.js.
window.ApexCoaches = (() => {
    'use strict';
    const { $, esc } = window.ApexAdminUtils;
    const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const newCode = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, x => CODE_ABC[x % 32]).join(''); };
    const fmtDate = t => t ? new Date(t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    const inviteLink = code => `${location.origin}/coach.html?invite=${code}`;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let C = null; // { el, db, auth, audit, invites, coaches, members: { coachUid: [ {uid, ...} ] }, lastLink }

    const load = async () => {
        const [is, cs, ms] = await Promise.all([C.db.collection('coachInvites').get(), C.db.collection('coaches').get(), C.db.collectionGroup('members').get()]);
        C.invites = is.docs.map(d => ({ code: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt);
        C.coaches = cs.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (b.active - a.active) || a.name.localeCompare(b.name));
        C.members = {};
        ms.docs.forEach(d => { const coach = d.ref.parent.parent.id; (C.members[coach] = C.members[coach] || []).push({ uid: d.id, ...d.data() }); });
    };

    const draw = () => {
        const open = C.invites.filter(i => !i.usedBy);
        const count = uid => (C.members[uid] || []).length;
        C.el.innerHTML = `<div class="card-block">
                <h3 style="margin-top:0">Invite a coach</h3>
                <p class="note" style="margin:0 0 10px">The coach opens the link, signs in with this email (Google, or email and password) and accepts. Each link works once.</p>
                <div class="tools"><input id="ci-name" type="text" maxlength="100" placeholder="Coach name" autocomplete="off"><input id="ci-email" type="email" maxlength="200" placeholder="Coach email" autocomplete="off"><button id="ci-go" class="btn gold">Create invite</button></div>
                <div id="ci-msg">${C.lastLink ? linkBox(C.lastLink) : ''}</div>
            </div>
            <div class="tools" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Coaches</h3><button id="co-reload" class="btn">Refresh</button></div>
            <div class="list">${C.coaches.map(c => `<div><span><button class="linkbtn" data-coach="${esc(c.uid)}"><b>${esc(c.name)}</b></button> <span class="note">${esc(c.email)}</span><br>
                    <span class="pill ${c.active ? '' : 'off'}">${c.active ? 'Active' : 'Off'}</span> <span class="note">${count(c.uid)} client${count(c.uid) === 1 ? '' : 's'} · since ${esc(fmtDate(c.createdAt))}</span></span>
                    <span><button class="btn" data-toggle="${esc(c.uid)}">${c.active ? 'Switch off' : 'Switch on'}</button></span></div>`).join('') || '<div><span class="note">No coaches yet.</span></div>'}</div>
            ${open.length ? `<h3>Waiting to accept</h3><div class="list">${open.map(i => `<div><span><b>${esc(i.name)}</b> <span class="note">${esc(i.email)}</span><br><span class="pill off">Invited</span> <span class="note">${esc(fmtDate(i.createdAt))} · ${esc(inviteLink(i.code))}</span></span>
                    <span><button class="btn" data-copy="${esc(i.code)}">Copy link</button> <button class="btn" data-del-invite="${esc(i.code)}">Delete</button></span></div>`).join('')}</div>` : ''}
            <div id="co-panel"></div>`;
        $('ci-go').onclick = createInvite;
        $('co-reload').onclick = refresh;
        C.el.querySelectorAll('[data-coach]').forEach(b => b.onclick = () => openCoach(b.dataset.coach));
        C.el.querySelectorAll('[data-toggle]').forEach(b => b.onclick = () => toggle(b.dataset.toggle, b));
        C.el.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copy(inviteLink(b.dataset.copy), b));
        C.el.querySelectorAll('[data-del-invite]').forEach(b => b.onclick = () => delInvite(b.dataset.delInvite, b));
    };
    const linkBox = link => `<div class="info" style="margin-top:10px">Send this link to the coach: <b>${esc(link)}</b> <button class="btn" id="ci-copy">Copy link</button></div>`;
    const copy = async (s, btn) => { try { await navigator.clipboard.writeText(s); btn.textContent = 'Copied'; } catch (e) { btn.textContent = 'Copy failed'; } };

    const createInvite = async () => {
        const btn = $('ci-go'); if (btn.disabled) return;
        const name = $('ci-name').value.trim().slice(0, 100), email = $('ci-email').value.trim().toLowerCase();
        if (!name) return msg('Enter the coach name.');
        if (!EMAIL_RE.test(email) || email.length > 200) return msg('Enter a valid email.');
        if (C.coaches.some(c => c.email === email)) return msg('This email is already a coach.');
        btn.disabled = true;
        try {
            const code = newCode();
            await C.db.doc(`coachInvites/${code}`).set({ name, email, by: C.auth.currentUser.uid, createdAt: Date.now(), usedBy: '', usedAt: 0 });
            C.lastLink = inviteLink(code);
            await refresh();
            const cp = $('ci-copy'); if (cp) cp.onclick = () => copy(C.lastLink, cp);
        } catch (e) { console.warn(e); msg(`Could not create the invite (${e.code || 'error'}). Publish the new firestore.rules if you haven't.`); }
        finally { btn.disabled = false; }
    };
    const msg = s => { $('ci-msg').innerHTML = `<p class="err" style="margin:10px 0 0">${esc(s)}</p>`; };

    const toggle = async (uid, btn) => {
        const c = C.coaches.find(x => x.uid === uid); if (!c || btn.disabled) return;
        if (c.active && !confirm(`Switch off ${c.name}? They lose access to all their clients at once.`)) return;
        btn.disabled = true;
        try { await C.db.doc(`coaches/${uid}`).update({ active: !c.active }); C.audit(uid, 'coach'); await refresh(); }
        catch (e) { console.warn(e); btn.disabled = false; btn.textContent = 'Failed'; }
    };
    const delInvite = async (code, btn) => {
        if (btn.disabled || !confirm('Delete this invite? The link stops working.')) return;
        btn.disabled = true;
        try { await C.db.doc(`coachInvites/${code}`).delete(); await refresh(); } catch (e) { console.warn(e); btn.textContent = 'Failed'; }
    };

    // one coach and their clients
    const openCoach = uid => {
        const c = C.coaches.find(x => x.uid === uid); if (!c) return;
        const list = (C.members[uid] || []).slice().sort((a, b) => b.joinedAt - a.joinedAt);
        $('co-panel').innerHTML = `<div class="card-block" style="margin-top:16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:start">
                <div><h3 style="margin:0">${esc(c.name)}</h3><div class="note" style="margin:2px 0 0">${esc(c.email)} · ${c.active ? 'Active' : 'Off'}</div></div><button class="btn" id="co-close">Close</button></div>
            <h3>Clients (${list.length})</h3><div class="list">${list.map(m => `<div><span><b>${esc(m.name || 'No name')}</b> <span class="note">${esc(m.email)}</span><br><span class="note">Joined ${esc(fmtDate(m.joinedAt))} with code ${esc(m.code)}</span></span>
                <span><button class="btn" data-remove="${esc(m.uid)}">Remove from coach</button></span></div>`).join('') || '<div><span class="note">No clients yet.</span></div>'}</div></div>`;
        $('co-close').onclick = () => { $('co-panel').innerHTML = ''; };
        $('co-panel').querySelectorAll('[data-remove]').forEach(b => b.onclick = () => removeClient(uid, b.dataset.remove, b));
        $('co-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const removeClient = async (coach, client, btn) => {
        if (btn.disabled || !confirm('Take this client off the coach? The coach can no longer see their data.')) return;
        btn.disabled = true;
        try {
            const b = C.db.batch();
            b.delete(C.db.doc(`coaches/${coach}/members/${client}`));
            // the client's own link, only if it still points to this coach (they may have joined someone else since)
            const link = await C.db.doc(`users/${client}/coach/link`).get();
            if (link.exists && link.data().coachId === coach) b.delete(link.ref);
            await b.commit();
            C.audit(client, 'coach');
            await refresh(); openCoach(coach);
        } catch (e) { console.warn(e); btn.disabled = false; btn.textContent = 'Failed'; }
    };

    const refresh = async () => {
        try { await load(); draw(); }
        catch (e) { console.warn(e); C.el.innerHTML = `<p class="err">Could not load coaches (${esc(e.code || 'error')}). Publish the new firestore.rules if you haven't.</p>`; }
    };
    // the tab: draws into el; ctx = { db, auth, audit(uid, action) }
    const render = (el, ctx) => { C = { ...(C || {}), ...ctx, el, lastLink: C && C.lastLink }; el.innerHTML = '<p class="note">Loading coaches…</p>'; return refresh(); };
    return Object.freeze({ render });
})();

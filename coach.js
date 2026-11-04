// Apex Coach (coach.html): the app for coaches. A coach is invited by the admin (coachInvites), accepts here once,
// then invites clients with one-time codes or links (coachCodes), sees the clients who joined (coaches/{me}/members),
// follows their training (workouts, check-ins, body weight, whether the app is open), chats with them
// (users/{client}/chats/{me}) and sends them routines and messages with the same builder as the admin page
// (admin-coach.js → users/{uid}/coach/plan).
// What a coach may read or write is decided by firestore.rules (COACHING); this page only shows it.
// Looks like the Apex Lift app (coach.css): a floating dock with Home, Clients, Chats, Invite and Account; a client and a
// chat open as full pages (round back button; the phone's back and a swipe from the left edge go back too).
// Text is in English in the code and wrapped in t('...'); Arabic comes from coach-i18n.js.
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
    const { t, isAR, LANG_KEY, daysAgo } = window.ApexCoachI18n; // coach-i18n.js
    const CALC = window.APEX_CALC; // calc.js: log dates and sets, the same rules as the app
    const LIB = window.APEX_LIB;   // library.js: exercise names (and their Arabic names)
    const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
    const newCode = () => { const a = new Uint32Array(8); crypto.getRandomValues(a); return Array.from(a, x => CODE_ABC[x % 32]).join(''); };
    const fmtCode = c => `${c.slice(0, 4)}-${c.slice(4)}`;
    const DAY = 86400000, WEEK = 7 * DAY, ONLINE_MS = 10 * 60000; // the app says "I'm here" every 5 minutes while it is open
    const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const fmtDate = (ts, year = true) => { if (!ts) return ''; const d = new Date(ts); return `${d.getDate()} ${(isAR ? MONTHS_AR : MONTHS_EN)[d.getMonth()]}${year && d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : ''}`; };
    const fmtTime = ts => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
    const dateKey = (ts = Date.now()) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const keyTime = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
    const dayLabel = ts => dateKey(ts) === dateKey() ? t('Today') : dateKey(ts) === dateKey(Date.now() - DAY) ? t('Yesterday') : fmtDate(ts);
    const ago = ts => ts ? daysAgo(Math.max(0, Math.floor((CALC.startOfDay(Date.now()) - CALC.startOfDay(ts)) / DAY))) : t('not yet');
    // the Apex Lift app next to this page (works on the site and in a sub-folder on your computer, e.g. Live Server)
    const clientLink = code => new URL(`./?coach=${code}`, location.href).href;
    const withTimeout = (p, ms = 20000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(Object.assign(new Error('timeout'), { code: 'timeout' })), ms))]);
    const icons = root => { if (window.lucide) window.lucide.createIcons({ root }); };
    const THEME_KEY = 'workoutTheme_rakan_final'; // the same setting as the Apex Lift app on this device
    const num = v => (typeof v === 'number' && isFinite(v)) ? v : null;
    const str = (v, n = 200) => (typeof v === 'string' ? v.slice(0, n) : '');
    const kg = w => `${Math.round(w * 10) / 10}`;

    // exercise names: history keys are "global_" + the name in small letters with _ for spaces (getExKey in app.js)
    const exKey = n => `global_${(n || '').trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, '_')}`;
    const EX_NAMES = {};
    Object.values(LIB.exerciseDictionary).flat().forEach(n => { EX_NAMES[exKey(n)] = n; });
    const exName = (k, extra = {}) => {
        const n = EX_NAMES[k] || extra[k] || k.replace(/^global_/, '').split('_').filter(Boolean).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
        return isAR && LIB.exerciseAR && LIB.exerciseAR[n] ? LIB.exerciseAR[n] : n;
    };

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), db = firebase.firestore();
    // tests only: on this computer with ?emu=1 the page talks to the Firebase emulators (tools/rules-test), never to the real database
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('emu')) { auth.useEmulator('http://127.0.0.1:9099'); db.useEmulator('127.0.0.1', 8080); }

    const params = new URLSearchParams(location.search);
    let invite = CODE_RE.test(params.get('invite') || '') ? params.get('invite') : '';
    let me = null, coach = null, clients = [], codes = [], tab = 'home', query = '', sortKey = 'active';
    const forgetInvite = () => { invite = ''; params.delete('invite'); history.replaceState(history.state, '', location.pathname + (params.toString() ? `?${params}` : '')); };

    // ---------- pieces of the page ----------
    const main = $('main'), dock = $('dock');
    const DOCK = { home: 'Home', clients: 'Clients', chats: 'Chats', invite: 'Invite', account: 'Account' };
    dock.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-label', t(DOCK[b.dataset.tab])));
    icons(dock);
    const draw = (html, withDock = false, keepScroll = false) => {
        const y = window.scrollY;
        main.innerHTML = `<div class="${keepScroll ? '' : 'fade-in'}">${html}</div>`;
        dock.hidden = !withDock;
        dock.querySelectorAll('[data-tab]').forEach(b => { const on = withDock && b.dataset.tab === tab; b.classList.toggle('is-on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); });
        icons(main);
        window.scrollTo(0, keepScroll ? y : 0);
    };
    const top = (right = '') => `<header class="top"><div class="logo-mark" dir="ltr">APEX <span>LIFT</span></div>${right}</header>`;
    const coachTag = () => `<span class="top-tag"><i data-lucide="whistle"></i>${t('Coach')}</span>`;
    // a status screen: soft circle with an icon, title, text, buttons
    const hero = (icon, title, text, buttons = '', bad = false) => draw(`${top()}<div class="hero"><div class="orb${bad ? ' is-bad' : ''}"><i data-lucide="${icon}"></i></div><h1>${esc(title)}</h1><p>${text}</p>${buttons}</div>`);
    const signOutBtn = () => `<button class="btn tap" data-signout><i data-lucide="log-out"></i>${t('Sign out')}</button>`;
    const bindSignOut = () => main.querySelectorAll('[data-signout]').forEach(b => b.onclick = () => auth.signOut());
    const backBtn = label => `<button class="back-btn tap" data-back aria-label="${esc(label)}"><i data-lucide="chevron-left" class="rtl-flip"></i></button>`;
    const pageBar = (title, label = t('Go back')) => `<div class="page-bar">${backBtn(label)}<div class="page-bar-title">${esc(title)}</div><span></span></div>`;
    const avatar = (c, big = false) => `<span class="av${big ? ' is-big' : ''}" aria-hidden="true">${esc(c.name.charAt(0).toUpperCase())}${c.online ? '<span class="dot"></span>' : ''}</span>`;
    // pop-up card, like the app's confirmations; resolves true when confirmed
    const popUp = html => {
        const o = document.createElement('div');
        o.className = 'pop'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true');
        o.innerHTML = `<div class="pop-card">${html}</div>`;
        document.body.appendChild(o); icons(o);
        return o;
    };
    const ask = (title, text, okLabel, danger = false) => new Promise(done => {
        const o = popUp(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="pop-actions"><button class="btn tap" data-no>${t('Cancel')}</button><button class="btn tap ${danger ? 'is-danger' : 'gold'}" data-ok>${esc(okLabel)}</button></div>`);
        const close = v => { o.remove(); document.removeEventListener('keydown', key); done(v); };
        const key = e => { if (e.key === 'Escape') close(false); };
        o.onclick = e => { if (e.target === o) close(false); };
        o.querySelector('[data-no]').onclick = () => close(false);
        o.querySelector('[data-ok]').onclick = () => close(true);
        document.addEventListener('keydown', key);
        o.querySelector('[data-ok]').focus();
    });
    let toastTimer = 0;
    const toast = (text, bad = false, onTap = null) => {
        const old = document.querySelector('.toast'); if (old) old.remove();
        const el = document.createElement(onTap ? 'button' : 'div');
        el.className = `toast${bad ? ' is-bad' : ''}${onTap ? ' tap' : ''}`; el.setAttribute('role', 'status');
        el.innerHTML = `<i data-lucide="${bad ? 'alert-circle' : onTap ? 'message-circle' : 'check-circle'}"></i><span>${esc(text)}</span>`;
        if (onTap) el.onclick = () => { el.remove(); onTap(); };
        document.body.appendChild(el); icons(el);
        clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), onTap ? 6000 : 3000);
    };
    const errText = e => (e && (e.code === 'unavailable' || e.code === 'timeout')) || navigator.onLine === false ? t('No internet connection. Try again when online.') : t('Something went wrong. Please try again.');
    const copyText = async s => { try { await navigator.clipboard.writeText(s); toast(t('Link copied')); } catch (e) { toast(t('Could not copy. Use Share instead.'), true); } };

    // ---------- full pages and the phone's back button ----------
    // A full page (a client, a chat) adds one history entry: the phone's back (or a swipe from the left edge) closes it.
    // page = null (the tabs) or { type: 'client', uid, seg } or { type: 'chat', uid, from }
    let page = null, skipPop = false, builderOpen = false;
    const openPage = p => {
        const sub = !!page; // a chat opened from a client's page goes back to that page
        page = { ...p, from: sub ? page : null };
        try { history.pushState({ coachPage: 1 }, ''); } catch (e) {}
        showPage();
    };
    const goBack = () => { if (page) history.back(); };
    const onPop = () => {
        if (skipPop) { skipPop = false; return; } // our own history.back() after the builder closed by its own button
        // the routine builder is open: the phone's back closes it first (it asks if there are changes)
        if (builderOpen) {
            builderOpen = false; window.ApexCoach.close();
            if ($('coach').classList.contains('open')) { builderOpen = true; try { history.pushState({ coachPage: 1 }, ''); } catch (e) {} } // kept open (changes not sent)
            return;
        }
        if (!page) return;
        stopChat();
        page = page.from;
        if (page) showPage(); else home(false);
    };
    window.addEventListener('popstate', onPop);
    const showPage = () => { if (!page) return home(false); if (page.type === 'chat') return chatPage(); clientPage(); };
    // swipe from the left edge = back (not in the iPhone's browser tab, which has its own swipe-back)
    const browserSwipesBack = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window.navigator.standalone || matchMedia('(display-mode: standalone)').matches);
    if (!browserSwipesBack) {
        let x0 = null, y0 = 0, dx = 0;
        document.addEventListener('touchstart', e => { const x = e.touches[0].clientX; x0 = page && !$('coach').classList.contains('open') && x < 28 && e.touches.length === 1 ? x : null; y0 = e.touches[0].clientY; dx = 0; }, { passive: true });
        document.addEventListener('touchmove', e => {
            if (x0 === null) return;
            dx = e.touches[0].clientX - x0;
            if (Math.abs(e.touches[0].clientY - y0) > Math.abs(dx) && dx < 30) { x0 = null; main.style.transform = ''; return; }
            main.style.transition = 'none'; main.style.transform = `translateX(${Math.max(0, dx)}px)`;
        }, { passive: true });
        document.addEventListener('touchend', () => {
            if (x0 === null) return;
            x0 = null; main.style.transition = 'transform 0.25s ease';
            if (dx > 90) { main.style.transform = 'translateX(100%)'; setTimeout(() => { main.style.transition = ''; main.style.transform = ''; goBack(); }, 200); }
            else { main.style.transform = ''; setTimeout(() => { main.style.transition = ''; }, 260); }
        });
    }
    // the builder (admin-coach.js) opens over the page: one history entry for it too, removed when it closes by its own buttons
    const openBuilder = opts => {
        try { history.pushState({ coachPage: 1 }, ''); } catch (e) {}
        builderOpen = true;
        window.ApexCoach.open(opts);
        const box = $('coach'), watch = new MutationObserver(() => {
            if (box.classList.contains('open')) return;
            watch.disconnect();
            // closed by its own Cancel or Send: take its history entry away again (closed by the phone's back: already gone)
            if (builderOpen) { builderOpen = false; skipPop = true; history.back(); }
        });
        watch.observe(box, { attributes: true, attributeFilter: ['class'] });
    };

    // ---------- signing in: coach-sign-in.js ----------
    const signInScreen = (msg = '') => { draw(''); window.ApexCoachSignIn.show({ el: main, auth, invited: !!invite, msg }); };
    const verifyScreen = () => { draw(''); window.ApexCoachSignIn.verify({ el: main, auth, user: me, onContinue: route }); };

    // ---------- which screen ----------
    const skeleton = () => `<div class="skeleton" style="height:96px;margin-bottom:10px" aria-hidden="true"></div><div class="skeleton" style="height:72px;margin-bottom:10px" aria-hidden="true"></div><div class="skeleton" style="height:72px" aria-hidden="true"></div>`;
    const loading = () => draw(`${top()}${skeleton()}`);
    const route = async () => {
        loading();
        try {
            const cs = await withTimeout(db.doc(`coaches/${me.uid}`).get());
            coach = cs.exists ? { uid: me.uid, ...cs.data() } : null;
            if (invite && (!coach || coach.invite !== invite)) return inviteScreen();
            if (invite) forgetInvite();
            if (!coach) { hero('user-x', t("This isn't a coach account"), t("You're signed in as {email}. To coach on Apex Lift, ask Apex Lift for an invitation and open its link.", { email: `<b>${esc(me.email || '')}</b>` }), signOutBtn()); return bindSignOut(); }
            if (!coach.active) { hero('pause-circle', t('Your coach account is switched off'), t("Apex Lift switched your coach account off, so you can't see your clients for now. Contact Apex Lift support."), signOutBtn(), true); return bindSignOut(); }
            await home();
        } catch (e) {
            console.warn(e);
            hero('wifi-off', t('Something went wrong'), t('Could not load your coach account ({code}). Check your connection and try again.', { code: esc(e.code || 'error') }), `<button id="again" class="btn gold tap">${t('Try again')}</button>${signOutBtn()}`, true);
            $('again').onclick = route; bindSignOut();
        }
    };

    // ---------- accepting an invitation ----------
    const inviteScreen = async () => {
        let inv = null;
        try { const s = await withTimeout(db.doc(`coachInvites/${invite}`).get()); inv = s.exists ? s.data() : null; } catch (e) { inv = null; }
        if (!inv) { hero('mail-x', t('This invitation is for another email'), t("You're signed in as {email}. Sign out and sign in with the email the invitation was sent to, or ask Apex Lift for a new link.", { email: `<b>${esc(me.email || '')}</b>` }), signOutBtn(), true); return bindSignOut(); }
        if (inv.usedBy && inv.usedBy !== me.uid) { hero('link-2-off', t('This invitation was already used'), t('Each invitation link works once. Ask Apex Lift for a new one.'), signOutBtn(), true); return bindSignOut(); }
        if (!me.emailVerified) return verifyScreen();
        hero('whistle', t("You're invited as {name}", { name: inv.name }), t('Accept to coach on Apex Lift as {email}. Your clients join you with a link you share, and you send them routines and messages.', { email: `<b>${esc(me.email)}</b>` }),
            `<button id="accept" class="btn gold tap"><i data-lucide="check"></i>${t('Accept and start coaching')}</button>${signOutBtn()}`);
        bindSignOut();
        $('accept').onclick = async e => {
            const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true;
            try {
                const now = Date.now(), b = db.batch();
                b.update(db.doc(`coachInvites/${invite}`), { usedBy: me.uid, usedAt: now });
                b.set(db.doc(`coaches/${me.uid}`), { name: String(inv.name).slice(0, 100), email: (me.email || '').toLowerCase(), invite, active: true, createdAt: now });
                await withTimeout(b.commit());
                forgetInvite(); toast(t('Welcome to Apex Coach')); route();
            } catch (x) { console.warn(x); btn.disabled = false; toast(t('Could not accept. Try again.'), true); }
        };
    };

    // ---------- data ----------
    // Everything about a client was written by the client's app: keep only values of the right type.
    const readClient = (m, raw, pres) => {
        const a = isObj(raw.account) ? raw.account : {}, act = isObj(raw.activity) ? raw.activity : {};
        m.raw = raw;
        m.email = str(m.email, 200);
        m.name = (str(m.name, 100) || str(a.name, 100) || m.email || t('No name')).slice(0, 100);
        m.lastWorkout = num(act.last) || 0;
        m.workouts = num(act.n) || 0;
        m.days = Array.isArray(act.days) ? act.days.filter(k => typeof k === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(k)) : [];
        m.joinedAt = num(m.joinedAt) || 0;
        m.weekCount = m.days.filter(k => keyTime(k) > CALC.startOfDay(Date.now()) - 6 * DAY).length;
        m.target = parseInt((isObj(raw.profile) ? raw.profile : {}).days) || 0;
        m.lastActive = Math.max(num(raw.updatedAt) || 0, m.lastWorkout);
        m.presAt = pres ? num(pres.at) || 0 : 0;
        m.online = !!(pres && pres.off === false && Date.now() - m.presAt < ONLINE_MS);
        // daily check-ins: { 'YYYY-MM-DD': { sleep, soreness, energy } }, each 0-2 (0 = poor sleep / very sore / low energy)
        m.checkins = {};
        if (isObj(raw.readiness)) Object.keys(raw.readiness).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).forEach(k => {
            const r = raw.readiness[k];
            if (isObj(r) && [r.sleep, r.soreness, r.energy].every(x => x === 0 || x === 1 || x === 2)) m.checkins[k] = { ...r, score: r.sleep + r.soreness + r.energy };
        });
        const today = m.checkins[dateKey()];
        m.lowToday = !!(today && today.score <= 2);
        return m;
    };
    const load = async () => {
        const [ms, cc] = await Promise.all([db.collection(`coaches/${me.uid}/members`).get(), db.collection('coachCodes').where('coach', '==', me.uid).get()]);
        codes = cc.docs.map(d => ({ code: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        const old = Object.fromEntries(clients.map(c => [c.uid, c]));
        // each client's account, presence and chat summary, all at once
        clients = await Promise.all(ms.docs.map(async d => {
            const m = { uid: d.id, ...d.data() };
            const [u, p] = await Promise.all([
                db.doc(`users/${m.uid}`).get().catch(() => null),
                db.doc(`users/${m.uid}/presence/app`).get().catch(() => null)
            ]);
            readClient(m, u && u.exists ? u.data() || {} : {}, p && p.exists ? p.data() || {} : null);
            const o = old[m.uid];
            if (o) { m.thread = o.thread; m.hist = o.hist; } // keep what was loaded (live chat summary, workouts)
            return m;
        }));
        watchThreads();
    };
    const byUid = uid => clients.find(x => x.uid === uid);
    const trainedThisWeek = c => c.lastWorkout && Date.now() - c.lastWorkout < WEEK;
    const trainedToday = c => c.lastWorkout && dateKey(c.lastWorkout) === dateKey();
    const isNew = c => c.joinedAt && Date.now() - c.joinedAt < WEEK;
    const unread = c => !!(c.thread && c.thread.lastFrom === c.uid && c.thread.lastAt > (c.thread.readCoach || 0));
    const unreadCount = () => clients.filter(unread).length;
    // what needs the coach: unread messages, 7+ days without a workout, a low check-in today
    const flags = c => {
        const out = [];
        if (unread(c)) out.push({ k: 'msg', icon: 'message-circle', text: t('New message') });
        if (c.lowToday) out.push({ k: 'low', icon: 'battery-low', text: t('Low check-in today') });
        if (!trainedThisWeek(c) && !(isNew(c) && !c.lastWorkout)) out.push({ k: 'idle', icon: 'clock', text: c.lastWorkout ? t('No workout for {n}', { n: daysAgo(Math.floor((Date.now() - c.lastWorkout) / DAY), true) }) : t('No workout yet') });
        return out;
    };

    // the chat summary of every client, live: badges and the Chats list update by themselves
    let threadOffs = {};
    const watchThreads = () => {
        const want = new Set(clients.map(c => c.uid));
        Object.keys(threadOffs).forEach(uid => { if (!want.has(uid)) { threadOffs[uid](); delete threadOffs[uid]; } });
        clients.forEach(c => {
            if (threadOffs[c.uid]) return;
            let first = true;
            threadOffs[c.uid] = db.doc(`users/${c.uid}/chats/${me.uid}`).onSnapshot(s => {
                const cur = byUid(c.uid); if (!cur) return;
                const d = s.exists ? s.data() || {} : null, before = cur.thread;
                cur.thread = d ? { lastAt: num(d.lastAt) || 0, lastText: str(d.lastText, 200), lastFrom: str(d.lastFrom, 128), readClient: num(d.readClient) || 0, readCoach: num(d.readCoach) || 0 } : null;
                const fresh = !first && unread(cur) && (!before || cur.thread.lastAt > before.lastAt);
                first = false;
                if (page && page.type === 'chat' && page.uid === c.uid) { if (unread(cur)) markRead(cur); renderMsgs(cur); return; } // "Seen" when they read it
                if (fresh) toast(t('New message from {name}', { name: `\u2068${cur.name}\u2069` }), false, () => openPage({ type: 'chat', uid: cur.uid }));
                refreshBadges();
            }, e => console.warn('Chat summary', e));
        });
    };
    const stopThreads = () => { Object.values(threadOffs).forEach(f => f()); threadOffs = {}; };
    // the open tab shows the new state (once for many changes together; not while typing in the search box)
    let badgeTimer = 0;
    const refreshBadges = () => {
        refreshDockBadge();
        clearTimeout(badgeTimer);
        badgeTimer = setTimeout(() => { if (me && coach && !page && !document.querySelector('.pop') && (tab === 'chats' || tab === 'home' || (tab === 'clients' && document.activeElement !== $('q')))) home(false, true); }, 250);
    };

    // ---------- tabs ----------
    // reload: read the clients again from the database (after a change); otherwise draw what was loaded (going Back)
    const home = async (reload = true, keepScroll = false) => {
        if (reload) {
            try { await withTimeout(load()); }
            catch (e) { if (e && e.code === 'permission-denied') return route(); throw e; } // switched off meanwhile: route() says so
        }
        if (page) return;
        if (tab === 'clients') clientsTab(keepScroll);
        else if (tab === 'chats') chatsTab(keepScroll);
        else if (tab === 'invite') inviteTab();
        else if (tab === 'account') accountTab();
        else homeTab(keepScroll);
        refreshDockBadge();
    };
    const refreshDockBadge = () => { const n = unreadCount(), b = dock.querySelector('[data-tab="chats"] .dock-badge'); if (b) { b.hidden = !n; b.textContent = n > 9 ? '9+' : String(n); } };
    dock.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; home(false); });

    // a row for one client in a list: name, a short status line, the flags that need attention
    const clientRow = (c, line = '') => {
        const fl = flags(c);
        return `<button class="client glass-card tap" data-client="${esc(c.uid)}">
                ${avatar(c)}
                <span class="who"><b>${esc(c.name)}</b><span>${line || esc(statusLine(c))}</span>
                    ${fl.length ? `<span class="flags">${fl.map(f => `<em class="flag is-${f.k}"><i data-lucide="${f.icon}"></i>${esc(f.text)}</em>`).join('')}</span>` : ''}</span>
                <i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></button>`;
    };
    const statusLine = c => c.online ? t('Using the app now') : t('Last workout {when}', { when: ago(c.lastWorkout) });
    const bindClients = () => main.querySelectorAll('[data-client]').forEach(b => b.onclick = () => openPage({ type: 'client', uid: b.dataset.client, seg: 'overview' }));
    const emptyClients = () => `<div class="glass-card hero" style="padding:28px 20px"><div class="orb is-small"><i data-lucide="users"></i></div><h2>${t('No clients yet')}</h2><p>${t('Make a client link and send it to your client. They open it in Apex Lift and tap Join.')}</p><button class="btn gold tap" data-go="invite"><i data-lucide="user-plus"></i>${t('Invite a client')}</button></div>`;
    const bindGo = () => main.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { tab = b.dataset.go; home(false); });

    // Home: what needs you today
    const homeTab = (keepScroll = false) => {
        const today = clients.filter(trainedToday), week = clients.filter(trainedThisWeek).length;
        const attention = clients.filter(c => flags(c).length).sort((a, b) => (unread(b) - unread(a)) || (b.lowToday - a.lowToday) || (a.lastWorkout - b.lastWorkout));
        const online = clients.filter(c => c.online), fresh = clients.filter(isNew);
        const hour = new Date().getHours(), hi = t(hour < 12 ? 'Good morning, {name}' : hour < 18 ? 'Good afternoon, {name}' : 'Good evening, {name}', { name: esc(coach.name.split(' ')[0]) });
        draw(`${top(coachTag())}
            <h1 class="page-title">${hi}</h1>
            <p class="page-sub">${esc(fmtDate(Date.now(), false))} · ${clients.length ? t('Here is how your clients are doing.') : t('Invite your first client to get started.')}</p>
            ${clients.length ? `<div class="stats">
                <div class="stat glass-card"><b class="num">${today.length}</b><span>${t('Trained today')}</span></div>
                <div class="stat glass-card"><b class="num">${week}<small>/${clients.length}</small></b><span>${t('Trained this week')}</span></div>
                <button class="stat glass-card tap" data-go="chats"><b class="num">${unreadCount()}</b><span>${t('Unread messages')}</span></button></div>
                <span class="pf-h">${t('Needs your attention')}</span>
                ${attention.length ? attention.map(c => clientRow(c)).join('') : `<div class="glass-card empty-row"><i data-lucide="check-circle"></i><span>${t('All good: everyone trained this week and there are no new messages.')}</span></div>`}
                ${online.length ? `<span class="pf-h">${t('Using the app now')}</span>${online.map(c => clientRow(c, esc(c.lastWorkout && trainedToday(c) ? t('Trained today') : t('Last workout {when}', { when: ago(c.lastWorkout) })))).join('')}` : ''}
                ${today.length ? `<span class="pf-h">${t('Trained today')}</span>${today.map(c => clientRow(c, esc(t('Workout at {time}', { time: fmtTime(c.lastWorkout) })))).join('')}` : ''}
                ${fresh.length ? `<span class="pf-h">${t('New this week')}</span>${fresh.map(c => clientRow(c, esc(t('Joined {date}', { date: fmtDate(c.joinedAt) })))).join('')}` : ''}`
            : emptyClients()}`, true, keepScroll);
        bindClients(); bindGo();
    };

    // Clients: everyone, with search and sort
    const SORTS = { active: 'Recent activity', attention: 'Needs attention', name: 'Name' };
    const clientsTab = (keepScroll = false) => {
        const q = query.trim().toLowerCase();
        let list = clients.filter(c => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
        if (sortKey === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortKey === 'attention') list.sort((a, b) => flags(b).length - flags(a).length || a.lastWorkout - b.lastWorkout);
        else list.sort((a, b) => (b.online - a.online) || Math.max(b.lastActive, b.presAt) - Math.max(a.lastActive, a.presAt));
        draw(`${top(coachTag())}
            <h1 class="page-title">${t('Clients')}</h1>
            <p class="page-sub">${t('Tap a client to see their training, chat, or send a routine.')}</p>
            ${clients.length ? `<div class="search"><i data-lucide="search"></i><input id="q" type="search" value="${esc(query)}" placeholder="${esc(t('Search by name or email'))}" aria-label="${esc(t('Search by name or email'))}" autocomplete="off"></div>
                <div class="chips" role="group" aria-label="${esc(t('Sort'))}">${Object.keys(SORTS).map(k => `<button class="chip tap${sortKey === k ? ' is-on' : ''}" data-sort="${k}" aria-pressed="${sortKey === k}">${t(SORTS[k])}</button>`).join('')}</div>
                <div id="list">${list.map(c => clientRow(c)).join('') || `<p class="pf-note" style="text-align:center;margin-top:20px">${t('No client matches “{q}”.', { q: esc(query) })}</p>`}</div>`
            : emptyClients()}`, true, keepScroll);
        bindClients(); bindGo();
        const qi = $('q');
        if (qi) qi.oninput = () => { query = qi.value; const pos = qi.selectionStart; clientsTab(true); const n = $('q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
        main.querySelectorAll('[data-sort]').forEach(b => b.onclick = () => { sortKey = b.dataset.sort; clientsTab(true); });
    };

    // Chats: one row per client, newest message first
    const chatsTab = (keepScroll = false) => {
        const withChat = clients.filter(c => c.thread).sort((a, b) => b.thread.lastAt - a.thread.lastAt), without = clients.filter(c => !c.thread);
        const row = c => `<button class="client glass-card tap" data-chat="${esc(c.uid)}">
                ${avatar(c)}
                <span class="who"><b>${esc(c.name)}</b><span class="${unread(c) ? 'is-unread' : ''}">${c.thread.lastFrom === me.uid ? `${t('You:')} ` : ''}${esc(c.thread.lastText)}</span></span>
                <span class="chat-meta"><span class="num">${esc(dateKey(c.thread.lastAt) === dateKey() ? fmtTime(c.thread.lastAt) : dayLabel(c.thread.lastAt))}</span>${unread(c) ? `<span class="badge">${t('New')}</span>` : ''}</span></button>`;
        draw(`${top(coachTag())}
            <h1 class="page-title">${t('Chats')}</h1>
            <p class="page-sub">${t('Only you and your client can read a chat.')}</p>
            ${withChat.map(row).join('')}
            ${without.length ? `<span class="pf-h">${t('Start a chat')}</span><div class="pf-group">${without.map(c => `<button class="pf-row tap" data-chat="${esc(c.uid)}"><span class="pf-ic"><i data-lucide="message-circle"></i></span><span class="pf-label">${esc(c.name)}</span><i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></button>`).join('')}</div>` : ''}
            ${clients.length ? '' : emptyClients()}`, true, keepScroll);
        main.querySelectorAll('[data-chat]').forEach(b => b.onclick = () => openPage({ type: 'chat', uid: b.dataset.chat }));
        bindGo();
    };

    // Invite: one-time client links
    const inviteTab = () => {
        const share = !!navigator.share, open = codes.filter(c => !c.usedBy), used = codes.filter(c => c.usedBy);
        const who = uid => { const c = byUid(uid); return c ? c.name : t('A former client'); };
        draw(`${top(coachTag())}
            <h1 class="page-title">${t('Invite a client')}</h1>
            <p class="page-sub">${t('Each link works once: make one for each client. They open it in Apex Lift and tap Join, or type the code in Profile → Join a coach.')}</p>
            <button id="new-code" class="btn gold tap"><i data-lucide="plus"></i>${t('New client link')}</button>
            ${open.length ? `<span class="pf-h">${t('Ready to send')}</span>${open.map(c => `<div class="code-card glass-card">
                    <div class="code-big" dir="ltr">${esc(fmtCode(c.code))}</div>
                    <div class="code-url" dir="ltr">${esc(clientLink(c.code))}</div>
                    <div class="code-actions">
                        <button class="mini-btn tap" data-${share ? 'share' : 'copy'}="${esc(c.code)}"><i data-lucide="${share ? 'share-2' : 'copy'}"></i>${share ? t('Share link') : t('Copy link')}</button>
                        ${share ? `<button class="mini-btn is-icon tap" data-copy="${esc(c.code)}" aria-label="${esc(t('Copy link'))}"><i data-lucide="copy"></i></button>` : ''}
                        <button class="mini-btn is-icon is-danger tap" data-del-code="${esc(c.code)}" aria-label="${esc(t('Delete link'))}"><i data-lucide="trash-2"></i></button>
                    </div></div>`).join('')}` : ''}
            ${used.length ? `<span class="pf-h">${t('Used')}</span><div class="pf-group">${used.map(c => `<div class="pf-row"><span class="pf-ic"><i data-lucide="user-check"></i></span>
                    <span class="pf-label"><span dir="ltr" class="num">${esc(fmtCode(c.code))}</span><span class="pf-sub">${t('Used by {name} · {date}', { name: `<bdi>${esc(who(c.usedBy))}</bdi>`, date: esc(fmtDate(c.usedAt)) })}</span></span>
                    <button class="mini-btn is-icon is-danger tap" data-del-code="${esc(c.code)}" aria-label="${esc(t('Delete link'))}"><i data-lucide="trash-2"></i></button></div>`).join('')}</div>` : ''}
            <p class="pf-note"><i data-lucide="lock" style="width:13px;height:13px;vertical-align:-2px"></i> ${t('A link stops working once a client joins with it. Deleting a link stops it too; clients who already joined stay.')}</p>`, true);
        $('new-code').onclick = newClientCode;
        main.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copyText(clientLink(b.dataset.copy)));
        main.querySelectorAll('[data-share]').forEach(b => b.onclick = () => navigator.share({ title: 'Apex Coach', text: t('Join me as your coach on Apex Lift (code {code})', { code: fmtCode(b.dataset.share) }), url: clientLink(b.dataset.share) }).catch(() => {}));
        main.querySelectorAll('[data-del-code]').forEach(b => b.onclick = () => delCode(b.dataset.delCode, b));
    };
    const newClientCode = async e => {
        const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${newCode()}`).set({ coach: me.uid, name: String(coach.name).slice(0, 100), createdAt: Date.now(), usedBy: '', usedAt: 0 })); await home(); toast(t('Client link ready')); }
        catch (x) { console.warn(x); btn.disabled = false; toast(t('Could not make a link. Try again.'), true); }
    };
    const delCode = async (code, btn) => {
        if (btn.disabled || !(await ask(t('Delete this link?'), t('It stops working. Clients who already joined stay.'), t('Delete'), true))) return;
        btn.disabled = true;
        try { await withTimeout(db.doc(`coachCodes/${code}`).delete()); await home(); toast(t('Link deleted')); } catch (x) { console.warn(x); btn.disabled = false; toast(t('Could not delete. Try again.'), true); }
    };

    // Account
    const accountTab = () => {
        const th = (() => { try { const v = localStorage.getItem(THEME_KEY); return ['light', 'system'].includes(v) ? v : 'dark'; } catch (e) { return 'dark'; } })();
        const lg = (() => { try { const v = localStorage.getItem(LANG_KEY); return v === 'ar' || v === 'en' ? v : 'auto'; } catch (e) { return 'auto'; } })();
        const opt = (v, cur, label) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${label}</option>`;
        draw(`${top(coachTag())}
            <div class="person"><span class="av is-big" aria-hidden="true">${esc(coach.name.charAt(0).toUpperCase())}</span><h2>${esc(coach.name)}</h2><p>${esc(me.email || '')}</p></div>
            <div class="stats">
                <div class="stat glass-card"><b class="num">${clients.length}</b><span>${t('Clients')}</span></div>
                <div class="stat glass-card"><b class="num">${codes.filter(c => !c.usedBy).length}</b><span>${t('Open links')}</span></div>
                <div class="stat glass-card"><b class="num">${clients.filter(c => c.thread).length}</b><span>${t('Chats')}</span></div>
            </div>
            <span class="pf-h">${t('Coach account')}</span>
            <div class="pf-group">
                <button class="pf-row tap" id="rename"><span class="pf-ic"><i data-lucide="pencil"></i></span><span class="pf-label">${t('Your name')}<span class="pf-sub">${t('Clients see it when they join you and in the chat')}</span></span><span class="pf-val">${esc(coach.name)}</span><i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></button>
                <div class="pf-row"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">${t('Coach since')}</span><span class="pf-val">${esc(fmtDate(coach.createdAt))}</span></div>
            </div>
            <span class="pf-h">${t('App')}</span>
            <div class="pf-group">
                <label class="pf-row"><span class="pf-ic"><i data-lucide="languages"></i></span><span class="pf-label">${t('Language')}</span>
                    <select id="lang" class="pf-select" aria-label="${esc(t('Language'))}">${opt('auto', lg, t('Same as phone'))}${opt('en', lg, 'English')}${opt('ar', lg, 'العربية')}</select>
                    <i data-lucide="chevrons-up-down" class="pf-chev"></i></label>
                <label class="pf-row"><span class="pf-ic"><i data-lucide="sun-moon"></i></span><span class="pf-label">${t('Theme')}</span>
                    <select id="theme" class="pf-select" aria-label="${esc(t('Theme'))}">${opt('dark', th, t('Dark'))}${opt('light', th, t('Light'))}${opt('system', th, t('Same as phone'))}</select>
                    <i data-lucide="chevrons-up-down" class="pf-chev"></i></label>
            </div>
            <p class="pf-note">${t('Language and theme are shared with the Apex Lift app on this device.')}</p>
            <span class="pf-h">${t('Help')}</span>
            <div class="pf-group">
                <a class="pf-row tap" href="https://instagram.com/apexlift.app" target="_blank" rel="noopener noreferrer"><span class="pf-ic"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></span><span class="pf-label">${t('Contact us')}<span class="pf-sub" dir="ltr">@apexlift.app</span></span><i data-lucide="arrow-up-right" class="pf-chev"></i></a>
                <a class="pf-row tap" href="privacy.html" target="_blank" rel="noopener"><span class="pf-ic"><i data-lucide="shield-check"></i></span><span class="pf-label">${t('Privacy Policy')}</span><i data-lucide="arrow-up-right" class="pf-chev"></i></a>
            </div>
            <div class="pf-group" style="margin-top:22px">
                <button class="pf-row is-danger tap" data-signout><span class="pf-ic"><i data-lucide="log-out"></i></span><span class="pf-label">${t('Sign out')}</span></button>
            </div>`, true);
        bindSignOut();
        $('theme').onchange = e => {
            try { localStorage.setItem(THEME_KEY, e.target.value); } catch (x) {}
            const light = e.target.value === 'light' || (e.target.value === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
            document.documentElement.toggleAttribute('data-theme', false);
            if (light) document.documentElement.setAttribute('data-theme', 'light');
            const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', light ? '#f3f3f0' : '#12100d');
        };
        $('lang').onchange = e => { try { if (e.target.value === 'auto') localStorage.removeItem(LANG_KEY); else localStorage.setItem(LANG_KEY, e.target.value); } catch (x) {} sessionStorage.setItem('coachTab', 'account'); location.reload(); };
        $('rename').onclick = renameCard;
    };
    const renameCard = () => {
        const o = popUp(`<h3>${t('Your name')}</h3><p>${t('Clients see this name when they join you, on your messages and in the chat.')}</p>
            <input id="rn" class="field" maxlength="100" value="${esc(coach.name)}" autocomplete="name" aria-label="${esc(t('Your name'))}">
            <div class="pop-actions"><button class="btn tap" data-no>${t('Cancel')}</button><button class="btn gold tap" data-ok>${t('Save')}</button></div>`);
        const close = () => o.remove();
        o.onclick = e => { if (e.target === o) close(); };
        o.querySelector('[data-no]').onclick = close;
        o.querySelector('#rn').focus();
        o.querySelector('[data-ok]').onclick = async e => {
            const name = o.querySelector('#rn').value.trim().slice(0, 100); if (!name) return;
            e.currentTarget.disabled = true;
            try { await withTimeout(db.doc(`coaches/${me.uid}`).update({ name })); coach.name = name; close(); accountTab(); toast(t('Name saved')); }
            catch (x) { console.warn(x); e.currentTarget.disabled = false; toast(t('Could not save. Try again.'), true); }
        };
    };

    // ---------- one client (a full page: back button, name in the middle, Overview / Workouts / Progress) ----------
    const planOf = c => { const m = c.raw || {}; return isObj(m.plan) && Array.isArray(m.plan.weeks) ? m.plan.weeks.filter(w => isObj(w) && typeof w.id === 'string').map(w => ({ ...w, name: String(w.name || 'Routine').slice(0, 60) })) : []; };
    const SEGS = { overview: 'Overview', workouts: 'Workouts', progress: 'Progress' };
    const clientPage = () => {
        const c = byUid(page.uid); if (!c) { page = null; return home(false); }
        const seg = SEGS[page.seg] ? page.seg : 'overview';
        draw(`${pageBar(c.name, t('Back to clients'))}
            <div class="person">${avatar(c, true)}<h2>${esc(c.name)}</h2><p>${c.online ? `<span class="online">${t('Using the app now')}</span>` : esc(c.email)}</p></div>
            <div class="actions">
                <button class="btn gold tap" data-act="chat"><i data-lucide="message-circle"></i>${t('Chat')}${unread(c) ? `<span class="badge is-dark">${t('New')}</span>` : ''}</button>
                <button class="btn tap" data-act="routine"><i data-lucide="send"></i>${t('Send a routine')}</button>
            </div>
            <div class="seg" role="tablist">${Object.keys(SEGS).map(k => `<button role="tab" class="tap${k === seg ? ' is-on' : ''}" aria-selected="${k === seg}" data-seg="${k}">${t(SEGS[k])}</button>`).join('')}</div>
            <div id="seg-body">${seg === 'overview' ? overviewHTML(c) : `<div style="margin-top:14px">${skeleton()}</div>`}</div>`);
        main.querySelector('[data-back]').onclick = goBack;
        main.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { page.seg = b.dataset.seg; clientPage(); });
        main.querySelector('[data-act="chat"]').onclick = () => openPage({ type: 'chat', uid: c.uid });
        main.querySelector('[data-act="routine"]').onclick = () => builder(c, 'add');
        if (seg === 'overview') bindOverview(c);
        else withHistory(c).then(() => { if (!page || page.uid !== c.uid || page.seg !== seg) return; const el = $('seg-body'); el.innerHTML = seg === 'workouts' ? workoutsHTML(c) : progressHTML(c); icons(el); bindSeg(c, seg); })
            .catch(e => { console.warn('History', e); const el = $('seg-body'); if (el) { el.innerHTML = `<p class="pf-note" style="text-align:center;margin-top:20px">${esc(errText(e))}</p>`; } });
    };
    const builder = (c, mode, routine = null) => {
        const m = c.raw || {}, pr = isObj(m.profile) ? m.profile : {};
        openBuilder({
            db, auth, mode, routine, templatesPath: `coaches/${me.uid}/templates`,
            client: { uid: c.uid, name: c.name, startDay: typeof m.startDay === 'string' ? m.startDay : '', exp: String(pr.exp || ''), session: String(pr.session || ''), routines: planOf(c), activeWeek: m.activeWeek },
            onSent: () => toast(mode === 'note' ? t('Message sent') : t('Routine sent'))
        });
    };

    // Overview: this week, check-ins, training days, routines, about
    const CHECK = { sleep: ['Sleep', ['Poor', 'OK', 'Great']], soreness: ['Soreness', ['Very sore', 'A bit', 'Fresh']], energy: ['Energy', ['Low', 'OK', 'High']] };
    const level = s => s >= 5 ? t('Ready') : s >= 3 ? t('Normal') : t('Low');
    const overviewHTML = c => {
        const m = c.raw || {}, plan = planOf(c), b = isObj(m.body) ? m.body : {}, pr = isObj(m.profile) ? m.profile : {};
        const row = (icon, label, value) => `<div class="pf-row"><span class="pf-ic"><i data-lucide="${icon}"></i></span><span class="pf-label">${esc(label)}</span><span class="pf-val">${esc(value || '—')}</span></div>`;
        const age = (() => { const bd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(b.birthDate || '')); const y = bd ? +bd[1] : parseInt(b.birthYear); if (!y) return ''; const n = new Date(); let a = n.getFullYear() - y; if (bd && (n.getMonth() + 1 < +bd[2] || (n.getMonth() + 1 === +bd[2] && n.getDate() < +bd[3]))) a--; return a > 0 && a < 120 ? String(a) : ''; })();
        const sex = { male: t('Male'), female: t('Female') }[b.sex] || '';
        const EXP = { none: 'Just starting', new: 'Less than 1 year', mid: '1 to 3 years', adv: '3 to 5 years', pro: 'More than 5 years' }; // the app's labels (EXP_LABEL)
        // check-ins: the last 7 days, today on the end
        const keys = Array.from({ length: 7 }, (_, i) => dateKey(Date.now() - (6 - i) * DAY)), today = c.checkins[dateKey()];
        const fl = flags(c);
        return `${fl.length ? `<div class="flags is-block">${fl.map(f => `<em class="flag is-${f.k}"><i data-lucide="${f.icon}"></i>${esc(f.text)}</em>`).join('')}</div>` : ''}
            <div class="stats">
                <div class="stat glass-card"><b class="num">${c.weekCount}${c.target ? `<small>/${c.target}</small>` : ''}</b><span>${t('Workouts in the last 7 days')}</span></div>
                <div class="stat glass-card"><b class="num">${c.workouts}</b><span>${t('Workout days in total')}</span></div>
                <div class="stat glass-card"><b class="num">${c.lastWorkout ? Math.max(0, Math.floor((CALC.startOfDay(Date.now()) - CALC.startOfDay(c.lastWorkout)) / DAY)) : '—'}</b><span>${t('Days since last workout')}</span></div>
            </div>
            <span class="pf-h">${t('Daily check-in')}</span>
            <div class="glass-card card-pad">
                ${today ? `<div class="check-today"><b>${t('Today: {level}', { level: level(today.score) })}</b>${Object.keys(CHECK).map(k => `<span>${t(CHECK[k][0])}: <b>${t(CHECK[k][1][today[k]])}</b></span>`).join('')}</div>` : `<p class="muted">${t('No check-in today.')}</p>`}
                <div class="check-week">${keys.map(k => { const r = c.checkins[k]; return `<div class="cw${k === dateKey() ? ' is-today' : ''}"><span class="cw-bar"><span style="height:${r ? Math.max(8, Math.round(r.score / 6 * 100)) : 0}%" class="${r && r.score <= 2 ? 'is-low' : ''}"></span></span><em class="num">${r ? r.score : '–'}</em><small>${esc(fmtDate(keyTime(k), false).split(' ')[0])}</small></div>`; }).join('')}</div>
                <p class="muted" style="margin-top:8px">${t('Score out of 6 (sleep, soreness, energy). 2 or less is low.')}</p>
            </div>
            <span class="pf-h">${t('Training days, last 12 weeks')}</span>
            <div class="glass-card card-pad">${calendarHTML(c)}</div>
            <span class="pf-h">${t('Their routines')}</span>
            <div class="pf-group">${plan.map(w => `<button class="pf-row tap" data-edit="${esc(w.id)}"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">${esc(w.name)}${w.id === m.activeWeek ? ` <span class="pill">${t('Active')}</span>` : ''}<span class="pf-sub">${t('Edit and send')}</span></span><i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></button>`).join('')
                || `<div class="pf-row"><span class="pf-ic"><i data-lucide="calendar-days"></i></span><span class="pf-label">${t('No routines yet')}<span class="pf-sub">${t('Send them a new routine above')}</span></span></div>`}
                <button class="pf-row tap" data-act="note"><span class="pf-ic"><i data-lucide="sticky-note"></i></span><span class="pf-label">${t('Pin a note on their Today screen')}<span class="pf-sub">${t('Shows on top of their workout until they close it')}</span></span><i data-lucide="chevron-right" class="pf-chev rtl-flip"></i></button>
            </div>
            <span class="pf-h">${t('About')}</span>
            <div class="pf-group">
                ${row('user-check', t('Joined you'), fmtDate(c.joinedAt))}
                ${row('dumbbell', t('Last workout'), ago(c.lastWorkout))}
                ${row('target', t('Days a week'), pr.days ? String(pr.days) : '')}
                ${row('timer', t('Workout length'), pr.session ? t('{n} min', { n: String(pr.session).slice(0, 4) }) : '')}
                ${row('award', t('Experience'), EXP[pr.exp] ? t(EXP[pr.exp]) : '')}
                ${row('cake', t('Age'), age)}
                ${row('user', t('Sex'), sex)}
                ${row('scale', t('Weight'), num(b.weightKg) !== null ? `${b.weightKg} kg` : '')}
                ${row('ruler', t('Height'), num(b.heightCm) !== null ? `${b.heightCm} cm` : '')}
            </div>
            <div class="pf-group" style="margin-top:22px">
                <button data-act="remove" class="pf-row is-danger tap"><span class="pf-ic"><i data-lucide="user-x"></i></span><span class="pf-label">${t('Remove this client')}<span class="pf-sub">${t('You can no longer see their account')}</span></span></button>
            </div>`;
    };
    // 12 weeks × 7 days, the oldest on the start side; a filled square = a workout that day
    const calendarHTML = c => {
        const set = new Set(c.days), end = CALC.startOfDay(Date.now()), cells = [];
        const start = end - (7 * 12 - 1) * DAY;
        for (let ts = start; ts <= end; ts += DAY) { const k = dateKey(ts); cells.push(`<span class="cal-d${set.has(k) ? ' is-on' : ''}${k === dateKey() ? ' is-today' : ''}" title="${esc(fmtDate(ts))}"></span>`); }
        const n = c.days.filter(k => keyTime(k) >= start).length;
        return `<div class="cal" role="img" aria-label="${esc(t('{n} workout days in the last 12 weeks', { n }))}">${cells.join('')}</div><p class="muted" style="margin-top:8px">${t('{n} workout days in the last 12 weeks', { n })}</p>`;
    };
    const bindOverview = c => {
        main.querySelectorAll('[data-edit]').forEach(btn => btn.onclick = () => { const w = planOf(c).find(x => x.id === btn.dataset.edit); if (w) builder(c, 'replace', w); });
        main.querySelector('[data-act="note"]').onclick = () => builder(c, 'note');
        main.querySelector('[data-act="remove"]').onclick = async e => {
            const btn = e.currentTarget;
            if (btn.disabled || !(await ask(t('Remove {name}?', { name: c.name }), t('You can no longer see their account or your chat. They can join you again with a new link.'), t('Remove'), true))) return;
            btn.disabled = true;
            try {
                const bt = db.batch();
                bt.delete(db.doc(`coaches/${me.uid}/members/${c.uid}`));
                // their link too, but only if it still points to you (they may have joined someone else); their app also notices by itself
                const link = await withTimeout(db.doc(`users/${c.uid}/coach/link`).get()).catch(() => null);
                if (link && link.exists && (link.data() || {}).coachId === me.uid) bt.delete(link.ref);
                await withTimeout(bt.commit()); page = null; tab = 'clients'; history.back(); await home(); toast(t('Client removed'));
            } catch (x) { console.warn(x); page = null; tab = 'clients'; await home().catch(() => {}); } // e.g. they already left: show the list as it is now
        };
    };

    // ---------- workouts (users/{uid}/history: one document per exercise, a list of logs) ----------
    const withHistory = async c => {
        if (c.hist) return c.hist;
        const qs = await withTimeout(db.collection(`users/${c.uid}/history`).get());
        // names from the client's routines, for their own exercises
        const extra = {}; planOf(c).forEach(w => (Array.isArray(w.schedule) ? w.schedule : []).forEach(d => (isObj(d) && Array.isArray(d.exercises) ? d.exercises : []).forEach(e => { if (isObj(e) && typeof e.name === 'string') extra[exKey(e.name)] = e.name.slice(0, 80); })));
        const ex = {};
        qs.forEach(d => {
            let k = d.id; try { k = decodeURIComponent(d.id); } catch (e) {}
            if (k.startsWith('temp_')) return;
            const x = d.data() || {}, del = new Set(Array.isArray(x.del) ? x.del.map(String) : []);
            const logs = (Array.isArray(x.logs) ? x.logs : []).filter(l => isObj(l) && (typeof l.d === 'string' || typeof l.ts === 'number')).map(l => ({ ...l, t: CALC.logTime(l) }))
                .filter(l => !isNaN(l.t) && !del.has(CALC.logSig(l))).sort((a, b) => a.t - b.t);
            if (logs.length) ex[k] = { key: k, name: exName(k, extra), logs, timed: logs.some(l => l.u === 's') };
        });
        // sessions: every log of a day together
        const days = {};
        Object.values(ex).forEach(e => e.logs.forEach(l => { const k = dateKey(l.t); (days[k] = days[k] || { key: k, t: l.t, items: [] }).items.push({ ex: e, log: l }); if (l.t < days[k].t) days[k].t = l.t; }));
        Object.values(days).forEach(d => d.items.sort((a, b) => a.log.t - b.log.t));
        c.hist = { ex, sessions: Object.values(days).sort((a, b) => b.t - a.t), shown: 10 };
        return c.hist;
    };
    const setsText = (l, timed) => CALC.logSetDetails(l).map(s => `${s.w > 0 ? `${kg(s.w)} kg × ` : ''}${s.r}${timed ? ' s' : ''}${s.rpe ? ` @${s.rpe}` : ''}`);
    const workoutsHTML = c => {
        const h = c.hist;
        if (!h.sessions.length) return `<div class="glass-card empty-row" style="margin-top:14px"><i data-lucide="dumbbell"></i><span>${t('No workouts logged yet.')}</span></div>`;
        return `<p class="pf-note" style="margin:14px 6px 10px">${t('Weight × reps for each set, @ = RPE (10 = no reps left).')}</p>
            ${h.sessions.slice(0, h.shown).map(s => {
                const vol = s.items.reduce((a, it) => a + CALC.logSetDetails(it.log).reduce((v, x) => v + (it.ex.timed ? 0 : x.w * x.r), 0), 0);
                const sets = s.items.reduce((a, it) => a + CALC.logSetDetails(it.log).length, 0);
                const wk = s.items.map(it => str(it.log.week, 60)).find(Boolean);
                return `<div class="glass-card session">
                    <div class="session-h"><b>${esc(dayLabel(s.t))}</b><span class="num">${esc(fmtTime(s.t))}</span></div>
                    <p class="muted">${esc([wk, t('{n} exercises', { n: s.items.length }), t('{n} sets', { n: sets }), vol > 0 ? `${Math.round(vol).toLocaleString('en')} kg` : ''].filter(Boolean).join(' · '))}</p>
                    ${s.items.map(it => `<div class="session-ex"><b>${esc(it.ex.name)}</b><span class="num" dir="ltr">${setsText(it.log, it.ex.timed).map(esc).join(' · ')}</span></div>`).join('')}
                </div>`;
            }).join('')}
            ${h.sessions.length > h.shown ? `<button class="btn tap" data-more>${t('Show older workouts')}</button>` : ''}`;
    };

    // ---------- progress: body weight and every exercise (best set, estimated 1-rep max, trend) ----------
    const e1rm = (w, r) => w > 0 && r > 0 ? w * (1 + Math.min(r, 12) / 30) : 0; // Epley, capped at 12 reps
    const exStats = e => {
        const per = e.logs.map(l => { const sets = CALC.logSetDetails(l); const best = sets.reduce((b, s) => (e.timed ? s.r : e1rm(s.w, s.r)) > (e.timed ? b.r : e1rm(b.w, b.r)) ? s : b, { w: 0, r: 0 }); return { t: l.t, best, v: e.timed ? best.r : e1rm(best.w, best.r), top: Math.max(0, ...sets.map(s => s.w)) }; }).filter(x => x.v > 0 || x.top > 0);
        const sessions = new Set(e.logs.map(l => dateKey(l.t))).size;
        const last = per[per.length - 1], first = per[0], peak = per.reduce((a, x) => x.v > a.v ? x : a, per[0] || { v: 0 });
        return { per, sessions, last, first, peak, change: per.length > 1 ? last.v - first.v : 0 };
    };
    const spark = (vals, w = 120, h = 36) => {
        if (vals.length < 2) return '';
        const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
        const pts = vals.map((v, i) => `${(i / (vals.length - 1) * (w - 4) + 2).toFixed(1)},${(h - 2 - (v - lo) / span * (h - 4)).toFixed(1)}`).join(' ');
        return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    };
    const bodyChart = log => {
        if (log.length < 2) return '';
        const W = 320, H = 120, lo = Math.min(...log.map(x => x.kg)) - 1, hi = Math.max(...log.map(x => x.kg)) + 1, t0 = log[0].t, t1 = log[log.length - 1].t || t0 + 1;
        const x = ts => 8 + (ts - t0) / ((t1 - t0) || 1) * (W - 16), y = v => H - 18 - (v - lo) / ((hi - lo) || 1) * (H - 30);
        const pts = log.map(p => `${x(p.t).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
        return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(t('Body weight from {a} to {b} kg', { a: log[0].kg, b: log[log.length - 1].kg }))}">
            <polyline points="${pts}" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
            ${log.map(p => `<circle cx="${x(p.t).toFixed(1)}" cy="${y(p.kg).toFixed(1)}" r="2.5" fill="var(--gold)"/>`).join('')}
        </svg><div class="chart-x"><span>${esc(fmtDate(t0))}</span><span>${esc(fmtDate(t1))}</span></div>`;
    };
    const progressHTML = c => {
        const b = isObj((c.raw || {}).body) ? c.raw.body : {};
        const log = (Array.isArray(b.log) ? b.log : []).filter(x => isObj(x) && num(x.t) && parseFloat(x.kg) >= 25 && parseFloat(x.kg) <= 350).map(x => ({ t: x.t, kg: Math.round(parseFloat(x.kg) * 10) / 10 })).sort((a, z) => a.t - z.t).slice(-60);
        const list = Object.values(c.hist.ex).map(e => ({ e, s: exStats(e) })).filter(x => x.s.per.length).sort((a, z) => z.s.sessions - a.s.sessions || z.s.last.t - a.s.last.t);
        const fmtBest = (e, s) => e.timed ? `${s.r} s` : s.w > 0 ? `${kg(s.w)} kg × ${s.r}` : t('{n} reps', { n: s.r });
        const delta = (e, d) => { if (!d) return ''; const v = Math.round(d * 10) / 10; return `<span class="delta ${v > 0 ? 'is-up' : 'is-down'}" dir="ltr">${v > 0 ? '+' : ''}${v}${e.timed ? ' s' : ' kg'}</span>`; };
        return `<span class="pf-h">${t('Body weight')}</span>
            <div class="glass-card card-pad">${log.length ? `<div class="bw-now"><b class="num">${log[log.length - 1].kg}</b> kg${log.length > 1 ? ` ${delta({}, log[log.length - 1].kg - log[0].kg)}` : ''}<span class="muted"> · ${esc(fmtDate(log[log.length - 1].t))}</span></div>${bodyChart(log)}` : `<p class="muted">${num(b.weightKg) !== null ? t('{n} kg, no changes logged yet.', { n: b.weightKg }) : t('No body weight yet.')}</p>`}</div>
            <span class="pf-h">${t('Exercises')}</span>
            ${list.length ? `<p class="pf-note" style="margin:0 6px 10px">${t('Best set and estimated 1-rep max (e1RM). The change is from their first session to the last one. Tap an exercise for every session.')}</p>
                ${list.map(({ e, s }) => `<button class="glass-card ex-card tap" data-ex="${esc(e.key)}">
                    <span class="ex-main"><b>${esc(e.name)}</b><span class="muted">${esc(t('{n} sessions', { n: s.sessions }))} · ${esc(t('Last session {when}', { when: ago(s.last.t) }))}</span>
                        <span class="ex-nums"><span>${t('Best')} <b class="num" dir="ltr">${esc(fmtBest(e, s.peak.best))}</b></span>${e.timed ? '' : `<span>e1RM <b class="num" dir="ltr">${kg(Math.round(s.peak.v * 2) / 2)} kg</b></span>`}${delta(e, s.change)}</span></span>
                    <span class="ex-spark">${spark(s.per.slice(-12).map(x => x.v))}</span></button>`).join('')}`
            : `<div class="glass-card empty-row"><i data-lucide="trending-up"></i><span>${t('No workouts logged yet.')}</span></div>`}`;
    };
    const exCard = (c, key) => {
        const e = c.hist.ex[key]; if (!e) return;
        const rows = e.logs.slice().reverse().slice(0, 30);
        const o = popUp(`<h3>${esc(e.name)}</h3><p>${esc(t('{n} sessions', { n: exStats(e).sessions }))}</p>
            <div class="ex-hist">${rows.map(l => `<div><span>${esc(dayLabel(l.t))}</span><span class="num" dir="ltr">${setsText(l, e.timed).map(esc).join(' · ')}</span></div>`).join('')}</div>
            <button class="btn tap" data-no style="margin:14px 0 0">${t('Close')}</button>`);
        const close = () => { o.remove(); document.removeEventListener('keydown', key2); };
        const key2 = ev => { if (ev.key === 'Escape') close(); };
        o.onclick = ev => { if (ev.target === o) close(); };
        o.querySelector('[data-no]').onclick = close;
        document.addEventListener('keydown', key2);
    };
    const bindSeg = (c, seg) => {
        if (seg === 'workouts') { const m = main.querySelector('[data-more]'); if (m) m.onclick = () => { c.hist.shown += 10; const el = $('seg-body'), y = window.scrollY; el.innerHTML = workoutsHTML(c); icons(el); bindSeg(c, seg); window.scrollTo(0, y); }; }
        if (seg === 'progress') main.querySelectorAll('[data-ex]').forEach(b => b.onclick = () => exCard(c, b.dataset.ex));
    };

    // ---------- chat with one client (users/{client}/chats/{me}/messages) ----------
    const CHAT_LIMIT = 100;
    let chatOff = null, chatMsgs = [];
    const stopChat = () => { if (chatOff) { chatOff(); chatOff = null; } };
    const chatRef = uid => db.doc(`users/${uid}/chats/${me.uid}`);
    const markRead = c => {
        if (!c.thread || !unread(c)) return;
        c.thread.readCoach = Date.now(); refreshDockBadge();
        chatRef(c.uid).update({ readCoach: c.thread.readCoach }).catch(e => console.warn('Chat read', e));
    };
    const renderMsgs = c => {
        const list = $('chat-list'); if (!list) return;
        if (!chatMsgs.length) list.innerHTML = `<div class="chat-empty"><i data-lucide="message-circle"></i><p>${t('Say hi to {name}. Only you and {name} can read this chat.', { name: esc(c.name) })}</p></div>`;
        else {
            let html = '', last = '';
            chatMsgs.forEach(m => {
                const d = dayLabel(m.at); if (d !== last) { html += `<div class="chat-day">${esc(d)}</div>`; last = d; }
                html += `<div class="chat-msg${m.from === me.uid ? ' is-me' : ''}"><p dir="auto">${esc(m.text)}</p><span class="num">${m.pending ? t('Sending…') : fmtTime(m.at)}</span></div>`;
            });
            // read receipt when your message is the last one
            const mine = chatMsgs[chatMsgs.length - 1];
            if (mine.from === me.uid && !mine.pending && c.thread && c.thread.readClient >= mine.at) html += `<div class="chat-seen">${t('Seen')}</div>`;
            list.innerHTML = html;
        }
        icons(list);
        window.scrollTo(0, document.body.scrollHeight);
    };
    const chatPage = () => {
        const c = byUid(page.uid); if (!c) { page = null; return home(false); }
        draw(`<div class="chat-top">${pageBar(c.name)}</div>
            <div id="chat-list" class="chat-list" aria-live="polite">${skeleton()}</div>
            <div class="chat-bar"><div class="chat-bar-in">
                <textarea id="chat-in" rows="1" maxlength="1000" dir="auto" placeholder="${esc(t('Message'))}" aria-label="${esc(t('Message'))}"></textarea>
                <button id="chat-send" class="chat-send tap" aria-label="${esc(t('Send'))}" disabled><i data-lucide="arrow-up"></i></button>
            </div></div>`, false, true); // no fade-in: its animation would hold the fixed typing bar in the middle of the page
        main.querySelector('[data-back]').onclick = goBack;
        const inp = $('chat-in'), send = $('chat-send');
        const grow = () => { inp.style.height = 'auto'; if (inp.value) inp.style.height = `${Math.min(inp.scrollHeight, 132)}px`; send.disabled = !inp.value.trim(); };
        inp.oninput = grow;
        inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && matchMedia('(pointer: fine)').matches) { e.preventDefault(); send.click(); } };
        send.onclick = () => {
            const text = inp.value.trim().slice(0, 1000); if (!text) return;
            const now = Date.now(), b = db.batch(), ref = chatRef(c.uid);
            b.set(ref.collection('messages').doc(), { from: me.uid, text, at: now });
            const last = { lastAt: now, lastText: text.slice(0, 200), lastFrom: me.uid, readCoach: now };
            if (c.thread) b.update(ref, last); else b.set(ref, { ...last, readClient: 0 });
            c.thread = { ...(c.thread || { readClient: 0 }), ...last };
            inp.value = ''; grow(); inp.focus();
            b.commit().catch(e => { console.warn('Chat send', e); toast(e && e.code === 'permission-denied' ? t('You can no longer message {name}.', { name: c.name }) : errText(e), true); });
        };
        stopChat();
        chatOff = chatRef(c.uid).collection('messages').orderBy('at', 'desc').limit(CHAT_LIMIT).onSnapshot({ includeMetadataChanges: true }, qs => {
            chatMsgs = qs.docs.map(d => { const x = d.data() || {}; return { from: str(x.from, 128), text: str(x.text, 1000), at: num(x.at) || 0, pending: d.metadata.hasPendingWrites }; }).filter(m => m.text).reverse();
            renderMsgs(c); markRead(c);
        }, e => { console.warn('Chat', e); const l = $('chat-list'); if (l) l.innerHTML = `<p class="pf-note" style="text-align:center;margin-top:20px">${esc(errText(e))}</p>`; });
        setTimeout(() => inp.focus(), 50);
    };

    // ---------- offline copy (coach-sw.js, only for this app's pages) ----------
    if ('serviceWorker' in navigator && location.protocol === 'https:') window.addEventListener('load', () => navigator.serviceWorker.register('coach-sw.js', { scope: './coach' }).catch(e => console.warn('Offline mode unavailable:', e)));

    // ---------- start ----------
    auth.getRedirectResult().catch(e => signInScreen(e.code || t('Sign-in failed')));
    auth.onAuthStateChanged(u => {
        me = u; stopThreads(); stopChat(); clients = []; page = null;
        try { tab = sessionStorage.getItem('coachTab') || 'home'; sessionStorage.removeItem('coachTab'); } catch (e) { tab = 'home'; }
        if (!u) return signInScreen();
        if (window.ApexCoachSignIn.needsVerify(u)) return verifyScreen();
        route();
    });
})();

// Apex Lift app (index.html), part 11 of 13: Joining a coach (Profile → Your coach) and the chat with the coach.
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see app/README in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// 🧑‍🏫 MY COACH: join a coach with the code or link (?coach=CODE) they gave you, see who your coach is, leave.
// Joining writes coaches/{coach}/members/{me} and users/{me}/coach/link together (see COACHING in firestore.rules);
// from then on the coach can see your account and workouts (never your backups) and send you routines (coach/plan).
// A coach can remove you from their side: the app notices (the link points to a member entry that is gone) and forgets them.
const COACH_LINK_KEY = 'workoutCoachLink_rakan_final', PENDING_COACH = 'workoutPendingCoach';
const getCoachLink = () => { const v = readJSON(COACH_LINK_KEY, null); return isObj(v) && v.coachId ? v : null; };
const setCoachLink = v => { try { if (v) localStorage.setItem(COACH_LINK_KEY, JSON.stringify(v)); else localStorage.removeItem(COACH_LINK_KEY); } catch (e) {} renderCoachRow(); };
const renderCoachRow = () => {
    const l = getCoachLink(), sub = document.getElementById('coach-sub'), lab = document.getElementById('coach-label');
    if (lab) lab.textContent = l ? t('Your coach') : t('Join a coach');
    if (sub) sub.textContent = l ? l.coachName : t("With your coach's code");
    if (window.appActions.chatWatch) window.appActions.chatWatch();
};
const coachMsg = (txt, bad = true) => `<p class="text-[12px] font-bold ${bad ? 'text-red-400' : 'text-slate-400'}">${esc(txt)}</p>`;
const coachFindBody = (code = '') => `<p class="text-[13px] font-bold text-slate-400 mb-4 leading-snug">${t('Type or paste the code your coach gave you.')}</p>
        <input id="coach-in" type="text" value="${esc(code ? fmtCode(code) : '')}" maxlength="12" placeholder="ABCD-EFGH" autocomplete="off" autocapitalize="characters" spellcheck="false" dir="ltr" class="code-input"
            oninput="window.appActions.codeTyped(this)" onkeydown="if(event.key==='Enter')window.appActions.coachFind()">
        <button id="coach-find" onclick="window.appActions.coachFind()" class="w-full mt-3 py-3.5 rounded-xl bg-[#d4af37] text-black text-[12px] font-extrabold tap-feedback flex items-center justify-center gap-2"><i data-lucide="search" class="w-4 h-4"></i>${t('Find coach')}</button>
        <div id="coach-result" class="mt-4"></div>`;
const coachFoundBody = (code, name) => `<div class="glass-card p-4 border border-[#d4af37]/30 p-pop">
            <div class="text-[17px] font-black text-white">${t('Join {name}?', { name: esc(name) })}</div>
            <p class="text-[13px] font-bold text-slate-400 mt-2 leading-snug">${t('Your coach will see your profile, routines and workouts, and can send you routines and messages. Your backups stay private.')}</p>
            <button id="coach-join" onclick="window.appActions.coachJoin()" class="w-full mt-4 py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2"><i data-lucide="user-check" class="w-5 h-5"></i>${t('Join')}</button>
        </div>
        <button onclick="window.appActions.openCoachSheet()" class="mt-3 text-[12px] font-bold text-slate-300 underline underline-offset-2 tap-feedback">${t('Use another code')}</button>`;
const coachMineBody = l => `<div class="glass-card p-4">
            <div class="text-[12px] font-bold text-slate-400">${t('Your coach')}</div>
            <div class="text-[17px] font-black text-white mt-0.5">${esc(l.coachName)}</div>
            <p class="text-[13px] font-bold text-slate-400 mt-2 leading-snug">${t('Your coach sees your profile, routines and workouts, and can send you routines and messages.')}</p>
        </div>
        <button onclick="window.appActions.openChat()" class="w-full mt-3 py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2"><i data-lucide="message-circle" class="w-5 h-5"></i>${t('Chat with {name}', { name: esc(l.coachName) })}${chatUnread() ? `<span class="chat-badge">${t('New')}</span>` : ''}</button>
        <button id="coach-leave" onclick="window.appActions.coachLeave()" class="w-full mt-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-red-400 text-[12px] font-bold tap-feedback">${t('Leave coach')}</button>`;
// a ?coach=CODE link: remember it, clean the address bar, and open it once you're signed in
try { const u = new URL(location.href), c = cleanCode(u.searchParams.get('coach')); if (c) { sessionStorage.setItem(PENDING_COACH, c); u.searchParams.delete('coach'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } } catch (e) {}
const openPendingCoach = () => {
    let c = ''; try { c = sessionStorage.getItem(PENDING_COACH) || ''; sessionStorage.removeItem(PENDING_COACH); } catch (e) {}
    if (cleanCode(c)) setTimeout(() => { window.appActions.openCoachSheet(c); window.appActions.coachFind(); }, 600);
};
const leaveBatch = (uid, coachId) => { const b = Cloud.db.batch(); b.delete(Cloud.db.doc(`coaches/${coachId}/members/${uid}`)); b.delete(Cloud.db.doc(`users/${uid}/coach/link`)); return withTimeout(b.commit()); };
// the link as the database has it now (the copy on this phone can be out of date, e.g. changed on another phone)
const serverLink = async uid => { const s = await withTimeout(Cloud.db.doc(`users/${uid}/coach/link`).get({ source: 'server' })); return s.exists ? s.data() || {} : null; };
let coachCheckedAt = 0;
Object.assign(window.appActions, {
    // Is the coach still there? (they or the admin may have removed you). force: check now, not at most once a minute
    coachCheck: async (force = false) => {
        if (!Cloud.user || !Cloud.db || (!force && Date.now() - coachCheckedAt < 60000)) return;
        coachCheckedAt = Date.now();
        const uid = Cloud.user.uid, still = () => Cloud.user && Cloud.user.uid === uid; // signed out meanwhile: don't save the old account's coach
        try {
            const l = await serverLink(uid);
            if (!still()) return;
            if (!l) return setCoachLink(null);
            const ms = await withTimeout(Cloud.db.doc(`coaches/${l.coachId}/members/${uid}`).get({ source: 'server' }));
            if (!still()) return;
            if (ms.exists) return setCoachLink({ coachId: l.coachId, coachName: cut(l.coachName, 100, 'Coach'), code: l.code });
            await Cloud.db.doc(`users/${uid}/coach/link`).delete().catch(() => {});
            if (still()) setCoachLink(null);
        } catch (e) { console.warn('Coach check', e); /* offline: keep what we know */ }
    },
    openCoachSheet: (code = '') => {
        window.appState.coachFound = null;
        const l = getCoachLink(), c = cleanCode(code);
        codeSheet(l && !c ? t('Your coach') : t('Join a coach'), l && !c ? coachMineBody(l) : coachFindBody(c));
        if (!c) window.appActions.coachCheck(true).then(() => { const now = getCoachLink(); if (!!now !== !!l && document.getElementById('code-overlay').classList.contains('flex')) codeSheet(now ? t('Your coach') : t('Join a coach'), now ? coachMineBody(now) : coachFindBody()); });
    },
    coachFind: async () => {
        const inp = document.getElementById('coach-in'), res = document.getElementById('coach-result'), btn = document.getElementById('coach-find'); if (!inp || !res) return;
        const code = cleanCode(inp.value);
        if (!code) { res.innerHTML = coachMsg(t('A code has 8 letters and numbers, like ABCD-EFGH.')); return; }
        if (!Cloud.user || !Cloud.db) { res.innerHTML = coachMsg(t('Sign in to join a coach.')); return; }
        if (btn) btn.disabled = true;
        res.innerHTML = `<div class="flex items-center justify-center gap-2 py-4 text-[13px] font-bold text-slate-400"><i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>${t('Looking for your coach…')}</div>`;
        if (window.lucide) window.lucide.createIcons({ root: res });
        try {
            const snap = await withTimeout(Cloud.db.doc(`coachCodes/${code}`).get({ source: 'server' }));
            const d = snap.exists ? snap.data() || {} : null;
            if (!d || typeof d.coach !== 'string') { res.innerHTML = coachMsg(t("This code doesn't work. Check it with your coach.")); return; }
            const l = getCoachLink();
            if (l && l.coachId === d.coach) { res.innerHTML = coachMsg(t('You already train with {name}.', { name: cut(d.name, 100, 'Coach') }), false); return; }
            // each code works once
            if (typeof d.usedBy === 'string' && d.usedBy) { res.innerHTML = coachMsg(t('This code was already used. Ask your coach for a new one.')); return; }
            window.appState.coachFound = { code, coachId: d.coach, name: cut(d.name, 100, 'Coach') };
            codeSheet(t('Join a coach'), coachFoundBody(code, window.appState.coachFound.name));
        } catch (e) { console.warn('Coach code', e); res.innerHTML = coachMsg(codeErr(e)); }
        finally { if (btn) btn.disabled = false; }
    },
    coachJoin: () => {
        const f = window.appState.coachFound; if (!f || !Cloud.user) return;
        const old = getCoachLink();
        const go = async () => {
            if (window.appState.coachBusy) return; window.appState.coachBusy = true;
            const uid = Cloud.user.uid, f2 = { ...f };
            try {
                // one coach at a time: leaving the old coach and joining the new one happen in one step (both or neither)
                const cur = await serverLink(uid), flag = getCloudFlag() || {}, now = Date.now(), b = Cloud.db.batch();
                if (cur && cur.coachId && cur.coachId !== f2.coachId) b.delete(Cloud.db.doc(`coaches/${cur.coachId}/members/${uid}`));
                b.set(Cloud.db.doc(`coaches/${f2.coachId}/members/${uid}`), { code: f2.code, name: cut(Cloud.user.displayName || flag.name || '', 100, ''), email: Cloud.user.email || '', joinedAt: now });
                b.set(Cloud.db.doc(`users/${uid}/coach/link`), { coachId: f2.coachId, coachName: f2.name, code: f2.code, joinedAt: now });
                b.update(Cloud.db.doc(`coachCodes/${f2.code}`), { usedBy: uid, usedAt: now }); // the code works once
                await withTimeout(b.commit());
                window.appState.coachFound = null;
                setCoachLink({ coachId: f2.coachId, coachName: f2.name, code: f2.code });
                window.appActions.closeCodeSheet();
                window.appActions.showToast(t('You joined {name}', { name: f2.name }), 'success');
            } catch (e) {
                console.warn('Join coach', e);
                window.appActions.coachCheck(true); // show what the database really has now
                const r = document.getElementById('code-body');
                if (r) r.insertAdjacentHTML('beforeend', `<div class="mt-3">${coachMsg(e && e.code === 'permission-denied' ? t("This code doesn't work. Check it with your coach.") : codeErr(e))}</div>`);
            } finally { window.appState.coachBusy = false; }
        };
        if (old && old.coachId !== f.coachId) window.appActions.showConfirm(t('Leave {old} and join {new}?', { old: old.coachName, new: f.name }), t('{name} will no longer see your account.', { name: old.coachName }), go, false, t('Join'));
        else go();
    },
    coachLeave: () => {
        const l = getCoachLink(); if (!l || !Cloud.user) return;
        window.appActions.showConfirm(t('Leave your coach?'), t('{name} will no longer see your account.', { name: l.coachName }), async () => {
            try {
                const uid = Cloud.user.uid, cur = await serverLink(uid);
                if (cur && cur.coachId) await leaveBatch(uid, cur.coachId); // the coach the database has, not only this phone's copy
                setCoachLink(null); window.appActions.closeCodeSheet(); window.appActions.showToast(t('You left your coach'), 'success');
            }
            catch (e) { console.warn('Leave coach', e); window.appActions.showToast(codeErr(e), 'error'); }
        }, true, t('Leave coach'));
    }
});
renderCoachRow();

// 💬 COACH CHAT: messages with your coach, users/{me}/chats/{coachId}/messages (see firestore.rules: only you and that
// coach, while you are in their list). The thread document (users/{me}/chats/{coachId}) holds the last message and when
// each side last read it: one small listener on it shows a dot on Profile when the coach wrote. The chat page listens to
// the last 100 messages while it is open. Messages are not kept on the phone.
const CHAT_LIMIT = 100;
let chatThread = null, chatKey = '', chatThreadOff = null, chatMsgsOff = null, chatMsgs = [], chatSeenAt = 0;
const chatOpen = () => sheetOpen('chat-overlay');
// The chat page is pinned to the part of the screen you can see: when the phone's keyboard opens, the page shrinks
// above it (your coach's name stays at the top, only the messages scroll) instead of the whole page being pushed up.
let chatFitOff = null;
const chatFit = () => {
    const o = document.getElementById('chat-overlay'), list = document.getElementById('chat-list'), v = window.visualViewport;
    const atEnd = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
    o.style.height = `${v ? v.height : window.innerHeight}px`; o.style.bottom = 'auto';
    o.style.top = `${v ? v.offsetTop : 0}px`;
    if (atEnd) list.scrollTop = list.scrollHeight;
};
const chatFitStart = () => {
    const v = window.visualViewport;
    if (v) { v.addEventListener('resize', chatFit); v.addEventListener('scroll', chatFit); }
    window.addEventListener('resize', chatFit);
    chatFitOff = () => {
        if (v) { v.removeEventListener('resize', chatFit); v.removeEventListener('scroll', chatFit); }
        window.removeEventListener('resize', chatFit);
        const o = document.getElementById('chat-overlay'); o.style.height = o.style.top = o.style.bottom = '';
    };
    chatFit();
};
const chatRef = () => { const l = getCoachLink(); return Cloud.user && Cloud.db && l ? Cloud.db.doc(`users/${Cloud.user.uid}/chats/${l.coachId}`) : null; };
function chatUnread() { const l = getCoachLink(); return !!(chatThread && l && chatThread.lastFrom === l.coachId && chatThread.lastAt > (chatThread.readClient || 0)); }
const renderChatDot = () => { const d = document.getElementById('chat-dot'); if (d) d.classList.toggle('hidden', !chatUnread()); const r = document.getElementById('coach-new'); if (r) r.classList.toggle('hidden', !chatUnread()); };
const chatTime = ts => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const chatDay = ts => {
    const k = dateKey(ts);
    if (k === dateKey()) return t('Today');
    if (k === dateKey(Date.now() - 86400000)) return t('Yesterday');
    const d = new Date(ts);
    return `${d.getDate()} ${isAR ? MONTHS_AR[d.getMonth()] : MONTHS_EN[d.getMonth()]}${d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : ''}`;
};
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const renderChat = () => {
    const list = document.getElementById('chat-list'); if (!list) return;
    const l = getCoachLink(), me = Cloud.user ? Cloud.user.uid : '';
    if (!chatMsgs.length) {
        list.innerHTML = `<div class="chat-empty"><i data-lucide="message-circle"></i><p>${t('Send your coach a message. Only you and {name} can see this chat.', { name: esc(l ? l.coachName : t('your coach')) })}</p></div>`;
    } else {
        let html = '', lastDay = '';
        chatMsgs.forEach(m => {
            const day = chatDay(m.at); if (day !== lastDay) { html += `<div class="chat-day">${esc(day)}</div>`; lastDay = day; }
            const mine = m.from === me;
            html += `<div class="chat-msg${mine ? ' is-me' : ''}"><p dir="auto">${esc(m.text)}</p><span class="num">${m.pending ? t('Sending…') : chatTime(m.at)}</span></div>`;
        });
        list.innerHTML = html;
    }
    if (window.lucide) window.lucide.createIcons({ root: list });
    list.scrollTop = list.scrollHeight;
};
// you read everything up to now (only when the thread exists: the rules need its other fields)
const chatMarkRead = () => {
    const r = chatRef(); if (!r || !chatThread || !chatUnread()) return;
    chatThread.readClient = Date.now(); renderChatDot();
    r.update({ readClient: chatThread.readClient }).catch(e => console.warn('Chat read', e));
};
Object.assign(window.appActions, {
    // follow the thread of the coach you are linked to (called whenever the coach link changes)
    chatWatch: () => {
        const l = getCoachLink(), key = Cloud.user && Cloud.db && l ? `${Cloud.user.uid}/${l.coachId}` : '';
        if (key === chatKey) return renderChatDot();
        if (chatThreadOff) { chatThreadOff(); chatThreadOff = null; }
        chatKey = key; chatThread = null; chatSeenAt = 0; renderChatDot();
        if (!key) { if (chatOpen()) window.appActions.closeChat(); return; }
        chatThreadOff = chatRef().onSnapshot(s => {
            const d = s.exists ? s.data() || {} : null, first = !chatSeenAt;
            chatThread = d ? { lastAt: Number(d.lastAt) || 0, lastText: cut(d.lastText, 200, ''), lastFrom: String(d.lastFrom || ''), readClient: Number(d.readClient) || 0, readCoach: Number(d.readCoach) || 0 } : null;
            // a new message from the coach while the app is open (not the first look at the thread)
            if (!first && chatThread && chatUnread() && chatThread.lastAt > chatSeenAt) {
                if (chatOpen()) chatMarkRead();
                else window.appActions.showToast(t('New message from {name}', { name: getCoachLink() ? getCoachLink().coachName : t('your coach') }), 'success');
            }
            chatSeenAt = Math.max(chatSeenAt, chatThread ? chatThread.lastAt : 0, 1);
            renderChatDot();
        }, e => { console.warn('Chat thread', e); chatThread = null; renderChatDot(); });
    },
    openChat: () => {
        const l = getCoachLink(), r = chatRef(); if (!l || !r) return;
        if (sheetOpen('code-overlay')) window.appActions.closeCodeSheet();
        document.getElementById('chat-title').textContent = l.coachName;
        chatMsgs = []; renderChat();
        const inp = document.getElementById('chat-in'); inp.value = ''; window.appActions.chatTyped(inp);
        openSheet('chat-overlay', 'chat-box'); pushBack('chat', () => window.appActions.closeChat());
        if (chatFitOff) chatFitOff();
        chatFitStart();
        if (chatMsgsOff) chatMsgsOff();
        chatMsgsOff = r.collection('messages').orderBy('at', 'desc').limit(CHAT_LIMIT).onSnapshot({ includeMetadataChanges: true }, qs => {
            chatMsgs = qs.docs.map(d => { const x = d.data() || {}; return { from: String(x.from || ''), text: cut(x.text, 1000, ''), at: Number(x.at) || 0, pending: d.metadata.hasPendingWrites }; })
                .filter(m => m.text).reverse();
            renderChat(); chatMarkRead();
        }, e => { console.warn('Chat', e); window.appActions.showToast(codeErr(e), 'error'); });
    },
    closeChat: () => {
        popBack('chat'); closeSheet('chat-overlay', 'chat-box');
        if (chatMsgsOff) { chatMsgsOff(); chatMsgsOff = null; }
        if (chatFitOff) setTimeout(() => { if (chatFitOff && !chatOpen()) { chatFitOff(); chatFitOff = null; } }, 320); // after the page has slid away
    },
    // the box grows with the text (up to 5 lines); Send works only with some text
    chatTyped: el => {
        el.style.height = 'auto'; if (el.value) el.style.height = `${Math.min(el.scrollHeight, 132)}px`; // empty (or still hidden): its normal one line
        const b = document.getElementById('chat-send'); if (b) b.disabled = !el.value.trim();
    },
    // the keyboard's return key says Send (enterkeyhint) and sends, like a chat app; Shift+Enter on a computer = new line
    chatKeyDown: e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); window.appActions.chatSend(); } },
    chatSend: () => {
        const inp = document.getElementById('chat-in'), r = chatRef(), text = (inp.value || '').trim().slice(0, 1000);
        if (!text || !r) return;
        const now = Date.now(), uid = Cloud.user.uid, b = Cloud.db.batch();
        b.set(r.collection('messages').doc(), { from: uid, text, at: now });
        const last = { lastAt: now, lastText: text.slice(0, 200), lastFrom: uid, readClient: now };
        if (chatThread) b.update(r, last); else b.set(r, { ...last, readCoach: 0 });
        chatThread = { ...(chatThread || { readCoach: 0 }), ...last };
        inp.value = ''; window.appActions.chatTyped(inp); inp.focus();
        // offline: Firestore keeps it and sends it later; the message shows "Sending…" until then
        b.commit().catch(e => { console.warn('Chat send', e); window.appActions.showToast(e && e.code === 'permission-denied' ? t('You can no longer message this coach.') : codeErr(e), 'error'); window.appActions.coachCheck(true); });
    }
});

// the exercise names used in the catalogue and your routines, by their keys (for the AI coach)
const exerciseNames = () => {
    const m = {}; const add = n => { if (n) m[getExKey('', '', '', n)] = n; };
    catalogue().forEach(x => add(x.name));
    appData.weeks.forEach(w => w.schedule.forEach(d => (d.exercises || []).forEach(e => add(e.name))));
    return m;
};
const keyToName = (k, names) => names[k] || k.replace(/^global_/, '').split('_').filter(Boolean).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');

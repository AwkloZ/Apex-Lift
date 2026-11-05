// Apex Lift app (index.html), part 9 of 13: Email and password sign-in, and the email links (reset password, confirm email).
// The app/*.js files are plain scripts loaded in order by index.html; they share one scope, so a name declared in an
// earlier file can be used in a later one (see "App files" in CLAUDE.md). Keep the order in index.html and sw.js.
'use strict';

// ✉️ EMAIL SIGN-IN: an account with an email and password (Firebase Authentication), next to Google.
// Turned on once in Firebase: Authentication → Sign-in method → Email/Password.
// Modes: 'in' sign in, 'up' create an account, 'reset' forgot password, 'reauth' confirm the password (before deleting the account),
// 'newpass' choose a new password (opened by the reset link in the email, see EMAIL LINKS below)
const isPasswordUser = () => !!Cloud.user && (Cloud.user.providerData || []).some(p => p && p.providerId === 'password')
    && !(Cloud.user.providerData || []).some(p => p && p.providerId === 'google.com');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailSt = { mode: 'in', busy: false, then: null, code: '', resetEmail: '' };
// New accounts need a strong password: at least 8 characters, one capital letter and one symbol (any non-letter, non-number)
const PASS_RULES = [
    ['At least 8 characters', p => p.length >= 8],
    ['One capital letter (A–Z)', p => /\p{Lu}/u.test(p)],
    ['One symbol, like ! @ # $ %', p => /[^\p{L}\p{N}\s]/u.test(p)]
];
const passStrong = p => PASS_RULES.every(r => r[1](p));
// the rules, then "Both passwords match" for the second (confirm) box
const passRulesHTML = (p, p2) => [...PASS_RULES, ['Both passwords match', x => !!p2 && x === p2]].map(([l, ok]) => `<li class="flex items-center gap-2 ${ok(p) ? 'text-[#22c55e]' : 'text-slate-400'}"><i data-lucide="${ok(p) ? 'check-circle-2' : 'circle'}" class="w-4 h-4 shrink-0"></i>${t(l)}</li>`).join('');
const authErrorText = e => {
    const c = (e && e.code) || '';
    if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-login-credentials'].includes(c)) return t('Email or password is wrong.');
    if (c === 'auth/email-already-in-use') return t('This email already has an account. Sign in instead.');
    if (c === 'auth/invalid-email' || c === 'auth/missing-email') return t('Please enter a valid email.');
    if (c === 'auth/weak-password' || c === 'auth/password-does-not-meet-requirements') return t('Your password needs at least 8 characters, a capital letter and a symbol.');
    if (c === 'auth/too-many-requests') return t('Too many tries. Wait a few minutes and try again.');
    if (c === 'auth/operation-not-allowed') return t('Email sign-in isn\'t available yet. Use Google for now.');
    if (c === 'auth/user-disabled') return t('This account is turned off. Contact us.');
    return cloudErrorText(e);
};
const renderEmail = (msg = '', good = false) => {
    const m = emailSt.mode, keep = id => { const el = document.getElementById(id); return el ? el.value : ''; };
    const strong = m === 'up' || m === 'newpass'; // a new password: rules + confirm box
    const email = m === 'newpass' ? emailSt.resetEmail : keep('em-email') || (m === 'reauth' && Cloud.user ? Cloud.user.email || '' : ''), name = keep('em-name');
    const pass = strong ? keep('em-pass') : '', pass2 = strong ? keep('em-pass2') : '';
    const title = { in: t('Sign in with email'), up: t('Create your account'), reset: t('Reset your password'), reauth: t('Confirm your password'), newpass: t('Choose a new password') }[m];
    const sub = { in: '', up: t('Use your email and a strong password.'), reset: t("Enter your email and we'll send you a reset link."), reauth: t('Enter your password to delete your account.'), newpass: t('Pick a strong password for your account.') }[m];
    const inp = 'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[16px] font-bold outline-none focus:border-[#d4af37]';
    const lbl = (txt, html) => `<label class="block"><span class="block text-[12px] font-bold text-slate-400 mb-1.5">${txt}</span>${html}</label>`;
    const link = (fn, txt) => `<button type="button" data-on-click="${fn}" class="inline-flex items-center min-h-[40px] px-1 text-[13px] font-bold text-[#d4af37] tap-feedback">${txt}</button>`;
    const btn = { in: t('Sign in'), up: t('Create account'), reset: t('Send link'), reauth: t('Confirm'), newpass: t('Save password') }[m];
    const eye = `<button type="button" data-on-click="document.querySelectorAll('#em-pass,#em-pass2').forEach(i=>i.type=i.type==='password'?'text':'password')" class="absolute inset-y-0 end-0 px-3.5 text-slate-400 tap-feedback" aria-label="${esc(t('Show password'))}"><i data-lucide="eye" class="w-5 h-5"></i></button>`;
    document.getElementById('email-body').innerHTML = `
            <div class="relative text-center pt-3 pb-1">
                <button type="button" data-on-click="window.appActions.closeEmail()" class="absolute -top-1 -end-1 w-11 h-11 flex items-center justify-center bg-white/5 rounded-full text-slate-400 tap-feedback" aria-label="${esc(t('Close'))}"><i data-lucide="x" class="w-5 h-5"></i></button>
                <span class="w-14 h-14 mx-auto mb-3 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center"><i data-lucide="${{ in: 'mail', up: 'user-plus', reset: 'key-round', reauth: 'shield-check', newpass: 'key-round' }[m]}" class="w-7 h-7"></i></span>
                <h3 class="text-xl font-black text-white">${title}</h3>
            </div>
            ${sub ? `<p class="text-[13px] font-bold text-slate-400 text-center mt-1 mb-5 leading-snug">${sub}</p>` : '<div class="h-4"></div>'}
            <form data-on-submit="event.preventDefault(); window.appActions.emailSubmit()" class="space-y-3" novalidate>
                ${m === 'up' ? lbl(t('Your name'), `<input id="em-name" type="text" autocomplete="name" maxlength="60" value="${esc(name)}" class="${inp}" dir="auto">`) : ''}
                ${m === 'reauth' || m === 'newpass' ? `<div class="text-[13px] font-bold text-slate-300" dir="ltr">${esc(email)}</div>` : lbl(t('Email'), `<input id="em-email" type="email" inputmode="email" autocomplete="${m === 'up' ? 'email' : 'username'}" autocapitalize="off" spellcheck="false" maxlength="200" value="${esc(email)}" class="${inp}" dir="ltr">`)}
                ${m === 'reset' ? '' : lbl(t(m === 'newpass' ? 'New password' : 'Password'), `<div class="relative"><input id="em-pass" type="password" autocomplete="${strong ? 'new-password' : 'current-password'}" maxlength="200" value="${esc(pass)}" ${strong ? 'oninput="window.appActions.passTyped()" aria-describedby="em-rules"' : ''} class="${inp} pe-12" dir="ltr">${eye}</div>`)}
                ${strong ? lbl(t('Confirm password'), `<input id="em-pass2" type="password" autocomplete="new-password" maxlength="200" value="${esc(pass2)}" data-on-input="window.appActions.passTyped()" aria-describedby="em-rules" class="${inp}" dir="ltr">`) : ''}
                ${strong ? `<ul id="em-rules" class="space-y-1.5 text-[12px] font-bold">${passRulesHTML(pass, pass2)}</ul>` : ''}
                <p id="em-msg" class="text-[12px] font-bold leading-snug ${good ? 'text-[#22c55e]' : 'text-red-400'} ${msg ? '' : 'hidden'}" role="alert">${esc(msg)}</p>
                <button id="em-go" type="submit" ${emailSt.busy ? 'disabled' : ''} class="w-full py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback flex items-center justify-center gap-2 disabled:opacity-60">${emailSt.busy ? '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>' : ''}${btn}</button>
            </form>
            <div class="flex flex-col items-center gap-3 mt-5 mb-2">
                ${m === 'in' ? link("window.appActions.emailMode('reset')", t('Forgot password?')) + `<span class="text-[13px] font-bold text-slate-400">${t('New here?')} ${link("window.appActions.emailMode('up')", t('Create an account'))}</span>` : ''}
                ${m === 'up' ? `<span class="text-[13px] font-bold text-slate-400">${t('Have an account?')} ${link("window.appActions.emailMode('in')", t('Sign in'))}</span>` : ''}
                ${m === 'reset' || m === 'newpass' ? link("window.appActions.emailMode('in')", t('Back to sign in')) : ''}
            </div>`;
    if (window.lucide) window.lucide.createIcons({ root: document.getElementById('email-body') });
};
Object.assign(window.appActions, {
    openEmail: (mode = 'in', then = null) => {
        if ((mode === 'in' || mode === 'up') && welcomeOpen() && !getAgree()) return window.appActions.needAgree(() => window.appActions.openEmail(mode, then));
        emailSt.mode = mode; emailSt.then = then; emailSt.busy = false;
        document.getElementById('email-body').innerHTML = '';
        renderEmail();
        const o = document.getElementById('email-overlay'); // closed, or still sliding away: open it (again)
        if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('email-overlay', 'email-box'); pushBack('email', () => window.appActions.closeEmail()); }
        setTimeout(() => { const f = document.getElementById(mode === 'up' ? 'em-name' : mode === 'reauth' || mode === 'newpass' ? 'em-pass' : 'em-email'); if (f) f.focus(); }, 350);
    },
    closeEmail: () => { popBack('email'); if (document.activeElement) document.activeElement.blur(); closeModal('email-overlay', 'email-box'); emailSt.then = null; },
    emailMode: mode => { emailSt.mode = mode; renderEmail(); },
    // ticks each password rule (and "Both passwords match") while typing a new password
    passTyped: () => {
        const ul = document.getElementById('em-rules'); if (!ul) return;
        const v = id => (document.getElementById(id) || {}).value || '';
        ul.innerHTML = passRulesHTML(v('em-pass'), v('em-pass2')); if (window.lucide) window.lucide.createIcons({ root: ul });
        const msg = document.getElementById('em-msg'); if (msg) msg.classList.add('hidden'); // an old error goes away while typing
    },
    emailSubmit: async () => {
        if (emailSt.busy) return;
        const m = emailSt.mode, val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        const email = m === 'newpass' ? emailSt.resetEmail : val('em-email').toLowerCase(), name = val('em-name');
        const pass = (document.getElementById('em-pass') || {}).value || '', pass2 = (document.getElementById('em-pass2') || {}).value || '';
        if (m !== 'reauth' && m !== 'newpass' && !EMAIL_RE.test(email)) return renderEmail(t('Please enter a valid email.'));
        if (m === 'up' && !name) return renderEmail(t('Please enter your name.'));
        if (m !== 'reset' && !pass) return renderEmail(t('Please enter your password.'));
        if ((m === 'up' || m === 'newpass') && !passStrong(pass)) return renderEmail(t('Your password needs at least 8 characters, a capital letter and a symbol.'));
        if ((m === 'up' || m === 'newpass') && !pass2) return renderEmail(t('Please confirm your password.'));
        if ((m === 'up' || m === 'newpass') && pass !== pass2) return renderEmail(t("Passwords don't match."));
        if (navigator.onLine === false) return renderEmail(t('No internet connection. Try again when online.'));
        // signing in from a reset link on a phone that hasn't agreed to the Terms yet: agree first
        if ((m === 'in' || m === 'up') && welcomeOpen() && !getAgree()) return window.appActions.needAgree(() => window.appActions.emailSubmit());
        emailSt.busy = true; renderEmail();
        try {
            await loadFirebase();
            if (m === 'in') await Cloud.auth.signInWithEmailAndPassword(email, pass);
            else if (m === 'up') {
                const cred = await Cloud.auth.createUserWithEmailAndPassword(email, pass);
                await cred.user.updateProfile({ displayName: name.slice(0, 60) });
                cred.user.sendEmailVerification().catch(() => {});
                // the name arrived after sign-in started: put it on the account card and in the next upload
                const f = getCloudFlag(); if (f && f.uid === cred.user.uid) writeItem(CLOUD_KEY, JSON.stringify({ ...f, name: name.slice(0, 60) }));
                // upload it now only if the first sync is done; otherwise that sync takes it (an early upload would look like an older account)
                Cloud.sent.main = ''; if (Cloud.unsub.length && !Cloud.starting) scheduleFlush(500); renderAccount();
            } else if (m === 'reset') {
                try { await Cloud.auth.sendPasswordResetEmail(email); } catch (e) { if (e.code !== 'auth/user-not-found') throw e; }
                emailSt.busy = false; emailSt.mode = 'in';
                return renderEmail(t('If an account exists, we\'ve sent a reset link. Check your inbox.'), true);
            } else if (m === 'newpass') {
                await Cloud.auth.confirmPasswordReset(emailSt.code, pass);
                emailSt.code = '';
                // signed out on this phone (and the Terms already agreed): sign straight in with the new password
                if (Cloud.user || !getAgree()) {
                    emailSt.busy = false; emailSt.mode = 'in';
                    if (Cloud.user) { window.appActions.closeEmail(); return window.appActions.showToast(t('Password changed.'), 'success'); }
                    renderEmail(t('Password changed. Sign in with your new password.'), true);
                    const f = document.getElementById('em-email'); if (f) f.value = email;
                    return;
                }
                await Cloud.auth.signInWithEmailAndPassword(email, pass);
                window.appActions.showToast(t("Password changed. You're signed in."), 'success');
            } else if (m === 'reauth') {
                await Cloud.auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(Cloud.auth.currentUser.email, pass));
            }
            const then = emailSt.then;
            emailSt.busy = false; window.appActions.closeEmail();
            if (then) then();
        } catch (e) {
            console.warn('Email sign-in', e);
            emailSt.busy = false; renderEmail(authErrorText(e));
        }
    },
    resendVerify: async () => {
        if (!Cloud.user) return;
        try { await Cloud.user.sendEmailVerification(); window.appActions.showToast(t('Email sent. Check your inbox.'), 'success'); }
        catch (e) { window.appActions.showToast(authErrorText(e), 'error'); }
    }
});

// 🔑 EMAIL LINKS: the "reset your password" and "confirm your email" links in Firebase's emails open here, in the app,
// instead of Firebase's plain page. Set once in Firebase: Authentication → Templates → (pencil) → Customize action URL
// → https://apex-liftt.netlify.app/  (the link then arrives as ?mode=resetPassword&oobCode=...).
// Other kinds of links (like undoing an email change) still go to Firebase's own page.
const AUTH_LINK = (() => {
    try {
        const raw = location.search, q = new URLSearchParams(raw), mode = q.get('mode'), code = q.get('oobCode');
        if (!mode || !code) return null;
        ['mode', 'oobCode', 'apiKey', 'continueUrl', 'lang'].forEach(k => q.delete(k));
        history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
        return { mode, code, raw };
    } catch (e) { return null; }
})();
// a message page in the email window (the email links show their result here)
const emailNotice = (icon, good, title, text, buttons) => {
    const body = document.getElementById('email-body');
    body.innerHTML = `<div class="text-center pt-4 pb-1" dir="${isAR ? 'rtl' : 'ltr'}">
            <span class="w-16 h-16 mx-auto mb-4 rounded-full ${good ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-white/5 text-slate-300'} flex items-center justify-center"><i data-lucide="${icon}" class="w-8 h-8"></i></span>
            <h3 class="text-xl font-black text-white">${title}</h3>
            <p class="text-[13px] font-bold text-slate-400 mt-2 mb-6 leading-snug">${text}</p>
            ${buttons}</div>`;
    if (window.lucide) window.lucide.createIcons({ root: body });
    const o = document.getElementById('email-overlay');
    if (!o.classList.contains('flex') || o.classList.contains('opacity-0')) { openModal('email-overlay', 'email-box'); pushBack('email', () => window.appActions.closeEmail()); }
};
const noticeBtn = (fn, txt) => `<button type="button" data-on-click="${fn}" class="w-full py-4 rounded-xl bg-[#d4af37] text-black text-[13px] font-extrabold tap-feedback">${txt}</button>`;
// Firebase has finished checking who is signed in on this phone
const authReady = () => new Promise(ok => { const off = Cloud.auth.onAuthStateChanged(u => { off(); ok(u); }); });
const linkErrorText = e => ['auth/expired-action-code', 'auth/invalid-action-code'].includes((e && e.code) || '') ? t('This link has expired or was already used.') : authErrorText(e);
const openAuthLink = async () => {
    const a = AUTH_LINK; if (!a || a.done) return; a.done = true;
    if (a.mode !== 'resetPassword' && a.mode !== 'verifyEmail') return location.replace('https://apex-lift-52a18.firebaseapp.com/__/auth/action' + a.raw);
    try { await loadFirebase(); } catch (e) { return window.appActions.showToast(t('No internet connection. Try again when online.'), 'error'); }
    if (a.mode === 'verifyEmail') {
        const user = await authReady();
        try {
            await Cloud.auth.applyActionCode(a.code);
            if (user) { await user.reload(); Cloud.sent.main = ''; scheduleFlush(500); }
            renderAccount(); renderAccountSheet();
            // signed in here: back to the app; opened on another browser or phone: sign in from here if they want
            emailNotice('badge-check', true, t('Email confirmed'), user ? t('Thanks! Your email is confirmed.') : t('Your email is confirmed. You can go back to Apex Lift, or sign in here.'),
                user ? noticeBtn('window.appActions.closeEmail()', t('Continue')) : noticeBtn("window.appActions.openEmail('in')", t('Sign in')));
        } catch (e) {
            const canResend = !!user && isPasswordUser() && !user.emailVerified;
            emailNotice('circle-alert', false, t('Link not valid'), esc(linkErrorText(e)),
                canResend ? noticeBtn('window.appActions.closeEmail(); window.appActions.resendVerify()', t('Send a new link')) : noticeBtn('window.appActions.closeEmail()', t('Close')));
        }
        return;
    }
    try {
        emailSt.resetEmail = await Cloud.auth.verifyPasswordResetCode(a.code);
        emailSt.code = a.code;
        window.appActions.openEmail('newpass');
    } catch (e) {
        // an old or used link: ask for a new one right here
        window.appActions.openEmail('reset');
        renderEmail(e && ['auth/expired-action-code', 'auth/invalid-action-code'].includes(e.code) ? t('This link has expired or was already used. Ask for a new one below.') : linkErrorText(e));
    }
};

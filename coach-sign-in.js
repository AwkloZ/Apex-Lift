// Apex Coach (coach.html): signing in. A coach must be signed in to use the coach app (there is no "Not now"):
// Google, or email and password. Email accounts must confirm their email first (the database rules need a
// confirmed email to accept an invitation). Looks like the Apex Lift app's sign-in page (coach.css).
// Loaded before coach.js, which decides what to show after sign-in.
window.ApexCoachSignIn = (() => {
    'use strict';
    const { $, esc } = window.ApexAdminUtils; // admin-utils.js
    const { t } = window.ApexCoachI18n; // coach-i18n.js
    const GOOGLE_G = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
    const top = `<header class="top"><div class="logo-mark" dir="ltr">APEX <span>LIFT</span></div><span class="top-tag"><i data-lucide="whistle"></i>${t('Coach')}</span></header>`;
    const icons = el => { if (window.lucide) window.lucide.createIcons({ root: el }); };

    // the sign-in page. el: where to draw it; invited: opened from an invitation link; msg: an error to show
    const show = ({ el, auth, invited = false, msg = '' }) => {
        el.innerHTML = `<div class="fade-in">${top}<div class="hero">
                <div class="orb"><i data-lucide="${invited ? 'mail-open' : 'whistle'}"></i></div>
                <h1>${invited ? t("You're invited to coach") : 'Apex Coach'}</h1>
                <p>${invited ? t('Sign in with the email the invitation was sent to.') : t('Coach your Apex Lift clients: chat with them, send them routines and see how they train.')}</p>
                <button id="g" class="btn white tap">${GOOGLE_G}${t('Continue with Google')}</button>
                <button id="show-email" class="btn tap" ${msg ? 'hidden' : ''}><i data-lucide="mail"></i>${t('Continue with email')}</button>
                <div id="email-form" style="width:100%;max-width:26rem" ${msg ? '' : 'hidden'}>
                    <input id="em" class="field" type="email" autocomplete="email" dir="ltr" placeholder="${esc(t('Email'))}" aria-label="${esc(t('Email'))}">
                    <input id="pw" class="field" type="password" autocomplete="current-password" dir="ltr" placeholder="${esc(t('Password (at least 8 characters)'))}" aria-label="${esc(t('Password'))}">
                    <button id="si" class="btn gold tap">${t('Sign in')}</button>
                    <button id="su" class="btn tap">${t('Create account')}</button>
                    <button id="fp" class="link-btn">${t('Forgot password?')}</button>
                </div>
                <p id="err" class="err" role="alert">${esc(msg)}</p>
            </div></div>`;
        icons(el);
        const err = (m, ok = false) => { const e = $('err'); e.textContent = m; e.classList.toggle('is-ok', ok); };
        const creds = () => [$('em').value.trim(), $('pw').value];
        $('show-email').onclick = () => { $('show-email').hidden = true; $('email-form').hidden = false; $('em').focus(); };
        $('g').onclick = async () => {
            const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
            try { await auth.signInWithPopup(p); }
            catch (e) {
                // home-screen apps and some browsers block pop-ups: sign in on the full page instead
                if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) return auth.signInWithRedirect(p);
                if (e.code !== 'auth/popup-closed-by-user') err(e.code || t('Sign-in failed'));
            }
        };
        $('si').onclick = async () => {
            const [e, p] = creds(); if (!e || !p) return err(t('Enter your email and password.'));
            try { await auth.signInWithEmailAndPassword(e, p); }
            catch (x) { err(/wrong-password|invalid-credential|user-not-found/.test(x.code || '') ? t('Wrong email or password.') : (x.code || t('Sign-in failed'))); }
        };
        $('su').onclick = async () => {
            const [e, p] = creds(); if (!e || p.length < 8) return err(t('Enter your email and a password of at least 8 characters.'));
            try { const r = await auth.createUserWithEmailAndPassword(e, p); await r.user.sendEmailVerification(); }
            catch (x) { err(x.code === 'auth/email-already-in-use' ? t('This email already has an account: sign in instead.') : (x.code || t('Could not create the account'))); }
        };
        $('fp').onclick = async () => {
            const [e] = creds(); if (!e) return err(t('Enter your email first.'));
            try { await auth.sendPasswordResetEmail(e); err(t('We sent you an email to reset your password.'), true); } catch (x) { err(x.code || t('Could not send the email')); }
        };
        ['em', 'pw'].forEach(id => { $(id).onkeydown = e => { if (e.key === 'Enter') $('si').click(); }; });
    };

    // an email account that hasn't confirmed its email yet. onContinue: runs after they confirmed (the page goes on)
    const verify = ({ el, auth, user, onContinue }) => {
        el.innerHTML = `<div class="fade-in">${top}<div class="hero">
                <div class="orb"><i data-lucide="mail-check"></i></div>
                <h1>${t('Confirm your email')}</h1>
                <p>${t('We sent a link to {email}. Open it, then come back and tap Continue.', { email: `<b dir="ltr">${esc(user.email)}</b>` })}</p>
                <button id="cont" class="btn gold tap">${t('Continue')}</button>
                <button id="resend" class="btn tap"><i data-lucide="send"></i>${t('Send again')}</button>
                <button id="so2" class="link-btn">${t('Sign out')}</button>
                <p id="err" class="err" role="alert"></p>
            </div></div>`;
        icons(el);
        $('cont').onclick = async () => { await user.reload(); await user.getIdToken(true); if (!user.emailVerified) { $('err').textContent = t('Not confirmed yet. Open the link in the email first.'); return; } onContinue(); };
        $('resend').onclick = async () => { try { await user.sendEmailVerification(); $('err').textContent = ''; $('resend').lastChild.textContent = t('Sent'); } catch (x) { $('err').textContent = t('Please wait a minute, then try again.'); } };
        $('so2').onclick = () => auth.signOut();
    };

    // signed in but the email still needs confirming (Google accounts are always confirmed)
    const needsVerify = user => !user.emailVerified && !user.providerData.some(p => p.providerId === 'google.com');

    return Object.freeze({ show, verify, needsVerify });
})();

// Apex Coach (coach.html): signing in. A coach must be signed in to use the coach app (there is no "Not now"):
// Google, or email and password. Email accounts must confirm their email first (the database rules need a
// confirmed email to accept an invitation). Loaded before coach.js, which decides what to show after sign-in.
window.ApexCoachSignIn = (() => {
    'use strict';
    const { $, esc } = window.ApexAdminUtils; // admin-utils.js

    // the sign-in page. el: where to draw it; invited: opened from an invitation link; msg: an error to show
    const show = ({ el, auth, invited = false, msg = '' }) => {
        el.innerHTML = `<div class="narrow"><div class="center" style="padding-bottom:20px"><h1>Apex Coach</h1><p>${invited ? 'You were invited to coach on Apex Lift. Sign in with the email the invitation was sent to.' : 'Sign in with your coach account.'}</p></div>
            <button id="g" class="btn gold wide">Continue with Google</button>
            <div class="or">or with email</div>
            <input id="em" class="field" type="email" autocomplete="email" placeholder="Email">
            <input id="pw" class="field" type="password" autocomplete="current-password" placeholder="Password (at least 8 characters)">
            <button id="si" class="btn wide">Sign in</button>
            <button id="su" class="btn wide">Create account</button>
            <button id="fp" class="linkbtn note" style="display:block;margin:6px auto">Forgot password?</button>
            <p id="err" class="err" style="text-align:center">${esc(msg)}</p></div>`;
        const err = m => { $('err').textContent = m; };
        const creds = () => [$('em').value.trim(), $('pw').value];
        $('g').onclick = async () => {
            const p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
            try { await auth.signInWithPopup(p); }
            catch (e) {
                // home-screen apps and some browsers block pop-ups: sign in on the full page instead
                if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) return auth.signInWithRedirect(p);
                if (e.code !== 'auth/popup-closed-by-user') err(e.code || 'Sign-in failed');
            }
        };
        $('si').onclick = async () => {
            const [e, p] = creds(); if (!e || !p) return err('Enter your email and password.');
            try { await auth.signInWithEmailAndPassword(e, p); }
            catch (x) { err(/wrong-password|invalid-credential|user-not-found/.test(x.code || '') ? 'Wrong email or password.' : (x.code || 'Sign-in failed')); }
        };
        $('su').onclick = async () => {
            const [e, p] = creds(); if (!e || p.length < 8) return err('Enter your email and a password of at least 8 characters.');
            try { const r = await auth.createUserWithEmailAndPassword(e, p); await r.user.sendEmailVerification(); }
            catch (x) { err(x.code === 'auth/email-already-in-use' ? 'This email already has an account: sign in instead.' : (x.code || 'Could not create the account')); }
        };
        $('fp').onclick = async () => {
            const [e] = creds(); if (!e) return err('Enter your email first.');
            try { await auth.sendPasswordResetEmail(e); err('We sent you an email to reset your password.'); } catch (x) { err(x.code || 'Could not send the email'); }
        };
    };

    // an email account that hasn't confirmed its email yet. onContinue: runs after they confirmed (the page goes on)
    const verify = ({ el, auth, user, onContinue }) => {
        el.innerHTML = `<div class="narrow"><div class="center"><h1>Confirm your email</h1><p>We sent a link to <b>${esc(user.email)}</b>. Open it, then come back and tap Continue.</p>
            <button id="cont" class="btn gold">Continue</button> <button id="resend" class="btn">Send again</button> <button class="btn" id="so2">Sign out</button></div></div>`;
        $('cont').onclick = async () => { await user.reload(); await user.getIdToken(true); onContinue(); };
        $('resend').onclick = async e => { try { await user.sendEmailVerification(); e.target.textContent = 'Sent'; } catch (x) { e.target.textContent = 'Try later'; } };
        $('so2').onclick = () => auth.signOut();
    };

    // signed in but the email still needs confirming (Google accounts are always confirmed)
    const needsVerify = user => !user.emailVerified && !user.providerData.some(p => p.providerId === 'google.com');

    return Object.freeze({ show, verify, needsVerify });
})();

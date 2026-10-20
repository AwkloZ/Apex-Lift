// Apex Lift: signing in is REQUIRED before using the app while this file is on the site.
//
// - Keep this file: everyone must sign in (Google or email) before they can use the app. There is no "Not now" button,
//   and signing out goes straight back to the sign-in page.
// - Delete this file: sign-in becomes optional again (a "Not now" button shows on the sign-in page).
//
// Nothing else needs to change either way: index.html loads this file if it exists, and app.js reads the switch below.
window.APEX_REQUIRE_SIGN_IN = true;

// No account on this phone yet: cover the app from the very first moment, so nothing of it shows before the
// sign-in page appears. app.js removes the cover once you are signed in (or when the sign-in page closes).
(function () {
    var signedIn = false;
    try { var f = JSON.parse(localStorage.getItem('workoutCloud_rakan_final') || 'null'); signedIn = !!(f && f.uid); } catch (e) {}
    if (signedIn) return;
    document.documentElement.classList.add('apex-gate');
    var st = document.createElement('style');
    st.textContent = 'html.apex-gate body::after { content: ""; position: fixed; inset: 0; z-index: 9989; background: #050505; }';
    document.head.appendChild(st);
})();

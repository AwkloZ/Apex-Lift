// privacy.html and terms.html: English / Arabic switch (remembers the app's language, or #ar / #en in the address)
// and the back-to-top button. No inline scripts, so the security policy can forbid them.
(function () {
    'use strict';
    function show(l) {
        ['en', 'ar'].forEach(function (x) {
            document.getElementById(x).classList.toggle('hide', x !== l);
            document.getElementById('b-' + x).classList.toggle('on', x === l);
        });
        document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        try { history.replaceState(null, '', '#' + l); } catch (e) {}
    }
    var saved = 'en';
    try { saved = localStorage.getItem('workoutLang_rakan_final') === 'ar' ? 'ar' : 'en'; } catch (e) {}
    var h = location.hash.slice(1);
    if (h === 'ar' || h === 'en') saved = h; else if (/^(ar|en)-s\d+$/.test(h)) saved = h.slice(0, 2);
    show(saved);
    if (/^(ar|en)-s\d+$/.test(h)) setTimeout(function () { var e = document.getElementById(h); if (e) e.scrollIntoView(); }, 50);
    var top = document.getElementById('top');
    addEventListener('scroll', function () { top.classList.toggle('show', scrollY > 700); }, { passive: true });
    document.getElementById('b-en').addEventListener('click', function () { show('en'); });
    document.getElementById('b-ar').addEventListener('click', function () { show('ar'); });
    top.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });
})();

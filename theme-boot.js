// Light theme before the page is drawn, so it doesn't flash dark first (the Theme setting of the app, shared by
// index.html and coach.html on the same device). Loaded in <head>, after the theme-color meta tag.
try {
    var th = localStorage.getItem('workoutTheme_rakan_final');
    if (th === 'light' || (th === 'system' && matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.setAttribute('data-theme', 'light');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f3f3f0');
    }
} catch (e) {}

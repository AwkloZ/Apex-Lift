// Apex Lift service worker: keeps a copy of the app on the phone so it opens without signal.
//
// How it works:
// - App files (index.html, app.js, ...) : try the internet first so you always get the newest version,
//   but if there is no answer within 3 seconds (bad gym signal) use the saved copy.
// - Fonts and versioned library files (vendor/fonts, vendor/firebase-12.19.0/..., sortable-1.15.7): saved copy first,
//   they never change under the same name. Other sites (Firebase) are never saved.
//
// When you add a NEW file to the app, add it to APP_FILES and change the version number below.
// (require-sign-in.js is left out on purpose: it can be deleted, and a missing file in APP_FILES would break the install.
//  It is still saved for offline use the first time the app loads it.)
const CACHE = 'apex-lift-v84';
const APP_FILES = [
    './',
    'index.html',
    'style.css',
    'tailwind.css',
    'library.js',
    'i18n.js',
    'calc.js',
    'firebase-config.js',
    'admin-utils.js',
    'app/core.js',
    'app/init.js',
    'app/render.js',
    'app/profile.js',
    'app/today-plan.js',
    'app/actions.js',
    'app/ai-coach.js',
    'app/cloud.js',
    'app/email-auth.js',
    'app/routine-codes.js',
    'app/my-coach.js',
    'app/welcome.js',
    'app/start.js',
    'manifest.webmanifest',
    'vendor/lucide-icons.js',
    'vendor/sortable-1.15.7.min.js',
    'vendor/fonts/inter-latin-var.woff2',
    'vendor/fonts/cairo-arabic-var.woff2',
    'vendor/fonts/barlow-condensed-latin-500.woff2',
    'vendor/fonts/barlow-condensed-latin-600.woff2',
    'vendor/fonts/barlow-condensed-latin-700.woff2',
    'vendor/fonts/barlow-condensed-latin-800.woff2',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/icon-maskable-512.png',
    'icons/apple-touch-icon.png',
    'privacy.html',
    'terms.html'
];
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(APP_FILES);
        self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        // Remove copies saved by older versions of this file
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('apex-lift-') && k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

const saveCopy = (request, response) => {
    // a file that was deleted from the site (like require-sign-in.js) must not keep working from the saved copy
    if (response && response.status === 404) caches.open(CACHE).then(cache => cache.delete(request, { ignoreSearch: true }));
    if (response && (response.ok || response.type === 'opaque')) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
};

// Internet first, saved copy if the internet is slow or missing
const networkFirst = async request => {
    const cached = caches.match(request, { ignoreSearch: true });
    const network = fetch(request).then(res => saveCopy(request, res));
    network.catch(() => {}); // a failed download is fine here, we fall back to the saved copy
    const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS));
    const fast = await Promise.race([network.catch(() => null), timeout]);
    if (fast) return fast;
    return (await cached) || network;
};

// Saved copy first, refresh it in the background
const cacheFirst = async request => {
    const cached = await caches.match(request);
    const network = fetch(request).then(res => saveCopy(request, res)).catch(() => null);
    return cached || (await network) || Response.error();
};

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    // Google sign-in pages (/__/auth/...) are passed on to Firebase by Netlify: never save or replace them
    if (url.pathname.startsWith('/__/')) return;
    if (url.origin === self.location.origin) {
        // font files and versioned libraries never change under the same name: no need to wait for the internet
        if (/\.woff2$/.test(url.pathname) || /^\/vendor\/[^/]*\d+\.\d+\.\d+/.test(url.pathname)) event.respondWith(cacheFirst(request));
        else event.respondWith(networkFirst(request));
    }
    // everything else (Firebase sign-in and database) always goes to the internet
});

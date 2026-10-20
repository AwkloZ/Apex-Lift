// Apex Lift service worker: keeps a copy of the app on the phone so it opens without signal.
//
// How it works:
// - App files (index.html, app.js, ...) : try the internet first so you always get the newest version,
//   but if there is no answer within 3 seconds (bad gym signal) use the saved copy.
// - Outside files (Google font): use the saved copy, refresh it in the background.
//
// When you add a NEW file to the app, add it to APP_FILES and change the version number below.
// (require-sign-in.js is left out on purpose: it can be deleted, and a missing file in APP_FILES would break the install.
//  It is still saved for offline use the first time the app loads it.)
const CACHE = 'apex-lift-v30';
const APP_FILES = [
    './',
    'index.html',
    'style.css',
    'tailwind.css',
    'library.js',
    'app.js',
    'manifest.webmanifest',
    'vendor/lucide-1.49.0.min.js',
    'vendor/sortable-1.15.7.min.js',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/icon-maskable-512.png',
    'icons/apple-touch-icon.png',
    'privacy.html',
    'terms.html'
];
const OUTSIDE_FILES = [];
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(APP_FILES);
        // Outside files are nice to have: don't fail the install if one can't be downloaded right now
        await Promise.all(OUTSIDE_FILES.map(url =>
            fetch(url, { mode: 'no-cors' }).then(res => cache.put(url, res)).catch(() => {})
        ));
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
        event.respondWith(networkFirst(request));
    } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        // only the design and the font; Firebase (login, database) must always go to the internet
        event.respondWith(cacheFirst(request));
    }
});

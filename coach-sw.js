// Apex Coach service worker: keeps a copy of the coach app (coach.html) on the phone so it opens without signal
// and can be installed on the home screen. Registered by coach.js with the scope "./coach", so it only looks after
// coach.html; the Apex Lift app keeps its own (sw.js), and the two never touch each other's saved copies.
// Same rules as sw.js: app files from the internet first (saved copy after 3 seconds without an answer),
// fonts and versioned libraries from the saved copy. Firebase (sign-in, database) always goes to the internet.
//
// When you add a NEW file to the coach app, add it to APP_FILES and change the version number below.
const CACHE = 'apex-coach-v3';
const APP_FILES = [
    'coach.html',
    'coach.css',
    'coach.js',
    'coach-sign-in.js',
    'coach-i18n.js',
    'coach.webmanifest',
    'coach-builder.js',
    'admin-utils.js',
    'library.js',
    'calc.js',
    'i18n.js',
    'vendor/lucide-icons.js',
    'vendor/firebase-12.19.0/firebase-app-compat.js',
    'vendor/firebase-12.19.0/firebase-auth-compat.js',
    'vendor/firebase-12.19.0/firebase-firestore-compat.js',
    'vendor/fonts/inter-latin-var.woff2',
    'vendor/fonts/cairo-arabic-var.woff2',
    'vendor/fonts/barlow-condensed-latin-700.woff2',
    'vendor/fonts/barlow-condensed-latin-800.woff2',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/apple-touch-icon.png',
    'privacy.html'
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
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k.startsWith('apex-coach-') && k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

const saveCopy = (request, response) => {
    if (response && response.status === 404) caches.open(CACHE).then(cache => cache.delete(request, { ignoreSearch: true }));
    if (response && response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
    return response;
};
// Internet first, saved copy if the internet is slow or missing
const networkFirst = async request => {
    const cached = caches.match(request, { ignoreSearch: true });
    const network = fetch(request).then(res => saveCopy(request, res));
    network.catch(() => {});
    const fast = await Promise.race([network.catch(() => null), new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS))]);
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
    if (url.origin !== self.location.origin || url.pathname.startsWith('/__/')) return; // Firebase and Google sign-in: never saved
    if (/\.woff2$/.test(url.pathname) || /\/vendor\/[^/]*\d+\.\d+\.\d+/.test(url.pathname)) event.respondWith(cacheFirst(request));
    else event.respondWith(networkFirst(request));
});

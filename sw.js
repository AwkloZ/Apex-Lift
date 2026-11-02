// Apex Lift service worker: keeps a copy of the app on the phone so it opens without signal.
//
// How it works:
// - App files (index.html, app.js, ...) : try the internet first so you always get the newest version,
//   but if there is no answer within 3 seconds (bad gym signal) use the saved copy.
// - Fonts and versioned library files never change (a new version gets a new name): saved copy first.
//
// When you add a NEW file to the app, add it to APP_FILES and change the version number below.
const CACHE = 'apex-lift-v11';
const APP_FILES = [
    './',
    'index.html',
    'style.css',
    'tailwind.css',
    'app.js',
    'manifest.webmanifest',
    'vendor/lucide-icons.js',
    'vendor/sortable-1.15.7.min.js',
    'fonts/fonts.css',
    'fonts/inter-latin-var.woff2',
    'fonts/cairo-arabic-var.woff2',
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
    // Firebase (login, database) and other outside addresses always go to the internet
    if (url.origin !== self.location.origin) return;
    // font files and versioned libraries (e.g. vendor/firebase-12.19.0/...) never change under the same name
    if (/\.woff2$/.test(url.pathname) || /^\/vendor\/[^/]*\d+\.\d+\.\d+/.test(url.pathname)) event.respondWith(cacheFirst(request));
    else event.respondWith(networkFirst(request));
});

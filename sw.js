/* =====================================================================
   VOCABULARY WORLD — SERVICE WORKER (PWA)
   Version: 1.0.0
====================================================================== */

const CACHE_NAME = 'vocab-world-v1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './learn.html',
  './flashcards.html',
  './games.html',
  './tracker.html',
  './assessment.html',
  './add-words.html',
  './offline.html',
  './css/style.css',
  './js/data.js',
  './js/common.js',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// 1. INSTALL: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.warn('[SW] Pre-caching encountered an issue:', err);
      })
  );
});

// 2. ACTIVATE: Purge stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 3. FETCH: Smart caching strategy with offline fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Bypass streaming or third-party embed media (YouTube, YouGlish)
  if (url.origin.includes('youtube.com') || url.origin.includes('googlevideo.com') || url.origin.includes('youglish.com')) {
    return;
  }

  // A. Navigation requests (HTML pages) -> Network first with Cache fallback, then offline.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedRes = await caches.match(req);
          if (cachedRes) return cachedRes;

          // If specific page not cached, show offline fallback page
          const offlineFallback = await caches.match('./offline.html');
          if (offlineFallback) return offlineFallback;

          return new Response('Offline mode — page unavailable', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // B. Static Assets (CSS, JS, Fonts, Images, Icons) -> Stale-while-revalidate / Cache-first
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        // Fetch fresh copy in background for next visit
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {});
        return cachedRes;
      }

      // If not in cache, fetch from network and store in dynamic cache
      return fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && (url.origin === self.location.origin || url.origin.includes('cdn.tailwindcss.com') || url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com'))) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          // If image request fails offline, provide svg fallback if possible
          if (req.destination === 'image') {
            return caches.match('./icons/favicon.svg');
          }
          return null;
        });
    })
  );
});

// 4. MESSAGE: Allow skip waiting on update prompt
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

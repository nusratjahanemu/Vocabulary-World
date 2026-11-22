/* =====================================================================
   VOCABULARY WORLD — SERVICE WORKER (PWA)
   Cache Version: vw-cache-v20
====================================================================== */

const CACHE_NAME = 'vw-cache-v20';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './learn.html',
  './flashcards.html',
  './games.html',
  './tracker.html',
  './assessment.html',
  './add-words.html',
  './style.css',
  './css/style.css',
  './common.js',
  './js/common.js',
  './words-data.js',
  './js/words-data.js',
  './js/data.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './offline.html'
];

// 1. INSTALL: Pre-cache all core application files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache each asset safely
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Pre-cache skipped for ${url}:`, err);
            })
          )
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVATE: Clean up older cache versions automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log('[SW] Deleting stale cache:', name);
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

// 3. FETCH: Network-first with cache-fallback for HTML/JS/CSS
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Bypass third-party streaming/video embeds (YouTube, YouGlish, etc.)
  if (
    url.origin.includes('youtube.com') ||
    url.origin.includes('googlevideo.com') ||
    url.origin.includes('youglish.com') ||
    url.protocol === 'chrome-extension:'
  ) {
    return;
  }

  // Network-First with Cache-Fallback Strategy
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // If response is valid, update the cache in background
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(async () => {
        // Network failed (offline) -> Look in cache
        const cachedRes = await caches.match(req);
        if (cachedRes) {
          return cachedRes;
        }

        // For navigation requests when offline and page not cached, show offline page
        if (req.mode === 'navigate') {
          const offlinePage = await caches.match('./offline.html');
          if (offlinePage) {
            return offlinePage;
          }
          const indexPage = await caches.match('./index.html');
          if (indexPage) {
            return indexPage;
          }
        }

        // Fallback for image requests when offline
        if (req.destination === 'image') {
          const fallbackIcon = await caches.match('./icon.svg');
          if (fallbackIcon) {
            return fallbackIcon;
          }
        }

        return new Response('Offline: Content not available in cache', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// 4. MESSAGE: Allow skip waiting on update
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

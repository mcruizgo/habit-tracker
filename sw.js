// sw.js — Habit & Routine Tracker (cache-first + navigation fallback)
const CACHE = 'hr-cache-v7';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/maskable-512.png',
  'assets/apple-touch-icon-180.png'
];

const toAbs = (u) => new URL(u, self.registration.scope).toString();

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS.map(toAbs));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Navigation requests: network first, then offline fallback to cached index.html
  if (req.mode === 'navigate' || (req.destination === 'document' && req.headers.get('accept').includes('text/html'))) {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        // Optionally update cached index.html with latest
        const c = await caches.open(CACHE);
        const indexReq = new Request(toAbs('index.html'), {credentials: 'same-origin'});
        c.put(indexReq, res.clone()).catch(()=>{});
        return res;
      } catch (e) {
        const cached = await caches.match(toAbs('index.html'));
        if (cached) return cached;
        return new Response('<h1>Offline</h1><p>Vuelve a conectarte para continuar.</p>', {headers: {'Content-Type':'text/html'}});
      }
    })());
    return;
  }

  // Static assets: cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      const c = await caches.open(CACHE);
      c.put(req, res.clone()).catch(()=>{});
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});

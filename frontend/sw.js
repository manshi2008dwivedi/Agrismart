const V='agrismart-v14';
const F=[
  './',
  './index.html',
  './farmer.html',
  './buyer.html',
  './auth.html',
  './auth.js',
  './i18n.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(V).then(c => c.addAll(F)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith((async () => {
    const cached = await caches.match(req);
    try {
      const response = await fetch(req);
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(V).then(cache => cache.put(req, copy)));
      }
      return response;
    } catch {
      if (cached) return cached;
      if (req.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});

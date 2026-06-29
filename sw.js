const CACHE = 'guardarropa-v51';
const CORE = [
  '/wardrobe/manifest.json',
  '/wardrobe/icon-192.png',
  '/wardrobe/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Network first para HTML y JSON — siempre sirve la versión más reciente
  if(url.includes('/wardrobe/index.html') || url.endsWith('/wardrobe/') || url.includes('/wardrobe/guardarropa.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache first para imágenes
  if(url.includes('/wardrobe/images/')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        if(res.ok){ const clone=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,clone)); }
        return res;
      }))
    );
    return;
  }
  // Default: red directa
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

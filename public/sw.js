self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // O Chrome exige um tratador de fetch para habilitar a instalação PWA real
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('Offline');
  }));
});
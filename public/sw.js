
// Service Worker essencial para habilitar a instalação como PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Necessário para o Chrome considerar o site como PWA instalável
  event.respondWith(fetch(event.request));
});

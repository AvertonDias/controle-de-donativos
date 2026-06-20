
// Service Worker minimalista para habilitar a instalação PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Necessário para cumprir os requisitos de instalação, 
  // mesmo que não faça cache offline complexo no momento.
  event.respondWith(fetch(event.request));
});

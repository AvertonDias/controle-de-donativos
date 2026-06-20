// Service Worker para tornar o app instalável como PWA real
const CACHE_NAME = 'donativos-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// O evento fetch é obrigatório para o Chrome permitir a instalação como aplicativo
self.addEventListener('fetch', (event) => {
  // Apenas responde para habilitar a instalação, sem cache complexo por enquanto
  event.respondWith(fetch(event.request).catch(() => {
    return caches.match(event.request);
  }));
});
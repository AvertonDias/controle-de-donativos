
// Service Worker para habilitar funcionalidades PWA
const CACHE_NAME = 'donativos-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// O evento fetch é OBRIGATÓRIO para o Chrome oferecer a instalação como "App"
self.addEventListener('fetch', (event) => {
  // Estratégia simples de rede primeiro para garantir dados atualizados
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

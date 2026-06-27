
/**
 * Service Worker PWA
 * Essencial para habilitar a instalação como "Aplicativo" no Android/Chrome.
 */

const CACHE_NAME = 'donativos-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// O evento fetch é OBRIGATÓRIO para o Chrome oferecer a instalação como App
self.addEventListener('fetch', (event) => {
  // Estratégia de rede primeiro para evitar dados desatualizados no Firebase
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

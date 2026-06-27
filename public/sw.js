
// Service Worker para PWA - Controle de Donativos
const CACHE_NAME = 'donativos-v1';

self.addEventListener('install', (event) => {
  console.log('SW: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Ativado');
  event.waitUntil(clients.claim());
});

// O evento fetch é OBRIGATÓRIO para que o Chrome ofereça "Instalar Aplicativo"
self.addEventListener('fetch', (event) => {
  // Estratégia Network-first com fallback para cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

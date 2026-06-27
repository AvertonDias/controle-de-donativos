const CACHE_NAME = 'donativos-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// O evento fetch é obrigatório para que o Chrome ofereça a instalação como APP
self.addEventListener('fetch', (event) => {
  // Apenas passa a requisição adiante (estratégia network-only simples)
  // Mas a existência deste listener habilita o PWA
  event.respondWith(fetch(event.request));
});

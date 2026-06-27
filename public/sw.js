<<<<<<< HEAD
=======
const CACHE_NAME = 'donativos-v1';

>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

<<<<<<< HEAD
=======
// O evento FETCH é OBRIGATÓRIO para o Chrome oferecer a instalação como APP
>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('fetch', (event) => {
  // Estratégia simples de Network First para garantir dados atualizados do Firebase
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
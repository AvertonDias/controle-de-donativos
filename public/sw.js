<<<<<<< HEAD
<<<<<<< HEAD
=======
=======

// Service Worker para PWA - Controle de Donativos
>>>>>>> c4f5254 (Achei o problema. 🎯)
const CACHE_NAME = 'donativos-v1';

>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('install', (event) => {
  console.log('SW: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Ativado');
  event.waitUntil(clients.claim());
});

<<<<<<< HEAD
<<<<<<< HEAD
=======
// O evento FETCH é OBRIGATÓRIO para o Chrome oferecer a instalação como APP
>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('fetch', (event) => {
  // Estratégia simples de Network First para garantir dados atualizados do Firebase
=======
// O evento fetch é OBRIGATÓRIO para que o Chrome ofereça "Instalar Aplicativo"
self.addEventListener('fetch', (event) => {
  // Estratégia Network-first com fallback para cache
>>>>>>> c4f5254 (Achei o problema. 🎯)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

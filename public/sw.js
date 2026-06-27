<<<<<<< HEAD
<<<<<<< HEAD
=======
=======

<<<<<<< HEAD
// Service Worker para PWA - Controle de Donativos
>>>>>>> c4f5254 (Achei o problema. 🎯)
=======
>>>>>>> 2dc54ce (Make the following changes:)
const CACHE_NAME = 'donativos-v1';

>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker ativado');
});

<<<<<<< HEAD
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
=======
// O Chrome exige o evento fetch para habilitar a instalação como App
self.addEventListener('fetch', (event) => {
  // Respondemos com a rede por padrão, mas o evento deve existir
  event.respondWith(fetch(event.request));
>>>>>>> 2dc54ce (Make the following changes:)
});

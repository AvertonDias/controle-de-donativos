
const CACHE_NAME = 'donativos-v1';

self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker ativado');
});

// O Chrome exige o evento fetch para habilitar a instalação como App
self.addEventListener('fetch', (event) => {
  // Respondemos com a rede por padrão, mas o evento deve existir
  event.respondWith(fetch(event.request));
});

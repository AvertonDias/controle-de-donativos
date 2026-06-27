
const CACHE_NAME = 'donativos-v2';

self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalando...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker ativado');
});

// O evento fetch é OBRIGATÓRIO para o Chrome permitir a instalação como APP
self.addEventListener('fetch', (event) => {
  // Apenas responde para permitir que o navegador valide o PWA
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

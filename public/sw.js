
const CACHE_NAME = 'donativos-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('PWA: Service Worker instalado');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('PWA: Service Worker ativado');
});

// O evento fetch é obrigatório para que o Chrome ofereça a instalação como "App"
self.addEventListener('fetch', (event) => {
  // Apenas passa adiante, mas a existência do listener habilita o PWA
  event.respondWith(fetch(event.request));
});

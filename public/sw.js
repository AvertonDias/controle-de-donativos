<<<<<<< HEAD
<<<<<<< HEAD
=======
=======

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// Service Worker para PWA - Controle de Donativos
>>>>>>> c4f5254 (Achei o problema. 🎯)
=======
>>>>>>> 2dc54ce (Make the following changes:)
const CACHE_NAME = 'donativos-v1';
=======
const CACHE_NAME = 'donativos-cache-v1';
>>>>>>> fe21102 ((índice):1 Access to manifest at 'https://6000-firebase-studio-178144311)
=======
const CACHE_NAME = 'donativos-v2';
>>>>>>> 67edcdd (coloque estas opções em um menu lateral (_for element <Primitive.div>_))
=======
/**
 * Service Worker PWA
 * Essencial para habilitar a instalação como "Aplicativo" no Android/Chrome.
 */

const CACHE_NAME = 'donativos-v1';
>>>>>>> c67c850 (react-dom-client.development.js:25630 Download the React DevTools for a)

>>>>>>> 18e8d70 (O problema nº 1)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
// O evento fetch é obrigatório para que o Chrome ofereça a instalação como "App"
>>>>>>> fe21102 ((índice):1 Access to manifest at 'https://6000-firebase-studio-178144311)
self.addEventListener('fetch', (event) => {
  // Apenas passa adiante, mas a existência do listener habilita o PWA
  event.respondWith(fetch(event.request));
>>>>>>> 2dc54ce (Make the following changes:)
=======
// O evento fetch é OBRIGATÓRIO para o Chrome permitir a instalação como APP
self.addEventListener('fetch', (event) => {
  // Apenas responde para permitir que o navegador valide o PWA
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
>>>>>>> 67edcdd (coloque estas opções em um menu lateral (_for element <Primitive.div>_))
=======
// O evento fetch é OBRIGATÓRIO para o Chrome oferecer a instalação como App
self.addEventListener('fetch', (event) => {
  // Estratégia de rede primeiro para evitar dados desatualizados no Firebase
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
>>>>>>> c67c850 (react-dom-client.development.js:25630 Download the React DevTools for a)
});

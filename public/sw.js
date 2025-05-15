const CACHE_NAME = 'atrim-3d-showcase-v1';

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    self.skipWaiting()
  );
});

// Activar el service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Eliminar caches antiguos si es necesario
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  // Comportamiento normal para todas las solicitudes
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
}); 
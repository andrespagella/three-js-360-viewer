const CACHE_NAME = 'atrim-3d-showcase-v1';
const VIDEO_CACHE_NAME = 'atrim-3d-video-cache-v1';
const VIDEO_URL = '/videos/video-back_2880x2160.webm';

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(VIDEO_CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando video de fondo');
        return cache.add(VIDEO_URL);
      })
      .then(() => self.skipWaiting())
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
          if (cacheName !== CACHE_NAME && cacheName !== VIDEO_CACHE_NAME) {
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
  const url = new URL(event.request.url);
  
  // Si la solicitud es para el video de fondo
  if (url.pathname === VIDEO_URL) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          console.log('Sirviendo video desde cache');
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Guardar en cache si no estaba
              return caches.open(VIDEO_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
    );
  } else {
    // Para otras solicitudes, comportamiento normal
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
}); 
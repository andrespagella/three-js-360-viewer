const CACHE_NAME = 'atrim-3d-showcase-v1';
const VIDEO_CACHE_NAME = 'atrim-3d-video-cache-v1';
const VIDEO_URL = 'https://atrim3dshowcase-storage.s3.us-east-1.amazonaws.com/video-back_2880x2160.webm';

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(VIDEO_CACHE_NAME)
      .then((cache) => {
        console.log('Intentando cachear video de fondo desde S3');
        // Usar fetch con mode: 'cors' para recursos externos
        return fetch(VIDEO_URL, { mode: 'cors' })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener el video: ' + response.status);
            }
            return cache.put(VIDEO_URL, response);
          })
          .catch(error => {
            console.error('Error al cachear el video:', error);
            // Continuar con la instalación incluso si hay un error
            return Promise.resolve();
          });
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
  if (url.href === VIDEO_URL) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('Sirviendo video desde cache');
            return response;
          }
          
          console.log('Video no encontrado en cache, obteniendo de la red');
          return fetch(event.request, { mode: 'cors' })
            .then((fetchResponse) => {
              if (!fetchResponse || !fetchResponse.ok) {
                console.error('Error al obtener el video de la red:', fetchResponse?.status);
                return fetchResponse;
              }
              
              // Guardar en cache si no estaba
              return caches.open(VIDEO_CACHE_NAME)
                .then((cache) => {
                  try {
                    cache.put(event.request, fetchResponse.clone());
                  } catch (error) {
                    console.error('Error al guardar video en cache:', error);
                  }
                  return fetchResponse;
                });
            })
            .catch(error => {
              console.error('Error al obtener el video:', error);
              throw error;
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
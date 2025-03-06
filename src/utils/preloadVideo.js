/**
 * Función para precargar un video
 * @param {string} videoUrl - URL del video a precargar
 * @returns {Promise} - Promesa que se resuelve cuando el video está precargado
 */
const preloadVideo = (videoUrl) => {
  return new Promise((resolve, reject) => {
    // Verificar si el service worker está disponible
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      console.log('Precargando video a través del service worker:', videoUrl);
      
      // El service worker ya debería estar cacheando el video
      // Solo verificamos que esté en la caché
      caches.open('atrim-3d-video-cache-v1')
        .then(cache => cache.match(videoUrl))
        .then(response => {
          if (response) {
            console.log('Video encontrado en cache');
            resolve();
          } else {
            console.log('Video no encontrado en cache, cargando manualmente');
            loadVideoManually(videoUrl, resolve, reject);
          }
        })
        .catch(error => {
          console.error('Error al verificar cache:', error);
          loadVideoManually(videoUrl, resolve, reject);
        });
    } else {
      console.log('Service worker no disponible, cargando video manualmente');
      loadVideoManually(videoUrl, resolve, reject);
    }
  });
};

/**
 * Carga un video manualmente usando un elemento video
 * @param {string} videoUrl - URL del video a cargar
 * @param {Function} resolve - Función para resolver la promesa
 * @param {Function} reject - Función para rechazar la promesa
 */
const loadVideoManually = (videoUrl, resolve, reject) => {
  const video = document.createElement('video');
  
  video.addEventListener('canplaythrough', () => {
    console.log('Video precargado manualmente');
    resolve();
  }, { once: true });
  
  video.addEventListener('error', (error) => {
    console.error('Error al precargar el video:', error);
    // Resolver de todos modos para no bloquear la carga de la aplicación
    resolve();
  }, { once: true });
  
  // Configurar el video para precargar
  video.crossOrigin = 'anonymous'; // Añadir para recursos externos
  video.src = videoUrl;
  video.load();
  video.style.display = 'none';
  video.muted = true;
  
  // Añadir temporalmente al DOM para asegurar la carga
  document.body.appendChild(video);
  
  // Eliminar después de un tiempo
  setTimeout(() => {
    if (document.body.contains(video)) {
      document.body.removeChild(video);
    }
  }, 5000);
};

export default preloadVideo; 
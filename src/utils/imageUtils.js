/**
 * Utilidad para manejar imágenes en dispositivos móviles
 * Reduce el tamaño y calidad de las imágenes para mejorar el rendimiento
 */

// Detecta si el dispositivo es móvil (iPad, iPhone, etc.)
export const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Modifica la ruta de la imagen para dispositivos móviles
export const getMobileOptimizedImagePath = (imagePath) => {
  if (!imagePath) return imagePath;
  
  // Si no es un dispositivo móvil, devuelve la ruta original
  if (!isMobileDevice()) return imagePath;
  
  // Divide la ruta en partes para insertar el sufijo 'mobile'
  const pathParts = imagePath.split('.');
  const extension = pathParts.pop(); // Obtiene la extensión (.webp, .jpg, etc.)
  const basePath = pathParts.join('.'); // Reconstruye el resto de la ruta
  
  // Devuelve la ruta con el sufijo 'mobile' antes de la extensión
  return `${basePath}-mobile.${extension}`;
};

// Función para procesar todos los campos de imagen en un objeto JSON
export const processMobileImages = (item) => {
  if (!item) return item;
  
  // Si no es un dispositivo móvil, devuelve el objeto sin cambios
  if (!isMobileDevice()) return item;
  
  // Crea una copia del objeto para no modificar el original
  const processedItem = { ...item };
  
  // Procesa los campos de imagen comunes
  if (processedItem.thumbnail) {
    processedItem.thumbnail = getMobileOptimizedImagePath(processedItem.thumbnail);
  }
  
  if (processedItem.closeup) {
    processedItem.closeup = getMobileOptimizedImagePath(processedItem.closeup);
  }
  
  if (processedItem.overlay) {
    processedItem.overlay = getMobileOptimizedImagePath(processedItem.overlay);
  }
  
  return processedItem;
};

// Función para procesar una colección completa de elementos
export const processMobileCollection = (collection) => {
  if (!collection || !Array.isArray(collection)) return collection;
  
  // Si no es un dispositivo móvil, devuelve la colección sin cambios
  if (!isMobileDevice()) return collection;
  
  // Procesa cada elemento de la colección
  return collection.map(item => processMobileImages(item));
}; 
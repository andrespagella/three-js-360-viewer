import ambientes from "../data/ambientes.json";
import pinsData from "../data/pins.json";
import getAmbientFilePaths from './getAmbientFilePaths';
import { getMobileOptimizedImagePath, isMobileDevice } from './imageUtils';

/**
 * Preloads a single image and returns a promise that resolves when the image is loaded
 * @param {string} src - The image source URL
 * @returns {Promise} - A promise that resolves when the image is loaded
 */
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(); // Skip if no source
      return;
    }

    // Check if the image is from one of the directories that should use mobile optimization
    const mobileOptimizedDirs = [
      '/ambientes/', 
      '/closeups/', 
      '/overlays/', 
      '/previews/', 
      '/thumbnails/'
    ];
    
    const shouldUseOptimized = mobileOptimizedDirs.some(dir => src.includes(dir));
    
    // Only use mobile optimized path for specific directories
    const imageSrc = (isMobileDevice() && shouldUseOptimized) 
      ? getMobileOptimizedImagePath(src) 
      : src;
    
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(imageSrc);
    img.onerror = () => {
      console.warn(`Failed to load image: ${imageSrc}`);
      resolve(); // Resolve anyway to not block the loading process
    };
  });
};

/**
 * Preloads a collection of images from a JSON file
 * @param {string} collectionPath - Path to the collection JSON file
 * @returns {Promise} - A promise that resolves when all images in the collection are loaded
 */
const preloadCollection = async (collectionPath) => {
  try {
    // Extract collection name from path
    const collectionName = collectionPath.split('/').pop().replace('.json', '');
    
    // Import the collection data
    const module = await import(`../data/collections/${collectionName}.json`);
    const collection = module.default;
    
    if (!Array.isArray(collection)) {
      return;
    }
    
    // Collect all image promises
    const imagePromises = [];
    
    collection.forEach(item => {
      if (item.thumbnail) {
        imagePromises.push(preloadImage(item.thumbnail));
      }
      if (item.closeup) {
        imagePromises.push(preloadImage(item.closeup));
      }
      if (item.overlay) {
        imagePromises.push(preloadImage(item.overlay));
      }
    });
    
    // Wait for all images to load
    await Promise.all(imagePromises);
  } catch (error) {
    console.error(`Error preloading collection: ${collectionPath}`, error);
  }
};

/**
 * Preloads all necessary images for the application
 * @returns {Promise} - A promise that resolves when all images are loaded
 */
const preloadAllImages = async () => {
  const imagePromises = [];
  
  // Preload ambient images (both light and dark modes)
  ambientes.forEach(ambiente => {
    // Light mode
    const lightPaths = getAmbientFilePaths(ambiente, false);
    imagePromises.push(preloadImage(lightPaths.url));
    imagePromises.push(preloadImage(lightPaths.preview));
    
    // Dark mode
    const darkPaths = getAmbientFilePaths(ambiente, true);
    imagePromises.push(preloadImage(darkPaths.url));
    imagePromises.push(preloadImage(darkPaths.preview));
  });
  
  // Preload language selector icons
  imagePromises.push(preloadImage('/icons/es.png'));
  imagePromises.push(preloadImage('/icons/pt.png'));
  imagePromises.push(preloadImage('/icons/en.png'));
  
  // Preload background image
  imagePromises.push(preloadImage('/app-bg.jpg'));
  
  // Preload pin and halo images
  imagePromises.push(preloadImage('/pin.svg'));
  imagePromises.push(preloadImage('/halo.svg'));
  
  // Preload logo images
  imagePromises.push(preloadImage('/isologo-atrim.svg'));
  imagePromises.push(preloadImage('/3d-showcase-logo.svg'));
  
  // Get unique collection paths from pins
  const collectionPaths = new Set();
  pinsData.forEach(pinData => {
    pinData.pins.forEach(pin => {
      if (pin.data) {
        collectionPaths.add(pin.data);
      }
    });
  });
  
  // Preload all collections
  for (const collectionPath of collectionPaths) {
    await preloadCollection(collectionPath);
  }
  
  // Wait for all images to load
  await Promise.all(imagePromises);
  
  return true;
};

export default preloadAllImages; 
import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
// Importar las utilidades de imágenes
import { processMobileImages } from "../utils/imageUtils";

// Importamos los archivos JSON (Vite permite importar JSON por defecto)
import zocalos from "../data/collections/zocalos.json";
import toalleros from "../data/collections/toalleros.json";
import estantes from "../data/collections/estantes.json";
import desagues from "../data/collections/desagues.json";
import vanitories from "../data/collections/vanitories.json";
import cabinets from "../data/collections/cabinets.json";
import wallpanels from "../data/collections/wallpanels.json";
import espejos from "../data/collections/espejos.json";
import perfiles_piso from "../data/collections/perfiles_piso.json";
import perfiles_pared from "../data/collections/perfiles_pared.json";

const TransparentCanvasSphere = ({ baseTexture, darkMode, currentView, selectedItems }) => {
  const canvasTexture = useMemo(() => {
    // Determine canvas dimensions from baseTexture if available, else default to 512
    const defaultWidth = 4096, defaultHeight = 2048; // Aumentar resolución para mejor calidad
    let canvasWidth = defaultWidth;
    let canvasHeight = defaultHeight;

    if (baseTexture && baseTexture.image) {
      canvasWidth = baseTexture.image.width || defaultWidth;
      canvasHeight = baseTexture.image.height || defaultHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    // Limpiamos el canvas para un fondo transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Creamos la textura a partir del canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Configuración correcta para texturas panorámicas equirectangulares
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping; // Evita repetición vertical
    texture.repeat.x = -1; // Invertir horizontalmente
    texture.minFilter = THREE.LinearFilter; // Mejor filtrado
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16; // Mejor calidad en ángulos oblicuos

    // Función para cargar y dibujar una imagen
    const loadAndDrawImage = (src, x, y) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Si es la imagen base (panorámica), asegurarse de que cubra todo el canvas
          if (!x && !y) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } else {
            ctx.drawImage(img, x || 0, y || 0);
          }
          texture.needsUpdate = true;
          resolve();
        };
        img.onerror = () => {
          console.error(`Error loading image: ${src}`);
          resolve(); // Resolve anyway to continue with other images
        };
        img.src = src;
      });
    };

    // Función para obtener el overlay path considerando el modo oscuro
    const getOverlayPath = (item) => {
      return darkMode && item.overlayDark ? item.overlayDark : item.overlay;
    };

    // Función para obtener el item seleccionado de una colección
    const getSelectedItem = (collection, collectionName) => {
      if (!collection || collection.length === 0) return null;
      
      // Usar el índice seleccionado por el usuario o el primero por defecto
      const selectedIndex = selectedItems?.[collectionName] || 0;
      
      // Asegurarse de que el índice es válido
      return collection[Math.min(selectedIndex, collection.length - 1)];
    };

    // Función para cargar un item específico
    const loadItemOverlay = async (item) => {
      if (item && item.overlay) {
        // Procesar el item para obtener la ruta de imagen optimizada para móviles
        const processedItem = processMobileImages(item);
        const overlayPath = getOverlayPath(processedItem);
        await loadAndDrawImage(overlayPath, item.x, item.y);
      }
    };

    // Función para cargar todas las imágenes en secuencia
    const loadAllImages = async () => {
      // 1. Primero dibujamos la textura base si está disponible
      if (baseTexture && baseTexture.image && baseTexture.image.src) {
        await loadAndDrawImage(baseTexture.image.src, 0, 0);
      }

      // 2. Determinamos qué colecciones cargar según el ambiente actual
      const ambienteName = currentView?.name || "";
      
      try {
        // Obtenemos el item seleccionado de cada colección
        const collections = {
          zocalo: getSelectedItem(zocalos, 'zocalos'),
          toallero: getSelectedItem(toalleros, 'toalleros'),
          estante: getSelectedItem(estantes, 'estantes'),
          desague: getSelectedItem(desagues, 'desagues'),
          wallpanel: getSelectedItem(wallpanels, 'wallpanels'),
          vanitory: getSelectedItem(vanitories, 'vanitories'),
          cabinet: getSelectedItem(cabinets, 'cabinets'),
          espejo: getSelectedItem(espejos, 'espejos'),
          perfil_piso: getSelectedItem(perfiles_piso, 'perfiles_piso'),
          perfil_pared: getSelectedItem(perfiles_pared, 'perfiles_pared')
        };
        
        if (ambienteName === "Antebaño" || ambienteName === "Ante baño" || ambienteName === "Antebaño principal") {
          // Para Antebaño, cargamos zócalos, toalleros, vanitories, cabinets y espejos
          await loadItemOverlay(collections.perfil_piso);
          await loadItemOverlay(collections.wallpanel);
          await loadItemOverlay(collections.perfil_pared);
          await loadItemOverlay(collections.zocalo);
          await loadItemOverlay(collections.toallero);
          await loadItemOverlay(collections.vanitory);
          await loadItemOverlay(collections.cabinet);
          await loadItemOverlay(collections.espejo);
        } 
        else if (ambienteName === "Baño" || ambienteName === "Baño principal") {
          // Para Baño, cargamos estantes, desagües, vanitories, cabinets y espejos
          await loadItemOverlay(collections.estante);
          await loadItemOverlay(collections.desague);
        }
        // Para otros ambientes, no cargamos overlays específicos
      } catch (error) {
        console.error(`Error cargando colecciones para ${ambienteName}:`, error);
      }
    };

    // Iniciamos la carga de imágenes
    loadAllImages();

    return texture;
  }, [baseTexture, darkMode, currentView, selectedItems]);

  // Usar el mismo tamaño que la otra esfera (500)
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial
        map={canvasTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default TransparentCanvasSphere;
import React, { useMemo, useEffect } from "react";
import * as THREE from "three";

// Importamos los archivos JSON (Vite permite importar JSON por defecto)
import zocalos from "../data/collections/zocalos.json";
import toalleros from "../data/collections/toalleros.json";
import estantes from "../data/collections/estantes.json";
import desagues from "../data/collections/desagues.json";
import vanitories from "../data/collections/vanitories.json";
import cabinets from "../data/collections/cabinets.json";
import espejos from "../data/collections/espejos.json";
import perfiles_piso from "../data/collections/perfiles_piso.json";

const TransparentCanvasSphere = ({ baseTexture, darkMode, currentView }) => {
  const canvasTexture = useMemo(() => {
    // Determine canvas dimensions from baseTexture if available, else default to 512
    const defaultWidth = 2048, defaultHeight = 1024;
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
    // Invertir la textura horizontalmente para que coincida con la orientación de la textura base
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // Función para cargar y dibujar una imagen
    const loadAndDrawImage = (src, x, y) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.drawImage(img, x || 0, y || 0);
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

    // Función para cargar un item específico
    const loadItemOverlay = async (item) => {
      if (item && item.overlay) {
        const overlayPath = getOverlayPath(item);
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
        // Obtenemos el primer item de cada colección
        const collections = {
          zocalo: zocalos && zocalos.length > 0 ? zocalos[0] : null,
          toallero: toalleros && toalleros.length > 0 ? toalleros[0] : null,
          estante: estantes && estantes.length > 0 ? estantes[0] : null,
          desague: desagues && desagues.length > 0 ? desagues[0] : null,
          vanitory: vanitories && vanitories.length > 0 ? vanitories[0] : null,
          cabinet: cabinets && cabinets.length > 0 ? cabinets[0] : null,
          espejo: espejos && espejos.length > 0 ? espejos[0] : null,
          perfil_piso: perfiles_piso && perfiles_piso.length > 0 ? perfiles_piso[0] : null
        };
        
        if (ambienteName === "Antebaño" || ambienteName === "Ante baño" || ambienteName === "Antebaño principal") {
          // Para Antebaño, cargamos zócalos, toalleros, vanitories, cabinets y espejos
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
  }, [baseTexture, darkMode, currentView]);

  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
      <sphereGeometry args={[498, 60, 40]} />
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
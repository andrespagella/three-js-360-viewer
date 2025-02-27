import React, { useState, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import useIsMobile from "../hooks/useIsMobile";

const CollectionPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded, selectedItems }) => {
  const isMobile = useIsMobile();
  const [thumbnails, setThumbnails] = useState({});

  const allPins = pinsData.reduce((acc, ambienteItem) => {
    const ambienteName = ambienteItem.ambiente;
    const pinsWithAmbiente = ambienteItem.pins.map((pin) => ({ ...pin, ambiente: ambienteName }));
    return [...acc, ...pinsWithAmbiente];
  }, []);

  // Para CollectionPanel: usar "bottom" en mobile y "right" en escritorio
  const anchor = isMobile ? "bottom" : "right";
  const transformStyle = getTransformStyle(anchor, panelExpanded);

  const panelClasses = `fixed z-40 transition-transform duration-300 bg-white text-black overflow-auto shadow-sm ${
    isMobile ? "bottom-0 right-0 w-full h-64" : "top-15 right-0 h-full w-64"
  }`;

  // Cargar los thumbnails desde los archivos JSON
  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbnailsData = {};
      
      for (const pin of allPins) {
        if (pin.data) {
          try {
            // Importar dinámicamente los archivos JSON desde src/data
            const collectionModule = await import(/* @vite-ignore */ `../${pin.data}`);
            const collectionData = collectionModule.default;
            
            if (collectionData && collectionData.length > 0 && collectionData[0].thumbnail) {
              thumbnailsData[pin.id] = collectionData[0].thumbnail;
            } else {
              thumbnailsData[pin.id] = '/default-thumbnail.svg';
            }
          } catch (error) {
            console.warn(`Error loading thumbnail for pin ${pin.id}:`, error);
            thumbnailsData[pin.id] = '/default-thumbnail.jpg';
          }
        }
      }
      
      setThumbnails(thumbnailsData);
    };
    
    loadThumbnails();
  }, [allPins]);

  // Función para obtener el thumbnail para un pin específico
  const getThumbnailForPin = (pin) => {
    if (thumbnails[pin.id]) {
      return thumbnails[pin.id];
    }
    
    // Fallback mientras se cargan los thumbnails
    return '/default-thumbnail.jpg';
  };

  return (
    <div className={panelClasses} style={{ transform: transformStyle }}>
      <div className="p-4">
        <div>
          <h3 className="text-sm font-semibold">Colección</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {allPins.map((pin, index) => {
              const thumbnailUrl = getThumbnailForPin(pin);
              
              return (
                <button
                  key={index}
                  className="relative cursor-pointer w-full aspect-square bg-cover bg-center rounded shadow-md overflow-hidden"
                  style={{ backgroundImage: `url(${thumbnailUrl})` }}
                  onClick={() => {
                    if (onSelectAmbiente) {
                      const ambienteObj = ambientes.find((amb) => amb.name === pin.ambiente);
                      if (ambienteObj) {
                        onSelectAmbiente(ambienteObj);
                      }
                    }
                    onSelectPin && onSelectPin(pin);
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                    <span className="w-full text-center text-white text-xs p-2 bg-black bg-opacity-50">
                      {pin.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPanel;
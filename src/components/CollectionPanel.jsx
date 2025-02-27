import React, { useState, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import useIsMobile from "../hooks/useIsMobile";
import { useTheme } from "../context/ThemeContext";

const CollectionPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded, selectedItems }) => {
  const isMobile = useIsMobile();
  const [thumbnails, setThumbnails] = useState({});
  const { theme } = useTheme();

  const allPins = pinsData.reduce((acc, ambienteItem) => {
    const ambienteName = ambienteItem.ambiente;
    const pinsWithAmbiente = ambienteItem.pins.map((pin) => ({ ...pin, ambiente: ambienteName }));
    return [...acc, ...pinsWithAmbiente];
  }, []);

  // Para CollectionPanel: usar "bottom" en mobile y "right" en escritorio
  const anchor = isMobile ? "bottom" : "right";
  const transformStyle = getTransformStyle(anchor, panelExpanded);

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
            
            // Extraer el nombre de la colección del path del archivo
            const collectionName = pin.data.split('/').pop().replace('.json', '');
            
            // Usar el índice seleccionado de selectedItems si existe, de lo contrario usar 0
            const selectedIndex = selectedItems[collectionName] || 0;
            
            if (collectionData && collectionData.length > 0) {
              // Usar el elemento en el índice seleccionado, o el primero si el índice no es válido
              const selectedItem = collectionData[selectedIndex] || collectionData[0];
              if (selectedItem.thumbnail) {
                thumbnailsData[pin.id] = selectedItem.thumbnail;
              } else {
                thumbnailsData[pin.id] = '/default-thumbnail.svg';
              }
            } else {
              thumbnailsData[pin.id] = '/default-thumbnail.svg';
            }
          } catch (error) {
            console.error(`Error cargando thumbnails para ${pin.id}:`, error);
            thumbnailsData[pin.id] = '/default-thumbnail.svg';
          }
        }
      }
      
      setThumbnails(thumbnailsData);
    };
    
    loadThumbnails();
  }, [allPins, selectedItems]);

  return (
    <div 
      className={`fixed z-40 transition-transform duration-300 overflow-auto shadow-sm ${
        isMobile ? "bottom-0 right-0 w-full h-64" : "top-[57px] right-0 h-[calc(100%-57px)] w-80"
      }`}
      style={{ 
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        borderLeft: isMobile ? 'none' : `1px solid ${theme.border.light}`,
        borderTop: isMobile ? `1px solid ${theme.border.light}` : 'none',
        transform: transformStyle,
        boxShadow: '-4px 5px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="p-4">
        <h2 style={{ color: theme.text.primary }} className="text-lg font-semibold mb-4">Colección</h2>
        <div className="grid grid-cols-2 gap-4 pb-16">
          {allPins.map((pin) => (
            <div
              key={pin.id}
              onClick={() => {
                onSelectAmbiente(ambientes.find(a => a.name === pin.ambiente));
                onSelectPin(pin);
              }}
              className="cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              style={{ border: `1px solid ${theme.border.light}` }}
            >
              <div className="relative">
                <img
                  src={thumbnails[pin.id] || '/default-thumbnail.svg'}
                  alt={pin.title || 'Thumbnail'}
                  className="w-full h-24 object-cover"
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 p-1 text-xs font-bold text-center"
                  style={{ 
                    backgroundColor: theme.background.secondary,
                    color: theme.text.primary
                  }}
                >
                  {pin.label || 'Sin título'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPanel;
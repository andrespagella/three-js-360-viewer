import React, { useState, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import useIsMobile from "../hooks/useIsMobile";
import { useTheme } from "../context/ThemeContext";
import { FixedSizeGrid } from 'react-window';
import { processMobileCollection } from "../utils/imageUtils";

const CollectionPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded, selectedItems }) => {
  const isMobile = useIsMobile();
  const [thumbnails, setThumbnails] = useState({});
  const { theme } = useTheme();
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            let collectionData = collectionModule.default;
            
            // Procesar la colección para dispositivos móviles
            collectionData = processMobileCollection(collectionData);
            
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

  // Calcular la altura disponible para el grid
  const gridHeight = isMobile ? 220 : window.innerHeight - 110; // Ajustar para que ocupe todo el espacio disponible

  return (
    <div 
      className={`fixed z-40 transition-transform duration-300 overflow-hidden shadow-sm ${
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
      <div className="h-full">
        <h2 style={{ color: theme.text.primary }} className="text-lg font-semibold mt-2 mb-2 px-2">Colección</h2>

        <FixedSizeGrid
          columnCount={2}
          columnWidth={140}
          height={gridHeight}
          rowCount={Math.ceil(allPins.length / 2)}
          rowHeight={130}
          width={300}
          itemData={allPins}
          className="mx-auto"
          style={{ overflowX: 'hidden' }}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * 2 + columnIndex;
            if (index >= allPins.length) return null;
            const pin = allPins[index];
            
            // Modificar el estilo para añadir margen entre elementos
            const adjustedStyle = {
              ...style,
              left: parseInt(style.left) + 5,
              top: parseInt(style.top) + 5,
              width: parseInt(style.width) - 10,
              height: parseInt(style.height) - 10,
            };
            
            return (
              <div style={adjustedStyle}>
                <div
                  onClick={() => {
                    onSelectAmbiente(ambientes.find(a => a.name === pin.ambiente));
                    onSelectPin(pin);
                  }}
                  className="cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full"
                  style={{ border: `1px solid ${theme.border.light}` }}
                >
                  <div className="relative h-full flex flex-col">
                    <img
                      src={thumbnails[pin.id] || '/default-thumbnail.svg'}
                      alt={pin.title || 'Thumbnail'}
                      className="w-full h-20 object-cover"
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
              </div>
            );
          }}
        </FixedSizeGrid>
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Cargando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPanel;
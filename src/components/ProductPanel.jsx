import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import useIsMobile from "../hooks/useIsMobile";
import { useTheme } from "../context/ThemeContext";
import { processMobileCollection } from "../utils/imageUtils";
import { useTranslation } from "react-i18next";

// Caché global para almacenar colecciones ya cargadas
const collectionsCache = {};

const ProductPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded, selectedItems, collectionsOrder = [] }) => {
  const isMobile = useIsMobile();
  const [thumbnails, setThumbnails] = useState({});
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const loadingTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Memoizar y ordenar los pins según collectionsOrder
  const orderedPins = useMemo(() => {
    // Obtener todos los pins con su ambiente
    const allPins = pinsData.reduce((acc, ambienteItem) => {
      const ambienteName = ambienteItem.ambiente;
      const pinsWithAmbiente = ambienteItem.pins.map((pin) => ({ ...pin, ambiente: ambienteName }));
      return [...acc, ...pinsWithAmbiente];
    }, []);

    // Si no hay orden personalizado, devolver los pins sin ordenar
    if (!collectionsOrder || collectionsOrder.length === 0) {
      return allPins;
    }

    // Crear un mapa de prioridad basado en el orden de las colecciones
    const collectionPriority = collectionsOrder.reduce((acc, collection, index) => {
      acc[collection] = index;
      return acc;
    }, {});

    // Ordenar los pins según la prioridad de las colecciones
    return [...allPins].sort((a, b) => {
      if (!a.data && !b.data) return 0;
      if (!a.data) return 1;
      if (!b.data) return -1;

      const collectionA = a.data.split('/').pop().replace('.json', '');
      const collectionB = b.data.split('/').pop().replace('.json', '');

      // Si ambas colecciones están en la lista de prioridad, ordenar según esa prioridad
      if (collectionPriority[collectionA] !== undefined && collectionPriority[collectionB] !== undefined) {
        return collectionPriority[collectionA] - collectionPriority[collectionB];
      }

      // Si solo una está en la lista, priorizarla
      if (collectionPriority[collectionA] !== undefined) return -1;
      if (collectionPriority[collectionB] !== undefined) return 1;

      // Si ninguna está en la lista, mantener el orden original
      return 0;
    });
  }, [pinsData, collectionsOrder]);

  // Para ProductPanel: usar "bottom" en mobile y "right" en escritorio
  const anchor = isMobile ? "bottom" : "right";
  const transformStyle = getTransformStyle(anchor, panelExpanded);

  // Efecto para controlar la visibilidad del panel
  useEffect(() => {
    if (panelExpanded) {
      // Retrasar la visibilidad para permitir que la animación de apertura termine primero
      setTimeout(() => {
        setIsVisible(true);
      }, 300); // 300ms es la duración de la animación de transform
    } else {
      setIsVisible(false);
    }
  }, [panelExpanded]);

  // Función memoizada para cargar un solo JSON
  const loadSingleCollection = useCallback(async (pinData) => {
    if (!pinData) return null;
    
    // Extraer el nombre de la colección del path del archivo
    const collectionName = pinData.split('/').pop().replace('.json', '');
    
    // Si ya está en caché, usar la versión cacheada
    if (collectionsCache[collectionName]) {
      return {
        data: collectionsCache[collectionName],
        name: collectionName
      };
    }
    
    try {
      // Importar el módulo directamente usando dynamic import
      // Esto funciona mejor con Vite que intentar construir URLs manualmente
      const module = await import(`../data/collections/${collectionName}.json`);
      let collectionData = module.default;
      
      // Procesar la colección para dispositivos móviles
      collectionData = processMobileCollection(collectionData);
      
      // Guardar en caché
      collectionsCache[collectionName] = collectionData;
      
      return {
        data: collectionData,
        name: collectionName
      };
    } catch (error) {
      console.error(`Error cargando colección ${collectionName}:`, error);
      return null;
    }
  }, []);

  // Cargar los thumbnails de forma optimizada
  useEffect(() => {
    // Si el panel no está expandido o no es visible, no cargar nada
    if (!panelExpanded || !isVisible) return;
    
    // Evitar múltiples cargas simultáneas
    if (isLoadingRef.current) return;
    
    const loadThumbnails = async () => {
      isLoadingRef.current = true;
      setIsLoading(true);
      
      // Usar un timeout para mostrar el indicador de carga solo si tarda más de 300ms
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 300);
      
      const thumbnailsData = { ...thumbnails };
      // Reducir el tamaño del lote en dispositivos móviles
      const batchSize = isMobile ? 1 : 3; // 1 para móviles, 3 para escritorio
      
      // Filtrar pins que aún no tienen thumbnail
      const pinsToLoad = orderedPins.filter(pin => 
        pin.data && !thumbnailsData[pin.id]
      );
      
      // Cargar en lotes pequeños
      for (let i = 0; i < pinsToLoad.length; i += batchSize) {
        const batch = pinsToLoad.slice(i, i + batchSize);
        
        // Usar Promise.all para cargar varios en paralelo, pero limitado al tamaño del lote
        const results = await Promise.all(
          batch.map(async (pin) => {
            try {
              const collection = await loadSingleCollection(pin.data);
              if (!collection) return { pin, thumbnail: '/default-thumbnail.svg' };
              
              // Usar el índice seleccionado de selectedItems
              const selectedIndex = selectedItems[collection.name] || 0;
              
              if (collection.data && collection.data.length > 0) {
                const selectedItem = collection.data[selectedIndex] || collection.data[0];
                return {
                  pin,
                  thumbnail: selectedItem.thumbnail || '/default-thumbnail.svg'
                };
              }
              
              return { pin, thumbnail: '/default-thumbnail.svg' };
            } catch (error) {
              console.error(`Error cargando thumbnail para ${pin.id}:`, error);
              return { pin, thumbnail: '/default-thumbnail.svg' };
            }
          })
        );
        
        // Actualizar el estado con los resultados de este lote
        results.forEach(result => {
          thumbnailsData[result.pin.id] = result.thumbnail;
        });
        
        // Actualizar el estado después de cada lote para mostrar progreso
        setThumbnails({ ...thumbnailsData });
        
        // Pausa más larga en dispositivos móviles
        if (i + batchSize < pinsToLoad.length) {
          await new Promise(resolve => setTimeout(resolve, isMobile ? 50 : 10));
        }
      }
      
      // Limpiar el timeout y el estado de carga
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      setIsLoading(false);
      isLoadingRef.current = false;
    };
    
    loadThumbnails();
    
    // Limpiar el timeout si el componente se desmonta
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [panelExpanded, isVisible, orderedPins, loadSingleCollection, selectedItems, thumbnails, isMobile]);

  // Función memoizada para manejar el clic en un pin
  const handlePinClick = useCallback((pin) => {
    return () => {
      onSelectAmbiente(ambientes.find(a => a.name === pin.ambiente));
      onSelectPin(pin);
    };
  }, [onSelectAmbiente, onSelectPin, ambientes]);

  return (
    <div 
      className={`fixed transition-transform duration-300 overflow-hidden shadow-sm ${
        isMobile ? "bottom-0 right-0 w-full h-[calc(100%-57px)] z-[90]" : "top-[57px] right-0 h-[calc(100%-57px)] w-80 z-40"
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
      <div className="h-full flex flex-col">
        <div 
          className="flex-1 overflow-y-auto pt-2 px-2"
          style={{ overflowX: 'hidden' }}
        >
          {isVisible ? (
            <div className="grid grid-cols-2 gap-2 auto-rows-max">
              {orderedPins.map((pin, index) => (
                <div 
                  key={`pin-${pin.id}-${index}`}
                  onClick={handlePinClick(pin)}
                  className="cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition-shadow h-[120px]"
                  style={{ border: `1px solid ${theme.border.light}` }}
                >
                  <div className="relative h-full flex flex-col">
                    <img
                      src={thumbnails[pin.id] || '/default-thumbnail.svg'}
                      alt={pin.title || 'Thumbnail'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-1 text-xs font-bold text-center"
                      style={{ 
                        backgroundColor: theme.background.secondary,
                        color: theme.text.primary
                      }}
                    >
                      {pin.label ? t(pin.label) : 'Sin título'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: theme.text.secondary }}>{t('collections.loading', 'Cargando productos...')}</p>
            </div>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <p>{t('collections.loading', 'Cargando...')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPanel; 
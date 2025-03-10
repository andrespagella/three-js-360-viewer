import React, { useState, useEffect, useRef } from "react";
import ViewerHeader from "./ViewerHeader";
import { useTheme } from "../context/ThemeContext";
import { processMobileCollection } from "../utils/imageUtils";
import useIsMobile from "../hooks/useIsMobile";
import { useTranslation } from "react-i18next";

const CloseupViewer = ({ closeup, onClose }) => {
  const { t, i18n } = useTranslation();
  const { file: closeupFile, collection: defaultCollection, selectedIndex: initialIndex = 0 } = closeup;
  const [currentCollection, setCurrentCollection] = useState(defaultCollection || "inodoros");
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const { theme } = useTheme();
  const [intermediateScreen, setIntermediateScreen] = useState(false);
  const [transitionState, setTransitionState] = useState('normal'); // 'normal', 'transitioning', 'loading'
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Dynamically import the JSON file based on the currentCollection state
    import(`../data/collections/${currentCollection}.json`)
      .then(module => {
        let data = module.default;
        
        // Procesar la colección para dispositivos móviles
        data = processMobileCollection(data);
        
        setProducts(data);
        
        // Si se proporciona un índice inicial, usarlo
        if (initialIndex !== undefined && initialIndex < data.length) {
          setSelectedIndex(initialIndex);
        } 
        // Si no, intentar encontrar el producto por su closeup
        else if (closeupFile) {
          const foundIndex = data.findIndex(product => product.closeup === closeupFile);
          if (foundIndex !== -1) {
            setSelectedIndex(foundIndex);
          } else {
            setSelectedIndex(0);
          }
        } else {
          setSelectedIndex(0);
        }
      })
      .catch(err => {
        console.error(`Error loading JSON for collection ${currentCollection}:`, err);
      });
  }, [currentCollection, closeupFile, initialIndex]);

  const handleCollectionChange = (newCollection) => {
    if (newCollection !== currentCollection) {
      setCurrentCollection(newCollection);
      setSelectedIndex(0);
    }
  };

  // Prevenir el comportamiento de arrastre (drag) en las imágenes
  const preventDragHandler = (e) => {
    e.preventDefault();
    return false;
  };

  if (products.length === 0) {
    return <div>Cargando...</div>;
  }

  const selectedProduct = products[selectedIndex];

  const handleCloseCloseup = (collection, selectedIndex) => {
    console.log("1. Inicio de handleCloseCloseup");
    
    // Actualizar selecciones
    if (collection && selectedIndex !== undefined) {
      setSelectedIndex(selectedIndex);
    }
    
    // Verificar si es dispositivo móvil (iOS o Android)
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isMobileDevice = isTouchDevice && !window.MSStream;
    
    if (isMobileDevice) {
      // En dispositivos móviles, primero cambiar a un estado de transición
      console.log("Cambiando a estado de transición");
      setTransitionState('transitioning');
      
      // Luego cerrar el closeup
      setTimeout(() => {
        console.log("Cerrando closeup");
        onClose(collection, selectedIndex);
        
        // Finalmente, después de un breve retraso, volver al estado normal
        setTimeout(() => {
          console.log("Volviendo a estado normal");
          setTransitionState('normal');
        }, 300);
      }, 50);
    } else {
      // En otros dispositivos, comportamiento normal
      onClose(collection, selectedIndex);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-10 flex p-0 m-0"
      onDragStart={preventDragHandler}
      onDragOver={preventDragHandler}
      onDragEnd={preventDragHandler}
      onDrop={preventDragHandler}
    >
      {/* Contenedor de la imagen principal - exactamente 2/3 del ancho */}
      <div className="relative w-2/3 h-full p-0 m-0">
        <img 
          src={selectedProduct.closeup} 
          alt={selectedProduct.descripcion} 
          className="w-full h-full object-cover" 
          draggable="false"
          onDragStart={preventDragHandler}
        />
        
        {/* Botón Vista Principal - pegado al borde izquierdo */}
        <button
          onClick={() => handleCloseCloseup(currentCollection, selectedIndex)}
          className="absolute top-20 left-[10px] bg-black text-white px-4 py-2 text-sm font-bold rounded-md"
        >
          {t('buttons.back', 'Vista principal')}
        </button>

        {/* Contenedor principal de la galería - pegado completamente al borde inferior */}
        <div className="absolute bottom-0 left-0 right-0 w-full m-0 p-0" style={{ 
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.0)'
        }}>
          {/* Eliminar todos los paddings excepto un poco arriba */}
          <div className="pt-2 pb-2 px-0 m-0 w-full">
            {/* Contenedor de desplazamiento - centrado horizontalmente */}
            <div className="flex overflow-x-auto m-0 p-0 w-full justify-center" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className="relative flex-shrink-0"
                  style={{ 
                    padding: '3px',
                    marginLeft: index === 0 ? '0' : '8px' // Espacio entre items, pero no al inicio
                  }}
                >
                  <div 
                    className="w-28 h-28 relative cursor-pointer rounded-[10px] overflow-hidden"
                    onClick={() => setSelectedIndex(index)}
                    style={index === selectedIndex ? 
                      { 
                        border: `3px solid ${theme.accent.primary}`,
                        boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.5)'
                      } : 
                      { 
                        border: '1px solid rgba(0,0,0,0.2)',
                        boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.5)' 
                      }
                  }
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.descripcion}
                      className="absolute w-full h-full object-cover"
                      draggable="false"
                      onDragStart={preventDragHandler}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Panel lateral - exactamente 1/3 del ancho y pegado al borde derecho */}
      <div 
        className="w-1/3 p-6 overflow-y-auto m-0"
        style={{ 
          backgroundColor: theme.background.primary,
          color: theme.text.primary,
          borderLeft: `1px solid ${theme.border.light}`,
          boxShadow: '-4px 5px 6px -1px rgba(0, 0, 0, 0.2)',
          marginTop: '57px',
          height: 'calc(100% - 57px)'
        }}
      >
        <h2 
          className="text-xl font-bold"
          style={{ color: theme.text.primary }}
        >
          {selectedProduct.producto.toUpperCase()}
        </h2>
        
        {selectedProduct.SKU && (
          <p 
            className="text-sm mb-4"
            style={{ color: theme.text.tertiary }}
          >
            SKU: {selectedProduct.SKU}
          </p>
        )}

        {selectedProduct.descripcion && (
          <p className="text-base mb-10">
            {selectedProduct.descripcion[i18n.language] || selectedProduct.descripcion.es}
          </p>
        )}

        <h3 className="text-lg font-bold mb-3">{t('product.details')}</h3>
        
        {selectedProduct.ficha ? (
          <div className="w-full">
            <table className="w-full border-collapse border border-black">
              <tbody>
                {Object.entries(selectedProduct.ficha).map(([key, value]) => {
                  // Ignorar propiedades que no deberían mostrarse o están vacías
                  if (!value || typeof value === 'object' && !Array.isArray(value)) return null;
                  
                  // Formatear el valor si es un array
                  const displayValue = Array.isArray(value) ? value.join(" x ") : value;
                  
                  // Obtener la clave de traducción
                  const translationKey = key;
                  
                  // Verificar si el valor comienza con "ficha." para usar traducción
                  const finalDisplayValue = typeof displayValue === 'string' && displayValue.startsWith('ficha.') 
                    ? t(displayValue, displayValue.substring(6)) // Eliminar "ficha." del inicio para mostrar como fallback
                    : displayValue;
                  
                  return (
                    <tr key={key} style={{ borderBottom: `1px solid black` }}>
                      <td 
                        className="py-2 px-3 font-bold border border-black align-top" 
                        style={{ color: theme.text.primary, width: "40%" }}
                      >
                        {t(translationKey, key)}
                      </td>
                      <td 
                        className="py-2 px-3 border border-black align-top text-sm" 
                        style={{ color: theme.text.secondary }}
                      >
                        {finalDisplayValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: theme.text.tertiary }}>{t('product.noInfo', 'No hay información disponible.')}</p>
        )}
      </div>

      {transitionState === 'transitioning' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
          <div className="text-white text-xl">{t('collections.loading', 'Cargando vista principal...')}</div>
        </div>
      )}
    </div>
  );
};

export default CloseupViewer;
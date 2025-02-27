import React, { useState, useEffect } from "react";
import ViewerHeader from "./ViewerHeader";
import { useTheme } from "../context/ThemeContext";

const CloseupViewer = ({ closeup, onClose }) => {
  const { file: closeupFile, collection: defaultCollection, selectedIndex: initialIndex = 0 } = closeup;
  const [currentCollection, setCurrentCollection] = useState(defaultCollection || "inodoros");
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const { theme } = useTheme();
  const [intermediateScreen, setIntermediateScreen] = useState(false);
  const [transitionState, setTransitionState] = useState('normal'); // 'normal', 'transitioning', 'loading'

  useEffect(() => {
    // Dynamically import the JSON file based on the currentCollection state
    import(`../data/collections/${currentCollection}.json`)
      .then(module => {
        const data = module.default;
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
    
    // Verificar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
      // En iOS, primero cambiar a un estado de transición
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
      className="fixed inset-0 z-10 flex"
      onDragStart={preventDragHandler}
      onDragOver={preventDragHandler}
      onDragEnd={preventDragHandler}
      onDrop={preventDragHandler}
    >
      <div className="relative flex-1">
        <img 
          src={selectedProduct.closeup} 
          alt={selectedProduct.descripcion} 
          className="w-full h-full object-cover" 
          draggable="false"
          onDragStart={preventDragHandler}
        />
        <button
          onClick={() => handleCloseCloseup(currentCollection, selectedIndex)}
          className="absolute top-20 left-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          Vista principal
        </button>

        {/* Contenedor principal de la galería de thumbnails */}
        <div className="absolute bottom-0 left-0 w-full" style={{ bottom: '-10px' }}>
          {/* Contenedor con padding adicional para las sombras */}
          <div className="px-4 pt-4 pb-6">
            {/* Contenedor de desplazamiento con overflow visible para las sombras */}
            <div className="flex space-x-4 overflow-x-auto" style={{ paddingBottom: '8px' }}>
              {products.map((product, index) => (
                <div 
                  key={index} 
                  className="relative"
                  style={{ padding: '3px' }} // Espacio para la sombra
                >
                  <div 
                    className="w-32 h-32 relative cursor-pointer rounded-[10px] overflow-hidden"
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
      
      <div 
        className="w-1/3 p-6 overflow-y-auto"
        style={{ 
          backgroundColor: theme.background.primary,
          color: theme.text.primary,
          borderLeft: `1px solid ${theme.border.light}`,
          boxShadow: '-4px 5px 6px -1px rgba(0, 0, 0, 0.2)',
          marginTop: '57px', // Ajustado para separarlo del top como las otras sidebars
          height: 'calc(100% - 57px)' // Ajustar la altura para que no sobrepase la pantalla
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

        <h3 className="text-lg font-bold mb-3">Ficha Técnica</h3>
        
        {selectedProduct.ficha ? (
          <div className="w-full">
            <table className="w-full border-collapse border border-black">
              <tbody>
                {Object.entries(selectedProduct.ficha).map(([key, value]) => {
                  // Ignorar propiedades que no deberían mostrarse o están vacías
                  if (!value || typeof value === 'object' && !Array.isArray(value)) return null;
                  
                  // Formatear el valor si es un array
                  const displayValue = Array.isArray(value) ? value.join(", ") : value;
                  
                  // Capitalizar la primera letra de la clave
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  
                  return (
                    <tr key={key} style={{ borderBottom: `1px solid black` }}>
                      <td 
                        className="py-2 px-3 font-bold border border-black align-top" 
                        style={{ color: theme.text.primary, width: "40%" }}
                      >
                        {label}
                      </td>
                      <td 
                        className="py-2 px-3 border border-black align-top text-sm" 
                        style={{ color: theme.text.secondary }}
                      >
                        {displayValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: theme.text.tertiary }}>No hay información disponible.</p>
        )}
      </div>

      {transitionState === 'transitioning' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
          <div className="text-white text-xl">Cargando vista principal...</div>
        </div>
      )}
    </div>
  );
};

export default CloseupViewer;
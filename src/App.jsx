import { useState, useEffect, useRef } from "react";
import Three360Viewer from "./components/Three360Viewer";
import Sidebar from "./components/Sidebar";
import CloseupViewer from "./components/CloseupViewer";
import ProductPanel from "./components/ProductPanel";
import LanguageSelector from "./components/LanguageSelector";
import PreloadingScreen from "./components/PreloadingScreen";
import Screensaver from "./components/Screensaver";
import ContactFormOverlay from "./components/ContactFormOverlay";
import ambientes from "./data/ambientes.json";
import pinsData from "./data/pins.json";
import getAmbientFilePaths from './utils/getAmbientFilePaths';
import preloadAllImages from './utils/preloadImages';
import preloadVideo from './utils/preloadVideo';
import ViewerHeader from "./components/ViewerHeader";
import ThemeUpdater from "./components/ThemeUpdater";
import { useTheme } from "./context/ThemeContext";
import { processMobileCollection } from "./utils/imageUtils";
import useIdleTimer from "./hooks/useIdleTimer";
import config from "./utils/config";
import { useTranslation } from "react-i18next";

// Componente interno que usa el contexto del agente conversacional
const AppContent = () => {
  const { t } = useTranslation();
  const developmentMode = false; // Flag para activar el overlay de desarrollo
  const [language, setLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  
  // Referencia para rastrear si el formulario ya ha sido enviado
  const formSubmittedRef = useRef(false);

  // Detectar si el parámetro bigscreen=true está presente en la URL
  const [isBigScreen, setIsBigScreen] = useState(false);
  
  // Efecto para detectar el parámetro bigscreen en la URL al cargar la aplicación
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bigscreen = urlParams.get('bigscreen');
    setIsBigScreen(bigscreen === 'true');
    
    // Nota: El parámetro bigscreen=true controla si la aplicación se inicia en modo pantalla completa
    // cuando el usuario selecciona un idioma en la pantalla inicial.
    
    // Nota: El parámetro slow=true también es soportado y hace que se carguen
    // imágenes optimizadas para móviles (más pequeñas) incluso en dispositivos de escritorio.
    // Esta lógica se maneja en src/utils/imageUtils.js
  }, []);

  // Screensaver state
  const { isIdle, resetIdleState } = useIdleTimer(config.idleTimeout); // Usar el tiempo de inactividad desde config

  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [collectionPanelExpanded, setCollectionPanelExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPin, setSelectedPin] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado para controlar la visibilidad del formulario de contacto
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Estado para contar cuántos cambios ha realizado el usuario
  const [changesCount, setChangesCount] = useState(0);

  // Añadir un nuevo estado para almacenar las selecciones del usuario
  const [selectedItems, setSelectedItems] = useState({
    zocalos: 0,
    toalleros: 0,
    estantes: 0,
    desagues: 0,
    vanitories: 0,
    cabinets: 0,
    espejos: 0,
    perfiles_piso: 0
  });

  // Nuevo estado para almacenar los datos del formulario
  const [pendingFormData, setPendingFormData] = useState(null);

  // Efecto para reiniciar la referencia de formulario enviado cuando el usuario vuelve a estar activo
  useEffect(() => {
    if (!isIdle && formSubmittedRef.current) {
      console.log('Usuario activo de nuevo, reiniciando referencia de formulario enviado');
      formSubmittedRef.current = false;
    }
  }, [isIdle]);

  // Preload all images when the component mounts
  useEffect(() => {
    const loadAllAssets = async () => {
      try {
        // Determinar si es un dispositivo móvil
        const isMobileDevice = window.innerWidth < 768;
        
        // Precargar imágenes siempre
        await preloadAllImages();
        
        // Precargar el video del screensaver solo en dispositivos no móviles
        if (!isMobileDevice) {
          await preloadVideo('https://atrim3dshowcase-storage.s3.us-east-1.amazonaws.com/video-back_2880x2160.webm');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error preloading assets:", error);
        
        // Even if there's an error, we should still allow the user to proceed
        setIsLoading(false);
      }
    };

    loadAllAssets();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentPins =
    pinsData.find((p) => p.ambiente === currentView.name)?.pins || [];

  const handleViewClick = (view) => {
    setCurrentView(view);
    setMenuExpanded(false);
  };

  // Actualizamos la función para seleccionar un pin.
  // Se carga el archivo JSON indicado en el atributo "data",
  // se toma el elemento seleccionado según selectedItems y se usa su propiedad "closeup".
  const handleSelectPin = async (pin) => {
    try {
      // Extraer el nombre de la colección del path del archivo
      const collectionName = pin.data.split('/').pop().replace('.json', '');
      
      // Importar el módulo directamente usando dynamic import
      const module = await import(`./data/collections/${collectionName}.json`);
      let jsonData = module.default;
  
      // Procesar la colección para dispositivos móviles
      jsonData = processMobileCollection(jsonData);

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        // Usar el índice seleccionado de selectedItems si existe, de lo contrario usar 0
        const selectedIndex = selectedItems[collectionName] || 0;
        
        // Usar el elemento en el índice seleccionado, o el primero si el índice no es válido
        const selectedItem = jsonData[selectedIndex] || jsonData[0];
        
        const updatedPin = { 
          ...pin, 
          closeup: selectedItem.closeup, 
          collection: collectionName,
          selectedIndex: selectedIndex
        };
        
        setSelectedPin(updatedPin);
      }
    } catch (error) {
      console.error("Error al cargar el archivo de datos del pin:", error);
    }
  };

  // Función que abre el closeup utilizando la imagen obtenida del JSON.
  const handleOpenCloseup = () => {
    // En dispositivos móviles, cerrar los paneles antes de abrir el closeup
    if (isMobile) {
      setMenuExpanded(false);
      setCollectionPanelExpanded(false);
    }
    
    setZooming(true);
    setTimeout(() => {
      if (selectedPin) {
        setCloseup({ 
          file: selectedPin.closeup, 
          collection: selectedPin.collection,
          selectedIndex: selectedPin.selectedIndex || 0
        });
      }
      setZooming(false);
    }, 200);
  };

  // Modificar la función handleCloseCloseup para recibir y almacenar la selección
  const handleCloseCloseup = (collection, selectedIndex) => {
    // Si se proporciona una colección y un índice, actualizar la selección
    if (collection && selectedIndex !== undefined) {
      // Verificar si el valor seleccionado es diferente al valor actual
      if (selectedItems[collection] !== selectedIndex) {
        // Incrementar el contador de cambios
        setChangesCount(prevCount => {
          const newCount = prevCount + 1;
          
          // Si se alcanza el umbral de 3 cambios y no estamos en modo bigscreen, mostrar el formulario
          if (newCount === 3 && !showContactForm && !isBigScreen) {
            setTimeout(() => {
              setShowContactForm(true);
            }, 500); // Pequeño retraso para mejor experiencia de usuario
          }
          
          return newCount;
        });
        
        // Actualizar el item seleccionado
        setSelectedItems(prev => ({
          ...prev,
          [collection]: selectedIndex
        }));
      }
    }
    setCloseup(null);
  };

  const handleSelectAmbiente = (ambiente) => {
    setCurrentView(ambiente);
  };

  const handleSelectLanguage = (lang) => {
    // On iOS, fullscreen can only be triggered by user gesture
    // The LanguageSelector component handles the fullscreen request
    // This is just a fallback in case the component's request fails
    
    console.log(`Idioma seleccionado: ${lang}`);
    // El cambio de idioma en i18n ya se maneja en el componente LanguageSelector
    setLanguage(lang);
  };

  // Función para manejar el envío del formulario
  const handleFormSubmit = async (formData, serverResponse) => {
    console.log('Datos del formulario guardados en memoria:', formData);
    console.log('Estado actual de selectedItems al guardar:', selectedItems);
    
    // Reiniciar la referencia de formulario enviado
    formSubmittedRef.current = false;
    
    // Verificar que formData tenga todas las selecciones
    if (formData.selectedItems) {
      console.log('Selecciones en formData:', Object.keys(formData.selectedItems).length);
      console.log('Selecciones en estado:', Object.keys(selectedItems).length);
      
      // Si formData no tiene todas las selecciones, añadirlas
      if (Object.keys(formData.selectedItems).length < Object.keys(selectedItems).length) {
        console.log('Añadiendo selecciones faltantes a formData');
        formData.selectedItems = {...selectedItems};
      }
    } else {
      // Si formData no tiene selectedItems, añadirlo
      console.log('Añadiendo selectedItems a formData');
      formData.selectedItems = {...selectedItems};
    }
    
    // Guardar los datos del formulario en el estado
    setPendingFormData({...formData});
    
    // Cerrar el formulario después de guardar los datos
    setShowContactForm(false);
  };

  // Función para enviar los datos del formulario al servidor
  const submitFormData = async () => {
    // Si no hay datos pendientes o el formulario ya ha sido enviado, salir
    if (!pendingFormData || formSubmittedRef.current) return;
    
    // Marcar el formulario como enviado para evitar envíos duplicados
    formSubmittedRef.current = true;
    
    try {
      console.log('Enviando datos del formulario al servidor:', pendingFormData);
      console.log('Estado actual de selectedItems:', selectedItems);
      
      // Verificar si pendingFormData tiene las selecciones completas
      const hasCompleteSelections = pendingFormData.selectedItems && 
        Object.keys(pendingFormData.selectedItems).length === Object.keys(selectedItems).length;
      
      console.log('¿Tiene selecciones completas?', hasCompleteSelections);
      
      // Si no tiene selecciones completas, necesitamos reconstruir los SKUs
      let updatedProducts = pendingFormData.products;
      
      if (!hasCompleteSelections) {
        console.log('Reconstruyendo lista de productos con selecciones actualizadas');
        
        // Recopilar los SKUs de los productos seleccionados actuales
        const currentSelectedSkus = [];
        
        try {
          // Recorrer todas las colecciones con productos seleccionados
          for (const [collection, selectedIndex] of Object.entries(selectedItems)) {
            // Solo procesar si hay un producto seleccionado (índice diferente de 0)
            if (selectedIndex !== 0) {
              try {
                // Cargar dinámicamente la colección
                const module = await import(`./data/collections/${collection}.json`);
                const products = module.default;
                
                // Verificar si el índice seleccionado es válido
                if (products && products.length > selectedIndex) {
                  const product = products[selectedIndex];
                  if (product && product.SKU) {
                    currentSelectedSkus.push(product.SKU);
                  }
                }
              } catch (error) {
                console.error(`Error al cargar la colección ${collection}:`, error);
              }
            }
          }
          
          console.log('SKUs actualizados de productos seleccionados:', currentSelectedSkus.join(', '));
          
          // Actualizar el string de productos
          if (currentSelectedSkus.length > 0) {
            updatedProducts = currentSelectedSkus.join(', ');
          } else {
            updatedProducts = 'Ninguno';
          }
        } catch (error) {
          console.error('Error al procesar los SKUs actualizados:', error);
        }
      }
      
      // Asegurarse de que tenemos la información más actualizada de las selecciones
      const updatedFormData = {
        ...pendingFormData,
        // Si pendingFormData ya tiene todas las selecciones, usarlas
        // De lo contrario, usar el estado actual de selectedItems
        selectedItems: hasCompleteSelections ? pendingFormData.selectedItems : selectedItems,
        // Actualizar el string de productos si es necesario
        products: updatedProducts,
        // Añadir el idioma seleccionado por el usuario
        language: language
      };
      
      console.log('Datos actualizados para enviar:', updatedFormData);
      
      // Enviar el formulario con los productos seleccionados
      const response = await fetch(config.formServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey
        },
        body: JSON.stringify(updatedFormData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      // Limpiar los datos del formulario después de enviarlos
      setPendingFormData(null);
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Show the preloading screen while images are loading
  if (isLoading) {
    return <PreloadingScreen />;
  }

  // Show screensaver if user is idle and language is selected (only on desktop)
  if (isIdle && language && !isMobile) {
    // Enviar los datos del formulario si existen y no han sido enviados aún
    if (pendingFormData && !formSubmittedRef.current) {
      console.log('Activando envío de formulario desde screensaver');
      submitFormData();
    }
    
    return (
      <Screensaver 
        onClose={() => {
          // Cambiar la parte de resetIdleState() a reload
          window.location.reload();
        }}
      />
    );
  }

  // After loading, show the language selector if language is not selected
  if (!language) {
    return <LanguageSelector onSelectLanguage={handleSelectLanguage} />;
  }

  return (
    <div
      className={`app-container ${darkMode ? "dark-mode" : ""}`}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: theme.bgPrimary,
      }}
      onClick={() => {
        if (isIdle) {
          resetIdleState();
        }
      }}
    >
      {!language ? (
        <LanguageSelector onSelectLanguage={handleSelectLanguage} />
      ) : (
        <div className="relative h-screen overflow-hidden">
          <ThemeUpdater darkMode={darkMode} />
          <ViewerHeader language={language} />
          <div className="pt-[40px] h-full">
            {!closeup && (
              <>
                <Sidebar
                  ambientes={ambientes}
                  currentView={currentView}
                  onViewClick={handleViewClick}
                  menuExpanded={menuExpanded}
                  onToggleMenu={() => setMenuExpanded(!menuExpanded)}
                  darkMode={darkMode}
                  onToggleDarkMode={() => setDarkMode(!darkMode)}
                  getAmbientFilePaths={getAmbientFilePaths}
                />
                {!isMobile ? (
                  // AMBIENTES Desktop
                  <button
                    onClick={() => setMenuExpanded(!menuExpanded)}
                    className="fixed z-50 uppercase font-semibold rounded-br rounded-bl px-4 py-1 focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: theme.background.primary,
                      color: theme.text.primary,
                      left: menuExpanded ? "16.9rem" : "1rem",
                      top: "50%",
                      transform: "translate(-50%, -50%) rotate(-90deg)",
                      transformOrigin: "center",
                      boxShadow: '-4px 5px 6px -1px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {t('sidebar.ambients')}
                  </button>
                ) : (
                  // AMBIENTES Mobile
                  <button
                    onClick={() => setMenuExpanded(!menuExpanded)}
                    className="fixed z-50 uppercase font-semibold rounded-tl rounded-tr px-5 py-4 focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: theme.background.primary,
                      color: theme.text.primary,
                      left: "1rem",
                      bottom: "0rem",
                      width: "43%",
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {t('sidebar.products')}
                  </button>
                )}

                <ProductPanel
                  ambientes={ambientes}
                  pinsData={pinsData}
                  onSelectAmbiente={handleSelectAmbiente}
                  onSelectPin={handleSelectPin}
                  panelExpanded={collectionPanelExpanded}
                  selectedItems={selectedItems}
                  collectionsOrder={[
                    'perfiles_pared',
                    //'perfiles_led',
                    'perfiles_piso',
                    'zocalos',
                    'toalleros',
                    'estantes',
                    'desagues',
                    'rejillas',
                    'wallpanels'
                    // El resto (cabinets, vanitories, etc.) carga "solo" en orden default
                  ]}
                />

                {!isMobile ? (
                  // COLECCIONES Desktop
                  <button
                    onClick={() => setCollectionPanelExpanded(!collectionPanelExpanded)}
                    className="fixed z-50 uppercase font-semibold rounded-bl rounded-br px-4 py-1 focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: theme.background.primary,
                      color: theme.text.primary,
                      right: collectionPanelExpanded ? "20.9rem" : "1rem",
                      top: "50%",
                      transform: "translate(50%, -50%) rotate(90deg)",
                      transformOrigin: "center",
                      boxShadow: '4px 5px 6px -1px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {t('sidebar.products')}
                  </button>
                ) : (
                  // COLECCIONES Mobile
                  <button
                    onClick={() => setCollectionPanelExpanded(!collectionPanelExpanded)}
                    className="fixed z-50 uppercase font-semibold rounded-tl rounded-tr px-5 py-4 focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: theme.background.primary,
                      color: theme.text.primary,
                      right: "1rem",
                      bottom: "0rem",
                      width: "43%",
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {t('sidebar.products')}
                  </button>
                )}
              </>
            )}

            <div className="viewer-container h-full">
              <Three360Viewer
                imageUrl={getAmbientFilePaths(currentView, darkMode).url}
                pins={currentPins}
                onOpenCloseup={handleOpenCloseup}
                selectedPin={selectedPin}
                onSelectPin={handleSelectPin}
                developmentMode={developmentMode}
                darkMode={darkMode}
                currentView={currentView}
                selectedItems={selectedItems}
              />
              {closeup && (
                <CloseupViewer closeup={closeup} onClose={handleCloseCloseup} />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Formulario de contacto - solo si no estamos en modo bigscreen */}
      {showContactForm && !isBigScreen && (
        <ContactFormOverlay 
          onClose={() => setShowContactForm(false)}
          onSubmit={handleFormSubmit}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
};

// Componente principal que proporciona el contexto
function App() {
  return (
    <AppContent />
  );
}

export default App;
import { useState, useEffect } from "react";
import Three360Viewer from "./components/Three360Viewer";
import Sidebar from "./components/Sidebar";
import CloseupViewer from "./components/CloseupViewer";
import ProductPanel from "./components/ProductPanel";
import LanguageSelector from "./components/LanguageSelector";
import PreloadingScreen from "./components/PreloadingScreen";
import Screensaver from "./components/Screensaver";
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

function App() {
  const developmentMode = false; // Flag para activar el overlay de desarrollo
  const [language, setLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  // Screensaver state
  const { isIdle, resetIdleState } = useIdleTimer(60000); // 60 seconds of inactivity

  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [collectionPanelExpanded, setCollectionPanelExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPin, setSelectedPin] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
          await preloadVideo('/videos/video-back_2880x2160.webm');
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
      setSelectedItems(prev => ({
        ...prev,
        [collection]: selectedIndex
      }));
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
    
    setLanguage(lang);
  };

  // Show the preloading screen while images are loading
  if (isLoading) {
    return <PreloadingScreen />;
  }

  // Show screensaver if user is idle and language is selected (only on desktop)
  if (isIdle && language && !isMobile) {
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
    <div className="relative h-screen">
      <ThemeUpdater />
      <ViewerHeader />
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
                Ambientes
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
                Ambientes
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
                Productos
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
                Productos
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
  );
}

export default App;
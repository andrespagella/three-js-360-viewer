import { useState, useEffect } from "react";
import Three360Viewer from "./components/Three360Viewer";
import Sidebar from "./components/Sidebar";
import CloseupViewer from "./components/CloseupViewer";
import CollectionPanel from "./components/CollectionPanel";
import LanguageSelector from "./components/LanguageSelector";
import ambientes from "./data/ambientes.json";
import pinsData from "./data/pins.json";
import getAmbientFilePaths from './utils/getAmbientFilePaths';

function App() {
  const developmentMode = false; // Flag para activar el overlay de desarrollo
  const [language, setLanguage] = useState(null);

  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [collectionPanelExpanded, setCollectionPanelExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPin, setSelectedPin] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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
  // se toma el primer elemento y se usa su propiedad "closeup".
  const handleSelectPin = async (pin) => {
    try {
      // Construir la URL correcta del recurso
      const jsonUrl = new URL(pin.data, import.meta.url).href;
      const response = await fetch(jsonUrl);
      const jsonData = await response.json();
  
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const collectionName = pin.data.split('/').pop().replace('.json', '');
        const updatedPin = { ...pin, closeup: jsonData[0].closeup, collection: collectionName };
        setSelectedPin(updatedPin);
      }
    } catch (error) {
      console.error("Error al cargar el archivo de datos del pin:", error);
    }
  };

  // Función que abre el closeup utilizando la imagen obtenida del JSON.
  const handleOpenCloseup = () => {
    setZooming(true);
    setTimeout(() => {
      if (selectedPin) {
        setCloseup({ file: selectedPin.closeup, collection: selectedPin.collection });
      }
      setZooming(false);
    }, 200);
  };

  const handleCloseCloseup = () => {
    setCloseup(null);
  };

  const handleSelectAmbiente = (ambiente) => {
    setCurrentView(ambiente);
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
  };

  // Hasta que el usuario seleccione el idioma, mostramos el selector
  if (!language) {
    return <LanguageSelector onSelectLanguage={handleSelectLanguage} />;
  }

  return (
    <div className="relative h-screen">
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
          {!isMobile && (
            <button
              onClick={() => setMenuExpanded(!menuExpanded)}
              className="fixed z-50 bg-white text-black uppercase font-semibold rounded-br rounded-bl px-4 py-1 focus:outline-none transition-all duration-300"
              style={{
                left: menuExpanded ? "16.5rem" : "1rem",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(-90deg)",
                transformOrigin: "center",
              }}
            >
              Ambientes
            </button>
          )}

          <CollectionPanel
            ambientes={ambientes}
            pinsData={pinsData}
            onSelectAmbiente={handleSelectAmbiente}
            onSelectPin={handleSelectPin}
            panelExpanded={collectionPanelExpanded}
          />

          {!isMobile && (
            <button
              onClick={() =>
                setCollectionPanelExpanded(!collectionPanelExpanded)
              }
              className="fixed z-50 bg-white text-black uppercase font-semibold rounded-bl rounded-br px-4 py-1 focus:outline-none transition-all duration-300"
              style={{
                right: collectionPanelExpanded ? "16.5rem" : "1rem",
                top: "50%",
                transform: "translate(50%, -50%) rotate(90deg)",
                transformOrigin: "center",
              }}
            >
              Colección
            </button>
          )}
        </>
      )}

      <div
        className={`transition-all duration-300 ${
          isMobile
            ? closeup
              ? "mb-0"
              : menuExpanded
              ? "mb-64"
              : "mb-0"
            : closeup
            ? "ml-0 mr-0"
            : menuExpanded && collectionPanelExpanded
            ? "ml-64"
            : menuExpanded
            ? "ml-64"
            : collectionPanelExpanded
            ? "mr-64"
            : "mr-0"
        }`}
      >
        <div className={`viewer-container ${zooming ? "zoom-animation" : ""}`}>
          <Three360Viewer
            imageUrl={getAmbientFilePaths(currentView, darkMode).url}
            pins={currentPins}
            onOpenCloseup={handleOpenCloseup}
            selectedPin={selectedPin}
            onSelectPin={handleSelectPin}
            developmentMode={developmentMode}
          />
        </div>
        {closeup && (
          <CloseupViewer closeup={closeup} onClose={handleCloseCloseup} />
        )}
      </div>
    </div>
  );
}

export default App;
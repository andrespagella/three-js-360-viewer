import { useState, useEffect } from "react";
import Three360Viewer from "./components/Three360Viewer";
import Sidebar from "./components/Sidebar";
import CloseupViewer from "./components/CloseupViewer";
import CollectionPanel from "./components/CollectionPanel";
import ambientes from "./data/ambientes.json";
import pinsData from "./data/pins.json";

function App() {
  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [collectionPanelExpanded, setCollectionPanelExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPin, setSelectedPin] = useState(null);
  // Por defecto se parte en modo Claro (Light)
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función que genera las rutas de imagen según el ambiente y el modo
  const getAmbientFilePaths = (ambient, darkMode) => {
    const mode = darkMode ? "Dark" : "Light";
    let prefix = "";
    if (ambient.name === "Antebaño") {
      prefix = "Bath-";
    } else if (ambient.name === "Baño") {
      prefix = "ShowerArea-";
    }
    if (prefix) {
      return {
        url: `ambientes/${prefix}${mode}.webp`,
        preview: `ambientes/${prefix}${mode}.webp`,
      };
    }
    return {
      url: ambient.url,
      preview: ambient.preview,
    };
  };

  const currentPins =
    pinsData.find((p) => p.ambiente === currentView.name)?.pins || [];

  const handleViewClick = (view) => {
    setCurrentView(view);
    setMenuExpanded(false);
  };

  const handleOpenCloseup = (closeupFile) => {
    setZooming(true);
    setTimeout(() => {
      setCloseup(`/closeups/${closeupFile}`);
      setZooming(false);
    }, 200);
  };

  const handleCloseCloseup = () => {
    setCloseup(null);
  };

  const handleSelectPin = (pin) => {
    setSelectedPin(pin);
  };

  const handleSelectAmbiente = (ambiente) => {
    setCurrentView(ambiente);
  };

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
              className="fixed z-50 bg-white text-black uppercase font-semibold rounded px-4 py-1 focus:outline-none"
              style={{
                left: menuExpanded ? "16.5rem" : "1.5rem",
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
              className="fixed z-50 bg-white text-black uppercase font-semibold rounded px-4 py-1 focus:outline-none"
              style={{
                right: collectionPanelExpanded ? "16.5rem" : "1.5rem",
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
              : "mb-10"
            : closeup
            ? "ml-0 mr-0"
            : menuExpanded && collectionPanelExpanded
            ? "ml-64 mr-64"
            : menuExpanded
            ? "ml-64 mr-2.5"
            : collectionPanelExpanded
            ? "ml-2.5 mr-64"
            : "ml-2.5 mr-2.5"
        }`}
      >
        <div className={`viewer-container ${zooming ? "zoom-animation" : ""}`}>
          <Three360Viewer
            imageUrl={getAmbientFilePaths(currentView, darkMode).url}
            pins={currentPins}
            onOpenCloseup={handleOpenCloseup}
            selectedPin={selectedPin}
            onSelectPin={handleSelectPin}
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
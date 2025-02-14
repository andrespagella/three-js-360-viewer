import { useState } from "react";
import Three360Viewer from "./components/Three360Viewer";
import Sidebar from "./components/Sidebar";
import CloseupViewer from "./components/CloseupViewer";
import ambientes from "./data/ambientes.json";
import pinsData from "./data/pins.json";

function App() {
  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

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

  return (
    <div className="relative h-screen">
      {!closeup && (
        <>
          <Sidebar
            ambientes={ambientes}
            currentView={currentView}
            onViewClick={handleViewClick}
            menuExpanded={menuExpanded}
          />
          <button
            onClick={() => setMenuExpanded(!menuExpanded)}
            className="fixed z-50 bg-gray-800 text-white px-4 py-1 focus:outline-none"
            style={{
              left: menuExpanded ? "16rem" : "1.5rem",
              top: "50%",
              transform: "translate(-50%, -50%) rotate(-90deg)",
              transformOrigin: "center",
            }}
          >
            Ambientes
          </button>
        </>
      )}

      <div className={`transition-all duration-300 ${closeup ? "ml-0" : menuExpanded ? "ml-64" : "ml-2.5"}`}>
        <div className={`viewer-container ${zooming ? "zoom-animation" : ""}`}>
          <Three360Viewer imageUrl={currentView?.url} pins={currentPins} onOpenCloseup={handleOpenCloseup} />
        </div>
        {closeup && <CloseupViewer closeup={closeup} onClose={handleCloseCloseup} />}
      </div>
    </div>
  );
}

export default App;
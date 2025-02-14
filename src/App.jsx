import { useState } from "react";
import "./App.css";
import Three360Viewer from "./components/Three360Viewer";
import ambientes from "./ambientes.json";
import pinsData from "./pins.json";

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

  // Manejo del zoom para el closeup
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
      {/* Panel lateral visible solo cuando no hay closeup */}
      {!closeup && (
        <div
          className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform duration-300"
          style={{
            transform: menuExpanded
              ? "translateX(0)"
              : "translateX(-calc(16rem - 2.5rem))",
          }}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold">Ambientes</h2>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {ambientes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleViewClick(item)}
                  style={{ backgroundImage: `url(${item.preview})` }}
                  className={`bg-cover bg-center h-[200px] rounded ${
                    currentView.name === item.name
                      ? "ring-4 ring-black"
                      : "ring-2 ring-gray-700 hover:ring-gray-600"
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botón Toggle visible solo cuando no hay closeup */}
      {!closeup && (
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
      )}

      {/* Contenido principal ajusta el margen según se muestre el panel */}
      <div
        className={`transition-all duration-300 ${
          closeup ? "ml-0" : menuExpanded ? "ml-64" : "ml-2.5"
        }`}
      >
        <div className={`viewer-container ${zooming ? "zoom-animation" : ""}`}>
          <Three360Viewer
            imageUrl={currentView?.url}
            pins={currentPins}
            onOpenCloseup={handleOpenCloseup}
          />
        </div>
        {closeup && (
          <div className="absolute top-0 left-0 w-full h-screen z-10">
            <img
              src={closeup}
              alt="Closeup"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleCloseCloseup}
              className="absolute top-4 right-4 bg-black text-white px-4 py-2"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
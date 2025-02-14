// src/App.jsx
import { useRef, useState } from "react";
import "./App.css";
import Three360Viewer from "./components/Three360Viewer";
import ambientes from "./ambientes.json";
import pinsData from "./pins.json";

function App() {
  const [currentView, setCurrentView] = useState(ambientes[0]);
  const [closeup, setCloseup] = useState(null);
  const [zooming, setZooming] = useState(false);
  
  // Encuentra los pines correspondientes para el ambiente actual
  const currentPins = pinsData.find((p) => p.ambiente === currentView.name)?.pins || [];
  
  const containerRef = useRef(null);
  const viewRefs = useRef([]);

  const scrollToView = (index) => {
    if (viewRefs.current[index] && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const viewWidth = viewRefs.current[index].offsetWidth;
      const scrollPosition =
        viewRefs.current[index].offsetLeft - containerWidth / 2 + viewWidth / 2;
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleViewClick = (view, index) => {
    setCurrentView(view);
    scrollToView(index);
  };

  // Al hacer clic en un pin con closeup, activamos el zoom y luego mostramos la vista closeup
  const handleOpenCloseup = (closeupFile) => {
    setZooming(true);
    setTimeout(() => {
      setCloseup(`/closeups/${closeupFile}`);
      setZooming(false);
    }, 200); // 200ms de zoom (ajustable)
  };

  const handleCloseCloseup = () => {
    setCloseup(null);
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className={`viewer-container ${zooming ? "zoom-animation" : ""}`}>
        <Three360Viewer
          imageUrl={currentView?.url}
          pins={currentPins}
          onOpenCloseup={handleOpenCloseup}
        />
      </div>
      <div
        ref={containerRef}
        className="w-full flex items-center gap-4 overflow-x-auto absolute bottom-0 left-0 p-10"
      >
        {ambientes.map((item, index) => (
          <button
            key={index}
            ref={(el) => (viewRefs.current[index] = el)}
            onClick={() => handleViewClick(item, index)}
            className={`${
              currentView?.id === item.id ? "bg-black" : "bg-[#222]"
            } px-4 py-2 flex-shrink-0 rounded text-white shadow-sm shadow-white`}
          >
            {item.name}
          </button>
        ))}
      </div>
      {closeup && (
        <div className="absolute top-0 left-0 w-full h-screen z-10">
          <img src={closeup} alt="Closeup" className="w-full h-full object-cover" />
          <button
            onClick={handleCloseCloseup}
            className="absolute top-4 right-4 bg-black text-white px-4 py-2"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
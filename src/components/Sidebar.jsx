import React, { useState, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";

// Función helper de respaldo para obtener las rutas de imagen según el ambiente y el modo
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

const Sidebar = ({
  ambientes,
  currentView,
  onViewClick,
  menuExpanded,
  onToggleMenu,
  darkMode,
  onToggleDarkMode,
  getAmbientFilePaths: externalGetAmbientFilePaths,
}) => {
  // Usar la función helper recibida o la propia
  const getPaths = externalGetAmbientFilePaths || getAmbientFilePaths;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Para Sidebar: usar "bottom" en mobile y "left" en escritorio
  const anchor = isMobile ? "bottom" : "left";
  const transformStyle = getTransformStyle(anchor, menuExpanded);

  const containerClasses = `fixed z-50 transition-transform duration-300 bg-white text-black shadow-sm ${
    isMobile ? "bottom-0 left-0 w-full h-64" : "top-0 left-0 h-full w-64"
  }`;

  return (
    <div className={containerClasses} style={{ transform: transformStyle }}>
      <div className="p-4 flex justify-between items-center">
        {isMobile && (
          <button
            onClick={onToggleMenu}
            className="bg-white text-black uppercase font-semibold rounded px-4 py-1 shadow-sm focus:outline-none"
          >
            Ambientes
          </button>
        )}
        <div className="flex items-center">
          <span className="text-sm text-black">Claro</span>
          <div
            onClick={onToggleDarkMode}
            className="mx-2 relative w-12 h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300"
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-400 rounded-full transition-transform duration-300 ${
                darkMode ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm text-black">Oscuro</span>
        </div>
      </div>
      {isMobile ? (
        <div className="relative h-full overflow-auto">
          <div className="p-4 pt-2">
            <div className="grid grid-cols-1 gap-2">
              {ambientes.map((item, index) => {
                const paths = getPaths(item, darkMode);
                return (
                  <button
                    key={index}
                    onClick={() => onViewClick(item)}
                    style={{ backgroundImage: `url(${paths.preview})` }}
                    className={`bg-cover bg-center h-[200px] rounded ${
                      currentView.name === item.name
                        ? "ring-4 ring-black"
                        : "ring-2 ring-gray-700 hover:ring-gray-600"
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white">
                      {item.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 overflow-auto">
          <div className="grid grid-cols-1 gap-4">
            {ambientes.map((item, index) => {
              const paths = getPaths(item, darkMode);
              return (
                <button
                  key={index}
                  onClick={() => onViewClick(item)}
                  style={{ backgroundImage: `url(${paths.preview})` }}
                  className={`bg-cover bg-center h-[200px] rounded ${
                    currentView.name === item.name
                      ? "ring-4 ring-black"
                      : "ring-2 ring-gray-700 hover:ring-gray-600"
                  }`}
                >
                  <div className="w-full h-full flex items-center uppercase font-semibold justify-center bg-black bg-opacity-50 text-white">
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
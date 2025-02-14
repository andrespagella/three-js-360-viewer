import React, { useState, useEffect } from "react";

const Sidebar = ({ ambientes, currentView, onViewClick, menuExpanded, onToggleMenu }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Definir las transformaciones separando mobile y desktop
  const desktopCollapsed = "translateX(calc(-16rem + 0.8rem))";
  const desktopExpanded = "translateX(0)";
  const mobileCollapsed = "translateY(calc(16rem - 2.5rem))";
  const mobileExpanded = "translateY(0)";

  const transformStyle = isMobile
    ? (menuExpanded ? mobileExpanded : mobileCollapsed)
    : (menuExpanded ? desktopExpanded : desktopCollapsed);

  return (
    <div
      className={`fixed z-50 transition-transform duration-300 bg-gray-800 text-white ${
        isMobile ? "bottom-0 left-0 w-full h-64" : "top-0 left-0 h-full w-64"
      }`}
      style={{ transform: transformStyle }}
    >
      {isMobile ? (
        <div className="relative h-full overflow-auto">
          {/* Botón de toggle dentro de la sidebar para mobile */}
          <button
            onClick={onToggleMenu}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-1 focus:outline-none"
          >
            Ambientes
          </button>
          <div className="p-4 pt-10">
            <h2 className="text-lg font-bold">Ambientes</h2>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {ambientes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onViewClick(item)}
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
      ) : (
        <div className="p-4 overflow-auto">
          <h2 className="text-lg font-bold">Ambientes</h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {ambientes.map((item, index) => (
              <button
                key={index}
                onClick={() => onViewClick(item)}
                style={{ backgroundImage: `url(${item.preview})` }}
                className={`bg-cover bg-center h-[250px] rounded ${
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
      )}
    </div>
  );
};

export default Sidebar;
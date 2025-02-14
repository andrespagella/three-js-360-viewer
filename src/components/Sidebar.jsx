import React from "react";

const Sidebar = ({ ambientes, currentView, onViewClick, menuExpanded }) => {
  return (
    <div
      className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transition-transform duration-300"
      style={{
        transform: menuExpanded ? "translateX(0)" : "translateX(-calc(16rem - 2.5rem))",
      }}
    >
      <div className="p-4">
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
  );
};

export default Sidebar;
import React from "react";

const CloseupViewer = ({ closeup, onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-screen z-10">
      <img src={closeup} alt="Closeup" className="w-full h-full object-cover" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black text-white px-4 py-2"
      >
        Cerrar
      </button>
    </div>
  );
};

export default CloseupViewer;
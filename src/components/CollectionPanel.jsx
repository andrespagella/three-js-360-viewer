import React, { useState, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import useIsMobile from "../hooks/useIsMobile";

const CollectionPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded }) => {
  const isMobile = useIsMobile();

  const allPins = pinsData.reduce((acc, ambienteItem) => {
    const ambienteName = ambienteItem.ambiente;
    const pinsWithAmbiente = ambienteItem.pins.map((pin) => ({ ...pin, ambiente: ambienteName }));
    return [...acc, ...pinsWithAmbiente];
  }, []);

  // Para CollectionPanel: usar "bottom" en mobile y "right" en escritorio
  const anchor = isMobile ? "bottom" : "right";
  const transformStyle = getTransformStyle(anchor, panelExpanded);

  const panelClasses = `fixed z-40 transition-transform duration-300 bg-white text-black overflow-auto shadow-sm ${
    isMobile ? "bottom-0 right-0 w-full h-64" : "top-0 right-0 h-full w-64"
  }`;

  return (
    <div className={panelClasses} style={{ transform: transformStyle }}>
      <div className="p-4">
        <div>
          <h3 className="text-sm font-semibold">Colección</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {allPins.map((pin, index) => (
              <button
                key={index}
                className="relative cursor-pointer w-full aspect-square bg-cover bg-center rounded shadow-md overflow-hidden"
                style={{ backgroundImage: `url(${pin.thumbnail || '/default-thumbnail.jpg'})` }}
                onClick={() => {
                  if (onSelectAmbiente) {
                    const ambienteObj = ambientes.find((amb) => amb.name === pin.ambiente);
                    if (ambienteObj) {
                      onSelectAmbiente(ambienteObj);
                    }
                  }
                  onSelectPin && onSelectPin(pin);
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                  <span className="w-full text-center text-white text-xs p-2 bg-black bg-opacity-50">
                    {pin.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPanel;
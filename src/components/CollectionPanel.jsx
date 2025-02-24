import React, { useState, useEffect } from "react";

const CollectionPanel = ({ ambientes, pinsData, onSelectAmbiente, onSelectPin, panelExpanded }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allPins = pinsData.reduce((acc, ambienteItem) => {
    const ambienteName = ambienteItem.ambiente;
    const pinsWithAmbiente = ambienteItem.pins.map((pin) => ({
      ...pin,
      ambiente: ambienteName,
    }));
    return [...acc, ...pinsWithAmbiente];
  }, []);

  const panelClasses = `fixed z-40 transition-transform duration-300 bg-white text-black overflow-auto shadow-sm ${
    isMobile ? "bottom-0 right-0 w-full h-64" : "top-0 right-0 h-full w-64"
  }`;

  const transformStyle = isMobile
    ? panelExpanded
      ? "translateY(0)"
      : "translateY(100%)"
    : panelExpanded
    ? "translateX(0)"
    : "translateX(100%)";

  return (
    <div className={panelClasses} style={{ transform: transformStyle }}>
      <div className="p-4">
        <div>
          <h3 className="text-md font-semibold">Colección</h3>
          <ul className="mt-2">
            {allPins.map((pin, index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline"
                onClick={() => {
                  if (onSelectAmbiente) {
                    const ambienteObj = ambientes.find(
                      (amb) => amb.name === pin.ambiente
                    );
                    if (ambienteObj) {
                      onSelectAmbiente(ambienteObj);
                    }
                  }
                  onSelectPin && onSelectPin(pin);
                }}
              >
                {pin.label}{" "}
                <span className="text-sm text-black">({pin.ambiente})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollectionPanel;
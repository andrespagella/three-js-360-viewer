import React, { useState, useEffect } from "react";
import products from "../data/collections/inodoros.json";

const CloseupViewer = ({ closeup, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (closeup) {
      const foundIndex = products.findIndex(product => product.closeup === closeup);
      if (foundIndex !== -1) {
        setSelectedIndex(foundIndex);
      }
    }
  }, [closeup]);

  const selectedProduct = products[selectedIndex];

  return (
    <div className="fixed inset-0 z-10 flex">
      <div className="relative flex-1">
        <img 
          src={selectedProduct.closeup} 
          alt={selectedProduct.descripcion} 
          className="w-full h-full object-cover" 
        />
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-black text-white px-4 py-2"
        >
          Vista principal
        </button>

        <div className="absolute bottom-0 left-0 w-full flex justify-center p-4 space-x-4">
          {products.map((product, index) => (
            <img
              key={index}
              src={product.thumbnail}
              alt={product.descripcion}
              className={`w-32 h-32 object-cover cursor-pointer border-[3px] rounded-[10px] ${index === selectedIndex ? 'border-violet-500' : 'border-transparent'}`}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="w-1/3 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ficha Técnica</h2>
        {selectedProduct.ficha ? (
          <div className="space-y-2">
            {selectedProduct.ficha.material && (
              <p><strong>Material:</strong> {selectedProduct.ficha.material}</p>
            )}
            {selectedProduct.ficha.terminacion && (
              <p><strong>Terminación:</strong> {selectedProduct.ficha.terminacion}</p>
            )}
            {selectedProduct.ficha.medidas && (
              <p><strong>Medidas:</strong> {selectedProduct.ficha.medidas.join(", ")}</p>
            )}
            {selectedProduct.ficha.forma && (
              <p><strong>Forma:</strong> {selectedProduct.ficha.forma}</p>
            )}
          </div>
        ) : (
          <p>No hay información disponible.</p>
        )}
      </div>
    </div>
  );
};

export default CloseupViewer;
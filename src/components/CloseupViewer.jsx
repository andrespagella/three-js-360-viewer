import React, { useState, useEffect } from "react";
import ViewerHeader from "./ViewerHeader";

const CloseupViewer = ({ closeup, onClose }) => {
  const { file: closeupFile, collection: defaultCollection, selectedIndex: initialIndex = 0 } = closeup;
  const [currentCollection, setCurrentCollection] = useState(defaultCollection || "inodoros");
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    // Dynamically import the JSON file based on the currentCollection state
    import(`../data/collections/${currentCollection}.json`)
      .then(module => {
        const data = module.default;
        setProducts(data);
        
        // Si se proporciona un índice inicial, usarlo
        if (initialIndex !== undefined && initialIndex < data.length) {
          setSelectedIndex(initialIndex);
        } 
        // Si no, intentar encontrar el producto por su closeup
        else if (closeupFile) {
          const foundIndex = data.findIndex(product => product.closeup === closeupFile);
          if (foundIndex !== -1) {
            setSelectedIndex(foundIndex);
          } else {
            setSelectedIndex(0);
          }
        } else {
          setSelectedIndex(0);
        }
      })
      .catch(err => {
        console.error(`Error loading JSON for collection ${currentCollection}:`, err);
      });
  }, [currentCollection, closeupFile, initialIndex]);

  const handleCollectionChange = (newCollection) => {
    if (newCollection !== currentCollection) {
      setCurrentCollection(newCollection);
      setSelectedIndex(0);
    }
  };

  if (products.length === 0) {
    return <div>Cargando...</div>;
  }

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
          onClick={() => onClose(currentCollection, selectedIndex)}
          className="absolute top-20 left-4 bg-black text-white px-4 py-2"
        >
          Vista principal
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="flex space-x-4 overflow-x-auto">
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
      </div>
      
      <div className="w-1/3 bg-white mt-10 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{selectedProduct.producto.toUpperCase()}</h2>
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
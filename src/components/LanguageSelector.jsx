import React from "react";

const LanguageSelector = ({ onSelectLanguage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-8">
      <h1 className="text-3xl font-bold">Te damos la bienvenida a Atrim 3D Showcase</h1>
      <h2 className="text-xl">Selecciona el lenguaje para continuar</h2>
      <div className="flex space-x-8">
        <button onClick={() => onSelectLanguage("es")} className="flex flex-col items-center">
          <img src="/icons/es.png" alt="Español" className="w-12 h-12 mb-2" />
          <span className="text-sm">Español</span>
        </button>
        <button onClick={() => onSelectLanguage("pt")} className="flex flex-col items-center">
          <img src="/icons/pt.png" alt="Português" className="w-12 h-12 mb-2" />
          <span className="text-sm">Português</span>
        </button>
        <button onClick={() => onSelectLanguage("en")} className="flex flex-col items-center">
          <img src="/icons/en.png" alt="English" className="w-12 h-12 mb-2" />
          <span className="text-sm">English</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
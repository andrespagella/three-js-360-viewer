import React from "react";
import { enterFullscreen } from "../utils/fullscreenUtils";

const LanguageSelector = ({ onSelectLanguage }) => {
  const handleLanguageSelect = async (lang) => {
    try {
      // Request fullscreen mode
      await enterFullscreen();
    } catch (error) {
      console.warn("Couldn't enter fullscreen mode:", error);
    }
    
    // Call the original language selection handler
    onSelectLanguage(lang);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen space-y-8"
      style={{
        backgroundImage: "url('/app-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <h1 className="text-3xl font-bold text-black tracking-tight" style={{ letterSpacing: "-1px" }}>Te damos la bienvenida a Atrim 3D Showcase</h1>
      <h2 className="text-xl text-black tracking-tight" style={{ letterSpacing: "-1px" }}>Selecciona el lenguaje para continuar</h2>


      <div className="flex space-x-8">
        <button onClick={() => handleLanguageSelect("es")} className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out">
          <img src="/icons/es.png" alt="Español" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">Español</span>
        </button>
        <button onClick={() => handleLanguageSelect("pt")} className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out">
          <img src="/icons/pt.png" alt="Português" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">Português</span>
        </button>
        {/* <button onClick={() => handleLanguageSelect("en")} className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out">
          <img src="/icons/en.png" alt="English" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">English</span>
        </button> */}
      </div>
    </div>
  );
};

export default LanguageSelector;
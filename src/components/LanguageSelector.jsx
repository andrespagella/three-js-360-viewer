import React, { useState, useEffect } from "react";
import { enterFullscreen } from "../utils/fullscreenUtils";

const LanguageSelector = ({ onSelectLanguage }) => {
  const [titleLanguage, setTitleLanguage] = useState("es");
  const [fadeState, setFadeState] = useState("fade-in");

  const titles = {
    es: {
      welcome: "Te damos la bienvenida a Atrim 3D Showcase",
      select: "Selecciona el lenguaje para continuar"
    },
    pt: {
      welcome: "Bem-vindo ao Atrim 3D Showcase",
      select: "Selecione o idioma para continuar"
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      
      setTimeout(() => {
        setTitleLanguage(prev => prev === "es" ? "pt" : "es");
        setFadeState("fade-in");
      }, 1000); // Wait for fade-out to complete
    }, 4000); // Change language every 4 seconds
    
    return () => clearInterval(interval);
  }, []);

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
      <div className={`transition-opacity duration-1000 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
        <h1 className="text-5xl font-bold text-black tracking-tight text-center animate-pulse" style={{ letterSpacing: "-1px" }}>
          {titles[titleLanguage].welcome}
        </h1>
        <h2 className="text-2xl text-black tracking-tight text-center mt-2 animate-pulse" style={{ letterSpacing: "-1px" }}>
          {titles[titleLanguage].select}
        </h2>
      </div>

      <div className="flex space-x-8 mt-8">
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
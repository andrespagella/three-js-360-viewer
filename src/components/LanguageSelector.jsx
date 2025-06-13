import React, { useState, useEffect } from "react";
import { enterFullscreen } from "../utils/fullscreenUtils";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LanguageSelector = ({ onSelectLanguage }) => {
  const { t, i18n } = useTranslation();
  const [titleLanguage, setTitleLanguage] = useState("es");
  const [fadeState, setFadeState] = useState("fade-in");
  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bigscreen = urlParams.get('bigscreen');
    setIsBigScreen(bigscreen === 'true');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      
      setTimeout(() => {
        // Rotate between three languages
        setTitleLanguage(prev => {
          if (prev === "es") return "pt";
          if (prev === "pt") return "en";
          return "es";
        });
        // Change i18n language for the animation
        i18n.changeLanguage(
          titleLanguage === "es" ? "pt" : 
          titleLanguage === "pt" ? "en" : "es"
        );
        setFadeState("fade-in");
      }, 1000); // Wait for fade-out to complete
    }, 4000); // Change language every 4 seconds
    
    return () => clearInterval(interval);
  }, [titleLanguage]);

  const handleLanguageSelect = async (lang) => {
    /**
     * Solo se inicia en pantalla completa cuando bigscreen=true porque la aplicación de iPad 
     * va a estar configurada con Guided Access.
     * En iPads cuando la pantalla está completa no se puede mostrar el teclado virtual.
     * Pero como si se va a estar duplicando el display en una pantalla grande 
     * no hay que completar ningún formulario, estamos bien.
     */
    if (isBigScreen) {
      try {
        // Request fullscreen mode
        await enterFullscreen();
      } catch (error) {
        console.warn("Couldn't enter fullscreen mode:", error);
      }
    }
    
    // Cambiar el idioma en i18n
    console.log(`Cambiando idioma a: ${lang}`);
    i18n.changeLanguage(lang);
    
    // Call the original language selection handler
    onSelectLanguage(lang);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full space-y-8"
      style={{
        backgroundImage: "url('/app-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className={`transition-opacity duration-1000 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
        <h1 className="text-5xl font-bold text-black tracking-tight text-center animate-pulse" style={{ letterSpacing: "-1px" }}>
          {t('languageSelector.welcome')}
        </h1>
        <h2 className="text-2xl text-black tracking-tight text-center mt-2 animate-pulse" style={{ letterSpacing: "-1px" }}>
          {t('languageSelector.select')}
        </h2>
      </div>

      <div className="flex space-x-8 mt-8">

        {/* ESPANOL */}
        <button onClick={() => handleLanguageSelect("es")} 
          className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out"
        >
          <img src="/icons/es.png" alt="Español" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">{t('languageSelector.spanish')}</span>
        </button>

        {/* PORTUGUES */}
        <button onClick={() => handleLanguageSelect("pt")} 
          className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out"
        >
          <img src="/icons/pt.png" alt="Português" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">{t('languageSelector.portuguese')}</span>
        </button>

        
        {/* ENGLISH */}
        <button onClick={() => handleLanguageSelect("en")} 
          className="group flex flex-col items-center p-4 rounded-lg hover:bg-opacity-100 transition-all hover:scale-110 transform transition-transform duration-300 ease-in-out"
        >
          <img src="/icons/en.png" alt="English" className="w-12 h-12 mb-2" />
          <span className="text-sm group-hover:font-bold transition-all">{t('languageSelector.english')}</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { toggleFullscreen, isFullscreen } from "../utils/fullscreenUtils";
import ConversationalAgent from "./ConversationalAgent";
import config from "../utils/config";
import { useConversationalAgent } from "../context/ConversationalAgentContext";

const ViewerHeader = ({ language }) => {
  const { theme } = useTheme();
  const [fullscreen, setFullscreen] = useState(false);
  const { agentActive, setAgentActive } = useConversationalAgent();
  
  // Update fullscreen state when it changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(isFullscreen());
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Activar el agente automáticamente cuando se selecciona un idioma
  useEffect(() => {
    if (language) {
      // Pequeño retraso para asegurar que la interfaz esté completamente cargada
      const timer = setTimeout(() => {
        setAgentActive(true);
      }, config.agentAutoStartDelay);
      
      return () => clearTimeout(timer);
    }
  }, [language, setAgentActive]);
  
  const handleToggleFullscreen = async () => {
    try {
      await toggleFullscreen();
    } catch (error) {
      console.warn("Couldn't toggle fullscreen mode:", error);
    }
  };

  const handleToggleAgent = () => {
    setAgentActive(!agentActive);
  };
  
  return (
    <>
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 z-50 shadow-sm"
        style={{ 
          backgroundColor: '#FFF',
          borderBottom: `1px solid ${theme.border.light}`,
          color: theme.text.primary
        }}
      >
        <div className="flex items-center">
          <img src="/3d-showcase-logo.svg" alt="3D Showcase Logo" className="h-10" />
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleToggleFullscreen}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
            title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {fullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
          <div 
            className="ml-4 h-10 relative cursor-pointer"
            onClick={handleToggleAgent}
            title={agentActive ? "Desactivar asistente de voz" : "Activar asistente de voz"}
          >
            {agentActive ? (
              <div className="h-full w-auto flex items-center justify-center">
                <div className="animate-pulse h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
            ) : (
              <video 
                src="/videos/ai-thinking.mp4" 
                className="h-full w-auto object-contain" 
                autoPlay 
                loop 
                muted
                playsInline
                webkit-playsinline="true"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Componente del agente conversacional */}
      <ConversationalAgent language={language} />
    </>
  );
};

export default ViewerHeader;
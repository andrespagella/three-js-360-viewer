import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { toggleFullscreen, isFullscreen } from "../utils/fullscreenUtils";
import ConversationalAgent from "./ConversationalAgent";
import config from "../utils/config";
import { useConversationalAgent } from "../context/ConversationalAgentContext";

const ViewerHeader = ({ language }) => {
  const { theme } = useTheme();
  const { agentActive, setAgentActive } = useConversationalAgent();

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

          <div 
            className="ml-4 h-10 relative cursor-pointer"
            onClick={handleToggleAgent}
            title={agentActive ? "Desactivar asistente de voz" : "Activar asistente de voz"}
          >
            {agentActive ? (
              <video 
                src="/videos/ai-thinking.mp4" 
                className="h-full w-auto object-contain" 
                autoPlay 
                loop 
                muted
                playsInline
                webkit-playsinline="true"
              />
            ) : (
              <div className="h-full w-auto flex items-center justify-center">
                <div className="animate-pulse h-8 w-8 flex items-center justify-center">
                  <img 
                    src="/disconnected.svg" 
                    alt="Asistente desactivado" 
                    className="h-6 w-6" 
                  />
                </div>
              </div>
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
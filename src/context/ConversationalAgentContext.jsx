import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ConversationalAgentContext = createContext();

// Hook personalizado para usar el contexto
export const useConversationalAgent = () => {
  const context = useContext(ConversationalAgentContext);
  if (!context) {
    throw new Error('useConversationalAgent debe ser usado dentro de un ConversationalAgentProvider');
  }
  return context;
};

// Proveedor del contexto
export const ConversationalAgentProvider = ({ children }) => {
  const [agentActive, setAgentActive] = useState(false);
  
  // Función para activar el agente
  const activateAgent = () => {
    setAgentActive(true);
  };
  
  // Función para desactivar el agente
  const deactivateAgent = () => {
    setAgentActive(false);
  };
  
  // Valor del contexto
  const value = {
    agentActive,
    setAgentActive,
    activateAgent,
    deactivateAgent
  };
  
  return (
    <ConversationalAgentContext.Provider value={value}>
      {children}
    </ConversationalAgentContext.Provider>
  );
};

export default ConversationalAgentContext; 
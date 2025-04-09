import React from 'react';

const ChatbotOverlay = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)' // For Safari support
      }}
    >
      {/* Contenido del Chatbot irá aquí eventualmente */}
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 focus:outline-none"
        title="Cerrar Chatbot"
      >
        <img src="/icon-close.png" alt="Cerrar" className="h-10" />
      </button>

      {/* Placeholder para el contenido del chatbot */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">Chatbot</h2>
        <p>(Aquí irá la interfaz del chatbot)</p>
      </div>
    </div>
  );
};

export default ChatbotOverlay; 
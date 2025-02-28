import React from "react";

const HelpButton = ({ onClick, isMobile }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        position: 'absolute',
        bottom: isMobile ? '70px' : '20px',
        right: '20px',
        width: isMobile ? '36px' : '40px',
        height: isMobile ? '36px' : '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: isMobile ? '18px' : '20px',
        cursor: 'pointer',
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
      aria-label="Mostrar instrucciones"
    >
      ?
    </button>
  );
};

export default HelpButton; 
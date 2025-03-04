import React, { useEffect, useState } from "react";

const InstructionsOverlay = ({ onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: 17,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: isMobile ? '15px' : '20px',
          borderRadius: '8px',
          maxWidth: isMobile ? '90%' : '80%',
          width: isMobile ? '300px' : 'auto',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '4px solid #000',
          position: 'relative',
        }}
      >
        
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ 
              width: '100%', 
              borderRadius: '4px',
              maxHeight: isMobile ? '200px' : '200px',
              objectFit: 'contain'
            }}
          >
            <source src="/videos/instructions.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        </div>

        <p style={{ fontWeight: 500, marginBottom: '20px', fontSize: isMobile ? '14px' : '16px' }}>
          Presiona y desliza tu dedo para mirar alrededor
        </p>
        <button 
          onClick={onClose}
          style={{
            padding: isMobile ? '6px 12px' : '8px 16px',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'bold',
            width: '150px'
          }}
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};

export default InstructionsOverlay; 
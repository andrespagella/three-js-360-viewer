import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Screensaver = ({ onClose }) => {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Add a class to the body to prevent scrolling when screensaver is active
    document.body.classList.add("overflow-hidden");
    
    // Detectar si es un dispositivo móvil
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    // Reproducir el video cuando el componente se monte (solo en desktop)
    if (videoRef.current && !isMobile) {
      videoRef.current.play().catch(error => {
        console.error("Error al reproducir el video:", error);
      });
    }
    
    return () => {
      // Remove the class when the component unmounts
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      {/* Video de fondo (solo en desktop) o fondo estático (en mobile) */}
      {!isMobile ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
        >
          <source src="https://atrim3dshowcase-storage.s3.us-east-1.amazonaws.com/video-back_2880x2160.webm" type="video/webm" />
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-800 to-gray-900"
          style={{ 
            backgroundImage: theme?.colors?.gradient 
              ? `linear-gradient(to bottom, ${theme.colors.primary || '#000'}, ${theme.colors.secondary || '#333'})`
              : undefined
          }}
        />
      )}
      
      {/* Overlay con contenido */}
      <div className="relative z-10 text-center w-full" style={{ position: 'absolute', bottom: '50px' }}>
        <div 
          className="text-xl animate-pulse text-white drop-shadow-lg"
          style={{ 
            textShadow: '1px 1px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(0,0,0,0.3), 1px -1px 0 rgba(0,0,0,0.3), -1px 1px 0 rgba(0,0,0,0.3)' 
          }}
        >
          Toque la pantalla para continuar
        </div>
      </div>
    </div>
  );
};

export default Screensaver; 
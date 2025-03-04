import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const Screensaver = ({ onClose }) => {
  const { theme } = useTheme();
  const videoRef = useRef(null);

  useEffect(() => {
    // Add a class to the body to prevent scrolling when screensaver is active
    document.body.classList.add("overflow-hidden");
    
    // Reproducir el video cuando el componente se monte
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error al reproducir el video:", error);
      });
    }
    
    return () => {
      // Remove the class when the component unmounts
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
      >
        <source src="/videos/video-back_2880x2160.webm" type="video/webm" />
      </video>
      
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
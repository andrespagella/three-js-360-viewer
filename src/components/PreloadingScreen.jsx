import React from "react";

const PreloadingScreen = () => {
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen space-y-8"
      style={{
        backgroundImage: "url('/app-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full animate-pulse"></div>
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="relative h-48 w-48 animate-pulse" 
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))"
            }}
          />
        </div>
        <span className="text-md text-black">Cargando...</span>
      </div>
    </div>
  );
};

export default PreloadingScreen; 
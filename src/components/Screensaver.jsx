import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const Screensaver = ({ onClose }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Add a class to the body to prevent scrolling when screensaver is active
    document.body.classList.add("overflow-hidden");
    
    return () => {
      // Remove the class when the component unmounts
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/app-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        animation: "fadeIn 1s ease-in-out"
      }}
      onClick={onClose}
    >
      <div className="text-center">
        <h1 
          className="text-4xl font-bold mb-6"
          style={{ color: theme.text.primary }}
        >
          Atrim 3D Showcase
        </h1>
        <div 
          className="text-xl animate-pulse"
          style={{ color: theme.text.primary }}
        >
          Toque la pantalla para continuar
        </div>
      </div>
    </div>
  );
};

export default Screensaver; 
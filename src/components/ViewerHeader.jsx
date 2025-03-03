import React from "react";
import { useTheme } from "../context/ThemeContext";

const ViewerHeader = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 z-50 shadow-sm"
      style={{ 
        backgroundColor: theme.background.primary,
        borderBottom: `1px solid ${theme.border.light}`,
        color: theme.text.primary
      }}
    >
      <div className="flex items-center">
        <img src="/3d-showcase-logo.svg" alt="3D Showcase Logo" className="h-10" />
      </div>
      <div className="flex items-center">
        {/* <img src="/bot-button.png" alt="Bot Button" className="h-10 cursor-pointer" /> */}
        <div className="ml-4 h-10 relative">
          <video 
            src="/videos/ai-thinking.mp4" 
            className="h-full w-auto object-contain" 
            autoPlay 
            loop 
            muted
          />
        </div>
      </div>
    </div>
  );
};

export default ViewerHeader;
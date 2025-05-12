import React from "react";
import { useTheme } from "../context/ThemeContext";
import { toggleFullscreen, isFullscreen } from "../utils/fullscreenUtils";
import config from "../utils/config";

const ViewerHeader = ({ language }) => {
  const { theme } = useTheme();

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
      </div>
    </>
  );
};

export default ViewerHeader;
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { toggleFullscreen, isFullscreen } from "../utils/fullscreenUtils";
import config from "../utils/config";
import ChatbotOverlay from "./ChatbotOverlay";

const ViewerHeader = ({ language }) => {
  const { theme } = useTheme();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleToggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

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
        <div className="flex items-center ml-4">
          <button 
            onClick={handleToggleChatbot}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
            title="Abrir Chatbot"
          >
            <img src="/bot-button.png" alt="Chatbot" className="h-8 w-8" />
          </button>
        </div>
      </div>
      
      {showChatbot && <ChatbotOverlay onClose={handleToggleChatbot} />}
    </>
  );
};

export default ViewerHeader;
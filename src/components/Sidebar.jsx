import React, { useMemo, useEffect } from "react";
import { getTransformStyle } from "../utils/transformStyles";
import getAmbientFilePaths from "../utils/getAmbientFilePaths";
import useIsMobile from "../hooks/useIsMobile";
import { useTheme } from "../context/ThemeContext";
import Three360Viewer from "./Three360Viewer";
import { useTranslation } from "react-i18next";

const Sidebar = ({
  ambientes,
  currentView,
  onViewClick,
  menuExpanded,
  onToggleMenu,
  darkMode,
  onToggleDarkMode,
  getAmbientFilePaths: externalGetAmbientFilePaths,
}) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Para Sidebar: usar "bottom" en mobile y "left" en escritorio
  const anchor = isMobile ? "bottom" : "left";
  const transformStyle = getTransformStyle(anchor, menuExpanded);

  return (
    <div 
      className={`fixed z-50 transition-transform duration-300 shadow-lg ${
        isMobile ? "bottom-0 left-0 w-full h-64" : "top-[57px] left-0 h-[calc(100%-40px)] w-64"
      }`}
      style={{ 
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        borderRight: isMobile ? 'none' : `1px solid ${theme.border.light}`,
        borderTop: isMobile ? `1px solid ${theme.border.light}` : 'none',
        transform: transformStyle,
        boxShadow: '4px 5px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold" style={{ color: theme.text.primary }}>{t('sidebar.style', 'Estilo')}</h3>
          <div className="flex items-center">
            <img src="/light.svg" alt="Modo claro" className="w-4 h-4" />
            <div
              onClick={onToggleDarkMode}
              className="mx-2 relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: '#666' }}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 ${
                  darkMode ? "translate-x-6" : ""
                }`}
                style={{ 
                  backgroundColor: theme.background.primary,
                  border: `1px solid ${theme.border.medium}`
                }}
              ></div>
            </div>
            <img src="/dark.svg" alt="Modo oscuro" className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto" style={{ maxHeight: isMobile ? "calc(100% - 60px)" : "calc(100% - 60px)", borderTop: "1px solid #CCC" }}>
        <div className="flex flex-col gap-4">
          {ambientes.map((ambiente) => {
            const { preview } = externalGetAmbientFilePaths
              ? externalGetAmbientFilePaths(ambiente, darkMode)
              : getAmbientFilePaths(ambiente, darkMode);
            
            const isActive = currentView.name === ambiente.name;
            
            return (
              <div
                key={ambiente.name}
                onClick={() => onViewClick(ambiente)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 transform ${
                  isActive ? "scale-105 shadow-md" : "hover:scale-105"
                }`}
                style={{ 
                  border: `2px solid ${isActive ? theme.accent.primary : 'transparent'}`,
                }}
              >
                <div className="relative">
                  <img
                    src={preview}
                    alt={ambiente.name}
                    className="w-full h-[200px] object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-1 text-sm font-bold text-center"
                    style={{ 
                      backgroundColor: isActive ? theme.accent.primary : theme.background.secondary,
                      color: isActive ? theme.text.inverted : theme.text.primary
                    }}
                  >
                    {ambiente.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
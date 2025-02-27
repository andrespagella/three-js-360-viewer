import React, { createContext, useContext, useState } from 'react';
import themes, { defaultTheme } from '../utils/theme';

// Crear el contexto
const ThemeContext = createContext();

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// Proveedor de tema
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  // Función para cambiar el tema
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themes[themeName]);
    } else {
      console.warn(`El tema "${themeName}" no existe. Usando el tema predeterminado.`);
      setCurrentTheme(defaultTheme);
    }
  };

  // Añadir un console.log para verificar que el tema se está proporcionando correctamente
  console.log('ThemeProvider rendering with theme:', currentTheme);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 
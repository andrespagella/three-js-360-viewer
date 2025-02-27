import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeUpdater = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Actualizar las variables CSS cuando cambia el tema
    document.documentElement.style.setProperty('--bg-primary', theme.background.primary);
    document.documentElement.style.setProperty('--bg-secondary', theme.background.secondary);
    document.documentElement.style.setProperty('--bg-tertiary', theme.background.tertiary);
    
    document.documentElement.style.setProperty('--text-primary', theme.text.primary);
    document.documentElement.style.setProperty('--text-secondary', theme.text.secondary);
    document.documentElement.style.setProperty('--text-tertiary', theme.text.tertiary);
    document.documentElement.style.setProperty('--text-inverted', theme.text.inverted);
    
    document.documentElement.style.setProperty('--border-light', theme.border.light);
    document.documentElement.style.setProperty('--border-medium', theme.border.medium);
    document.documentElement.style.setProperty('--border-dark', theme.border.dark);
    
    document.documentElement.style.setProperty('--accent-primary', theme.accent.primary);
    document.documentElement.style.setProperty('--accent-hover', theme.accent.hover);
    document.documentElement.style.setProperty('--accent-active', theme.accent.active);
  }, [theme]);

  return null; // Este componente no renderiza nada
};

export default ThemeUpdater; 
// Configuración de temas para la aplicación
const themes = {
  // Tema predeterminado
  default: {
    // Colores de fondo
    background: {
      primary: '#FAFAFA',    // Fondo principal
      secondary: 'rgba(255,255,255,0.8)',  // Fondo secundario
      tertiary: '#E8E8E8',   // Fondo terciario
    },
    // Colores de texto
    text: {
      primary: '#111111',    // Texto principal
      secondary: '#333333',  // Texto secundario
      tertiary: '#666666',   // Texto terciario
      inverted: '#FFFFFF',   // Texto invertido (para fondos oscuros)
    },
    // Colores de borde
    border: {
      light: '#E0E0E0',      // Borde claro
      medium: '#CCCCCC',     // Borde medio
      dark: '#999999',       // Borde oscuro
    },
    // Colores de acento
    accent: {
      primary: '#512D7E',    // Color de acento principal (indigo)
      hover: '#4F46E5',      // Color de acento al pasar el mouse
      active: '#4338CA',     // Color de acento al hacer clic
    }
  },
  
  // Tema oscuro (opcional, para futuras implementaciones)
  dark: {
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      tertiary: '#A0A0A0',
      inverted: '#111111',
    },
    border: {
      light: '#333333',
      medium: '#444444',
      dark: '#666666',
    },
    accent: {
      primary: '#6366F1',
      hover: '#818CF8',
      active: '#A5B4FC',
    }
  }
};

// Exportar el tema predeterminado
export const defaultTheme = themes.default;

// Exportar todos los temas
export default themes; 
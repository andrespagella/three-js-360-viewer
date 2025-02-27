/** @type {import('tailwindcss').Config} */
import { defaultTheme } from './src/utils/theme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores de fondo
        'bg-primary': defaultTheme.background.primary,
        'bg-secondary': defaultTheme.background.secondary,
        'bg-tertiary': defaultTheme.background.tertiary,
        
        // Colores de texto
        'text-primary': defaultTheme.text.primary,
        'text-secondary': defaultTheme.text.secondary,
        'text-tertiary': defaultTheme.text.tertiary,
        'text-inverted': defaultTheme.text.inverted,
        
        // Colores de borde
        'border-light': defaultTheme.border.light,
        'border-medium': defaultTheme.border.medium,
        'border-dark': defaultTheme.border.dark,
        
        // Colores de acento
        'accent-primary': defaultTheme.accent.primary,
        'accent-hover': defaultTheme.accent.hover,
        'accent-active': defaultTheme.accent.active,
      },
    },
  },
  plugins: [],
}
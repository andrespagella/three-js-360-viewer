import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import pt from './locales/pt.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es
      },
      pt: {
        translation: pt
      }
    },
    lng: 'es',         // idioma por defecto
    fallbackLng: 'es', // en caso de que ocurra un error
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,     // Evita problemas con Suspense
      bindI18n: 'languageChanged',  // Eventos que provocan una re-renderización
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    }
  });

export default i18n; 
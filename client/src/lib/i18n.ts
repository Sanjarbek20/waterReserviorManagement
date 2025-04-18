import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
import enTranslation from '../locales/en.json';
import uzTranslation from '../locales/uz.json';
import ruTranslation from '../locales/ru.json';
import frTranslation from '../locales/fr.json';
import esTranslation from '../locales/es.json';
import deTranslation from '../locales/de.json';

// Water prediction translations
import enWaterPrediction from '../pages/water-prediction-i18n/en.json';
import uzWaterPrediction from '../pages/water-prediction-i18n/uz.json';

const resources = {
  en: {
    translation: { ...enTranslation, ...enWaterPrediction }
  },
  uz: {
    translation: { ...uzTranslation, ...uzWaterPrediction }
  },
  ru: {
    translation: ruTranslation
  },
  fr: {
    translation: frTranslation
  },
  es: {
    translation: esTranslation
  },
  de: {
    translation: deTranslation
  }
};

// Initialize i18next instance
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    // Make sure to use direct language codes without region
    load: 'languageOnly',
    // Use specific cleanup to make sure language is properly set
    cleanCode: true,
    // Force translations to always be returned even if key is missing
    returnEmptyString: false,
    returnNull: false,
    // Ensure that we have cache-busting and proper reloading
    partialBundledLanguages: false,
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
    }
  });

// Add event listener to refresh component when language changes  
window.addEventListener('languageChanged', () => {
  console.log('Language change event detected, refreshing UI');
});

export default i18n;
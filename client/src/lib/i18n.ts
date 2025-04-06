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
    }
  });

export default i18n;
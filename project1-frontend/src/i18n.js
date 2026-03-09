// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
const preferredLanguage = localStorage.getItem('luckydaddy');

const resources = {
  en: {
    translation: translationEN,
  },
  hi: {
    translation: translationHI,
  },
};
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng:preferredLanguage||'en', // default language
    fallbackLng:preferredLanguage||'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
  });

export default i18n;


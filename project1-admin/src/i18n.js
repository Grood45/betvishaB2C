// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationEN from '../public/locales/en/translation.json';
import translationDE from '../public/locales/de/translation.json';
import translationFR from '../public/locales/fr/translation.json';
import translationTR from '../public/locales/tr/translation.json';
import translationPT from '../public/locales/pt/translation.json';
import transalationRu from '../public/locales/ru/translation.json'
import transalationTN from '../public/locales/tn/translation.json'
import translationHI from '../public/locales/hi/translation.json'
import translationBN from '../public/locales/bn/translation.json'

const preferredLanguage = localStorage.getItem('adminDashLanguage');

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      de: {
        translation: translationDE,
      },
      fr: {
        translation: translationFR,
      },
      tr: {
        translation: translationTR,
      },
      pt: {
        translation: translationPT,
      },
      ru: {
        translation: transalationRu,
      },
      tn: {
        translation: transalationTN,
      },
      hi: {
        translation: translationHI,
      },
      bn: {
        translation: translationBN,
      }

    },
    lng: preferredLanguage || 'en', // Default language
    fallbackLng: preferredLanguage || 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;

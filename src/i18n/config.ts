import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import deTranslation from "./locales/de/translation.json";
import enTranslation from "./locales/en/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  debug: false,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;

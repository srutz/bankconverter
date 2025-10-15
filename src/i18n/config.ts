import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";

const resources = {
  en: {
    translation: enTranslation,
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

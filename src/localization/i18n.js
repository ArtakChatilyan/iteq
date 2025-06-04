import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enLang from './locales/en.json'
import geLang from './locales/ge.json'
import ruLang from './locales/ru.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: enLang,
  },
  ge: {
    translation: geLang,
  },
  ru: {
    translation: ruLang,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "ge",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

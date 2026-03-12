import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import am from "./am.json";

const saved = typeof window !== "undefined" ? localStorage.getItem("cfsmcca_language") : null;
const initialLanguage = saved || "am";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am }
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cfsmcca_language", lng);
  }
});

export default i18n;

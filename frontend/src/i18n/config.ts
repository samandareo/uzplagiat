import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const defaultNS = "common";
export const resources = {
  uz: { common: uz },
  en: { common: en },
  ru: { common: ru },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "uz",
  fallbackLng: "uz",
  ns: ["common"],
  defaultNS,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;

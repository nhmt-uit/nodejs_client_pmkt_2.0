import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';



i18n
.use(LanguageDetector)
// pass the i18n instance to react-i18next.
.use(initReactI18next)
// init i18next
// for all options read: https://www.i18next.com/overview/configuration-options
.init({
    resources: {
        en: {
            translation: {
            }
        }
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
        escapeValue: false
    }
})

export default i18n;
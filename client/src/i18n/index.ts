import { createI18n } from "vue-i18n";
import en from "./locales/en.json"
import de from "./locales/de.json"

export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  legacy: false,
  messages: {
    en,
    de
  },
  globalInjection: true
});
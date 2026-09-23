import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enProperty from "./locales/en/property.json";
import enDetail from "./locales/en/detail.json";
import enAgents from "./locales/en/agents.json";
import enAbout from "./locales/en/about.json";
import enContact from "./locales/en/contact.json";
import enNotfound from "./locales/en/notfound.json";
import enAuth from "./locales/en/auth.json";
import enSubscription from "./locales/en/subscription.json";
import enBuyer from "./locales/en/buyer.json";
import enAdmin from "./locales/en/admin.json";
import amCommon from "./locales/am/common.json";
import amLanding from "./locales/am/landing.json";
import amProperty from "./locales/am/property.json";
import amDetail from "./locales/am/detail.json";
import amAgents from "./locales/am/agents.json";
import amAbout from "./locales/am/about.json";
import amContact from "./locales/am/contact.json";
import amNotfound from "./locales/am/notfound.json";
import amAuth from "./locales/am/auth.json";
import amSubscription from "./locales/am/subscription.json";
import amBuyer from "./locales/am/buyer.json";
import amAdmin from "./locales/am/admin.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        landing: enLanding,
        property: enProperty,
        detail: enDetail,
        agents: enAgents,
        about: enAbout,
        contact: enContact,
        notfound: enNotfound,
        auth: enAuth,
        subscription: enSubscription,
        buyer: enBuyer,
        admin: enAdmin,
      },
      am: {
        common: amCommon,
        landing: amLanding,
        property: amProperty,
        detail: amDetail,
        agents: amAgents,
        about: amAbout,
        contact: amContact,
        notfound: amNotfound,
        auth: amAuth,
        subscription: amSubscription,
        buyer: amBuyer,
        admin: amAdmin,
      },
    },
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: ["en", "am"],
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "betenya:lng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
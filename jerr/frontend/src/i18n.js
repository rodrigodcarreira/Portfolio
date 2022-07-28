import i18n from "i18next";
import i18NextLanguageDetector from "i18next-browser-languagedetector";
import i18NextHTTP from "i18next-http-backend";
import i18NBackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";

export default i18n
  .use(i18NBackendAdapter)
  .use(i18NextLanguageDetector)
  .use(initReactI18next)
  .init({
    //debug: true,
    fallbackLng: "en",
    whitelist: ["en", "pt"],
    ns: ["common", "errors"],
    defaultNS: "common",
    load: "all",
    saveMissing: true,
    saveMissingTo: "all",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    react: {
      useSuspense: false,
    },

    backend: {
      backend: i18NextHTTP,
      backendOption: {
        // path where resources get loaded from
        loadPath: "/locales?lng={{lng}}&ns={{ns}}",

        // path to post missing resources
        addPath: "/locales?lng={{lng}}&ns={{ns}}",
      },
    },

    detection: {
      order: [
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      /*
					// keys or params to lookup language from
					lookupCookie: 'i18next',
					lookupLocalStorage: 'i18nextLng',
					// cache user language on
					caches: ['localStorage', 'cookie']
					// optional expire and domain for set cookie
					cookieMinutes: 10,
					cookieDomain: 'myDomain',
					*/
    },
  });

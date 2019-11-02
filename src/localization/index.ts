import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const i18nSetup = () => {
  const languageDetector: any = {
    type: "languageDetector",
    async: true,
    detect: (cb: any) => cb("en"),
    init: () => {},
    cacheUserLanguage: () => {}
  };

  i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      debug: true,
      resources: {
        en: {
          translation: {
            confirmation: "Confirmation",
            weightProgress: "Weight progress",
            add: "Add"
          }
        },
        jp: {
          translation: {
            confirmation: "確認",
            weightProgress: "体重記録",
            add: "追加"
          }
        }
      }
    });
};

export default i18nSetup;

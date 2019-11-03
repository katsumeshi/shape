import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import DeviceInfo from "react-native-device-info";

const i18nSetup = () => {
  const languageDetector: any = {
    type: "languageDetector",
    async: true,
    detect: (cb: any) => cb(DeviceInfo.getDeviceLocale().slice(0, 2)),
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
            add: "Add",
            addWeightToday: "Let's add your first weight today!",
            measure: "Measure",
            back: "Back",
            save: "Save",
            weightInvalid: "weight value is invalid",
            ok: "OK",
            cancel: "Cancel",
            done: "Done",
            weightRemindNotification: "Have you measured your weight today?",
            delete: "Delete",
            signupOrLogin: "Sign up or Login",
            continueWithFB: "Continue with Facebook",
            continueWithGoogle: "Continue with Google",
            enterValidEmail: "Please enter a valid email address",
            enterEmail: "Please enter an email address",
            sentAuthEmail:
              "An authentication email has been sent. Please check your email inbox.",
            authError:
              "You are registered with another authentication method. Please log in with another authentication method.",
            or: "OR",
            getStarted: "Let's get started !",
            settings: "Settings",
            logout: "Log out",
            logoutConfirmation: "Are you sure to log out ?",
            notifications: "Notifications",
            version: "Version",
            home: "Home"
          }
        },
        ja: {
          translation: {
            confirmation: "確認",
            weightProgress: "体重記録",
            add: "追加",
            addWeightToday: "今日の体重を記録しよう！",
            measure: "計測",
            back: "戻る",
            save: "保存",
            weightInvalid: "体重の入力値が不正です",
            ok: "了解",
            cancel: "キャンセル",
            done: "完了",
            weightRemindNotification: "本日の体重測定お済みですか？",
            delete: "削除",
            signupOrLogin: "新規作成かログイン",
            continueWithFB: "Facebookで続ける",
            continueWithGoogle: "Googleで続ける",
            enterValidEmail: "正しいEメールを入力してください",
            enterEmail: "Eメールを入力してください",
            sentAuthEmail: "認証メールを送信しました。メールをご確認下さい。",
            authError:
              "別の認証方法で登録されています。他の認証方法でログインして下さい。",
            or: "または",
            getStarted: "アプリを始める",
            settings: "設定",
            logout: "ログアウト",
            logoutConfirmation: "本当にログアウトしますか？",
            notifications: "通知",
            version: "バージョン",
            home: "ホーム"
          }
        }
      }
    });
};

export default i18nSetup;

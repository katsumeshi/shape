import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

export const notificationSet = async () => {
  PushNotification.configure({
    onRegister: function(token) {
      console.log("TOKEN:", token);
    },
    onNotification: function(notification) {
      console.log("NOTIFICATION:", notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    senderID: "YOUR GCM (OR FCM) SENDER ID",
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    popInitialNotification: true,
    requestPermissions: true
  });
  PushNotification.cancelAllLocalNotifications();
  let notifStr = await AsyncStorage.getItem("notif");
  if (!notifStr) {
    notifStr = "true";
    AsyncStorage.setItem("notif", notifStr);
  }

  let notifUnixTimeStr = await AsyncStorage.getItem("notifUnixTime");
  if (!notifUnixTimeStr) {
    notifUnixTimeStr = `${moment()
      .startOf("d")
      .add(7, "h")
      .unix()}`;
    AsyncStorage.setItem("notifUnixTime", notifUnixTimeStr);
  }

  const notif = notifStr === "true";
  if (notif) {
    const unixTime = parseInt(notifUnixTimeStr);
    PushNotification.localNotificationSchedule({
      id: "scale",
      message: "本日の体重測定お済みですか？",
      date: moment.unix(unixTime).toDate(),
      repeatType: "day"
    });
  }
};

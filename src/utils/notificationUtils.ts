import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

const notificationSet = async () => {
  PushNotification.configure({
    onRegister(token) {
      console.log("TOKEN:", token);
    },
    onNotification(notification) {
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
  const notif = notifStr === "true";
  if (notifUnixTimeStr && notif) {
    const unixTime = parseInt(notifUnixTimeStr, 10);
    PushNotification.localNotificationSchedule({
      id: "scale",
      message: "本日の体重測定お済みですか？",
      date: moment.unix(unixTime).toDate(),
      repeatType: "day"
    });
  } else {
    notifUnixTimeStr = `${moment()
      .startOf("d")
      .add(7, "h")
      .unix()}`;
    AsyncStorage.setItem("notifUnixTime", notifUnixTimeStr);
  }
};

export default notificationSet;

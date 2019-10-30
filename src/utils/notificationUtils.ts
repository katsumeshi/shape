import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

export const removeNotifications = () => {
  PushNotification.cancelLocalNotifications({ id: "1" });
};
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
  removeNotifications();
  let notifStr = await AsyncStorage.getItem("notif");
  if (!notifStr) {
    notifStr = "true";
    AsyncStorage.setItem("notif", notifStr);
  }
  const notifUnixTimeStr = await AsyncStorage.getItem("notifUnixTime");
  const notif = notifStr === "true";
  if (notifUnixTimeStr && notif) {
    const unixTime = parseInt(notifUnixTimeStr, 10);
    const targetMoment = moment.unix(unixTime);
    if (targetMoment.isBefore(moment())) {
      targetMoment.add(1, "d");
    }
    PushNotification.localNotificationSchedule({
      id: "1",
      userInfo: { id: "1" },
      message: "本日の体重測定お済みですか？",
      date: targetMoment.toDate(),
      repeatType: "day"
    });
  }
};

export default notificationSet;

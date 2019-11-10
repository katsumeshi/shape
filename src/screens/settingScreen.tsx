import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  SectionList,
  Alert,
  Text,
  View,
  DatePickerIOS,
  Switch,
  StyleSheet,
  Platform,
  TimePickerAndroid
} from "react-native";
import { ListItem } from "react-native-elements";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import notificationSet from "../utils/notificationUtils";

import { Button } from "../components/common";
import { BLACK } from "../constants";
import { AuthState } from "../state/modules/auth/types";
import ShapeHeader from "../components/header";
import { authLogoutAction } from "../state/modules/auth/actions";

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  headerDivider: { borderColor: "lightgrey", borderWidth: 1, height: 1 },
  headerTitle: { fontSize: 18, color: BLACK },
  headerContainer: { zIndex: 100, backgroundColor: "white" },
  listItem: { height: 50, backgroundColor: "white" },
  listItemRightText: { color: "#666", fontSize: 18 }
});

const defaultAlert = moment()
  .hours(7)
  .minutes(0);

const SettingList = () => {
  const [showPicker, onShowPicker] = useState(false);
  const [date, onDateChange] = useState(defaultAlert.toDate());
  const [notification, onChangeNotification] = useState(true);

  useEffect(() => {
    const didMount = async () => {
      let notifUnixTime = await AsyncStorage.getItem("notifUnixTime");
      if (!notifUnixTime) {
        notifUnixTime = `${defaultAlert.unix()}`;
        console.warn(notifUnixTime);
        await AsyncStorage.setItem("notifUnixTime", notifUnixTime);
      }
      const notifDate = moment.unix(parseInt(notifUnixTime, 10)).toDate();
      onDateChange(notifDate);
    };
    didMount();
  }, []);

  useEffect(() => {
    const dateChanged = async () => {
      const m = moment()
        .hour(date.getHours())
        .minute(date.getMinutes());
      await AsyncStorage.setItem("notifUnixTime", `${m.unix()}`);
      await notificationSet();
    };
    dateChanged();
  }, [date]);

  useEffect(() => {
    const notifChanged = async () => {
      await AsyncStorage.setItem("notif", `${notification}`);
      await notificationSet();
    };
    notifChanged();
  }, [notification]);

  const { t } = useTranslation();
  const sectionData = [
    {
      left: t("version"),
      right: <Text style={styles.listItemRightText}>{DeviceInfo.getVersion()}</Text>,
      isDatePicker: false,
      onPress: () => {}
    },
    {
      left: t("notifications"),
      right: <Switch value={notification} onValueChange={onChangeNotification} />,
      isDatePicker: false,
      onPress: () => {}
    }
  ];

  // console.warn(date);

  if (notification) {
    sectionData.push({
      left: "",
      right: <Text style={styles.listItemRightText}>{moment(date).format("LT")}</Text>,
      isDatePicker: true,
      onPress: async () => {
        if (Platform.OS === "ios") {
          onShowPicker(!showPicker);
        } else {
          try {
            const result = await TimePickerAndroid.open({
              hour: date.getHours(),
              minute: date.getMinutes()
            });
            if (result.action !== TimePickerAndroid.dismissedAction) {
              const { hour, minute } = result;
              const updateDate = new Date();
              updateDate.setHours(hour);
              updateDate.setMinutes(minute);
              onDateChange(updateDate);
            } else {
              onDateChange(date);
            }
          } catch ({ code, message }) {
            console.warn("Cannot open date picker", message);
          }
        }
      }
    });
  }
  return (
    <SectionList
      renderItem={({ item }) => (
        <>
          <ListItem
            onPress={item.onPress}
            containerStyle={styles.listItem}
            title={item.left}
            bottomDivider
            rightElement={item.right}
          />
          {item.isDatePicker && showPicker && Platform.OS === "ios" && (
            <DatePickerIOS date={date} mode="time" onDateChange={onDateChange} />
          )}
        </>
      )}
      sections={[
        {
          title: t("settings"),
          data: sectionData
        }
      ]}
      keyExtractor={(item, index) => item + index}
    />
  );
};
const LogoutButton = ({ logoutAction }: { logoutAction: () => void }) => {
  const { t } = useTranslation();
  return (
    <Button
      title={t("logout")}
      style={styles.button}
      onPress={() => {
        Alert.alert(
          t("confirmation"),
          t("logoutConfirmation"),
          [
            {
              text: t("cancel"),
              style: "cancel"
            },
            {
              text: t("logout"),
              onPress: () => {
                logoutAction();
              }
            }
          ],
          { cancelable: true }
        );
      }}
    />
  );
};

const ScaleScreenHeader = () => {
  const { t } = useTranslation();
  return (
    <>
      <ShapeHeader
        containerStyle={styles.headerContainer}
        centerComponent={<Text style={styles.headerTitle}>{t("settings")}</Text>}
      />
      <View style={styles.headerDivider} />
    </>
  );
};

const ScaleScreen = ({ logoutAction }: { logoutAction: any }) => {
  return (
    <>
      <ScaleScreenHeader />
      <SettingList />
      <LogoutButton logoutAction={logoutAction} />
    </>
  );
};

export default connect(
  ({ auth }: { auth: AuthState }) => ({
    auth: auth.data
  }),
  { logoutAction: authLogoutAction }
)(ScaleScreen);

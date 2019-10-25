import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  SectionList,
  Alert,
  Text,
  View,
  DatePickerIOS,
  Switch,
  StyleSheet
} from "react-native";
import { Header, ListItem } from "react-native-elements";
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import notificationSet from "../utils/notificationUtils";

import { Button } from "../components/common";
import { BLACK } from "../constants";
import { AuthModel, AuthState } from "../state/modules/auth/types";

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

const SettingList = () => {
  const [showPicker, onShowPicker] = useState(false);
  const [date, onDateChange] = useState(new Date());
  const [notification, onChangeNotification] = useState(true);

  useEffect(() => {
    async function didMount() {
      const notifUnixTime =
        (await AsyncStorage.getItem("notifUnixTime")) || `${moment().unix()}`;
      const notifDate = moment.unix(parseInt(notifUnixTime, 10)).toDate();
      onDateChange(notifDate);
    }
    didMount();
  }, []);

  useEffect(() => {
    async function dateChanged() {
      const m = moment()
        .hour(moment(date).hour())
        .minute(moment(date).minute());
      await AsyncStorage.setItem("notifUnixTime", `${m.unix()}`);
      notificationSet();
    }
    dateChanged();
  }, [date]);

  useEffect(() => {
    async function notifChanged() {
      await AsyncStorage.setItem("notif", `${notification}`);
      notificationSet();
    }
    notifChanged();
  }, [notification]);

  const sectionData = [
    {
      left: "バージョン",
      right: DeviceInfo.getVersion(),
      isDatePicker: false,
      onPress: () => {}
    },
    {
      left: "プッシュ通知",
      right: (
        <Switch value={notification} onValueChange={onChangeNotification} />
      ),
      isDatePicker: false,
      onPress: () => {}
    }
  ];

  if (notification) {
    sectionData.push({
      left: "",
      right: `${moment(date).format("LT")}`,
      isDatePicker: true,
      onPress: () => onShowPicker(!showPicker)
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
            rightElement={
              <View>
                <Text style={styles.listItemRightText}>{item.right}</Text>
              </View>
            }
          />
          {item.isDatePicker && showPicker && (
            <DatePickerIOS
              date={date}
              mode="time"
              onDateChange={onDateChange}
            />
          )}
        </>
      )}
      sections={[
        {
          title: "設定",
          data: sectionData
        }
      ]}
      keyExtractor={(item, index) => item + index}
    />
  );
};

const LogoutButton = () => (
  <Button
    title="ログアウト"
    style={styles.button}
    onPress={() => {
      Alert.alert(
        "確認",
        "本当にログアウトしますか？",
        [
          {
            text: "キャンセル",
            style: "cancel"
          },
          {
            text: "ログアウト",
            onPress: () => {
              AsyncStorage.clear();
              firebase.auth().signOut();
            }
          }
        ],
        { cancelable: true }
      );
    }}
  />
);

const ScaleScreenHeader = () => (
  <>
    <Header
      containerStyle={styles.headerContainer}
      centerComponent={<Text style={styles.headerTitle}>設定</Text>}
    />
    <View style={styles.headerDivider} />
  </>
);

const ScaleScreen = ({
  auth,
  navigation
}: {
  auth: AuthModel;
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  useEffect(() => {
    if (auth.isLoggedIn !== undefined) {
      navigation.navigate(auth.isLoggedIn ? "App" : "Auth");
    }
  });

  return (
    <>
      <ScaleScreenHeader />
      <SettingList />
      <LogoutButton />
    </>
  );
};

export default connect(({ auth }: { auth: AuthState }) => ({
  auth: auth.data
}))(ScaleScreen);

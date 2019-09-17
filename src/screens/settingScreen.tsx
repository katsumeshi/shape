import moment from "moment";
import React, { useState, useEffect } from "react";
import { SectionList, Dimensions, Alert, KeyboardAvoidingView, Text, TouchableOpacity, TouchableWithoutFeedback, View, DatePickerIOS, Switch } from "react-native";
import { Header, Icon, ListItem } from "react-native-elements";
import { compose, withState, withHandlers, withProps, withStateHandlers } from "recompose";
import { BLACK, THEME_COLOR } from "../constants";
import { Button } from "../components/common";
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import { notificationSet } from "../utils/notificationUtils";

import { connect } from "react-redux";

const SettingList = () => {
  const [showPicker, onShowPicker] = useState(false);
  const [date, onDateChange] = useState(new Date());
  const [notification, onChangeNotification] = useState(true);

  useEffect(() => {
    async function didMount() {
      const notifUnixTime = (await AsyncStorage.getItem("notifUnixTime")) || `${moment().unix()}`;
      const notifDate = moment.unix(parseInt(notifUnixTime)).toDate();
      onDateChange(notifDate);
    }
    didMount();
  }, []);

  useEffect(() => {
    async function dateChanged() {
      let m = moment()
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

  const data = [
    {
      left: "バージョン",
      right: DeviceInfo.getVersion()
    },
    {
      left: "プッシュ通知",
      right: <Switch value={notification} onValueChange={onChangeNotification} />
    }
  ];

  if (notification) {
    data.push({
      left: "",
      right: `${moment(date).format("LT")}`,
      isDatePicker: true,
      onPress: () => onShowPicker(!showPicker)
    });
  }
  return (
    <SectionList
      renderItem={({ item, index, section }) => (
        <>
          <ListItem
            onPress={item.onPress}
            style={{ height: 50, backgroundColor: "lightgrey" }}
            title={item.left}
            bottomDivider
            // rightTitle={<Text style={{ color: "#666", fontSize: 18 }}>{item.right}</Text>}
            rightElement={<Text style={{ color: "#666", fontSize: 18 }}>{item.right}</Text>}
          />
          {item.isDatePicker && showPicker && <DatePickerIOS date={date} mode="time" onDateChange={onDateChange} />}
        </>
      )}
      sections={[
        {
          title: "設定",
          data: data
        }
      ]}
      keyExtractor={(item, index) => item + index}
    />
  );
};

// const LoginScreen = props => {
//   useEffect(() => {
//     props.navigation.navigate(props.auth.isLoggedIn ? "App" : "Auth");
//   });

// class ScaleScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isDatePickerShowing: false
//     };
//   }

const ScaleScreen = props => {
  useEffect(() => {
    if (props.auth.isLoggedIn !== undefined) {
      props.navigation.navigate(props.auth.isLoggedIn ? "App" : "Auth");
    }
  });

  return (
    <>
      <Header
        containerStyle={{ zIndex: 200 }}
        centerComponent={<Text style={{ fontSize: 18, color: BLACK }}>設定</Text>}
        containerStyle={{
          backgroundColor: "white"
        }}
      />
      <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
      <SettingList />
      <Button
        title={"ログアウト"}
        style={{}}
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
    </>
  );
};

// const enhance = compose(withState("showPicker", "onShowPicker", false));

// export default enhance(ScaleScreen);

export default connect(
  state => ({ auth: state.auth })
  // { requestLoginStatus }
)(ScaleScreen);

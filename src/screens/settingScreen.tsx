import moment from "moment";
import React from "react";
import { SectionList, Dimensions, Alert, KeyboardAvoidingView, Text, TouchableOpacity, TouchableWithoutFeedback, View, DatePickerIOS } from "react-native";
import { Header, Icon, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import { compose, lifecycle, withHandlers, withProps, withStateHandlers } from "recompose";
import DatePicker from "../components/datePicker";
import { BLACK, THEME_COLOR } from "../constants";
import { Button } from "../components/common";
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info";

const { height, width } = Dimensions.get("window");
const margin = 8;
const BUTTON_WIDTH = width / 3 - margin;

const limitWeight = text => {
  const arr = text.split(".");
  let weight = arr[0];
  if (arr.length > 1) {
    weight = `${arr[0]}.${arr[1].slice(0, 1)}`;
  }
  return weight;
};
const format = weight => `${weight}`;

const add = (weight, add) => {
  const result = (weight * 10 + add * 10) / 10;
  return format(`${result > 0 ? result : 0}`);
};

class ScaleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDatePickerShowing: false
    };
  }

  public render() {
    return (
      <>
        <Header
          containerStyle={{ zIndex: 200 }}
          leftComponent={

              // <TouchableOpacity
              //   onPress={() => {
              //     this.ActionSheet.show();
              //   }}
              // >
              //   <Icon type="evilicon" size={28} color={THEME_COLOR} name="gear" />
              // </TouchableOpacity>

          }
          centerComponent={<Text style={{ fontSize: 18, color: BLACK }}>設定</Text>}
          rightComponent={

              // <TouchableOpacity
              //   onPress={() => {
              //     this.props.navigation.navigate("Scale");
              //   }}
              // >
              //   <Text style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}>追加</Text>
              // </TouchableOpacity>

          }
          containerStyle={{
            backgroundColor: "white"
          }}
        />
        <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
        <SectionList
          renderItem={({ item, index, section }) => (
            <>
              <ListItem
                onPress={item.onPress}
                style={{ height: 50, backgroundColor: "lightgrey" }}
                title={item.left}
                topDivider
                rightTitle={<Text style={{ color: "#666", fontSize: 18 }}>{item.right}</Text>}
              />
              {item.isDatePicker && this.state.showPicker && <DatePickerIOS date={this.state.time || new Date()} mode="time" onDateChange={time => this.setState({ time })} />}
            </>
          )}
          renderSectionHeader={({ section: { title } }) => <Text style={{ fontWeight: "bold", backgroundColor: "lightgrey" }}>{title}</Text>}
          sections={[
            {
              title: "設定",
              data: [
                {
                  left: "バージョン",
                  right: DeviceInfo.getVersion()
                },
                {
                  left: "プッシュ通知",
                  right: `${moment(this.state.time).format("LT")}`,
                  isDatePicker: true,
                  onPress: () => {
                    this.setState({ showPicker: !this.state.showPicker });
                  }
                }
              ]
            }
          ]}
          keyExtractor={(item, index) => item + index}
          //   ListFooterComponent={
          //     <Button
          //       title={"ログアウト"}
          //       style={{}}
          //       onPress={() => {
          //         firebase.auth().signOut();
          //       }}
          //     />
          //   }
        />
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
                  onPress: () => firebase.auth().signOut()
                }
              ],
              { cancelable: true }
            );
            // firebase.auth().signOut();
          }}
        />
      </>
    );
  }
}

const enhance = compose(
  withFirestore,
  connect(props => {
    let weight = 0;
    if (props.firestore && Object.values(props.firestore.ordered)[0].length > 0) {
      weight = Object.values(props.firestore.ordered)[0][0].weight;
    }
    return {
      uid: props.firebase.auth.uid,
      weight
    };
  }),
  withStateHandlers(null, {
    onDateChange: () => date => ({ date }),
    onWeightChange: () => weight => ({ weight })
  }),
  withProps(({ navigation, date, weight }) => {
    return {
      date: date || navigation.getParam("date", new Date()),
      weight: format(weight || navigation.getParam("weight", weight))
    };
  }),
  withHandlers({
    delete: ({ firestore, uid, date }) => () => {
      firestore.delete({
        collection: `users/${uid}/health`,
        doc: moment(date).format("YYYY-MM-DD")
      });
    },
    save: ({ firestore, uid, weight, date }) => () => {
      firestore.set(
        {
          collection: `users/${uid}/health`,
          doc: moment(date).format("YYYY-MM-DD")
        },
        { weight: parseFloat(weight || 0), date }
      );
    },
    load: ({ firestore, uid }) => () =>
      firestore.get({
        collection: `users/${uid}/health`,
        orderBy: ["date", "desc"],
        limit: 1
      })
  }),
  lifecycle({
    componentDidMount() {}
  })
);

export default enhance(ScaleScreen);

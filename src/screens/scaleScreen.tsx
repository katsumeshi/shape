import moment from "moment";
import React from "react";
import { DatePickerAndroid, Dimensions, Keyboard, KeyboardAvoidingView, Text, TouchableOpacity, TouchableWithoutFeedback, View, Platform } from "react-native";
import { Button, Header, Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import { compose, lifecycle, withHandlers, withProps, withStateHandlers } from "recompose";
import DatePicker from "../components/datePicker";
import { BLACK, THEME_COLOR } from "../constants";

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
      <React.Fragment>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                // this.props.save();
                this.props.navigation.goBack();
              }}
            >
              <View style={{ top: -3 }}>
                <Icon type="font-awesome" size={40} color={THEME_COLOR} name="angle-left" />
              </View>
              <Text style={{ left: 4, fontSize: 18, color: THEME_COLOR }}>戻る</Text>
            </TouchableOpacity>
          }
          centerComponent={<Text style={{ fontSize: 18, color: BLACK }}>体重記録</Text>}
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.save();
                this.props.navigation.goBack();
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}>保存</Text>
            </TouchableOpacity>
          }
          containerStyle={{
            backgroundColor: "white"
          }}
        />
        <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              this.props.onWeightChange(format(this.props.weight));
            }}
            accessible={false}
          >
            <View
              style={{
                marginHorizontal: margin,
                flex: 2,
                justifyContent: "center"
              }}
            >
              <View>
                <Button
                  buttonStyle={{
                    marginHorizontal: 16,
                    marginBottom: 20,
                    backgroundColor: "white"
                  }}
                  type="outline"
                  title={`${moment(this.props.date).format("YYYY/MM/DD")}`}
                  onPress={async () => {
                    if (Platform.OS === "ios") {
                      this.setState({ isDatePickerShowing: true });
                    } else {
                      try {
                        const { action, year, month, day } = await DatePickerAndroid.open({
                          date: moment(this.props.date).toDate()
                        });
                        if (action !== DatePickerAndroid.dismissedAction) {
                          this.props.onDateChange(new Date(year, month, day));
                        } else {
                          this.props.onDateChange(moment(this.props.date).toDate());
                        }
                      } catch ({ code, message }) {
                        console.warn("Cannot open date picker", message);
                      }
                    }
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <Button
                    buttonStyle={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      marginHorizontal: 16,
                      backgroundColor: THEME_COLOR
                    }}
                    onPress={() => {
                      this.props.onWeightChange(add(this.props.weight, -0.1));
                    }}
                    icon={{ type: "feather", color: "white", name: "minus" }}
                  />
                  <Input
                    containerStyle={{ flex: 1, marginRight: 16 }}
                    inputStyle={{
                      textAlign: "center",
                      fontSize: 18
                    }}
                    inputContainerStyle={{
                      borderBottomWidth: 2,
                      borderWidth: 0,
                      borderRadius: 0
                    }}
                    keyboardType="numeric"
                    placeholder="00.00"
                    onSubmitEditing={() => {
                      this.props.onWeightChange(format(this.props.weight));
                    }}
                    onChangeText={text => {
                      this.props.onWeightChange(limitWeight(text));
                    }}
                    maxLength={5}
                    value={this.props.weight}
                  />
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>kg</Text>
                  </View>
                  <Button
                    buttonStyle={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      marginHorizontal: 16,
                      backgroundColor: THEME_COLOR
                    }}
                    onPress={() => {
                      // console.warn(add(this.props.weight, 0.1));
                      this.props.onWeightChange(add(this.props.weight, 0.1));
                    }}
                    icon={{ type: "feather", color: "white", name: "plus" }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {this.state.isDatePickerShowing && (
          <DatePicker
            date={new Date()}
            onCancel={() => {
              this.setState({ isDatePickerShowing: false });
            }}
            onDone={date => {
              this.props.onDateChange(date);
              this.setState({ isDatePickerShowing: false });
            }}
          />
        )}
      </React.Fragment>
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

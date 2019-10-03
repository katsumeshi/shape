import moment from "moment";
import React from "react";
import {
  DatePickerAndroid,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform
} from "react-native";
import { Button, Header, Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import DatePicker from "../components/datePicker";
import { BLACK, THEME_COLOR } from "../constants";

const margin = 8;

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
    const type = this.props.navigation.getParam("type");
    const date =
      type === "create" ? new Date() : this.props.navigation.getParam("date");
    const weight =
      type === "create"
        ? `${this.props.weight}`
        : this.props.navigation.getParam("weight");
    return (
      <>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <View style={{ top: -3 }}>
                <Icon
                  type="font-awesome"
                  size={40}
                  color={THEME_COLOR}
                  name="angle-left"
                />
              </View>
              <Text style={{ left: 4, fontSize: 18, color: THEME_COLOR }}>
                戻る
              </Text>
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={{ fontSize: 18, color: BLACK }}>体重記録</Text>
          }
          rightComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.save();
                this.props.navigation.goBack();
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}
              >
                保存
              </Text>
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
              this.props.onWeightChange(format(weight));
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
                  title={`${moment(date).format("YYYY/MM/DD")}`}
                  onPress={async () => {
                    if (Platform.OS === "ios") {
                      this.setState({ isDatePickerShowing: true });
                    } else {
                      try {
                        const {
                          action,
                          year,
                          month,
                          day
                        } = await DatePickerAndroid.open({
                          date
                        });
                        if (action !== DatePickerAndroid.dismissedAction) {
                          this.props.onDateChange(new Date(year, month, day));
                        } else {
                          this.props.onDateChange(date);
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
                      this.props.onWeightChange(add(weight, -0.1));
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
                      this.props.onWeightChange(format(weight));
                    }}
                    onChangeText={text => {
                      this.props.onWeightChange(limitWeight(text));
                    }}
                    maxLength={5}
                    value={weight}
                  />
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
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
                      this.props.onWeightChange(add(weight, 0.1));
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
      </>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  ...state.health.data[0]
}))(ScaleScreen);

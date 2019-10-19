import moment from "moment";
import React, { useState } from "react";
import {
  DatePickerAndroid,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet
} from "react-native";
import { Button, Header, Icon, Input } from "react-native-elements";
import { connect } from "react-redux";
import DatePicker from "../components/datePicker";
import { BLACK, THEME_COLOR } from "../constants";
import { updateWeight } from "../services/firebase";

const margin = 8;

const limitWeight = text => {
  const arr = text.split(".");
  let weight = arr[0];
  if (arr.length > 1) {
    weight = `${arr[0]}.${arr[1].slice(0, 1)}`;
  }
  return weight;
};

const addWeight = (weight, add) => {
  const result = (weight * 10 + add * 10) / 10;
  return `${result > 0 ? result : 0}`;
};

const ScaleRow = ({ weight, onWeightChange }) => (
  <View style={{ flexDirection: "row" }}>
    <Button
      buttonStyle={styles.button}
      onPress={() => {
        onWeightChange(addWeight(weight, -0.1));
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
        onWeightChange(`${weight}`);
      }}
      onChangeText={text => {
        onWeightChange(limitWeight(text));
      }}
      maxLength={5}
      value={weight}
    />
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>kg</Text>
    </View>
    <Button
      buttonStyle={styles.button}
      onPress={() => {
        onWeightChange(addWeight(weight, 0.1));
      }}
      icon={{ type: "feather", color: "white", name: "plus" }}
    />
  </View>
);

const DateRow = ({ date, onShowDatePicker, onDateChange }) => (
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
        onShowDatePicker(true);
      } else {
        try {
          const { action, year, month, day } = await DatePickerAndroid.open({
            date
          });
          if (action !== DatePickerAndroid.dismissedAction) {
            onDateChange(new Date(year, month, day));
          } else {
            onDateChange(date);
          }
        } catch ({ code, message }) {
          console.warn("Cannot open date picker", message);
        }
      }
    }}
  />
);

const ScaleScreenHeader = ({ navigation, weight, date }) => (
  <Header
    leftComponent={
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={() => {
          navigation.goBack();
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
        <Text style={{ left: 4, fontSize: 18, color: THEME_COLOR }}>戻る</Text>
      </TouchableOpacity>
    }
    centerComponent={
      <Text style={{ fontSize: 18, color: BLACK }}>体重記録</Text>
    }
    rightComponent={
      <TouchableOpacity
        onPress={() => {
          updateWeight(date, weight);
          navigation.goBack();
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: THEME_COLOR }}>
          保存
        </Text>
      </TouchableOpacity>
    }
    containerStyle={{
      backgroundColor: "white"
    }}
  />
);

const ScaleScreen = ({ navigation, weight }) => {
  const type = navigation.getParam("type");
  const defaultDate =
    type === "create" ? new Date() : navigation.getParam("date");
  const [date, onDateChange] = useState(defaultDate);
  const defaultWeight =
    type === "create" ? `${weight}` : navigation.getParam("weight");

  const [_weight, onWeightChange] = useState(defaultWeight);

  const [showDatePicker, onShowDatePicker] = useState(false);

  return (
    <>
      <ScaleScreenHeader
        navigation={navigation}
        date={date}
        weight={parseFloat(_weight)}
      />
      <View style={{ borderColor: "lightgrey", borderWidth: 1, height: 1 }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            onWeightChange(`${_weight}`);
          }}
          accessible={false}
        >
          <View style={styles.container}>
            <DateRow
              date={date}
              onDateChange={onDateChange}
              onShowDatePicker={onShowDatePicker}
            />
            <ScaleRow weight={_weight} onWeightChange={onWeightChange} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <DatePicker
        visible={showDatePicker}
        date={date}
        onCancel={() => {
          onShowDatePicker(false);
        }}
        onDone={newDate => {
          onDateChange(newDate);
          onShowDatePicker(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margin,
    flex: 2,
    justifyContent: "center"
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginHorizontal: 16,
    backgroundColor: THEME_COLOR
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default connect(
  state => ({
    auth: state.auth,
    ...state.health.data[0]
  })
  // {
  //   updateWeight
  // }
)(ScaleScreen);

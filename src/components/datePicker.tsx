import React, { useState } from "react";
import {
  DatePickerIOS,
  Dimensions,
  View,
  StyleSheet,
  Modal
} from "react-native";
import { Button } from "react-native-elements";

const { height, width } = Dimensions.get("window");

const DatePickerPanel = ({ date, onCancel, onDone, onDateChange }) => (
  <View style={{ backgroundColor: "white" }}>
    <View style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
      <View style={styles.header}>
        <Button title="Cancel" type="clear" onPress={onCancel} />
        <Button title="Done" type="clear" onPress={onDone} />
      </View>
    </View>
    <DatePickerIOS date={date} mode="date" onDateChange={onDateChange} />
  </View>
);

const DatePicker = props => {
  const defaultDate = props.date;
  const [date, onDate] = useState(defaultDate);
  return (
    <Modal animationType="fade" transparent visible={props.visible}>
      <View style={styles.container}>
        <DatePickerPanel
          date={date}
          onDateChange={date => {
            onDate(date);
          }}
          onCancel={() => props.onCancel()}
          onDone={() => {
            props.onDone(date);
          }}
        />
      </View>
    </Modal>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    height,
    width,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8
  },
  headerLeft: {}
});

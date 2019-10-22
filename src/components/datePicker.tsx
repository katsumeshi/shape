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

const DatePickerPanel = ({
  date,
  onCancel,
  onDone,
  onDateChange
}: {
  date: Date;
  onCancel: () => void;
  onDone: () => void;
  onDateChange: (newDate: Date) => void;
}) => (
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

const DatePicker = ({
  defaultDate,
  onCancel,
  onDone,
  visible
}: {
  defaultDate: Date;
  onCancel: () => void;
  onDone: (newDate: Date) => void;
  visible: boolean;
}) => {
  const [date, onDate] = useState(defaultDate);
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <DatePickerPanel
          date={date}
          onDateChange={(newDate: Date) => {
            onDate(newDate);
          }}
          onCancel={() => onCancel()}
          onDone={() => {
            onDone(date);
          }}
        />
      </View>
    </Modal>
  );
};

export default DatePicker;

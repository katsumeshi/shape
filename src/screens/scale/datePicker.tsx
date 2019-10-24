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

const DatePicker = ({
  defaultDate,
  onCancel,
  onDone,
  visible,
  maximumDate
}: {
  defaultDate: Date;
  onCancel: () => void;
  onDone: (newDate: Date) => void;
  visible: boolean;
  maximumDate?: Date;
}) => {
  const [date, onDate] = useState(defaultDate);
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <View style={{ backgroundColor: "white" }}>
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
            <View style={styles.header}>
              <Button title="Cancel" type="clear" onPress={onCancel} />
              <Button title="Done" type="clear" onPress={() => onDone(date)} />
            </View>
          </View>
          <DatePickerIOS
            date={date}
            mode="date"
            onDateChange={(newDate: Date) => {
              onDate(newDate);
            }}
            maximumDate={maximumDate}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;

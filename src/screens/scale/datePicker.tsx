import React, { useState } from "react";
import { DatePickerIOS, Dimensions, View, StyleSheet, Modal } from "react-native";
import { Button } from "react-native-elements";
import { useTranslation } from "react-i18next";

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
  maximumDate,
  minimumDate
}: {
  defaultDate: Date;
  onCancel: () => void;
  onDone: (newDate: Date) => void;
  visible: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}) => {
  const [date, onDate] = useState(defaultDate);
  const { t } = useTranslation();
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <View style={{ backgroundColor: "white" }}>
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
            <View style={styles.header}>
              <Button title={t("cancel")} type="clear" onPress={onCancel} />
              <Button title={t("done")} type="clear" onPress={() => onDone(date)} />
            </View>
          </View>
          <DatePickerIOS
            date={date}
            mode="date"
            onDateChange={(newDate: Date) => {
              onDate(newDate);
            }}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DatePicker;

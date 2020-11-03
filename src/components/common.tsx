import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  DatePickerAndroid
} from "react-native";
import moment from "moment";
import { THEME_COLOR } from "../constants";
import DatePicker from "../screens/scale/datePicker";

const styles = StyleSheet.create({
  title: {
    fontFamily: "futura",
    fontWeight: "bold",
    color: THEME_COLOR,
    fontSize: 60,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    borderWidth: 1
  },
  text: { textAlign: "center", fontSize: 16 }
});

export const AppTitle = () => <Text style={styles.title}>Shape.</Text>;

interface Props {
  title: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  style?: object;
  onPress?: () => void;
  iconComp?: JSX.Element;
  disabled?: boolean;
  border?: boolean;
}

export const Button = (props: Props) => {
  const { title, color = THEME_COLOR, border, style, onPress, iconComp, disabled } = props;
  return (
    <View style={[style]}>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: border ? "transparent" : color,
          borderColor: border ? color : "transparent"
        }}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={{ position: "absolute", left: "16%" }}>{iconComp}</View>
        <Text style={{ ...styles.text, color: border ? color : "white" }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

interface ToggleButtonProps {
  title: string;
  color?: string;
  backgroundColor?: string;
  style?: object;
  onPress?: () => void;
  iconComp?: JSX.Element;
  disabled?: boolean;
  on: boolean;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { title, on, backgroundColor = THEME_COLOR, style, onPress, iconComp, disabled } = props;
  return (
    <View style={[style]}>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: on ? backgroundColor : "white",
          borderColor: on ? "white" : backgroundColor
        }}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={{ position: "absolute", left: "16%" }}>{iconComp}</View>
        <Text style={{ ...styles.text, color: on ? "white" : backgroundColor }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const DateButton = ({
  date,
  style,
  border,
  onDateChange
}: {
  date: Date;
  style: any;
  border?: any;
  onDateChange: (date: Date) => void;
}) => {
  const [showDatePicker, onShowDatePicker] = useState(false);
  return (
    <View style={style}>
      <Button
        border={border}
        title={`${moment(date).format("YYYY/MM/DD")}`}
        onPress={async () => {
          if (Platform.OS === "ios") {
            onShowDatePicker(true);
          } else {
            try {
              const result = await DatePickerAndroid.open({
                date
              });
              if (result.action !== DatePickerAndroid.dismissedAction) {
                const { year, month, day } = result;
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
      <DatePicker
        visible={showDatePicker}
        defaultDate={date}
        onCancel={() => {
          onShowDatePicker(false);
        }}
        onDone={(newDate: Date) => {
          onDateChange(newDate);
          onShowDatePicker(false);
        }}
        maximumDate={moment().toDate()}
        minimumDate={moment()
          .subtract("y", 100)
          .toDate()}
      />
    </View>
  );
};

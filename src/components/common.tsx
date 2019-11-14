import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { THEME_COLOR } from "../constants";

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
  buttonContainer: {},
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
}

export const Button = (props: Props) => {
  const {
    title,
    color = "white",
    backgroundColor = THEME_COLOR,
    borderColor = "transparent",
    style,
    onPress,
    iconComp,
    disabled
  } = props;
  return (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor, borderColor }}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={{ position: "absolute", left: "16%" }}>{iconComp}</View>
        <Text style={{ ...styles.text, color }}>{title}</Text>
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
    <View style={[styles.buttonContainer, style]}>
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

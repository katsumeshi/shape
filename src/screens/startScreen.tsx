import React from "react";
import { ImageBackground, PixelRatio, View, StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { AppTitle, Button } from "../components/common";
import { Navigation } from "../types";

interface Props {
  navigation: Navigation;
}

const hasNotch = DeviceInfo.hasNotch();

const goToLogin = (navigation: Navigation) => navigation.navigate("Login");

const Title = () => (
  <View style={styles.title}>
    <AppTitle />
  </View>
);

const StartButton = (props: Props) => (
  <View style={{ flexDirection: "row" }}>
    <Button
      title="アプリを始める"
      style={styles.button}
      onPress={() => goToLogin(props.navigation)}
    />
  </View>
);

const Space = () => (hasNotch ? <View style={styles.space} /> : null);

const StartScreen = (props: Props) => (
  <ImageBackground
    style={{ flex: 1 }}
    resizeMode="cover"
    source={require("../../images/introBackground.png")}
  >
    <Title />
    <StartButton {...props} />
    <Space />
  </ImageBackground>
);

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginBottom: 70 * PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    flex: 1,
    marginRight: 8,
    marginBottom: 60
  },
  space: {
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  }
});

export default StartScreen;

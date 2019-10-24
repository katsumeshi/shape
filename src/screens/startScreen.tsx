import React from "react";
import { ImageBackground, PixelRatio, View, StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { AppTitle, Button } from "../components/common";
import { Navigation } from "../types";

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginBottom: 70 * PixelRatio.get(),
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 60
  },
  space: {
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  }
});

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

const StartButton = ({ navigation }: { navigation: Navigation }) => (
  <View style={{ flexDirection: "row" }}>
    <Button
      title="アプリを始める"
      style={styles.button}
      onPress={() => goToLogin(navigation)}
    />
  </View>
);

const Space = () => (hasNotch ? <View style={styles.space} /> : null);

const StartScreen = ({ navigation }: { navigation: Navigation }) => (
  <ImageBackground
    style={{ flex: 1 }}
    resizeMode="cover"
    source={require("../../images/introBackground.png")}
  >
    <Title />
    <StartButton navigation={navigation} />
    <Space />
  </ImageBackground>
);

export default StartScreen;

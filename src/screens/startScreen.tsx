import React from "react";
import { ImageBackground, PixelRatio, View, StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { useTranslation } from "react-i18next";
import { AppTitle, Button } from "../components/common";

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
  navigation: NavigationScreenProp<NavigationState>;
}

const hasNotch = DeviceInfo.hasNotch();

const goToLogin = (navigation: NavigationScreenProp<NavigationState>) =>
  navigation.navigate("Login");

const Title = () => (
  <View style={styles.title}>
    <AppTitle />
  </View>
);

const StartButton = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: "row" }}>
      <Button
        title={t("getStarted")}
        style={styles.button}
        onPress={() => goToLogin(navigation)}
      />
    </View>
  );
};

const Space = () => (hasNotch ? <View style={styles.space} /> : null);

const StartScreen = ({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => (
  <ImageBackground
    style={{ flex: 1 }}
    resizeMode="cover"
    source={require("../../resources/images/introBackground.png")}
  >
    <Title />
    <StartButton navigation={navigation} />
    <Space />
  </ImageBackground>
);

export default StartScreen;

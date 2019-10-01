import React from "react";
import { ImageBackground, PixelRatio, View, StyleSheet } from "react-native";
import { AppTitle, Button } from "../components/common";
import DeviceInfo from "react-native-device-info";

const hasNotch = DeviceInfo.hasNotch();

const goToLogin = navigation => navigation.navigate("Login");

const StartScreen = props => {
	return (
		<ImageBackground style={{ flex: 1 }} resizeMode={"cover"} source={require("../../images/introBackground.png")}>
			<View style={styles.title}>
				<AppTitle />
			</View>
			<View style={{ flexDirection: "row" }}>
				<Button title={"アプリを始める"} style={styles.button} onPress={() => goToLogin(props.navigation)} />
			</View>
			{hasNotch && <View style={{ height: 10, backgroundColor: "rgba(0, 0, 0, 0.3)" }} />}
		</ImageBackground>
	);
};

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
	}
});

export default StartScreen;

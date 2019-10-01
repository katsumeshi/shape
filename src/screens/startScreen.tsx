import React from "react";
import { NavigationScreenProp } from "react-navigation";
import { ImageBackground, PixelRatio, View, StyleSheet } from "react-native";
import { AppTitle, Button } from "../components/common";
import DeviceInfo from "react-native-device-info";

type INavigation = NavigationScreenProp<any, any>;

interface IProps {
	navigation: INavigation;
}

const hasNotch = DeviceInfo.hasNotch();

const goToLogin = (navigation: INavigation) => navigation.navigate("Login");

const Title = () => (
	<View style={styles.title}>
		<AppTitle />
	</View>
);

const StartButton = (props: IProps) => (
	<View style={{ flexDirection: "row" }}>
		<Button title={"アプリを始める"} style={styles.button} onPress={() => goToLogin(props.navigation)} />
	</View>
);

const Space = () => (hasNotch ? <View style={styles.space} /> : null);

const StartScreen = (props: IProps) => {
	return (
		<ImageBackground style={{ flex: 1 }} resizeMode={"cover"} source={require("../../images/introBackground.png")}>
			<Title />
			<StartButton {...props} />
			<Space />
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
	},
	space: {
		height: 10,
		backgroundColor: "rgba(0, 0, 0, 0.3)"
	}
});

export default StartScreen;

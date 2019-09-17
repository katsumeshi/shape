import React from "react";
import { Alert, AppState, Dimensions, ImageBackground, PixelRatio, Text, View } from "react-native";
import firebase from "react-native-firebase";
import { GoogleSignin } from "react-native-google-signin";
import { AppTitle, Button } from "../components/common";
import DeviceInfo from "react-native-device-info";
import { getAllProducts2 } from "../redux/modules/auth";
import { connect } from "react-redux";

const hasNotch = DeviceInfo.hasNotch();

class StartScreen extends React.Component {
  public state = {
    appState: AppState.currentState
  };

  public async componentDidMount() {
    // this.props.getAllProducts2();
    // this.subscribe = firebase.links().onLink(async url => {
    //   try {
    //     await firebase.auth().signInWithEmailLink(this.props.login.email, url);
    //   } catch (e) {
    //     Alert.alert("認証失敗", "Eメールが正しく入力されているか確認してください。", [
    //       {
    //         text: "OK"
    //       }
    //     ]);
    //   }
    // });
    // await GoogleSignin.revokeAccess();
    // await GoogleSignin.signOut();
    // firebase.auth().onAuthStateChanged(user => {
    //   this.props.navigation.navigate(user ? "App" : "Auth");
    // });
  }

  public componentWillUnmount() {
    // if (this.subscribe) {
    //   this.subscribe();
    // }
  }

  public goToLogin = () => {
    this.props.navigation.navigate("Login");
  };

  public render() {
    return (
      <ImageBackground style={{ flex: 1 }} resizeMode={"cover"} source={require("../../images/introBackground.png")}>
        <View
          style={{
            flex: 1,
            marginBottom: 70 * PixelRatio.get(),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <AppTitle />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button title={"アプリを始める"} style={{ flex: 1, marginRight: 8, marginBottom: 60 }} onPress={this.goToLogin} />
        </View>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            justifyContent: "center",
            alignItems: "center"
          }}
        />
        {hasNotch && <View style={{ height: 10, backgroundColor: "rgba(0, 0, 0, 0.3)" }} />}
      </ImageBackground>
    );
  }
}

export default connect(
  state => ({
    // products: getAllProducts2(state),
    // total: getTotal(state),
    // error: getCheckoutError(state),
    // checkoutPending: isCheckoutPending(state),
  }),
  { getAllProducts2 }
)(StartScreen);

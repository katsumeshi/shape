import React from "react";
import { Alert, AppState, Dimensions, ImageBackground, PixelRatio, Text, View, TouchableOpacity } from "react-native";
import firebase from "react-native-firebase";
import { GoogleSignin } from "react-native-google-signin";
import { firestoreConnect, withFirestore } from "react-redux-firebase";

import { compose, withProps, withStateHandlers } from "recompose";
import { AppTitle, test } from "../components/common";
import { THEME_COLOR } from "../constants";
const { height, width } = Dimensions.get("window");
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import EStyleSheet from "react-native-extended-stylesheet";

import { connect } from "react-redux";

const hasNotch = DeviceInfo.hasNotch();

const styles = EStyleSheet.create({
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  button: {
    height: 44,
    borderRadius: 5,
    justifyContent: "center",
    borderWidth: 1
  },
  text: { textAlign: "center", fontSize: "1rem" }
});

const Button = ({ title, color = "white", backgroundColor = THEME_COLOR, borderColor = "transparent", style, onPress, iconComp }) => (
  <View style={[styles.buttonContainer, style]}>
    <TouchableOpacity style={{ ...styles.button, backgroundColor, borderColor }} onPress={onPress}>
      <View style={{ position: "absolute", left: "16%" }}>{iconComp}</View>
      <Text style={{ ...styles.text, color }}>{title}</Text>
    </TouchableOpacity>
  </View>
);

class StartScreen extends React.Component {
  public state = {
    appState: AppState.currentState
  };

  public async componentDidMount() {
    this.subscribe = firebase.links().onLink(async url => {
      try {
        await firebase.auth().signInWithEmailLink(this.props.login.email, url);
      } catch (e) {
        Alert.alert("認証失敗", "Eメールが正しく入力されているか確認してください。", [
          {
            text: "OK"
          }
        ]);
      }
    });
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }

  public componentWillUnmount() {
    if (this.subscribe) {
      this.subscribe();
    }
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

const enhance = compose(
  withFirestore,
  // connect((props) => {
  //   console.warn(props);
  //   return {};
  //   //   let weight = 0;
  //   //   if (props.firestore) {
  //   //     weight = Object.values(props.firestore.ordered)[0][0].weight;
  //   //   }
  //   //   return {
  //   //     uid: props.firebase.auth.uid,
  //   //     weight
  //   //   };
  // }),
  connect((state, ownProps) => ({
    login: state.login
  })),
  withStateHandlers(null, {
    onSubmit: () => email => ({ email })
    // onWeightChange: () => weight => ({ weight }),
  })
  // withProps((props) => {
  //   console.warn(props);
  //   return {};
  //   // return {
  //   //   date: navigation.getParam('date', date || new Date()),
  //   //   weight: format(navigation.getParam('weight', weight)),
  //   // }
  // }),
  // withHandlers({
  //   delete: ({ firestore, uid, date }) => () => {
  //     firestore.delete({
  //       collection: `users/${uid}/health`,
  //       doc: moment(date).format('YYYY-MM-DD'),
  //     })
  //   },
  //   save: ({ firestore, uid, weight, date }) => () => {
  //     firestore.set(
  //       {
  //         collection: `users/${uid}/health`,
  //         doc: moment(date).format('YYYY-MM-DD'),
  //       },
  //       { weight: parseFloat(weight || 0), date: date }
  //     )
  //   },
  //   load: ({ firestore, uid }) => () =>
  //     firestore.get({
  //       collection: `users/${uid}/health`,
  //       orderBy: ['date', 'desc'],
  //       limit: 1,
  //     }),
  // }),
  // lifecycle({
  //   componentDidMount() {},
  // })
);

export default enhance(StartScreen);

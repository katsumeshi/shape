import React from "react";
import { ThemeProvider } from "react-native-elements";
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "react-native-firebase";
import { Provider } from "react-redux";
import { firebaseReducer, ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import { THEME_COLOR } from "./src/constants";
import AppNavigator from "./src/navigation";
import { AppWithNavigationState } from "./src/reducers";
import store from "./src/store";
// import Config2 from "./config";
// var Config2 = require("./config");

// (() => {
//   console.warn(Config2);
// })();
firebase.crashlytics().enableCrashlyticsCollection();

// console.log("hogehogehogehgoe");

EStyleSheet.build();
const styles = EStyleSheet.create({
  title: {
    fontFamily: "futura",
    fontWeight: "bold",
    color: THEME_COLOR,
    fontSize: "4rem",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

const rrfConfig = {
  userProfile: "authUsers",
  useFirestoreForProfile: true
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
};

const theme = {
  Button: {
    titleStyle: {
      color: THEME_COLOR
    },
    containerStyle: {},
    buttonStyle: {
      borderColor: THEME_COLOR
    }
  },
  Input: {
    inputStyle: {
      marginLeft: 8,
      fontSize: 14
    },
    inputContainerStyle: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "rgba(0, 0, 0, 0.2)",
      height: 44
    },
    containerStyle: {
      paddingHorizontal: 0
    }
  }
};

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <AppNavigator />
          </ReactReduxFirebaseProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}

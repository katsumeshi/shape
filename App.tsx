import React from "react";
import { ThemeProvider } from "react-native-elements";
import EStyleSheet from "react-native-extended-stylesheet";
import firebase from "react-native-firebase";
import { Provider } from "react-redux";
import { THEME_COLOR } from "./src/constants";
import AppNavigator from "./src/navigation";
import store from "./src/redux/configureStore";
firebase.crashlytics().enableCrashlyticsCollection();

EStyleSheet.build();

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
          <AppNavigator />
        </ThemeProvider>
      </Provider>
    );
  }
}

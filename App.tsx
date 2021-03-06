import React from "react";
import { ThemeProvider } from "react-native-elements";
import firebase from "react-native-firebase";
import { Provider } from "react-redux";
import { THEME_COLOR } from "./src/constants";
import AppNavigator from "./src/navigation";
import store from "./src/state/store";
import i18nSetup from "./src/localization";
import { fetchAuthStatus } from "./src/state/modules/auth/actions";
import NavigationService from "./NavigationService";

i18nSetup();
firebase.crashlytics().enableCrashlyticsCollection();

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

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </ThemeProvider>
  </Provider>
);

store.dispatch(fetchAuthStatus());

export default App;

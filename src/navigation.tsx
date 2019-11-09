import React from "react";
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";
import { Icon } from "react-native-elements";
import i18next from "i18next";
import AuthLoadingScreen from "./screens/authLoadingScreen";
import HomeScreen from "./screens/homeScreen";
import LoginScreen from "./screens/loginScreen";
import ScaleScreen from "./screens/scale/scaleScreen";
import StartScreen from "./screens/startScreen";
import SettingScreen from "./screens/settingScreen";
import { THEME_COLOR } from "./constants";

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Scale: {
      screen: ScaleScreen
    }
  },
  {
    headerMode: "none"
  }
);

const AppStack = createStackNavigator(
  {
    Main: {
      screen: MainStack
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: AppStack,
    Settings: SettingScreen
  },
  {
    tabBarOptions: {
      activeTintColor: THEME_COLOR
    },
    defaultNavigationOptions: ({
      navigation
    }: {
      navigation: NavigationScreenProp<NavigationRoute>;
    }) => ({
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        return routeName === "Home" ? (
          <Icon type="Foundation" size={32} color={THEME_COLOR} name="home" />
        ) : (
          <Icon type="font-awesome" size={28} color={THEME_COLOR} name="gear" />
        );
      },
      tabBarLabel: (() => {
        const { routeName } = navigation.state;
        return routeName === "Home" ? i18next.t("home") : i18next.t("settings");
      })()
    })
  }
);

export const AuthStack = createStackNavigator(
  { Start: StartScreen, Login: LoginScreen },
  {
    headerMode: "none",
    initialRouteName: "Start"
  }
);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default AppNavigator;

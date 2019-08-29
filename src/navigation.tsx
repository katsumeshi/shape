import React from "react";
import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import { Icon } from "react-native-elements";
import AuthLoadingScreen from "./screens/authLoadingScreen";
import HomeScreen from "./screens/homeScreen";
import LoginScreen from "./screens/loginScreen";
import ScaleScreen from "./screens/scaleScreen";
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
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Home") {
          return <Icon type="Foundation" size={32} color={tintColor} name="home" />;
        }
        return <Icon type="font-awesome" size={28} color={tintColor} name="gear" />;
      }
    })
  }
);

const AuthStack = createStackNavigator(
  { Start: StartScreen, Login: LoginScreen },
  {
    headerMode: "none"
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

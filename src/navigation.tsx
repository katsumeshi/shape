import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from "react-navigation";
import AuthLoadingScreen from "./screens/authLoadingScreen";
import HomeScreen from "./screens/homeScreen";
import LoginScreen from "./screens/loginScreen";
import ScaleScreen from "./screens/scaleScreen";
import StartScreen from "./screens/startScreen";
import SettingScreen from "./screens/settingScreen";

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

const TabNavigator = createBottomTabNavigator({
  Home: AppStack,
  Settings: SettingScreen
});

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

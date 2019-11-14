import { RNFirebase } from "react-native-firebase";
import { NavigationScreenProp, NavigationState, NavigationParams } from "react-navigation";

export type QuerySnapshot = RNFirebase.firestore.QuerySnapshot;

export type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

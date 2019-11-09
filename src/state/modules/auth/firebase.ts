import firebase, { RNFirebase } from "react-native-firebase";
import { authChangedAction } from "./actions";

const authChanged = (callback: (user: any) => void) => {
  return firebase.auth().onAuthStateChanged(user => {
    callback(authChangedAction(user as RNFirebase.User));
  });
};

export default authChanged;

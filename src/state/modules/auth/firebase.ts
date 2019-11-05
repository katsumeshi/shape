import firebase, { RNFirebase } from "react-native-firebase";

const authChanged = (callback: (user: RNFirebase.User | null) => void) => {
  return firebase.auth().onAuthStateChanged(user => callback(user));
};

export default authChanged;

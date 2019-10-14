import firebase, { RNFirebase } from "react-native-firebase";
import store from "../../state/store";
import { requestLoginStatus } from "../../state/modules/auth/actions";
import Config from "../../../config";

export const observeAuthState = () => {
  firebase.auth().onAuthStateChanged(user => {
    store.dispatch(requestLoginStatus(!!user));
  });
};

export const signInWithEmailAndPassword = async values => {
  const actionCodeSettings = {
    url: Config.FIREBASE_URL,
    handleCodeInApp: true, // must always be true for sendSignInLinkToEmail
    iOS: {
      bundleId: Config.BUNDLE_ID
    },
    android: {
      packageName: Config.BUNDLE_ID,
      installApp: true,
      minimumVersion: "12"
    },
    dynamicLinkDomain: Config.DYNAMIC_LINK_DOMAIN
  };

  try {
    await firebase
      .auth()
      .sendSignInLinkToEmail(values.email, actionCodeSettings);
  } catch (err) {
    console.warn(err);
  }
};

const usersRef = () => {
  const authUser = firebase.auth().currentUser;
  if (!authUser) return null;
  return firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);
};

export const healthRef = () => {
  return usersRef().collection("health");
};

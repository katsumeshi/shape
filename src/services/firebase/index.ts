import firebase, { RNFirebase } from "react-native-firebase";
import store from "../../state/store";
import { requestLoginStatus } from "../../state/modules/auth/auth";
// import { successHealth } from "../../state/modules/health";
import Config from "../../../config";

// let authUser = firebase.auth().currentUser;

export const observeAuthState = () => {
  firebase.auth().onAuthStateChanged(user => {
    // authUser = firebase.auth().currentUser;
    store.dispatch(requestLoginStatus(!!user));
  });
};

// export const getHealth = () => {
//   if (!authUser) return;
//   firebase
//     .firestore()
//     .collection("users")
//     .doc(authUser.uid)
//     .collection("health")
//     .get()
//     .then(querySnapshot => {
//       const arr: Array<Health> = [];
//       querySnapshot.forEach(doc => {
//         const v = doc.data() as Health;
//         if (v.date) {
//           arr.unshift(v);
//         }
//       });
//       store.dispatch(successHealth(arr));
//     });
// };

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

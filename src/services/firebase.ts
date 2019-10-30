import moment from "moment";
import firebase, { RNFirebase } from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";
import Config from "../../config";
import { HealthModel } from "../state/modules/health/types";
import { removeNotifications } from "../utils/notificationUtils";

let unsubscribe = () => {};

export const unsubscribeDynamicLink = () => {
  unsubscribe();
};

export const subscribeDynamicLink = (email: string) => {
  unsubscribe = firebase.links().onLink(url => {
    try {
      firebase.auth().signInWithEmailLink(email, url);
    } catch (e) {
      console.warn(e);
    }
    unsubscribeDynamicLink();
  });
};

let subscription = () => {};

let map: { [id: string]: HealthModel } = {};

const signOut = () => {
  subscription();
  map = {};
  AsyncStorage.clear();
  removeNotifications();
};

export const authChanged = (callback: (isLoggedIn: boolean) => void) => {
  const unsubscribeAuth = firebase.auth().onAuthStateChanged(user => {
    const isLoggedIn = !!user;
    if (!isLoggedIn && subscription) {
      signOut();
    }
    callback(isLoggedIn);
    unsubscribeDynamicLink();
  });
  return unsubscribeAuth;
};

export const signInWithEmailAndPassword = async ({
  email
}: {
  email: string;
}) => {
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
    await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
    unsubscribeDynamicLink();
    subscribeDynamicLink(email);
  } catch (err) {
    console.warn(err);
  }
};

const usersRef = () => {
  const user = firebase.auth().currentUser;
  const userId = user ? user.uid : "";
  return firebase
    .firestore()
    .collection("users")
    .doc(userId);
};

export const healthRef = () => usersRef().collection("health");

export const updateWeight = (date: Date, weight: number) => {
  healthRef()
    .doc(moment(date).format("YYYY-MM-DD"))
    .set({ date, weight });
};

export const deleteWeight = (key: string) => {
  healthRef()
    .doc(key)
    .delete();
};

export const healthChanged = (callback: (weights: HealthModel[]) => void) => {
  subscription = healthRef().onSnapshot(
    (snapshot: RNFirebase.firestore.QuerySnapshot) => {
      snapshot.docChanges.forEach(change => {
        const data = change.doc.data();
        const key = change.doc.id;
        switch (change.type) {
          case "added":
          case "modified":
            map[key] = new HealthModel(key, data);
            break;
          case "removed":
            delete map[key];
            break;
          default:
            console.log("No such day exists!");
            break;
        }
      });
      const weights = Object.keys(map)
        .sort((a, b) => b.localeCompare(a))
        .map(key => map[key]);
      callback(weights);
    }
  );
  return subscription;
};

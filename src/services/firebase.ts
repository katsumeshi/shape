import moment from "moment";
import firebase from "react-native-firebase";
import { QuerySnapshot } from "react-native-firebase/firestore";
import Config from "../config";
import { HealthModel, HealthMap } from "../state/modules/health/types";

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

export const signInWithEmailAndPassword = async ({ email }: { email: string }) => {
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

const healthRef = () => usersRef().collection("health");

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

export const healthChanged = (callback: (weights: HealthMap) => void) => {
  const map: HealthMap = {};
  subscription = healthRef().onSnapshot((snapshot: QuerySnapshot) => {
    if (!snapshot.metadata.hasPendingWrites) {
      snapshot.docChanges.forEach(change => {
        switch (change.type) {
          case "added":
          case "modified": {
            const health = new HealthModel(change.doc.id, change.doc.data());
            map[health.key] = health;
            break;
          }
          default:
            delete map[change.doc.id];
        }
      });
      callback(map);
    }
  });
  return subscription;
};

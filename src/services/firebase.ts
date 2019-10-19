import firebase, { RNFirebase } from 'react-native-firebase';
import moment from 'moment';
import Config from '../../config';

class HealthModel {
  date: RNFirebase.firestore.Timestamp;

  weight: number;

  constructor(data: object | void) {
    this.date = data.date || firebase.firestore.Timestamp.fromMillis(0);
    this.weight = data.weight;
  }
}

let unsubscribe = () => {};

export const unsubscribeDynamicLink = () => {
  unsubscribe();
};

export const subscribeDynamicLink = (email: string) => {
  unsubscribe = firebase.links().onLink((url) => {
    try {
      firebase.auth().signInWithEmailLink(email, url);
    } catch (e) {
      console.warn(e);
    }
    unsubscribeDynamicLink();
  });
};


let subscription = () => {};
export const authChanged = (callback) => {
  const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
    const isLoggedIn = !!user;
    if (!isLoggedIn && subscription) {
      subscription();
    }
    callback(isLoggedIn);
  });
  return unsubscribeAuth;
};

export const signInWithEmailAndPassword = async (values) => {
  const actionCodeSettings = {
    url: Config.FIREBASE_URL,
    handleCodeInApp: true, // must always be true for sendSignInLinkToEmail
    iOS: {
      bundleId: Config.BUNDLE_ID,
    },
    android: {
      packageName: Config.BUNDLE_ID,
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: Config.DYNAMIC_LINK_DOMAIN,
  };

  console.warn(actionCodeSettings);

  try {
    await firebase
      .auth()
      .sendSignInLinkToEmail(values.email, actionCodeSettings);
    unsubscribeDynamicLink();
    subscribeDynamicLink(values.email);
  } catch (err) {
    console.warn(err);
  }
};

const usersRef = () => {
  const authUser = firebase.auth().currentUser;
  if (!authUser) return null;
  return firebase
    .firestore()
    .collection('users')
    .doc(authUser.uid);
};

export const healthRef = () => usersRef().collection('health');

export const updateWeight = (date, weight) => {
  healthRef()
    .doc(moment(date).format('YYYY-MM-DD'))
    .set({ date, weight });
};

export const deleteWeight = (date) => {
  healthRef()
    .doc(moment(date).format('YYYY-MM-DD'))
    .delete();
};

const map: { [id: string]: HealthModel } = {};
export const healthChanged = (callback) => {
  subscription = healthRef().onSnapshot((snapshot) => {
    snapshot.docChanges.forEach((change) => {
      const data = change.doc.data();
      const key = change.doc.id;
      switch (change.type) {
        case 'added':
        case 'modified':
          map[key] = new HealthModel(data);
          break;
        case 'removed':
          delete map[key];
          break;
        default:
          console.log('No such day exists!');
          break;
      }
    });
    const weights = Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => map[key]);
    callback(weights);
  });
  return subscription;
};

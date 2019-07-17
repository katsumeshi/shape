import RNFirebase from "react-native-firebase";
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
} from "react-navigation-redux-helpers";
import { compose, createStore } from "redux";
import { reduxFirestore } from "redux-firestore";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";

const reactNativeFirebaseConfig = {
  debug: true,
};
// for more config options, visit http://docs.react-redux-firebase.com/history/v2.0.0/docs/api/compose.html
// const reduxFirebaseConfig = {
//   userProfile: "users" // save users profiles to 'users' collection
// };

function configureStore(initialState, history) {
  // const sagaMiddleware = createSagaMiddleware();
  const firebase = RNFirebase.initializeApp();

  // const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);
  // const middleware = [sagaMiddleware, navMiddleware];

  // const createStoreWithMiddleware = compose(reduxFirestore(firebase, {}))(
  //   createStore,
  // );

  // const store = createStoreWithMiddleware(rootReducer);

  const store = createStore(rootReducer, reduxFirestore(firebase, {}));
  return store;
}

const initialState = window.__INITIAL_STATE__ || {
  firebase: { authError: null },
};
const store = configureStore(initialState);

export default store;

// function* helloSaga(getFirebase) {
//     try {
//       yield getFirebase().push("/some/path", { nice: "work!" });
//     } catch (err) {
//       console.log("Error in saga!:", err);
//     }
//   }

// sagaMiddleware.run(helloSaga, getFirebase);

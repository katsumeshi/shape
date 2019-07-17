import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from "react-navigation-redux-helpers";
import { connect } from "react-redux";
import { firebaseReducer } from "react-redux-firebase";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import AppNavigator from "./navigation";

// export const makeRootReducer = asyncReducers => {
//   return combineReducers({
//     // nav: navReducer,
//     firestore: firestoreReducer,
//     // firebase: firebaseStateReducer,
//     ...asyncReducers
//   });
// };

// export const middleware = createReactNavigationReduxMiddleware(
//   (state) => state.nav,
// );

// const navReducer = (state = {}, action) => {
//   const nextState = AppNavigator.router.getStateForAction(action, state);

//   // Simply return the original `state` if `nextState` is null or undefined.
//   return nextState || state;
// };

// const App = createReduxContainer(AppNavigator);
// const mapStateToProps = (state) => ({
//   state: state.nav,
// });

// export const AppWithNavigationState = connect(mapStateToProps)(App);

// const navReducer = createNavigationReducer(AppNavigator);

function login(state = "", action) {
  // console.warn(state);
  // console.warn(action);
  switch (action.type) {
    case "INCREMENT":
      return { ...state, email: action.email };
    // case "DECREMENT":
    //   return state - 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  login,
  // nav: navReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export default rootReducer;

// Useful for injecting reducers as part of async routes
// export const injectReducer = (store, { key, reducer }) => {
//   store.asyncReducers[key] = reducer;
//   store.replaceReducer(makeRootReducer(store.asyncReducers));
// };

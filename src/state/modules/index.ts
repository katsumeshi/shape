import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";

import { createNavigationReducer } from "react-navigation-redux-helpers";
import { healthReducer } from "./health/reducers";
import authReducer from "./auth/reducers";
import healthSaga from "./health/sagas";
import authSaga from "./auth/sagas";
import { HealthState } from "./health/types";
import AppNavigator, { AuthStack } from "../../navigation";

export interface ApplicationStateInterface {
  // nav: any;
  auth: any;
  health: HealthState;
}

// const navReducer = createNavigationReducer(AuthStack);

// const navReducer = (state, action) => {
//   const newState = AppNavigator.router.getStateForAction(action, state);
//   return newState || state;
// };

export const rootReducer = combineReducers<ApplicationStateInterface>({
  // nav: navReducer,
  health: healthReducer,
  auth: authReducer
});

export function* rootSaga() {
  yield all([fork(healthSaga), fork(authSaga)]);
}

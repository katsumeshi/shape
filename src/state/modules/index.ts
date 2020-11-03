import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";

import { healthReducer } from "./health/reducers";
import authReducer from "./auth/reducers";
import healthSaga from "./health/sagas";
import authSaga from "./auth/sagas";
import { HealthState } from "./health/types";
import generalSaga from "./general/sagas";

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
  yield all([fork(healthSaga), fork(authSaga), fork(generalSaga)]);
}

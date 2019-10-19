import { combineReducers } from "redux";
import { all, fork } from "redux-saga/effects";
import {
  Action
  // MetaAction,
  // PayloadAction,
  // TypeConstant
} from "typesafe-actions";
import { healthReducer } from "./health/reducers";
import authReducer from "./auth/reducers";
import healthSaga from "./health/sagas";
import authSaga from "./auth/sagas";
// The top-level state object
export interface ApplicationStateInterface {
  post: Action;
}
// export interface IMetaAction extends MetaAction<TypeConstant, IMeta> {}
// export interface IReducerAction<TPayload>
//   extends Action<TypeConstant>,
//     PayloadAction<TypeConstant, TPayload> {}
export const rootReducer = combineReducers<ApplicationStateInterface>({
  health: healthReducer,
  auth: authReducer
});
export function* rootSaga() {
  yield all([fork(healthSaga), fork(authSaga)]);
}

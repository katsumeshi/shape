import { all, fork, takeEvery, take, call, delay } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import firebase from "react-native-firebase";
import AuthActionTypes from "./types";
import authChanged from "./firebase";
import NavigationService from "../../../../NavigationService";

export function subscribe() {
  return eventChannel(emit => authChanged(emit));
}

export function* subscribeToAuthChanges() {
  const channel = yield call(subscribe);
  while (true) {
    const action = yield take(channel);
    NavigationService.navigate(action.payload.user ? "App" : "Auth", {});
  }
}

export function* watchAuthFetch() {
  while (true) {
    const { payload } = yield take(AuthActionTypes.AUTH_FETCH);
    yield fork(subscribeToAuthChanges);
  }
}

function signOut() {
  firebase.auth().signOut();
}

export function* logout() {
  yield delay(1);
  yield call(signOut);
}

export function* watchAuthLogout() {
  yield takeEvery(AuthActionTypes.AUTH_LOG_OUT, logout);
}

export default function* authSaga() {
  yield all([fork(watchAuthFetch), fork(watchAuthLogout)]);
}

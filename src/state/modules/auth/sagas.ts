import { all, fork, takeEvery, take, call, delay, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import firebase from "react-native-firebase";
import AuthActionTypes from "./types";
import authChanged from "./firebase";
import NavigationService from "../../../../NavigationService";
import { fetchWeights } from "../health/actions";
import { fetchGeneral } from "../general/actions";

export function subscribe() {
  return eventChannel(emit => authChanged(emit));
}

const isSignedIn = (user: any) => !!user;

export function* processSignedIn() {
  yield put(fetchWeights());
  yield put(fetchGeneral());
}

const processSignedOut = () => {
  NavigationService.navigate("Auth", {});
};

export function* subscribeToAuthChanges() {
  const channel = yield call(subscribe);
  while (true) {
    const action = yield take(channel);
    if (isSignedIn(action.payload.user)) {
      NavigationService.navigate("App", {});
      yield fork(processSignedIn);
    } else {
      processSignedOut();
    }
  }
}

export function* watchAuthFetch() {
  while (true) {
    yield take(AuthActionTypes.AUTH_FETCH);
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

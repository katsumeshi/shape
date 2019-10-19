import { all, fork, put, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import AuthActionTypes from "./types";
import { authChanged } from "../../../services/firebase";

function* handleAuthFetch() {
  const channel = eventChannel(emit =>
    authChanged(isLoggedIn => emit(isLoggedIn))
  );
  try {
    while (true) {
      const isLoggedIn = yield take(channel);
      yield put({
        type: AuthActionTypes.AUTH_FETCH_SUCCESS,
        payload: { isLoggedIn }
      });
    }
  } catch (err) {
    console.warn(err);
  }
}
export function* watchAuthFetch() {
  yield takeEvery(AuthActionTypes.AUTH_FETCH, handleAuthFetch);
}

export default function* authSaga() {
  yield all([fork(watchAuthFetch)]);
}

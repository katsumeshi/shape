import { all, fork, takeEvery, take, put } from "redux-saga/effects";
import { EventChannel, eventChannel } from "redux-saga";
import GeneralActionTypes, { General } from "./types";
import AuthActionTypes from "../auth/types";
import { fetchGeneralSuccess } from "./actions";
import generalChanged from "./firebase";
import NavigationService from "../../../../NavigationService";

function* close(channel: EventChannel<any>) {
  const { type } = yield take(AuthActionTypes.AUTH_LOG_OUT);
  if (type === AuthActionTypes.AUTH_LOG_OUT) {
    channel.close();
  }
}

function* observeGeneral() {
  const channel = eventChannel(emit => generalChanged((general: General) => emit(general)));
  while (true) {
    const result: General = yield take(channel);
    if (result.isEmpty()) {
      NavigationService.navigate("Onboarding", {});
    } else {
      yield put(fetchGeneralSuccess(result));
    }
    yield fork(close, channel);
  }
}

export function* watchFetchRequest() {
  yield takeEvery(GeneralActionTypes.GENERAL_FETCH, observeGeneral);
}

export default function* generalSaga() {
  yield all([fork(watchFetchRequest)]);
}

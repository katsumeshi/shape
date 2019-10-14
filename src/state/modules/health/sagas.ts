import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { PostRaw, HelthActionTypes } from "./types";
import { healthRef } from "../../../services/firebase";

function* handleFetch() {
  const ref = healthRef();
  if (!ref) return;
  const arr: Array<PostRaw> = [];
  const querySnapshot = yield call(() => ref.get());
  querySnapshot.forEach(doc => {
    const v = doc.data() as PostRaw;
    if (v.date) {
      arr.unshift(v);
    }
  });
  yield put({
    type: HelthActionTypes.HEALTH_FETCH_SUCCESS,
    payload: arr
  });
}
export function* watchFetchRequest() {
  yield takeEvery(HelthActionTypes.HEALTH_FETCH, handleFetch);
}

export default function* healthSaga() {
  yield all([fork(watchFetchRequest)]);
}

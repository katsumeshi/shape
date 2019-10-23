import { all, fork, put, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import HelthActionTypes, { HealthModel } from "./types";
import { healthChanged } from "../../../services/firebase";

function* handleFetch() {
  const channel = eventChannel(emit =>
    healthChanged((weights: HealthModel[]) => emit(weights))
  );
  try {
    while (true) {
      const data = yield take(channel);
      yield put({
        type: HelthActionTypes.HEALTH_FETCH_SUCCESS,
        payload: data
      });
    }
  } catch (err) {
    console.warn(err);
  }
}
export function* watchFetchRequest() {
  yield takeEvery(HelthActionTypes.HEALTH_FETCH, handleFetch);
}

// function* handleUpdateWeight({ payload: { date, weight } }) {
//   try {
//     updateWeight(date, weight);
//     updateWeightSuccess();
//   } catch (error) {
//     yield put({
//       type: HelthActionTypes.HEALTH_UPDATE_ERROR,
//       error
//     });
//   }
// }

// export function* watchUpdateWeight() {
//   yield takeEvery(HelthActionTypes.HEALTH_UPDATE, handleUpdateWeight);
// }

// function* handleDeleteWeight({ payload: { date } }) {
//   try {
//     deleteWeight(date);
//     deleteWeightSuccess();
//   } catch (error) {
//     yield put({
//       type: HelthActionTypes.HEALTH_DELETE_ERROR,
//       error
//     });
//   }
// }

// export function* watchDeleteWeight() {
//   yield takeEvery(HelthActionTypes.HEALTH_DELETE, handleDeleteWeight);
// }

export default function* healthSaga() {
  yield all([
    fork(watchFetchRequest)
    // fork(watchUpdateWeight),
    // fork(watchDeleteWeight)
  ]);
}

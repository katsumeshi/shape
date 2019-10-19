import { all, fork, put, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
// import firebase, { RNFirebase } from "react-native-firebase";
import { HelthActionTypes } from "./types";
import {
  // updateWeight,
  // deleteWeight,
  healthChanged
} from "../../../services/firebase";
// import { updateWeightSuccess, deleteWeightSuccess } from "./actions";

// class HealthModel {
//   date: RNFirebase.firestore.Timestamp;

//   weight: number;

//   constructor(data: object | void) {
//     this.date = data.date || firebase.firestore.Timestamp.fromMillis(0);
//     this.weight = data.weight;
//   }
// }
function* handleFetch() {
  const channel = eventChannel(emit => healthChanged(weights => emit(weights)));
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

import { all, call, fork, put, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import firebase, { RNFirebase } from "react-native-firebase";
import moment from "moment";
import { HelthActionTypes } from "./types";
import { healthRef } from "../../../services/firebase";
import { updateWeightSuccess, deleteWeightSuccess } from "./actions";

class HealthModel {
  date: RNFirebase.firestore.Timestamp;

  weight: number;

  constructor(data: object | void) {
    this.date = data.date || firebase.firestore.Timestamp.fromMillis(0);
    this.weight = data.weight;
  }
}
const map: { [id: string]: HealthModel } = {};
function* handleFetch() {
  const channel = eventChannel(emit =>
    healthRef().onSnapshot(snapshot => {
      snapshot.docChanges.forEach(change => {
        const data = change.doc.data();
        const key = change.doc.id;
        switch (change.type) {
          case "added":
          case "modified":
            map[key] = new HealthModel(data);
            break;
          case "removed":
            delete map[key];
            break;
          default:
            console.log("No such day exists!");
            break;
        }
      });
      emit(
        Object.keys(map)
          .sort((a, b) => b.localeCompare(a))
          .map(key => map[key])
      );
    })
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

function* handleUpdateWeight({ payload: { date, weight } }) {
  try {
    healthRef()
      .doc(moment(date).format("YYYY-MM-DD"))
      .set({ date, weight });
    updateWeightSuccess();
  } catch (error) {
    yield put({
      type: HelthActionTypes.HEALTH_UPDATE_ERROR,
      error
    });
  }
}

export function* watchUpdateWeight() {
  yield takeEvery(HelthActionTypes.HEALTH_UPDATE, handleUpdateWeight);
}

function* handleDeleteWeight({ payload: { date } }) {
  try {
    healthRef()
      .doc(moment(date).format("YYYY-MM-DD"))
      .delete();
    deleteWeightSuccess();
  } catch (error) {
    yield put({
      type: HelthActionTypes.HEALTH_DELETE_ERROR,
      error
    });
  }
}

export function* watchDeleteWeight() {
  yield takeEvery(HelthActionTypes.HEALTH_DELETE, handleDeleteWeight);
}

export default function* healthSaga() {
  yield all([
    fork(watchFetchRequest),
    fork(watchUpdateWeight),
    fork(watchDeleteWeight)
  ]);
}

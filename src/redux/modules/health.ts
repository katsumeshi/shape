import { takeEvery, call, put } from "redux-saga/effects";
import firebase, { RNFirebase } from "react-native-firebase";

// action
const HEALTH_FETCH_REQUESTED = "redux-example/health/HEALTH_FETCH_REQUESTED";
const HEALTH_FETCH_SUCCEEDED = "redux-example/health/HEALTH_FETCH_SUCCEEDED";

const initialState = {
  // loaded: false
};

// reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case HEALTH_FETCH_SUCCEEDED:
      return {
        ...state,
        data: action.arr
      };
    default:
      return state;
  }
}

// action cretors

export function requestWeights() {
  return {
    type: HEALTH_FETCH_REQUESTED
  };
}

// sagas

type Health = {
  weight: number;
  date?: RNFirebase.firestore.Timestamp;
};

function* requestHealth() {
  const authUser = firebase.auth().currentUser;
  if (!authUser) return;
  const querySnapshot = yield call(() =>
    firebase
      .firestore()
      .collection("users")
      .doc(authUser.uid)
      .collection("health")
      .get()
  );
  const arr: Array<Health> = [];
  querySnapshot.forEach(doc => {
    const v = doc.data() as Health;
    if (v.date) {
      arr.unshift(v);
    }
  });
  yield put({
    type: HEALTH_FETCH_SUCCEEDED,
    arr
  });
}
export function* watchFetchProducts() {
  yield takeEvery(HEALTH_FETCH_REQUESTED, requestHealth);
}

import { takeEvery, call, put } from "redux-saga/effects";
import firebase, { RNFirebase } from "react-native-firebase";
import moment from "moment";

// action
const HEALTH_FETCH_REQUESTED = "redux-example/health/HEALTH_FETCH_REQUESTED";
const HEALTH_FETCH_SUCCEEDED = "redux-example/health/HEALTH_FETCH_SUCCEEDED";

const initialState = {
  // loaded: false
};

const healthRef = () => {
  const authUser = firebase.auth().currentUser;
  if (!authUser) return null;
  return firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid)
    .collection("health");
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

export function updateWeight(date: Date, weight: number) {
  const ref = healthRef();
  if (!ref) return;
  ref.doc(moment(date).format("YYYY-MM-DD")).set({ date, weight });
  return {
    type: ""
  };
}

// sagas

type Health = {
  weight: number;
  date?: RNFirebase.firestore.Timestamp;
};

function* requestHealth() {
  const ref = healthRef();
  if (!ref) return;
  const querySnapshot = yield call(() => ref.get());
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

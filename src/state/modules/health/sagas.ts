import {
  all, fork, put, take, takeEvery,
} from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import HelthActionTypes, { HealthMap } from './types';
import { healthChanged } from '../../../services/firebase';
import AuthActionTypes from '../auth/types';
import { fetchWeightsSuccess } from './actions';

function* close(channel: EventChannel<any>) {
  const { type } = yield take(AuthActionTypes.AUTH_LOG_OUT);
  if (type === AuthActionTypes.AUTH_LOG_OUT) {
    channel.close();
  }
}

function* observeHealth() {
  const channel = eventChannel((emit) => healthChanged((weights: HealthMap) => emit(weights)));
  while (true) {
    const results = yield take(channel);
    yield put(fetchWeightsSuccess(results));
    yield fork(close, channel);
  }
}
export function* watchFetchRequest() {
  yield takeEvery(HelthActionTypes.HEALTH_FETCH, observeHealth);
}

export default function* healthSaga() {
  yield all([fork(watchFetchRequest)]);
}

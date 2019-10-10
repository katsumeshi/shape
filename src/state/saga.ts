import { all, fork } from "redux-saga/effects";

import { watchFetchProducts } from "./health/health";

export default function* rootSaga() {
  yield all([fork(watchFetchProducts)]);
}

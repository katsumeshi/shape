import { all, fork } from "redux-saga/effects";

import { watchFetchProducts } from "./health";

export default function* rootSaga() {
  yield all([fork(watchFetchProducts)]);
}

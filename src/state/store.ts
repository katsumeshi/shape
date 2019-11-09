import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import {
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from "react-navigation-redux-helpers";
import { connect } from "react-redux";
import { rootReducer, rootSaga } from "./modules/index";

const sagaMiddleware = createSagaMiddleware();
// const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
  // compose(applyMiddleware(sagaMiddleware, navMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;

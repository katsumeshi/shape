import { createStore, applyMiddleware } from "redux";
import rootReducer from "./modules/reducer";
import rootSaga from "./modules/saga";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;

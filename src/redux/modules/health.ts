import { takeEvery, call, put, delay } from "redux-saga/effects";
import * as firebaseService from "../../services/firebase";

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

export function successHealth(arr) {
	return {
		type: HEALTH_FETCH_SUCCEEDED,
		arr
	};
}

// sagas
export function* watchFetchProducts() {
	yield takeEvery(HEALTH_FETCH_REQUESTED, requestHealth);
}

function* requestHealth() {
	firebaseService.getHealth();
}

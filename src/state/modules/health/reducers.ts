import { Action, PayloadAction, TypeConstant } from "typesafe-actions";
import { HelthActionTypes, HealthState, PostRaw } from "./types";

export const initialState: HealthState = {
  data: [],
  errors: [],
  loading: false
};

export const healthReducer = (
  state: HealthState = initialState,
  action: Action<TypeConstant> & PayloadAction<TypeConstant, PostRaw[]>
): HealthState => {
  switch (action.type) {
    case HelthActionTypes.HEALTH_FETCH: {
      return { ...state, loading: true };
    }
    case HelthActionTypes.HEALTH_FETCH_SUCCESS: {
      return { ...initialState, data: action.payload, loading: false };
    }
    case HelthActionTypes.HEALTH_FETCH_ERROR: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_UPDATE: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_UPDATE_SUCCESS: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_UPDATE_ERROR: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_DELETE: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_DELETE_SUCCESS: {
      return { ...state };
    }
    case HelthActionTypes.HEALTH_DELETE_ERROR: {
      return { ...state };
    }
    default:
      return state;
  }
};

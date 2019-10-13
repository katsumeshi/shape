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
      return { ...initialState, data: action.payload };
    }
    case HelthActionTypes.HEALTH_FETCH_ERROR: {
      return { ...state };
    }
    default:
      return state;
  }
};

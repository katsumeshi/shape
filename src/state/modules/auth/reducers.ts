import { Action, PayloadAction, TypeConstant } from "typesafe-actions";
import { AuthActionTypes } from "./types";

const initialState = {};

// reducer
export const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_LOGIN:
      return { ...state, loading: true, isLoggedIn: true };
    case AuthActionTypes.AUTH_LOGOUT:
      return { ...initialState, isLoggedIn: false };
    case AuthActionTypes.AUTH_FETCH_ERROR:
      return { ...state };
    default:
      return state;
  }
};

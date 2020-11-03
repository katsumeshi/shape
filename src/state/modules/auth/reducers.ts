import { Action, PayloadAction, TypeConstant } from "typesafe-actions";
import AuthActionTypes, { AuthModel, AuthState } from "./types";

const initialState = {
  data: { isLoggedIn: false },
  loading: true
};

// reducer
const authReducer = (state: AuthState = initialState, action: Action<TypeConstant> & PayloadAction<TypeConstant, AuthModel>): AuthState => {
  switch (action.type) {
    case AuthActionTypes.AUTH_FETCH:
      return { ...state, loading: true };
    case AuthActionTypes.AUTH_FETCH_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case AuthActionTypes.AUTH_FETCH_ERROR:
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default authReducer;

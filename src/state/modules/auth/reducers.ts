import { Action, PayloadAction, TypeConstant } from "typesafe-actions";
import AuthActionTypes, { AuthModel, AuthState } from "./types";

const initialState = {
  data: { isLoggedIn: false },
  loading: false
};

// reducer
const authReducer = (
  state: AuthState = initialState,
  action: Action<TypeConstant> & PayloadAction<TypeConstant, AuthModel>
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.AUTH_FETCH:
      return { ...state };
    case AuthActionTypes.AUTH_FETCH_SUCCESS:
      return { ...initialState, data: action.payload };
    case AuthActionTypes.AUTH_FETCH_ERROR:
      return { ...state };
    default:
      return state;
  }
};
export default authReducer;

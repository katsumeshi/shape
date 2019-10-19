import AuthActionTypes from "./types";

const initialState = {};

// reducer
const authReducer = (state = initialState, action = {}) => {
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

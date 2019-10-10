// action
const LOGIN_STATUS_REQUESTED = "redux-example/auth/LOGIN_STATUS_REQUESTED";
const LOGIN_STATUS_LOGGED_IN = "redux-example/auth/LOGIN_STATUS_LOGGED_IN";
const LOGIN_STATUS_LOGGED_OUT = "redux-example/auth/LOGIN_STATUS_LOGGED_OUT";

const initialState = {};

// reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_STATUS_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case LOGIN_STATUS_LOGGED_IN:
      return {
        ...state,
        loading: false,
        isLoggedIn: true
      };
    case LOGIN_STATUS_LOGGED_OUT:
      return {
        ...state,
        loading: false,
        isLoggedIn: false
      };
    default:
      return state;
  }
}

// action cretors

export function requestLoginStatus(isLoggedIn: boolean) {
  return {
    type: isLoggedIn ? LOGIN_STATUS_LOGGED_IN : LOGIN_STATUS_LOGGED_OUT,
    isLoggedIn
  };
}

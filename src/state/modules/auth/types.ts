export interface AuthModel {
  isLoggedIn: boolean;
}

export interface AuthState {
  readonly data: AuthModel;
  readonly loading: boolean;
}

const AuthActionTypes = {
  AUTH_FETCH: "@@auth/AUTH_FETCH",
  AUTH_FETCH_SUCCESS: "@@auth/AUTH_FETCH_SUCCESS",
  AUTH_FETCH_ERROR: "@@auth/AUTH_FETCH_ERROR"
};
export default AuthActionTypes;

import { action } from "typesafe-actions";
import { AuthActionTypes } from "./types";

export const requestLoginStatus = (isLoggedIn: boolean) =>
  action(
    isLoggedIn ? AuthActionTypes.AUTH_LOGIN : AuthActionTypes.AUTH_LOGOUT,
    isLoggedIn
  );

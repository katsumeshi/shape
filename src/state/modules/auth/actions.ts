import { action } from "typesafe-actions";
import { RNFirebase } from "react-native-firebase";
import AuthActionTypes from "./types";

export const fetchAuthStatus = () =>
  action(AuthActionTypes.AUTH_FETCH, { id: "aaaaaaa" });

export const authChangedAction = (user: RNFirebase.User) =>
  action(AuthActionTypes.AUTH_CHANGED, { user });

export const authLogoutAction = () => action(AuthActionTypes.AUTH_LOG_OUT, {});

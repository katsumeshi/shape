import { action } from "typesafe-actions";
import moment from "moment";
import firebase from "react-native-firebase";
import { AuthActionTypes } from "./types";

// export function requestLoginStatus(isLoggedIn: boolean) {
//   return {
//     type: isLoggedIn ? AuthActionTypes.AUTH_LOGIN : AuthActionTypes.AUTH_LOGOUT,
//     isLoggedIn
//   };
// }

export const requestLoginStatus = (isLoggedIn: boolean) =>
  action(
    isLoggedIn ? AuthActionTypes.AUTH_LOGIN : AuthActionTypes.AUTH_LOGOUT,
    isLoggedIn
  );

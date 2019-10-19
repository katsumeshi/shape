import { action } from "typesafe-actions";
import AuthActionTypes from "./types";

const fetchAuthStatus = () => action(AuthActionTypes.AUTH_FETCH);
export default fetchAuthStatus;

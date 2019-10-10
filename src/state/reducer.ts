import { combineReducers } from "redux";

import auth from "./auth/auth";
import health from "./health/health";

export default combineReducers({
  auth,
  health
});

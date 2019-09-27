import { combineReducers } from "redux";

import auth from "./auth";
import health from "./health";

export default combineReducers({
  auth,
  health
});

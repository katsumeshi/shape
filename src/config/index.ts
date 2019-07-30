import * as development from "./development.json.js.js";
import * as production from "./production.json.js.js";

import { NativeModules } from "react-native";

const Config = NativeModules.Config;
let config = production;
if (Config.isDebug()) {
  config = development;
}

export default config;

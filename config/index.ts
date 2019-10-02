import * as development from "./development.json";
import * as production from "./production.json";

import { NativeModules } from "react-native";

const Config = NativeModules.Config;
let c = production;
if (Config.DEBUG) {
	c = development;
}

export default c;

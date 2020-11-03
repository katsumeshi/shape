import { NativeModules } from "react-native";
import * as development from "./development.json";
import * as production from "./production.json";

const { Config } = NativeModules;

const env = (() => {
  if (Config.DEBUG) {
    return development;
  }
  return production;
})();

export default env;

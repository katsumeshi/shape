"use strict";
exports.__esModule = true;
var development = require("./development.json");
var production = require("./production.json");
var react_native_1 = require("react-native");
var Config = react_native_1.NativeModules.Config;
var c = production;
if (Config.DEBUG) {
    c = development;
}
exports["default"] = c;

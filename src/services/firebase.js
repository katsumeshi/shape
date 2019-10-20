"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_native_firebase_1 = require("react-native-firebase");
var moment_1 = require("moment");
var config_1 = require("../../config");
var HealthModel = /** @class */ (function () {
    function HealthModel(data) {
        this.date = data.date || react_native_firebase_1["default"].firestore.Timestamp.fromMillis(0);
        this.weight = data.weight;
    }
    return HealthModel;
}());
var unsubscribe = function () { };
exports.unsubscribeDynamicLink = function () {
    unsubscribe();
};
exports.subscribeDynamicLink = function (email) {
    unsubscribe = react_native_firebase_1["default"].links().onLink(function (url) {
        try {
            react_native_firebase_1["default"].auth().signInWithEmailLink(email, url);
        }
        catch (e) {
            console.warn(e);
        }
        exports.unsubscribeDynamicLink();
    });
};
var subscription = function () { };
var map = {};
exports.authChanged = function (callback) {
    var unsubscribeAuth = react_native_firebase_1["default"].auth().onAuthStateChanged(function (user) {
        var isLoggedIn = !!user;
        if (!isLoggedIn && subscription) {
            subscription();
            map = {};
        }
        callback(isLoggedIn);
    });
    return unsubscribeAuth;
};
exports.signInWithEmailAndPassword = function (values) { return __awaiter(void 0, void 0, void 0, function () {
    var actionCodeSettings, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                actionCodeSettings = {
                    url: config_1["default"].FIREBASE_URL,
                    handleCodeInApp: true,
                    iOS: {
                        bundleId: config_1["default"].BUNDLE_ID
                    },
                    android: {
                        packageName: config_1["default"].BUNDLE_ID,
                        installApp: true,
                        minimumVersion: "12"
                    },
                    dynamicLinkDomain: config_1["default"].DYNAMIC_LINK_DOMAIN
                };
                console.warn(actionCodeSettings);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, react_native_firebase_1["default"]
                        .auth()
                        .sendSignInLinkToEmail(values.email, actionCodeSettings)];
            case 2:
                _a.sent();
                exports.unsubscribeDynamicLink();
                exports.subscribeDynamicLink(values.email);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.warn(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var usersRef = function () {
    var authUser = react_native_firebase_1["default"].auth().currentUser;
    if (!authUser)
        return null;
    return react_native_firebase_1["default"]
        .firestore()
        .collection("users")
        .doc(authUser.uid);
};
exports.healthRef = function () { return usersRef().collection("health"); };
exports.updateWeight = function (date, weight) {
    exports.healthRef()
        .doc(moment_1["default"](date).format("YYYY-MM-DD"))
        .set({ date: date, weight: weight });
};
exports.deleteWeight = function (date) {
    exports.healthRef()
        .doc(moment_1["default"](date).format("YYYY-MM-DD"))["delete"]();
};
exports.healthChanged = function (callback) {
    subscription = exports.healthRef().onSnapshot(function (snapshot) {
        snapshot.docChanges.forEach(function (change) {
            var data = change.doc.data();
            var key = change.doc.id;
            switch (change.type) {
                case "added":
                case "modified":
                    map[key] = new HealthModel(data);
                    break;
                case "removed":
                    delete map[key];
                    break;
                default:
                    console.log("No such day exists!");
                    break;
            }
        });
        var weights = Object.keys(map)
            .sort(function (a, b) { return b.localeCompare(a); })
            .map(function (key) { return map[key]; });
        callback(weights);
    });
    return subscription;
};

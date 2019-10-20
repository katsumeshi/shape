"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var types_1 = require("./types");
exports.initialState = {
    data: [],
    errors: [],
    loading: false
};
exports.healthReducer = function (state, action) {
    if (state === void 0) { state = exports.initialState; }
    switch (action.type) {
        case types_1["default"].HEALTH_FETCH: {
            return __assign(__assign({}, state), { loading: true });
        }
        case types_1["default"].HEALTH_FETCH_SUCCESS: {
            return __assign(__assign({}, exports.initialState), { data: action.payload, loading: false });
        }
        case types_1["default"].HEALTH_FETCH_ERROR: {
            return __assign({}, state);
        }
        default:
            return state;
    }
};

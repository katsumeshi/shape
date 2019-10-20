"use strict";
exports.__esModule = true;
var typesafe_actions_1 = require("typesafe-actions");
var types_1 = require("./types");
exports.fetchWeights = function () { return typesafe_actions_1.action(types_1.HelthActionTypes.HEALTH_FETCH, []); };
exports.fetchWeightsSuccess = function (data) {
    return typesafe_actions_1.action(types_1.HelthActionTypes.HEALTH_FETCH_SUCCESS, data);
};
exports.fetchWeightsError = function (message) {
    return typesafe_actions_1.action(types_1.HelthActionTypes.HEALTH_FETCH_ERROR, message);
};
// export const updateWeight = (date: Date, weight: number) =>
//   action(HelthActionTypes.HEALTH_UPDATE, { date, weight });
// export const updateWeightSuccess = () =>
//   action(HelthActionTypes.HEALTH_UPDATE_SUCCESS);
// export const deleteWeight = (date: Date) =>
//   action(HelthActionTypes.HEALTH_DELETE, { date });
// export const deleteWeightSuccess = () =>
//   action(HelthActionTypes.HEALTH_DELETE_SUCCESS);
// export function deleteWeight(date: Date, weight: number) {
//   const ref = healthRef();
//   if (!ref) return;
//   ref.doc(moment(date).format("YYYY-MM-DD")).delete();
// }

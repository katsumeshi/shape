import { action } from "typesafe-actions";
import HelthActionTypes, { HealthModel } from "./types";

export const fetchWeights = () => action(HelthActionTypes.HEALTH_FETCH, []);

export const fetchWeightsSuccess = (data: HealthModel[]) =>
  action(HelthActionTypes.HEALTH_FETCH_SUCCESS, data);
export const fetchWeightsError = (message: string) =>
  action(HelthActionTypes.HEALTH_FETCH_ERROR, message);

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

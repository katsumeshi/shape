import { action } from "typesafe-actions";
import HelthActionTypes, { HealthModel } from "./types";

export const fetchWeights = () => action(HelthActionTypes.HEALTH_FETCH, []);

export const fetchWeightsSuccess = (data: HealthModel[]) =>
  action(HelthActionTypes.HEALTH_FETCH_SUCCESS, data);
export const fetchWeightsError = (message: string) =>
  action(HelthActionTypes.HEALTH_FETCH_ERROR, message);

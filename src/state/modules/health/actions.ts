import { action } from "typesafe-actions";
import moment from "moment";
import { healthRef } from "../../../services/firebase";
import { HelthActionTypes } from "./types";

export const fetchWeights = () => action(HelthActionTypes.HEALTH_FETCH, []);

export const fetchWeightsSuccess = (data: IPostRaw[]) =>
  action(HelthActionTypes.HEALTH_FETCH_SUCCESS, data);
export const fetchWeightsError = (message: string) =>
  action(HelthActionTypes.HEALTH_FETCH_ERROR, message);

export function updateWeight(date: Date, weight: number) {
  const ref = healthRef();
  if (!ref) return;
  ref.doc(moment(date).format("YYYY-MM-DD")).set({ date, weight });
  return {
    type: ""
  };
}

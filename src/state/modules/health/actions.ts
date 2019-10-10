import { action } from "typesafe-actions";
import { HelthActionTypes } from "./types";

export const fetchWeights = () =>
  action(HelthActionTypes.HEALTH_FETCH, [], {
    method: "get",
    route: "/posts"
  });

export const fetchWeightsSuccess = (data: IPostRaw[]) =>
  action(HelthActionTypes.HEALTH_FETCH_SUCCESS, data);
export const fetchWeightsError = (message: string) =>
  action(HelthActionTypes.HEALTH_FETCH_ERROR, message);

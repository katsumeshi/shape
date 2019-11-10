import get from "lodash/get";
import { createSelector } from "reselect";
import moment from "moment";
import { HealthModel } from "./types";

const healthMapSelector = (state: any) => state.health.data;
const selectKey = (state: any, key: string) => key;

export const sortedHealthSelector = createSelector(healthMapSelector, (s: any) => s);

export const defaultHealthSelector = createSelector(
  [sortedHealthSelector, selectKey],
  (sortedHealthList: HealthModel[], key: string) =>
    sortedHealthList.find((h: HealthModel) => h.key === key) ||
    new HealthModel(moment().format("YYYY-MM-DD"), {
      date: new Date(),
      weight: get(sortedHealthList, "[0].weight", 0)
    })
);

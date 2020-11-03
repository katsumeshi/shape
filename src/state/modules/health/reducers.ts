import { Action, PayloadAction, TypeConstant } from "typesafe-actions";
import HelthActionTypes, { HealthModel, HealthState, HealthMap } from "./types";

export const initialState: HealthState = {
  data: []
};
export const healthReducer = (
  state: HealthState = initialState,
  action: Action<TypeConstant> & PayloadAction<TypeConstant, HealthMap>
): HealthState => {
  switch (action.type) {
    case HelthActionTypes.HEALTH_FETCH_SUCCESS: {
      return {
        data: Object.values(action.payload).sort(
          (a: HealthModel, b: HealthModel): number => b.date.getTime() - a.date.getTime()
        )
      };
    }
    default:
      return state;
  }
};

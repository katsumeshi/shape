import isEmpty from "lodash/isEmpty";
import clone from "lodash/clone";

export enum DietType {
  Lose,
  Maintain,
  Gain
}

export enum ActiveLevel {
  NotVeryActive,
  LightlyActive,
  Active,
  VeryActive
}

export class General {
  diet: DietType = DietType.Lose;
  activeLevel: ActiveLevel = ActiveLevel.NotVeryActive;
  height: number = 0;
  weight: number = 0;
  goal: number = 0;
  birthday: Date = new Date(0);

  isEmpty() {
    return isEmpty(this);
  }

  clone() {
    return clone(this);
  }
}

const GeneralActionTypes = {
  GENERAL_FETCH: "general/GENERAL_FETCH",
  GENERAL_FETCH_SUCCESS: "general/GENERAL_FETCH_SUCCESS"
};
export default GeneralActionTypes;

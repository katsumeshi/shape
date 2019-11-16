import isEmpty from "lodash/isEmpty";

export enum DietType {
  None,
  Lose,
  Maintain,
  Gain
}

export enum ActiveLevel {
  None,
  NotVeryActive,
  LightlyActive,
  Active,
  VeryActive
}

export class General {
  diet?: DietType;

  isEmpty() {
    return isEmpty(this);
  }
}

const GeneralActionTypes = {
  GENERAL_FETCH: "general/GENERAL_FETCH",
  GENERAL_FETCH_SUCCESS: "general/GENERAL_FETCH_SUCCESS"
};
export default GeneralActionTypes;

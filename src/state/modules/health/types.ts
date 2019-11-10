import firebase from "react-native-firebase";

const toDate = (date: any) => {
  if (date instanceof firebase.firestore.Timestamp) {
    return date.toDate();
  }
  return date;
};
export class HealthModel {
  key: string;

  weight: number;

  date: Date;

  constructor(key: string, data: any) {
    this.key = key;

    this.date = toDate(data.date) || new Date(0);
    this.weight = data.weight;
  }
}

export type HealthMap = Record<string, HealthModel>;

export interface HealthState {
  readonly data: HealthModel[];
}

const HelthActionTypes = {
  HEALTH_FETCH: "@@health/HEALTH_FETCH",
  HEALTH_FETCH_SUCCESS: "@@health/HEALTH_FETCH_SUCCESS",
  HEALTH_FETCH_ERROR: "@@health/FHEALTH_FETCH_ERROR"
};

export default HelthActionTypes;

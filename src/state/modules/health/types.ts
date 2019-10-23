import firebase, { RNFirebase } from "react-native-firebase";

export class HealthModel {
  key: string;

  weight: number;

  date: RNFirebase.firestore.Timestamp;

  constructor(key: string, data: any) {
    this.key = key;
    this.date = data.date || firebase.firestore.Timestamp.fromMillis(0);
    this.weight = data.weight;
  }
}

export interface HealthState {
  readonly data: HealthModel[];
  readonly loading: boolean;
  readonly errors: [];
}

const HelthActionTypes = {
  HEALTH_FETCH: "@@health/HEALTH_FETCH",
  HEALTH_FETCH_SUCCESS: "@@health/HEALTH_FETCH_SUCCESS",
  HEALTH_FETCH_ERROR: "@@health/FHEALTH_FETCH_ERROR"
};

export default HelthActionTypes;

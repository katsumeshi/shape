export interface HealthModel {
  weight: number;
  date: number;
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

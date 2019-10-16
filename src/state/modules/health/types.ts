export interface PostRaw {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface HealthState {
  readonly data: PostRaw[];
  readonly loading: boolean;
  readonly errors: [];
}

export const HelthActionTypes = {
  HEALTH_FETCH: "@@health/HEALTH_FETCH",
  HEALTH_FETCH_SUCCESS: "@@health/HEALTH_FETCH_SUCCESS",
  HEALTH_FETCH_ERROR: "@@health/FHEALTH_FETCH_ERROR",
  HEALTH_UPDATE: "@@health/HEALTH_UPDATE",
  HEALTH_UPDATE_SUCCESS: "@@health/HEALTH_UPDATE_SUCCESS",
  HEALTH_UPDATE_ERROR: "@@health/FHEALTH_UPDATE_ERROR",
  HEALTH_DELETE: "@@health/HEALTH_DELETE",
  HEALTH_DELETE_SUCCESS: "@@health/HEALTH_DELETE_SUCCESS",
  HEALTH_DELETE_ERROR: "@@health/FHEALTH_DELETE_ERROR"
};

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
  HEALTH_FETCH_ERROR: "@@health/FHEALTH_FETCH_ERROR"
};

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
  HEALTH_FETCH: "@@post/HEALTH_FETCH",
  HEALTH_FETCH_SUCCESS: "@@post/HEALTH_FETCH_SUCCESS",
  HEALTH_FETCH_ERROR: "@@post/FHEALTH_FETCH_ERROR"
};

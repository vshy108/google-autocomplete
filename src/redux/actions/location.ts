import { type Location } from '@/redux/reducers/location';

const PREFIX = 'LOCATION';

export const LOCATION_LIST = `${PREFIX}/LIST_REQUEST`;
export const LOCATION_LIST_SUCCESS = `${PREFIX}/LIST_SUCCESS`;
export const LOCATION_LIST_FAIL = `${PREFIX}/LIST_FAIL`;

export const listLocation = () => ({
  type: LOCATION_LIST,
});

export const listLocationSuccess = (payload: Location[]) => ({
  type: LOCATION_LIST_SUCCESS,
  payload,
});

export const listLocationFail = (error: unknown) => ({
  type: LOCATION_LIST_FAIL,
  error,
});

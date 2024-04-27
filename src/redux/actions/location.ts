import {
  updateLocationFavouritePayload,
  type RawLocation,
  type RemoteLocation,
} from '@/types';

const PREFIX = 'LOCATION';

export const LOCATION_LIST = `${PREFIX}/LIST_REQUEST`;
export const LOCATION_LIST_SUCCESS = `${PREFIX}/LIST_SUCCESS`;
export const LOCATION_LIST_FAIL = `${PREFIX}/LIST_FAIL`;

export const LOCATION_ADD = `${PREFIX}/ADD`;

export const LOCATION_UPDATE_FAVOURTIE = `${PREFIX}/UPDATE_FAVOURTIE_REQUEST`;
export const LOCATION_UPDATE_FAVOURTIE_SUCCESS = `${PREFIX}/UPDATE_FAVOURTIE_SUCCESS`;
export const LOCATION_UPDATE_FAVOURTIE_FAIL = `${PREFIX}/UPDATE_FAVOURTIE_FAIL`;

export const listLocation = () => ({
  type: LOCATION_LIST,
});

export const listLocationSuccess = (payload: RemoteLocation[]) => ({
  type: LOCATION_LIST_SUCCESS,
  payload,
});

export const listLocationFail = (error: unknown) => ({
  type: LOCATION_LIST_FAIL,
  error,
});

export const addRawLocation = (payload: RawLocation) => ({
  type: LOCATION_ADD,
  payload,
});

export const updateLocationFavourite = (
  payload: updateLocationFavouritePayload
) => ({
  type: LOCATION_UPDATE_FAVOURTIE,
  payload,
});

// TODO: updateLocationFavouriteSuccess
// TODO: updateLocationFavouriteFail

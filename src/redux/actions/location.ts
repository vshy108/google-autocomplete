import {
  type PaginatedLocations,
  type LocalLocation,
  type RemoteLocation,
} from '@/types';

const PREFIX = 'LOCATION';

export const LOCATION_LIST = `${PREFIX}/LIST_REQUEST`;
export const LOCATION_LIST_SUCCESS = `${PREFIX}/LIST_SUCCESS`;
export const LOCATION_LIST_FAIL = `${PREFIX}/LIST_FAIL`;

export const LOCATION_ADD_LOCAL = `${PREFIX}/ADD_LOCAL`;

export const LOCATION_UPDATE_FAVOURTIE = `${PREFIX}/UPDATE_FAVOURTIE_REQUEST`;
export const LOCATION_UPDATE_FAVOURTIE_SUCCESS = `${PREFIX}/UPDATE_FAVOURTIE_SUCCESS`;
export const LOCATION_UPDATE_FAVOURTIE_FAIL = `${PREFIX}/UPDATE_FAVOURTIE_FAIL`;

export const LOCATION_CREATE = `${PREFIX}/CREATE`;
export const LOCATION_CREATE_SUCCESS = `${PREFIX}/CREATE_SUCCESS`;
export const LOCATION_CREATE_FAIL = `${PREFIX}/CREATE_FAIL`;

export const listLocation = (page: number, rowsPerPage: number) => ({
  type: LOCATION_LIST,
  page,
  rowsPerPage,
});

export const listLocationSuccess = (payload: PaginatedLocations) => ({
  type: LOCATION_LIST_SUCCESS,
  payload,
});

export const listLocationFail = (error: unknown) => ({
  type: LOCATION_LIST_FAIL,
  error,
});

export const addLocalLocation = (payload: LocalLocation) => ({
  type: LOCATION_ADD_LOCAL,
  payload,
});

export const createLocation = (payload: LocalLocation) => ({
  type: LOCATION_CREATE,
  payload,
});

export const createLocationSuccess = (payload: RemoteLocation) => ({
  type: LOCATION_CREATE_SUCCESS,
  payload,
});

export const createLocationFail = (error: unknown) => ({
  type: LOCATION_CREATE_FAIL,
  error,
});

// TODO: updateLocationFavouriteSuccess
// TODO: updateLocationFavouriteFail

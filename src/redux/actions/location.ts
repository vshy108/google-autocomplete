import {
  type PaginatedLocations,
  type LocalLocation,
  type RemoteLocation,
  type UpdateFavouritePayload,
  type DeleteLocationActionPayload,
} from '@/types';

const PREFIX = 'LOCATION';

export const LOCATION_LIST = `${PREFIX}/LIST_REQUEST`;
export const LOCATION_LIST_SUCCESS = `${PREFIX}/LIST_SUCCESS`;
export const LOCATION_LIST_FAIL = `${PREFIX}/LIST_FAIL`;

export const LOCATION_ADD_LOCAL = `${PREFIX}/ADD_LOCAL`;

export const LOCATION_CREATE = `${PREFIX}/CREATE`;
export const LOCATION_CREATE_SUCCESS = `${PREFIX}/CREATE_SUCCESS`;
export const LOCATION_CREATE_FAIL = `${PREFIX}/CREATE_FAIL`;

export const LOCATION_UPDATE_FAVOURITE = `${PREFIX}/UPDATE_FAVOURITE_REQUEST`;
export const LOCATION_UPDATE_FAVOURITE_SUCCESS = `${PREFIX}/UPDATE_FAVOURITE_SUCCESS`;
export const LOCATION_UPDATE_FAVOURITE_FAIL = `${PREFIX}/UPDATE_FAVOURITE_FAIL`;

export const LOCATION_DELETE = `${PREFIX}/DELETE_REQUEST`;
export const LOCATION_DELETE_SUCCESS = `${PREFIX}/DELETE_SUCCESS`;
export const LOCATION_DELETE_FAIL = `${PREFIX}/DELETE_FAIL`;

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

export const updateLocationFavourite = (payload: UpdateFavouritePayload) => ({
  type: LOCATION_UPDATE_FAVOURITE,
  payload,
});

export const updateLocationFavouriteSuccess = (payload: RemoteLocation) => ({
  type: LOCATION_UPDATE_FAVOURITE_SUCCESS,
  payload,
});

export const updateLocationFavouriteFail = (error: unknown) => ({
  type: LOCATION_UPDATE_FAVOURITE_FAIL,
  error,
});

export const deleteLocation = (payload: DeleteLocationActionPayload) => ({
  type: LOCATION_DELETE,
  payload,
});

export const deleteLocationSuccess = (id: number) => ({
  type: LOCATION_DELETE_SUCCESS,
  id,
});

export const deleteLocationFail = (error: unknown) => ({
  type: LOCATION_DELETE_FAIL,
  error,
});

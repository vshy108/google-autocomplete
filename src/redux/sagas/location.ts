import { takeLatest, all, fork, call, put } from 'redux-saga/effects';
import Actions from '@/redux/actions';
import api from '@/services';
import {
  type SingleLocationResponse,
  type ResponseListRemote,
  type DeleteLocationResponse,
} from '@/types';
import {
  createLocation,
  deleteLocation,
  listLocation,
  updateLocationFavourite,
} from '../actions/location';
import get from 'lodash/get';

export function* listRemote({
  page,
  rowsPerPage,
  orderBy,
  order,
}: ReturnType<typeof listLocation>): Generator<
  unknown,
  void,
  ResponseListRemote
> {
  try {
    const response = yield call(api.listRemoteLocations, {
      pageIndexZero: page,
      pageSize: rowsPerPage,
      columnName: orderBy,
      isAscending: order ? order === 'asc' : undefined,
    });
    if (response?.status === 200) {
      yield put(Actions.listLocationSuccess(response?.data));
    }
  } catch (error) {
    yield put(Actions.listLocationFail(error));
    yield put(
      Actions.triggerNotification({
        message: get(
          error,
          'response.data.message',
          'Failed on listing remote location. Please try again later'
        ),
        severity: 'error',
      })
    );
  }
}

export function* createRemote({
  payload,
}: ReturnType<typeof createLocation>): Generator<
  unknown,
  void,
  SingleLocationResponse
> {
  try {
    const response = yield call(api.createLocation, payload);
    if (response?.status === 200) {
      yield put(
        Actions.triggerNotification({
          message: 'Successfully creating location.',
          severity: 'success',
        })
      );
      yield put(Actions.createLocationSuccess(response?.data));
    }
  } catch (error) {
    // NOTE: Uniqueness conflict on name column
    yield put(
      Actions.triggerNotification({
        message: get(
          error,
          'response.data.message',
          'Failed on creating location. Please try again later'
        ),
        severity: 'error',
      })
    );
    yield put(Actions.createLocationFail(error));
  }
}

export function* updateFavourite({
  payload,
}: ReturnType<typeof updateLocationFavourite>): Generator<
  unknown,
  void,
  SingleLocationResponse
> {
  try {
    const response = yield call(api.updateLocationFavourite, payload);
    if (response?.status === 200) {
      yield put(
        Actions.triggerNotification({
          message: 'Successfully update favourite of the location.',
          severity: 'success',
        })
      );
      yield put(Actions.updateLocationFavouriteSuccess(response?.data));
    }
  } catch (error) {
    yield put(
      Actions.triggerNotification({
        message: get(
          error,
          'response.data.message',
          'Failed on update favourite of the location. Please try again later'
        ),
        severity: 'error',
      })
    );
    yield put(Actions.updateLocationFavouriteFail(error));
  }
}

export function* deleteRemote({
  payload: { id, onSuccess },
}: ReturnType<typeof deleteLocation>): Generator<
  unknown,
  void,
  DeleteLocationResponse
> {
  try {
    const response = yield call(api.deleteRemoteLocation, id);
    if (response?.status === 200) {
      yield put(
        Actions.triggerNotification({
          message: 'Successfully delete location.',
          severity: 'success',
        })
      );
      yield put(Actions.deleteLocationSuccess(id));
      onSuccess?.();
    }
  } catch (error) {
    yield put(
      Actions.triggerNotification({
        message: get(
          error,
          'response.data.message',
          'Failed on delete location. Please try again later'
        ),
        severity: 'error',
      })
    );
    yield put(Actions.deleteLocationFail(error));
  }
}

function* watchListRemote() {
  yield takeLatest(Actions.LOCATION_LIST, listRemote);
}

function* watchCreateRemote() {
  yield takeLatest(Actions.LOCATION_CREATE, createRemote);
}

function* watchUpdateFavourite() {
  yield takeLatest(Actions.LOCATION_UPDATE_FAVOURITE, updateFavourite);
}

function* watchDelete() {
  yield takeLatest(Actions.LOCATION_DELETE, deleteRemote);
}

export default function* location() {
  yield all([
    fork(watchListRemote),
    fork(watchCreateRemote),
    fork(watchUpdateFavourite),
    fork(watchDelete),
  ]);
}

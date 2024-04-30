import { takeLatest, all, fork, call, put } from 'redux-saga/effects';
import Actions from '@/redux/actions';
import api from '@/services';
import { type ResponseCreateRemote, type ResponseListRemote } from '@/types';
import {
  addLocalLocation,
  createLocation,
  listLocation,
} from '../actions/location';
import get from 'lodash/get';

// TODO: list, create, update, delete

function* listRemote({
  page,
  rowsPerPage,
}: ReturnType<typeof listLocation>): Generator<
  unknown,
  void,
  ResponseListRemote
> {
  try {
    const response = yield call(api.listRemoteLocations, {
      pageIndexZero: page,
      pageSize: rowsPerPage,
    });
    if (response?.status === 200) {
      yield put(Actions.listLocationSuccess(response?.data));
    }
  } catch (error) {
    // TODO: can generate error by remove column name checking
    yield put(Actions.listLocationFail(error));
  }
}

function* createRemote({
  payload,
}: ReturnType<typeof createLocation>): Generator<
  unknown,
  void,
  ResponseCreateRemote
> {
  try {
    const response = yield call(api.createLocation, payload);
    if (response?.status === 200) {
      yield put(Actions.createLocationSuccess(response?.data));
    }
  } catch (error) {
    // TODO: case of unique
    yield put(Actions.createLocationFail(error));
    yield put(
      Actions.triggerNotification({
        message: get(error, 'response.data.message', 'Please try again later'),
        severity: 'error',
      })
    );
    // restore the failure local record
    yield put(addLocalLocation(payload));
  }
}

function* watchListRemote() {
  yield takeLatest(Actions.LOCATION_LIST, listRemote);
}

function* watchCreateRemote() {
  yield takeLatest(Actions.LOCATION_CREATE, createRemote);
}

export default function* location() {
  yield all([fork(watchListRemote), fork(watchCreateRemote)]);
}

import { takeLatest, all, fork, call, put } from 'redux-saga/effects';
import Actions from '@/redux/actions';
import api from '@/services';
import { type ResponseCreateRemote, type ResponseListRemote } from '@/types';
import { createLocation } from '../actions/location';

// TODO: list, create, update, delete

function* listRemote(): Generator<unknown, void, ResponseListRemote> {
  try {
    const response = yield call(api.listRemoteLocations);
    if (response?.status === 200) {
      yield put(Actions.listLocationSuccess(response?.data?.data));
    }
  } catch (error) {
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
      yield put(Actions.createLocationSuccess(response?.data?.data));
    }
  } catch (error) {
    yield put(Actions.createLocationFail(error));
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

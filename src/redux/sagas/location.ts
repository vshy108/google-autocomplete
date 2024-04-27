import { takeLatest, all, fork, call, put } from 'redux-saga/effects';
import Actions from '@/redux/actions';
import api from '@/services';
import { type Response } from '@/types';

// TODO: list, create, update, delete

function* list(): Generator<unknown, void, Response> {
  try {
    const response = yield call(api.listLocations);
    if (response?.status === 200) {
      yield put(Actions.listLocationSuccess(response?.data?.data));
    }
  } catch (error) {
    yield put(Actions.listLocationFail(error));
  }
}

function* watchList() {
  yield takeLatest(Actions.LOCATION_LIST, list);
}

export default function* location() {
  yield all([fork(watchList)]);
}

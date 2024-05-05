import { vi, describe, it, expect } from 'vitest';
import {
  deleteRemote,
  listRemote,
  createRemote,
  updateFavourite,
} from '../../../src/redux/sagas/location.ts';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { faker } from '@faker-js/faker';
import api from '../../../src/services/index.ts';
import { TRIGGER_NOTIFICATION } from '../../../src/redux/actions/notification.ts';
import Actions from '../../../src/redux/actions/index.ts';

describe('list location', () => {
  it('should trigger related success action', () => {
    const page = Math.random();
    const rowsPerPage = Math.random();
    return expectSaga(listRemote, {
      payload: { page, rowsPerPage },
    })
      .provide([
        [matchers.call.fn(api.listRemoteLocations), { status: 200, data: [] }],
      ])
      .put(Actions.listLocationSuccess([]))
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    const page = Math.random();
    const rowsPerPage = Math.random();
    return expectSaga(listRemote, {
      payload: { page, rowsPerPage },
    })
      .provide([[matchers.call.fn(api.listRemoteLocations), throwError(error)]])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message,
          severity: 'error',
        },
      })
      .put(Actions.listLocationFail(error))
      .run();
  });

  it('should raise error notification with default message and related fail action', () => {
    const error = {};

    const page = Math.random();
    const rowsPerPage = Math.random();
    return expectSaga(listRemote, {
      payload: { page, rowsPerPage },
    })
      .provide([[matchers.call.fn(api.listRemoteLocations), throwError(error)]])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Failed on listing remote location. Please try again later',
          severity: 'error',
        },
      })
      .put(Actions.listLocationFail(error))
      .run();
  });
});

describe('create location', () => {
  it('should trigger success notification and related success action', () => {
    const payload = {};
    const responseData = {};
    return expectSaga(createRemote, payload)
      .provide([
        [
          matchers.call.fn(api.createLocation),
          { status: 200, data: responseData },
        ],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Successfully creating location.',
          severity: 'success',
        },
      })
      .put(Actions.createLocationSuccess(responseData))
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    return expectSaga(createRemote, {
      payload: {},
    })
      .provide([[matchers.call.fn(api.createLocation), throwError(error)]])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message,
          severity: 'error',
        },
      })
      .put(Actions.createLocationFail(error))
      .run();
  });

  it('should raise error notification with default message and related fail action', () => {
    const error = {};

    return expectSaga(createRemote, {
      payload: {},
    })
      .provide([[matchers.call.fn(api.createLocation), throwError(error)]])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Failed on creating location. Please try again later',
          severity: 'error',
        },
      })
      .put(Actions.createLocationFail(error))
      .run();
  });
});

describe('update location favourite', () => {
  it('should trigger success notification and related success action', () => {
    const payload = {};
    const responseData = {};
    return expectSaga(updateFavourite, payload)
      .provide([
        [
          matchers.call.fn(api.updateLocationFavourite),
          { status: 200, data: responseData },
        ],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Successfully update favourite of the location.',
          severity: 'success',
        },
      })
      .put(Actions.updateLocationFavouriteSuccess(responseData))
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    return expectSaga(updateFavourite, {
      payload: {},
    })
      .provide([
        [matchers.call.fn(api.updateLocationFavourite), throwError(error)],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message,
          severity: 'error',
        },
      })
      .put(Actions.updateLocationFavouriteFail(error))
      .run();
  });

  it('should raise error notification with default message and related fail action', () => {
    const error = {};

    return expectSaga(updateFavourite, {
      payload: {},
    })
      .provide([
        [matchers.call.fn(api.updateLocationFavourite), throwError(error)],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message:
            'Failed on update favourite of the location. Please try again later',
          severity: 'error',
        },
      })
      .put(Actions.updateLocationFavouriteFail(error))
      .run();
  });
});

describe('delete location', () => {
  it('should raise success notification, related success action and trigger onSuccess', () => {
    const id = Math.random();
    const onSuccessSpy = vi.fn();
    return expectSaga(deleteRemote, {
      payload: { id, onSuccess: onSuccessSpy },
    })
      .provide([[matchers.call.fn(api.deleteRemoteLocation), { status: 200 }]])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Successfully delete location.',
          severity: 'success',
        },
      })
      .put(Actions.deleteLocationSuccess(id))
      .run()
      .then(() => {
        // Check if onSuccess was called
        expect(onSuccessSpy).toHaveBeenCalledOnce();
      });
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    return expectSaga(deleteRemote, {
      payload: { id: 1, onSuccess: () => {} },
    })
      .provide([
        [matchers.call.fn(api.deleteRemoteLocation), throwError(error)],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message,
          severity: 'error',
        },
      })
      .put(Actions.deleteLocationFail(error))
      .run();
  });

  it('should raise error notification with default message and related fail action', () => {
    const error = {};

    return expectSaga(deleteRemote, {
      payload: { id: 1, onSuccess: () => {} },
    })
      .provide([
        [matchers.call.fn(api.deleteRemoteLocation), throwError(error)],
      ])
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Failed on delete location. Please try again later',
          severity: 'error',
        },
      })
      .put(Actions.deleteLocationFail(error))
      .run();
  });
});

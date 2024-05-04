import { vi, describe, it, expect } from 'vitest';
import { deleteRemote } from '../../../src/redux/sagas/location.ts';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { faker } from '@faker-js/faker';
import api from '../../../src/services/index.ts';
import { TRIGGER_NOTIFICATION } from '../../../src/redux/actions/notification.ts';
import Actions from '../../../src/redux/actions';

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

  it('should raise error notification and related fail action', () => {
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
});

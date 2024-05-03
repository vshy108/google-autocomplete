import { afterEach, vi, describe, it, expect } from 'vitest';
import { deleteRemote } from '../../../src/redux/sagas/location.ts';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import api from '../../../src/services/index.ts';
import { TRIGGER_NOTIFICATION } from '../../../src/redux/actions/notification.ts';
import Actions from '../../../src/redux/actions';

describe('delete location', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should raise success notification, related success action and trigger onSuccess', () => {
    vi.mock('../../../src/services/index.ts', async importOriginal => {
      const mod = await importOriginal();
      return {
        default: {
          ...mod.default,
          deleteRemoteLocation: vi
            .fn()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .mockImplementation(_id => ({ status: 200 })),
        },
      };
    });

    // NOTE: another way to mock, but this one not mocking other keys
    // const fnMock = vi.hoisted(() => {
    //   return {
    //     default: {
    //       default: vi.fn(),
    //       deleteRemoteLocation: vi
    //         .fn()
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         .mockImplementation(_id => ({ status: 200 })),
    //     },
    //   };
    // });

    // vi.mock('../../../src/services/index.ts', () => {
    //   return fnMock;
    // });

    // NOTE: check if the mock is working like expected
    // expect(api.deleteRemoteLocation(1)).toStrictEqual({ status: 200 });

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
});

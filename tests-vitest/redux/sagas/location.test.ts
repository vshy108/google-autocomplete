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
import reducer, {
  DEFAULT_REMOTE_LOCATIONS,
} from '../../../src/redux/reducers/location.ts';

describe('list location', () => {
  it('should trigger related success action and update location redux state', () => {
    const page = 0;
    const rowsPerPage = 10;
    const responseData = {
      content: [
        {
          id: faker.number.int({ min: 1, max: 100 }),
          name: faker.lorem.text(),
          southWest: {
            x: faker.number.int({ min: -180, max: 180 }),
            y: faker.number.int({ min: -90, max: 90 }),
          },
          northEast: {
            x: faker.number.int({ min: -180, max: 180 }),
            y: faker.number.int({ min: -90, max: 90 }),
          },
          center: {
            x: faker.number.int({ min: -180, max: 180 }),
            y: faker.number.int({ min: -90, max: 90 }),
          },
          isFavourite: faker.datatype.boolean(),
        },
      ],
      number: page,
      size: rowsPerPage,
      totalElements: 10 + faker.number.int({ min: 1, max: 10 }),
    };
    return expectSaga(listRemote, {
      type: Actions.LOCATION_LIST,
      page,
      rowsPerPage,
      orderBy: undefined,
      order: undefined,
    })
      .withReducer(reducer)
      .provide([
        [
          matchers.call.fn(api.listRemoteLocations),
          {
            status: 200,
            data: responseData,
          },
        ],
      ])
      .put(Actions.listLocationSuccess(responseData))
      .hasFinalState({
        localLocations: [],
        remoteLocations: responseData.content,
        totalRows: responseData.totalElements,
        rowsPerPage: responseData.size,
        page: responseData.number,
      })
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    const page = Math.random();
    const rowsPerPage = Math.random();
    return expectSaga(listRemote, {
      type: Actions.LOCATION_LIST,
      page,
      rowsPerPage,
      orderBy: undefined,
      order: undefined,
    })
      .provide([
        // @ts-expect-error throwError only support Error
        [matchers.call.fn(api.listRemoteLocations), throwError(error)],
      ])
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
    const error = new Error();

    const page = Math.random();
    const rowsPerPage = Math.random();
    return expectSaga(listRemote, {
      type: Actions.LOCATION_LIST,
      page,
      rowsPerPage,
      orderBy: undefined,
      order: undefined,
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
  const requestBody = {
    type: Actions.LOCATION_CREATE,
    payload: {
      name: faker.lorem.text(),
      southWest: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      northEast: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      center: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      isFavourite: true,
    },
  };

  it('should trigger success notification, related success action and update redux location state', () => {
    const responseData = {};
    return expectSaga(createRemote, {
      type: Actions.LOCATION_CREATE,
      payload: requestBody,
    })
      .withReducer(reducer, {
        ...DEFAULT_REMOTE_LOCATIONS,
        localLocations: [{ ...requestBody, isFavourite: false }],
      })
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
      .hasFinalState({
        ...DEFAULT_REMOTE_LOCATIONS,
        localLocations: [],
      })
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    return expectSaga(createRemote, {
      type: Actions.LOCATION_CREATE,
      payload: requestBody,
    })
      .provide([
        // @ts-expect-error throwError only support Error
        [matchers.call.fn(api.createLocation), throwError(error)],
      ])
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
    const error = new Error();

    return expectSaga(createRemote, {
      type: Actions.LOCATION_CREATE,
      payload: requestBody,
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
  const payload = {
    type: Actions.LOCATION_UPDATE_FAVOURITE,
    payload: {
      id: faker.number.int({ min: 1, max: 100 }),
      isFavourite: faker.datatype.boolean(),
    },
  };

  it('should trigger success notification and related success action', () => {
    const responseData = {
      id: payload.payload.id,
      name: faker.lorem.text(),
      southWest: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      northEast: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      center: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      isFavourite: payload.payload.isFavourite,
    };
    const originalReducerState = {
      localLocations: [],
      remoteLocations: [
        { ...responseData, isFavourite: !responseData.isFavourite },
      ],
      totalRows: 1,
      rowsPerPage: 10,
      page: 0,
    };
    return expectSaga(updateFavourite, {
      type: Actions.LOCATION_UPDATE_FAVOURITE,
      payload,
    })
      .withReducer(reducer, originalReducerState)
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
      .hasFinalState({
        ...originalReducerState,
        remoteLocations: [responseData],
      })
      .run();
  });

  it('should raise error notification with provided message and related fail action', () => {
    const message = faker.lorem.text();
    const error = { response: { data: { message } } };

    return expectSaga(updateFavourite, {
      type: Actions.LOCATION_UPDATE_FAVOURITE,
      payload,
    })
      .provide([
        // @ts-expect-error throwError only support Error
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
    const error = new Error();

    return expectSaga(updateFavourite, {
      type: Actions.LOCATION_UPDATE_FAVOURITE,
      payload,
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
    const existingLocation = {
      id,
      name: faker.lorem.text(),
      southWest: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      northEast: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      center: {
        lng: faker.number.int({ min: -180, max: 180 }),
        lat: faker.number.int({ min: -90, max: 90 }),
      },
      isFavourite: faker.datatype.boolean(),
    };
    const originalReducerState = {
      localLocations: [],
      remoteLocations: [existingLocation],
      totalRows: 1,
      rowsPerPage: 10,
      page: 0,
    };
    const onSuccessSpy = vi.fn();
    return expectSaga(deleteRemote, {
      type: Actions.LOCATION_DELETE,
      payload: { id, onSuccess: onSuccessSpy },
    })
      .provide([[matchers.call.fn(api.deleteRemoteLocation), { status: 200 }]])
      .withReducer(reducer, originalReducerState)
      .put({
        type: TRIGGER_NOTIFICATION,
        payload: {
          message: 'Successfully delete location.',
          severity: 'success',
        },
      })
      .put(Actions.deleteLocationSuccess(id))
      .hasFinalState({
        ...originalReducerState,
        remoteLocations: [],
      })
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
      type: Actions.LOCATION_DELETE,
      payload: { id: 1, onSuccess: () => {} },
    })
      .provide([
        // @ts-expect-error throwError only support Error
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
    const error = new Error();

    return expectSaga(deleteRemote, {
      type: Actions.LOCATION_DELETE,
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

import Actions from '@/redux/actions';
import { type AnyAction } from 'redux-saga';
import { type LocalLocation, RemoteLocation } from '@/types';

const DEFAULT_REMOTE_LOCATIONS = {
  remoteLocations: [] as RemoteLocation[],
  totalRows: null,
  rowsPerPage: 10,
  page: 0,
};

const initialState = Object.freeze({
  localLocations: [] as LocalLocation[],
  ...DEFAULT_REMOTE_LOCATIONS,
});

const location = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.LOCATION_ADD_LOCAL: {
      if (
        state.localLocations.findIndex(
          location => location.name === action.payload.name
        ) === -1
      ) {
        return {
          ...state,
          localLocations: [...state.localLocations, action.payload],
        };
      }

      return state;
    }

    case Actions.LOCATION_CREATE: {
      const newLocalLocations = state.localLocations.filter(
        localLocation => localLocation.name !== action.payload.name
      );
      return { ...state, localLocations: newLocalLocations };
    }

    case Actions.LOCATION_UPDATE_FAVOURTIE: {
      const matchIndex = state.remoteLocations.findIndex(
        location => location.name === action.payload.name
      );
      if (matchIndex !== -1) {
        const beforeIndex = state.remoteLocations.slice(0, matchIndex);
        const target = state.remoteLocations[matchIndex];
        target.isFavourite = action.payload.isFavourite;
        const afterIndex = state.remoteLocations.slice(matchIndex + 1);
        return {
          ...state,
          remoteLocations: [...beforeIndex, target, ...afterIndex],
        };
      }

      return state;
    }

    case Actions.LOCATION_LIST_SUCCESS: {
      const {
        content: remoteLocations,
        totalElements: totalRows,
        size: rowsPerPage,
        number: page,
      } = action.payload;
      return {
        ...state,
        remoteLocations,
        totalRows,
        rowsPerPage,
        page,
      };
    }

    default:
      return state;
  }
};

export default location;

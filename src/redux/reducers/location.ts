import Actions from '@/redux/actions';
import { type AnyAction } from 'redux-saga';
import { type RemoteLocation } from '@/types';

const initialState = Object.freeze({
  locations: [] as RemoteLocation[],
});

const location = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.LOCATION_ADD: {
      if (
        state.locations.findIndex(
          location => location.name === action.payload.name
        ) === -1
      ) {
        return {
          ...state,
          locations: [...state.locations, action.payload],
        };
      }

      return state;
    }

    case Actions.LOCATION_UPDATE_FAVOURTIE: {
      const matchIndex = state.locations.findIndex(
        location => location.name === action.payload.name
      );
      if (matchIndex !== -1) {
        const beforeIndex = state.locations.slice(0, matchIndex);
        const target = state.locations[matchIndex];
        target.isFavourite = action.payload.isFavourite;
        const afterIndex = state.locations.slice(matchIndex + 1);
        return {
          ...state,
          locations: [...beforeIndex, target, ...afterIndex],
        };
      }

      return state;
    }

    default:
      return state;
  }
};

export default location;

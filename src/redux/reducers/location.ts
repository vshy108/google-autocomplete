import { combineReducers } from 'redux';
import Actions from '@/redux/actions';
import { type AnyAction } from 'redux-saga';

export type Location = {
  id: number;
  isFavourite: boolean;
};

const initialState = Object.freeze({
  locations: [] as Location[],
  favouriteIds: [],
});

const location = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.LOCATION_LIST_SUCCESS:
      return {
        ...state,
        locations: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  location,
});

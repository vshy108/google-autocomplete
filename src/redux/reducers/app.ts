import Actions from '@/redux/actions';
import { type AnyAction } from 'redux-saga';
import { type NotificationPayload } from '@/types';

const initialState = Object.freeze({
  notificationData: null as NotificationPayload | null,
});

const app = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.TRIGGER_NOTIFICATION: {
      return {
        ...state,
        notificationData: action.payload,
      };
    }

    default:
      return state;
  }
};

export default app;

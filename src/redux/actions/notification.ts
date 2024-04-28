import { type NotificationPayload } from '@/types';

const PREFIX = 'APP';

export const TRIGGER_NOTIFICATION = `${PREFIX}/TRIGGER_NOTIFICATION`;

export const triggerNotification = (payload?: NotificationPayload) => ({
  type: TRIGGER_NOTIFICATION,
  payload,
});

import { AxiosResponse } from 'axios';
import api from './helper';
import { type LocalLocation, type RemoteLocation } from '@/types';

export default {
  // List remote locations
  listRemoteLocations: (): Promise<AxiosResponse<RemoteLocation[], object>> =>
    api.get('api/users'),
  createLocation: (
    payload: LocalLocation
  ): Promise<AxiosResponse<RemoteLocation, object>> =>
    api.post('api/users', payload),
};

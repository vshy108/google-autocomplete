import { AxiosResponse } from 'axios';
import api from './helper';
import { type RemoteLocation } from '@/types';

export default {
  // List cloud stored locations
  listLocations: (): Promise<AxiosResponse<RemoteLocation[], object>> =>
    api.get('api/users'),
};

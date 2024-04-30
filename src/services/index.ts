import { AxiosResponse } from 'axios';
import api from './helper';
import { type LocalLocation, type RemoteLocation } from '@/types';

export default {
  // List remote locations
  listRemoteLocations: (params: {
    pageIndexZero: number;
    pageSize: number;
  }): Promise<AxiosResponse<RemoteLocation[]>> => api.get('locations', params),
  createLocation: (
    payload: LocalLocation
  ): Promise<AxiosResponse<RemoteLocation>> => api.post('location', payload),
};

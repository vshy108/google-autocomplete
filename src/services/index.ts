import { AxiosResponse } from 'axios';
import api from './helper';
import {
  type UpdateFavouritePayload,
  type LocalLocation,
  type RemoteLocation,
} from '@/types';

export default {
  // List remote locations
  listRemoteLocations: (params: {
    pageIndexZero: number;
    pageSize: number;
    columnName: string | undefined;
    isAscending: boolean | undefined;
  }): Promise<AxiosResponse<RemoteLocation[]>> => api.get('locations', params),
  createLocation: (
    payload: LocalLocation
  ): Promise<AxiosResponse<RemoteLocation>> => api.post('location', payload),
  updateLocationFavourite: (
    payload: UpdateFavouritePayload
  ): Promise<AxiosResponse<RemoteLocation>> =>
    api.put(`locations/${payload?.id}`, { isFavourite: payload?.isFavourite }),
  deleteRemoteLocation: (id: number): Promise<AxiosResponse<string>> =>
    api.delete(`locations/${id}`),
};

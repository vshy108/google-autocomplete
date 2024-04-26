import { AxiosResponse } from 'axios';
import api from './helper';
import { type Location } from '@/redux/reducers/location';

export default {
  // List cloud stored locations
  listLocations: (): Promise<AxiosResponse<Location[], object>> =>
    api.get('api/users'),
};

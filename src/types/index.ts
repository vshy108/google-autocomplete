import {
  type AlertColor,
  type AlertPropsColorOverrides,
} from '@mui/material/Alert/Alert';
import { type SxProps, type Theme } from '@mui/material/styles';
import { type OverridableStringUnion } from '@mui/types';

export type LocalLocation = {
  name: string;
  southWest: google.maps.LatLngLiteral;
  northEast: google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
  isFavourite: boolean;
};

export type LocalLocationTableRow = LocalLocation & { id: number };

export type RemotePoint = {
  x: number;
  y: number;
};

export type RemoteLocation = {
  id: number;
  name: string;
  southWest: RemotePoint;
  northEast: RemotePoint;
  center: RemotePoint;
  isFavourite: boolean;
};

export type ResponseListRemote = {
  status: number;
  data: PaginatedLocations;
};

export type SingleLocationResponse = {
  status: number;
  data: RemoteLocation;
};

export type FavouriteLocalLocationPayload = {
  name: string;
};

export type NotificationPayload = {
  message: string;
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
  duration?: number;
  sx?: SxProps<Theme>;
};

export type PaginatedSort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type PaginatedLocations = {
  content: RemoteLocation[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: PaginatedSort;
    unpaged: boolean;
  };
  size: number;
  sort: PaginatedSort;
  totalElements: number;
  totalPages: number;
};

export type UpdateFavouritePayload = {
  id: number;
  isFavourite: boolean;
};

export type DeleteLocationResponse = {
  status: number;
  data: string;
};

export type DeleteLocationActionPayload = {
  id: number;
  onSuccess?: () => void;
};

export type OrderString = 'asc' | 'desc' | undefined;

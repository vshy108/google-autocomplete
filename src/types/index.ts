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

export type RemoteLocation = {
  id: number;
  name: string;
  southWest: google.maps.LatLngLiteral;
  northEast: google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
  isFavourite: boolean;
};

export type ResponseListRemote = {
  status: number;
  data: { data: RemoteLocation[] };
};

export type ResponseCreateRemote = {
  status: number;
  data: { data: RemoteLocation };
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

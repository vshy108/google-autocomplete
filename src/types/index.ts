export type RawLocation = {
  name: string;
  southWest: google.maps.LatLngLiteral;
  northEast: google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
};

export type RemoteLocation = {
  id: number;
  name: string;
  southWest: google.maps.LatLngLiteral;
  northEast: google.maps.LatLngLiteral;
  center: google.maps.LatLngLiteral;
  isFavourite: boolean;
};

export type Response = {
  status: number;
  data: { data: RemoteLocation[] };
};

export type updateLocationFavouritePayload = {
  name: string;
  isFavourite: boolean;
};

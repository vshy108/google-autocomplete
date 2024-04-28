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

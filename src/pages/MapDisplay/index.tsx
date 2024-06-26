import { useRef, useState, memo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Libraries,
  Marker,
} from '@react-google-maps/api';
import { type Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import './index.less';
import { addLocalLocation } from '@/redux/actions/location';
import { type RootState } from '@/redux/configureStore';
import { triggerNotification } from '@/redux/actions/notification';
import { type LocalLocation, type RemoteLocation } from '@/types';

const containerStyle = {
  width: '100vw',
  height: 'calc(100vh - 56px)',
};

const defaultCenter = {
  lat: 3.1474168,
  lng: 101.6969531,
};

const defaultZoom = 13;

const libraries: Libraries | undefined = ['places'];

const MapDisplay = memo(() => {
  const dispatch: Dispatch = useDispatch();
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);

  const localLocations = useSelector(
    (state: RootState) => state.location.localLocations
  );

  const remoteLocations = useSelector(
    (state: RootState) => state.location.remoteLocations
  );

  const onLoad = (newMap: google.maps.Map) => {
    setMap(newMap);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const onLoadAutoComplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autoCompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autoCompleteRef.current !== null) {
      const place = autoCompleteRef.current?.getPlace();
      if (place?.geometry?.location) {
        if (
          place.formatted_address &&
          place.geometry.location &&
          place.geometry.viewport
        ) {
          // -90 to 90 for latitude and -180 to 180 for longitude
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          const southWest = {
            lat: place.geometry.viewport.getSouthWest().lat(),
            lng: place.geometry.viewport.getSouthWest().lng(),
          };
          const northEast = {
            lat: place.geometry.viewport.getNorthEast().lat(),
            lng: place.geometry.viewport.getNorthEast().lng(),
          };
          const center = { lat: latitude, lng: longitude };
          const latlngBounds = new google.maps.LatLngBounds(
            southWest,
            northEast
          );
          map?.fitBounds(latlngBounds);
          const name = place.formatted_address;
          const isExistLocal = localLocations.find(
            (loc: LocalLocation) => loc.name === name
          );
          const isExistRemote = remoteLocations.find(
            (loc: RemoteLocation) => loc.name === name
          );
          if (!isExistLocal && !isExistRemote) {
            dispatch(
              addLocalLocation({
                name,
                southWest,
                northEast,
                center,
                isFavourite: false,
              })
            );
          } else {
            dispatch(
              triggerNotification({
                message: `Exist in ${
                  isExistLocal ? 'local' : 'remote'
                } records`,
                severity: 'warning',
              })
            );
          }

          setMarker(center);
        }
      }
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={defaultZoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Autocomplete onLoad={onLoadAutoComplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search your place"
          className="autocomplete-input"
        />
      </Autocomplete>
      {!!marker && <Marker position={marker} />}
    </GoogleMap>
  ) : (
    <></>
  );
});

export default MapDisplay;

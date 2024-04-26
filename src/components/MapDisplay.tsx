import React, { useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';

const containerStyle = {
  width: 'calc(100vw - 100px)',
  height: 'calc(100vh - 100px)',
};

const defaultCenter = {
  lat: 3.1474168,
  lng: 101.6969531,
};

const defaultZoom = 13;

const MapDisplay = React.memo(() => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

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
      // Check if place has geometry and location
      if (place?.geometry?.location) {
        // Extract latitude and longitude
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // Use latitude and longitude as needed
        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        map?.setCenter({ lat: latitude, lng: longitude });
        map?.setZoom(defaultZoom);
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
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
          style={{
            backgroundColor: 'gray',
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `360px`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: 'absolute',
            left: '200px',
            top: '10px',
            color: 'cyan',
          }}
        />
      </Autocomplete>
    </GoogleMap>
  ) : (
    <></>
  );
});

export default MapDisplay;

import React, { useRef, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const defaultCenter = {
  lat: 3.140853,
  lng: 101.693207,
};

const MapDisplay = React.memo(() => {
  const [center, setCenter] = useState(defaultCenter);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback((newMap: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    newMap.fitBounds(bounds);

    setMap(newMap);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

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
        setCenter({ lat: latitude, lng: longitude });
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Autocomplete onLoad={onLoadAutoComplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search your place"
          style={{
            backgroundColor: 'transparent',
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
          }}
        />
      </Autocomplete>
    </GoogleMap>
  ) : (
    <></>
  );
});

export default MapDisplay;

import React, { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Libraries,
} from '@react-google-maps/api';
import { type Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { listLocation } from '@/redux/actions/location';

import './index.less';

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

const MapDisplay = React.memo(() => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const dispatch: Dispatch = useDispatch();

  useEffect(() => {
    dispatch(listLocation());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          className="autocomplete-input"
        />
      </Autocomplete>
    </GoogleMap>
  ) : (
    <></>
  );
});

export default MapDisplay;

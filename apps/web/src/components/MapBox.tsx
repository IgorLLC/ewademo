import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapLayerMouseEvent } from 'mapbox-gl';

interface MapBoxProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  height?: string;
  className?: string;
  onAddressChange?: (address: string, lat: number, lng: number) => void;
}

const MapBox: React.FC<MapBoxProps> = ({
  address,
  latitude = 18.4655,  // Coordenadas predeterminadas para Puerto Rico
  longitude = -66.1057,
  height = '300px',
  className = '',
  onAddressChange
}) => {
  const [viewState, setViewState] = useState({
    latitude,
    longitude,
    zoom: 13
  });

  // Actualizar el mapa si cambian las coordenadas desde props
  useEffect(() => {
    if (latitude && longitude) {
      setViewState(prev => ({
        ...prev,
        latitude,
        longitude
      }));
    }
  }, [latitude, longitude]);

  // Función para geocodificar una dirección (convertir dirección a coordenadas)
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaWdvcmxscyIsImEiOiJjbTNuZ2tpaXoxOHYwMnFvbno3MzVzNHRjIn0.w6cTofWhNf4SfUMAW3-ImA`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng, formattedAddress: data.features[0].place_name };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Efecto para geocodificar la dirección si se proporciona
  useEffect(() => {
    if (address && !latitude && !longitude) {
      geocodeAddress(address).then(result => {
        if (result) {
          setViewState(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lng
          }));
          
          if (onAddressChange) {
            onAddressChange(result.formattedAddress, result.lat, result.lng);
          }
        }
      });
    }
  }, [address, latitude, longitude, onAddressChange]);

  // Manejar el clic en el mapa para cambiar el marcador
  const handleMapClick = async (event: MapLayerMouseEvent) => {
    if (!onAddressChange) return; // Solo permitir cambios si se proporciona la función onAddressChange
    
    const { lng, lat } = event.lngLat;
    
    try {
      // Reverse geocoding (convertir coordenadas a dirección)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiaWdvcmxscyIsImEiOiJjbTNuZ2tpaXoxOHYwMnFvbno3MzVzNHRjIn0.w6cTofWhNf4SfUMAW3-ImA`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const formattedAddress = data.features[0].place_name;
        
        setViewState(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
        
        onAddressChange(formattedAddress, lat, lng);
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  return (
    <div style={{ height }} className={className}>
      <Map
        mapboxAccessToken="pk.eyJ1IjoiaWdvcmxscyIsImEiOiJjbTNuZ2tpaXoxOHYwMnFvbno3MzVzNHRjIn0.w6cTofWhNf4SfUMAW3-ImA"
        initialViewState={viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        onClick={onAddressChange ? handleMapClick : undefined}
      >
        <Marker 
          latitude={viewState.latitude} 
          longitude={viewState.longitude} 
          color="#0066FF"
        />
      </Map>
    </div>
  );
};

export default MapBox;

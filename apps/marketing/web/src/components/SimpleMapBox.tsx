import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Establecer el token de acceso para Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiaWdvcmxscyIsImEiOiJjbTNuZ2tpaXoxOHYwMnFvbno3MzVzNHRjIn0.w6cTofWhNf4SfUMAW3-ImA';

interface SimpleMapBoxProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  height?: string;
  className?: string;
  interactive?: boolean;
}

const SimpleMapBox: React.FC<SimpleMapBoxProps> = ({
  address,
  latitude = 18.4655, // Coordenadas predeterminadas para Puerto Rico
  longitude = -66.1057,
  height = '300px',
  className = '',
  interactive = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 13,
        interactive: interactive
      });

      // Añadir controles de navegación si el mapa es interactivo
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }

      // Añadir un marcador
      marker.current = new mapboxgl.Marker({ color: '#0066FF' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Limpiar el mapa cuando el componente se desmonta
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [longitude, latitude, interactive]);

  // Actualizar la posición del marcador si cambian las coordenadas
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true
      });
    }
  }, [longitude, latitude]);

  // Geocodificar la dirección si se proporciona
  useEffect(() => {
    if (address && !latitude && !longitude && map.current && marker.current) {
      const geocodeAddress = async () => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            
            marker.current?.setLngLat([lng, lat]);
            map.current?.flyTo({
              center: [lng, lat],
              essential: true
            });
          }
        } catch (error) {
          console.error('Error geocoding address:', error);
        }
      };

      geocodeAddress();
    }
  }, [address, latitude, longitude]);

  return (
    <div 
      ref={mapContainer} 
      style={{ height, width: '100%', borderRadius: '0.5rem' }} 
      className={className}
    />
  );
};

export default SimpleMapBox;

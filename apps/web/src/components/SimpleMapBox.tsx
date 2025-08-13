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
  // Ruta a dibujar como líneas conectando paradas [lng, lat]
  routePath?: Array<{ lng: number; lat: number }>; 
  fitToPath?: boolean;
  // Punto de recogido/origen
  pickupPoint?: { lat: number; lng: number };
  pickupLabel?: string;
}

const SimpleMapBox: React.FC<SimpleMapBoxProps> = ({
  address,
  latitude = 18.4655, // Coordenadas predeterminadas para Puerto Rico
  longitude = -66.1057,
  height = '300px',
  className = '',
  interactive = false,
  routePath,
  fitToPath = true,
  pickupPoint,
  pickupLabel
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const routeAddedRef = useRef<boolean>(false);
  const routeSourceIdRef = useRef<string>(`ewa-route-${Math.random().toString(36).slice(2, 10)}`);
  const routeLayerIdRef = useRef<string>(`${routeSourceIdRef.current}-line`);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Límites aproximados de Puerto Rico
  const PR_BOUNDS = {
    minLat: 17.8,
    maxLat: 18.6,
    minLng: -67.3,
    maxLng: -65.2
  };

  const clampToPR = (lat: number, lng: number) => ({
    lat: Math.min(Math.max(lat, PR_BOUNDS.minLat), PR_BOUNDS.maxLat),
    lng: Math.min(Math.max(lng, PR_BOUNDS.minLng), PR_BOUNDS.maxLng)
  });

  const sanitizeRoutePath = (points: Array<{ lng: number; lat: number }>): Array<{ lng: number; lat: number }> => {
    if (!points) return [];
    const cleaned = points
      .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map(p => {
        const c = clampToPR(p.lat, p.lng);
        return { lng: c.lng, lat: c.lat };
      });
    return cleaned;
  };

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

      // Añadir un marcador para el centro
      marker.current = new mapboxgl.Marker({ color: '#0066FF' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Cuando el estilo cargue, preparar capa de ruta si hay datos
      map.current.on('load', () => {
        // Añadir marker de pickup si se provee
        if (pickupPoint && Number.isFinite(pickupPoint.lat) && Number.isFinite(pickupPoint.lng)) {
          pickupMarkerRef.current = new mapboxgl.Marker({ color: '#16a34a' })
            .setLngLat([pickupPoint.lng, pickupPoint.lat])
            .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(pickupLabel || 'Punto de recogido'))
            .addTo(map.current!);
        }
        const sanitized = routePath ? sanitizeRoutePath(routePath) : [];
        if (sanitized.length >= 2) {
          const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: sanitized.map(p => [p.lng, p.lat])
            }
          };
          const sourceId = routeSourceIdRef.current;
          const layerId = routeLayerIdRef.current;
          if (!map.current!.getSource(sourceId)) {
            try {
              map.current!.addSource(sourceId, { type: 'geojson', data: geojson });
              map.current!.addLayer({ id: layerId, type: 'line', source: sourceId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.85 } });
              routeAddedRef.current = true;
            } catch (e) {
              // Si ya existe por alguna razón, solo actualizar
              const src = map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
              src?.setData(geojson);
            }
          } else {
            (map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
          }
          if (fitToPath) {
            const bounds = sanitized.reduce((b, p) => b.extend([p.lng, p.lat]), new mapboxgl.LngLatBounds([sanitized[0].lng, sanitized[0].lat], [sanitized[0].lng, sanitized[0].lat]));
            map.current!.fitBounds(bounds, { padding: 40, duration: 800 });
          }
        }
      });
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

  // Actualizar/crear la ruta cuando cambie routePath
  useEffect(() => {
    if (!map.current) return;
    const sanitized = routePath ? sanitizeRoutePath(routePath) : [];
    if (!sanitized || sanitized.length < 2) {
      // eliminar capa si existe
      if (map.current.getLayer(routeLayerIdRef.current)) map.current.removeLayer(routeLayerIdRef.current);
      if (map.current.getSource(routeSourceIdRef.current)) map.current.removeSource(routeSourceIdRef.current);
      routeAddedRef.current = false;
      return;
    }
    const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: sanitized.map(p => [p.lng, p.lat]) }
    };
    const sourceId = routeSourceIdRef.current;
    const layerId = routeLayerIdRef.current;
    if (map.current.getSource(sourceId)) {
      (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
    } else if (map.current.isStyleLoaded()) {
      try {
        map.current.addSource(sourceId, { type: 'geojson', data: geojson });
        map.current.addLayer({ id: layerId, type: 'line', source: sourceId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.85 } });
      } catch (e) {
        const src = map.current.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
        src?.setData(geojson);
      }
      routeAddedRef.current = true;
    } else {
      map.current.once('load', () => {
        if (!map.current) return;
        if (!map.current.getSource(sourceId)) {
          try {
            map.current.addSource(sourceId, { type: 'geojson', data: geojson });
            map.current.addLayer({ id: layerId, type: 'line', source: sourceId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.85 } });
          } catch (e) {
            const src = map.current.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
            src?.setData(geojson);
          }
        } else {
          (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
        }
        routeAddedRef.current = true;
      });
    }
    if (fitToPath) {
      const bounds = sanitized.reduce((b, p) => b.extend([p.lng, p.lat]), new mapboxgl.LngLatBounds([sanitized[0].lng, sanitized[0].lat], [sanitized[0].lng, sanitized[0].lat]));
      if (pickupPoint && Number.isFinite(pickupPoint.lat) && Number.isFinite(pickupPoint.lng)) {
        bounds.extend([pickupPoint.lng, pickupPoint.lat]);
      }
      map.current.fitBounds(bounds, { padding: 40, duration: 800 });
    }
  }, [routePath, fitToPath]);

  // Geocodificar la dirección si se proporciona
  useEffect(() => {
    if (address && !latitude && !longitude && map.current && marker.current) {
      const geocodeAddress = async () => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=PR&limit=1&proximity=-66.1057,18.4655&access_token=${mapboxgl.accessToken}`
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

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
  showStopMarkers?: boolean;
  snapToRoads?: boolean;
  showDirectionArrows?: boolean;
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
  pickupLabel,
  showStopMarkers = true,
  snapToRoads = true,
  showDirectionArrows = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const routeAddedRef = useRef<boolean>(false);
  const routeSourceIdRef = useRef<string>(`ewa-route-${Math.random().toString(36).slice(2, 10)}`);
  const routeLayerIdRef = useRef<string>(`${routeSourceIdRef.current}-line`);
  const pickupMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const endMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const segmentMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Validación/saneo de coordenadas sin clamping agresivo
  const PR_BOUNDS = { minLat: 17.8, maxLat: 18.6, minLng: -67.5, maxLng: -65.1 };
  const isLat = (v: number) => Number.isFinite(v) && v >= -90 && v <= 90;
  const isLng = (v: number) => Number.isFinite(v) && v >= -180 && v <= 180;
  const isInPR = (lat: number, lng: number) => lat >= PR_BOUNDS.minLat && lat <= PR_BOUNDS.maxLat && lng >= PR_BOUNDS.minLng && lng <= PR_BOUNDS.maxLng;

  const sanitizeRoutePath = (points: Array<{ lng: number; lat: number }>): Array<{ lng: number; lat: number }> => {
    if (!points) return [];
    const result: Array<{ lng: number; lat: number }> = [];
    for (const p of points) {
      let lat = Number(p.lat);
      let lng = Number(p.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      // Detecta lat/lng posiblemente invertidos y corrige si mejora pertenencia a PR
      const looksSwapped = isLat(lng) && isLng(lat) && isInPR(lng, lat) && !isInPR(lat, lng);
      if (looksSwapped) {
        const swapLat = lng;
        const swapLng = lat;
        lat = swapLat;
        lng = swapLng;
      }
      if (isInPR(lat, lng)) {
        const last = result[result.length - 1];
        if (!last || last.lat !== lat || last.lng !== lng) {
          result.push({ lng, lat });
        }
      }
    }
    return result;
  };

  const removeRouteMarkers = () => {
    if (routeMarkersRef.current.length > 0) {
      routeMarkersRef.current.forEach(m => m.remove());
      routeMarkersRef.current = [];
    }
  };

  const removeSegmentMarkers = () => {
    if (segmentMarkersRef.current.length > 0) {
      segmentMarkersRef.current.forEach(m => m.remove());
      segmentMarkersRef.current = [];
    }
  };

  const createNumberMarkerElement = (index: number, color = '#2563eb') => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '24px';
    container.style.height = '30px';

    const bubble = document.createElement('div');
    bubble.style.width = '24px';
    bubble.style.height = '24px';
    bubble.style.borderRadius = '9999px';
    bubble.style.background = color;
    bubble.style.color = '#fff';
    bubble.style.display = 'flex';
    bubble.style.alignItems = 'center';
    bubble.style.justifyContent = 'center';
    bubble.style.fontSize = '12px';
    bubble.style.fontWeight = '700';
    bubble.textContent = String(index);

    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.top = '22px';
    pointer.style.left = '6px';
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.borderLeft = '6px solid transparent';
    pointer.style.borderRight = '6px solid transparent';
    pointer.style.borderTop = `8px solid ${color}`;

    container.appendChild(bubble);
    container.appendChild(pointer);
    return container;
  };


  const createArrowElement = (angleDeg: number, color = '#64748b') => {
    const container = document.createElement('div');
    container.style.width = '0px';
    container.style.height = '0px';
    container.style.transform = `rotate(${angleDeg}deg)`;
    const arrow = document.createElement('div');
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '6px solid transparent';
    arrow.style.borderRight = '6px solid transparent';
    arrow.style.borderBottom = `10px solid ${color}`;
    container.appendChild(arrow);
    return container;
  };

  const fetchRoadSnappedRoute = async (points: Array<{ lng: number; lat: number }>) => {
    try {
      const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('directions failed');
      const json = await res.json();
      const geom = json?.routes?.[0]?.geometry;
      if (geom && geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
        return geom.coordinates as [number, number][];
      }
    } catch (e) {
      // fallback abajo
    }
    return points.map(p => [p.lng, p.lat]) as [number, number][];
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

      // Solo añadir marcador central si no hay routePath
      if (!routePath || !routePath.length) {
        marker.current = new mapboxgl.Marker({ color: '#0066FF' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      }

      // Cuando el estilo cargue, preparar capa de ruta si hay datos
      map.current.on('load', () => {
        // Solo añadir marker de pickup si se provee y no hay routePath (para evitar duplicación)
        if (pickupPoint && Number.isFinite(pickupPoint.lat) && Number.isFinite(pickupPoint.lng) && (!routePath || routePath.length === 0)) {
          pickupMarkerRef.current = new mapboxgl.Marker({ color: '#16a34a', anchor: 'bottom' })
            .setLngLat([pickupPoint.lng, pickupPoint.lat])
            .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(pickupLabel || 'Punto de recogido'))
            .addTo(map.current!);
        }
        const sanitized = routePath ? sanitizeRoutePath(routePath) : [];
        if (sanitized.length >= 2) {
          (async () => {
            const coords = snapToRoads ? await fetchRoadSnappedRoute(sanitized) : sanitized.map(p => [p.lng, p.lat]);
            const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coords as any
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
                const src = map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
                src?.setData(geojson);
              }
            } else {
              (map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
            }
            if (fitToPath) {
              const bounds = (coords as [number, number][])
                .reduce((b, c) => b.extend(c as any), new mapboxgl.LngLatBounds(coords[0] as any, coords[0] as any));
              map.current!.fitBounds(bounds, { padding: 40, duration: 800 });
            }
            // Marcadores numerados para todas las paradas
            if (showStopMarkers) {
              removeRouteMarkers();
              routeMarkersRef.current = sanitized.map((p, i) => {
                // Primer marcador usa verde para indicar inicio
                const color = i === 0 ? '#16a34a' : (i === sanitized.length - 1 ? '#dc2626' : '#2563eb');
                const el = createNumberMarkerElement(i + 1, color);
                return new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(map.current!);
              });
            }
            // Flechas de dirección en segmentos
            if (showDirectionArrows) {
              removeSegmentMarkers();
              for (let i = 0; i < sanitized.length - 1; i++) {
                const a = sanitized[i];
                const b = sanitized[i + 1];
                const angle = Math.atan2(b.lat - a.lat, b.lng - a.lng) * 180 / Math.PI;
                // Tres flechas por segmento para reforzar dirección
                const thirds = [0.33, 0.66, 0.5];
                for (const t of thirds) {
                  const mid = { lng: a.lng + (b.lng - a.lng) * t, lat: a.lat + (b.lat - a.lat) * t };
                  const el = createArrowElement(angle, '#475569');
                  const mk = new mapboxgl.Marker({ element: el, anchor: 'center' as any }).setLngLat([mid.lng, mid.lat]).addTo(map.current!);
                  segmentMarkersRef.current.push(mk);
                }
              }
            }
            // No añadir marcador final separado ya que el último marcador numerado ya es rojo
            endMarkerRef.current?.remove();
          })();
        }
      });
    }

    // Limpiar el mapa cuando el componente se desmonta
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      removeRouteMarkers();
      pickupMarkerRef.current?.remove();
    };
  }, [longitude, latitude, interactive]);

  // Actualizar la posición del marcador si cambian las coordenadas (solo si no hay routePath)
  useEffect(() => {
    if (map.current && marker.current && (!routePath || !routePath.length)) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true
      });
    }
  }, [longitude, latitude, routePath]);

  // Actualizar/crear la ruta cuando cambie routePath
  useEffect(() => {
    if (!map.current) return;
    const sanitized = routePath ? sanitizeRoutePath(routePath) : [];
    if (!sanitized || sanitized.length < 2) {
      // eliminar capa si existe
      if (map.current.getLayer(routeLayerIdRef.current)) map.current.removeLayer(routeLayerIdRef.current);
      if (map.current.getSource(routeSourceIdRef.current)) map.current.removeSource(routeSourceIdRef.current);
      removeRouteMarkers();
      routeAddedRef.current = false;
      return;
    }
    (async () => {
      const coords = snapToRoads ? await fetchRoadSnappedRoute(sanitized) : sanitized.map(p => [p.lng, p.lat]);
      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords as any }
      };
      const sourceId = routeSourceIdRef.current;
      const layerId = routeLayerIdRef.current;
      if (map.current!.getSource(sourceId)) {
        (map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      } else if (map.current!.isStyleLoaded()) {
        try {
          map.current!.addSource(sourceId, { type: 'geojson', data: geojson });
          map.current!.addLayer({ id: layerId, type: 'line', source: sourceId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.85 } });
        } catch (e) {
          const src = map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
          src?.setData(geojson);
        }
        routeAddedRef.current = true;
      } else {
        map.current!.once('load', () => {
          if (!map.current) return;
          if (!map.current.getSource(sourceId)) {
            try {
              map.current!.addSource(sourceId, { type: 'geojson', data: geojson });
              map.current!.addLayer({ id: layerId, type: 'line', source: sourceId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.85 } });
            } catch (e) {
              const src = map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
              src?.setData(geojson);
            }
          } else {
            (map.current!.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
          }
          routeAddedRef.current = true;
        });
      }
      if (fitToPath) {
        const bounds = (coords as [number, number][]) 
          .reduce((b, c) => b.extend(c as any), new mapboxgl.LngLatBounds(coords[0] as any, coords[0] as any));
        if (pickupPoint && Number.isFinite(pickupPoint.lat) && Number.isFinite(pickupPoint.lng)) {
          bounds.extend([pickupPoint.lng, pickupPoint.lat]);
        }
        map.current!.fitBounds(bounds, { padding: 40, duration: 800 });
      }
      if (showStopMarkers) {
        removeRouteMarkers();
        routeMarkersRef.current = sanitized.map((p, i) => {
          // Primer marcador usa verde para indicar inicio
          const color = i === 0 ? '#16a34a' : (i === sanitized.length - 1 ? '#dc2626' : '#2563eb');
          const el = createNumberMarkerElement(i + 1, color);
          return new mapboxgl.Marker({ element: el }).setLngLat([p.lng, p.lat]).addTo(map.current!);
        });
      }
      if (showDirectionArrows) {
        removeSegmentMarkers();
        for (let i = 0; i < sanitized.length - 1; i++) {
          const a = sanitized[i];
          const b = sanitized[i + 1];
          const angle = Math.atan2(b.lat - a.lat, b.lng - a.lng) * 180 / Math.PI;
          const thirds = [0.33, 0.66, 0.5];
          for (const t of thirds) {
            const mid = { lng: a.lng + (b.lng - a.lng) * t, lat: a.lat + (b.lat - a.lat) * t };
            const el = createArrowElement(angle, '#475569');
            const mk = new mapboxgl.Marker({ element: el, anchor: 'center' as any }).setLngLat([mid.lng, mid.lat]).addTo(map.current!);
            segmentMarkersRef.current.push(mk);
          }
        }
      }
      // No añadir marcador final separado ya que el último marcador numerado ya es rojo
      endMarkerRef.current?.remove();
    })();
  }, [routePath, fitToPath, showStopMarkers, snapToRoads, showDirectionArrows]);

  // Geocodificar la dirección si se proporciona (solo si no hay routePath)
  useEffect(() => {
    if (address && !latitude && !longitude && map.current && marker.current && (!routePath || !routePath.length)) {
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
  }, [address, latitude, longitude, routePath]);

  return (
    <div 
      ref={mapContainer} 
      style={{ height, width: '100%', borderRadius: '0.5rem' }} 
      className={className}
    />
  );
};

export default SimpleMapBox;

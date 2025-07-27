declare module 'react-map-gl' {
  import * as React from 'react';
  import * as mapboxgl from 'mapbox-gl';

  export interface ViewState {
    latitude: number;
    longitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
    padding?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  }

  export interface ViewStateChangeEvent {
    viewState: ViewState;
  }

  export interface MapProps extends Omit<React.HTMLProps<HTMLDivElement>, 'style'> {
    mapboxAccessToken?: string;
    initialViewState?: ViewState;
    viewState?: ViewState;
    longitude?: number;
    latitude?: number;
    zoom?: number;
    bearing?: number;
    pitch?: number;
    mapStyle?: string | mapboxgl.Style;
    style?: React.CSSProperties;
    onMove?: (evt: ViewStateChangeEvent) => void;
    onClick?: (evt: mapboxgl.MapLayerMouseEvent) => void;
    onLoad?: (evt: { target: mapboxgl.Map }) => void;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    longitude: number;
    latitude: number;
    color?: string;
    onClick?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
  }

  export const Marker: React.FC<MarkerProps>;
  
  export default class Map extends React.Component<MapProps> {}
}

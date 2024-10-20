import { Polygon, Polyline } from '@react-google-maps/api';

export enum ElementType {
  POLYGON = 'polygon',
  POLYLINE = 'polyline',
  MARKER = 'marker',
}

export interface BaseElement {
  id: string;
  name: string;
  type: ElementType;
}

export interface PolygonElement extends BaseElement, Polygon {
  type: ElementType.POLYGON;
  path: google.maps.LatLngLiteral[];
  area: number;
}

export interface PolylineElement extends BaseElement, Polyline {
  type: ElementType.POLYLINE;
  path: google.maps.LatLngLiteral[];
  length: number;
}

export interface MarkerElement extends BaseElement {
  type: ElementType.MARKER;
  position: google.maps.LatLngLiteral;
  icon: string;
  color: string;
}

export type MapElement = PolygonElement | PolylineElement | MarkerElement;
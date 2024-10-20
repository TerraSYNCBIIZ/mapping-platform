import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DrawingManager, Polygon, Polyline, Marker } from '@react-google-maps/api';
import { Radio, Antenna, Sun, Wrench, MapPin } from 'lucide-react';
import ToolBar from './components/ToolBar';
import PropertyList from './components/PropertyList';
import MarkerCustomizer from './components/MarkerCustomizer';
import { MapElement, ElementType, PolygonElement, PolylineElement, MarkerElement } from './types';

const libraries: ("drawing" | "places")[] = ['drawing', 'places'];

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const mapOptions = {
  mapTypeId: 'satellite',
  disableDefaultUI: true,
  zoomControl: true,
};

const markerTypes = {
  'base-station': { icon: Radio, color: '#FF5733' },
  'reference-station': { icon: Antenna, color: '#33FF57' },
  'solar-station': { icon: Sun, color: '#5733FF' },
  'needs-repair': { icon: Wrench, color: '#FF3333' },
  'general': { icon: MapPin, color: '#3366FF' },
};

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAZ6bgWmYUPY4JuHwTKrAzsOGzZtqL6bUQ",
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null);
  const [mapElements, setMapElements] = useState<MapElement[]>([]);
  const [activeElement, setActiveElement] = useState<MapElement | null>(null);
  const [showElementList, setShowElementList] = useState(false);
  const [showMarkerCustomizer, setShowMarkerCustomizer] = useState(false);
  const [currentMarkerType, setCurrentMarkerType] = useState('general');
  const [center, setCenter] = useState(defaultCenter);

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Initialize SearchBox
    if (searchInputRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      searchBoxRef.current = searchBox;

      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchInputRef.current);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry && place.geometry.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(18);
          }
        }
      });
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          map.setCenter(pos);
          map.setZoom(18);
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    } else {
      console.log('Error: Your browser doesn\'t support geolocation.');
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onDrawingManagerLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
    setDrawingManager(drawingManager);
  };

  const startDrawing = (mode: google.maps.drawing.OverlayType) => {
    if (drawingManager) {
      drawingManager.setDrawingMode(mode);
      setDrawingMode(mode);
    }
  };

  const stopDrawing = () => {
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
      setDrawingMode(null);
    }
  };

  const deleteElement = () => {
    if (activeElement) {
      setMapElements(mapElements.filter(el => el.id !== activeElement.id));
      setActiveElement(null);
    }
  };

  const toggleElementList = () => {
    setShowElementList(!showElementList);
  };

  const customizeMarker = () => {
    setShowMarkerCustomizer(true);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="relative w-full h-screen">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search for a location"
        className="absolute top-4 left-4 z-10 p-2 w-64 bg-white rounded-md shadow-md"
      />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={18}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <DrawingManager
          onLoad={onDrawingManagerLoad}
          options={{
            drawingControl: false,
          }}
        />
        {mapElements.map((element) => {
          switch (element.type) {
            case ElementType.POLYGON:
              return (
                <Polygon
                  key={element.id}
                  paths={element.path}
                  options={{
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    strokeColor: '#FF0000',
                    strokeWeight: 2,
                  }}
                />
              );
            case ElementType.POLYLINE:
              return (
                <Polyline
                  key={element.id}
                  path={element.path}
                  options={{
                    strokeColor: '#FF0000',
                    strokeWeight: 2,
                  }}
                />
              );
            case ElementType.MARKER:
              const MarkerIcon = markerTypes[element.icon as keyof typeof markerTypes].icon;
              return (
                <Marker
                  key={element.id}
                  position={element.position}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: element.color,
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: '#FFFFFF',
                    scale: 10,
                  }}
                />
              );
          }
        })}
      </GoogleMap>
      <ToolBar
        drawingMode={drawingMode}
        startDrawing={startDrawing}
        stopDrawing={stopDrawing}
        deleteElement={deleteElement}
        toggleElementList={toggleElementList}
        customizeMarker={customizeMarker}
      />
      {showElementList && (
        <PropertyList
          elements={mapElements}
          activeElement={activeElement}
          onSelectElement={setActiveElement}
          onClose={() => setShowElementList(false)}
        />
      )}
      {showMarkerCustomizer && (
        <MarkerCustomizer
          currentType={currentMarkerType}
          onSelectType={(type) => {
            setCurrentMarkerType(type);
            setShowMarkerCustomizer(false);
          }}
          onClose={() => setShowMarkerCustomizer(false)}
        />
      )}
    </div>
  );
}

export default App;
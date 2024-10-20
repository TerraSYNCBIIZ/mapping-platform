import React from 'react';
import { MapPin, Hexagon, PenTool, Trash2, List, Settings } from 'lucide-react';

interface ToolBarProps {
  drawingMode: google.maps.drawing.OverlayType | null;
  startDrawing: (mode: google.maps.drawing.OverlayType) => void;
  stopDrawing: () => void;
  deleteElement: () => void;
  toggleElementList: () => void;
  customizeMarker: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  drawingMode,
  startDrawing,
  stopDrawing,
  deleteElement,
  toggleElementList,
  customizeMarker,
}) => {
  const toggleDrawing = (mode: google.maps.drawing.OverlayType) => {
    if (drawingMode === mode) {
      stopDrawing();
    } else {
      startDrawing(mode);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-2">
      <div className="flex space-x-2">
        <button
          onClick={() => toggleDrawing(google.maps.drawing.OverlayType.POLYGON)}
          className={`p-2 rounded-md ${drawingMode === google.maps.drawing.OverlayType.POLYGON ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
          title={drawingMode === google.maps.drawing.OverlayType.POLYGON ? "Stop Drawing Polygon" : "Draw Polygon"}
        >
          <Hexagon size={20} />
        </button>
        <button
          onClick={() => toggleDrawing(google.maps.drawing.OverlayType.POLYLINE)}
          className={`p-2 rounded-md ${drawingMode === google.maps.drawing.OverlayType.POLYLINE ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
          title={drawingMode === google.maps.drawing.OverlayType.POLYLINE ? "Stop Drawing Polyline" : "Draw Polyline"}
        >
          <PenTool size={20} />
        </button>
        <button
          onClick={() => toggleDrawing(google.maps.drawing.OverlayType.MARKER)}
          className={`p-2 rounded-md ${drawingMode === google.maps.drawing.OverlayType.MARKER ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
          title={drawingMode === google.maps.drawing.OverlayType.MARKER ? "Stop Adding Marker" : "Add Marker"}
        >
          <MapPin size={20} />
        </button>
        <button
          onClick={deleteElement}
          className="p-2 rounded-md bg-red-500 text-white"
          title="Delete Element"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={toggleElementList}
          className="p-2 rounded-md bg-green-500 text-white"
          title="Element List"
        >
          <List size={20} />
        </button>
        <button
          onClick={customizeMarker}
          className="p-2 rounded-md bg-purple-500 text-white"
          title="Customize Marker"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
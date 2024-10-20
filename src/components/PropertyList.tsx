import React from 'react';
import { MapElement, ElementType } from '../types';
import { MapPin, Hexagon, PenTool } from 'lucide-react';

interface PropertyListProps {
  elements: MapElement[];
  activeElement: MapElement | null;
  onSelectElement: (element: MapElement) => void;
  onClose: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
  elements,
  activeElement,
  onSelectElement,
  onClose,
}) => {
  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case ElementType.POLYGON:
        return <Hexagon size={16} />;
      case ElementType.POLYLINE:
        return <PenTool size={16} />;
      case ElementType.MARKER:
        return <MapPin size={16} />;
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Map Elements</h2>
      <ul>
        {elements.map((element) => (
          <li
            key={element.id}
            className={`cursor-pointer p-2 hover:bg-gray-100 ${
              element.id === activeElement?.id ? 'bg-blue-100' : ''
            } flex items-center`}
            onClick={() => onSelectElement(element)}
          >
            <span className="mr-2">{getElementIcon(element.type)}</span>
            <span>{element.name}</span>
            {element.type === ElementType.POLYGON && (
              <span className="ml-auto">{element.area.toFixed(2)} m²</span>
            )}
            {element.type === ElementType.POLYLINE && (
              <span className="ml-auto">{element.length.toFixed(2)} m</span>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Close
      </button>
    </div>
  );
};

export default PropertyList;
import React from 'react';
import { Radio, Antenna, Sun, Wrench, MapPin } from 'lucide-react';

const markerTypes = [
  { type: 'base-station', icon: Radio, label: 'Base Station', color: '#FF5733' },
  { type: 'reference-station', icon: Antenna, label: 'Reference Station', color: '#33FF57' },
  { type: 'solar-station', icon: Sun, label: 'Solar Station', color: '#5733FF' },
  { type: 'needs-repair', icon: Wrench, label: 'Needs Repair', color: '#FF3333' },
  { type: 'general', icon: MapPin, label: 'General', color: '#3366FF' },
];

interface MarkerCustomizerProps {
  currentType: string;
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const MarkerCustomizer: React.FC<MarkerCustomizerProps> = ({
  currentType,
  onSelectType,
  onClose,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Customize Marker</h2>
      <ul>
        {markerTypes.map((markerType) => (
          <li
            key={markerType.type}
            className={`cursor-pointer p-2 hover:bg-gray-100 ${
              markerType.type === currentType ? 'bg-blue-100' : ''
            } flex items-center`}
            onClick={() => onSelectType(markerType.type)}
          >
            <markerType.icon size={20} color={markerType.color} className="mr-2" />
            <span>{markerType.label}</span>
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

export default MarkerCustomizer;
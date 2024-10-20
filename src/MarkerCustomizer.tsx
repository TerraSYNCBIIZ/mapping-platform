import React from 'react';
import * as LucideIcons from 'lucide-react';

const iconOptions = ['MapPin', 'Home', 'Star', 'Flag', 'Landmark', 'Building', 'Tent', 'Car', 'Truck', 'Bike'];
const colorOptions = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#000080'];

interface MarkerCustomizerProps {
  customMarker: { icon: string; color: string };
  setCustomMarker: (marker: { icon: string; color: string }) => void;
  onClose: () => void;
}

const MarkerCustomizer: React.FC<MarkerCustomizerProps> = ({ customMarker, setCustomMarker, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Customize Marker</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Icon</h3>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((icon) => {
              const IconComponent = LucideIcons[icon];
              return (
                <button
                  key={icon}
                  onClick={() => setCustomMarker({ ...customMarker, icon })}
                  className={`p-2 rounded-md ${customMarker.icon === icon ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  <IconComponent size={24} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Color</h3>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setCustomMarker({ ...customMarker, color })}
                className={`w-8 h-8 rounded-full ${customMarker.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MarkerCustomizer;
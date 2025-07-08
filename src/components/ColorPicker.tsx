import React from 'react';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, onClose }) => {
  const colors = [
    '#1e40af', // Blue
    '#7c3aed', // Purple
    '#dc2626', // Red
    '#059669', // Green
    '#d97706', // Orange
    '#be185d', // Pink
    '#374151', // Gray
    '#b91c1c', // Dark red
    '#1f2937', // Dark gray
    '#4c1d95', // Dark purple
    '#064e3b', // Dark green
    '#92400e', // Dark orange
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Pilih Warna Strip
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-12 h-12 rounded-xl border-2 transition-all transform hover:scale-110 ${
              selectedColor === color 
                ? 'border-gray-800 scale-105' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-gray-600 text-sm">
          Warna terpilih: <span className="font-mono text-gray-800">{selectedColor}</span>
        </p>
      </div>
    </div>
  );
};

export default ColorPicker;
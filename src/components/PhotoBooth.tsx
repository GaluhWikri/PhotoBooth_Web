import React, { useState, useRef } from 'react';
import { Camera, Download, RotateCcw, Palette as Palette2 } from 'lucide-react';
import CameraComponent from './Camera';
import PhotoStrip from './PhotoStrip';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

const PhotoBooth: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#1e40af');

  const colors = [
    { name: 'Blue', value: '#1e40af' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#059669' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Red', value: '#dc2626' },
  ];

  const handlePhotoCapture = (photoDataUrl: string) => {
    if (photos.length < 4) {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        dataUrl: photoDataUrl,
        timestamp: Date.now()
      };
      
      setPhotos(prev => [...prev, newPhoto]);
    }
    
    if (photos.length === 3) {
      setShowCamera(false);
    }
  };

  const resetPhotos = () => {
    setPhotos([]);
  };

  const toggleCamera = () => {
    if (photos.length < 4) {
      setShowCamera(!showCamera);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PhotoBooth Studio</h1>
          <p className="text-gray-600">Buat photo strip yang menakjubkan dengan mudah</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Controls */}
          <div className="space-y-6">
            {/* Camera - Moved to top */}
            {showCamera && photos.length < 4 && (
              <CameraComponent 
                onCapture={handlePhotoCapture}
                onClose={() => setShowCamera(false)}
              />
            )}

            {/* Main Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kontrol Utama</h2>
              
              <div className="space-y-4">
                <button
                  onClick={toggleCamera}
                  disabled={photos.length >= 4}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
                >
                  <Camera className="w-5 h-5" />
                  {photos.length >= 4 ? 'Strip Selesai' : `Ambil Foto ${photos.length + 1}/4`}
                </button>

                <button
                  onClick={resetPhotos}
                  disabled={photos.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Semua
                </button>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{photos.length}/4 foto</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(photos.length / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Palette2 className="w-5 h-5" />
                Pilih Warna Background
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-full h-12 rounded-lg border-2 transition-all ${
                      selectedColor === color.value 
                        ? 'border-gray-800 scale-105' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Warna terpilih: <span className="font-mono">{selectedColor}</span>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cara Penggunaan</h3>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span>Klik "Ambil Foto" untuk membuka kamera</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span>Ambil 4 foto untuk melengkapi strip</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span>Pilih warna background favorit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <span>Download hasil photo strip</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Right Side - Photo Strip */}
          <div>
            <PhotoStrip 
              photos={photos}
              backgroundColor={selectedColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
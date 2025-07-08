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
  const [selectedColor, setSelectedColor] = useState('#03346E');

  const colors = [
    { name: 'Navy Blue', value: '#03346E' },
    { name: 'Ocean Blue', value: '#0369A1' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#E11D48' },
    { name: 'Amber', value: '#D97706' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              PhotoBooth Studio
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Buat photo strip yang menakjubkan dengan teknologi modern dan desain yang elegan
          </p>
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
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4">Kontrol Utama</h2>
              
              <div className="space-y-4">
                <button
                  onClick={toggleCamera}
                  disabled={photos.length >= 4}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  {photos.length >= 4 ? 'Strip Selesai' : `Ambil Foto ${photos.length + 1}/4`}
                </button>

                <button
                  onClick={resetPhotos}
                  disabled={photos.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
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
                <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${(photos.length / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Color Picker */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4 flex items-center gap-2">
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
                        ? 'border-blue-800 scale-105 ring-2 ring-blue-200' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Warna terpilih: <span className="font-mono text-blue-800 font-semibold">{selectedColor}</span>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4">Cara Penggunaan</h3>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">1</span>
                  <span>Klik "Ambil Foto" untuk membuka kamera</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">2</span>
                  <span>Ambil 4 foto untuk melengkapi strip</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">3</span>
                  <span>Pilih warna background favorit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg">4</span>
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
import React, { useState } from 'react';
import { Camera, RotateCcw, Palette as Palette2, Upload, Github, Sticker } from 'lucide-react';
import CameraComponent from './Camera';
import PhotoStrip, { StickerObject } from './PhotoStrip';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

// Secara otomatis membaca semua file .png dari folder /public/stickers/
const stickerModules = import.meta.glob('/public/stickers/*.png', { eager: true });
const availableStickers = Object.keys(stickerModules)
  .map(path => path.split('/').pop())
  .filter((name): name is string => typeof name === 'string');

const PhotoBooth: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [background, setBackground] = useState<string>('#948979');
  const [activeStickers, setActiveStickers] = useState<StickerObject[]>([]);

  const colors = [
    { name: 'pink', value: '#948979' }, { name: 'Navy Blue', value: '#1E3E62' },
    { name: 'Blueberry', value: '#52A5CE' }, { name: 'FORREST', value: '#2B2B23' },
    { name: 'olive green', value: '#AFAB23' }, { name: 'Dry earth', value: '#876029' },
    { name: 'butter yellow', value: '#EFCE7B' }, { name: 'BLOOD orangge', value: '#EF6F4C' },
    { name: 'Rose', value: '#E11D48' },
  ];

  const handlePhotoCapture = (photoDataUrl: string) => {
    if (photos.length < 4) {
      const newPhoto = { id: Date.now().toString(), dataUrl: photoDataUrl, timestamp: Date.now() };
      setPhotos(prev => [...prev, newPhoto]);
    }
    if (photos.length === 3) setShowCamera(false);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  const resetPhotos = () => {
    setPhotos([]);
    setActiveStickers([]);
  };

  const toggleCamera = () => {
    if (photos.length < 4) setShowCamera(!showCamera);
  };

  const handleBackgroundImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') setBackground(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticker = (stickerSrc: string) => {
    const newSticker: StickerObject = {
      id: `sticker_${Date.now()}`,
      src: `/stickers/${stickerSrc}`,
      x: 100,
      y: 100,
      scale: 1,
      rotation: 0,
    };
    setActiveStickers(prev => [...prev, newSticker]);
  };

  const updateSticker = (id: string, newProps: Partial<StickerObject>) => {
    setActiveStickers(prev =>
      prev.map(s => (s.id === id ? { ...s, ...newProps } : s))
    );
  };

  const deleteSticker = (id: string) => {
    setActiveStickers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-purple-200">
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mt-8">
            G.STUDIO
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {showCamera && photos.length < 4 && (
              <CameraComponent onCapture={handlePhotoCapture} onClose={() => setShowCamera(false)} />
            )}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4">Kontrol Utama</h2>
              <div className="space-y-4">
                <button
                  onClick={toggleCamera}
                  disabled={photos.length >= 4}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  {photos.length >= 4 ? 'Strip Penuh' : `Ambil Foto ${photos.length + 1}/4`}
                </button>
                <button
                  onClick={resetPhotos}
                  disabled={photos.length === 0 && activeStickers.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Semua
                </button>
              </div>
            </div>

            {/* BAGIAN YANG HILANG, SEKARANG SUDAH ADA KEMBALI */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Palette2 className="w-5 h-5" />
                Pilih Background
              </h3>
              <input
                type="file"
                id="bg-upload"
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundImage}
              />
              <label
                htmlFor="bg-upload"
                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-black text-white px-6 py-3 rounded-xl font-semibold transition-all mb-4"
              >
                <Upload className="w-5 h-5" />
                Upload background
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackground(color.value)}
                    className={`w-full h-12 rounded-lg border-2 transition-all ${background === color.value ? 'border-blue-800 scale-105 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Sticker className="w-5 h-5" />
                Pilih Stiker
              </h3>
              <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                {availableStickers.map(sticker => (
                  <button key={sticker} onClick={() => addSticker(sticker)} className="bg-white/50 p-2 rounded-lg aspect-square hover:scale-110 transition-transform focus:ring-2 focus:ring-blue-500">
                    <img src={`/stickers/${sticker}`} alt={sticker} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <PhotoStrip
              photos={photos}
              background={background}
              onDeletePhoto={handleDeletePhoto}
              stickers={activeStickers}
              onUpdateSticker={updateSticker}
              onDeleteSticker={deleteSticker}
            />
          </div>
        </div>
        
        <footer className="text-center py-8 mt-8">
          <div className="flex items-center justify-center gap-4">
            <p className="text-slate-600 font-semibold">
              Made with love © 2025 by Galuh Wikri Ramadhan
            </p>
            <a
              href="https://github.com/GaluhWikri/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PhotoBooth;
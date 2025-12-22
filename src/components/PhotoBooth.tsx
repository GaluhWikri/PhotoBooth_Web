import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sticker, Download, X, ImageIcon, ArrowLeft } from 'lucide-react';
import CameraComponent from './Camera';
import PhotoStrip, { StickerObject, PhotoStripHandle } from './PhotoStrip';
import LandingPage from './LandingPage';
import Navbar from './Navbar';
import About from './About';
import PrivacyPolicy from './PrivacyPolicy';
import Contact from './Contact';
import ChooseLayout, { LayoutConfig } from './ChooseLayout';
import { supabase } from '../lib/supabaseClient';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

const BoothContent: React.FC<{ onNavigate: (page: string) => void, layout: LayoutConfig }> = ({ onNavigate, layout }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [background, setBackground] = useState<string>('#948979');
  const [activeStickers, setActiveStickers] = useState<StickerObject[]>([]);
  const [fetchedStickers, setFetchedStickers] = useState<{ name: string, url: string }[]>([]);
  const stripRef = useRef<PhotoStripHandle>(null);

  // Initial load of stickers from Supabase
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const { data, error } = await supabase
          .from('stickers')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Sticker fetch error:', error.message);
        } else if (data) {
          console.log('✅ Loaded stickers from Supabase:', data.length);
          if (data.length === 0) {
            console.warn('⚠️ Sticker table is empty or RLS is blocking access.');
          }
          setFetchedStickers(data.map((s: any) => ({ name: s.name, url: s.url })));
        }
      } catch (err) {
        console.error('Sticker fetch failed:', err);
      }
    };

    fetchStickers();
  }, []);

  const colors = [
    { name: 'pink', value: '#948979' }, { name: 'Navy Blue', value: '#1E3E62' },
    { name: 'Blueberry', value: '#52A5CE' }, { name: 'FORREST', value: '#2B2B23' },
    { name: 'olive green', value: '#AFAB23' }, { name: 'Dry earth', value: '#876029' },
    { name: 'BLOOD orangge', value: '#EF6F4C' },
  ];

  const handlePhotoCapture = (photoDataUrl: string) => {
    if (photos.length < layout.photoCount) {
      const newPhoto = { id: Date.now().toString(), dataUrl: photoDataUrl, timestamp: Date.now() };
      setPhotos(prev => [...prev, newPhoto]);
    }
    if (photos.length === layout.photoCount - 1) setShowCamera(false);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };

  const resetPhotos = () => {
    setPhotos([]);
    setActiveStickers([]);
  };

  const toggleCamera = () => {
    if (photos.length < layout.photoCount) setShowCamera(!showCamera);
  };

  const handleDownload = () => {
    if (stripRef.current) {
      stripRef.current.download();
    }
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && photos.length < layout.photoCount) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          handlePhotoCapture(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const addSticker = (stickerUrl: string) => {
    const newSticker: StickerObject = {
      id: `sticker_${Date.now()}`,
      src: stickerUrl, // Now accepts full URL
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

  // Load Paper Textures
  // Menggunakan glob untuk mendeteksi file, tapi menyusun URL secara manual agar aman untuk folder public
  // Pola ini memanfaatkan Vite untuk listing file saat build, tapi browser akan memuatnya sebagai static asset
  const paperModules = import.meta.glob('/public/Paper/*.jpeg');

  const paperTextures = Object.keys(paperModules).map((path) => {
    const fileName = path.split('/').pop();
    return {
      name: fileName || 'Paper',
      // BASE_URL akan otomatis menyesuaikan jika deploy di subfolder/domain
      value: `${import.meta.env.BASE_URL}Paper/${fileName}`
    };
  });

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-10">
      {/* Navbar with Home Link acting as Back button */}
      <Navbar onNavigate={onNavigate} activePage="booth" />

      <div className="max-w-6xl mx-auto px-4">

        <div className="mt-8 mb-4">
          <button
            onClick={() => onNavigate('layout-selection')}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group px-4 py-2 rounded-full hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Layouts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Preview (Width 5/12) */}
          <div className="lg:col-span-5 order-1 lg:order-1">
            <div className="sticky top-24 flex flex-col items-center">
              <div className={`relative transform transition-all duration-300 hover:scale-[1.02] shadow-2xl rounded-sm overflow-hidden border-[6px] border-white ${layout.type.startsWith('grid') ? 'w-[320px]' : 'w-[220px]'}`}>
                <PhotoStrip
                  ref={stripRef}
                  photos={photos}
                  layout={layout}
                  background={background}
                  onDeletePhoto={handleDeletePhoto}
                  stickers={activeStickers}
                  onUpdateSticker={updateSticker}
                  onDeleteSticker={deleteSticker}
                />
              </div>
              {/* Action Buttons below preview similar to reference */}
              <div className="mt-8 flex gap-4 w-full justify-center">
                <button
                  onClick={handleDownload}
                  disabled={photos.length < layout.photoCount}
                  className="px-6 py-2 rounded-full bg-blue-400 text-white font-semibold hover:bg-blue-500 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={resetPhotos} className="px-6 py-2 rounded-full bg-red-100 text-red-500 font-semibold hover:bg-red-200 transition-colors">
                  Retake
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Controls (Width 7/12) */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-8">

            <h2 className="text-3xl font-serif text-stone-800 text-center lg:text-left mb-8">Customize Your Photo</h2>

            {/* Camera Section */}
            <div>
              {showCamera && photos.length < layout.photoCount ? (
                <div className="relative bg-black rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto lg:mx-0 w-fit ring-8 ring-white/50">
                  {/* Floating Glass Header */}
                  <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-sm font-medium pointer-events-auto">
                      <span className="relative flex h-2.5 w-2.5 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      Live Camera
                    </div>
                    <button
                      onClick={() => setShowCamera(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all pointer-events-auto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <CameraComponent onCapture={handlePhotoCapture} layout={layout} />
                </div>
              ) : (
                <div className="text-center lg:text-left mb-8">
                  <button
                    onClick={toggleCamera}
                    disabled={photos.length >= layout.photoCount}
                    className="inline-flex items-center gap-3 bg-stone-800 hover:bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 disabled:bg-stone-300 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-5 h-5" />
                    {photos.length >= layout.photoCount ? 'Photo Strip Ready' : `Take Photos (${photos.length}/${layout.photoCount})`}
                  </button>
                  <p className="mt-3 text-stone-400 text-sm pl-2">Click to start the camera sequence</p>
                </div>
              )}
            </div>

            {/* Upload Logic */}
            {!showCamera && photos.length < layout.photoCount && (
              <div className="text-center lg:text-left mb-8 -mt-6">
                <p className="text-sm text-stone-500 mb-2">Or upload existing photos</p>
                <label className="inline-flex items-center gap-3 bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 px-6 py-3 rounded-full font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                  <span>Upload Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
            )}

            {/* Customization Controls */}
            <div className="space-y-8">

              {/* Background Templates */}
              <div>
                <h3 className="text-lg font-medium text-stone-700 mb-4">Templates & Colors:</h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                  <label
                    className="w-full aspect-square rounded-full border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-colors bg-white"
                    title="Upload Custom"
                  >
                    <Upload className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleBackgroundImage} />
                  </label>
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBackground(color.value)}
                      className={`w-full aspect-square rounded-full shadow-sm transition-transform hover:scale-110 ${background === color.value ? 'ring-2 ring-offset-2 ring-stone-800 scale-110' : ''}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                  {/* Paper Textures */}
                  {paperTextures.map((paper) => (
                    <button
                      key={paper.value}
                      onClick={() => setBackground(paper.value)}
                      className={`w-full aspect-square rounded-full shadow-sm transition-transform hover:scale-110 bg-cover bg-center ${background === paper.value ? 'ring-2 ring-offset-2 ring-stone-800 scale-110' : ''}`}
                      style={{ backgroundImage: `url(${paper.value})` }}
                      title={paper.name}
                    />
                  ))}
                </div>
              </div>

              {/* Stickers */}
              <div className="bg-white/50 rounded-3xl p-6 border border-white/60">
                <h3 className="text-lg font-medium text-stone-700 mb-4 flex items-center gap-2">
                  <Sticker className="w-5 h-5" /> Add Stickers
                </h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                  {fetchedStickers.length === 0 ? (
                    <p className="col-span-full text-center text-stone-400 text-sm">Loading stickers...</p>
                  ) : (
                    fetchedStickers.map(sticker => (
                      <button key={sticker.name} onClick={() => addSticker(sticker.url)} className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 hover:border-blue-300 hover:shadow-md transition-all hover:-translate-y-1">
                        <img src={sticker.url} alt={sticker.name} className="w-full h-full object-contain pointer-events-none" />
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const PhotoBooth: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig | null>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage
          onStart={() => navigate('layout-selection')}
          onNavigate={navigate}
        />
      )}
      {currentPage === 'layout-selection' && (
        <ChooseLayout
          onSelect={(layout) => {
            setSelectedLayout(layout);
            navigate('booth');
          }}
          onNavigate={navigate}
        />
      )}
      {currentPage === 'booth' && selectedLayout && (
        <BoothContent onNavigate={navigate} layout={selectedLayout} />
      )}
      {currentPage === 'about' && (
        <About onNavigate={navigate} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPolicy onNavigate={navigate} />
      )}
      {currentPage === 'contact' && (
        <Contact onNavigate={navigate} />
      )}
    </>
  );
};

export default PhotoBooth;
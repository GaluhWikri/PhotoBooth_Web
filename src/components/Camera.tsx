import React, { useRef, useEffect, useState } from 'react';
import { X, MoreHorizontal, Sparkles, Grid } from 'lucide-react';

import { LayoutConfig } from './ChooseLayout';

interface CameraProps {
  onCapture: (photoDataUrl: string) => void;

  layout: LayoutConfig;
}

const filters = [
  { name: 'Normal', value: 'none' },
  { name: 'Vintage', value: 'sepia(0.4) contrast(1.2) brightness(0.9)' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Smooth', value: 'contrast(0.9) brightness(1.1) blur(0.5px)' },
  { name: 'B&W', value: 'grayscale(1) contrast(1.2)' },
  { name: 'Cyber', value: 'saturate(2) hue-rotate(180deg) contrast(1.1)' },
  { name: 'Bittersweet', value: 'contrast(1.1) brightness(1.1) sepia(0.3) saturate(1.5)' },
  { name: 'OG Vintage', value: 'sepia(0.6) contrast(1.3) brightness(0.8)' },
  { name: 'Fresh', value: 'brightness(1.1) contrast(1.1) saturate(1.2)' },
  { name: 'Citrus', value: 'sepia(0.3) saturate(2) hue-rotate(20deg)' },
  { name: '2015', value: 'sepia(0.2) contrast(1.1) saturate(1.1)' },
  { name: 'Focus', value: 'contrast(1.2) brightness(1.1)' },
  { name: 'Candy', value: 'brightness(1.1) saturate(1.5) hue-rotate(-10deg)' },
  { name: '80s', value: 'contrast(1.1) brightness(1.1) saturate(1.5) sepia(0.2)' },
];

const CameraComponent: React.FC<CameraProps> = ({ onCapture, layout }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);
  const [timerDuration, setTimerDuration] = useState(3);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      takePhotoNow();
      setCountdown(null);
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
          facingMode: 'user'
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackError) {
        console.error('Error accessing camera on fallback:', fallbackError);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(timerDuration);
  };

  const takePhotoNow = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Get the actual video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Get the displayed dimensions (parent container)
    // We use the parent element because video object-cover fills it
    const containerRect = video.parentElement?.getBoundingClientRect();
    const containerWidth = containerRect?.width || videoWidth;
    const containerHeight = containerRect?.height || videoHeight;

    // Calculate aspect ratios
    const videoAspect = videoWidth / videoHeight;
    const containerAspect = containerWidth / containerHeight;

    let renderWidth, renderHeight, offsetX, offsetY;

    // Calculate crop exactly like object-cover
    if (containerAspect > videoAspect) {
      // Container is wider than video - crop top/bottom
      renderWidth = videoWidth;
      renderHeight = videoWidth / containerAspect;
      offsetX = 0;
      offsetY = (videoHeight - renderHeight) / 2;
    } else {
      // Container is taller than video - crop left/right
      renderWidth = videoHeight * containerAspect;
      renderHeight = videoHeight;
      offsetX = (videoWidth - renderWidth) / 2;
      offsetY = 0;
    }

    // Set canvas to match the rendered aspect ratio (or fixed size if desired, but ratio matters most)
    // We'll set canvas size to the container's relative resolution to maintain high quality
    canvas.width = renderWidth;
    canvas.height = renderHeight;

    // Apply filter
    ctx.filter = activeFilter.value;

    setIsFlashing(true);

    // Draw the cropped portion of the video WITHOUT mirroring (PhotoStrip handles mirroring)
    ctx.drawImage(
      video,
      offsetX, offsetY, renderWidth, renderHeight, // Source crop
      0, 0, canvas.width, canvas.height        // Destination
    );

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setTimeout(() => setIsFlashing(false), 200);
    onCapture(photoDataUrl);
  };

  // Determine container aspect ratio based on layout
  const getContainerStyle = () => {
    // Base width - effectively the "max" width for standard layouts, others are constrained further
    const baseStyle = { width: '100%', minWidth: '320px' };

    switch (layout.type) {
      case 'strip-4': return { ...baseStyle, aspectRatio: '4/3' };
      case 'grid-6': return { ...baseStyle, aspectRatio: '1/1', maxWidth: '500px' };
      case 'strip-2': return { ...baseStyle, aspectRatio: '2/3', maxWidth: '420px' };
      case 'grid-4': return { ...baseStyle, aspectRatio: '2/3', maxWidth: '420px' };
      default: return { ...baseStyle, aspectRatio: '3/2' };
    }
  };

  return (
    <div className="relative bg-black flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10 opacity-0 pointer-events-none">
        {/* Header placeholder kept for layout stability if needed, hidden now */}
      </div>

      <div
        className="relative overflow-hidden bg-black w-full"
        style={getContainerStyle()}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)', filter: activeFilter.value }}
        />

        {/* Composition Grid (Rule of Thirds) */}
        {showGrid && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Horizontal Lines */}
            <div className="absolute top-1/3 left-0 w-full h-px bg-white/40 shadow-sm"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-white/40 shadow-sm"></div>
            {/* Vertical Lines */}
            <div className="absolute top-0 left-1/3 w-px h-full bg-white/40 shadow-sm"></div>
            <div className="absolute top-0 left-2/3 w-px h-full bg-white/40 shadow-sm"></div>
          </div>
        )}

        {isFlashing && (
          <div className="absolute inset-0 bg-white opacity-70 pointer-events-none transition-opacity duration-200" />
        )}

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <div className="text-8xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-pulse">
                {countdown}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 w-full px-6 flex items-center justify-between z-20">

          {/* Timer Selector (Left) */}
          <div className={`flex-1 flex justify-start transition-opacity duration-300 ${isCountingDown ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/20">
              {[3, 5, 10].map(time => (
                <button
                  key={time}
                  onClick={() => setTimerDuration(time)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${timerDuration === time ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Capture Button (Center) */}
          <div className={`flex justify-center transition-all duration-300 ${isCountingDown ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}`}>
            <button
              onClick={startCountdown}
              disabled={isCountingDown}
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-gray-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
            >
              <span className="w-12 h-12 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors"></span>
            </button>
          </div>

          {/* Filter Toggle Button (Right) */}
          <div className={`flex-1 flex justify-end items-center gap-2 transition-opacity duration-300 ${isCountingDown ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Grid Toggle */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${showGrid ? 'bg-white text-black' : 'bg-black/30 text-white hover:bg-white/20'}`}
              title="Toggle Grid"
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowFilterSelector(!showFilterSelector)}
              className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg transition-all ${showFilterSelector ? 'bg-white text-blue-600' : 'bg-black/30 text-white hover:bg-white/20'}`}
              title="Filters"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Filter Selector (Pill Style) */}
      {showFilterSelector && !showFilterModal && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-2 flex items-center gap-3 shadow-lg">
            {filters.slice(0, 5).map((filter) => (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter)}
                className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${activeFilter.name === filter.name ? 'border-blue-500 scale-110 ring-2 ring-blue-500/50' : 'border-white'
                  }`}
                title={filter.name}
              >
                <img
                  src="https://images.unsplash.com/photo-1600567494125-2d7fc89962ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={filter.name}
                  className="w-full h-full object-cover"
                  style={{ filter: filter.value }}
                />
              </button>
            ))}

            <div className="w-px h-6 bg-white/30 mx-1"></div>

            <button
              onClick={() => setShowFilterModal(true)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
            >
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm p-6 flex flex-col animate-in fade-in duration-200 rounded-3xl">
          <div className="flex justify-between items-center mb-6 text-white">
            <h3 className="text-xl font-bold">All Filters</h3>
            <button onClick={() => setShowFilterModal(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-4 gap-4 overflow-y-auto pb-4 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => { setActiveFilter(filter); setShowFilterModal(false); }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all group-hover:scale-105 ${activeFilter.name === filter.name ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent'}`}>
                  <img
                    src="https://images.unsplash.com/photo-1600567494125-2d7fc89962ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt={filter.name}
                    className="w-full h-full object-cover"
                    style={{ filter: filter.value }}
                  />
                </div>
                <span className={`text-xs font-medium ${activeFilter.name === filter.name ? 'text-blue-400' : 'text-white/80'}`}>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent;
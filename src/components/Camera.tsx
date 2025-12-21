import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Zap, MoreHorizontal, Sparkles } from 'lucide-react';

interface CameraProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
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

const CameraComponent: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFilterSelector, setShowFilterSelector] = useState(false);

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
    setCountdown(5);
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

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10 opacity-0 pointer-events-none">
        {/* Header placeholder kept for layout stability if needed, hidden now */}
      </div>

      <div className="relative flex-grow flex items-center justify-center overflow-hidden bg-black aspect-[3/2] w-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)', filter: activeFilter.value }}
        />

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

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-6">
          {/* Capture Button */}
          <button
            onClick={startCountdown}
            disabled={isCountingDown}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-gray-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
          >
            <span className="w-12 h-12 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors"></span>
          </button>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterSelector(!showFilterSelector)}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg transition-all ${showFilterSelector ? 'bg-white text-blue-600' : 'bg-black/30 text-white hover:bg-white/20'}`}
            title="Filters"
          >
            <Sparkles className="w-5 h-5" />
          </button>
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
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                  alt={filter.name}
                  className="w-full h-full object-cover"
                  style={{ filter: filter.value }}
                />
              </button>
            ))}

            <div className="w-px h-6 bg-white/30 mx-1"></div>

            <button
              onClick={() => setShowFilterModal(true)}
              className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
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
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
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
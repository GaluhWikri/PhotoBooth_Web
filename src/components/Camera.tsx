import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Zap } from 'lucide-react';

interface CameraProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

const CameraComponent: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Take photo when countdown reaches 0
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
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
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

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setIsFlashing(true);
    ctx.drawImage(video, 0, 0);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    setTimeout(() => setIsFlashing(false), 200);
    onCapture(photoDataUrl);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Kamera
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 bg-black rounded-xl object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {isFlashing && (
          <div className="absolute inset-0 bg-white rounded-xl opacity-70 pointer-events-none" />
        )}
        
        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2 animate-pulse">
                {countdown}
              </div>
              <p className="text-white text-lg">Bersiap-siap...</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={startCountdown}
            disabled={isCountingDown}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-50 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg disabled:cursor-not-allowed"
          >
            <Zap className="w-5 h-5" />
            Ambil Foto
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Timer Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm text-center">
          💡 Klik "Ambil Foto" untuk memulai timer 5 detik
        </p>
      </div>
    </div>
  );
};

export default CameraComponent;
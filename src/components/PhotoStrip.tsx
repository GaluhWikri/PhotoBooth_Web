import React, { useRef } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

interface PhotoStripProps {
  photos: Photo[];
  backgroundColor: string;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, backgroundColor }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  const downloadPhotoStrip = async () => {
    if (!stripRef.current) return;

    try {
      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: stripRef.current.offsetWidth,
        height: stripRef.current.offsetHeight
      });

      const link = document.createElement('a');
      link.download = `photobooth-strip-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading photo strip:', error);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photo Strip
        </h3>
        <button
          onClick={downloadPhotoStrip}
          disabled={photos.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Photo Strip */}
      <div 
        ref={stripRef}
        className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none rounded-2xl"></div>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm p-4 text-center relative">
          <h4 className="text-white font-bold text-lg drop-shadow-lg">PhotoBooth Studio</h4>
          <p className="text-white/80 text-sm">
            {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Photos */}
        <div className="p-4 space-y-4 relative">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="photo-slot">
              {photos[index] ? (
                <img
                  src={photos[index].dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-white/70 shadow-xl ring-1 ring-white/50"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-white/20 via-white/30 to-white/10 rounded-lg border-2 border-white/50 border-dashed flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-white/80 mx-auto mb-2 drop-shadow-sm" />
                    <p className="text-white/80 text-sm font-medium drop-shadow-sm">Photo {index + 1}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm p-3 text-center relative">
          <p className="text-white/80 text-xs drop-shadow-sm">
            Made with ❤️ by PhotoBooth Studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
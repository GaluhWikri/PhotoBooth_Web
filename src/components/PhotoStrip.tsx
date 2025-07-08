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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photo Strip
        </h3>
        <button
          onClick={downloadPhotoStrip}
          disabled={photos.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Photo Strip */}
      <div 
        ref={stripRef}
        className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 text-center">
          <h4 className="text-white font-bold text-lg">PhotoBooth Studio</h4>
          <p className="text-white/80 text-sm">
            {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Photos */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="photo-slot">
              {photos[index] ? (
                <img
                  src={photos[index].dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-white/70 shadow-lg"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-32 bg-white/30 rounded-lg border-2 border-white/50 border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-white/70 mx-auto mb-2" />
                    <p className="text-white/70 text-sm font-medium">Photo {index + 1}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-black/20 backdrop-blur-sm p-3 text-center">
          <p className="text-white/80 text-xs">
            Made with ❤️ by PhotoBooth Studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
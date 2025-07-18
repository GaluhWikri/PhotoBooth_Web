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
  background: string; 
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, background }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  const downloadPhotoStrip = async () => {
    const element = stripRef.current;
    if (!element) return;

    // Mengukur dimensi elemen yang sebenarnya di layar
    const rect = element.getBoundingClientRect();

    const clone = element.cloneNode(true) as HTMLElement;
    
    // Menerapkan dimensi yang diukur untuk menjaga proporsi
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0px';
    
    document.body.appendChild(clone);
    
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,
        width: rect.width, // Memastikan canvas dibuat dengan lebar yang benar
        height: rect.height, // Memastikan canvas dibuat dengan tinggi yang benar
      });
      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading photo strip:', error);
    } finally {
      document.body.removeChild(clone);
    }
  };

  const backgroundStyle = background.startsWith('data:image')
    ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: background };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Hasil Photo Strip
        </h3>
        <button
          onClick={downloadPhotoStrip}
          disabled={photos.length < 4}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      <div
        ref={stripRef}
        className="w-full max-w-sm mx-auto overflow-hidden"
        style={backgroundStyle}
      >
        <div className="p-4 space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              {photos[index] ? (
                <img
                  src={photos[index].dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-[4/3] object-cover rounded-xl"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-black/10 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-black/20" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center py-16">
          <p className="font-bold text-2xl text-white tracking-widest">
            G.STUDIO
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
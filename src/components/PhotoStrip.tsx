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

    // --- PERBAIKAN UTAMA DI SINI ---

    // 1. Dapatkan dimensi elemen yang sesungguhnya saat ditampilkan di layar
    const rect = element.getBoundingClientRect();
    const elementWidth = rect.width;
    const elementHeight = rect.height;

    // Menambahkan kursor loading untuk UX
    document.body.style.cursor = 'wait';

    try {
      // 2. Render canvas dengan dimensi yang sama persis dengan elemen di layar
      const canvas = await html2canvas(element, {
        // Menggunakan dimensi dari getBoundingClientRect untuk presisi
        width: elementWidth,
        height: elementHeight,
        
        // Skala untuk resolusi tinggi
        scale: 2,
        
        // Pengaturan penting lainnya
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null,

        // Memberi konteks window untuk rendering yang lebih baik
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        x: element.scrollLeft,
        y: element.scrollTop,
      });
      
      // 3. Buat link dan mulai proses unduh
      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // Kualitas gambar terbaik
      link.click();

    } catch (error) {
      console.error('Gagal mengunduh photostrip:', error);
      alert('Terjadi kesalahan saat mengunduh gambar. Silakan coba lagi.');
    } finally {
      // Selalu kembalikan kursor
      document.body.style.cursor = 'default';
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
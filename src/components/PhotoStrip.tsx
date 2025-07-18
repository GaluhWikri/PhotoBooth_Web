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
    if (!element) {
      console.error("Referensi ke elemen photostrip tidak ditemukan.");
      return;
    }

    // --- PERBAIKAN UTAMA DI SINI ---
    
    // 1. Kloning elemen untuk stabilitas rendering
    const clone = element.cloneNode(true) as HTMLElement;

    // 2. Atur gaya untuk klon agar ukurannya konsisten
    // `max-w-sm` di Tailwind setara dengan 384px.
    // Dengan mengatur lebar tetap dan tinggi otomatis, rasio aspek akan terjaga.
    clone.style.width = '384px'; 
    clone.style.height = 'auto';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px'; // Posisikan di luar layar
    clone.style.top = '0px';

    // 3. Tambahkan klon ke body agar bisa di-render
    document.body.appendChild(clone);
    
    // Memberi sedikit jeda agar browser sempat me-render klon dengan benar
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(clone, {
        scale: 2, // Resolusi tinggi untuk kualitas cetak
        useCORS: true,
        allowTaint: true,
        logging: true, // Aktifkan logging untuk debug jika perlu
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link); // Tambahkan link ke body untuk kompatibilitas browser
      link.click();
      document.body.removeChild(link); // Hapus link setelah di-klik

    } catch (error) {
      console.error('Gagal membuat kanvas dari elemen:', error);
      alert('Maaf, terjadi kesalahan saat mencoba mengunduh gambar. Silakan periksa konsol untuk detail.');
    } finally {
      // 4. Selalu hapus klon setelah selesai
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
        className="w-full max-w-sm mx-auto overflow-hidden" // `max-w-sm` adalah kunci
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
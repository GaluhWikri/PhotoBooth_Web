import React, { useRef } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';

interface Photo {
  id: string;
  dataUrl: string;
}

interface PhotoStripProps {
  photos: Photo[];
  background: string;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, background }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  // --- FUNGSI UNDUH BARU: DIBANGUN DARI NOL & ANTI-GAGAL ---
  const downloadPhotoStrip = async () => {
    if (photos.length < 4) {
      alert("Harap ambil 4 foto terlebih dahulu.");
      return;
    }
    document.body.style.cursor = 'wait';

    try {
      // 1. DEFINISIKAN UKURAN OUTPUT GAMBAR SECARA PASTI (TIDAK MEMBACA DARI LAYAR)
      const outputWidth = 1200; // Resolusi tinggi untuk hasil cetak yang tajam
      const photoAspectRatio = 4 / 3; // Rasio aspek foto adalah 4:3

      // 2. HITUNG SEMUA UKURAN SECARA MATEMATIS
      const padding = outputWidth * 0.05;      // Padding: 5% dari lebar
      const photoWidth = outputWidth - (padding * 2);
      const photoHeight = photoWidth / photoAspectRatio;
      const spacing = photoHeight * 0.08;      // Jarak antar foto: 8% dari tinggi foto
      const textHeight = outputWidth * 0.20;   // Alokasi ruang untuk teks di bawah

      const outputHeight = (padding) + (4 * photoHeight) + (3 * spacing) + textHeight;

      // 3. BUAT KANVAS KOSONG DENGAN UKURAN YANG SUDAH PASTI
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Gagal membuat konteks kanvas.');

      // 4. GAMBAR BACKGROUND (WARNA ATAU GAMBAR)
      if (background.startsWith('data:image')) {
        const bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          bgImage.onload = () => resolve();
          bgImage.onerror = reject;
          bgImage.src = background;
        });
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 5. GAMBAR SETIAP FOTO KE KANVAS DENGAN POSISI YANG SUDAH DIHITUNG
      for (let i = 0; i < 4; i++) {
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          photoImg.onload = () => resolve();
          photoImg.onerror = reject;
          photoImg.src = photos[i].dataUrl;
        });
        const yPos = padding + i * (photoHeight + spacing);

        // Proses membalikkan gambar (mirror) secara manual di kanvas
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(photoImg, padding, yPos, photoWidth, photoHeight);
        ctx.restore();
      }

      // 6. GAMBAR TEKS "G.STUDIO"
      const textYPos = (padding) + (4 * photoHeight) + (3 * spacing) + (textHeight / 2);
      ctx.fillStyle = 'white';
      ctx.font = `bold ${outputWidth * 0.07}px "Averia Serif Libre", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('G.STUDIO', canvas.width / 2, textYPos);

      // 7. UNDUH HASIL GAMBAR DARI KANVAS
      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

    } catch (error) {
      console.error('Terjadi kesalahan fatal saat membuat gambar:', error);
      alert('Maaf, terjadi kesalahan yang tidak terduga saat mengunduh gambar.');
    } finally {
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

      {/* Bagian pratinjau ini hanya untuk tampilan, tidak memengaruhi hasil unduhan */}
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
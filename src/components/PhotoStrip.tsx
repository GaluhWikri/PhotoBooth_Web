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

  // --- FUNGSI UNDUH YANG DITULIS ULANG TOTAL - BERDASARKAN PRATINJAU ---
  const downloadPhotoStrip = async () => {
    const previewElement = stripRef.current;
    if (!previewElement || photos.length < 4) {
      alert("Harap ambil 4 foto terlebih dahulu.");
      return;
    }

    document.body.style.cursor = 'wait';

    try {
      // LANGKAH 1: UKUR PRATINJAU YANG MUNCUL DI LAYAR PENGGUNA
      // Ini adalah kunci utama untuk mendapatkan proporsi yang benar.
      const previewRect = previewElement.getBoundingClientRect();
      const previewWidth = previewRect.width;
      const previewHeight = previewRect.height;
      const aspect_ratio = previewHeight / previewWidth;

      // LANGKAH 2: BUAT KANVAS BARU DENGAN RESOLUSI TINGGI TAPI PROPORSIONAL
      const finalWidth = 1500; // Lebar gambar final (resolusi tinggi)
      const finalHeight = finalWidth * aspect_ratio; // Tinggi dihitung dari rasio aspek pratinjau

      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Gagal membuat kanvas.');

      // LANGKAH 3: GAMBAR BACKGROUND
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
      
      // LANGKAH 4: REPLIKASI LAYOUT FOTO DAN TEKS
      // Menggunakan persentase yang sama seperti di layout CSS (Tailwind)
      // p-4 -> padding: 1rem; space-y-6 -> margin-top: 1.5rem
      // Kita konversi ke persentase relatif terhadap tinggi pratinjau
      const PADDING_TOP_RATIO = 16 / previewHeight;
      const PADDING_SIDES_RATIO = 16 / previewWidth;
      const SPACING_RATIO = 24 / previewHeight;
      const TEXT_AREA_HEIGHT_RATIO = (16 * 4) / previewHeight; // py-16 -> 4rem

      const paddingY = finalHeight * PADDING_TOP_RATIO;
      const paddingX = finalWidth * PADDING_SIDES_RATIO;
      const spacingY = finalHeight * SPACING_RATIO;
      
      const photoAreaTotalHeight = finalHeight * (1 - TEXT_AREA_HEIGHT_RATIO - PADDING_TOP_RATIO - PADDING_TOP_RATIO);
      const photoHeight = (photoAreaTotalHeight - (3 * spacingY)) / 4;
      const photoWidth = finalWidth - (2 * paddingX);

      // LANGKAH 5: GAMBAR SETIAP FOTO
      for (let i = 0; i < 4; i++) {
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          photoImg.onload = () => resolve();
          photoImg.onerror = reject;
          photoImg.src = photos[i].dataUrl;
        });
        const yPos = paddingY + i * (photoHeight + spacingY);

        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(photoImg, paddingX, yPos, photoWidth, photoHeight);
        ctx.restore();
      }
      
      // LANGKAH 6: GAMBAR TEKS
      const textYPos = finalHeight - ((finalHeight * TEXT_AREA_HEIGHT_RATIO) / 2);
      ctx.fillStyle = 'white';
      ctx.font = `bold ${finalWidth * 0.06}px "Averia Serif Libre", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('G.STUDIO', canvas.width / 2, textYPos);

      // LANGKAH 7: UNDUH HASIL AKHIR
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

      <div
        ref={stripRef}
        id="photo-strip-preview"
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
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

  // --- FUNGSI DOWNLOAD YANG TELAH DIPERBAIKI ---
  const downloadPhotoStrip = async () => {
    const element = stripRef.current;
    if (!element) return;

    // Menampilkan kursor loading untuk feedback
    document.body.style.cursor = 'wait';

    try {
      // 1. Tentukan dimensi output gambar (resolusi tinggi)
      const outputWidth = 600; // Lebar gambar final dalam piksel
      
      // 2. Hitung dimensi berdasarkan layout yang benar
      const padding = outputWidth * 0.05; // 5% padding
      const spacing = outputWidth * 0.06; // 6% spasi antar foto
      const photoWidth = outputWidth - padding * 2;
      const photoHeight = photoWidth / (4/3); // Rasio aspek 4:3 untuk setiap foto
      
      // 3. Hitung tinggi total strip secara akurat
      const textAreaHeight = outputWidth * 0.25; // Area untuk teks G.STUDIO
      const totalPhotosHeight = (photoHeight * 4) + (spacing * 3); // 4 foto + 3 spasi
      const outputHeight = padding * 2 + totalPhotosHeight + textAreaHeight;

      // 4. Buat kanvas baru di memori
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Tidak bisa mendapatkan konteks 2D kanvas.');
      }
      
      // 5. Gambar background (warna atau gambar)
      if (background.startsWith('data:image')) {
        const bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
            bgImage.onload = resolve;
            bgImage.onerror = reject;
            bgImage.src = background;
        });
        // Simulasikan background-size: cover
        const hRatio = canvas.width / bgImage.width;
        const vRatio = canvas.height / bgImage.height;
        const ratio  = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - bgImage.width * ratio) / 2;
        const centerShift_y = (canvas.height - bgImage.height * ratio) / 2;  
        ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height,
                      centerShift_x, centerShift_y, bgImage.width * ratio, bgImage.height * ratio);  
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // 6. Gambar setiap foto ke kanvas dengan positioning yang benar
      for (let i = 0; i < 4; i++) {
        if (photos[i]) {
            const photoImg = new Image();
            photoImg.crossOrigin = 'anonymous';
            await new Promise((resolve, reject) => {
                photoImg.onload = resolve;
                photoImg.onerror = reject;
                photoImg.src = photos[i].dataUrl;
            });

            // Hitung posisi Y untuk setiap foto
            const yPos = padding + i * (photoHeight + spacing);

            // Simpan state kanvas
            ctx.save();
            // Pindahkan, balikkan, dan gambar (mirror effect)
            ctx.translate(padding + photoWidth, yPos);
            ctx.scale(-1, 1);
            ctx.drawImage(photoImg, 0, 0, photoWidth, photoHeight);
            // Kembalikan state kanvas
            ctx.restore();
        }
      }

      // 7. Gambar teks "G.STUDIO" di bagian bawah
      const textYPosition = padding + totalPhotosHeight + (textAreaHeight / 2);
      ctx.fillStyle = 'white';
      ctx.font = `bold ${outputWidth * 0.08}px "Averia Serif Libre", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('G.STUDIO', canvas.width / 2, textYPosition);
      
      // 8. Trigger download
      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

    } catch (error) {
      console.error('Gagal membuat atau mengunduh photostrip:', error);
      alert('Maaf, terjadi kesalahan saat mengunduh gambar.');
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
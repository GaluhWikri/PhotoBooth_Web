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

  // --- FUNGSI DOWNLOAD YANG TELAH DIPERBAIKI TOTAL ---
  const downloadPhotoStrip = async () => {
    const element = stripRef.current;
    if (!element) return;

    // Menampilkan kursor loading untuk feedback
    document.body.style.cursor = 'wait';

    try {
      // 1. Ambil dimensi aktual dari preview element
      const previewRect = element.getBoundingClientRect();
      const previewWidth = previewRect.width;
      const previewHeight = previewRect.height;
      
      // 2. Tentukan skala untuk output berkualitas tinggi
      const scale = 3; // 3x resolusi untuk kualitas tinggi
      const outputWidth = previewWidth * scale;
      const outputHeight = previewHeight * scale;

      // 3. Buat kanvas dengan dimensi yang sama persis seperti preview
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Tidak bisa mendapatkan konteks 2D kanvas.');
      }
      
      // 4. Gambar background sesuai dengan preview
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
      
      // 5. Cari semua elemen foto dalam preview untuk mendapatkan posisi yang tepat
      const photoContainers = element.querySelectorAll('.photo-container');
      
      // 6. Hitung padding dan posisi berdasarkan preview aktual
      const containerPadding = 16 * scale; // p-4 = 16px
      
      // 7. Gambar setiap foto berdasarkan posisi aktual di preview
      for (let i = 0; i < 4; i++) {
        if (photos[i] && photoContainers[i]) {
          const photoImg = new Image();
          photoImg.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
              photoImg.onload = resolve;
              photoImg.onerror = reject;
              photoImg.src = photos[i].dataUrl;
          });

          // Hitung posisi berdasarkan container
          const containerRect = photoContainers[i].getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          
          // Posisi relatif terhadap container utama
          const relativeX = (containerRect.left - elementRect.left) * scale;
          const relativeY = (containerRect.top - elementRect.top) * scale;
          const photoWidth = containerRect.width * scale;
          const photoHeight = containerRect.height * scale;

          // Simpan state kanvas
          ctx.save();
          // Pindahkan, balikkan, dan gambar (mirror effect)
          ctx.translate(relativeX + photoWidth, relativeY);
          ctx.scale(-1, 1);
          ctx.drawImage(photoImg, 0, 0, photoWidth, photoHeight);
          // Kembalikan state kanvas
          ctx.restore();
        }
      }

      // 8. Cari elemen teks dan gambar sesuai posisi aktual
      const textElement = element.querySelector('.strip-text');
      if (textElement) {
        const textRect = textElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        const textX = (textRect.left - elementRect.left + textRect.width / 2) * scale;
        const textY = (textRect.top - elementRect.top + textRect.height / 2) * scale;
        
        ctx.fillStyle = 'white';
        ctx.font = `bold ${24 * scale}px "Averia Serif Libre", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G.STUDIO', textX, textY);
      }
      
      // 9. Trigger download
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
            <div key={index} className="photo-container" data-photo-index={index}>
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
          <p className="font-bold text-2xl text-white tracking-widest strip-text">
            G.STUDIO
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
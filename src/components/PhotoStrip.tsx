import React, { useRef } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';

// html2canvas dan library sejenis TIDAK LAGI DIGUNAKAN.

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
  const textRef = useRef<HTMLParagraphElement>(null);

  // --- FUNGSI UNDUH BARU: MENGUKUR PRATINJAU & MENGGAMBAR ULANG ---
  const downloadPhotoStrip = async () => {
    const previewElement = stripRef.current;
    if (!previewElement || photos.length < 4) {
      alert("Harap ambil 4 foto terlebih dahulu.");
      return;
    }

    document.body.style.cursor = 'wait';

    try {
      // LANGKAH 1: UKUR SEMUA ELEMEN DARI PRATINJAU SECARA PRESISI
      const previewRect = previewElement.getBoundingClientRect();
      const aspectRatio = previewRect.height / previewRect.width;
      const imageElements = Array.from(previewElement.querySelectorAll('img'));
      const textElement = textRef.current;
      if (!textElement || imageElements.length < 4) throw new Error("Elemen internal tidak ditemukan.");

      // LANGKAH 2: BUAT KANVAS BARU DENGAN RESOLUSI TINGGI & PROPORSIONAL
      const finalWidth = 1500; // Lebar gambar final (resolusi tajam)
      const finalHeight = finalWidth * aspectRatio; // Tinggi dihitung dari rasio pratinjau

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
        ctx.drawImage(bgImage, 0, 0, finalWidth, finalHeight);
      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, finalWidth, finalHeight);
      }

      // LANGKAH 4: GAMBAR ULANG SETIAP FOTO DENGAN POSISI & UKURAN YANG TEPAT
      for (const imgEl of imageElements) {
        const imgRect = imgEl.getBoundingClientRect();
        
        // Hitung posisi dan ukuran relatif terhadap pratinjau
        const x = (imgRect.left - previewRect.left) / previewRect.width * finalWidth;
        const y = (imgRect.top - previewRect.top) / previewRect.height * finalHeight;
        const w = imgRect.width / previewRect.width * finalWidth;
        const h = imgRect.height / previewRect.height * finalHeight;
        // Mengukur sudut rounded dari CSS dan menskalakannya
        const borderRadius = (parseFloat(getComputedStyle(imgEl).borderRadius) / previewRect.width) * finalWidth;

        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          photoImg.onload = () => resolve();
          photoImg.onerror = reject;
          photoImg.src = imgEl.src;
        });
        
        // Membuat efek rounded corner secara manual
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + w - borderRadius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + borderRadius);
        ctx.lineTo(x + w, y + h - borderRadius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - borderRadius, y + h);
        ctx.lineTo(x + borderRadius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.clip();
        
        // Gambar foto yang sudah di-mirror ke dalam area rounded
        ctx.translate(finalWidth, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(photoImg, finalWidth - x - w, y, w, h);
        ctx.restore();
      }

      // LANGKAH 5: GAMBAR ULANG TEKS PERSIS SEPERTI PRATINJAU
      const textRect = textElement.getBoundingClientRect();
      const textStyle = getComputedStyle(textElement);
      // Hitung posisi tengah teks secara presisi
      const x = (textRect.left - previewRect.left + textRect.width / 2) / previewRect.width * finalWidth;
      const y = (textRect.top - previewRect.top + textRect.height / 2) / previewRect.height * finalHeight;
      
      ctx.fillStyle = textStyle.color;
      // Ambil dan skalakan ukuran font dari pratinjau
      ctx.font = `${textStyle.fontWeight} ${parseFloat(textStyle.fontSize) / previewRect.width * finalWidth}px ${textStyle.fontFamily.split(',')[0]}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textElement.innerText, x, y);

      // LANGKAH 6: UNDUH HASIL AKHIR
      const link = document.createElement('a');
      link.download = `photostrip-gstudio-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

    } catch (error) {
      console.error('Terjadi kesalahan fatal:', error);
      alert('Maaf, terjadi kesalahan saat membuat gambar.');
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
          {/* Tambahkan ref ke elemen teks ini agar bisa diukur */}
          <p ref={textRef} className="font-bold text-2xl text-white tracking-widest">
            G.STUDIO
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
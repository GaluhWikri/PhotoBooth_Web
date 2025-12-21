import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Download, Image as ImageIcon, X, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import Draggable from 'react-draggable';

// Tipe data untuk objek stiker
export interface StickerObject {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

// Tipe data untuk foto
interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
}

// Properti yang diterima oleh komponen ini
interface PhotoStripProps {
  photos: Photo[];
  background: string;
  onDeletePhoto: (id: string) => void;
  stickers: StickerObject[];
  onUpdateSticker: (id: string, newProps: Partial<StickerObject>) => void;
  onDeleteSticker: (id: string) => void;
}

export interface PhotoStripHandle {
  download: () => void;
}

const PhotoStrip = forwardRef<PhotoStripHandle, PhotoStripProps>(({ photos, background, onDeletePhoto, stickers, onUpdateSticker, onDeleteSticker }, ref) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    download: () => downloadPhotoStrip()
  }));

  // --- FUNGSI UNDUH FINAL: MENGUKUR PRATINJAU & MENGGAMBAR ULANG ---
  const downloadPhotoStrip = async () => {
    const previewElement = stripRef.current;
    if (!previewElement || photos.length < 4) {
      alert("Harap ambil 4 foto terlebih dahulu.");
      return;
    }
    setActiveStickerId(null); // Sembunyikan kontrol stiker sebelum download
    await new Promise(resolve => setTimeout(resolve, 100)); // Beri waktu UI untuk update

    document.body.style.cursor = 'wait';

    try {
      // 1. UKUR SEMUA ELEMEN DARI PRATINJAU SECARA PRESISI
      const previewRect = previewElement.getBoundingClientRect();
      const aspectRatio = previewRect.height / previewRect.width;
      const imageElements = Array.from(previewElement.querySelectorAll('img.photo-image'));
      const textElement = textRef.current;
      if (!textElement || imageElements.length < 4) throw new Error("Elemen pratinjau tidak lengkap.");

      // 2. BUAT KANVAS BARU DENGAN RESOLUSI TINGGI & PROPORSIONAL
      const finalWidth = 1500; // Resolusi tinggi untuk kualitas cetak
      const finalHeight = finalWidth * aspectRatio;

      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Gagal membuat kanvas.');

      // 3. GAMBAR BACKGROUND
      if (background.startsWith('data:image') || background.startsWith('/')) {
        const bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          bgImage.onload = () => resolve();
          bgImage.onerror = reject;
          bgImage.src = background;
        });

        // Simulate 'background-size: cover'
        const bgRatio = bgImage.width / bgImage.height;
        const canvasRatio = finalWidth / finalHeight;
        let bgX = 0, bgY = 0, bgW = finalWidth, bgH = finalHeight;

        if (bgRatio > canvasRatio) {
          // Background is wider than canvas: Crop width
          bgW = finalHeight * bgRatio;
          bgX = (finalWidth - bgW) / 2;
        } else {
          // Background is taller than canvas: Crop height
          bgH = finalWidth / bgRatio;
          bgY = (finalHeight - bgH) / 2;
        }
        ctx.drawImage(bgImage, bgX, bgY, bgW, bgH);

      } else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, finalWidth, finalHeight);
      }

      // 4. GAMBAR ULANG SETIAP FOTO DENGAN POSISI & GAYA YANG TEPAT
      for (const imgEl of imageElements) {
        const imgRect = imgEl.getBoundingClientRect();

        // Hitung posisi dan ukuran relatif dari pratinjau, lalu skalakan
        const x = (imgRect.left - previewRect.left) / previewRect.width * finalWidth;
        const y = (imgRect.top - previewRect.top) / previewRect.height * finalHeight;
        const w = imgRect.width / previewRect.width * finalWidth;
        const h = imgRect.height / previewRect.height * finalHeight;

        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          photoImg.onload = () => resolve();
          photoImg.onerror = reject;
          photoImg.src = (imgEl as HTMLImageElement).src;
        });

        // Rectangle Biasa (Tanpa Rounded Corner yang rumit)
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.clip();

        // Meniru efek 'object-fit: cover' dan 'transform: scaleX(-1)'
        ctx.translate(finalWidth, 0);
        ctx.scale(-1, 1);
        const imgAspectRatio = photoImg.width / photoImg.height;
        const slotAspectRatio = w / h;
        let sx = 0, sy = 0, sWidth = photoImg.width, sHeight = photoImg.height;
        if (imgAspectRatio > slotAspectRatio) {
          sWidth = photoImg.height * slotAspectRatio;
          sx = (photoImg.width - sWidth) / 2;
        } else {
          sHeight = photoImg.width / slotAspectRatio;
          sy = (photoImg.height - sHeight) / 2;
        }
        // Perbaiki koordinat X setelah flip horizontal: (finalWidth - x - w)
        ctx.drawImage(photoImg, sx, sy, sWidth, sHeight, finalWidth - x - w, y, w, h);

        // Tambahkan border tipis putih/transparan seperti di CSS
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * (finalWidth / previewRect.width);
        ctx.strokeRect(x, y, w, h);
      }

      // 5. GAMBAR ULANG STIKER
      for (const sticker of stickers) {
        const stickerImg = new Image();
        stickerImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => { stickerImg.onload = () => resolve(); stickerImg.src = sticker.src; });

        const w = 80 * sticker.scale * (finalWidth / previewRect.width); // 80 adalah lebar dasar stiker di CSS
        const h = (stickerImg.height / stickerImg.width) * w;
        const x = sticker.x * (finalWidth / previewRect.width);
        const y = sticker.y * (finalWidth / previewRect.width); // Gunakan width untuk rasio konsisten

        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(sticker.rotation * Math.PI / 180);
        ctx.drawImage(stickerImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      // 6. GAMBAR ULANG TEKS
      const textRect = textElement.getBoundingClientRect();
      const textStyle = getComputedStyle(textElement);
      const x = (textRect.left - previewRect.left + textRect.width / 2) / previewRect.width * finalWidth;
      const y = (textRect.top - previewRect.top + textRect.height / 2) / previewRect.height * finalHeight;

      ctx.fillStyle = textStyle.color;
      // Include fontStyle (italic)
      ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${parseFloat(textStyle.fontSize) / previewRect.width * finalWidth}px ${textStyle.fontFamily.split(',')[0]}`;

      // Add Shadow matching CSS '0 1px 2px rgba(0,0,0,0.3)'
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2 * (finalWidth / previewRect.width);
      ctx.shadowOffsetY = 1 * (finalWidth / previewRect.width);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textElement.innerText, x, y);

      // 7. UNDUH HASIL AKHIR
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

  const backgroundStyle = (background.startsWith('data:image') || background.startsWith('/'))
    ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: background };

  return (
    <div className="bg-transparent"> {/* REMOVED: Wrapper styling to simple transparent div */}
      {/* REMOVED: Header Bar */}

      <div
        ref={stripRef}
        className="w-full max-w-sm mx-auto overflow-hidden relative"
        style={backgroundStyle}
        onClick={(e) => { if (e.target === e.currentTarget) setActiveStickerId(null); }}
      >
        <div className="z-0">
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={photos[index]?.id || index} className="relative">
                {photos[index] ? (
                  <>
                    <img src={photos[index].dataUrl} alt={`Photo ${index + 1}`} className="w-full aspect-[3/2] object-cover border-2 border-white/20 shadow-sm photo-image" style={{ transform: 'scaleX(-1)' }} />
                    <button onClick={() => onDeletePhoto(photos[index].id)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"><X className="w-3 h-3" /></button>
                  </>
                ) : (
                  <div className="w-full aspect-[3/2] bg-black/5 flex items-center justify-center border-2 border-dashed border-black/10">
                    <ImageIcon className="w-6 h-6 text-black/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center pb-6 pt-2">
            <p ref={textRef} className="font-serif italic text-xl text-white/90 tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>G.STUDIO</p>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          {stickers.map(sticker => (
            <Draggable
              key={sticker.id}
              position={{ x: sticker.x, y: sticker.y }}
              onStop={(_, data) => onUpdateSticker(sticker.id, { x: data.x, y: data.y })}
              onStart={() => setActiveStickerId(sticker.id)}
              bounds="parent"
            >
              <div
                id={sticker.id}
                className={`absolute p-2 border-2 ${activeStickerId === sticker.id ? 'border-blue-500 border-dashed' : 'border-transparent'} pointer-events-auto`}
                onClick={(e) => { e.stopPropagation(); setActiveStickerId(sticker.id); }}
              >
                <img
                  src={sticker.src}
                  alt="sticker"
                  className="pointer-events-none"
                  width={80 * sticker.scale}
                  style={{ transform: `rotate(${sticker.rotation}deg)` }}
                />
                {activeStickerId === sticker.id && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg flex gap-1 p-1 z-20">
                    <button onClick={() => onUpdateSticker(sticker.id, { scale: sticker.scale * 1.1 })} className="p-1.5 hover:bg-gray-200 rounded-full"><ZoomIn size={16} /></button>
                    <button onClick={() => onUpdateSticker(sticker.id, { scale: sticker.scale * 0.9 })} className="p-1.5 hover:bg-gray-200 rounded-full"><ZoomOut size={16} /></button>
                    <button onClick={() => onUpdateSticker(sticker.id, { rotation: sticker.rotation + 15 })} className="p-1.5 hover:bg-gray-200 rounded-full"><RefreshCw size={16} /></button>
                    <button onClick={() => onDeleteSticker(sticker.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={16} /></button>
                  </div>
                )}
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PhotoStrip;
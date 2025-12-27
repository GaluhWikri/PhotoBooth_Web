import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Image as ImageIcon, X, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import Draggable from 'react-draggable';
import { LayoutConfig } from './ChooseLayout';

export type PhotoShape = 'rect' | 'rounded' | 'circle' | 'heart';

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
  filter: string;
  isMirrored?: boolean;
}

// Properti yang diterima oleh komponen ini
interface PhotoStripProps {
  photos: Photo[];
  layout: LayoutConfig;
  background: string;
  onDeletePhoto: (id: string) => void;
  stickers: StickerObject[];
  onUpdateSticker: (id: string, newProps: Partial<StickerObject>) => void;
  onDeleteSticker: (id: string) => void;
  readonly?: boolean;
  photoShape?: PhotoShape;
  textColor?: string;
}

export interface PhotoStripHandle {
  download: () => void;
}

const PhotoStrip = forwardRef<PhotoStripHandle, PhotoStripProps>(({ photos, layout, background, onDeletePhoto, stickers, onUpdateSticker, onDeleteSticker, readonly = false, photoShape = 'rect', textColor = '#ffffff' }, ref) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [isClickingControl, setIsClickingControl] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    download: () => downloadPhotoStrip()
  }));

  // --- FUNGSI UNDUH FINAL: MENGUKUR PRATINJAU & MENGGAMBAR ULANG ---
  const downloadPhotoStrip = async () => {
    const previewElement = stripRef.current;
    if (!previewElement || photos.length < layout.photoCount) {
      alert(`Harap ambil ${layout.photoCount} foto terlebih dahulu.`);
      return;
    }
    setActiveStickerId(null); // Sembunyikan kontrol stiker sebelum download
    await new Promise(resolve => setTimeout(resolve, 100)); // Beri waktu UI untuk update

    document.body.style.cursor = 'wait';

    try {
      // 1. UKUR SEMUA ELEMEN DARI PRATINJAU SECARA PRESISI
      const previewRect = previewElement.getBoundingClientRect();
      const imageElements = Array.from(previewElement.querySelectorAll('img.photo-image'));
      const textElement = textRef.current;

      // Note: textElement logic needs adjustment because position might vary with grid, but stick to bottom for now
      if (!textElement || imageElements.length < layout.photoCount) throw new Error("Elemen pratinjau tidak lengkap.");

      // 2. BUAT KANVAS BARU DENGAN RESOLUSI TINGGI & PROPORSIONAL
      // Use a fixed width for high res output, calculate height based on layout aspect ratio
      const finalWidth = 1200;
      const finalHeight = finalWidth / layout.aspectRatio; // defined in validation as width/height

      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Gagal membuat kanvas.');

      // 3. GAMBAR BACKGROUND
      if (background.startsWith('data:image') || background.includes('/')) {
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

      // Since we are using Grid/Flex in CSS, getting exact positions from DOM is safest
      // We map the preview element positions to the canvas coordinate system

      for (let i = 0; i < imageElements.length; i++) {
        const imgEl = imageElements[i];
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

        // Clip area for photo
        ctx.save();
        ctx.beginPath();

        // Apply Shape Path
        if (photoShape === 'circle') {
          // Circle/Oval logic. Since it might not be perfect square, we do ellipse or circle.
          // Usually circle fits in the smaller dimension or stretches. User likely wants Circle if square, Oval if rect.
          // Let's do rounded rect with max radius for circle-ish or ellipse.
          // Or just standard ellipse:
          ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.clip();
        } else if (photoShape === 'heart') {
          // Heart shape using simple SVG path
          const pathData = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

          const currentTransform = ctx.getTransform();
          ctx.translate(x, y);
          // Scale to fill the slot exactly (100% 100%), accounting for path padding (viewbox 2 3 20 18.35)
          ctx.scale(w / 20, h / 18.35);
          ctx.translate(-2, -3);
          ctx.clip(new Path2D(pathData));
          ctx.setTransform(currentTransform);
        } else if (photoShape === 'rounded') {
          // Rounded Rect
          // Use 10% of min dimension as radius
          const radius = Math.min(w, h) * 0.1;
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, w, h, radius);
          } else {
            // Fallback for older browsers
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
          }
          ctx.closePath();
          ctx.clip();
        } else {
          // Rect
          ctx.rect(x, y, w, h);
          ctx.closePath();
          ctx.clip();
        }

        // Apply filter if available
        if (photos[i] && photos[i].filter) {
          ctx.filter = photos[i].filter;
        }

        // Meniru efek 'object-fit: cover' dan 'transform: scaleX(-1)'
        // IMPORTANT: The context flip must happen around the image center or handled carefully
        // Standard approach: Translate to center of slot, scale -1 1, draw image centered

        if (photos[i] && photos[i].isMirrored !== false) {
          ctx.translate(x + w / 2, y + h / 2);
          ctx.scale(-1, 1);
        } else {
          ctx.translate(x + w / 2, y + h / 2);
        }

        const imgAspectRatio = photoImg.width / photoImg.height;
        const slotAspectRatio = w / h;
        let drawW = w;
        let drawH = h;

        if (imgAspectRatio > slotAspectRatio) {
          // Image is wider, crop width
          drawW = h * imgAspectRatio;
        } else {
          // Image is taller, crop height
          drawH = w / imgAspectRatio;
        }

        ctx.drawImage(photoImg, -drawW / 2, -drawH / 2, drawW, drawH);

        ctx.restore();

        ctx.restore();

        // Border (Optional: Draw shape stroke if needed, primarily for debugging or style)
        // Adjusting stroke for non-rect shapes is complex, omitting generalized stroke for now or keeping simple rect stroke only if rect
        // For aesthetic purposes in 'photo booth' styles, usually no border on the cut itself, just the image.
        // But if previously it had stroke, let's keep it but respect shape.

        /* 
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * (finalWidth / previewRect.width);
        // We would need to replay the path to stroke it.
        // For now, removing the rect border to avoid square border on heart/circle shapes which looks bad.
        */
        ctx.lineWidth = 2 * (finalWidth / previewRect.width);
        // ctx.strokeRect(x, y, w, h);
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
      // Re-measure text element position relative to preview container
      const textRect = textElement.getBoundingClientRect();
      const textStyle = getComputedStyle(textElement);

      const tx = (textRect.left - previewRect.left + textRect.width / 2) / previewRect.width * finalWidth;
      const ty = (textRect.top - previewRect.top + textRect.height / 2) / previewRect.height * finalHeight;

      ctx.fillStyle = textColor; // Use the prop directly for reliability
      // Include fontStyle (italic)
      // Scale font size based on width ratio
      const fontSize = parseFloat(textStyle.fontSize) * (finalWidth / previewRect.width);
      ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${fontSize}px ${textStyle.fontFamily.split(',')[0]}`;

      // Add Shadow matching CSS '0 1px 2px rgba(0,0,0,0.3)'
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2 * (finalWidth / previewRect.width);
      ctx.shadowOffsetY = 1 * (finalWidth / previewRect.width);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textElement.innerText, tx, ty);

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

  const backgroundStyle = (background.startsWith('data:image') || background.includes('/'))
    ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: background };

  // Calculate Grid Styles based on layout
  const getGridStyle = () => {
    switch (layout.type) {
      case 'strip-2': return 'grid-cols-1 grid-rows-2';
      case 'strip-4': return 'grid-cols-1 grid-rows-4';
      case 'grid-4': return 'grid-cols-2 grid-rows-2';
      case 'grid-6': return 'grid-cols-2 grid-rows-3';
      default: return 'grid-cols-1';
    }
  };

  return (
    <div className="bg-transparent">
      <div
        ref={stripRef}
        className="mx-auto overflow-hidden relative shadow-lg"
        style={{
          ...backgroundStyle,
          aspectRatio: `${layout.aspectRatio}`, // Uses CSS aspect-ratio property
          width: '100%',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActiveStickerId(null);
            setShowControls(false);
          }
        }}
      >
        <div className="z-0 h-full flex flex-col">
          {/* Main Photo Grid */}
          <div className={`p-4 grid gap-2 flex-grow min-h-0 ${getGridStyle()}`}>
            {Array.from({ length: layout.photoCount }).map((_, index) => (
              <div key={photos[index]?.id || index} className="relative w-full h-full overflow-hidden">
                {photos[index] ? (
                  <>
                    <img
                      src={photos[index].dataUrl}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover border-2 border-white/20 shadow-sm photo-image"
                      style={{
                        transform: photos[index].isMirrored !== false ? 'scaleX(-1)' : 'none',
                        filter: photos[index].filter,
                        borderRadius: photoShape === 'rounded' ? '1rem' : photoShape === 'circle' ? '50%' : '0',
                        // Fix: Removed clipPath for heart because 'path()' is absolute coordinates (px) and doesn't scale.
                        // Using maskImage alone works for responsive elements.
                        clipPath: 'none',
                        // Fix: Using tight-fit viewBox (2 3 20 18.35) to remove padding + preserveAspectRatio='none'
                        maskImage: photoShape === 'heart' ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 3 20 18.35' fill='black' preserveAspectRatio='none'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>")` : 'none',
                        WebkitMaskImage: photoShape === 'heart' ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 3 20 18.35' fill='black' preserveAspectRatio='none'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>")` : 'none',
                        maskSize: '100% 100%',
                        WebkitMaskSize: '100% 100%',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat'
                      }} // Mirroring and Filter
                    />
                    {!readonly && (
                      <button onClick={() => onDeletePhoto(photos[index].id)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors z-10"><X className="w-3 h-3" /></button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-black/5 flex items-center justify-center border-2 border-dashed border-black/10">
                    <ImageIcon className="w-6 h-6 text-black/20" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div className="text-center pb-4">
            <p ref={textRef}
              className={`font-serif italic tracking-wider ${layout.type.includes('strip') ? 'text-sm' : 'text-xl'}`}
              style={{
                color: textColor,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
              G.STUDIO
            </p>
          </div>
        </div>

        {/* Stickers Overlay */}
        {!readonly && (
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            {stickers.map(sticker => (
              <Draggable
                key={sticker.id}
                position={{ x: sticker.x, y: sticker.y }}
                onStart={(_, data) => {
                  setDragStart({ x: data.x, y: data.y });
                  setActiveStickerId(sticker.id);
                }}
                onStop={(_, data) => {
                  onUpdateSticker(sticker.id, { x: data.x, y: data.y });

                  // Jangan toggle jika user sedang klik tombol kontrol
                  if (isClickingControl) {
                    setIsClickingControl(false);
                    return;
                  }

                  // Deteksi jika tidak ada pergerakan (click/tap)
                  if (dragStart && Math.abs(data.x - dragStart.x) < 5 && Math.abs(data.y - dragStart.y) < 5) {
                    // Ini adalah click/tap, bukan drag
                    if (activeStickerId === sticker.id && showControls) {
                      setShowControls(false); // Hide controls
                      setActiveStickerId(null); // Deselect sticker (hilangkan border)
                    } else {
                      setShowControls(true); // Show controls
                    }
                  } else {
                    // Ini adalah drag, tampilkan controls
                    setShowControls(true);
                  }
                  setDragStart(null);
                }}
                bounds="parent"
              >
                <div
                  id={sticker.id}
                  className={`absolute py-0.5 px-0 border-2 ${activeStickerId === sticker.id ? 'border-blue-500 border-dashed' : 'border-transparent'} pointer-events-auto`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={sticker.src}
                    alt="sticker"
                    className="pointer-events-none"
                    width={80 * sticker.scale}
                    style={{ transform: `rotate(${sticker.rotation}deg)` }}
                  />
                  {activeStickerId === sticker.id && showControls && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg flex gap-1 p-1 z-20"
                      onMouseDown={(e) => { e.stopPropagation(); setIsClickingControl(true); }}
                      onTouchStart={(e) => { e.stopPropagation(); setIsClickingControl(true); }}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { scale: sticker.scale * 1.1 }); }}
                        className="p-1.5 hover:bg-gray-200 rounded-full touch-manipulation active:bg-gray-300"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { scale: Math.max(0.3, sticker.scale * 0.9) }); }}
                        className="p-1.5 hover:bg-gray-200 rounded-full touch-manipulation active:bg-gray-300"
                      >
                        <ZoomOut size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateSticker(sticker.id, { rotation: sticker.rotation + 15 }); }}
                        className="p-1.5 hover:bg-gray-200 rounded-full touch-manipulation active:bg-gray-300"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSticker(sticker.id); }}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 touch-manipulation active:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Draggable>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default PhotoStrip;
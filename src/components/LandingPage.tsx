import React, { useMemo, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LandingPageProps {
    onStart: () => void;
    onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
    // Local fallback logic
    const stickerModules = import.meta.glob('/public/Stickers/*.png', { eager: true });
    const localStickerNames = Object.keys(stickerModules)
        .map(path => path.split('/').pop())
        .filter((name): name is string => typeof name === 'string');

    const [stickerUrls, setStickerUrls] = useState<string[]>([]);
    const [layoutImages, setLayoutImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                // Fetch Stickers
                const { data: stickersData, error: stickersError } = await supabase
                    .from('stickers')
                    .select('url');

                if (stickersError || !stickersData || stickersData.length === 0) {
                    console.warn('LandingPage: Supabase stickers fetch error or empty, using local fallback.');
                    setStickerUrls(localStickerNames.map(name => `/Stickers/${name}`));
                } else {
                    setStickerUrls(stickersData.map((item: any) => item.url));
                }

                // Fetch Layouts
                const { data: layoutsData, error: layoutsError } = await supabase
                    .from('layouts')
                    .select('preview_image_url')
                    .order('id', { ascending: true });

                if (layoutsError || !layoutsData || layoutsData.length === 0) {
                    console.warn('LandingPage: Layouts fetch error or empty.');
                    setLayoutImages([]);
                } else {
                    setLayoutImages(layoutsData.map((item: any) => item.preview_image_url));
                }
            } catch (err) {
                console.warn('LandingPage: Fetch failed, using fallback.', err);
                setStickerUrls(localStickerNames.map(name => `/Stickers/${name}`));
            }
        };

        fetchAssets();
    }, []);

    const randomStickers = useMemo(() => {
        if (stickerUrls.length === 0) return [];

        const shuffled = [...stickerUrls].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 12); // Pick 12 random stickers

        return selected.map(stickerUrl => ({
            src: stickerUrl,
            top: Math.random() * 100,
            left: Math.random() * 100,
            rotation: Math.random() * 90 - 45,
            scale: Math.random() * 0.5 + 0.5,
        }));
    }, [stickerUrls]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F0F7FF] text-stone-800 font-sans selection:bg-blue-200">

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] md:w-[1200px] md:h-[600px] bg-blue-600/50 rounded-full blur-[100px] pointer-events-none animate-breathe" />

            {/* Random Sticker Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {randomStickers.map((sticker, index) => (
                    <img
                        key={index}
                        src={sticker.src}
                        alt="decorative sticker"
                        className="absolute opacity-40 hover:opacity-100 transition-opacity duration-500 will-change-transform"
                        style={{
                            top: `${sticker.top}%`,
                            left: `${sticker.left}%`,
                            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                            maxWidth: '150px',
                            width: '100%',
                            height: 'auto'
                        }}
                    />
                ))}
            </div>

            {/* Navbar */}
            <Navbar onNavigate={onNavigate} activePage="landing" />

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 pb-20">


                {/* Main Title Area */}
                <div className="relative mb-6">
                    <span className="absolute -left-24 top-1/2 -translate-y-1/2 text-sm font-semibold tracking-[0.2em] text-stone-1000 hidden lg:block">EST</span>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-stone-900 tracking-[-0.02em]">photobooth</h1>
                    <span className="absolute -right-24 top-1/2 -translate-y-1/2 text-sm font-semibold tracking-[0.2em] text-stone-1000 hidden lg:block">2025</span>
                </div>

                <p className="text-stone-900 max-w-md mx-auto mb-12 text-sm md:text-base font-medium leading-relaxed">
                    Capture the moment, cherish the magic,<br /> relive the love
                </p>

                <button
                    onClick={onStart}
                    className="group relative bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-10 py-4 rounded-3xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-2 text-lg overflow-hidden transition-colors"
                >
                    <span className="relative z-10">START</span>
                    <Camera className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Floating Layouts - 4 Total (2 Left, 2 Right) */}

            {/* Top Left Layout */}
            {layoutImages.length >= 1 && (
                <div className="absolute top-[25%] left-[2%] md:left-[5%] xl:left-[8%] -translate-y-1/2 -rotate-6 scale-[0.35] md:scale-75 lg:scale-90 animate-float-slow pointer-events-none hover:scale-100 transition-transform duration-500 z-0 shadow-2xl">
                    <img
                        src={layoutImages[3]}
                        alt="Layout 1"
                        className="w-auto h-[200px] md:h-[350px] object-contain rounded-sm transition-all duration-700"
                    />
                </div>
            )}

            {/* Bottom Left Layout */}
            {layoutImages.length >= 2 && (
                <div className="absolute top-[65%] left-[8%] md:left-[12%] xl:left-[15%] -translate-y-1/2 rotate-3 scale-[0.3] md:scale-[0.65] lg:scale-75 animate-float-delayed pointer-events-none hover:scale-90 transition-transform duration-500 z-0 shadow-2xl">
                    <img
                        src={layoutImages[1]}
                        alt="Layout 2"
                        className="w-auto h-[180px] md:h-[320px] object-contain rounded-sm transition-all duration-700"
                    />
                </div>
            )}

            {/* Top Right Layout */}
            {layoutImages.length >= 3 && (
                <div className="absolute top-[25%] right-[2%] md:right-[5%] xl:right-[8%] -translate-y-1/2 rotate-6 scale-[0.35] md:scale-75 lg:scale-90 animate-float-slow pointer-events-none hover:scale-100 transition-transform duration-500 z-0 shadow-2xl">
                    <img
                        src={layoutImages[2]}
                        alt="Layout 3"
                        className="w-auto h-[200px] md:h-[350px] object-contain rounded-sm transition-all duration-700"
                    />
                </div>
            )}

            {/* Bottom Right Layout */}
            {layoutImages.length >= 4 && (
                <div className="absolute top-[65%] right-[8%] md:right-[12%] xl:right-[15%] -translate-y-1/2 -rotate-3 scale-[0.3] md:scale-[0.65] lg:scale-75 animate-float-delayed pointer-events-none hover:scale-90 transition-transform duration-500 z-0 shadow-2xl">
                    <img
                        src={layoutImages[0]}
                        alt="Layout 4"
                        className="w-auto h-[180px] md:h-[320px] object-contain rounded-sm transition-all duration-700"
                    />
                </div>
            )}

            <div className="absolute bottom-4 left-0 w-full text-center text-[15px] text-stone-700/50">
                Follow me on instagram <a href="https://instagram.com/galuh.wikri" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-400 transition-colors">@galuh.wikri</a>
            </div>

        </div>
    );
};

export default LandingPage;

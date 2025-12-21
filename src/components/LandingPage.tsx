import React, { useMemo } from 'react';
import Navbar from './Navbar';
import { Camera } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
    onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
    const stickerModules = import.meta.glob('/public/stickers/*.png', { eager: true });
    const availableStickers = Object.keys(stickerModules)
        .map(path => path.split('/').pop())
        .filter((name): name is string => typeof name === 'string');

    const randomStickers = useMemo(() => {
        const shuffled = [...availableStickers].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 12); // Pick 12 random stickers
        return selected.map(sticker => ({
            src: sticker,
            top: Math.random() * 100,
            left: Math.random() * 100,
            rotation: Math.random() * 90 - 45,
            scale: Math.random() * 0.5 + 0.5,
        }));
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F0F7FF] text-stone-800 font-sans selection:bg-blue-200">

            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] md:w-[1200px] md:h-[600px] bg-blue-600/50 rounded-full blur-[100px] pointer-events-none animate-breathe" />

            {/* Random Sticker Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {randomStickers.map((sticker, index) => (
                    <img
                        key={index}
                        src={`/stickers/${sticker.src}`}
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

            {/* Floating Strips - Decorative Left */}
            <div className="absolute top-1/2 left-[2%] md:left-[5%] xl:left-[10%] -translate-y-1/2 -rotate-6 scale-[0.65] md:scale-100 animate-float-slow pointer-events-none hover:scale-105 transition-transform duration-500 z-0">
                <div className="bg-white p-2 pb-6 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] rounded-md w-[130px] space-y-2 transform perspective-1000 rotate-y-12">
                    <div className="w-full aspect-[4/3] bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm overflow-hidden border border-stone-100">
                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full aspect-[4/3] bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm overflow-hidden border border-stone-100">
                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full aspect-[4/3] bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700 rounded-sm overflow-hidden border border-stone-100">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center pt-2"><span className="font-serif text-[10px] text-stone-300 tracking-widest">G.STUDIO</span></div>
                </div>
            </div>

            {/* Floating Strips - Decorative Right */}
            <div className="absolute top-1/2 right-[2%] md:right-[5%] xl:right-[10%] -translate-y-1/2 rotate-6 scale-[0.65] md:scale-100 animate-float-delayed pointer-events-none hover:scale-105 transition-transform duration-500 z-0">
                <div className="bg-[#1a1a1a] p-2 pb-6 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2)] rounded-md w-[130px] space-y-2 transform perspective-1000 -rotate-y-12">
                    <div className="w-full aspect-[4/3] bg-stone-800 sepia opacity-90 rounded-sm overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="w-full aspect-[4/3] bg-stone-800 sepia opacity-90 rounded-sm overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="w-full aspect-[4/3] bg-stone-800 sepia opacity-90 rounded-sm overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="text-center pt-2"><span className="font-serif text-[10px] text-stone-500 tracking-widest">PHOTOBOOTH</span></div>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full text-center text-[15px] text-stone-700/50">
                Follow me on instagram <a href="https://instagram.com/galuh.wikri" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-400 transition-colors">@galuh.wikri</a>
            </div>

        </div>
    );
};

export default LandingPage;

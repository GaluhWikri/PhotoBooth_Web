import React from 'react';
import { Github } from 'lucide-react';

interface NavbarProps {
    onNavigate: (page: string) => void;
    activePage?: string;
    onHomeClick?: () => void; // Keep for backward compatibility if needed, or map to onNavigate
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePage, onHomeClick }) => {

    // Helper to handle home click compatibility
    const handleHomeClick = () => {
        if (onNavigate) onNavigate('landing');
        else if (onHomeClick) onHomeClick();
    };

    return (
        <nav className="relative z-20 pt-6 px-4 mb-8">
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-white/50 px-6 py-4 flex items-center justify-between">
                <div
                    className="text-2xl font-bold font-serif tracking-tight text-stone-900 cursor-pointer"
                    onClick={() => onNavigate('landing')}
                >
                    photobooth
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
                    <button
                        onClick={() => onNavigate('landing')}
                        className={`hover:text-stone-900 transition-colors ${activePage === 'landing' || activePage === 'home' ? 'text-blue-600 font-bold' : ''}`}
                    >
                        home
                    </button>
                    <button
                        onClick={() => onNavigate('about')}
                        className={`hover:text-stone-900 transition-colors ${activePage === 'about' ? 'text-blue-600 font-bold' : ''}`}
                    >
                        about
                    </button>
                    <button
                        onClick={() => onNavigate('privacy')}
                        className={`hover:text-stone-900 transition-colors ${activePage === 'privacy' ? 'text-blue-600 font-bold' : ''}`}
                    >
                        privacy policy
                    </button>
                    <button
                        onClick={() => onNavigate('contact')}
                        className={`hover:text-stone-900 transition-colors ${activePage === 'contact' ? 'text-blue-600 font-bold' : ''}`}
                    >
                        contact
                    </button>
                    <button
                        onClick={() => onNavigate('landing')} // Go to landing/start for layout
                        className="hover:text-stone-900 transition-colors"
                    >
                        choose layout
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <a href="https://github.com/GaluhWikri/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-700">
                        <Github className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

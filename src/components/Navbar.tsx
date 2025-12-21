import React, { useState } from 'react';
import { Github, Menu, X } from 'lucide-react';

interface NavbarProps {
    onNavigate: (page: string) => void;
    activePage?: string;
    onHomeClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activePage, onHomeClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigation = (page: string) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { id: 'landing', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'privacy', label: 'Privacy Policy' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <nav className="relative z-50 pt-6 px-4 mb-8">
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-white/50 px-6 py-4 flex items-center justify-between">
                <div
                    className="text-2xl font-bold font-serif tracking-tight text-stone-900 cursor-pointer"
                    onClick={() => handleNavigation('landing')}
                >
                    photobooth
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavigation(link.id)}
                            className={`hover:text-stone-900 transition-colors ${activePage === link.id || (link.id === 'landing' && activePage === 'home') ? 'text-blue-600 font-bold' : ''}`}
                        >
                            {link.label.toLowerCase()}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavigation('landing')}
                        className="hover:text-stone-900 transition-colors"
                    >
                        choose layout
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <a href="https://github.com/GaluhWikri/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-700 hidden sm:block">
                        <Github className="w-5 h-5" />
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full px-4 mt-2 md:hidden animate-fade-in-up origin-top">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-4 flex flex-col gap-2 overflow-hidden">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleNavigation(link.id)}
                                className={`p-4 rounded-2xl text-left font-medium transition-all ${activePage === link.id || (link.id === 'landing' && activePage === 'home')
                                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                                    : 'hover:bg-stone-50 text-stone-600'
                                    }`}
                            >
                                {link.label}
                            </button>
                        ))}
                        <button
                            onClick={() => handleNavigation('landing')}
                            className="p-4 rounded-2xl text-left font-medium hover:bg-stone-50 text-stone-600 transition-all border-t border-stone-100 mt-2"
                        >
                            Choose Layout
                        </button>
                        <a
                            href="https://github.com/GaluhWikri/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-2xl text-left font-medium hover:bg-stone-50 text-stone-600 transition-all flex items-center gap-2"
                        >
                            <Github className="w-5 h-5" /> Visit Github
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

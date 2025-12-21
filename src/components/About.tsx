import React from 'react';
import Navbar from './Navbar';
import { Camera, Heart, Users, Zap } from 'lucide-react';

interface AboutProps {
    onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#F0F7FF] pb-20">
            <Navbar onNavigate={onNavigate} activePage="about" />

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">Capturing Moments, Creating Memories</h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Photobooth is a modern web experience designed to bring the fun of classic photo booths directly to your browser. No downloads, no fuss—just pure creativity.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-50 text-center">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Instant Capture</h3>
                        <p className="text-stone-500">High-quality captures straight from your webcam with zero latency.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-50 text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">So Many Filters</h3>
                        <p className="text-stone-500">Choose from over 14+ custom filters to find your perfect vibe.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-50 text-center">
                        <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">Share the Love</h3>
                        <p className="text-stone-500">Download your strips instantly and share them with the world.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-stone-100 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 z-10"></div>
                    <img src="https://images.unsplash.com/photo-1520607162513-77705e685728?auto=format&fit=crop&q=80&w=1920" alt="Team" className="w-full h-96 object-cover" />

                    <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center text-center px-6">
                        <h2 className="text-3xl font-bold text-white mb-4">Built with ❤️ by Galuh Wikri</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-lg">
                            This project explores the intersection of modern web capabilities and nostalgic user experiences.
                        </p>
                        <a href="https://github.com/GaluhWikri" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            Visit GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

import React from 'react';
import Navbar from './Navbar';
import { Camera, Heart, Shield, Users } from 'lucide-react';

interface AboutProps {
    onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#F0F7FF] pb-20">
            <Navbar onNavigate={onNavigate} activePage="about" />

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">About PhotoBooth</h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Capturing moments, creating memories. We bring the fun of traditional photobooths to the digital world.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Camera, title: 'High Quality', desc: 'Crystal clear photo capture' },
                        { icon: Users, title: 'Shareable', desc: 'Easy sharing with friends' },
                        { icon: Heart, title: 'Made with Love', desc: 'Crafted for best experience' },
                        { icon: Shield, title: 'Privacy First', desc: 'Your photos stay locally' },
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-all text-center group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-stone-800 mb-2">{feature.title}</h3>
                            <p className="text-stone-500 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-stone-900">Our Story</h2>
                        <div className="space-y-4 text-stone-600 leading-relaxed">
                            <p>
                                Started as a passion project, PhotoBooth was created to bridge the gap between physical memory-making and digital convenience. We wanted to recreate that feeling of squeezing into a booth with friends, making silly faces, and waiting for the strip to print.
                            </p>
                            <p>
                                Our application provides a seamless, browser-based photobooth experience without the need for expensive equipment or software installation. Just allow camera access, and you're ready to snap!
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-pink-200 rounded-[2.5rem] rotate-3 blur-lg opacity-60"></div>
                        <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                            <div className="aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden mb-6 relative group">
                                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                    <Camera className="w-16 h-16 opacity-50" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-4 w-1/3 bg-stone-100 rounded-full"></div>
                                <div className="h-4 w-1/3 bg-stone-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

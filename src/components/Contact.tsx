import React from 'react';
import Navbar from './Navbar';
import { Mail, MapPin, Send, Instagram } from 'lucide-react';

interface ContactProps {
    onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#F0F7FF] pb-20">
            <Navbar onNavigate={onNavigate} activePage="contact" />

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Get in Touch</h1>
                    <p className="text-stone-600">Have questions or suggestions? We'd love to hear from you.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Mail className="w-6 h-6 opacity-70" />
                                        <span>galuhwikri05@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Instagram className="w-6 h-6 opacity-70" />
                                        <a href="https://instagram.com/galuh.wikri" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white transition-colors">@galuh.wikri</a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <MapPin className="w-6 h-6 opacity-70" />
                                        <span>Bandung, Indonesia</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
                            <h3 className="text-lg font-bold text-stone-800 mb-4">Check out our Github</h3>
                            <p className="text-stone-500 mb-4 text-sm">See how this project was built and contribute to the code.</p>
                            <a href="https://github.com/GaluhWikri" target="_blank" className="text-blue-600 font-semibold hover:underline">Visit Github Profile &rarr;</a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Galuh" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Wikri" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="galuhwikri05@gmail.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" placeholder="Write your message here..." />
                            </div>
                            <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

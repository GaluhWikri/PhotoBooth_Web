import React, { useState } from 'react';
import Navbar from './Navbar';
import { Camera, Heart, Shield, Users, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface AboutProps {
    onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Is PhotoBooth free to use?",
            answer: "Yes! PhotoBooth is completely free. You can take as many photos as you like and download them without any cost."
        },
        {
            question: "Do you store my photos?",
            answer: "No, we prioritize your privacy. All processing is done locally on your device in your browser. We do not store, access, or upload your photos to any external servers."
        },
        {
            question: "Can I use PhotoBooth on my mobile phone?",
            answer: "Absolutely! The PhotoBooth web application is fully responsive and works great on smartphones and tablets, allowing you to snap photos on the go."
        },
        {
            question: "My camera isn't working. What should I do?",
            answer: "Please ensure you have allowed camera permissions in your browser settings. If denied previously, you may need to reset permissions for this site and reload the page."
        },
        {
            question: "Can I customize the photo strip?",
            answer: "Yes! You can choose from various background colors, textures, and add fun stickers to personalize your photo strip before downloading."
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

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
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
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
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-blue-200 rounded-[2.5rem] rotate-3 blur-lg opacity-60"></div>
                        <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
                            <div className="aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden mb-6 relative group flex items-center justify-center">
                                <img
                                    src="/image/icons8-web-camera-100.png"
                                    alt="PhotoBooth Camera"
                                    className="w-1/2 h-1/2 object-contain opacity-90"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="h-4 w-1/3 bg-stone-100 rounded-full"></div>
                                <div className="h-4 w-1/3 bg-stone-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Frequently Asked Questions</h2>
                        <p className="text-stone-500">Everything you need to know about PhotoBooth.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="font-semibold text-stone-800 text-lg">{faq.question}</span>
                                    {openFaqIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-stone-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-stone-400" />
                                    )}
                                </button>
                                <div
                                    className={`px-6 text-stone-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

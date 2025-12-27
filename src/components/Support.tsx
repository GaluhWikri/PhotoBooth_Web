import React, { useState } from 'react';
import Navbar from './Navbar';
import { Heart, Copy, CheckCircle2 } from 'lucide-react';

interface SupportProps {
    onNavigate: (page: string) => void;
}

const Support: React.FC<SupportProps> = ({ onNavigate }) => {
    const [copied, setCopied] = useState(false);

    const accountNumber = "";
    const accountName = "Galuh Wikri Ramadhan";
    const bankName = "Bank Negara Indonesia (BNI)";
    const bankLogoUrl = "https://image.cermati.com/c_fit,h_240,w_360/j4raialhhlftqq5c1uz0.webpdd";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <Navbar onNavigate={onNavigate} activePage="support" />

            <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mb-6 shadow-xl animate-heartbeat">
                        <Heart className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h1 className="text-5xl font-bold font-serif text-stone-800 mb-4">
                        Support the Creator
                    </h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        If you enjoy this PhotoBooth app and would like to support further development, you can donate via the account below. ❤️
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
                    {/* Bank Card Design */}
                    <div className="relative mb-8">
                        <div className="bg-gradient-to-br from-[#EF5A22] via-[#d94d1a] to-[#c34416] rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                            {/* Card Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                            <div className="relative z-10">
                                {/* Bank Logo */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-white px-3 py-2 rounded-lg">
                                        <img
                                            src={bankLogoUrl}
                                            alt="BNI Logo"
                                            className="h-8 w-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-lg font-bold tracking-wide">
                                            BANK NEGARA INDONESIA
                                        </p>
                                    </div>
                                </div>

                                {/* Account Number */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/70 text-sm font-medium tracking-wide">Account Number</span>
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 group"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                                                    <span className="text-green-300 text-xs font-semibold">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                                                    <span className="text-white text-xs font-semibold">Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-white text-3xl md:text-4xl font-bold tracking-wider font-mono">
                                        {accountNumber}
                                    </p>
                                </div>

                                {/* Account Name */}
                                <div>
                                    <p className="text-white/70 text-sm font-medium tracking-wide mb-1">Account Name</p>
                                    <p className="text-white text-xl font-semibold tracking-wide">
                                        a.n {accountName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center p-2">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/924/924514.png"
                                        alt="Coffee"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-stone-800 mb-2">Thank you so much!</h4>
                                <p className="text-stone-600 leading-relaxed">
                                    If you liked this project and want to show support, you can treat me to a cup of coffee.
                                    It’s great fuel to keep me energized and building more useful projects!☕✨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Details Summary */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                    <h3 className="text-lg font-bold text-stone-800 mb-4 text-center">Informasi Transfer</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-100">
                            <p className="text-xs text-stone-500 mb-1 font-medium">Bank</p>
                            <p className="text-sm font-bold text-stone-800">{bankName}</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-100">
                            <p className="text-xs text-stone-500 mb-1 font-medium">Nomor Rekening</p>
                            <p className="text-sm font-bold text-stone-800 font-mono">{accountNumber}</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-stone-100">
                            <p className="text-xs text-stone-500 mb-1 font-medium">Atas Nama</p>
                            <p className="text-sm font-bold text-stone-800">{accountName}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="text-center mt-12 animate-in fade-in duration-700 delay-500">
                    <p className="text-stone-500 text-sm">
                        Made with <Heart className="w-4 h-4 inline text-red-500 fill-red-500 animate-heartbeat" /> by {accountName}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Support;

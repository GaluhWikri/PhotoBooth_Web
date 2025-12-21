import React from 'react';
import Navbar from './Navbar';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
    onNavigate: (page: string) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#F0F7FF] pb-20">
            <Navbar onNavigate={onNavigate} activePage="privacy" />

            <div className="max-w-3xl mx-auto px-6 mt-12">
                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
                    <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-600" />
                        Privacy Policy
                    </h1>

                    <div className="space-y-8 text-stone-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-stone-400" /> Data Processing
                            </h2>
                            <p>
                                Your photos are processed <strong>entirely locally</strong> on your device. We do not upload, store, or analyze your personal images on any server. When you use the "Live Camera", the feed comes directly from your browser's local stream API.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-stone-400" /> Camera Access
                            </h2>
                            <p>
                                This application requires access to your camera to function. Permission is requested only when you actively click "Start Camera". You can revoke this permission at any time through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-stone-400" /> Changes
                            </h2>
                            <p>
                                We may update this policy from time to time. Since this is a client-side web application, updates will be reflected immediately upon your next visit.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-stone-100 text-sm text-stone-400">
                            Last updated: December 2025
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

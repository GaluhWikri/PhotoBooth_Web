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

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">Privacy Policy</h1>
                    <p className="text-stone-600">Last updated: December 2023</p>
                </div>

                <div className="space-y-8">
                    {/* Policy Sections */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-800 mb-2">Data Collection</h2>
                                <p className="text-stone-600 leading-relaxed">
                                    We take your privacy seriously. This application is designed to function primarily client-side. We do not store your photos on our servers without your explicit permission. All image processing happens directly in your browser.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-800 mb-2">Camera Access</h2>
                                <p className="text-stone-600 leading-relaxed">
                                    To use the PhotoBooth features, we require access to your device's camera. This access is only used to display the live feed and capture photos at your request. We do not record or transmit video data in the background.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-800 mb-2">Local Storage</h2>
                                <p className="text-stone-600 leading-relaxed">
                                    We may use your browser's local storage to save your preferences (such as theme choice) or temporary photo data to prevent data loss upon refresh. You can clear this data at any time via your browser settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-800 mb-2">Changes to This Policy</h2>
                                <p className="text-stone-600 leading-relaxed">
                                    We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

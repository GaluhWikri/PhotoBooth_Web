import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import { supabase } from '../lib/supabaseClient';

export type LayoutType = 'strip-2' | 'strip-4' | 'grid-4' | 'grid-6';

export interface LayoutConfig {
    id: string;
    type: LayoutType;
    title: string;
    description: string;
    photoCount: number;
    aspectRatio: number; // width / height
    cssClass: string; // for preview styling
    previewImage: string;
}

export const DEFAULT_LAYOUTS: LayoutConfig[] = [
    {
        id: 'strip-4',
        type: 'strip-4',
        title: 'The Signature',
        description: 'Size 2 x 6 Strip (4 Pose)',
        photoCount: 4,
        aspectRatio: 1 / 3, // 2x6
        cssClass: 'strip-4',
        previewImage: '/LayoutType/type 1.png'
    },
    {
        id: 'strip-2',
        type: 'strip-2',
        title: 'Portrait Mode',
        description: 'Size 6 x 2 Strip (2 Pose)',
        photoCount: 2,
        aspectRatio: 1 / 3, // 2x6
        cssClass: 'strip-2',
        previewImage: '/LayoutType/type 2.png'
    },
    {
        id: 'grid-6',
        type: 'grid-6',
        title: 'Mix & Match',
        description: 'Size 6 x 4 Strip (6 Pose)',
        photoCount: 6,
        aspectRatio: 2 / 3, // 4x6
        cssClass: 'grid-6',
        previewImage: '/LayoutType/type 3.png'
    },
    {
        id: 'grid-4',
        type: 'grid-4',
        title: 'Quad Grid',
        description: 'Size 6 x 4 Strip (4 Pose)',
        photoCount: 4,
        aspectRatio: 2 / 3, // 4x6
        cssClass: 'grid-4',
        previewImage: '/LayoutType/type 4.png'
    },
];

interface ChooseLayoutProps {
    onSelect: (layout: LayoutConfig) => void;
    onNavigate: (page: string) => void;
}


const ChooseLayout: React.FC<ChooseLayoutProps> = ({ onSelect, onNavigate }) => {
    const [layouts, setLayouts] = useState<LayoutConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                // Check if Supabase is configured
                const { data, error } = await supabase
                    .from('layouts')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) {
                    console.error('Supabase fetch error:', error.message);
                } else if (data && data.length > 0) {
                    console.log('✅ Loaded layouts from Supabase:', data.length);
                    const mappedLayouts: LayoutConfig[] = data.map((item: any) => ({
                        id: item.id,
                        type: item.type as LayoutType,
                        title: item.title,
                        description: item.description,
                        photoCount: item.photo_count,
                        aspectRatio: item.aspect_ratio,
                        cssClass: item.css_class,
                        previewImage: item.preview_image_url
                    }));
                    setLayouts(mappedLayouts);
                } else {
                    console.warn('⚠️ Layouts table is empty.');
                }
            } catch (err) {
                console.error('Error connecting to Supabase:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLayouts();
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
            <Navbar onNavigate={onNavigate} />

            <div className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">Choose Your Layout</h1>
                    <p className="text-stone-500 text-lg italic">Select from our collection of photo booth layouts</p>
                </div>

                {isLoading && layouts === DEFAULT_LAYOUTS ? (
                    <div className="flex justify-center my-10">
                        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {layouts.map((layout) => (
                            <button
                                key={layout.id}
                                onClick={() => onSelect(layout)}
                                className="group flex flex-col items-center gap-6 transition-all hover:scale-105 hover:rotate-1 duration-300"
                            >
                                <div
                                    className="relative transition-all bg-stone-100 shadow-inner border-4 border-white box-content"
                                >
                                    <img
                                        src={layout.previewImage}
                                        alt={layout.title}
                                        className="w-full h-full object-contain"
                                        style={{
                                            height: '320px',
                                            width: 'auto'
                                        }}
                                    // Add fallback specifically for image load error? 
                                    // Keeping simple for now.
                                    />
                                    {(layout.type === 'strip-4' || layout.type === 'grid-6') && (
                                        <div className="absolute top-1 right-[-20px] rotate-6 bg-blue-500 text-white text-[10px] font-bold px-6 py-1 shadow-md z-10 rounded-2xl">
                                            POPULAR
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-stone-800 mb-1">{layout.title}</h3>
                                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">{layout.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-800 hover:border-stone-800 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseLayout;

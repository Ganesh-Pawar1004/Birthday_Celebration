import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { CakeDisplay } from '../components/CakeDisplay';
import { FloatingEmojis } from '../components/FloatingEmojis';
import type { Celebration } from '../types';

export function Cake() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [celebration, setCelebration] = useState<Celebration | null>(null);

    useEffect(() => {
        if (id) {
            db.get(id).then(setCelebration);
        }
    }, [id]);

    if (!celebration) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center overflow-hidden relative">
            {/* Background decorations */}
            <FloatingEmojis />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none"></div>

            <div className="z-10 w-full max-w-4xl flex flex-col items-center p-4">
                <h1 className="text-4xl md:text-6xl font-handwriting text-yellow-300 mb-12 text-center drop-shadow-[0_0_10px_rgba(253,224,71,0.5)] animate-pulse">
                    Happy Birthday!
                </h1>

                <CakeDisplay
                    flavor={celebration.flavor}
                    recipientName={celebration.recipientName}
                    onComplete={() => navigate(`/celebration/${id}`)}
                />
            </div>
        </div>
    );
}

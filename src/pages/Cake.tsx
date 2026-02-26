import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/db';
import { CakeDisplay } from '../components/CakeDisplay';
import { FloatingEmojis } from '../components/FloatingEmojis';
import { ImageCarousel } from '../components/ImageCarousel';
import type { Celebration } from '../types';

export function Cake() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [celebration, setCelebration] = useState<Celebration | null>(location.state?.celebration || null);

    useEffect(() => {
        if (id && !celebration) {
            db.get(id).then(setCelebration);
        }
    }, [id, celebration]);

    if (!celebration) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const isBabyShower = celebration.eventType === 'baby-shower';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center overflow-hidden relative">
            {/* Background decorations */}
            <FloatingEmojis />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none"></div>

            {/* Display uploaded images as floating polaroids */}
            {celebration.images && celebration.images.length > 0 && (
                <ImageCarousel images={celebration.images} />
            )}

            <div className="z-10 w-full max-w-4xl flex flex-col items-center p-4">
                <h1 className={`text-3xl md:text-5xl font-bold mb-6 text-center animate-pulse ${isBabyShower ? 'text-teal-300 drop-shadow-[0_0_10px_rgba(94,234,212,0.5)]' : 'font-handwriting text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]'}`}>
                    {isBabyShower ? "🎂 A Sweet Celebration for a Sweet Journey" : "Happy Birthday!"}
                </h1>

                {isBabyShower && (
                    <p className="text-sm md:text-xl text-teal-100 mb-4 md:mb-6 text-center max-w-2xl px-4 italic">
                        Let’s pause, smile, and celebrate this beautiful milestone together 🎉 <br />
                        A new chapter begins, filled with love, joy, and tiny little moments.
                    </p>
                )}

                <CakeDisplay
                    eventType={celebration.eventType}
                    flavor={celebration.flavor}
                    recipientName={celebration.recipientName}
                    onComplete={() => navigate(`/celebration/${id}`, { state: { celebration } })}
                />
            </div>
        </div>
    );
}

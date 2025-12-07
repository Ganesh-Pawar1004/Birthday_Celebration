import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import confetti from 'canvas-confetti';
import { Share2, Music, Volume2, VolumeX, Home, MessageCircleHeart } from 'lucide-react';
import { WishesWall } from '../components/WishesWall';
import type { Celebration } from '../types';

export function Celebration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [celebration, setCelebration] = useState<Celebration | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (id) {
            db.get(id).then(setCelebration);
        }
    }, [id]);

    useEffect(() => {
        if (celebration) {
            // Trigger confetti on load
            const duration = 15 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [celebration]);

    const handleShare = () => {
        const url = window.location.href.replace('/celebration/', '/intro/');
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share it with the birthday person!');
    };

    const handleShareWishLink = () => {
        const url = window.location.href.replace('/celebration/', '/wish/');
        navigator.clipboard.writeText(url);
        alert('Wish Link copied! Send this to friends to leave a message!');
    };

    if (!celebration) return <div>Celebration not found</div>;

    return (
        <div className="min-h-screen party-bg flex flex-col items-center justify-start text-white overflow-y-auto relative p-4">
            {/* Overlay for readability */}
            <div className="fixed inset-0 bg-black/30 pointer-events-none"></div>

            <div className="z-30 text-center max-w-2xl w-full mt-12">
                <h1 className="text-6xl md:text-8xl font-handwriting mb-8 animate-bounce drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                    PARTY TIME!
                </h1>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-3xl font-bold mb-4 text-yellow-300">For {celebration.recipientName}</h2>
                    <p className="text-xl md:text-2xl italic leading-relaxed">"{celebration.message}"</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-full font-bold hover:bg-green-600 transition-colors shadow-lg"
                    >
                        <Share2 size={20} />
                        Share Celebration
                    </button>

                    <button
                        onClick={handleShareWishLink}
                        className="flex items-center gap-2 px-6 py-3 bg-pink-500 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg"
                    >
                        <MessageCircleHeart size={20} />
                        Share Wish Link
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-colors shadow-lg backdrop-blur-sm"
                    >
                        <Home size={20} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Wishes Wall */}
            <div className="z-30 w-full mb-24">
                {id && <WishesWall celebrationId={id} />}
            </div>

            {/* Audio Controls (Mock) */}
            <div className="fixed bottom-8 right-8 flex gap-2 z-50">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md"
                >
                    <Music size={24} className={isPlaying ? "animate-spin" : ""} />
                </button>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md"
                >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
            </div>
        </div>
    );
}

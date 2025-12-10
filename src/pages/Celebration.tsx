import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/db';
import confetti from 'canvas-confetti';
import { Music, Volume2, VolumeX, Home } from 'lucide-react';
import { WishesWall } from '../components/WishesWall';
import { Howl } from 'howler';
import type { Celebration } from '../types';

export function Celebration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [celebration, setCelebration] = useState<Celebration | null>(location.state?.celebration || null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const soundRef = useRef<Howl | null>(null);

    useEffect(() => {
        if (id && !celebration) {
            db.get(id).then(setCelebration);
        }
    }, [id, celebration]);

    useEffect(() => {
        // Initialize sound
        soundRef.current = new Howl({
            src: ['/happy-birthday.mp3'],
            html5: true, // Force HTML5 Audio for streaming large files
            loop: true,
            volume: 0.5,
            autoplay: true,
            onloaderror: (_id, err) => console.error('Audio Load Error:', err),
            onplayerror: (_id, err) => {
                console.error('Audio Play Error:', err);
                setIsPlaying(false);
                soundRef.current?.once('unlock', () => {
                    soundRef.current?.play();
                    setIsPlaying(true);
                });
            }
        });

        return () => {
            soundRef.current?.unload();
        };
    }, []);

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

    const togglePlay = () => {
        if (!soundRef.current) return;

        if (isPlaying) {
            soundRef.current.pause();
        } else {
            soundRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!soundRef.current) return;

        soundRef.current.mute(!isMuted);
        setIsMuted(!isMuted);
    };

    if (!celebration) {
        return (
            <div className="min-h-screen party-bg flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen party-bg flex flex-col items-center justify-start text-white overflow-y-auto relative p-4">
            {/* Overlay for readability */}
            <div className="fixed inset-0 bg-black/30 pointer-events-none"></div>

            {/* Home Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors shadow-lg"
                title="Create New Celebration"
            >
                <Home size={24} />
            </button>

            <div className="z-30 text-center max-w-2xl w-full mt-12">
                <h1 className="text-6xl md:text-8xl font-handwriting mb-8 animate-bounce drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                    PARTY TIME!
                </h1>

                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-3xl font-bold mb-4 text-yellow-300">For {celebration.recipientName}</h2>
                    <p className="text-xl md:text-2xl italic leading-relaxed">"{celebration.message}"</p>
                </div>
            </div>

            {/* Wishes Display */}
            <div className="z-30 w-full mb-24">
                {id && <WishesWall celebrationId={id} />}
            </div>

            {/* Controls */}
            <div className="fixed bottom-8 right-8 flex gap-2 z-50">
                <button
                    onClick={togglePlay}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                    title={isPlaying ? "Pause Music" : "Play Music"}
                >
                    <Music size={24} className={isPlaying ? "animate-spin text-green-400" : "text-white"} />
                </button>
                <button
                    onClick={toggleMute}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={24} className="text-red-400" /> : <Volume2 size={24} className="text-white" />}
                </button>
            </div>
        </div>
    );
}

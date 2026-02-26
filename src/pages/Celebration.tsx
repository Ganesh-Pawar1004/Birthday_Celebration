import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../lib/db';
import confetti from 'canvas-confetti';
import { Music, Volume2, VolumeX, Home } from 'lucide-react';
import { WishesWall } from '../components/WishesWall';
import { ImageCarousel } from '../components/ImageCarousel';
import { Helmet } from 'react-helmet-async';
import { PartyLoader } from '../components/PartyLoader';
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
        const isBabyShower = celebration?.eventType === 'baby-shower';
        const audioSrc = isBabyShower ? '/lullaby.mp3' : '/happy-birthday.mp3';

        soundRef.current = new Howl({
            src: [audioSrc],
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
        return <PartyLoader />;
    }

    const isBabyShower = celebration.eventType === 'baby-shower';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-start text-white overflow-y-auto relative p-4 ${isBabyShower ? 'baby-shower-bg' : 'party-bg'}`}>
            {celebration && (
                <Helmet>
                    <title>{isBabyShower ? `Baby Shower for ${celebration.recipientName}!` : `Happy Birthday ${celebration.recipientName}! 🎈`}</title>
                    <meta name="description" content={`Join the celebration for ${celebration.recipientName}! ${celebration.message}`} />

                    {/* Dynamic Social Share Tags */}
                    <meta property="og:title" content={isBabyShower ? `Virtual Baby Shower: Parents-To-Be ${celebration.recipientName} 🍼` : `Happy Birthday ${celebration.recipientName}! 🎂`} />
                    <meta property="og:description" content={`Someone sent specific wishes for ${celebration.recipientName}. Click to join the party, see the cake, and leave a wish!`} />
                    <meta property="og:image" content={isBabyShower ? "https://birthday-celebration-app.netlify.app/og-babyshower.jpg" : "https://birthday-celebration-app.netlify.app/og-celebration.jpg"} />

                    <meta name="twitter:title" content={isBabyShower ? `Virtual Baby Shower: ${celebration.recipientName} 🍼` : `Happy Birthday ${celebration.recipientName}! 🎂`} />
                    <meta name="twitter:description" content={`Join the virtual party for ${celebration.recipientName}.`} />
                </Helmet>
            )}
            {/* Overlay for readability */}
            <div className="fixed inset-0 bg-black/30 pointer-events-none"></div>

            {/* Home Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="fixed top-4 left-4 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors shadow-lg"
                title="Create New Celebration"
            >
                <Home size={24} />
            </motion.button>

            {/* Display uploaded images as floating polaroids */}
            {celebration.images && celebration.images.length > 0 && (
                <ImageCarousel images={celebration.images} />
            )}

            <div className="z-30 text-center max-w-2xl w-full mt-32">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-bounce drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] ${isBabyShower ? 'text-teal-200' : 'font-handwriting text-5xl md:text-8xl'}`}>
                    {isBabyShower ? "🌟 We'll Miss You, But We're So Happy for You!" : "PARTY TIME!"}
                </h1>

                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isBabyShower ? 'text-indigo-200' : 'text-yellow-300'}`}>
                        {isBabyShower ? `Sending love and wishes to ${celebration.recipientName}` : `For ${celebration.recipientName}`}
                    </h2>
                    <p className={`text-xl md:text-2xl italic leading-relaxed ${isBabyShower ? 'mb-6' : ''}`}>"{celebration.message}"</p>

                    {isBabyShower && (
                        <p className="text-lg md:text-xl text-teal-50 leading-relaxed font-medium">
                            Your presence has brought so much positivity, energy, and warmth to our team 💼💖<br />
                            As you step away for this wonderful journey, know that you carry our best wishes, support, and happiness with you.<br />
                            We can’t wait to hear beautiful stories when you return 👶✨
                        </p>
                    )}
                </div>
            </div>

            {/* Wishes Display */}
            <div className="z-30 w-full mb-12">
                {id && <WishesWall celebrationId={id} eventType={celebration.eventType} />}
            </div>

            {/* Closing Message for Baby Shower */}
            {isBabyShower && (
                <div className="z-30 text-center max-w-2xl w-full mb-32 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-pink-200">
                        💫 A New Chapter Begins…
                    </h2>
                    <p className="text-lg md:text-xl text-white mb-6">
                        May your days be filled with laughter, tiny giggles, and unconditional love 💖<br />
                        Wishing you both a safe, healthy, and joyful journey into parenthood.
                    </p>
                    <p className="text-2xl font-handwriting text-teal-200">
                        ✨ With lots of love from your team ✨
                    </p>
                </div>
            )}

            {/* Controls */}
            <div className="fixed bottom-8 right-8 flex gap-2 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors shadow-lg"
                    title={isPlaying ? "Pause Music" : "Play Music"}
                >
                    <Music size={24} className={isPlaying ? "animate-spin text-green-400" : "text-white"} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors shadow-lg"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={24} className="text-red-400" /> : <Volume2 size={24} className="text-white" />}
                </motion.button>
            </div>
        </div>
    );
}

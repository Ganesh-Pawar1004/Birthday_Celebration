import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { motion } from 'framer-motion';
import { FloatingEmojis } from '../components/FloatingEmojis';
import { ArrowRight, Share2, MessageCircleHeart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PartyLoader } from '../components/PartyLoader';
import type { Celebration } from '../types';

export function Intro() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [celebration, setCelebration] = useState<Celebration | null>(null);

    useEffect(() => {
        if (id) {
            db.get(id).then(setCelebration);
        }
    }, [id]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share it with the birthday person!');
    };

    const handleShareWishLink = () => {
        const url = window.location.href.replace('/intro/', '/wish/');
        navigator.clipboard.writeText(url);
        alert('Wish Link copied! Send this to friends to leave a message!');
    };

    if (!celebration) {
        return <PartyLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center overflow-hidden relative p-4">
            {celebration && (
                <Helmet>
                    <title>A special surprise for {celebration.recipientName}!</title>
                </Helmet>
            )}
            <FloatingEmojis />

            {/* Floating Name Animation */}
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
                className="z-10 text-center"
            >
                <h2 className="text-4xl md:text-5xl text-white font-bold mb-4 drop-shadow-lg">
                    Happy Birthday
                </h2>
                <motion.h1
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-6xl md:text-9xl font-handwriting text-yellow-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
                >
                    {celebration.recipientName}
                </motion.h1>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/cake/${id}`, { state: { celebration } })}
                className="mt-16 z-10 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-xl shadow-2xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
                Let's Cut the Cake! <ArrowRight />
            </motion.button>

            {/* Share Buttons */}
            <div className="absolute bottom-8 left-8 z-20 flex flex-col gap-4">
                <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors text-sm font-medium shadow-lg"
                >
                    <Share2 size={16} />
                    Share Celebration
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareWishLink}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-sm transition-colors text-sm font-medium shadow-lg"
                >
                    <MessageCircleHeart size={16} />
                    Share Wish Link
                </motion.button>
            </div>
        </div>
    );
}

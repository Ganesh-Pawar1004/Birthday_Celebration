import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';
import type { Wish } from '../types';

interface FloatingWishesProps {
    celebrationId: string;
}

export function FloatingWishes({ celebrationId }: FloatingWishesProps) {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [visibleWishes, setVisibleWishes] = useState<{ wish: Wish; uniqueId: string }[]>([]);

    // Poll for new wishes
    useEffect(() => {
        const loadWishes = async () => {
            const allWishes = await db.getWishes(celebrationId);
            setWishes(allWishes);
        };

        loadWishes();
        const interval = setInterval(loadWishes, 2000);
        return () => clearInterval(interval);
    }, [celebrationId]);

    // Stagger showing wishes
    useEffect(() => {
        if (wishes.length === 0) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            setVisibleWishes(prev => {
                // Create a unique ID for this specific instance of the wish
                const newWishItem = {
                    wish: wishes[currentIndex],
                    uniqueId: `${wishes[currentIndex].id}-${Date.now()}`
                };

                // Keep only last 8 to avoid clutter, but allow them to finish animation
                const next = [...prev, newWishItem];
                if (next.length > 8) next.shift();
                return next;
            });

            currentIndex = (currentIndex + 1) % wishes.length; // Loop through wishes
        }, 2000); // Add a new wish every 2 seconds

        return () => clearInterval(interval);
    }, [wishes]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <AnimatePresence>
                {visibleWishes.map((item) => (
                    <motion.div
                        key={item.uniqueId} // Stable key for this instance
                        // Start from bottom, random horizontal position (10% to 90%)
                        initial={{ y: '100vh', x: Math.random() * 80 + 10 + '%', opacity: 0, scale: 0.5 }}
                        animate={{
                            y: '-20vh', // Float up off screen
                            opacity: [0, 1, 1, 0], // Fade in, stay visible, fade out
                            scale: 1
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 8, // Slightly faster for better flow
                            ease: "linear"
                        }}
                        className="absolute bottom-0 left-0 w-full flex justify-start" // Container to allow x-positioning
                        style={{ width: '100px' }} // Dummy width, actual position handled by motion
                    >
                        {/* Bubble Content */}
                        <div className="relative -ml-[50%] bg-white/95 backdrop-blur-md p-6 rounded-full shadow-2xl border-2 border-pink-300 text-center min-w-[250px] max-w-sm">
                            <p className="text-gray-900 font-handwriting text-xl mb-2 leading-tight">"{item.wish.message}"</p>
                            <p className="text-pink-600 font-bold text-lg">- {item.wish.name}</p>

                            {/* Little triangle for speech bubble look (optional, maybe just round is better for floating) */}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

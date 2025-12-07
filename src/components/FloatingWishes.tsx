import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/db';
import type { Wish } from '../types';

interface FloatingWishesProps {
    celebrationId: string;
}

export function FloatingWishes({ celebrationId }: FloatingWishesProps) {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [visibleWishes, setVisibleWishes] = useState<Wish[]>([]);

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
            if (currentIndex < wishes.length) {
                setVisibleWishes(prev => {
                    // Keep only last 5 to avoid clutter
                    const next = [...prev, wishes[currentIndex]];
                    if (next.length > 5) next.shift();
                    return next;
                });
                currentIndex = (currentIndex + 1) % wishes.length; // Loop through wishes
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [wishes]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <AnimatePresence>
                {visibleWishes.map((wish) => (
                    <motion.div
                        key={`${wish.id}-${Date.now()}`} // Unique key for re-renders
                        initial={{ y: '100vh', x: Math.random() * 80 + 10 + '%', opacity: 0, scale: 0.5 }}
                        animate={{
                            y: '-20vh',
                            opacity: [0, 1, 1, 0],
                            scale: 1
                        }}
                        transition={{
                            duration: 10,
                            ease: "linear"
                        }}
                        className="absolute bottom-0 max-w-xs"
                    >
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-pink-200 text-center transform -translate-x-1/2">
                            <p className="text-gray-800 font-medium mb-1">"{wish.message}"</p>
                            <p className="text-pink-600 text-sm font-bold">- {wish.name}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

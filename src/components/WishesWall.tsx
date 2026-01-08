import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/db';
import type { Wish } from '../types';

interface WishesWallProps {
    celebrationId: string;
}

const STICKY_COLORS = [
    'bg-yellow-200',
    'bg-pink-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-orange-200'
];

export function WishesWall({ celebrationId }: WishesWallProps) {
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        const loadWishes = async () => {
            const allWishes = await db.getWishes(celebrationId);
            setWishes(allWishes);
        };

        loadWishes();
        const interval = setInterval(loadWishes, 2000);
        return () => clearInterval(interval);
    }, [celebrationId]);

    if (wishes.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mx-auto mt-12 p-4">
            <h2 className="text-4xl font-handwriting text-white text-center mb-8 drop-shadow-md">Birthday Wishes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishes.map((wish, index) => {
                    const rotation = Math.random() * 6 - 3; // Random rotation between -3 and 3 deg
                    const color = STICKY_COLORS[index % STICKY_COLORS.length];

                    return (
                        <motion.div
                            key={wish.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                            className={`${color} p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.2)] transform hover:scale-110 hover:shadow-[10px_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 relative`}
                            style={{
                                rotate: `${rotation}deg`,
                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 95% 100%, 0% 100%)'
                            }}
                        >
                            {/* Tape effect */}
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-white/40 rotate-1 shadow-sm backdrop-blur-[1px]"></div>

                            <p className="font-handwriting text-xl text-gray-800 mb-4 leading-relaxed tracking-wide">
                                "{wish.message}"
                            </p>
                            <p className="text-right font-bold text-gray-700 text-sm font-sans tracking-wider opacity-80">
                                - {wish.name}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

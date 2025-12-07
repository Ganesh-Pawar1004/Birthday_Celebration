import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const EMOJIS = ['🎈', '🎉', '🎁', '🎂', '✨', '🍰', '🕯️'];

interface FloatingEmoji {
    id: number;
    emoji: string;
    x: number;
    duration: number;
    delay: number;
}

export function FloatingEmojis() {
    const [items, setItems] = useState<FloatingEmoji[]>([]);

    useEffect(() => {
        const newItems = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            x: Math.random() * 100,
            duration: 10 + Math.random() * 20,
            delay: Math.random() * 10,
        }));
        setItems(newItems);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ y: '110vh', x: `${item.x}vw`, opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 1, 1, 0],
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: item.duration,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute text-4xl"
                >
                    {item.emoji}
                </motion.div>
            ))}
        </div>
    );
}

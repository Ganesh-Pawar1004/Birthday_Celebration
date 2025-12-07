import React from 'react';
import { motion } from 'framer-motion';

interface CandleProps {
    isLit: boolean;
}

export function Candle({ isLit }: CandleProps) {
    return (
        <div className="relative flex flex-col items-center">
            {/* Flame */}
            <motion.div
                animate={isLit ? {
                    scale: [1, 1.1, 0.9, 1],
                    rotate: [-2, 2, -1, 1],
                    opacity: 1,
                } : {
                    scale: 0,
                    opacity: 0,
                }}
                transition={isLit ? {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                } : {
                    duration: 0.5,
                }}
                className="w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full blur-[1px] shadow-[0_0_10px_rgba(255,165,0,0.8)] origin-bottom mb-1"
            />

            {/* Candle Body */}
            <div className="w-4 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-sm border border-red-300 relative shadow-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-black/30 -mt-1" />
                {/* Stripes */}
                <div className="absolute top-4 w-full h-2 bg-red-400/30 -skew-y-6" />
                <div className="absolute top-8 w-full h-2 bg-red-400/30 -skew-y-6" />
                <div className="absolute top-12 w-full h-2 bg-red-400/30 -skew-y-6" />
            </div>
        </div>
    );
}

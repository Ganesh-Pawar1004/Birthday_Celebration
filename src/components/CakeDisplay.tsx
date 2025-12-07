import React, { useState } from 'react';
import { Candle } from './Candle';
import confetti from 'canvas-confetti';
// import { Howl } from 'howler';

// Sound effects (placeholders, would need real URLs)
// const blowSound = new Howl({ src: ['/blow.mp3'] });
// const cheerSound = new Howl({ src: ['/cheer.mp3'] });

interface CakeDisplayProps {
    flavor: string;
    recipientName: string;
    onComplete: () => void;
}

export function CakeDisplay({ flavor, recipientName, onComplete }: CakeDisplayProps) {
    const [candlesLit, setCandlesLit] = useState(true);
    const [slicesCut, setSlicesCut] = useState(0);
    const totalSlices = 8;

    const getFlavorColors = (flavor: string) => {
        switch (flavor) {
            case 'chocolate': return { base: 'bg-[#5D4037]', top: 'bg-[#795548]', frosting: 'bg-[#3E2723]' };
            case 'strawberry': return { base: 'bg-pink-300', top: 'bg-pink-400', frosting: 'bg-pink-500' };
            case 'red-velvet': return { base: 'bg-red-700', top: 'bg-red-600', frosting: 'bg-white' };
            default: return { base: 'bg-yellow-100', top: 'bg-yellow-200', frosting: 'bg-white' }; // Vanilla
        }
    };

    const colors = getFlavorColors(flavor);

    const handleBlowCandles = () => {
        setCandlesLit(false);
        // blowSound.play();
    };

    const handleCutSlice = (index: number) => {
        if (candlesLit) return; // Must blow candles first
        if (slicesCut >= totalSlices) return;

        setSlicesCut(prev => prev + 1);

        // Visual feedback for cut (simple particle effect)
        confetti({
            particleCount: 20,
            spread: 30,
            origin: { y: 0.6 }
        });

        if (slicesCut + 1 >= totalSlices) {
            setTimeout(onComplete, 1000);
        }
    };

    return (
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Cake Base */}
            <div className="relative w-64 h-32">
                {/* Candles Container */}
                <div className="absolute -top-16 left-0 w-full flex justify-center space-x-4 z-20">
                    <Candle isLit={candlesLit} />
                    <Candle isLit={candlesLit} />
                    <Candle isLit={candlesLit} />
                </div>

                {/* Cake Top Surface */}
                <div className={`absolute top-0 w-full h-full rounded-[50%] ${colors.top} border-4 border-black/5 z-10 flex items-center justify-center`}>
                    <span className="text-xl font-handwriting text-gray-800 font-bold transform -rotate-6">{recipientName}</span>
                </div>

                {/* Cake Side */}
                <div className={`absolute top-16 w-full h-24 ${colors.base} rounded-b-[50%] border-x-4 border-b-4 border-black/5 shadow-xl`}></div>

                {/* Frosting Drips */}
                <div className="absolute top-16 w-full flex justify-center z-10">
                    {/* Simple CSS drips could go here */}
                </div>

                {/* Slices Overlay (Invisible click targets) */}
                {!candlesLit && (
                    <div className="absolute inset-0 z-30 rounded-[50%] overflow-hidden cursor-pointer">
                        {/* This is a simplified cutting interaction. 
                 Ideally we'd have SVG slices. For now, clicking the cake cuts a "slice".
             */}
                        <div
                            className="w-full h-full"
                            onClick={() => handleCutSlice(slicesCut)}
                        />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute -bottom-24 w-full flex justify-center">
                {candlesLit ? (
                    <button
                        onClick={handleBlowCandles}
                        className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-600 transition-transform hover:scale-105 active:scale-95"
                    >
                        Blow Candles 💨
                    </button>
                ) : (
                    <div className="text-center">
                        <p className="text-white text-lg mb-2 font-semibold drop-shadow-md">
                            {slicesCut < totalSlices ? "Click the cake to cut a slice! 🔪" : "Yay! Cake for everyone! 🍰"}
                        </p>
                        <div className="text-sm text-white/80">Slices: {slicesCut} / {totalSlices}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

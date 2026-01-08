import { motion } from 'framer-motion';

export function PartyLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50/50 backdrop-blur-sm fixed inset-0 z-50">
            <div className="relative">
                {/* Cake Base */}
                <motion.div
                    className="w-16 h-12 bg-pink-400 rounded-lg relative"
                    animate={{
                        scaleY: [1, 0.9, 1],
                        y: [0, 5, 0]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Frosting */}
                    <div className="absolute top-0 w-full h-4 bg-pink-300 rounded-t-lg -mt-1"></div>
                    <div className="absolute top-3 w-full flex justify-around">
                        <div className="w-2 h-4 bg-pink-300 rounded-b-full"></div>
                        <div className="w-2 h-3 bg-pink-300 rounded-b-full"></div>
                        <div className="w-2 h-4 bg-pink-300 rounded-b-full"></div>
                    </div>
                </motion.div>

                {/* Candle */}
                <motion.div
                    className="absolute -top-6 left-1/2 -ml-1 w-2 h-6 bg-yellow-100"
                    animate={{
                        y: [0, 5, 0]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Flame */}
                    <motion.div
                        className="absolute -top-3 left-1/2 -ml-1.5 w-3 h-3 bg-orange-400 rounded-full blur-[1px]"
                        animate={{
                            scale: [1, 1.2, 0.9, 1.1, 1],
                            opacity: [0.8, 1, 0.7, 0.9, 0.8]
                        }}
                        transition={{
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                </motion.div>
            </div>
            <motion.p
                className="mt-8 font-handwriting text-xl text-pink-500 font-bold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Baking Happiness...
            </motion.p>
        </div>
    );
}

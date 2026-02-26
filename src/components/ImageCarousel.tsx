import { motion } from "framer-motion";

interface ImageCarouselProps {
    images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
    if (!images || images.length === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
            {images.map((img, index) => {
                // Determine placement based on index to spread them left and right
                // 0: Left Top-ish, 1: Right Top-ish, 2: Left Bottom-ish, 3: Right Bottom-ish
                const isLeft = index % 2 === 0;
                // Add some slight randomness to vertical position based on index
                const isTop = index < 2;

                // Set X distance to 35% of screen width to ensure it clears the central max-w-2xl container
                const baseOffsetX = window.innerWidth < 768 ? 140 : window.innerWidth * 0.35;
                const randomOffset = Math.random() * 40 - 20;

                // Calculate X and Y offsets from center
                const xPos = isLeft
                    ? -baseOffsetX + randomOffset
                    : baseOffsetX + randomOffset;

                // Vertical position: Shifted higher up the screen
                // Top row goes near the header, bottom row goes near the top of the description box
                const baseY = isTop ? -280 : -50;
                const yPos = baseY + randomOffset;

                const rotateStart = Math.random() * 60 - 30; // -30 to 30 deg
                const rotateEnd = rotateStart + (Math.random() * 20 - 10);

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: rotateStart }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: xPos,
                            y: yPos,
                            rotate: rotateEnd
                        }}
                        transition={{
                            delay: index * 0.3,
                            duration: 1.5,
                            type: "spring",
                            bounce: 0.4
                        }}
                        className="absolute bg-white p-3 md:p-4 pb-8 md:pb-12 shadow-2xl rounded-sm transform"
                        style={{
                            width: window.innerWidth < 768 ? '140px' : '200px',
                            height: window.innerWidth < 768 ? '160px' : '240px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <div className="w-full h-full bg-gray-100 overflow-hidden border border-gray-200">
                            <img
                                src={img}
                                alt={`Memory ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';

export function GridBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Radial gradient spotlight */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.1) 0%, rgba(5, 5, 5, 0) 50%)',
                }}
            />

            {/* SVG Grid Pattern with fade-out mask */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                style={{
                    maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)',
                }}
            >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern
                            id="grid-pattern"
                            width="60"
                            height="60"
                            patternUnits="userSpaceOnUse"
                        >
                            {/* Vertical line */}
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="60"
                                stroke="rgba(245, 158, 11, 0.15)"
                                strokeWidth="1"
                            />
                            {/* Horizontal line */}
                            <line
                                x1="0"
                                y1="0"
                                x2="60"
                                y2="0"
                                stroke="rgba(245, 158, 11, 0.15)"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </motion.div>

            {/* Breathing pulse animation overlay */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export function HammerCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Very stiff spring for responsive tracking
    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        // Track mouse movement
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Check if hovering over clickable elements
            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, input, textarea, select, [role="button"]');
            setIsHovering(!!isClickable);
        };

        // Track clicks
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <motion.div
                animate={{
                    scale: isHovering ? 1.2 : 1,
                    rotate: isClicking ? -90 : -45, // Swing on click
                }}
                transition={{
                    scale: { duration: 0.2 },
                    rotate: { duration: 0.15, type: 'spring', stiffness: 500 },
                }}
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                {/* Hammer SVG */}
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={isHovering ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : ''}
                >
                    {/* Hammer Head */}
                    <rect
                        x="18"
                        y="8"
                        width="10"
                        height="6"
                        rx="1"
                        fill="#e5e5e5"
                        stroke="#f59e0b"
                        strokeWidth="0.5"
                    />

                    {/* Hammer Face (striking surface) */}
                    <rect
                        x="27"
                        y="9"
                        width="2"
                        height="4"
                        fill="#f59e0b"
                    />

                    {/* Handle */}
                    <rect
                        x="4"
                        y="18"
                        width="18"
                        height="3"
                        rx="1.5"
                        fill="#18181b"
                        transform="rotate(-45 13 19.5)"
                    />

                    {/* Handle grip lines */}
                    <line x1="8" y1="22" x2="7" y2="23" stroke="#52525b" strokeWidth="0.5" />
                    <line x1="10" y1="20" x2="9" y2="21" stroke="#52525b" strokeWidth="0.5" />
                    <line x1="12" y1="18" x2="11" y2="19" stroke="#52525b" strokeWidth="0.5" />

                    {/* Handle end cap */}
                    <circle
                        cx="6"
                        cy="24"
                        r="1.5"
                        fill="#27272a"
                    />
                </svg>
            </motion.div>
        </motion.div>
    );
}

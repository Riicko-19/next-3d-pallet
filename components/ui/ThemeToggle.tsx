'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full backdrop-blur-md bg-white/5 border border-white/10" />
        );
    }

    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full backdrop-blur-md bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-all shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 0 : 180,
                    scale: isDark ? 1 : 0.8,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {isDark ? (
                    <Moon className="w-6 h-6 text-primary" />
                ) : (
                    <Sun className="w-6 h-6 text-primary" />
                )}
            </motion.div>
        </motion.button>
    );
}

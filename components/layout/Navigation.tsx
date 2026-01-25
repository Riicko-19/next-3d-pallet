'use client';

import Link from 'next/link';

export function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                            AMBICA
                        </span>
                        <span className="text-xl font-light tracking-wide text-zinc-500 dark:text-zinc-400">
                            PATTERNS
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link
                            href="/"
                            className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href="/#features"
                            className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/#about"
                            className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/#contact"
                            className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-full bg-primary text-black font-medium hover:bg-yellow-500 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

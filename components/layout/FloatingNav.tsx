'use client';

export function FloatingNav() {
    return (
        <nav className="sticky top-6 left-0 right-0 z-50 mx-auto max-w-fit px-6 py-3 rounded-full backdrop-blur-md bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center gap-8">
                <a href="/" className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                    Ambica Patterns
                </a>
                <div className="hidden md:flex items-center gap-6 text-sm">
                    <a href="/products" className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors">
                        Products
                    </a>
                    <a href="/#features" className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors">
                        Features
                    </a>
                    <a href="/#about" className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors">
                        About
                    </a>
                    <a href="/#contact" className="text-zinc-700 dark:text-gray-300 hover:text-primary transition-colors">
                        Contact
                    </a>
                    <a href="/contact" className="px-4 py-2 rounded-full bg-primary text-black font-medium hover:bg-yellow-500 transition-all">
                        Get Quote
                    </a>
                </div>
            </div>
        </nav>
    );
}

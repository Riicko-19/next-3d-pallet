'use client';

import { motion } from 'framer-motion';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Package, Boxes, Container, Package2 } from 'lucide-react';

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const products = [
    {
        id: 1,
        icon: Package,
        title: 'Euro Pallets (EPAL)',
        category: 'The Standard',
        specs: [
            { label: 'Dynamic Load', value: '1500 kg' },
            { label: 'Static Load', value: '4000 kg' },
            { label: 'Treatment', value: 'ISPM-15 Heat Treated' },
        ],
    },
    {
        id: 2,
        icon: Boxes,
        title: 'Casting Patterns',
        category: 'The Precision',
        specs: [
            { label: 'Material', value: 'Teak/Pine' },
            { label: 'Tolerance', value: '+/- 0.5mm' },
            { label: 'Finish', value: 'High Gloss' },
        ],
    },
    {
        id: 3,
        icon: Container,
        title: 'Industrial Crating',
        category: 'The Protection',
        specs: [
            { label: 'Purpose', value: 'Heavy Machinery Export' },
            { label: 'Lining', value: 'VCI Anti-Corrosion' },
            { label: 'Dimensions', value: 'Custom' },
        ],
    },
    {
        id: 4,
        icon: Package2,
        title: 'Plywood Boxes',
        category: 'The Lightweight',
        specs: [
            { label: 'Weight', value: 'Lightweight' },
            { label: 'Assembly', value: 'Nail-less Option' },
            { label: 'Transport', value: 'Air Freight Ready' },
        ],
    },
];

export default function ProductsPage() {
    return (
        <>
            <div className="min-h-screen bg-white dark:bg-[#050505] py-20">
                <FloatingNav />

                {/* Hero Section */}
                <section className="px-6 py-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-8"
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
                                ENGINEERED
                                <br />
                                <span className="gradient-text">FOR LOADS</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-600 dark:text-gray-400 max-w-4xl mx-auto font-light tracking-wide">
                                Precision wooden patterns and industrial pallets certified for global logistics.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{}}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {products.map((product, index) => {
                                const Icon = product.icon;
                                return (
                                    <motion.div key={product.id} variants={fadeUpVariants}>
                                        <SpotlightCard className="p-8 h-full flex flex-col">
                                            {/* Icon */}
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                                                <Icon className="w-8 h-8 text-primary" />
                                            </div>

                                            {/* Category */}
                                            <div className="text-xs font-mono font-bold text-primary uppercase tracking-widest mb-3">
                                                {product.category}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-2xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">
                                                {product.title}
                                            </h3>

                                            {/* Specs */}
                                            <div className="space-y-3 flex-grow">
                                                <div className="text-xs font-mono font-bold text-zinc-500 dark:text-gray-500 uppercase tracking-wider mb-4">
                                                    Specifications
                                                </div>
                                                {product.specs.map((spec, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
                                                    >
                                                        <span className="text-xs font-mono text-zinc-600 dark:text-gray-400 uppercase">
                                                            {spec.label}
                                                        </span>
                                                        <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                                                            {spec.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <button className="mt-6 w-full py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:bg-primary hover:text-black transition-all">
                                                Request Specs
                                            </button>
                                        </SpotlightCard>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="px-6 py-32">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{}}
                        >
                            <SpotlightCard className="p-16 text-center">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                                    Need Custom Specifications?
                                </h2>
                                <p className="text-lg text-zinc-600 dark:text-gray-400 mb-8">
                                    Our engineering team can design bespoke solutions for your exact requirements.
                                </p>
                                <a
                                    href="/contact"
                                    className="inline-block px-10 py-4 rounded-full bg-primary text-black font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 shadow-2xl"
                                >
                                    Get a Quote
                                </a>
                            </SpotlightCard>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}

'use client';

import { motion } from 'framer-motion';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const certifications = [
    'ISO 9001:2015',
    'EPAL Certified',
    'ISPM-15 Compliant',
    'PEFC Certified',
    'FSC Certified',
    'CE Marking',
];

export default function AboutPage() {
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
                                PRECISION
                                <br />
                                <span className="gradient-text">SINCE 1993</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-600 dark:text-gray-400 max-w-4xl mx-auto font-light tracking-wide leading-relaxed">
                                From a small workshop in Gujarat to India&apos;s leading industrial packaging manufacturer.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Row */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { value: '30+', label: 'Years Experience' },
                                { value: '5M+', label: 'Pallets Delivered' },
                                { value: '2', label: 'Manufacturing Units' },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{}}
                                    variants={fadeUpVariants}
                                    transition={{ delay: idx * 0.15 }}
                                >
                                    <SpotlightCard className="p-12 text-center">
                                        <div className="text-6xl md:text-7xl font-black text-primary mb-4 font-mono">
                                            {stat.value}
                                        </div>
                                        <div className="text-lg font-medium text-zinc-600 dark:text-gray-400 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </SpotlightCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission Split Layout */}
                <section className="px-6 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Fire-Brigade Model */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{}}
                                variants={fadeUpVariants}
                            >
                                <div className="border-l-4 border-primary pl-8 space-y-6">
                                    <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                        The Fire-Brigade Model
                                    </h2>
                                    <div className="space-y-4 text-lg text-zinc-600 dark:text-gray-400 leading-relaxed">
                                        <p>
                                            We pioneered the &quot;Just-in-Time&quot; delivery model for industrial packaging in India.
                                            Our promise is simple: we never say no to a deadline.
                                        </p>
                                        <p>
                                            With 3 months of raw material inventory and 24/7 production capabilities, we respond
                                            to emergency orders within hours, not days.
                                        </p>
                                        <p className="text-primary font-semibold">
                                            Emergency response is not a service—it&apos;s our standard.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sustainability */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{}}
                                variants={fadeUpVariants}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="border-l-4 border-primary pl-8 space-y-6">
                                    <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                        Sustainability
                                    </h2>
                                    <div className="space-y-4 text-lg text-zinc-600 dark:text-gray-400 leading-relaxed">
                                        <p>
                                            100% of our wood comes from PEFC-certified cultivated forests. We don&apos;t harvest
                                            natural forests—we plant and manage our own.
                                        </p>
                                        <p>
                                            Our Gujarat facility runs on 85% solar power, making us one of India&apos;s greenest
                                            heavy manufacturing units.
                                        </p>
                                        <p className="text-primary font-semibold">
                                            Building for today, preserving for tomorrow.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section className="px-6 py-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{}}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                                Certifications & Compliance
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-gray-400">
                                Industry-leading standards, globally recognized
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {certifications.map((cert, idx) => (
                                <motion.div
                                    key={idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{}}
                                    variants={fadeUpVariants}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="p-6 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-center hover:border-primary transition-all">
                                        <div className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                                            {cert}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-20">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{}}
                        >
                            <SpotlightCard className="p-16 text-center">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                                    Partner with Excellence
                                </h2>
                                <p className="text-lg text-zinc-600 dark:text-gray-400 mb-8">
                                    Join thousands of companies that trust Ambica Patterns for industrial packaging.
                                </p>
                                <a
                                    href="/contact"
                                    className="inline-block px-10 py-4 rounded-full bg-primary text-black font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-105 shadow-2xl"
                                >
                                    Get Started
                                </a>
                            </SpotlightCard>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}

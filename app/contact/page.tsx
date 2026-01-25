'use client';

import { motion } from 'framer-motion';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        requirement: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-[#050505] py-20">
                <FloatingNav />

                {/* Hero */}
                <section className="px-6 py-32">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-8 mb-20"
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none text-zinc-900 dark:text-white">
                                GET A
                                <br />
                                <span className="gradient-text">QUOTE</span>
                            </h1>
                        </motion.div>

                        {/* Split Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Left Column - Info */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{}}
                                variants={fadeUpVariants}
                                className="space-y-12"
                            >
                                {/* Units */}
                                <div className="space-y-8">
                                    <div className="border-l-4 border-primary pl-6 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider mb-2">
                                                    Unit 1 (Head Office)
                                                </div>
                                                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                                                    Wadala West, Mumbai - 400031
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-l-4 border-primary pl-6 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider mb-2">
                                                    Unit 2 (Factory)
                                                </div>
                                                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                                                    GIDC, Gujarat - 394125
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-8">
                                    <div className="border-l-4 border-primary pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Mail className="w-6 h-6 text-primary" />
                                            <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider">
                                                Email
                                            </div>
                                        </div>
                                        <a
                                            href="mailto:enquiry@ambicapatterns.com"
                                            className="text-xl font-semibold text-zinc-900 dark:text-white hover:text-primary transition-colors"
                                        >
                                            enquiry@ambicapatterns.com
                                        </a>
                                    </div>

                                    <div className="border-l-4 border-primary pl-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Phone className="w-6 h-6 text-primary" />
                                            <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider">
                                                Phone
                                            </div>
                                        </div>
                                        <a
                                            href="tel:+919070919070"
                                            className="text-3xl font-black text-zinc-900 dark:text-white hover:text-primary transition-colors font-mono"
                                        >
                                            +91 90709 19070
                                        </a>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="p-8 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                    <div className="text-sm font-mono font-bold text-primary uppercase tracking-wider mb-4">
                                        Emergency Orders
                                    </div>
                                    <p className="text-zinc-600 dark:text-gray-400 leading-relaxed">
                                        Need rush delivery? Our fire-brigade service operates 24/7. Call us directly for immediate response.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Right Column - Form */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{}}
                                variants={fadeUpVariants}
                                transition={{ delay: 0.2 }}
                            >
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-mono font-bold text-zinc-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label className="block text-sm font-mono font-bold text-zinc-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md transition-all"
                                            placeholder="Your company"
                                        />
                                    </div>

                                    {/* Requirement */}
                                    <div>
                                        <label className="block text-sm font-mono font-bold text-zinc-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                            Requirement
                                        </label>
                                        <select
                                            name="requirement"
                                            value={formData.requirement}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md transition-all"
                                        >
                                            <option value="">Select a product type</option>
                                            <option value="pallets">Pallets</option>
                                            <option value="patterns">Patterns</option>
                                            <option value="crates">Crates</option>
                                            <option value="boxes">Plywood Boxes</option>
                                            <option value="custom">Custom Solution</option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-mono font-bold text-zinc-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md resize-none transition-all"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full px-10 py-5 rounded-full bg-amber-600 hover:bg-amber-500 text-black font-black text-lg tracking-wide uppercase transition-all hover:scale-105 shadow-2xl"
                                    >
                                        Initiate Request
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

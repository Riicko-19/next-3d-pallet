'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication here
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>

            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Home
            </Link>

            {/* Login Card */}
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="glass-card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black tracking-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to access your command center
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-panel focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl glass-panel focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                <input type="checkbox" className="rounded" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary hover:text-yellow-500 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-[1.02] shadow-lg hover:shadow-primary/50"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-background text-gray-400">or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-3 rounded-xl glass-panel hover:bg-white/10 transition-all font-medium">
                            Google
                        </button>
                        <button className="py-3 rounded-xl glass-panel hover:bg-white/10 transition-all font-medium">
                            GitHub
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-400 mt-8">
                        Don&apos;t have an account?{' '}
                        <a href="#" className="text-primary hover:text-yellow-500 transition-colors font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

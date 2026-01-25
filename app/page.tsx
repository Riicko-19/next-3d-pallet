'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, TreePine, Wifi } from 'lucide-react';
import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { FloatingNav } from '@/components/layout/FloatingNav';

// Dynamically import the 3D scene (not the wrapper component)
const Scene = dynamic(
  () => import('@/components/canvas/PalletAssembly').then(mod => ({ default: mod.Scene })),
  { ssr: false }
);

// Animation variants for fade-up effects
const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
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

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for title fade
  const { scrollY } = useScroll();

  // Title fades from 1 to 0 as user scrolls from 0 to 500px
  const titleOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const titleScale = useTransform(scrollY, [0, 500], [1, 0.95]);

  return (
    <>
      {/* LAYER 1: Fixed 3D Canvas Background (z-0) */}
      <div className="fixed inset-0 z-0 bg-zinc-100 dark:bg-zinc-950">
        <Canvas shadows camera={{ position: [6, 4, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <OrbitControls makeDefault enableZoom={false} enablePan={false} />
            {/* @ts-ignore */}
            <Scene setCompleted={() => { }} />
          </Suspense>
        </Canvas>
      </div>

      {/* LAYER 2: Scrollable Content (z-10) */}
      <div ref={containerRef} className="relative z-10">

        {/* SECTION A: Title Screen (0vh - 100vh) */}
        <motion.section
          className="h-screen flex items-center justify-center"
          style={{
            opacity: titleOpacity,
            scale: titleScale,
          }}
        >
          <div className="text-center px-6">
            <h1 className="text-7xl md:text-8xl lg:text-[12rem] font-black tracking-tighter leading-none">
              <span className="block text-zinc-900 dark:text-white">MOVE THE</span>
              <span className="block gradient-text">IMPOSSIBLE</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-zinc-600 dark:text-gray-400 max-w-3xl mx-auto">
              India&apos;s First EPAL Certified Pallet Manufacturer
            </p>
          </div>
        </motion.section>

        {/* SECTION B: Scroll Spacer (1000vh for 3D Animation) - CRITICAL: Must have #pallet-container ID */}
        <div id="pallet-container" className="relative" style={{ height: '1000vh' }}>
          {/* This empty space allows the 3D animation to play via ScrollTrigger */}
        </div>

        {/* SECTION C: Content Section (Bento Grid) */}
        <div className="relative bg-white dark:bg-[#050505]">

          {/* Floating Navigation */}
          <FloatingNav />

          {/* Transition Gradient */}
          <div className="h-48 bg-gradient-to-b from-transparent via-white/50 dark:via-[#050505]/50 to-white dark:to-[#050505]" />

          {/* Bento Grid - Features Section */}
          <section id="features" className="px-6 py-32 bg-white dark:bg-[#050505]">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                  BUILT DIFFERENT
                </h2>
                <p className="text-xl text-zinc-600 dark:text-gray-400">
                  Industrial-grade capabilities that set us apart
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                {/* Card 1: Fire-Brigade Service */}
                <motion.div
                  className="lg:col-span-2"
                  variants={fadeUpVariants}
                >
                  <SpotlightCard className="p-8 h-full">
                    <div className="space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">Fire-Brigade Service</h3>
                        <p className="text-zinc-600 dark:text-gray-400 text-lg leading-relaxed">
                          We never say no to a deadline. With 3 months of raw material stock on hand,
                          we deliver when others can&apos;t. Emergency orders are our specialty.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-4">
                        <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                          24/7 Available
                        </span>
                        <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                          3-Month Stock
                        </span>
                        <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                          Rapid Deployment
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>

                {/* Card 2: Cultivated Forest */}
                <motion.div variants={fadeUpVariants}>
                  <SpotlightCard className="p-8 h-full bg-gradient-to-br from-green-500/10 to-primary/10">
                    <div className="space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <TreePine className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">Cultivated Forest</h3>
                        <p className="text-zinc-600 dark:text-gray-400 text-lg leading-relaxed">
                          100% Sustainable PEFC Wood sourced from responsibly managed forests.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                          <div className="text-2xl font-bold text-green-400">100%</div>
                          <div className="text-xs text-zinc-600 dark:text-gray-400 mt-1">PEFC Certified</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                          <div className="text-2xl font-bold text-primary">Sustainable</div>
                          <div className="text-xs text-zinc-600 dark:text-gray-400 mt-1">Renewable</div>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>

                {/* Card 3: IoT Enabled */}
                <motion.div
                  className="lg:col-span-3"
                  variants={fadeUpVariants}
                >
                  <SpotlightCard className="p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <Wifi className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-white">IoT Enabled Tracking</h3>
                        <p className="text-zinc-600 dark:text-gray-400 text-lg leading-relaxed">
                          Real-time monitoring of temperature, humidity, and shock detection for every pallet in transit.
                          Track your inventory from factory to destination with military-grade precision.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                          Live Tracking
                        </div>
                        <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                          IoT Sensors
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Additional Feature Section */}
          <section className="px-6 py-32 bg-white dark:bg-[#050505]">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
                  By The Numbers
                </h2>
                <p className="text-xl text-zinc-600 dark:text-gray-400">
                  Proof of our commitment to excellence
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { number: '3M+', label: 'Pallets Manufactured', icon: '📦' },
                  { number: '100%', label: 'EPAL Certified', icon: '✅' },
                  { number: '24/7', label: 'Emergency Service', icon: '⚡' },
                  { number: '85%', label: 'Solar Powered', icon: '☀️' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <SpotlightCard className="p-8 text-center h-full">
                      <div className="text-5xl mb-4">{stat.icon}</div>
                      <div className="text-4xl font-black text-primary mb-2">{stat.number}</div>
                      <div className="text-zinc-600 dark:text-gray-400">{stat.label}</div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <footer className="px-6 py-32 bg-white dark:bg-[#050505]">
            <motion.div
              className="max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <SpotlightCard className="p-12 md:p-20 text-center">
                <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white">
                  Ready to Move
                  <br />
                  <span className="gradient-text">The Impossible?</span>
                </h2>
                <p className="text-xl text-zinc-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                  Get started with Ambica Patterns today. Experience the fire-brigade service model.
                </p>
                <a
                  href="/login"
                  className="inline-block px-12 py-5 rounded-full bg-primary text-black font-bold text-xl hover:bg-yellow-500 transition-all hover:scale-105 shadow-2xl"
                >
                  Get Started →
                </a>
              </SpotlightCard>
            </motion.div>
          </footer>
        </div>
      </div>
    </>
  );
}
'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import PalletAssembly from '@/components/canvas/PalletAssembly';
import SpecsGrid from '@/components/ui/SpecsGrid';

export default function Home() {
  const containerRef = useRef(null);
  
  // Connect scroll animation to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fade out title as user scrolls (0 to 20% of scroll)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <main ref={containerRef} className="relative bg-zinc-900 min-h-screen">
      
      {/* 1. Fixed Hero Overlay */}
      <motion.div 
        style={{ opacity: titleOpacity, y: titleY }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full pointer-events-none"
      >
        {/* CHANGED COLOR HERE: text-orange-500 */}
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4">
          The Perfect Pallet
        </h1>
        <p className="text-zinc-400 text-xl text-white tracking-wide">
          Precision Milled. Sustainably Sourced.
        </p>
      </motion.div>

      {/* 2. The 3D Scroll Section */}
      <div className="relative z-0">
        <PalletAssembly />
      </div>

      {/* 3. Specs Section */}
      <div className="relative z-10 bg-zinc-900 border-t border-zinc-800">
        <SpecsGrid />
      </div>

      {/* 4. Fixed CTA Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg transition-all hover:scale-105 active:scale-95">
          Get Quote
        </button>
      </div>

    </main>
  );
}
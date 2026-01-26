'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

// Import the existing Scene from PalletAssembly
import { Scene } from '@/components/canvas/PalletAssembly';

export default function BlueprintDemo() {
    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Fixed 3D Canvas */}
            <div className="fixed inset-0 z-0">
                <Canvas
                    shadows
                    camera={{ position: [6, 4, 6], fov: 60 }}
                    dpr={[1, 2]}
                    performance={{ min: 0.5 }}
                    gl={{ antialias: true, alpha: false }}
                >
                    <Suspense fallback={null}>
                        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
                        {/* @ts-ignore */}
                        <Scene setCompleted={() => { }} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Scrollable content */}
            <div className="relative z-10">
                {/* Title screen */}
                <div className="h-screen flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-6xl font-black mb-4 gradient-text">Blueprint Animation Test</h1>
                        <p className="text-xl text-zinc-400">Full pallet assembly with 3D → 2D transition</p>
                        <p className="text-lg text-zinc-500 mt-4">Scroll to see the complete manufacturing process</p>
                    </div>
                </div>

                {/* Scroll container for animation - must match pallet-container ID */}
                <div id="pallet-container" className="h-[1000vh] relative" />

                {/* End content */}
                <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                    <div className="text-center text-white max-w-2xl px-6">
                        <h2 className="text-4xl font-bold mb-6">Manufacturing Complete</h2>
                        <p className="text-xl text-zinc-400 mb-4">You've seen the complete pallet assembly process:</p>
                        <ul className="text-left text-lg text-zinc-300 space-y-2">
                            <li>✓ Logs arriving and positioning</li>
                            <li>✓ Hacksaw cutting the log</li>
                            <li>✓ Planks appearing and falling</li>
                            <li>✓ Assembly into pallet structure</li>
                            <li>✓ Nailing process</li>
                            <li>✓ Final stamp</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

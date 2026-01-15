'use client';

import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, OrbitControls } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- PLANK COMPONENT ---
interface PlankProps {
    startPos: [number, number, number];
    targetPos: [number, number, number];
    size: [number, number, number];
    id: number;
    texture: THREE.Texture;
}

function Plank({ startPos, targetPos, size, id, texture }: PlankProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        if (!meshRef.current) return;

        // Set initial position
        meshRef.current.position.set(startPos[0], startPos[1], startPos[2]);

        // Animate to target
        gsap.to(meshRef.current.position, {
            x: targetPos[0],
            y: targetPos[1],
            z: targetPos[2],
            scrollTrigger: {
                trigger: '#pallet-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
            },
            ease: 'power2.inOut',
        });
    }, [startPos, targetPos]);

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                envMapIntensity={1}
            />
        </mesh>
    );
}

// --- SCENE COMPONENT ---
function Scene({ setRotationEnabled }: { setRotationEnabled: (enabled: boolean) => void }) {
    const texture = useTexture('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');

    // Monitor Scroll to Unlock Rotation
    useGSAP(() => {
        ScrollTrigger.create({
            trigger: '#pallet-container',
            start: '95% bottom', // When 95% finished
            onEnter: () => setRotationEnabled(true),  // Unlock rotation
            onLeaveBack: () => setRotationEnabled(false), // Lock if they scroll back up
        });
    }, []);

    const planks = useMemo(() => {
        const random = (min: number, max: number) => Math.random() * (max - min) + min;
        return [
            // Top deck
            { id: 0, size: [3, 0.2, 0.4], targetPos: [0, 0.6, -1.2] },
            { id: 1, size: [3, 0.2, 0.4], targetPos: [0, 0.6, -0.6] },
            { id: 2, size: [3, 0.2, 0.4], targetPos: [0, 0.6, 0] },
            { id: 3, size: [3, 0.2, 0.4], targetPos: [0, 0.6, 0.6] },
            { id: 4, size: [3, 0.2, 0.4], targetPos: [0, 0.6, 1.2] },
            // Stringers
            { id: 5, size: [0.4, 0.4, 3], targetPos: [-1.2, 0, 0] },
            { id: 6, size: [0.4, 0.4, 3], targetPos: [0, 0, 0] },
            { id: 7, size: [0.4, 0.4, 3], targetPos: [1.2, 0, 0] },
            // Bottom deck
            { id: 8, size: [3, 0.2, 0.4], targetPos: [0, -0.4, -1] },
            { id: 9, size: [3, 0.2, 0.4], targetPos: [0, -0.4, -0.3] },
            { id: 10, size: [3, 0.2, 0.4], targetPos: [0, -0.4, 0.3] },
            { id: 11, size: [3, 0.2, 0.4], targetPos: [0, -0.4, 1] },
        ].map((plank: any) => ({
            ...plank,
            startPos: [random(-3, 3), random(2, 6), random(-3, 3)],
        }));
    }, []);

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.4} />
            <SpotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

            {planks.map((plank: any) => (
                <Plank key={plank.id} {...plank} texture={texture} />
            ))}
        </>
    );
}

// --- MAIN COMPONENT ---
export default function PalletAssembly() {
    // State to control rotation
    const [rotationEnabled, setRotationEnabled] = useState(false);

    return (
        <div id="pallet-container" className="h-[300vh] relative">
            <div className="fixed inset-0 bg-zinc-900 -z-50" />

            <div className="sticky top-0 h-screen w-full">
                <Canvas
                    shadows
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    className="bg-transparent"
                    // Only allow pointer events (clicking) when rotation is enabled
                    style={{ pointerEvents: rotationEnabled ? 'auto' : 'none' }}
                >
                    <Suspense fallback={null}>
                        {/* OrbitControls Configuration:
                            - enableZoom={false}: Prevents breaking the scroll layout
                            - autoRotate: Adds a nice slow spin when idle
                        */}
                        {rotationEnabled && (
                            <OrbitControls
                                enableZoom={false}
                                autoRotate={true}
                                autoRotateSpeed={2}
                                makeDefault
                            />
                        )}

                        <Scene setRotationEnabled={setRotationEnabled} />
                    </Suspense>
                </Canvas>

                {/* Optional: Instructions that appear when unlocked */}
                <div
                    className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${rotationEnabled ? 'opacity-100' : 'opacity-0'}`}
                >
                    <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm border border-white/20 backdrop-blur-md">
                        🖱️ Drag to Rotate
                    </span>
                </div>
            </div>
        </div>
    );
}
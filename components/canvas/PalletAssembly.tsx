'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight } from '@react-three/drei';
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
}

function Plank({ startPos, targetPos, size, id }: PlankProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        if (!meshRef.current) return;

        // 1. Set Initial "Exploded" Position immediately
        meshRef.current.position.set(startPos[0], startPos[1], startPos[2]);

        // 2. Animate to Target Position on Scroll
        gsap.to(meshRef.current.position, {
            x: targetPos[0],
            y: targetPos[1],
            z: targetPos[2],
            scrollTrigger: {
                trigger: '#pallet-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Smooth scrubbing
            },
            ease: 'power2.inOut',
        });
    }, [startPos, targetPos]);

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={size} />
            {/* Bright Orange for Visibility */}
            <meshStandardMaterial color="#fb923c" roughness={0.5} />
        </mesh>
    );
}

// --- SCENE COMPONENT ---
function Scene() {
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
            // VISIBILITY FIX: Start positions are lowered to y=2 to y=6
            // They will float right in the middle of the screen
            startPos: [random(-3, 3), random(2, 6), random(-3, 3)],
        }));
    }, []);

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={1.5} />
            <SpotLight position={[10, 10, 10]} angle={0.5} intensity={2} castShadow />

            {planks.map((plank: any) => (
                <Plank key={plank.id} {...plank} />
            ))}
        </>
    );
}

// --- MAIN EXPORT ---
export default function PalletAssembly() {
    return (
        <div id="pallet-container" className="h-[300vh] relative">
            
            {/* 🛡️ THE SAFETY CURTAIN: This forces the background to be black forever. 
                It is fixed to the screen behind the canvas. */}
            <div className="fixed inset-0 bg-zinc-900 -z-50" />

            <div className="sticky top-0 h-screen w-full">
                <Canvas
                    shadows
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    // Canvas is transparent so the Safety Curtain shows through
                    className="bg-transparent"
                >
                    <Suspense fallback={null}>
                        <Scene />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
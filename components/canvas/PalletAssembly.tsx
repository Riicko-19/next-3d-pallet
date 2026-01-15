'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, Html } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- LABEL COMPONENT ---
function Label({ text, position }: { text: string; position: [number, number, number] }) {
    const labelRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!labelRef.current) return;

        // Fade in labels only when scroll reaches 90%+
        gsap.fromTo(
            labelRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: '#pallet-container',
                    start: '90% bottom',
                    end: '100% bottom',
                    scrub: 1,
                },
            }
        );
    }, []);

    return (
        <Html position={position} center transform>
            <div
                ref={labelRef}
                className="text-white text-sm font-bold bg-black/80 px-2 py-1 rounded border border-white/20 whitespace-nowrap"
                style={{ opacity: 0 }}
            >
                {text}
            </div>
        </Html>
    );
}

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
            {/* Realistic wood texture */}
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                envMapIntensity={1}
            />
        </mesh>
    );
}

// --- SCENE COMPONENT ---
function Scene() {
    // Load the wood texture
    const texture = useTexture('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');

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
            // Start positions lowered to eye level (y=2 to y=6) for immediate visibility
            startPos: [random(-3, 3), random(2, 6), random(-3, 3)],
        }));
    }, []);

    return (
        <>
            {/* Switched back to 'city' for better contrast */}
            <Environment preset="city" />

            {/* LOWERED LIGHTING: Ambient down from 1.5 to 0.4 for darker shadows */}
            <ambientLight intensity={0.4} />

            {/* LOWERED LIGHTING: SpotLight down from 3 to 1.5 for less harsh highlights */}
            <SpotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />

            {/* Soft Shadow on the floor */}
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

            {planks.map((plank: any) => (
                <Plank key={plank.id} {...plank} texture={texture} />
            ))}

            {/* Floating Labels - Fade in at 90%+ scroll */}
            <Label text="Top Deck" position={[0, 1, 0]} />
            <Label text="Stringers" position={[1.5, 0, 0]} />
            <Label text="Bottom Deck" position={[0, -0.8, 0]} />
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
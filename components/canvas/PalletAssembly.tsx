'use client';

import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, OrbitControls } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- NAIL COMPONENT ---
interface NailProps {
    position: [number, number, number];
    index: number;
}

function Nail({ position, index }: NailProps) {
    const nailRef = useRef<THREE.Group>(null);

    useGSAP(() => {
        if (!nailRef.current) return;

        // Set initial position (start above pallet)
        nailRef.current.position.set(position[0], 1.0, position[2]);

        // Nail driving animation between 80% and 95%
        const startProgress = 80 + (index * 1.5); // Stagger for 10 nails
        const endProgress = startProgress + 1.5;

        gsap.to(nailRef.current.position, {
            y: 0.4, // End flush with top deck surface
            scrollTrigger: {
                trigger: '#pallet-container',
                start: `${startProgress}% bottom`,
                end: `${endProgress}% bottom`,
                scrub: 1,
            },
            ease: 'power2.in',
        });
    }, [position, index]);

    return (
        <group ref={nailRef}>
            {/* Nail head */}
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Nail shaft */}
            <mesh>
                <cylinderGeometry args={[0.015, 0.015, 0.4, 16]} />
                <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
    );
}

// --- HAMMER COMPONENT ---
function Hammer() {
    const hammerRef = useRef<THREE.Group>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio('/sounds/hammer-hit.mp3');
        audioRef.current.volume = 0.5;
    }

    // 2 nails per plank: 5 planks × 2 = 10 nails (outer stringers only)
    // X-coordinates (outer stringers): [-1.2, 1.2]
    // Z-coordinates (5 planks evenly spaced): [-1.2, -0.6, 0, 0.6, 1.2]
    const nailPositions: [number, number, number][] = [];
    const stringerX = [-1.2, 1.2];
    const plankZ = [-1.2, -0.6, 0, 0.6, 1.2];

    plankZ.forEach(z => {
        stringerX.forEach(x => {
            nailPositions.push([x, 0.3, z]);
        });
    });

    // Play hammer sound
    const playHitSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => console.log('Audio play failed:', err));
        }
    };

    useGSAP(() => {
        if (!hammerRef.current) return;

        // Start hidden and off-screen
        hammerRef.current.position.set(3, 2, 0);
        hammerRef.current.rotation.set(0, 0, 0);
        hammerRef.current.visible = false;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '80% bottom',
                end: '95% bottom',
                scrub: 1,
                onEnter: () => {
                    if (hammerRef.current) hammerRef.current.visible = true;
                },
                onLeave: () => {
                    if (hammerRef.current) hammerRef.current.visible = false;
                },
                onEnterBack: () => {
                    if (hammerRef.current) hammerRef.current.visible = true;
                },
                onLeaveBack: () => {
                    if (hammerRef.current) hammerRef.current.visible = false;
                },
            },
        });

        // Animate to each of the 15 nail positions sequentially
        nailPositions.forEach((pos, i) => {
            const progress = i / nailPositions.length;

            // Move to nail (3x slower)
            tl.to(hammerRef.current.position, {
                x: pos[0],
                y: pos[1] + 1.2,
                z: pos[2],
                duration: 0.6,
                ease: 'power2.inOut',
            }, progress);

            // SWING DOWN - full 180 degrees to touch nail (sound at impact)
            tl.to(hammerRef.current.rotation, {
                x: Math.PI, // 180-degree swing
                duration: 0.3,
                ease: 'power3.in',
                onComplete: playHitSound,
            }, progress + 0.6);

            // SWING UP - slow return
            tl.to(hammerRef.current.rotation, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out',
            }, progress + 0.9);
        });

        // Exit
        tl.to(hammerRef.current.position, {
            x: 3,
            y: 2,
            z: 0,
            duration: 0.2,
        });
    }, []);

    return (
        <group ref={hammerRef}>
            {/* PIVOT POINT IS AT (0,0,0) - Bottom of handle for proper swing */}

            {/* Hammer handle - wood, extends upward from pivot */}
            <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.04, 1.5, 16]} />
                <meshStandardMaterial color="#8b4513" roughness={0.8} />
            </mesh>

            {/* Hammer head - metal, larger and at top of handle */}
            <mesh position={[0, 1.55, 0]}>
                <boxGeometry args={[0.4, 0.2, 0.2]} />
                <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
            </mesh>
        </group>
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
                end: '75% bottom',
                scrub: 1,
                toggleActions: 'play reverse play reverse',
                invalidateOnRefresh: true,
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

    // Monitor Scroll to Unlock Rotation (after 15th nail)
    useGSAP(() => {
        ScrollTrigger.create({
            trigger: '#pallet-container',
            start: '95% bottom',
            onEnter: () => setRotationEnabled(true),
            onLeaveBack: () => setRotationEnabled(false),
        });
    }, []);

    const planks = useMemo(() => {
        const random = (min: number, max: number) => Math.random() * (max - min) + min;
        return [
            // Top deck - Y = 0.3, evenly spaced across stringer length (width 0.35)
            { id: 0, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, 0.3, -1.2] as [number, number, number] },
            { id: 1, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, 0.3, -0.6] as [number, number, number] },
            { id: 2, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, 0.3, 0] as [number, number, number] },
            { id: 3, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, 0.3, 0.6] as [number, number, number] },
            { id: 4, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, 0.3, 1.2] as [number, number, number] },

            // Stringers - Y = 0, increased length for bigger pallet (2.8 units)
            { id: 5, size: [0.4, 0.4, 2.8] as [number, number, number], targetPos: [-1.2, 0, 0] as [number, number, number] },
            { id: 6, size: [0.4, 0.4, 2.8] as [number, number, number], targetPos: [0, 0, 0] as [number, number, number] },
            { id: 7, size: [0.4, 0.4, 2.8] as [number, number, number], targetPos: [1.2, 0, 0] as [number, number, number] },

            // Bottom deck - Y = -0.3, evenly spaced (width 0.35)
            { id: 8, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, -0.3, -1.2] as [number, number, number] },
            { id: 9, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, -0.3, -0.6] as [number, number, number] },
            { id: 10, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, -0.3, 0] as [number, number, number] },
            { id: 11, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, -0.3, 0.6] as [number, number, number] },
            { id: 12, size: [3, 0.2, 0.35] as [number, number, number], targetPos: [0, -0.3, 1.2] as [number, number, number] },
        ].map((plank) => ({
            ...plank,
            startPos: [random(-3, 3), random(2, 6), random(-3, 3)] as [number, number, number],
        }));
    }, []);

    // 10 nails total (2 per plank at outer stringers)
    const nailPositions: [number, number, number][] = [];
    const stringerX = [-1.2, 1.2];
    const plankZ = [-1.2, -0.6, 0, 0.6, 1.2];

    plankZ.forEach(z => {
        stringerX.forEach(x => {
            nailPositions.push([x, 0.3, z]);
        });
    });

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.4} />
            <SpotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />

            {planks.map((plank) => (
                <Plank key={plank.id} {...plank} texture={texture} />
            ))}

            {/* 10 Nails (2 per plank at ends) */}
            {nailPositions.map((pos, i) => (
                <Nail key={`nail-${i}`} position={pos} index={i} />
            ))}

            {/* Hammer - visits all 10 nails sequentially */}
            <Hammer />
        </>
    );
}

// --- CINEMATIC SLOGAN OVERLAY ---
function CinematicSlogan() {
    const sloganRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sloganRef.current) return;

        gsap.fromTo(
            sloganRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: '#pallet-container',
                    start: '96% bottom',
                    end: '100% bottom',
                    scrub: 1,
                },
            }
        );
    }, []);

    return (
        <div
            ref={sloganRef}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4"
            style={{ opacity: 0 }}
        >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-wide"
                style={{
                    textShadow: '0 6px 12px rgba(0,0,0,0.6), 0 3px 6px rgba(0,0,0,0.4)',
                    letterSpacing: '0.05em'
                }}
            >
                Handcrafted Pallets with Finest Workmanship
            </h2>
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function PalletAssembly() {
    const [rotationEnabled, setRotationEnabled] = useState(false);

    return (
        <div id="pallet-container" className="h-[300vh] relative">
            {/* Fixed background */}
            <div className="fixed inset-0 bg-zinc-900 -z-50" />

            <div className="sticky top-0 h-screen w-full">
                <Canvas
                    shadows
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    className="bg-transparent"
                    style={{ pointerEvents: rotationEnabled ? 'auto' : 'none' }}
                >
                    <Suspense fallback={null}>
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

                {/* Cinematic Slogan */}
                <CinematicSlogan />

                {/* Rotation Hint */}
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
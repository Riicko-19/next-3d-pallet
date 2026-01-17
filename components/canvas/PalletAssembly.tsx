'use client';

import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, OrbitControls, Text } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- LOG COMPONENT ---
interface LogProps {
    position: [number, number, number];
    index: number;
    isHero: boolean;
}

function Log({ position, index, isHero }: LogProps) {
    const logRef = useRef<THREE.Group>(null);

    useGSAP(() => {
        if (!logRef.current) return;

        // Reset
        logRef.current.position.set(position[0], position[1], position[2]);
        logRef.current.rotation.set(0, 0, Math.PI / 2);
        logRef.current.scale.set(1, 1, 1);
        logRef.current.visible = true;

        if (isHero) {
            // Phase 1: Emerge
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#pallet-container',
                    start: '0% top',
                    end: '15% top',
                    scrub: 1,
                },
            });

            tl.to(logRef.current.position, {
                x: 0,
                y: 2,
                z: 0,
                ease: 'power2.inOut',
            })
                .to(logRef.current.rotation, {
                    z: 0,
                    ease: 'power2.inOut',
                }, "<");

            // Phase 2: Scale Down
            gsap.to(logRef.current.scale, {
                x: 0.001, y: 0.001, z: 0.001,
                scrollTrigger: {
                    trigger: '#pallet-container',
                    start: '15% top',
                    end: '20% top',
                    scrub: 1,
                }
            });

        } else {
            // Other logs fade
            gsap.to(logRef.current.scale, {
                x: 0, y: 0, z: 0,
                scrollTrigger: {
                    trigger: '#pallet-container',
                    start: '0% top',
                    end: '10% top',
                    scrub: 1,
                }
            });
        }
    }, [position, index, isHero]);

    return (
        <group ref={logRef}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, 2.5, 32]} />
                <meshStandardMaterial color="#E3CAA5" roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.255, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[0, -1.255, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>
        </group>
    );
}

// --- PLANK COMPONENT ---
interface PlankProps {
    clusterIndex: number;
    targetPos: [number, number, number];
    targetRotation: [number, number, number];
    size: [number, number, number];
    id: number;
    texture: THREE.Texture;
}

function Plank({ clusterIndex, targetPos, targetRotation, size, id, texture }: PlankProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        if (!meshRef.current) return;

        // 1. Initial State
        const clusterX = [-0.6, -0.2, 0.2, 0.6][clusterIndex];
        meshRef.current.position.set(clusterX, 2, 0);
        meshRef.current.rotation.set(0, 0, Math.PI / 2);
        meshRef.current.scale.set(0, 0, 0);

        // 2. Appear
        const appearTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '15% top',
                end: '25% top',
                scrub: 1,
            }
        });
        const zOffset = (Math.random() - 0.5) * 0.1;
        appearTl.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
            .to(meshRef.current.position, { z: zOffset, ease: "elastic.out(1, 0.3)" }, 0);

        // 3. Drop
        gsap.to(meshRef.current.position, {
            y: -0.5,
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '25% top',
                end: '35% top',
                scrub: 1,
            },
            ease: "bounce.out"
        });

        // 4. Assemble
        const flyTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '35% top',
                end: '80% top',
                scrub: 1,
            }
        });

        flyTl.to(meshRef.current.position, {
            x: targetPos[0],
            y: targetPos[1],
            z: targetPos[2],
            ease: "power2.inOut"
        }, 0)
            .to(meshRef.current.rotation, {
                x: targetRotation[0],
                y: targetRotation[1],
                z: targetRotation[2],
                ease: "power2.inOut"
            }, 0);

    }, [clusterIndex, targetPos, targetRotation]);

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial map={texture} roughness={0.6} envMapIntensity={1} />
        </mesh>
    );
}

// --- HAMMER ---
function Hammer({ nails }: { nails: [number, number, number][] }) {
    const groupRef = useRef<THREE.Group>(null);

    const playSound = () => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/sounds/hammer-hit.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }
    };

    useGSAP(() => {
        if (!groupRef.current) return;

        // Start Visible
        groupRef.current.position.set(0, 5, 0);
        groupRef.current.scale.set(1, 1, 1);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '80% top',
                end: '100% top',
                scrub: 1,
            }
        });

        nails.forEach((pos) => {
            tl.to(groupRef.current!.position, { x: pos[0], y: 1.2, z: pos[2], duration: 0.1 })
                .to(groupRef.current!.rotation, { x: Math.PI / 2.5, duration: 0.05, onStart: playSound })
                .to(groupRef.current!.rotation, { x: 0, duration: 0.05 });
        });

        // HOVER AT END (Don't fly away, so user can see it)
        tl.to(groupRef.current!.position, { y: 2, x: 2, duration: 0.5 });

    }, []);

    return (
        <group ref={groupRef}>
            <group rotation={[0, 0, 0]}>
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.4, 0.15, 0.15]} />
                    <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Arm */}
                <mesh position={[0, 0, 0.2]} rotation={[0.4, 0, 0]}>
                    <cylinderGeometry args={[0.12, 0.1, 2.5, 16]} />
                    <meshStandardMaterial color="#E0AC69" />
                </mesh>
                <mesh position={[0, 1.0, 0.5]} rotation={[0.4, 0, 0]}>
                    <cylinderGeometry args={[0.13, 0.125, 1.0, 16]} />
                    <meshStandardMaterial color="#1a365d" />
                </mesh>
            </group>
        </group>
    );
}

// --- NAIL (BIGGER & DARKER) ---
function Nail({ position, index }: { position: [number, number, number], index: number }) {
    const groupRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!groupRef.current) return;

        // Start above
        groupRef.current.position.set(position[0], 1.0, position[2]);
        groupRef.current.scale.set(0, 0, 0);

        const start = 80 + (index * 1);
        const tl = gsap.timeline({
            scrollTrigger: { trigger: '#pallet-container', start: `${start}% top`, end: `${start + 5}% top`, scrub: 1 }
        });

        // Target y=0.26 (Exactly flush with top surface)
        tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.1 })
            .to(groupRef.current.position, { y: 0.26, duration: 0.2 });
    }, [position, index]);

    return (
        <group ref={groupRef}>
            {/* BIGGER HEAD, DARKER SILVER */}
            <mesh position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 16]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        </group>
    );
}

// --- STAMP ---
function Stamp() {
    const textRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!textRef.current) return;
        textRef.current.scale.set(0, 0, 0);
        gsap.to(textRef.current.scale, {
            x: 1, y: 1, z: 1,
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '95% top',
                end: '100% top',
                scrub: 1
            }
        });
    }, []);

    return (
        <group ref={textRef} position={[1.55, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Text
                fontSize={0.25}
                color="#3E2723"
                anchorX="center"
                anchorY="middle"
            >
                AMBICA PETTERNS
            </Text>
        </group>
    );
}

// --- MAIN SCENE ---
function Scene({ setCompleted }: { setCompleted: (v: boolean) => void }) {
    const texture = useTexture('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');

    // 1. Logs
    const logs = useMemo(() => {
        const l = [];
        const baseX = 4;
        for (let row = 0; row < 6; row++) {
            const count = 6 - row;
            for (let i = 0; i < count; i++) {
                l.push({ pos: [baseX, 0.3 + (row * 0.55), (i * 0.6) - ((count - 1) * 0.3)], isHero: false });
            }
        }
        l[l.length - 1].isHero = true;
        l[l.length - 1].pos = [baseX, 0.3 + (5 * 0.55), 0];
        return l;
    }, []);

    // 2. Planks (SANDWICH MATH FIX)
    const planks = useMemo(() => {
        const p = [];
        const deckLength = 3.0;
        const thickness = 0.15;
        const width = 0.3;

        // Gap Math:
        // Stringer Height = 0.2 (Top at +0.1, Bottom at -0.1)
        // Top Deck Bottom = +0.1 -> Center = 0.1 + (0.15/2) = 0.175
        // Bottom Deck Top = -0.1 -> Center = -0.1 - (0.15/2) = -0.175

        // Top Deck
        [-0.8, -0.4, 0, 0.4, 0.8].forEach((z, i) => {
            p.push({
                id: `top-${i}`,
                clusterIndex: i % 4,
                size: [deckLength, thickness, width] as [number, number, number],
                targetPos: [0, 0.175, z] as [number, number, number], // FIXED HEIGHT
                targetRotation: [0, 0, 0] as [number, number, number],
            });
        });

        // Stringers (Length = Width of deck layers: 2.0 units)
        const stringerLength = 2.0; // Matches deck width span (-0.8 to 0.8 + board width)
        [-1.2, 0, 1.2].forEach((x, i) => {
            p.push({
                id: `str-${i}`,
                clusterIndex: (i + 1) % 4,
                size: [stringerLength, 0.2, 0.2] as [number, number, number],
                targetPos: [x, 0, 0] as [number, number, number],
                targetRotation: [0, Math.PI / 2, 0] as [number, number, number],
            });
        });

        // Bottom Deck
        [-0.8, -0.4, 0, 0.4, 0.8].forEach((z, i) => {
            p.push({
                id: `bot-${i}`,
                clusterIndex: (i + 2) % 4,
                size: [deckLength, thickness, width] as [number, number, number],
                targetPos: [0, -0.175, z] as [number, number, number], // FIXED HEIGHT
                targetRotation: [0, 0, 0] as [number, number, number],
            });
        });
        return p;
    }, []);

    const nailPositions = useMemo(() => {
        const n: [number, number, number][] = [];
        [-1.2, 0, 1.2].forEach(x => {
            [-0.8, -0.4, 0, 0.4, 0.8].forEach(z => n.push([x, 0.3, z]));
        });
        return n.sort((a, b) => a[0] - b[0]);
    }, []);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: '#pallet-container',
            start: '95% top',
            onEnter: () => setCompleted(true),
            onLeaveBack: () => setCompleted(false)
        });
    }, []);

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.6} />
            <SpotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <ContactShadows position={[0, -0.6, 0]} opacity={0.5} blur={2} />

            {logs.map((l, i) => (
                <Log key={i} position={l.pos as any} index={i} isHero={l.isHero} />
            ))}

            {planks.map((p) => (
                <Plank key={p.id} {...p} texture={texture} />
            ))}

            {nailPositions.map((pos, i) => <Nail key={i} position={pos} index={i} />)}
            <Hammer nails={nailPositions} />
            <Stamp />
        </>
    );
}

export default function PalletAssembly() {
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        ScrollTrigger.refresh();
    }, []);

    return (
        <div id="pallet-container" className="h-[500vh] relative bg-zinc-950">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <Canvas shadows camera={{ position: [6, 4, 6], fov: 40 }}>
                    <Suspense fallback={null}>
                        <OrbitControls autoRotate={completed} makeDefault />
                        <Scene setCompleted={setCompleted} />
                    </Suspense>
                </Canvas>

                <div className={`fixed bottom-10 left-0 w-full text-center z-50 transition-opacity duration-1000 ${completed ? 'opacity-100' : 'opacity-0'} mix-blend-difference pointer-events-none`}>
                    <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                        AMBICA PETTERNS
                    </h1>
                    <p className="text-xl text-zinc-300 mt-2 tracking-widest uppercase">
                        Finest Workmanship
                    </p>
                </div>
            </div>
        </div>
    );
}
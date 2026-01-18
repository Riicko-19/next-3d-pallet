'use client';

import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, OrbitControls, Text } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// --- LOG COMPONENT (Heavy inertia) ---
function Log({ position, index, isHero }: { position: [number, number, number], index: number, isHero: boolean }) {
    const logRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!logRef.current) return;
        logRef.current.position.set(position[0], position[1], position[2]);
        logRef.current.rotation.set(0, 0, Math.PI / 2);
        logRef.current.scale.set(1, 1, 1);

        if (isHero) {
            const tl = gsap.timeline({ scrollTrigger: { trigger: '#pallet-container', start: '0% top', end: '15% top', scrub: 1 } });
            tl.to(logRef.current.position, { x: 0, y: 2, z: 0, ease: 'power2.inOut' })
                .to(logRef.current.rotation, { z: 0, ease: 'power2.inOut' }, "<");
            gsap.to(logRef.current.scale, { x: 0.001, y: 0.001, z: 0.001, scrollTrigger: { trigger: '#pallet-container', start: '15% top', end: '20% top', scrub: 1 } });
        } else {
            gsap.to(logRef.current.scale, { x: 0, y: 0, z: 0, scrollTrigger: { trigger: '#pallet-container', start: '0% top', end: '10% top', scrub: 1 } });
        }
    }, [position, index, isHero]);
    return (
        <group ref={logRef}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, 2.5, 32]} />
                <meshStandardMaterial color="#E3CAA5" roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.255, 0]} rotation={[Math.PI / 2, 0, 0]}> <circleGeometry args={[0.3, 32]} /> <meshStandardMaterial color="#8D6E63" /> </mesh>
            <mesh position={[0, -1.255, 0]} rotation={[-Math.PI / 2, 0, 0]}> <circleGeometry args={[0.3, 32]} /> <meshStandardMaterial color="#8D6E63" /> </mesh>
        </group>
    );
}

// --- PLANK COMPONENT (Heavy inertia, ends at 75%) ---
function Plank({ clusterIndex, targetPos, targetRotation, size, texture }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    useGSAP(() => {
        if (!meshRef.current) return;

        const clusterX = [-0.6, -0.2, 0.2, 0.6][clusterIndex];
        meshRef.current.position.set(clusterX, 2, 0);
        meshRef.current.rotation.set(0, 0, Math.PI / 2);
        meshRef.current.scale.set(0, 0, 0);

        // Transition pause: logs end at 20%, planks start at 30% (10% breathing room)
        const appearTl = gsap.timeline({ scrollTrigger: { trigger: '#pallet-container', start: '30% top', end: '40% top', scrub: 3 } });
        appearTl.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
            .to(meshRef.current.position, { z: (Math.random() - 0.5) * 0.1, ease: "elastic.out(1, 0.3)" }, 0);

        gsap.to(meshRef.current.position, { y: -0.5, scrollTrigger: { trigger: '#pallet-container', start: '40% top', end: '50% top', scrub: 3 }, ease: "bounce.out" });

        // Assembly ends at 75%
        const flyTl = gsap.timeline({ scrollTrigger: { trigger: '#pallet-container', start: '50% top', end: '75% top', scrub: 3 } });
        flyTl.to(meshRef.current.position, { x: targetPos[0], y: targetPos[1], z: targetPos[2], ease: "power2.inOut" }, 0)
            .to(meshRef.current.rotation, { x: targetRotation[0], y: targetRotation[1], z: targetRotation[2], ease: "power2.inOut" }, 0);
    }, [clusterIndex, targetPos, targetRotation]);
    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial map={texture} roughness={0.6} />
        </mesh>
    );
}

// --- HAMMER (Moves across pallet, disappears at end) ---
function Hammer({ nails }: { nails: [number, number, number][] }) {
    const groupRef = useRef<THREE.Group>(null);
    const playSound = () => { if (typeof window !== 'undefined') { new Audio('/sounds/hammer-hit.mp3').play().catch(() => { }); } };

    useGSAP(() => {
        if (!groupRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '75% top',
                end: '90% top',
                scrub: 3
            }
        });

        // POP IN and move to first nail
        tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.05, ease: "power2.inOut" })
            .to(groupRef.current.position, { x: nails[0][0], y: 1.5, z: nails[0][2], duration: 0.05 });

        // HIT SEQUENCE - move across pallet hammering each nail
        nails.forEach((pos, index) => {
            if (index > 0) {
                // Move horizontally to next nail (X and Z only) - makes movement visible
                tl.to(groupRef.current!.position, { x: pos[0], z: pos[2], duration: 0.15, ease: "power2.inOut" });
            }
            // Hammer down (Y only)
            tl.to(groupRef.current!.position, { y: 0.8, duration: 0.08, ease: "power2.in" })
                .to(groupRef.current!.rotation, { x: Math.PI / 2.5, duration: 0.05, ease: "power2.inOut", onStart: playSound }, "<")
                // Hammer up (Y only)
                .to(groupRef.current!.position, { y: 1.5, duration: 0.08, ease: "power2.out" })
                .to(groupRef.current!.rotation, { x: 0, duration: 0.05, ease: "power2.inOut" }, "<");
        });

        // POP OUT - hammer disappears
        tl.to(groupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.1, ease: "power2.inOut" });
    }, []);

    // JSX Safety Net - NO GHOSTS
    return (
        <group ref={groupRef} position={[0, 1.5, 0]} scale={[0, 0, 0]}>
            <group rotation={[0, 0, 0]}>
                {/* Handle - Reduced to 1/4 original size */}
                <mesh position={[0, 0.625, 0]}>
                    <cylinderGeometry args={[0.07, 0.07, 1.25, 16]} />
                    <meshStandardMaterial color="#8B4513" roughness={0.7} />
                </mesh>
                {/* Head - Reduced to 1/4 original size */}
                <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[0.45, 0.18, 0.18]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
                </mesh>
            </group>
        </group>
    );
}

// --- TOP NAIL (Hammered, starts at 75%) ---
function TopNail({ position, index }: { position: [number, number, number], index: number }) {
    const groupRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!groupRef.current) return;

        const start = 75 + (index * 0.25);  // Start earlier, tighter stagger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: `${start}% top`,
                end: `${start + 1.5}% top`,  // Shorter duration
                scrub: 3
            }
        });

        // Scale up and drive down - nail heads sit ON TOP of planks
        tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.1, ease: "power2.inOut" })
            .to(groupRef.current.position, { y: 0.25, duration: 0.3, ease: "power2.inOut" });
    }, [position, index]);

    return (
        <group ref={groupRef} position={[position[0], 1.0, position[2]]} scale={[0, 0, 0]}>
            {/* Nail head */}
            <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
                <meshStandardMaterial color="#6a6a6a" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Ridged shaft */}
            {[...Array(8)].map((_, i) => (
                <mesh key={i} position={[0, -0.05 - (i * 0.04), 0]}>
                    <cylinderGeometry args={[
                        i % 2 === 0 ? 0.028 : 0.022,
                        i % 2 === 0 ? 0.022 : 0.028,
                        0.04, 12
                    ]} />
                    <meshStandardMaterial color="#7a7a5a" metalness={0.85} roughness={0.25} />
                </mesh>
            ))}
            {/* Point */}
            <mesh position={[0, -0.38, 0]}>
                <coneGeometry args={[0.022, 0.05, 8]} />
                <meshStandardMaterial color="#7a7a5a" metalness={0.85} roughness={0.25} />
            </mesh>
        </group>
    );
}

// --- BOTTOM NAIL (Auto pop-in at 75%, no hammering) ---
function BottomNail({ position, index }: { position: [number, number, number], index: number }) {
    const groupRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!groupRef.current) return;

        // Pop in at 75% when planks finish
        const start = 75 + (index * 0.3);
        gsap.to(groupRef.current.scale, {
            x: 1, y: 1, z: 1,
            scrollTrigger: {
                trigger: '#pallet-container',
                start: `${start}% top`,
                end: `${start + 2}% top`,
                scrub: 3
            },
            ease: "power2.inOut"
        });
    }, [position, index]);

    return (
        <group ref={groupRef} position={[position[0], position[1], position[2]]} scale={[0, 0, 0]}>
            {/* Nail head */}
            <mesh position={[0, -0.02, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
                <meshStandardMaterial color="#6a6a6a" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Ridged shaft */}
            {[...Array(8)].map((_, i) => (
                <mesh key={i} position={[0, 0.05 + (i * 0.04), 0]}>
                    <cylinderGeometry args={[
                        i % 2 === 0 ? 0.028 : 0.022,
                        i % 2 === 0 ? 0.022 : 0.028,
                        0.04, 12
                    ]} />
                    <meshStandardMaterial color="#7a7a5a" metalness={0.85} roughness={0.25} />
                </mesh>
            ))}
            {/* Point */}
            <mesh position={[0, 0.38, 0]}>
                <coneGeometry args={[0.022, 0.05, 8]} />
                <meshStandardMaterial color="#7a7a5a" metalness={0.85} roughness={0.25} />
            </mesh>
        </group>
    );
}

// --- STAMP ---
function Stamp() {
    const textRef = useRef<THREE.Group>(null);
    useGSAP(() => {
        if (!textRef.current) return;
        gsap.to(textRef.current.scale, { x: 1, y: 1, z: 1, scrollTrigger: { trigger: '#pallet-container', start: '95% top', end: '100% top', scrub: 3 } });
    }, []);
    return (
        <group ref={textRef} position={[1.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0, 0, 0]}>
            <Text fontSize={0.25} color="#3E2723" anchorX="center" anchorY="middle">AMBICA PETTERNS</Text>
        </group>
    );
}

// --- MAIN SCENE ---
function Scene({ setCompleted }: { setCompleted: (v: boolean) => void }) {
    const texture = useTexture('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');

    const logs = useMemo(() => {
        const l = [];
        const baseX = 4;
        for (let row = 0; row < 6; row++) {
            const count = 6 - row;
            for (let i = 0; i < count; i++) { l.push({ pos: [baseX, 0.3 + (row * 0.55), (i * 0.6) - ((count - 1) * 0.3)], isHero: false }); }
        }
        l[l.length - 1].isHero = true;
        l[l.length - 1].pos = [baseX, 0.3 + (5 * 0.55), 0];
        return l;
    }, []);

    const planks = useMemo(() => {
        const p = [];
        const deckLength = 3.0;
        const thickness = 0.15;
        const width = 0.3;

        [-0.8, -0.4, 0, 0.4, 0.8].forEach((z, i) => {
            p.push({ id: `top-${i}`, clusterIndex: i % 4, size: [deckLength, thickness, width], targetPos: [0, 0.175, z], targetRotation: [0, 0, 0] });
        });

        // Stringers (CRITICAL: 2.0 for flush)
        [-1.2, 0, 1.2].forEach((x, i) => {
            p.push({ id: `str-${i}`, clusterIndex: (i + 1) % 4, size: [2.0, 0.2, 0.2], targetPos: [x, 0, 0], targetRotation: [0, Math.PI / 2, 0] });
        });

        [-0.8, -0.4, 0, 0.4, 0.8].forEach((z, i) => {
            p.push({ id: `bot-${i}`, clusterIndex: (i + 2) % 4, size: [deckLength, thickness, width], targetPos: [0, -0.175, z], targetRotation: [0, 0, 0] });
        });
        return p;
    }, []);

    const { topNailPositions, bottomNailPositions } = useMemo(() => {
        const top: [number, number, number][] = [];
        const bottom: [number, number, number][] = [];

        // Generate positions
        [-1.2, 0, 1.2].forEach(x => {
            [-0.8, -0.4, 0, 0.4, 0.8].forEach(z => {
                top.push([x, 0.3, z]);
                bottom.push([x, -0.26, z]);
            });
        });

        // Randomize top nails for dynamic hammering pattern
        const randomizedTop = [...top].sort(() => Math.random() - 0.5);

        return { topNailPositions: randomizedTop, bottomNailPositions: bottom };
    }, []);

    useGSAP(() => {
        ScrollTrigger.create({ trigger: '#pallet-container', start: '95% top', onEnter: () => setCompleted(true), onLeaveBack: () => setCompleted(false) });
    }, []);

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={1.0} />
            <SpotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <ContactShadows position={[0, -0.6, 0]} opacity={0.5} blur={2} />

            {logs.map((l, i) => <Log key={i} position={l.pos as any} index={i} isHero={l.isHero} />)}
            {planks.map((p) => <Plank key={p.id} {...p} texture={texture} />)}

            {topNailPositions.map((pos, i) => <TopNail key={`top-${i}`} position={pos} index={i} />)}
            {bottomNailPositions.map((pos, i) => <BottomNail key={`bot-${i}`} position={pos} index={i} />)}
            <Hammer nails={topNailPositions} />
            <Stamp />
        </>
    );
}

export default function PalletAssembly() {
    const [completed, setCompleted] = useState(false);
    useEffect(() => { ScrollTrigger.refresh(); }, []);
    return (
        <div id="pallet-container" className="h-[1000vh] relative bg-zinc-950">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <Canvas shadows camera={{ position: [6, 4, 6], fov: 40 }}>
                    <Suspense fallback={null}>
                        <OrbitControls autoRotate={completed} makeDefault />
                        <Scene setCompleted={setCompleted} />
                    </Suspense>
                </Canvas>
                <div className={`fixed bottom-10 left-0 w-full text-center z-50 transition-opacity duration-1000 ${completed ? 'opacity-100' : 'opacity-0'} mix-blend-difference pointer-events-none`}>
                    <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">AMBICA PETTERNS</h1>
                    <p className="text-xl text-zinc-300 mt-2 tracking-widest uppercase">Finest Workmanship</p>
                </div>
            </div>
        </div>
    );
}
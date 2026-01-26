'use client';

import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, SpotLight, useTexture, ContactShadows, OrbitControls, Text, MeshReflectorMaterial, Sparkles } from '@react-three/drei';
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
            // Keep log visible during hacksaw cutting, fade at 23-27%
            gsap.to(logRef.current.scale, { x: 0.001, y: 0.001, z: 0.001, scrollTrigger: { trigger: '#pallet-container', start: '23% top', end: '27% top', scrub: 1 } });
        } else {
            gsap.to(logRef.current.scale, { x: 0, y: 0, z: 0, scrollTrigger: { trigger: '#pallet-container', start: '0% top', end: '10% top', scrub: 1 } });
        }
    }, [position, index, isHero]);
    return (
        <group ref={logRef}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.3, 0.3, 5.0, 32]} />
                <meshStandardMaterial color="#E3CAA5" roughness={0.6} />
            </mesh>
            <mesh position={[0, 2.51, 0]} rotation={[Math.PI / 2, 0, 0]}> <circleGeometry args={[0.3, 32]} /> <meshStandardMaterial color="#8D6E63" /> </mesh>
            <mesh position={[0, -2.51, 0]} rotation={[-Math.PI / 2, 0, 0]}> <circleGeometry args={[0.3, 32]} /> <meshStandardMaterial color="#8D6E63" /> </mesh>
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

        // Planks appear after hacksaw cutting (27%)
        const appearTl = gsap.timeline({ scrollTrigger: { trigger: '#pallet-container', start: '27% top', end: '37% top', scrub: 3 } });
        appearTl.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
            .to(meshRef.current.position, { z: (Math.random() - 0.5) * 0.1, ease: "elastic.out(1, 0.3)" }, 0);

        gsap.to(meshRef.current.position, { y: -0.5, scrollTrigger: { trigger: '#pallet-container', start: '37% top', end: '47% top', scrub: 3 }, ease: "bounce.out" });

        // Assembly ends at 75%
        const flyTl = gsap.timeline({ scrollTrigger: { trigger: '#pallet-container', start: '47% top', end: '75% top', scrub: 3 } });
        flyTl.to(meshRef.current.position, { x: targetPos[0], y: targetPos[1], z: targetPos[2], ease: "power2.inOut" }, 0)
            .to(meshRef.current.rotation, { x: targetRotation[0], y: targetRotation[1], z: targetRotation[2], ease: "power2.inOut" }, 0);
    }, [clusterIndex, targetPos, targetRotation]);
    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial
                map={texture}
                color="#daa520"
                roughness={0.9}
                metalness={0}
            />
        </mesh>
    );
}

// --- HACKSAW (Cuts the hero log into planks) ---
function Hacksaw() {
    const groupRef = useRef<THREE.Group>(null);

    useGSAP(() => {
        if (!groupRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '15% top',
                end: '27% top',
                scrub: 1
            }
        });

        // POP IN above log (not inside it)
        tl.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.05, ease: "power2.inOut" })
            .to(groupRef.current.position, { y: 2.6, duration: 0.1 });

        // VERTICAL CUTTING MOTION with back-and-forth sawing (20-25%)
        // Saw moves DOWN while also moving back and forth for realistic cutting
        for (let i = 0; i < 5; i++) {
            tl.to(groupRef.current.position, {
                y: 2.6 - ((i + 1) * 0.24), // Move down incrementally
                z: 0.15, // Forward
                duration: 0.05,
                ease: "power1.inOut"
            })
                .to(groupRef.current.position, {
                    z: -0.15, // Backward
                    duration: 0.05,
                    ease: "power1.inOut"
                });
        }

        // Final cut to bottom and return to center
        tl.to(groupRef.current.position, { y: 1.4, z: 0, duration: 0.05 });

        // POP OUT after cutting
        tl.to(groupRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.1, ease: "power2.inOut" });
    }, []);

    // JSX Safety Net - NO GHOSTS
    return (
        <group ref={groupRef} position={[0, 3, 0]} scale={[0, 0, 0]}>
            {/* Blade - horizontal with teeth facing down */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <boxGeometry args={[1.5, 0.02, 0.15]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Saw teeth (visual detail) */}
            {[...Array(15)].map((_, i) => (
                <mesh key={i} position={[-0.7 + (i * 0.1), -0.02, 0]}>
                    <boxGeometry args={[0.02, 0.03, 0.15]} />
                    <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.3} />
                </mesh>
            ))}
            {/* Handle */}
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
                <meshStandardMaterial color="#8B4513" roughness={0.7} />
            </mesh>
            {/* Frame connecting blade to handle */}
            <mesh position={[0.75, 0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
                <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0.75, -0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
                <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.4} />
            </mesh>
        </group>
    );
}

// --- CUT LINE (Visible cut on log as hacksaw saws down) ---
function CutLine() {
    const meshRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        if (!meshRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '18% top',
                end: '25% top',
                scrub: 1
            }
        });

        // Cut line grows from top to bottom as saw moves down
        tl.to(meshRef.current.scale, { y: 1, duration: 1, ease: "power1.inOut" });

        // Fade out cut line with the log (25-27%)
        gsap.to(meshRef.current.scale, {
            x: 0, y: 0, z: 0,
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '25% top',
                end: '27% top',
                scrub: 1
            }
        });
    }, []);

    return (
        <mesh ref={meshRef} position={[0, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 0, 1]}>
            <boxGeometry args={[0.6, 0.6, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" />
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
                {/* MESH A: Grip - Black Rubber (Bottom 40% of handle) */}
                <mesh position={[0, -0.24, 0]}>
                    <cylinderGeometry args={[0.045, 0.05, 0.48, 20]} />
                    <meshStandardMaterial color="#222222" roughness={0.95} />
                </mesh>

                {/* MESH B: Shaft - Wood/Fiberglass (Top 60% of handle) */}
                <mesh position={[0, 0.36, 0]}>
                    <cylinderGeometry args={[0.04, 0.045, 0.72, 20]} />
                    <meshStandardMaterial color="#D4AA6D" roughness={0.5} />
                </mesh>

                {/* MESH C: Head Center - Horizontal Cylindrical Hub */}
                <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.065, 0.065, 0.3, 20]} />
                    <meshStandardMaterial color="#C8C8C8" metalness={1} roughness={0.2} />
                </mesh>

                {/* MESH D: Striking Face - Cylindrical Hammer Face (Front +Z) */}
                <mesh position={[0, 0.72, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.08, 0.07, 0.35, 20]} />
                    <meshStandardMaterial color="#D0D0D0" metalness={1} roughness={0.15} />
                </mesh>

                {/* Striking face flat end cap */}
                <mesh position={[0, 0.72, 0.425]} rotation={[Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.08, 20]} />
                    <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0.1} />
                </mesh>

                {/* MESH E: The Claw - Curved and Tapered (Back -Z) */}
                <group position={[0, 0.72, -0.2]} rotation={[-0.4, 0, 0]}>
                    {/* Main claw body - thicker at base */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.16, 0.15, 0.12]} />
                        <meshStandardMaterial color="#C8C8C8" metalness={1} roughness={0.2} />
                    </mesh>

                    {/* Claw transition/neck */}
                    <mesh position={[0, -0.09, 0]}>
                        <boxGeometry args={[0.14, 0.08, 0.1]} />
                        <meshStandardMaterial color="#C8C8C8" metalness={1} roughness={0.2} />
                    </mesh>

                    {/* Left prong - curved outward */}
                    <mesh position={[-0.045, -0.16, 0]} rotation={[0.1, 0, 0.2]} scale={[1, 1.2, 0.7]}>
                        <boxGeometry args={[0.045, 0.12, 0.06]} />
                        <meshStandardMaterial color="#D0D0D0" metalness={1} roughness={0.15} />
                    </mesh>

                    {/* Right prong - curved outward */}
                    <mesh position={[0.045, -0.16, 0]} rotation={[0.1, 0, -0.2]} scale={[1, 1.2, 0.7]}>
                        <boxGeometry args={[0.045, 0.12, 0.06]} />
                        <meshStandardMaterial color="#D0D0D0" metalness={1} roughness={0.15} />
                    </mesh>

                    {/* Claw tips - pointed ends */}
                    <mesh position={[-0.045, -0.23, 0]} rotation={[0, 0, 0]} scale={[0.8, 0.6, 0.8]}>
                        <coneGeometry args={[0.025, 0.04, 8]} />
                        <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.045, -0.23, 0]} rotation={[0, 0, 0]} scale={[0.8, 0.6, 0.8]}>
                        <coneGeometry args={[0.025, 0.04, 8]} />
                        <meshStandardMaterial color="#E0E0E0" metalness={1} roughness={0.1} />
                    </mesh>
                </group>
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

// --- MOVING BACKGROUND (Wireframe Tunnel) ---
function MovingBackground() {
    const cylinderRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        if (!cylinderRef.current) return;

        // Rotate the cylinder background as user scrolls
        gsap.to(cylinderRef.current.rotation, {
            y: Math.PI,
            scrollTrigger: {
                trigger: '#pallet-container',
                start: '0% top',
                end: '100% top',
                scrub: 3
            },
            ease: "none"
        });
    }, []);

    return (
        <mesh ref={cylinderRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[30, 30, 100, 32, 1, true]} />
            <meshBasicMaterial
                color="#222222"
                wireframe={true}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

// --- CAMERA RIG (Continuous Orbital Camera) ---
function CameraRig() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('pallet-container');
            if (!container) return;

            const scrollY = window.scrollY;
            const maxScroll = container.scrollHeight - window.innerHeight;
            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        const angle = scrollProgress * Math.PI * 2; // Full 360 degree rotation
        const radius = 14;

        // Calculate target position on circular orbit
        const targetX = Math.sin(angle) * radius;
        const targetZ = Math.cos(angle) * radius;
        const targetY = 5; // Steady elevated angle

        // Smoothly interpolate current camera position to target (cinematic damping)
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

        // Always look at pallet center
        state.camera.lookAt(0, 0, 0);
    });

    return null;
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
        const p: Array<{
            id: string;
            clusterIndex: number;
            size: [number, number, number];
            targetPos: [number, number, number];
            targetRotation: [number, number, number];
        }> = [];
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
            {/* DARK WAREHOUSE ATMOSPHERE - OPTIMIZED */}

            {/* Simple dark floor - much faster than reflective material */}
            <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {/* OPTIMIZED LIGHTING */}

            {/* Basic environment */}
            <Environment preset="city" environmentIntensity={0.3} />

            {/* Ambient light */}
            <ambientLight intensity={0.3} />

            {/* Key light - hard shadow from top-right */}
            <SpotLight
                position={[10, 10, 10]}
                angle={0.5}
                penumbra={1}
                intensity={4}
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
            />

            {/* Rim light - amber accent from behind */}
            <pointLight
                position={[-5, 2, -10]}
                intensity={3}
                color="#f59e0b"
            />

            {/* 3x3 Grid of Warm Industrial Overhead Lights */}
            {[-10, 0, 10].map((x) =>
                [-10, 0, 10].map((z) => (
                    <SpotLight
                        key={`light-${x}-${z}`}
                        position={[x, 20, z]}
                        angle={0.4}
                        penumbra={1}
                        intensity={2}
                        color="#ff9f43"
                        castShadow
                        shadow-mapSize={[512, 512]}
                    />
                ))
            )}

            <ContactShadows position={[0, -0.6, 0]} opacity={0.6} blur={2.5} />

            {logs.map((l, i) => <Log key={i} position={l.pos as any} index={i} isHero={l.isHero} />)}
            {planks.map((p) => <Plank key={p.id} {...p} texture={texture} />)}
            <Hacksaw />
            <CutLine />

            {topNailPositions.map((pos, i) => <TopNail key={`top-${i}`} position={pos} index={i} />)}
            {bottomNailPositions.map((pos, i) => <BottomNail key={`bot-${i}`} position={pos} index={i} />)}
            <Hammer nails={topNailPositions} />
            <Stamp />
        </>
    );
}

// Export Scene and CameraRig components for direct use in page.tsx
export { Scene, CameraRig };

export default function PalletAssembly() {
    const [completed, setCompleted] = useState(false);
    useEffect(() => { ScrollTrigger.refresh(); }, []);
    return (
        <div id="pallet-container" className="h-[1000vh] relative bg-zinc-950">
            <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
                <Canvas shadows camera={{ position: [0, 5, 14], fov: 60 }} className="pointer-events-auto">
                    <Suspense fallback={null}>
                        <CameraRig />
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
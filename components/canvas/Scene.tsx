'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function Scene() {
    return (
        <div className="h-screen w-full">
            <Canvas>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <mesh>
                        <boxGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </Suspense>
            </Canvas>
        </div>
    );
}

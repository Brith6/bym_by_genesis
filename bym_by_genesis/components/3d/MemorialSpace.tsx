'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text3D, Center } from '@react-three/drei';
import { Suspense } from 'react';
import { Memory } from '@/lib/types';

interface MemorialSpace3DProps {
    memorialName: string;
    memories: Memory[];
    primaryColor: string;
    secondaryColor: string;
}

function MemoryOrb({ position, memory, color }: { position: [number, number, number]; memory: Memory; color: string }) {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={position}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}

function Scene({ memorialName, memories, primaryColor }: MemorialSpace3DProps) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color={primaryColor} />

            {/* Stars background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Central memorial name */}
            <Center>
                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                    <Text3D
                        font="/fonts/helvetiker_regular.typeface.json"
                        size={0.5}
                        height={0.1}
                        curveSegments={12}
                    >
                        {memorialName}
                        <meshStandardMaterial
                            color={primaryColor}
                            emissive={primaryColor}
                            emissiveIntensity={0.3}
                        />
                    </Text3D>
                </Float>
            </Center>

            {/* Memory orbs in a circle */}
            {memories.slice(0, 12).map((memory, index) => {
                const angle = (index / Math.min(memories.length, 12)) * Math.PI * 2;
                const radius = 5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.sin(index) * 2;

                return (
                    <MemoryOrb
                        key={memory._id}
                        position={[x, y, z]}
                        memory={memory}
                        color={primaryColor}
                    />
                );
            })}

            {/* Camera controls */}
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
            />
        </>
    );
}

export default function MemorialSpace3D(props: MemorialSpace3DProps) {
    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden glass">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <Suspense fallback={null}>
                    <Scene {...props} />
                </Suspense>
            </Canvas>
        </div>
    );
}

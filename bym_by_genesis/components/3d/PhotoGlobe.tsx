'use client';

import { useMemo, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, useVideoTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Memory } from '@/lib/types';

interface PhotoGlobeProps {
    memories: Memory[];
    onSelectMemory: (memory: Memory) => void;
}

function VideoMaterial({ url }: { url: string }) {
    const texture = useVideoTexture(url, { 
        start: true, 
        muted: true, 
        loop: true,
        crossOrigin: 'Anonymous'
    });
    return <meshBasicMaterial map={texture} side={THREE.DoubleSide} />;
}

function ImageMaterial({ url }: { url: string }) {
    const texture = useTexture(url);
    return <meshBasicMaterial map={texture} side={THREE.DoubleSide} />;
}

function Photo({ position, rotation, url, type, onClick }: { position: [number, number, number], rotation: [number, number, number], url: string, type: string, onClick: () => void }) {
    // Check for dead blob URLs (which cause crashes on reload)
    const isDeadBlob = url && url.startsWith('blob:');
    
    const shouldUseVideo = type === 'video' && !isDeadBlob;
    
    const imageUrl = isDeadBlob 
        ? 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=1000&auto=format&fit=crop' 
        : (url || 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=1000&auto=format&fit=crop');

    const [hovered, setHover] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            <mesh 
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.2 : 1}
            >
                <planeGeometry args={[1.5, 1]} />
                {shouldUseVideo ? (
                    <Suspense fallback={<meshBasicMaterial color="black" />}>
                        <VideoMaterial url={url} />
                    </Suspense>
                ) : (
                    <ImageMaterial url={imageUrl} />
                )}
            </mesh>
            {/* Border */}
            <mesh position={[0, 0, -0.01]} scale={hovered ? 1.2 : 1}>
                <planeGeometry args={[1.6, 1.1]} />
                <meshBasicMaterial color="white" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

function Globe({ memories, onSelectMemory }: PhotoGlobeProps) {
    const radius = 8;

    // Fibonacci Sphere algorithm to distribute points evenly
    const positions = useMemo(() => {
        const phi = Math.PI * (3 - Math.sqrt(5));
        return memories.map((_, i) => {
            const y = 1 - (i / (Math.max(memories.length, 1) - 1)) * 2 || 0; // Handle single item case
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            const pos = new THREE.Vector3(x * radius, y * radius, z * radius);
            
            // Calculate rotation to face center (0,0,0)
            // We want the image to face OUTWARDS, so we look at the position from the center
            const lookAtPos = pos.clone().multiplyScalar(2); 
            const matrix = new THREE.Matrix4().lookAt(lookAtPos, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
            const rot = new THREE.Euler();
            rot.setFromRotationMatrix(matrix);
            
            return { pos: [pos.x, pos.y, pos.z] as [number, number, number], rot: [rot.x, rot.y, rot.z] as [number, number, number] };
        });
    }, [memories]);

    return (
        <group>
            {memories.map((memory, i) => (
                <Photo 
                    key={memory._id}
                    position={positions[i].pos}
                    rotation={positions[i].rot}
                    url={memory.mediaUrl!}
                    type={memory.type}
                    onClick={() => onSelectMemory(memory)}
                />
            ))}
        </group>
    );
}

function Loader() {
    return <Html center><div className="text-white">Chargement du globe...</div></Html>;
}

export default function PhotoGlobe({ memories, onSelectMemory }: PhotoGlobeProps) {
    const validMemories = memories.filter(m => (m.type === 'photo' || m.type === 'video') && m.mediaUrl);

    if (validMemories.length === 0) {
        return (
            <div className="h-[600px] flex items-center justify-center glass rounded-3xl">
                <p className="text-gray-300">Ajoutez des photos ou vidéos pour voir le globe 3D</p>
            </div>
        );
    }

    return (
        <div className="h-[600px] w-full cursor-move bg-black/20 rounded-3xl overflow-hidden border border-white/10">
            <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
                <Suspense fallback={<Loader />}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Globe memories={validMemories} onSelectMemory={onSelectMemory} />

                    <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} minDistance={5} maxDistance={30} />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-white/50 text-sm bg-black/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                    🌍 Globe Interactif - Cliquez sur une photo
                </p>
            </div>
        </div>
    );
}

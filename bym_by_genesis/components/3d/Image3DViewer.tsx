'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Center, Environment, Float, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect } from 'react';

function MediaFrame({ url, type }: { url: string, type: 'photo' | 'video' }) {
  // Check for dead blob URLs
  const isDeadBlob = url && url.startsWith('blob:');

  // Use a fallback if url is missing or invalid to prevent crash
  const safeUrl = isDeadBlob 
    ? 'https://images.unsplash.com/photo-1609743522653-52354461eb27?q=80&w=1000&auto=format&fit=crop' // Broken image placeholder
    : (url || 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=1000&auto=format&fit=crop');
  
  let texture;
  
  if (type === 'video') {
      // Video texture handling
      texture = useVideoTexture(safeUrl, {
          unsuspend: 'canplay',
          muted: false,
          loop: true,
          start: true,
          crossOrigin: 'Anonymous'
      });
  } else {
      // Photo texture handling
      texture = useLoader(THREE.TextureLoader, safeUrl);
  }
  
  // Calculate aspect ratio to size the plane correctly
  // Default to square if dimensions missing, but texture usually has them
  // For video, texture.image is the video element
  const aspect = texture.image ? (texture.image.videoWidth || texture.image.width) / (texture.image.videoHeight || texture.image.height) : 1;
  
  // Base scale
  const scale = 3.5;
  let width = scale;
  let height = scale;

  // Adjust dimensions to fit within a reasonable box while maintaining aspect ratio
  if (aspect > 1) {
    height = scale / aspect;
  } else {
    width = scale * aspect;
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* The Media (Photo or Video) */}
        <mesh>
          <boxGeometry args={[width, height, 0.05]} />
          <meshStandardMaterial map={texture} roughness={0.2} metalness={0.1} />
        </mesh>
        
        {/* The Back of the frame */}
        <mesh position={[0, 0, -0.026]}>
          <boxGeometry args={[width, height, 0.01]} />
          <meshStandardMaterial color="#e2e2e2" roughness={0.8} />
        </mesh>

        {/* White Border/Frame effect */}
        <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[width + 0.2, height + 0.2, 0.02]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
        </mesh>

        {/* Play icon for video (optional, maybe not needed if it auto plays) */}
      </group>
    </Float>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" wireframe />
    </mesh>
  );
}

export default function Image3DViewer({ imageUrl, type = 'photo' }: { imageUrl: string, type?: 'photo' | 'video' }) {
  return (
    <div className="w-full h-full min-h-[400px] cursor-move">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Center>
            <MediaFrame url={imageUrl} type={type} />
          </Center>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={2}
            maxDistance={10}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

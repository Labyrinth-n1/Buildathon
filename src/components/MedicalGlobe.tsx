import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Float, Points, PointMaterial } from "@react-three/drei";
import { Points as ThreePoints } from "three";
import * as random from "maath/random/dist/maath-random.esm";

function Particles() {
  const ref = useRef<ThreePoints>(null);
  const sphere = random.inSphere(new Float32Array(3000), { radius: 10 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00F5FF"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
}

export function MedicalGlobe() {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Main Globe Core */}
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial 
            color="#020408"
            emissive="#00F5FF"
            emissiveIntensity={0.1}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </Sphere>
        
        {/* Holographic Layer */}
        <Sphere args={[2.05, 64, 64]}>
          <meshStandardMaterial 
            color="#00F5FF"
            wireframe
            transparent
            opacity={0.05}
          />
        </Sphere>

        {/* Atmospheric Glow */}
        <Sphere args={[2.5, 64, 64]}>
          <meshStandardMaterial 
            color="#00F5FF"
            transparent
            opacity={0.02}
            depthWrite={false}
          />
        </Sphere>
      </group>
    </Float>
  );
}

export function MedicalGlobeScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00F5FF" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#A855F7" />
      <Particles />
      <MedicalGlobe />
    </>
  );
}

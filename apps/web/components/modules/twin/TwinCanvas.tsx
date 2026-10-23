'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulationStore } from '@/lib/store/useSimulationStore';

// Farm Plot Component (Interactive 3D Field Mesh)
function FarmPlot({
  id,
  name,
  position,
  size,
  color,
  cropType,
  moisturePercent,
  ndviScore,
  isSelected,
  onSelect,
}: {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  cropType: string;
  moisturePercent: number;
  ndviScore: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { overlayMode, isIrrigationRunning } = useSimulationStore();

  // Dynamic overlay color computation
  let plotColor = color;
  if (overlayMode === 'moisture') {
    // Moisture gradient: dry ochre (#926A38) -> saturated blue-green (#15803D)
    plotColor = moisturePercent > 40 ? '#15803D' : moisturePercent > 30 ? '#1E3A2B' : '#854D0E';
  } else if (overlayMode === 'ndvi') {
    // NDVI gradient: healthy emerald (#10B981) -> stressed (#CA8A04)
    plotColor = ndviScore > 0.7 ? '#10B981' : '#EAB308';
  } else if (overlayMode === 'irrigation') {
    plotColor = '#0F2C20';
  }

  return (
    <group position={position}>
      {/* Terrain Base Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        receiveShadow
        castShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered ? '#22C55E' : plotColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Selected Boundary Glow Box */}
      {isSelected ? (
        <lineSegments position={[0, size[1] / 2 + 0.02, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(size[0] + 0.2, 0.1, size[2] + 0.2)]} />
          <lineBasicMaterial color="#34D399" linewidth={3} />
        </lineSegments>
      ) : null}

      {/* Drip Irrigation Lines Overlay */}
      {overlayMode === 'irrigation' || isIrrigationRunning ? (
        <group position={[0, size[1] / 2 + 0.05, 0]}>
          {[-size[2] / 3, 0, size[2] / 3].map((zPos, idx) => (
            <mesh key={idx} position={[0, 0, zPos]}>
              <boxGeometry args={[size[0] * 0.9, 0.04, 0.04]} />
              <meshBasicMaterial color={isIrrigationRunning ? '#38BDF8' : '#0284C7'} />
            </mesh>
          ))}
        </group>
      ) : null}

      {/* Procedural Crop Canopy Rows */}
      <group position={[0, size[1] / 2 + 0.1, 0]}>
        {[-size[0] / 3, 0, size[0] / 3].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, size[2] * 0.85]} />
            <meshStandardMaterial
              color={cropType === 'Wheat' ? '#166534' : '#14532D'}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* 3D Billboard Label */}
      <Text
        position={[0, size[1] / 2 + 0.8, 0]}
        fontSize={0.45}
        color={isSelected ? '#34D399' : '#F1F6F3'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#090D0B"
      >
        {name}
      </Text>
    </group>
  );
}

// Weather Particle Sim (Rain Effect when heavy_rain active)
function WeatherParticles() {
  const { weatherSimMode } = useSimulationStore();
  const rainRef = useRef<THREE.Points>(null);

  const particleCount = weatherSimMode === 'heavy_rain' ? 600 : 0;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 40;
      pos[i + 1] = Math.random() * 20;
      pos[i + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!rainRef.current || weatherSimMode !== 'heavy_rain') return;
    const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= delta * 15;
      if (positions[i] < 0) positions[i] = 20;
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (weatherSimMode !== 'heavy_rain') return null;

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#7DD3FC" size={0.15} transparent opacity={0.7} />
    </points>
  );
}

// Main 3D Scene Assembly
function Scene() {
  const { cameraMode, selectedPlotId, setSelectedPlotId, weatherSimMode } = useSimulationStore();

  // Dynamic lighting based on weather simulation mode
  const ambientIntensity =
    weatherSimMode === 'heatwave'
      ? 1.2
      : weatherSimMode === 'heavy_rain'
      ? 0.4
      : weatherSimMode === 'drought'
      ? 1.0
      : 0.8;

  const lightColor =
    weatherSimMode === 'heatwave'
      ? '#FED7AA'
      : weatherSimMode === 'drought'
      ? '#FDE68A'
      : '#FFFFFF';

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={lightColor} />
      <directionalLight
        position={[15, 25, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <WeatherParticles />

      {/* Ground Substrate Grid */}
      <Grid
        position={[0, -0.2, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1C2E24"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#264233"
        fadeDistance={30}
      />

      {/* Parcel 1: North Sector Alpha (Wheat HD-3086, 8.4 ha) */}
      <FarmPlot
        id="d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c"
        name="Sector Alpha (FLD-N01)"
        position={[-5, 0.4, 0]}
        size={[8, 0.8, 10]}
        color="#152B1E"
        cropType="Wheat"
        moisturePercent={44.2}
        ndviScore={0.74}
        isSelected={selectedPlotId === 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c'}
        onSelect={setSelectedPlotId}
      />

      {/* Parcel 2: East Terraced Basin (Basmati Rice, 12.1 ha) */}
      <FarmPlot
        id="b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e"
        name="East Basin (FLD-E04)"
        position={[6, 0.6, 0]}
        size={[10, 1.2, 12]}
        color="#112419"
        cropType="Rice"
        moisturePercent={38.5}
        ndviScore={0.81}
        isSelected={selectedPlotId === 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e'}
        onSelect={setSelectedPlotId}
      />

      {/* Central Manifold Pump Station */}
      <group position={[0.5, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.28}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
        >
          Pump Hub
        </Text>
      </group>

      {/* Camera Orbit Controls */}
      <OrbitControls
        makeDefault
        minDistance={8}
        maxDistance={45}
        maxPolarAngle={cameraMode === 'top-down' ? 0.01 : Math.PI / 2.1}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export function TwinCanvas() {
  const { cameraMode } = useSimulationStore();

  // Isometric position vs Top-Down Orthogonal Position
  const cameraPosition: [number, number, number] =
    cameraMode === 'top-down' ? [0, 32, 0.1] : [16, 18, 18];

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden bg-[#070B09] border border-[#1A2920]">
      <Canvas
        camera={{ position: cameraPosition, fov: 42 }}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
        }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

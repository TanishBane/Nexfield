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

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL / Three.js Canvas error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function TopologicalFallback() {
  const { selectedPlotId, setSelectedPlotId, overlayMode } = useSimulationStore();

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden bg-[#070B09] border border-[#1A2920] flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#849F90] border-b border-[#1E2E25] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-[#F1F6F3]">2D Subterranean Soil Horizon Cutaway</span>
          <span className="text-[#4E6B5A]">·</span>
          <span className="text-emerald-400">Campbell-Norman Soil Physics Mode</span>
        </div>
        <span className="text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-600/30 text-[11px]">
          Hardware 2D Mode Active
        </span>
      </div>

      {/* 2D Subterranean Soil Cutaway SVG Diagram */}
      <div className="my-4 relative aspect-[16/8] w-full rounded-xl overflow-hidden border border-[#18261E] bg-[#0A100D] flex items-center justify-center">
        <svg viewBox="0 0 800 360" className="w-full h-full">
          <defs>
            <linearGradient id="apHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1B3822" />
              <stop offset="100%" stop-color="#142618" />
            </linearGradient>
            <linearGradient id="bwHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#2A2415" />
              <stop offset="100%" stop-color="#1F1A0F" />
            </linearGradient>
            <linearGradient id="cHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1A1815" />
              <stop offset="100%" stop-color="#100E0D" />
            </linearGradient>
            <linearGradient id="fluxArrow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#0284C7" stop-opacity="0.2" />
            </linearGradient>
          </defs>

          {/* Layer 1: Ap Horizon (0-15 cm Organic Rootzone) */}
          <rect x="0" y="40" width="800" height="90" fill="url(#apHorizon)" />
          {/* Canopy Plants on Surface */}
          <path d="M60,40 Q70,10 80,40 M140,40 Q150,5 160,40 M220,40 Q230,10 240,40 M300,40 Q310,5 320,40 M380,40 Q390,10 400,40 M460,40 Q470,5 480,40 M540,40 Q550,10 560,40 M620,40 Q630,5 640,40 M700,40 Q710,10 720,40" stroke="#10B981" stroke-width="3" fill="none" />
          {/* Drip Emitter Line */}
          <line x1="20" y1="38" x2="780" y2="38" stroke="#38BDF8" stroke-width="3" stroke-dasharray="12 8" />
          <text x="30" y="28" fill="#38BDF8" font-family="monospace" font-size="11" font-weight="bold">DRIP LATERAL: -33 kPa Precision Inflow</text>

          {/* Root Fibers branching in Ap layer */}
          <path d="M150,40 C140,80 130,100 120,120 M150,40 C160,80 170,110 180,125" stroke="#D7B678" stroke-width="1.8" fill="none" opacity="0.8" />
          <path d="M310,40 C300,75 290,105 280,120 M310,40 C320,75 330,105 340,125" stroke="#D7B678" stroke-width="1.8" fill="none" opacity="0.8" />
          <path d="M470,40 C460,80 450,110 440,125 M470,40 C480,80 490,105 500,120" stroke="#D7B678" stroke-width="1.8" fill="none" opacity="0.8" />
          <path d="M630,40 C620,80 610,105 600,120 M630,40 C640,80 650,110 660,125" stroke="#D7B678" stroke-width="1.8" fill="none" opacity="0.8" />

          {/* Layer Boundary Line 1 */}
          <line x1="0" y1="130" x2="800" y2="130" stroke="#2E4A35" stroke-width="1.5" stroke-dasharray="6 4" />
          <text x="640" y="120" fill="#8DA295" font-family="monospace" font-size="11">Ap Layer (0 - 15 cm)</text>

          {/* Layer 2: Bw Horizon (15-40 cm Capillary Retention) */}
          <rect x="0" y="130" width="800" height="110" fill="url(#bwHorizon)" />
          {/* Capillary Infiltration Flux Arrows */}
          <line x1="200" y1="140" x2="200" y2="220" stroke="url(#fluxArrow)" stroke-width="4" stroke-linecap="round" />
          <polygon points="196,220 204,220 200,228" fill="#38BDF8" />
          <line x1="400" y1="140" x2="400" y2="220" stroke="url(#fluxArrow)" stroke-width="4" stroke-linecap="round" />
          <polygon points="396,220 404,220 400,228" fill="#38BDF8" />
          <line x1="600" y1="140" x2="600" y2="220" stroke="url(#fluxArrow)" stroke-width="4" stroke-linecap="round" />
          <polygon points="596,220 604,220 600,228" fill="#38BDF8" />

          {/* Layer Boundary Line 2 */}
          <line x1="0" y1="240" x2="800" y2="240" stroke="#483B25" stroke-width="1.5" stroke-dasharray="6 4" />
          <text x="630" y="230" fill="#D7B678" font-family="monospace" font-size="11">Bw Horizon (15 - 40 cm)</text>

          {/* Layer 3: C Horizon (40-60 cm Deep Vadose Boundary) */}
          <rect x="0" y="240" width="800" height="120" fill="url(#cHorizon)" />
          <text x="610" y="340" fill="#6B7280" font-family="monospace" font-size="11">C Horizon (40 - 60+ cm)</text>

          {/* Live Subterranean Physics Readout */}
          <rect x="20" y="260" width="310" height="75" rx="8" fill="#060A08" fill-opacity="0.9" stroke="#1E2E25" stroke-width="1" />
          <text x="32" y="282" fill="#10B981" font-family="monospace" font-size="12" font-weight="bold">Campbell-Norman Hydraulic Conductivity</text>
          <text x="32" y="302" fill="#F1F6F3" font-family="monospace" font-size="11">VWC: 41.4% · Matric Potential: -33 kPa</text>
          <text x="32" y="322" fill="#D7B678" font-family="monospace" font-size="11">Root Extraction: Active · Deep Percolation: 0 L</text>
        </svg>
      </div>

      {/* Interactive Parcel Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setSelectedPlotId('field-nashik-02')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPlotId === 'field-nashik-02' || !selectedPlotId
              ? 'bg-[#152B1E] border-emerald-500 shadow-lg text-[#F1F6F3]'
              : 'bg-[#0E1511] border-[#1E2E25] text-[#93A79B] hover:border-[#2C4235]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">SECTOR 2-B</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">Active Plot</span>
          </div>
          <div className="font-bold text-sm text-[#F1F6F3] mt-1">Open Drip Precision Parcel</div>
          <div className="text-xs text-[#8DA295] font-mono mt-0.5">Tomato Abhinav F1 • 1.2 ha</div>
          <div className="mt-2 text-[11px] font-mono text-[#D7B678]">
            VWC: 41.4% • NDVI: 0.81 • Matrix: -33 kPa
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlotId('field-nashik-01')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            selectedPlotId === 'field-nashik-01'
              ? 'bg-[#152B1E] border-emerald-500 shadow-lg text-[#F1F6F3]'
              : 'bg-[#0E1511] border-[#1E2E25] text-[#93A79B] hover:border-[#2C4235]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">SECTOR 1-A</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16251E] text-[#8DA295] border border-[#273B2F]">Polyhouse</span>
          </div>
          <div className="font-bold text-sm text-[#F1F6F3] mt-1">Greenhouse Controlled Parcel</div>
          <div className="text-xs text-[#8DA295] font-mono mt-0.5">Tomato Shivam F1 • 1.2 ha</div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400">
            VWC: 42.5% • NDVI: 0.86 • Matrix: -28 kPa
          </div>
        </button>
      </div>
    </div>
  );
}

export function TwinCanvas() {
  const { cameraMode } = useSimulationStore();

  // Isometric position vs Top-Down Orthogonal Position
  const cameraPosition: [number, number, number] =
    cameraMode === 'top-down' ? [0, 32, 0.1] : [16, 18, 18];

  return (
    <CanvasErrorBoundary fallback={<TopologicalFallback />}>
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
    </CanvasErrorBoundary>
  );
}

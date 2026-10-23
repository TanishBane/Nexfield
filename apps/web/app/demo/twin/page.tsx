'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Droplets,
  Sprout,
  Sliders,
  DollarSign,
  Sun,
  Flame,
  CloudRain,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  StatCard,
} from '@nexfield/ui';
import { useDemoStore } from '@/lib/store/useDemoStore';

// Dynamically load 3D TwinCanvas
const TwinCanvas = dynamic(
  () => import('@/components/modules/twin/TwinCanvas').then((mod) => mod.TwinCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-[#060907] border border-[#18261E] rounded-xl text-center p-6 text-xs text-[#6F887A]">
        <Layers className="h-8 w-8 text-cyan-500 animate-spin mb-3" />
        <span>Initializing Three.js WebGL Biophysical Mesh...</span>
      </div>
    ),
  }
);

export default function DemoTwinPage() {
  const {
    farmName,
    cropName,
    cropVariety,
    areaHectares,
    soilMoisture,
    ambientTemperature,
    biomassStressPercent,
    simulatedHeatwaveOffset,
    simulatedDroughtReduction,
    applyWhatIfScenario,
    setHeatwaveOffset,
    setDroughtReduction,
    resetDemo,
  } = useDemoStore();

  const [activePreset, setActivePreset] = useState<'baseline' | 'heatwave' | 'drought' | 'cloudburst'>('baseline');
  const [irrigationMm, setIrrigationMm] = useState(24);
  const [fertilizerKg, setFertilizerKg] = useState(45);

  const handlePresetSelect = (preset: 'baseline' | 'heatwave' | 'drought' | 'cloudburst') => {
    setActivePreset(preset);
    applyWhatIfScenario(preset);
  };

  // Projected Yield & Economic Net based on parameters
  const baselineYieldQuintalsPerHa = 380;
  const stressPenalty = (biomassStressPercent / 100) * 0.45;
  const projectedYield = Number((baselineYieldQuintalsPerHa * (1 - stressPenalty) * areaHectares).toFixed(1));
  const estimatedRevenueInr = Math.round(projectedYield * 2450);
  const inputCostInr = Math.round(irrigationMm * 35 * areaHectares + fertilizerKg * 65 * areaHectares);
  const netProfitInr = estimatedRevenueInr - inputCostInr;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              3D Biophysical Digital Twin Simulator
            </h1>
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/40 font-mono text-[10px]">
              What-If Sandbox
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5">
            {farmName} · {cropName} ({cropVariety}) · 2.4 Hectares Soil Mesh
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActivePreset('baseline');
            resetDemo();
          }}
          className="text-xs gap-1.5 text-[#8EA698] border-[#22352A] hover:bg-[#121B16]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Scenario</span>
        </Button>
      </div>

      {/* 2. Preset Scenario Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#63796E] font-mono mr-1">Scenario Presets:</span>
        <button
          type="button"
          onClick={() => handlePresetSelect('baseline')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePreset === 'baseline'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-[#0E1511] border border-[#1E2E25] text-[#8EA698] hover:text-[#F1F6F3]'
          }`}
        >
          Baseline Condition
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('heatwave')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activePreset === 'heatwave'
              ? 'bg-rose-950/80 border border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
              : 'bg-[#0E1511] border border-[#1E2E25] text-[#8EA698] hover:text-[#F1F6F3]'
          }`}
        >
          <Flame className="h-3.5 w-3.5 text-rose-400" />
          <span>Heatwave (+4.5°C)</span>
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('drought')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activePreset === 'drought'
              ? 'bg-amber-950/80 border border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
              : 'bg-[#0E1511] border border-[#1E2E25] text-[#8EA698] hover:text-[#F1F6F3]'
          }`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-400" />
          <span>Vadose Drought (-28%)</span>
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('cloudburst')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activePreset === 'cloudburst'
              ? 'bg-sky-950/80 border border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
              : 'bg-[#0E1511] border border-[#1E2E25] text-[#8EA698] hover:text-[#F1F6F3]'
          }`}
        >
          <CloudRain className="h-3.5 w-3.5 text-sky-400" />
          <span>Monsoon Saturation</span>
        </button>
      </div>

      {/* 3. Main Workspace: 3D Canvas + Parameter Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualizer Canvas (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#060907] border border-[#1E2E25] p-2 flex flex-col min-h-[460px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0A0F0D]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E2E25] text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[#E1ECE5]">Field Sector 2-B Mesh (3D Soil Strata)</span>
          </div>

          <div className="flex-1 w-full h-[440px] relative">
            <TwinCanvas />
          </div>

          {/* Canvas Bottom Overlay HUD */}
          <div className="p-3 bg-[#0A0F0D]/90 border-t border-[#18261E] grid grid-cols-3 text-center text-xs font-mono">
            <div>
              <span className="text-[#63796E]">Sim Temperature</span>
              <div className="text-amber-400 font-bold mt-0.5">{ambientTemperature}°C</div>
            </div>
            <div>
              <span className="text-[#63796E]">Vadose Moisture</span>
              <div className="text-sky-400 font-bold mt-0.5">{soilMoisture}%</div>
            </div>
            <div>
              <span className="text-[#63796E]">Stomatal Stress</span>
              <div className="text-purple-400 font-bold mt-0.5">{biomassStressPercent}%</div>
            </div>
          </div>
        </div>

        {/* What-If Parameter Controls & Simulation Outcomes (1 Col) */}
        <div className="space-y-4">
          <Card className="border-[#1E2E25] bg-[#0E1511]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                Biophysical Knobs
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Adjust environmental variables to simulate yield sensitivity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              {/* Temperature Offset Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8EA698]">Heatwave Shock:</span>
                  <span className="text-amber-400 font-bold">+{simulatedHeatwaveOffset}°C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={simulatedHeatwaveOffset}
                  onChange={(e) => setHeatwaveOffset(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-[#16231C]"
                />
              </div>

              {/* Drought Severity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8EA698]">Drought Restriction:</span>
                  <span className="text-rose-400 font-bold">-{simulatedDroughtReduction}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={simulatedDroughtReduction}
                  onChange={(e) => setDroughtReduction(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-[#16231C]"
                />
              </div>

              {/* Irrigation Depth */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8EA698]">Drip Application:</span>
                  <span className="text-sky-400 font-bold">{irrigationMm} mm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={irrigationMm}
                  onChange={(e) => setIrrigationMm(Number(e.target.value))}
                  className="w-full accent-sky-400 bg-[#16231C]"
                />
              </div>

              {/* NPK Fertigation */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8EA698]">Potassium Dosing:</span>
                  <span className="text-emerald-400 font-bold">{fertilizerKg} kg / ha</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={fertilizerKg}
                  onChange={(e) => setFertilizerKg(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-[#16231C]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Economic Projections Card */}
          <Card className="border-[#1E2E25] bg-[#0E1511]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                Projected Crop Economics
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Van Genuchten physics mapped to Agmarknet market realization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#8EA698]">Estimated Harvest Volume:</span>
                <span className="text-emerald-400 font-bold">{projectedYield} Quintals</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#8EA698]">Projected Gross Revenue:</span>
                <span className="text-[#F1F6F3] font-bold">₹{estimatedRevenueInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#8EA698]">Estimated Input Cost:</span>
                <span className="text-amber-400 font-bold">₹{inputCostInr.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#14231A] border border-emerald-600/40 text-emerald-300">
                <span className="font-semibold">Simulated Net Realization:</span>
                <span className="font-extrabold text-sm">₹{netProfitInr.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

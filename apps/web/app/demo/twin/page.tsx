'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Layers,
  Play,
  Pause,
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
  Eye,
  Camera,
  Check,
  TrendingUp,
  Activity,
  Compass,
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
} from '@nexfield/ui';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { useSimulationStore, CameraViewMode, VisualOverlayMode } from '@/lib/store/useSimulationStore';

// Dynamically load 3D TwinCanvas to prevent SSR hydration mismatches
const TwinCanvas = dynamic(
  () => import('@/components/modules/twin/TwinCanvas').then((mod) => mod.TwinCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center bg-[#060907] border border-[#18261E] rounded-2xl text-center p-6 text-sm text-[#7B9587]">
        <Layers className="h-8 w-8 text-cyan-500 animate-spin mb-3" />
        <span className="font-semibold text-[#F1F6F3]">Loading Biophysical 3D Mesh...</span>
        <span className="text-xs text-[#63796E] mt-1 font-mono">Initializing WebGL Van Genuchten soil substrate</span>
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
    addTask,
  } = useDemoStore();

  const {
    cameraMode,
    setCameraMode,
    overlayMode,
    setOverlayMode,
    isIrrigationRunning,
    setIsIrrigationRunning,
  } = useSimulationStore();

  // Mode: 'simple' for intuitive farmer overview, 'advanced' for deep biophysical research
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [activePreset, setActivePreset] = useState<'baseline' | 'heatwave' | 'drought' | 'cloudburst'>('baseline');
  const [irrigationMm, setIrrigationMm] = useState(24);
  const [fertilizerKg, setFertilizerKg] = useState(45);
  const [taskDispatched, setTaskDispatched] = useState(false);

  const handlePresetSelect = (preset: 'baseline' | 'heatwave' | 'drought' | 'cloudburst') => {
    setActivePreset(preset);
    applyWhatIfScenario(preset);
  };

  const handleDispatchTask = () => {
    addTask({
      title: 'Precision Fertigation: 22mm Drip + 45kg/ha K Dosing',
      category: 'irrigation',
      priority: 'high',
      status: 'todo',
      dueDate: 'Tomorrow 05:30 AM',
      costInr: 850,
    });
    setTaskDispatched(true);
    setTimeout(() => setTaskDispatched(false), 4000);
  };

  // Projected Yield & Economic Net based on parameters
  const baselineYieldQuintalsPerHa = 380;
  const stressPenalty = (biomassStressPercent / 100) * 0.45;
  const projectedYield = Number((baselineYieldQuintalsPerHa * (1 - stressPenalty) * areaHectares).toFixed(1));
  const estimatedRevenueInr = Math.round(projectedYield * 2450);
  const inputCostInr = Math.round(irrigationMm * 35 * areaHectares + fertilizerKg * 65 * areaHectares);
  const netProfitInr = estimatedRevenueInr - inputCostInr;

  // Comparison metrics: Standard Flood vs NEXFIELD Precision Drip
  const standardWaterLiters = 96000;
  const precisionWaterLiters = 57600;
  const waterSavedLiters = standardWaterLiters - precisionWaterLiters;
  const waterSavedPercent = Math.round((waterSavedLiters / standardWaterLiters) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with Mode Toggle & Reset */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A261F]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF8F2] font-serif">
              3D Biophysical Digital Twin
            </h1>
            <Badge variant="outline" className="text-cyan-400 border-cyan-500/40 font-mono text-xs px-2.5 py-0.5">
              Vadose Zone Model
            </Badge>
          </div>
          <p className="text-sm text-[#8EA698] mt-1">
            {farmName} · {cropName} ({cropVariety}) · 2.4 Hectares Silt Loam Mesh
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher Pill */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#0B120E] border border-[#1E2E25]">
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'simple'
                  ? 'bg-emerald-500 text-[#070B09] shadow-sm'
                  : 'text-[#8EA698] hover:text-[#FAF8F2]'
              }`}
            >
              Simple Mode
            </button>
            <button
              type="button"
              onClick={() => setViewMode('advanced')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'advanced'
                  ? 'bg-cyan-500 text-[#070B09] shadow-sm'
                  : 'text-[#8EA698] hover:text-[#FAF8F2]'
              }`}
            >
              Advanced Biophysical
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActivePreset('baseline');
              resetDemo();
            }}
            className="text-xs gap-1.5 text-[#8EA698] border-[#22352A] hover:bg-[#121B16] hover:text-[#FAF8F2]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </Button>
        </div>
      </div>

      {/* 2. Interactive Scenario Presets Bar */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-[#0B120E] border border-[#1A261F]">
        <span className="text-xs text-[#7B9587] font-semibold uppercase tracking-wider mr-1">
          Scenario Sandbox:
        </span>
        <button
          type="button"
          onClick={() => handlePresetSelect('baseline')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePreset === 'baseline'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
              : 'bg-[#121B16] border border-[#1E2E25] text-[#8EA698] hover:text-[#FAF8F2]'
          }`}
        >
          Baseline Condition (28°C)
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('heatwave')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activePreset === 'heatwave'
              ? 'bg-rose-950/80 border border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
              : 'bg-[#121B16] border border-[#1E2E25] text-[#8EA698] hover:text-[#FAF8F2]'
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
              : 'bg-[#121B16] border border-[#1E2E25] text-[#8EA698] hover:text-[#FAF8F2]'
          }`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-400" />
          <span>Flash Drought (-28% Rain)</span>
        </button>

        <button
          type="button"
          onClick={() => handlePresetSelect('cloudburst')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activePreset === 'cloudburst'
              ? 'bg-sky-950/80 border border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
              : 'bg-[#121B16] border border-[#1E2E25] text-[#8EA698] hover:text-[#FAF8F2]'
          }`}
        >
          <CloudRain className="h-3.5 w-3.5 text-sky-400" />
          <span>Monsoon Downpour (+60mm)</span>
        </button>
      </div>

      {/* 3. Main Workspace: 3D Canvas + Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Visualizer Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="rounded-2xl bg-[#060907] border border-[#1E2E25] p-2.5 flex flex-col min-h-[460px] shadow-2xl relative overflow-hidden">
            {/* Top Toolbar overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-[#0A0F0D]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1E2E25] text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[#FAF8F2] font-semibold">Sector 2-B Soil Mesh</span>
              </div>

              {/* Camera Presets Switcher */}
              <div className="flex items-center gap-1 bg-[#0A0F0D]/90 backdrop-blur-md p-1 rounded-xl border border-[#1E2E25]">
                <button
                  type="button"
                  title="Isometric Camera"
                  onClick={() => setCameraMode('isometric')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    cameraMode === 'isometric'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  Isometric
                </button>
                <button
                  type="button"
                  title="Top-Down Aerial Camera"
                  onClick={() => setCameraMode('top-down')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    cameraMode === 'top-down'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  Top-Down
                </button>
                <button
                  type="button"
                  title="Field Focus Camera"
                  onClick={() => setCameraMode('field-focus')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    cameraMode === 'field-focus'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  Focus
                </button>
              </div>

              {/* Overlay Mode Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-[#0A0F0D]/90 backdrop-blur-md p-1 rounded-xl border border-[#1E2E25]">
                <button
                  type="button"
                  onClick={() => setOverlayMode('moisture')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    overlayMode === 'moisture'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  Moisture
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('ndvi')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    overlayMode === 'ndvi'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  NDVI
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayMode('irrigation')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    overlayMode === 'irrigation'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-[#8EA698] hover:text-[#FAF8F2]'
                  }`}
                >
                  Drip Lines
                </button>
              </div>
            </div>

            {/* Drip Animation Play/Pause button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIsIrrigationRunning(!isIrrigationRunning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
                  isIrrigationRunning
                    ? 'bg-sky-950/90 text-sky-300 border-sky-500/50 shadow-md shadow-sky-500/20'
                    : 'bg-[#0A0F0D]/90 text-[#8EA698] border-[#1E2E25] hover:text-[#FAF8F2]'
                }`}
              >
                {isIrrigationRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-sky-400" />
                    <span>Drip Active</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-sky-400" />
                    <span>Run Drip Flow</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 w-full h-[450px] relative">
              <TwinCanvas />
            </div>

            {/* Canvas Bottom Overlay HUD */}
            <div className="p-3 bg-[#0A0F0D]/95 border-t border-[#18261E] grid grid-cols-3 text-center text-xs">
              <div>
                <span className="text-[#7B9587] font-medium">Ambient Temperature</span>
                <div className="text-amber-400 font-bold text-base tabular-nums mt-0.5">{ambientTemperature}°C</div>
              </div>
              <div>
                <span className="text-[#7B9587] font-medium">Vadose Zone Moisture</span>
                <div className="text-sky-400 font-bold text-base tabular-nums mt-0.5">{soilMoisture}% VWC</div>
              </div>
              <div>
                <span className="text-[#7B9587] font-medium">Canopy Water Stress</span>
                <div className="text-purple-400 font-bold text-base tabular-nums mt-0.5">{biomassStressPercent}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Context & Controls Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {viewMode === 'simple' ? (
            /* SIMPLE MODE VIEW */
            <div className="space-y-4">
              {/* Scenario Comparison Highlight */}
              <div className="p-5 rounded-2xl bg-[#0E1511] border border-emerald-500/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Precision vs Standard Flood
                  </span>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[11px]">
                    Saved 40% Water
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#1A261F] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#7B9587]">Water Consumed</div>
                      <div className="text-lg font-bold text-[#FAF8F2] tabular-nums">
                        57,600 L <span className="text-xs text-[#63796E] font-normal">vs 96,000 L</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      -38.4k L
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#1A261F] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#7B9587]">Plant Water Stress</div>
                      <div className="text-lg font-bold text-emerald-400 tabular-nums">
                        12% <span className="text-xs text-[#63796E] font-normal">vs 34% (severe)</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      Safe
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#1A261F] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#7B9587]">Projected Net Advantage</div>
                      <div className="text-lg font-bold text-[#FAF8F2] tabular-nums">
                        +₹14,200 <span className="text-xs text-[#63796E] font-normal">per hectare cycle</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-500/30">
                      +11.1% Yield
                    </span>
                  </div>
                </div>

                {/* AI Advice Box */}
                <div className="p-3.5 rounded-xl bg-[#14231A] border border-emerald-600/30 text-xs text-[#8EA698] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Sparkles className="h-4 w-4" />
                    <span>Agronomic Intelligence Advice</span>
                  </div>
                  <p className="leading-relaxed text-[#A2B8AC]">
                    Soil moisture in the active rootzone (15–45 cm) is optimal at 41.4%. Drip fertigation of 22 mm at 05:30 AM tomorrow avoids midday evaporative loss.
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleDispatchTask}
                  className="w-full text-xs font-bold gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#070B09] shadow-md shadow-emerald-500/20 py-2.5"
                >
                  {taskDispatched ? (
                    <>
                      <Check className="h-4 w-4 text-[#070B09]" />
                      <span>Work Order Dispatched to Ops!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span>Dispatch Fertigation Task</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Link to FieldSight */}
              <Link
                href="/demo/fieldsight"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#0B120E] border border-[#1E2E25] hover:border-emerald-500/40 text-xs transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors">
                    Check Crop Pathology
                  </span>
                  <p className="text-[#7B9587]">Run FieldSight AI foliar scan on tomato foliage</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#7B9587] group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          ) : (
            /* ADVANCED BIOPHYSICAL RESEARCH VIEW */
            <div className="space-y-4">
              {/* Biophysical Strata Card */}
              <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  Vadose Zone Strata Depths
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#080D0A] border border-[#18261E] flex justify-between items-center">
                    <div>
                      <span className="text-[#FAF8F2] font-semibold">Topsoil (0–15 cm)</span>
                      <div className="text-[11px] text-[#63796E]">Evaporative boundary layer</div>
                    </div>
                    <span className="text-sky-400 font-bold tabular-nums">38.2% VWC</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14231A] border border-emerald-500/40 flex justify-between items-center">
                    <div>
                      <span className="text-emerald-300 font-semibold">Rootzone (15–45 cm)</span>
                      <div className="text-[11px] text-[#63796E]">Peak tomato water uptake</div>
                    </div>
                    <span className="text-emerald-400 font-bold tabular-nums">41.4% VWC</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#080D0A] border border-[#18261E] flex justify-between items-center">
                    <div>
                      <span className="text-[#FAF8F2] font-semibold">Subsoil (45–90 cm)</span>
                      <div className="text-[11px] text-[#63796E]">Drainage & deep reserve</div>
                    </div>
                    <span className="text-cyan-400 font-bold tabular-nums">43.1% VWC</span>
                  </div>
                </div>
              </div>

              {/* FAO-56 Penman-Monteith Parameters */}
              <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FAF8F2] font-mono">
                  FAO-56 Dual Kc Coefficients
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                    <span className="text-[#63796E]">Reference ET0:</span>
                    <div className="text-[#FAF8F2] font-bold tabular-nums">4.20 mm/d</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                    <span className="text-[#63796E]">Crop Kcb:</span>
                    <div className="text-emerald-400 font-bold tabular-nums">1.05 (Mid)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                    <span className="text-[#63796E]">Soil Ke:</span>
                    <div className="text-amber-400 font-bold tabular-nums">0.18</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
                    <span className="text-[#63796E]">Daily ETc:</span>
                    <div className="text-sky-400 font-bold tabular-nums">5.17 mm/d</div>
                  </div>
                </div>
              </div>

              {/* Interactive Knobs */}
              <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-3.5 text-xs font-mono">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FAF8F2]">
                  Parameter Knobs
                </div>

                {/* Drip Depth */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8EA698]">Drip Depth:</span>
                    <span className="text-sky-400 font-bold tabular-nums">{irrigationMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={irrigationMm}
                    onChange={(e) => setIrrigationMm(Number(e.target.value))}
                    className="w-full accent-sky-400 bg-[#16231C] h-1.5 rounded-lg"
                  />
                </div>

                {/* Potassium Dosing */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#8EA698]">Potassium Dosing:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{fertilizerKg} kg/ha</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={fertilizerKg}
                    onChange={(e) => setFertilizerKg(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-[#16231C] h-1.5 rounded-lg"
                  />
                </div>
              </div>

              {/* Van Genuchten Realization */}
              <div className="p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#8EA698]">
                  <span>Projected Yield:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{projectedYield} Qtl</span>
                </div>
                <div className="flex justify-between text-[#8EA698]">
                  <span>Gross Value:</span>
                  <span className="text-[#FAF8F2] font-bold tabular-nums">₹{estimatedRevenueInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#8EA698]">
                  <span>Input Expenses:</span>
                  <span className="text-amber-400 font-bold tabular-nums">₹{inputCostInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-[#1E2E25] flex justify-between text-emerald-300 font-semibold">
                  <span>Net Margin:</span>
                  <span className="font-extrabold text-sm tabular-nums">₹{netProfitInr.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

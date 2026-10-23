'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Droplets,
  Sprout,
  TrendingUp,
  Percent,
  Sliders,
  DollarSign,
  Leaf,
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
  StatCard,
  Input,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { SimulationScenario } from '@nexfield/contracts';

export default function TwinPage() {
  const { selectedFieldId } = useFarmStore();

  // Scenario Simulator Inputs
  const [irrigationVolume, setIrrigationVolume] = useState<number>(340);
  const [nitrogenKg, setNitrogenKg] = useState<number>(45);
  const [applyBiostimulant, setApplyBiostimulant] = useState<boolean>(true);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['simulations', selectedFieldId],
    queryFn: () => apiClient.getSimulationScenarios(selectedFieldId || undefined),
  });

  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);

  const runSimulationMutation = useMutation({
    mutationFn: () =>
      apiClient.runSimulation({
        fieldId: selectedFieldId || 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
        cycleId: 'c3e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
        title: `Intervention Run (${irrigationVolume}m³ Water / ${nitrogenKg}kg N)`,
        interventions: {
          irrigationScheduleDays: [3, 7, 12, 18],
          irrigationVolumeM3PerHa: irrigationVolume,
          nitrogenTopDressingKgPerHa: nitrogenKg,
          biostimulantApplied: applyBiostimulant,
        },
      }),
    onSuccess: (res) => {
      setActiveScenario(res.data);
      refetch();
    },
  });

  if (isLoading) {
    return <ModuleLoadingState message="Loading field topography, soil hydrology meshes, and scenario parameters..." />;
  }

  if (error || !data?.data) {
    return (
      <ErrorDisplay
        title="Simulation Engine Disconnected"
        message="Unable to communicate with the crop simulation microservice."
        onRetry={() => refetch()}
      />
    );
  }

  const scenarios = data.data;
  const current = activeScenario || scenarios[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <Layers className="h-6 w-6 text-emerald-400" />
              NEXFIELD Twin — Agricultural Digital Twin & Scenario Simulator
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            Parametric biophysical modeling: optimize irrigation volumes, nitrogen top-dressing, and harvest yield outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => runSimulationMutation.mutate()}
            isLoading={runSimulationMutation.isPending}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Run Simulation
          </Button>
        </div>
      </div>

      {/* Main Grid: 3D Twin Viewport & Intervention Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Digital Twin Geospatial & Mesh Representation */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="overflow-hidden border-[#23352A]">
            <CardHeader className="pb-3 border-b border-[#1C2921]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  Twin 3D Field Topography & Moisture Stratification
                </CardTitle>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  Mesh: 8.4 ha Delineated
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Synthetic Digital Twin 3D Perspective Graphic */}
              <div className="relative aspect-[16/9] w-full rounded-lg bg-[#0A100D] border border-[#1E2E25] overflow-hidden flex flex-col justify-between p-4">
                {/* 3D Wireframe Grids */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10B981_1px,transparent_1px),linear-gradient(to_bottom,#10B981_1px,transparent_1px)] bg-[size:28px_28px] [transform:perspective(600px)_rotateX(45deg)]" />

                {/* Tactical HUD Telemetry Badges */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-[#09110D]/90 border border-[#1E2E25] rounded px-2.5 py-1 text-[11px] font-mono text-[#8EA396] space-y-0.5">
                    <div>PARCEL: FLD-N01 (North Sector Alpha)</div>
                    <div>COORDINATES: 30.7046° N, 76.7179° E</div>
                    <div className="text-emerald-400">HYDROLOGY: Capillary Saturated</div>
                  </div>

                  <div className="bg-emerald-950/80 border border-emerald-600/40 rounded px-2.5 py-1 text-xs font-mono text-emerald-300">
                    STATUS: ACTIVE TWIN SYNC
                  </div>
                </div>

                {/* Center Biomass Elevation Rendering */}
                <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-16 w-16 rounded-full border border-emerald-400/40 flex items-center justify-center bg-emerald-950/40 animate-pulse">
                    <Sprout className="h-8 w-8 text-emerald-400" />
                  </div>
                  <span className="font-mono text-sm text-[#F1F6F3] font-bold mt-2">
                    Predicted Anthesis Biomass: 5.88 MT/ha
                  </span>
                  <span className="text-xs text-[#7F998B]">
                    Model Confidence: 91.2% (95% CI: 5.64 - 6.12 MT/ha)
                  </span>
                </div>

                {/* Subsurface Sensor Strata */}
                <div className="relative z-10 grid grid-cols-3 gap-2 bg-[#09110D]/90 border border-[#1E2E25] rounded p-2 text-[11px] font-mono">
                  <div className="text-center">
                    <span className="text-[#647C6E] block text-[10px]">0-15cm MOISTURE</span>
                    <span className="text-sky-300 font-semibold">44.2%</span>
                  </div>
                  <div className="text-center border-x border-[#1E2E25]">
                    <span className="text-[#647C6E] block text-[10px]">15-45cm ROOTZONE</span>
                    <span className="text-emerald-300 font-semibold">39.8%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#647C6E] block text-[10px]">SUB-SURFACE EC</span>
                    <span className="text-amber-300 font-semibold">0.36 dS/m</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcomes Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Simulated Yield"
              value={current.projectedOutcomes.estimatedYieldMtPerHa.toFixed(2)}
              unit="MT/ha"
              subValue={`Baseline: ${current.projectedOutcomes.baselineYieldMtPerHa.toFixed(2)} MT/ha`}
              trend="up"
              trendValue={`+${current.projectedOutcomes.yieldDeltaPercent.toFixed(1)}%`}
              variant="emerald"
            />
            <StatCard
              label="Water Use Efficiency"
              value={current.projectedOutcomes.waterUseEfficiencyScore.toFixed(1)}
              unit="/ 100"
              subValue="Low runoff transpiration"
              trend="up"
              trendValue="High Efficiency"
              variant="sky"
            />
            <StatCard
              label="Economic Profit Delta"
              value={`+₹${current.projectedOutcomes.economicBenefitInrPerHa.toLocaleString('en-IN')}`}
              unit="/ ha"
              subValue="Net fertilizer & diesel savings"
              trend="up"
              trendValue="Optimal Arbitrage"
              variant="amber"
            />
          </div>
        </div>

        {/* Right Column (5 cols): Parameter Controls & Scenarios */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-[#273B2F]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-400" />
                Intervention Parameter Tuner
              </CardTitle>
              <CardDescription>
                Adjust input variables to test stress resilience and yield deltas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Irrigation Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-sky-400" />
                    Target Irrigation Volume
                  </span>
                  <span className="font-mono text-sky-300 font-semibold">{irrigationVolume} m³/ha</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="10"
                  value={irrigationVolume}
                  onChange={(e) => setIrrigationVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[11px] text-[#698173] block">
                  Deficit pulse window: 3-stage drip cycle over 18 days
                </span>
              </div>

              {/* Nitrogen Top Dressing Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                    Nitrogen Top Dressing
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">{nitrogenKg} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={nitrogenKg}
                  onChange={(e) => setNitrogenKg(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[11px] text-[#698173] block">
                  Split urea application aligned with panicle initiation
                </span>
              </div>

              {/* Biostimulant Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#E1ECE5]">
                    Amino-Acid Biostimulant Foliar Spray
                  </span>
                  <span className="text-[11px] text-[#71897C]">
                    Enhances chlorophyll synthesis under heat stress
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={applyBiostimulant}
                  onChange={(e) => setApplyBiostimulant(e.target.checked)}
                  className="h-4 w-4 rounded border-emerald-600 text-emerald-600 focus:ring-emerald-500 bg-[#16221B] cursor-pointer"
                />
              </div>

              <Button
                variant="primary"
                onClick={() => runSimulationMutation.mutate()}
                isLoading={runSimulationMutation.isPending}
                className="w-full gap-2 mt-2"
              >
                <Play className="h-4 w-4" />
                Recalculate Yield Curves
              </Button>
            </CardContent>
          </Card>

          {/* Scenario History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Simulated Scenarios Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {scenarios.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg bg-[#0E1511] border border-[#1E2E25] p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#E2ECE5]">{s.title}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      +{s.projectedOutcomes.yieldDeltaPercent.toFixed(1)}% Yield
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7C9385] leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#627A6E]">
                    <span>WUE: {s.projectedOutcomes.waterUseEfficiencyScore}%</span>
                    <span>Risk: {s.projectedOutcomes.riskIndex} (Low)</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

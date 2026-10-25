'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  Droplets,
  Sprout,
  Sliders,
  DollarSign,
  Leaf,
  Compass,
  Eye,
  Camera,
  Sun,
  CloudRain,
  Flame,
  Info,
  Save,
  CheckCircle2,
  ClipboardCheck,
  ChevronDown,
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
  Input,
  ModuleLoadingState,
  ErrorDisplay,
  ProvenanceBadge,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { useDemoStore } from '@/lib/store/useDemoStore';
import {
  useSimulationStore,
  CameraViewMode,
  VisualOverlayMode,
  WeatherSimMode,
} from '@/lib/store/useSimulationStore';
import { TwinScenarioCharts } from '@/components/modules/twin/TwinScenarioCharts';
import { ModelAssumptionsModal } from '@/components/modules/twin/ModelAssumptionsModal';
import { ConvertToTaskModal } from '@/components/modules/twin/ConvertToTaskModal';
import { OutcomeStatCards } from '@/components/modules/twin/OutcomeStatCards';
import { ParameterConfigurationPanel } from '@/components/modules/twin/ParameterConfigurationPanel';

// Dynamically import 3D Canvas without SSR to avoid window/WebGL hydration issues
const TwinCanvas = dynamic(
  () => import('@/components/modules/twin/TwinCanvas').then((mod) => mod.TwinCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-xl bg-[#090E0B] border border-[#1A2920] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-[#7B9586] font-mono">
          Initializing WebGL agricultural mesh buffer...
        </span>
      </div>
    ),
  }
);

export default function TwinPage() {
  const { selectedFieldId, selectedFarmId } = useFarmStore();
  const {
    cameraMode,
    setCameraMode,
    overlayMode,
    setOverlayMode,
    weatherSimMode,
    setWeatherSimMode,
    selectedPlotId,
    setSelectedPlotId,
    isIrrigationRunning,
    setIsIrrigationRunning,
    params,
    updateParams,
    resetParams,
    activeScenario,
    setActiveScenario,
    savedScenarios,
    saveCurrentScenario,
  } = useSimulationStore();

  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isConvertToTaskOpen, setIsConvertToTaskOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Load scenarios from API or fixtures
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['simulations', selectedPlotId],
    queryFn: () => apiClient.getSimulationScenarios(selectedPlotId),
  });

  const runSimulationMutation = useMutation({
    mutationFn: () =>
      apiClient.runSimulation({
        fieldId: selectedPlotId,
        cycleId: 'c3e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
        title: `Intervention (${params.irrigationVolumeM3PerHa} m³ Water / ${params.nitrogenTopDressingKgPerHa} kg N / ${params.projectedRainfallMm} mm Rain)`,
        interventions: {
          irrigationScheduleDays: [3, 7, 12, 18],
          irrigationVolumeM3PerHa: params.irrigationVolumeM3PerHa,
          nitrogenTopDressingKgPerHa: params.nitrogenTopDressingKgPerHa,
          biostimulantApplied: params.biostimulantApplied,
        },
      }),
    onSuccess: (res) => {
      setActiveScenario(res.data);
      refetch();
    },
  });

  const handleSaveScenario = () => {
    if (!current) return;
    saveCurrentScenario(current);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2000);
  };

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
      {/* Top Banner / Digital Twin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <Layers className="h-6 w-6 text-emerald-400" />
              NEXFIELD Twin — Flagship Agricultural Digital Twin
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/40">
              WebGL 3D
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            Interactive spatial plot geometry, canopy NDVI stratification, and biophysical scenario simulations.
          </p>
        </div>

        {/* Provenance & Scenario Model Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
          <span className={`h-2 w-2 rounded-full ${(runSimulationMutation.data ? (runSimulationMutation.data as any).meta?.isFixture : data?.meta?.isFixture) ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-[#849F90]">
            Model:{' '}
            <strong className={(runSimulationMutation.data ? (runSimulationMutation.data as any).meta?.isFixture : data?.meta?.isFixture) ? 'text-amber-300 font-medium' : 'text-emerald-300 font-medium'}>
              {(runSimulationMutation.data ? (runSimulationMutation.data as any).meta?.isFixture : data?.meta?.isFixture)
                ? 'Baseline Agronomic Fixture (Demo Mode)'
                : 'Stewart Water-Yield Production Engine (Live)'}
            </strong>
          </span>
        </div>

        {/* Global Twin Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAssumptionsOpen(true)}
            className="h-8 text-xs gap-1.5 text-[#9CB1A3] hover:text-[#F1F6F3]"
          >
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            Model Assumptions
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveScenario}
            className="h-8 text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saveSuccessMessage ? 'Saved!' : 'Save Scenario'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsConvertToTaskOpen(true)}
            className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-500"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            Convert to Farm Task
          </Button>
        </div>
      </div>

      {/* Main Grid: 3D Viewport & Simulation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): 3D Viewport & Visual HUD Controls */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="overflow-hidden border-[#23352A]">
            {/* Viewport Control Bar */}
            <CardHeader className="p-3 border-b border-[#1C2921] bg-[#0E1511]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Camera Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#131D17] border border-[#203126] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setCameraMode('isometric')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      cameraMode === 'isometric'
                        ? 'bg-[#1C2C22] text-[#F1F6F3] font-semibold'
                        : 'text-[#7D998B] hover:text-[#D1E0D7]'
                    }`}
                  >
                    Isometric 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMode('top-down')}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      cameraMode === 'top-down'
                        ? 'bg-[#1C2C22] text-[#F1F6F3] font-semibold'
                        : 'text-[#7D998B] hover:text-[#D1E0D7]'
                    }`}
                  >
                    Top-Down Plan
                  </button>
                </div>

                {/* Environmental Overlays */}
                <div className="flex items-center gap-1 bg-[#131D17] border border-[#203126] rounded-lg p-0.5">
                  {(['moisture', 'ndvi', 'irrigation'] as VisualOverlayMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setOverlayMode(mode)}
                      className={`px-2 py-1 rounded text-[11px] capitalize font-medium transition-all ${
                        overlayMode === mode
                          ? 'bg-[#1C2C22] text-emerald-400 font-semibold'
                          : 'text-[#7D998B] hover:text-[#D1E0D7]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Weather Sim Lighting */}
                <div className="flex items-center gap-1 bg-[#131D17] border border-[#203126] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode('current')}
                    title="Normal Daylight"
                    className={`p-1 rounded ${weatherSimMode === 'current' ? 'bg-[#1C2C22] text-amber-400' : 'text-[#7D998B]'}`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode('heavy_rain')}
                    title="Simulate Rain Precipitation"
                    className={`p-1 rounded ${weatherSimMode === 'heavy_rain' ? 'bg-[#1C2C22] text-sky-400' : 'text-[#7D998B]'}`}
                  >
                    <CloudRain className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode('heatwave')}
                    title="Simulate Heatwave Atmospheric Stress"
                    className={`p-1 rounded ${weatherSimMode === 'heatwave' ? 'bg-[#1C2C22] text-rose-400' : 'text-[#7D998B]'}`}
                  >
                    <Flame className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Irrigation Live Pulse Toggle */}
                <Button
                  variant={isIrrigationRunning ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setIsIrrigationRunning(!isIrrigationRunning)}
                  className="h-7 text-xs px-2.5 gap-1.5"
                >
                  <Droplets className="h-3 w-3" />
                  {isIrrigationRunning ? 'Pumping (Live)' : 'Trigger Pulse'}
                </Button>
              </div>
            </CardHeader>

            {/* 3D WebGL Canvas */}
            <CardContent className="p-3">
              <div className="h-[430px] w-full">
                <TwinCanvas />
              </div>

              {/* Legend & Parcel Details */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8EA295] bg-[#0E1511] p-2.5 rounded-lg border border-[#1E2E25]">
                <div className="flex items-center gap-3">
                  <span className="text-[#658172]">SELECTED:</span>
                  <span className="font-bold text-[#F1F6F3]">
                    {selectedPlotId === 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c'
                      ? 'North Sector Alpha (8.4 ha • Wheat HD-3086)'
                      : 'East Terraced Basin (12.1 ha • Basmati Rice PB-1121)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#658172]">OVERLAY:</span>
                  <Badge variant="outline" size="sm" className="capitalize text-emerald-300">
                    {overlayMode}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Stat Cards */}
          <OutcomeStatCards current={current} />
        </div>

        {/* Right Column (5 cols): Parameter Configuration Panel */}
        <div className="lg:col-span-5 space-y-4">
          <ParameterConfigurationPanel
            params={params}
            updateParams={updateParams}
            resetParams={resetParams}
            onRunSimulation={() => runSimulationMutation.mutate()}
            isSimulating={runSimulationMutation.isPending}
          />
        </div>
      </div>

      {/* Apache ECharts Comparison Section (Baseline vs Alternative) */}
      <TwinScenarioCharts />

      {/* Side-by-Side Agronomic Scenario Comparison Table */}
      <Card className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] shadow-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#18251E]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold text-[#F1F6F3]">
                Multivariate Agronomic Scenario Comparison Matrix
              </CardTitle>
              <CardDescription className="text-xs text-[#9BB1A4]">
                Side-by-side Stewart water-yield modeling comparison across conventional flood, deficit irrigation, and precision twin optimization.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#D7B678] bg-[#17261E] px-3 py-1 rounded-full border border-[#233A2D]">
                Stewart Production Function (Ky = 1.05)
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B100D] border-b border-[#18251E] text-[#8DA295] uppercase">
                <tr>
                  <th className="py-3 px-4 font-semibold">Agronomic Variable</th>
                  <th className="py-3 px-4 font-semibold text-slate-300">A. Conventional Flood</th>
                  <th className="py-3 px-4 font-semibold text-amber-300">B. Deficit Irrigation (-30%)</th>
                  <th className="py-3 px-4 font-semibold text-emerald-400">C. Twin Precision Drip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18251E] text-[#DCE7E1]">
                <tr className="hover:bg-[#111714]">
                  <td className="py-3 px-4 font-sans font-semibold text-[#F1F6F3]">Planned Seasonal Water Depth</td>
                  <td className="py-3 px-4 tabular-nums">580 mm (5,800 m³/ha)</td>
                  <td className="py-3 px-4 tabular-nums text-amber-300">260 mm (2,600 m³/ha)</td>
                  <td className="py-3 px-4 tabular-nums text-emerald-400 font-bold">350 mm (3,500 m³/ha)</td>
                </tr>
                <tr className="hover:bg-[#111714]">
                  <td className="py-3 px-4 font-sans font-semibold text-[#F1F6F3]">Rootzone Matric Potential</td>
                  <td className="py-3 px-4 tabular-nums text-rose-400">-12 kPa (Anaerobic Saturation)</td>
                  <td className="py-3 px-4 tabular-nums text-amber-400">-72 kPa (Mild Drought Stress)</td>
                  <td className="py-3 px-4 tabular-nums text-emerald-400 font-bold">-33 kPa (Optimal Field Capacity)</td>
                </tr>
                <tr className="hover:bg-[#111714]">
                  <td className="py-3 px-4 font-sans font-semibold text-[#F1F6F3]">Nitrogen Leaching into Vadose Zone</td>
                  <td className="py-3 px-4 text-rose-400">High (&gt;28 kg N/ha lost)</td>
                  <td className="py-3 px-4 text-emerald-400">Negligible (&lt;4 kg N/ha)</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Zero Leach (&lt;2 kg N/ha)</td>
                </tr>
                <tr className="hover:bg-[#111714]">
                  <td className="py-3 px-4 font-sans font-semibold text-[#F1F6F3]">Water Use Efficiency (WUE)</td>
                  <td className="py-3 px-4 tabular-nums">48.2 / 100</td>
                  <td className="py-3 px-4 tabular-nums text-amber-300">76.4 / 100</td>
                  <td className="py-3 px-4 tabular-nums text-emerald-400 font-bold">{current.projectedOutcomes.waterUseEfficiencyScore.toFixed(1)} / 100</td>
                </tr>
                <tr className="hover:bg-[#111714]">
                  <td className="py-3 px-4 font-sans font-semibold text-[#F1F6F3]">Projected Crop Yield (Ya)</td>
                  <td className="py-3 px-4 tabular-nums">5.12 MT/ha (Baseline)</td>
                  <td className="py-3 px-4 tabular-nums text-amber-300">4.35 MT/ha (-15.0%)</td>
                  <td className="py-3 px-4 tabular-nums text-emerald-400 font-bold">{current.projectedOutcomes.estimatedYieldMtPerHa.toFixed(2)} MT/ha (+{current.projectedOutcomes.yieldDeltaPercent.toFixed(1)}%)</td>
                </tr>
                <tr className="hover:bg-[#111714] bg-[#0E1712]">
                  <td className="py-3 px-4 font-sans font-bold text-[#F1F6F3]">Net Farm Margin Delta</td>
                  <td className="py-3 px-4 tabular-nums text-slate-400">₹0 (Reference Baseline)</td>
                  <td className="py-3 px-4 tabular-nums text-rose-400">-₹12,400 / ha (Yield Penalty)</td>
                  <td className="py-3 px-4 tabular-nums text-emerald-400 font-extrabold">+₹{current.projectedOutcomes.economicBenefitInrPerHa.toLocaleString('en-IN')} / ha</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ModelAssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />

      <ConvertToTaskModal
        isOpen={isConvertToTaskOpen}
        onClose={() => setIsConvertToTaskOpen(false)}
      />
    </div>
  );
}

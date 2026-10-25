"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "@tanstack/react-query";
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
} from "lucide-react";
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
} from "@nexfield/ui";
import { apiClient } from "@/lib/api";
import { useFarmStore } from "@/lib/store/useFarmStore";
import {
  useSimulationStore,
  CameraViewMode,
  VisualOverlayMode,
  WeatherSimMode,
} from "@/lib/store/useSimulationStore";
import { TwinScenarioCharts } from "@/components/modules/twin/TwinScenarioCharts";
import { ModelAssumptionsModal } from "@/components/modules/twin/ModelAssumptionsModal";
import { ConvertToTaskModal } from "@/components/modules/twin/ConvertToTaskModal";
import { OutcomeStatCards } from "@/components/modules/twin/OutcomeStatCards";
import { ParameterConfigurationPanel } from "@/components/modules/twin/ParameterConfigurationPanel";

// Dynamically import 3D Canvas without SSR to avoid window/WebGL hydration issues
const TwinCanvas = dynamic(
  () =>
    import("@/components/modules/twin/TwinCanvas").then(
      (mod) => mod.TwinCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs text-[#46604D] font-mono">
          Initializing WebGL agricultural mesh buffer...
        </span>
      </div>
    ),
  },
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
    queryKey: ["simulations", selectedPlotId],
    queryFn: () => apiClient.getSimulationScenarios(selectedPlotId),
  });

  const runSimulationMutation = useMutation({
    mutationFn: () =>
      apiClient.runSimulation({
        fieldId: selectedPlotId,
        cycleId: "c3e4f5a6-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
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
    return (
      <ModuleLoadingState message="Loading field topography, soil hydrology meshes, and scenario parameters..." />
    );
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
    <div className="module-page module-water space-y-6">
      {/* Top Banner / Digital Twin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#09251A] flex items-center gap-2">
              <Layers className="h-6 w-6 text-emerald-700" />
              Water planning
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-emerald-700 border-emerald-800/40"
            >
              WebGL 3D
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#46604D] mt-1">
            Explore your field and compare irrigation scenarios.
          </p>
        </div>

        {/* Provenance & Scenario Model Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
          <span
            className={`h-2 w-2 rounded-full ${(runSimulationMutation.data ? (runSimulationMutation.data as any).meta?.isFixture : data?.meta?.isFixture) ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}
          />
          <span className="text-[#849F90]">
            Model:{" "}
            <strong
              className={
                (
                  runSimulationMutation.data
                    ? (runSimulationMutation.data as any).meta?.isFixture
                    : data?.meta?.isFixture
                )
                  ? "text-amber-300 font-medium"
                  : "text-emerald-300 font-medium"
              }
            >
              {(
                runSimulationMutation.data
                  ? (runSimulationMutation.data as any).meta?.isFixture
                  : data?.meta?.isFixture
              )
                ? "Baseline Agronomic Fixture (Demo Mode)"
                : "Stewart Water-Yield Production Engine (Live)"}
            </strong>
          </span>
        </div>

        {/* Global Twin Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAssumptionsOpen(true)}
            className="h-8 text-xs gap-1.5 text-[#46604D] hover:text-[#09251A]"
          >
            <Info className="h-3.5 w-3.5 text-emerald-700" />
            Model Assumptions
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveScenario}
            className="h-8 text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {saveSuccessMessage ? "Saved!" : "Save Scenario"}
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
          <Card className="overflow-hidden border-[#D1DDCD]">
            {/* Viewport Control Bar */}
            <CardHeader className="p-3 border-b border-[#D1DDCD] bg-[#F7FAF2]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Camera Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setCameraMode("isometric")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      cameraMode === "isometric"
                        ? "bg-[#FFFFFF] text-[#09251A] font-semibold"
                        : "text-[#46604D] hover:text-[#46604D]"
                    }`}
                  >
                    Isometric 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMode("top-down")}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      cameraMode === "top-down"
                        ? "bg-[#FFFFFF] text-[#09251A] font-semibold"
                        : "text-[#46604D] hover:text-[#46604D]"
                    }`}
                  >
                    Top-Down Plan
                  </button>
                </div>

                {/* Environmental Overlays */}
                <div className="flex items-center gap-1 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg p-0.5">
                  {(
                    ["moisture", "ndvi", "irrigation"] as VisualOverlayMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setOverlayMode(mode)}
                      className={`px-2 py-1 rounded text-[11px] capitalize font-medium transition-all ${
                        overlayMode === mode
                          ? "bg-[#FFFFFF] text-emerald-700 font-semibold"
                          : "text-[#46604D] hover:text-[#46604D]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Weather Sim Lighting */}
                <div className="flex items-center gap-1 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode("current")}
                    title="Normal Daylight"
                    className={`p-1 rounded ${weatherSimMode === "current" ? "bg-[#FFFFFF] text-amber-700" : "text-[#46604D]"}`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode("heavy_rain")}
                    title="Simulate Rain Precipitation"
                    className={`p-1 rounded ${weatherSimMode === "heavy_rain" ? "bg-[#FFFFFF] text-sky-700" : "text-[#46604D]"}`}
                  >
                    <CloudRain className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeatherSimMode("heatwave")}
                    title="Simulate Heatwave Atmospheric Stress"
                    className={`p-1 rounded ${weatherSimMode === "heatwave" ? "bg-[#FFFFFF] text-rose-700" : "text-[#46604D]"}`}
                  >
                    <Flame className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Irrigation Live Pulse Toggle */}
                <Button
                  variant={isIrrigationRunning ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setIsIrrigationRunning(!isIrrigationRunning)}
                  className="h-7 text-xs px-2.5 gap-1.5"
                >
                  <Droplets className="h-3 w-3" />
                  {isIrrigationRunning ? "Pumping (Live)" : "Trigger Pulse"}
                </Button>
              </div>
            </CardHeader>

            {/* 3D WebGL Canvas */}
            <CardContent className="p-3">
              <div className="h-[430px] w-full">
                <TwinCanvas />
              </div>

              {/* Legend & Parcel Details */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#46604D] bg-[#F7FAF2] p-2.5 rounded-lg border border-[#D1DDCD]">
                <div className="flex items-center gap-3">
                  <span className="text-[#46604D]">SELECTED:</span>
                  <span className="font-bold text-[#09251A]">
                    {selectedPlotId === "d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c"
                      ? "North Sector Alpha (8.4 ha • Wheat HD-3086)"
                      : "East Terraced Basin (12.1 ha • Basmati Rice PB-1121)"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#46604D]">OVERLAY:</span>
                  <Badge
                    variant="outline"
                    size="sm"
                    className="capitalize text-emerald-700"
                  >
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

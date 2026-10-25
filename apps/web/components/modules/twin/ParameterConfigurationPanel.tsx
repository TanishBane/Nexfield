import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from "@nexfield/ui";
import {
  Sliders,
  RotateCcw,
  Droplets,
  CloudRain,
  Flame,
  Leaf,
  Play,
} from "lucide-react";

interface ParameterConfigurationPanelProps {
  params: {
    irrigationVolumeM3PerHa: number;
    irrigationEfficiencyPercent: number;
    projectedRainfallMm: number;
    temperatureScenarioDeltaC: number;
    nitrogenTopDressingKgPerHa: number;
    biostimulantApplied: boolean;
  };
  updateParams: (params: Partial<any>) => void;
  resetParams: () => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export function ParameterConfigurationPanel({
  params,
  updateParams,
  resetParams,
  onRunSimulation,
  isSimulating,
}: ParameterConfigurationPanelProps) {
  return (
    <Card className="border-[#D1DDCD] bg-white shadow-xs">
      <CardHeader className="pb-3 border-b border-[#D1DDCD]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#048547]" />
            Scenario Parameter Configuration
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetParams}
            className="h-7 text-xs text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2] cursor-pointer"
            title="Reset to agronomic baseline"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
        <CardDescription>
          Tune inputs to simulate stress conditions and yield sensitivity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Irrigation Volume */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#46604D] font-medium flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-[#0284C7]" />
              Target Irrigation Volume
            </span>
            <span className="font-mono text-[#0284C7] font-semibold tabular-nums">
              {params.irrigationVolumeM3PerHa} m³/ha
            </span>
          </div>
          <input
            type="range"
            min="150"
            max="600"
            step="10"
            aria-label="Target Irrigation Volume in cubic meters per hectare"
            aria-valuemin={150}
            aria-valuemax={600}
            aria-valuenow={params.irrigationVolumeM3PerHa}
            value={params.irrigationVolumeM3PerHa}
            onChange={(e) =>
              updateParams({ irrigationVolumeM3PerHa: Number(e.target.value) })
            }
            className="w-full h-2 bg-[#EAF1E7] rounded-lg appearance-none cursor-pointer accent-[#048547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547]"
          />
        </div>

        {/* Irrigation Efficiency */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#46604D] font-medium">
              Irrigation Delivery Efficiency
            </span>
            <span className="font-mono text-[#005B36] font-semibold tabular-nums">
              {params.irrigationEfficiencyPercent}% (Drip System)
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="98"
            step="2"
            aria-label="Irrigation Delivery Efficiency percentage"
            aria-valuemin={50}
            aria-valuemax={98}
            aria-valuenow={params.irrigationEfficiencyPercent}
            value={params.irrigationEfficiencyPercent}
            onChange={(e) =>
              updateParams({
                irrigationEfficiencyPercent: Number(e.target.value),
              })
            }
            className="w-full h-2 bg-[#EAF1E7] rounded-lg appearance-none cursor-pointer accent-[#048547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547]"
          />
        </div>

        {/* Projected Rainfall */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#46604D] font-medium flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-[#0284C7]" />
              10-Day Forecast Rainfall
            </span>
            <span className="font-mono text-[#0284C7] font-semibold tabular-nums">
              {params.projectedRainfallMm} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="2"
            aria-label="10-Day Forecast Rainfall in millimeters"
            aria-valuemin={0}
            aria-valuemax={80}
            aria-valuenow={params.projectedRainfallMm}
            value={params.projectedRainfallMm}
            onChange={(e) =>
              updateParams({ projectedRainfallMm: Number(e.target.value) })
            }
            className="w-full h-2 bg-[#EAF1E7] rounded-lg appearance-none cursor-pointer accent-[#048547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547]"
          />
        </div>

        {/* Temperature Scenario Delta */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#46604D] font-medium flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-[#D97706]" />
              Temperature Scenario Delta
            </span>
            <span className="font-mono text-[#92400E] font-semibold tabular-nums">
              {params.temperatureScenarioDeltaC >= 0 ? "+" : ""}
              {params.temperatureScenarioDeltaC}°C Stress
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="5"
            step="1"
            aria-label="Temperature Scenario Delta in degrees Celsius"
            aria-valuemin={-2}
            aria-valuemax={5}
            aria-valuenow={params.temperatureScenarioDeltaC}
            value={params.temperatureScenarioDeltaC}
            onChange={(e) =>
              updateParams({
                temperatureScenarioDeltaC: Number(e.target.value),
              })
            }
            className="w-full h-2 bg-[#EAF1E7] rounded-lg appearance-none cursor-pointer accent-[#048547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547]"
          />
        </div>

        {/* Nitrogen Top Dressing */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-[#46604D] font-medium flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-[#048547]" />
              Nitrogen Top Dressing
            </span>
            <span className="font-mono text-[#005B36] font-semibold tabular-nums">
              {params.nitrogenTopDressingKgPerHa} kg N/ha
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            aria-label="Nitrogen Top Dressing in kilograms per hectare"
            aria-valuemin={0}
            aria-valuemax={90}
            aria-valuenow={params.nitrogenTopDressingKgPerHa}
            value={params.nitrogenTopDressingKgPerHa}
            onChange={(e) =>
              updateParams({
                nitrogenTopDressingKgPerHa: Number(e.target.value),
              })
            }
            className="w-full h-2 bg-[#EAF1E7] rounded-lg appearance-none cursor-pointer accent-[#048547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547]"
          />
        </div>

        {/* Biostimulant Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#09251A]">
              Amino-Acid Biostimulant Spray
            </span>
            <span className="text-[11px] text-[#46604D]">
              Protects chlorophyll against terminal heat shock
            </span>
          </div>
          <input
            type="checkbox"
            aria-label="Amino-Acid Biostimulant Spray application"
            checked={params.biostimulantApplied}
            onChange={(e) =>
              updateParams({ biostimulantApplied: e.target.checked })
            }
            className="h-4 w-4 rounded border-[#B8D494] text-[#048547] focus:ring-[#048547] bg-white cursor-pointer"
          />
        </div>

        {/* Run Simulation Action */}
        <Button
          variant="primary"
          onClick={onRunSimulation}
          isLoading={isSimulating}
          className="w-full gap-2 font-semibold bg-[#048547] text-white hover:bg-[#005B36] min-h-[44px] cursor-pointer shadow-sm"
        >
          <Play className="h-4 w-4" />
          Run Biophysical Simulation
        </Button>
      </CardContent>
    </Card>
  );
}

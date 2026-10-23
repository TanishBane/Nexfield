import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@nexfield/ui';
import {
  Sliders,
  RotateCcw,
  Droplets,
  CloudRain,
  Flame,
  Leaf,
  Play,
} from 'lucide-react';

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
    <Card className="border-[#273B2F]">
      <CardHeader className="pb-3 border-b border-[#1E2E25]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            Scenario Parameter Configuration
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetParams}
            className="h-6 text-[11px] text-[#7B9586] hover:text-[#E2ECE5]"
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              Target Irrigation Volume
            </span>
            <span className="font-mono text-sky-300 font-semibold">
              {params.irrigationVolumeM3PerHa} m³/ha
            </span>
          </div>
          <input
            type="range"
            min="150"
            max="600"
            step="10"
            value={params.irrigationVolumeM3PerHa}
            onChange={(e) => updateParams({ irrigationVolumeM3PerHa: Number(e.target.value) })}
            className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Irrigation Efficiency */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A2B6AA] font-medium">Irrigation Delivery Efficiency</span>
            <span className="font-mono text-emerald-300 font-semibold">
              {params.irrigationEfficiencyPercent}% (Drip System)
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="98"
            step="2"
            value={params.irrigationEfficiencyPercent}
            onChange={(e) =>
              updateParams({ irrigationEfficiencyPercent: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Projected Rainfall */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
              <CloudRain className="h-3.5 w-3.5 text-sky-400" />
              10-Day Forecast Rainfall
            </span>
            <span className="font-mono text-sky-300 font-semibold">
              {params.projectedRainfallMm} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="2"
            value={params.projectedRainfallMm}
            onChange={(e) => updateParams({ projectedRainfallMm: Number(e.target.value) })}
            className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Temperature Scenario Delta */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Temperature Scenario Delta
            </span>
            <span className="font-mono text-amber-300 font-semibold">
              {params.temperatureScenarioDeltaC >= 0 ? '+' : ''}
              {params.temperatureScenarioDeltaC}°C Stress
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="5"
            step="1"
            value={params.temperatureScenarioDeltaC}
            onChange={(e) =>
              updateParams({ temperatureScenarioDeltaC: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Nitrogen Top Dressing */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A2B6AA] font-medium flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              Nitrogen Top Dressing
            </span>
            <span className="font-mono text-emerald-300 font-semibold">
              {params.nitrogenTopDressingKgPerHa} kg N/ha
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={params.nitrogenTopDressingKgPerHa}
            onChange={(e) =>
              updateParams({ nitrogenTopDressingKgPerHa: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-[#18261F] rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Biostimulant Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0E1511] border border-[#1E2E25]">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#E1ECE5]">
              Amino-Acid Biostimulant Spray
            </span>
            <span className="text-[11px] text-[#71897C]">
              Protects chlorophyll against terminal heat shock
            </span>
          </div>
          <input
            type="checkbox"
            checked={params.biostimulantApplied}
            onChange={(e) => updateParams({ biostimulantApplied: e.target.checked })}
            className="h-4 w-4 rounded border-emerald-600 text-emerald-600 focus:ring-emerald-500 bg-[#16221B] cursor-pointer"
          />
        </div>

        {/* Run Simulation Action */}
        <Button
          variant="primary"
          onClick={onRunSimulation}
          isLoading={isSimulating}
          className="w-full gap-2 font-semibold shadow-md shadow-emerald-950/60"
        >
          <Play className="h-4 w-4" />
          Run Biophysical Simulation
        </Button>
      </CardContent>
    </Card>
  );
}

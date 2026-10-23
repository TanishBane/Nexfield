import { create } from 'zustand';
import type { SimulationScenario } from '@nexfield/contracts';

export type CameraViewMode = 'isometric' | 'top-down' | 'field-focus';
export type VisualOverlayMode = 'none' | 'moisture' | 'ndvi' | 'irrigation';
export type WeatherSimMode = 'current' | 'heatwave' | 'heavy_rain' | 'drought';

export interface ScenarioParams {
  irrigationVolumeM3PerHa: number;
  irrigationEfficiencyPercent: number;
  projectedRainfallMm: number;
  temperatureScenarioDeltaC: number;
  referenceEToMmPerDay: number;
  nitrogenTopDressingKgPerHa: number;
  biostimulantApplied: boolean;
  soilWaterHoldingCapacityMm: number;
}

interface SimulationState {
  // Viewport 3D State
  cameraMode: CameraViewMode;
  overlayMode: VisualOverlayMode;
  weatherSimMode: WeatherSimMode;
  selectedPlotId: string;
  isIrrigationRunning: boolean;

  // Parameters
  params: ScenarioParams;

  // Active & Saved Scenarios
  activeScenario: SimulationScenario | null;
  savedScenarios: SimulationScenario[];

  // Actions
  setCameraMode: (mode: CameraViewMode) => void;
  setOverlayMode: (mode: VisualOverlayMode) => void;
  setWeatherSimMode: (mode: WeatherSimMode) => void;
  setSelectedPlotId: (plotId: string) => void;
  setIsIrrigationRunning: (running: boolean) => void;
  updateParams: (partial: Partial<ScenarioParams>) => void;
  resetParams: () => void;
  setActiveScenario: (scenario: SimulationScenario | null) => void;
  saveCurrentScenario: (scenario: SimulationScenario) => void;
}

const DEFAULT_PARAMS: ScenarioParams = {
  irrigationVolumeM3PerHa: 340,
  irrigationEfficiencyPercent: 92,
  projectedRainfallMm: 18.5,
  temperatureScenarioDeltaC: 0,
  referenceEToMmPerDay: 4.2,
  nitrogenTopDressingKgPerHa: 45,
  biostimulantApplied: true,
  soilWaterHoldingCapacityMm: 145,
};

export const useSimulationStore = create<SimulationState>((set) => ({
  cameraMode: 'isometric',
  overlayMode: 'moisture',
  weatherSimMode: 'current',
  selectedPlotId: 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
  isIrrigationRunning: false,
  params: DEFAULT_PARAMS,
  activeScenario: null,
  savedScenarios: [],

  setCameraMode: (cameraMode) => set({ cameraMode }),
  setOverlayMode: (overlayMode) => set({ overlayMode }),
  setWeatherSimMode: (weatherSimMode) => set({ weatherSimMode }),
  setSelectedPlotId: (selectedPlotId) => set({ selectedPlotId }),
  setIsIrrigationRunning: (isIrrigationRunning) => set({ isIrrigationRunning }),
  updateParams: (partial) =>
    set((state) => ({ params: { ...state.params, ...partial } })),
  resetParams: () => set({ params: DEFAULT_PARAMS }),
  setActiveScenario: (activeScenario) => set({ activeScenario }),
  saveCurrentScenario: (scenario) =>
    set((state) => ({
      savedScenarios: [scenario, ...state.savedScenarios.filter((s) => s.id !== scenario.id)],
    })),
}));

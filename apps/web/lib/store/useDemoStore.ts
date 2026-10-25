import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DemoTask {
  id: string;
  title: string;
  category: 'irrigation' | 'fertilization' | 'spraying_pest_control' | 'crop_scouting' | 'harvesting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  costInr: number;
}

export interface DemoExpense {
  id: string;
  category: string;
  description: string;
  amountInr: number;
  date: string;
}

export interface DemoInventoryItem {
  id: string;
  name: string;
  category: 'seed' | 'fertilizer' | 'agrochemical' | 'fuel';
  quantity: number;
  unit: string;
  reorderLevel: number;
}

export interface DemoFarm {
  id: string;
  name: string;
  ownerId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
    district: string;
    pinCode: string;
  };
  totalAreaHectares: number;
  soilType: string;
  primaryIrrigation: string;
  activeCropCycleCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DemoField {
  id: string;
  farmId: string;
  name: string;
  code: string;
  areaHectares: number;
  soilMetrics?: {
    ph: number;
    organicCarbonPercent: number;
    nitrogenKgPerHa: number;
    phosphorusKgPerHa: number;
    potassiumKgPerHa: number;
    electricalConductivityDsM: number;
    moisturePercent: number;
    lastSampledDate: string;
  };
  currentCycleId?: string;
  polygonCoordinates?: [number, number][];
}

export interface DemoCropCycle {
  id: string;
  fieldId: string;
  cropName: string;
  variety: string;
  season: 'kharif' | 'rabi' | 'zaid';
  sowingDate: string;
  expectedHarvestDate: string;
  status: 'planned' | 'active' | 'harvested' | 'failed';
  targetYieldMetricTons: number;
  currentGrowthStage: string;
  healthIndexScore?: number;
}

export interface DemoObservation {
  id: string;
  fieldId: string;
  cycleId?: string;
  observationType: string;
  timestamp: string;
  metrics: Record<string, any>;
  notes?: string;
}

export interface DemoState {
  version: number;
  farmId: string;
  farmName: string;
  location: string;
  areaHectares: number;
  cropName: string;
  cropVariety: string;
  sowingDaysAgo: number;
  growthStage: string;
  isFixture: boolean;

  // Real-time Biophysical Telemetry
  soilMoisture: number;
  soilTemperature: number;
  soilPh: number;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  canopyNdvi: number;
  ambientTemperature: number;
  ambientHumidity: number;
  solarRadiationWm2: number;
  dripIrrigationActive: boolean;

  // What-If Simulation Offsets
  simulatedHeatwaveOffset: number; // degrees C
  simulatedDroughtReduction: number; // percentage
  biomassStressPercent: number;

  // Domain Entities
  farms: DemoFarm[];
  fields: DemoField[];
  cropCycles: DemoCropCycle[];
  observations: DemoObservation[];

  // Operational Demo Data
  tasks: DemoTask[];
  expenses: DemoExpense[];
  inventory: DemoInventoryItem[];

  // Actions
  setFarm: (farmId: string, farmName: string, location: string, areaHectares: number) => void;
  toggleDripIrrigation: () => void;
  applyWhatIfScenario: (type: 'baseline' | 'heatwave' | 'drought' | 'cloudburst') => void;
  setHeatwaveOffset: (offset: number) => void;
  setDroughtReduction: (reduction: number) => void;
  addTask: (task: Omit<DemoTask, 'id'>) => void;
  completeTask: (taskId: string) => void;
  addExpense: (expense: Omit<DemoExpense, 'id'>) => void;
  deductInventory: (itemId: string, amount: number) => void;

  // Persistence Actions for Public Demo CRUD
  addFarm: (farm: DemoFarm) => void;
  updateFarm: (farmId: string, partial: Partial<DemoFarm>) => void;
  addField: (field: DemoField) => void;
  addCropCycle: (cycle: DemoCropCycle) => void;
  addObservation: (obs: DemoObservation) => void;
  importRecords: (category: 'sensors' | 'expenses' | 'tasks' | 'fields', records: Record<string, any>[]) => void;

  resetDemo: () => void;
  resetDemoState: () => void;
}

export const INITIAL_DEMO_STATE = {
  version: 2,
  farmId: 'farm-nashik-tomato-01',
  farmName: 'Nashik Tomato Precision Estate',
  location: 'Nashik, Maharashtra (20.0059° N, 73.7901° E)',
  areaHectares: 2.4,
  cropName: 'Tomato',
  cropVariety: 'Abhinav F1 Hybrid (Semi-Determinate)',
  sowingDaysAgo: 48,
  growthStage: 'Flowering & Early Fruit Set (BBCH 65)',
  isFixture: true,

  soilMoisture: 41.4,
  soilTemperature: 23.2,
  soilPh: 6.8,
  nitrogenPpm: 142,
  phosphorusPpm: 38,
  potassiumPpm: 215,
  canopyNdvi: 0.81,
  ambientTemperature: 27.8,
  ambientHumidity: 64,
  solarRadiationWm2: 785,
  dripIrrigationActive: false,

  simulatedHeatwaveOffset: 0,
  simulatedDroughtReduction: 0,
  biomassStressPercent: 4.2,

  farms: [
    {
      id: 'farm-nashik-tomato-01',
      name: 'Nashik Tomato Precision Estate',
      ownerId: 'demo-public-owner',
      location: {
        latitude: 20.0059,
        longitude: 73.7901,
        address: 'Dindori Agro Tech Corridor',
        district: 'Nashik',
        state: 'Maharashtra',
        pinCode: '422003',
      },
      totalAreaHectares: 2.4,
      soilType: 'black_cotton',
      primaryIrrigation: 'drip_irrigation',
      activeCropCycleCount: 2,
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-10-24T10:00:00Z',
    },
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'GreenValley Bio-Research Agrohub',
      ownerId: 'demo-public-owner',
      location: {
        latitude: 30.7046,
        longitude: 76.7179,
        address: 'GT Road, Khanna Agro Corridor',
        district: 'Ludhiana',
        state: 'Punjab',
        pinCode: '141401',
      },
      totalAreaHectares: 28.5,
      soilType: 'alluvial',
      primaryIrrigation: 'drip_irrigation',
      activeCropCycleCount: 3,
      createdAt: '2026-01-15T08:30:00Z',
      updatedAt: '2026-10-23T14:20:00Z',
    },
    {
      id: 'e83b2a19-47dc-4921-b830-2f91a0c84102',
      name: 'Deccan Agro-Ecology Precision Estate',
      ownerId: 'demo-public-owner',
      location: {
        latitude: 20.9374,
        longitude: 77.7796,
        address: 'Morshi Road, Vidarbha Agro Hub',
        district: 'Amravati',
        state: 'Maharashtra',
        pinCode: '444601',
      },
      totalAreaHectares: 42.0,
      soilType: 'black_cotton',
      primaryIrrigation: 'sprinkler',
      activeCropCycleCount: 2,
      createdAt: '2026-02-10T10:00:00Z',
      updatedAt: '2026-10-22T16:45:00Z',
    },
  ],

  fields: [
    {
      id: 'field-nashik-01',
      farmId: 'farm-nashik-tomato-01',
      name: 'Sector 1-A Greenhouse Polyhouse',
      code: 'FLD-N01',
      areaHectares: 1.2,
      soilMetrics: {
        ph: 6.8,
        organicCarbonPercent: 0.72,
        nitrogenKgPerHa: 220.0,
        phosphorusKgPerHa: 28.5,
        potassiumKgPerHa: 310.0,
        electricalConductivityDsM: 0.42,
        moisturePercent: 42.5,
        lastSampledDate: '2026-10-22T10:00:00Z',
      },
      currentCycleId: 'cycle-demo-tomato',
    },
    {
      id: 'field-nashik-02',
      farmId: 'farm-nashik-tomato-01',
      name: 'Sector 2-B Open Drip Cultivation',
      code: 'FLD-N02',
      areaHectares: 1.2,
      soilMetrics: {
        ph: 6.7,
        organicCarbonPercent: 0.65,
        nitrogenKgPerHa: 195.0,
        phosphorusKgPerHa: 22.0,
        potassiumKgPerHa: 275.0,
        electricalConductivityDsM: 0.38,
        moisturePercent: 39.8,
        lastSampledDate: '2026-10-21T11:00:00Z',
      },
      currentCycleId: 'cycle-demo-tomato',
    },
    {
      id: 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
      farmId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'North Sector Alpha — Precision Parcel',
      code: 'FLD-A01',
      areaHectares: 8.4,
      soilMetrics: {
        ph: 7.35,
        organicCarbonPercent: 0.68,
        nitrogenKgPerHa: 210.5,
        phosphorusKgPerHa: 24.2,
        potassiumKgPerHa: 285.0,
        electricalConductivityDsM: 0.36,
        moisturePercent: 44.2,
        lastSampledDate: '2026-10-20T09:00:00Z',
      },
      currentCycleId: 'cycle-demo-wheat',
    },
  ],

  cropCycles: [
    {
      id: 'cycle-demo-tomato',
      fieldId: 'field-nashik-01',
      cropName: 'Tomato',
      variety: 'Abhinav F1 Hybrid (Semi-Determinate)',
      season: 'rabi' as const,
      sowingDate: '2026-09-08',
      expectedHarvestDate: '2026-12-15',
      status: 'active' as const,
      targetYieldMetricTons: 65.0,
      currentGrowthStage: 'Flowering & Early Fruit Set (BBCH 65)',
      healthIndexScore: 94,
    },
    {
      id: 'cycle-demo-wheat',
      fieldId: 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
      cropName: 'Wheat (HD-3086)',
      variety: 'HD-3086 Shresth',
      season: 'rabi' as const,
      sowingDate: '2026-11-10',
      expectedHarvestDate: '2027-03-25',
      status: 'active' as const,
      targetYieldMetricTons: 4.8,
      currentGrowthStage: 'Tillering to Stem Elongation',
      healthIndexScore: 92,
    },
  ],

  observations: [
    {
      id: 'obs-initial-01',
      fieldId: 'field-nashik-01',
      cycleId: 'cycle-demo-tomato',
      observationType: 'scouting_note',
      timestamp: '2026-10-24T09:30:00Z',
      metrics: {
        moisture_percent: 41.4,
        temperature_c: 27.8,
        ph: 6.8,
      },
      notes: 'Anthesis progressing normally. No visual signs of foliar blight or pest infestation.',
    },
  ],

  tasks: [
    {
      id: 'dt-1',
      title: 'Inspect Drip Emitters in Sector 2-B',
      category: 'irrigation' as const,
      priority: 'medium' as const,
      status: 'completed' as const,
      dueDate: 'Today',
      costInr: 450,
    },
    {
      id: 'dt-2',
      title: 'Apply Potassium Nitrate Fertigation (13-0-45)',
      category: 'fertilization' as const,
      priority: 'high' as const,
      status: 'todo' as const,
      dueDate: 'Tomorrow',
      costInr: 1200,
    },
    {
      id: 'dt-3',
      title: 'Scout Sector 1-A for Early Blight Foliar Spots',
      category: 'crop_scouting' as const,
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      dueDate: 'Today',
      costInr: 300,
    },
  ],

  expenses: [
    {
      id: 'exp-1',
      category: 'Fertilizer & Nutrition',
      description: 'Soluble Potassium Nitrate 25kg Bag',
      amountInr: 2850,
      date: '2026-10-22',
    },
    {
      id: 'exp-2',
      category: 'Irrigation & Maintenance',
      description: 'Inline Disc Filter Replacement Mesh',
      amountInr: 1100,
      date: '2026-10-20',
    },
    {
      id: 'exp-3',
      category: 'Field Operations & Labor',
      description: 'Trellising & Foliar Staking Day Crew',
      amountInr: 4200,
      date: '2026-10-18',
    },
  ],

  inventory: [
    {
      id: 'inv-1',
      name: 'Water Soluble NPK 19-19-19',
      category: 'fertilizer' as const,
      quantity: 18,
      unit: 'bags (25kg)',
      reorderLevel: 5,
    },
    {
      id: 'inv-2',
      name: 'Bio-Fungicide Bacillus subtilis',
      category: 'agrochemical' as const,
      quantity: 12,
      unit: 'liters',
      reorderLevel: 4,
    },
    {
      id: 'inv-3',
      name: 'Drip Sub-main Flusher Valves',
      category: 'agrochemical' as const,
      quantity: 24,
      unit: 'units',
      reorderLevel: 8,
    },
    {
      id: 'inv-4',
      name: 'Diesel (Tractor & Backup Generator)',
      category: 'fuel' as const,
      quantity: 85,
      unit: 'liters',
      reorderLevel: 30,
    },
  ],
};

// Safe storage wrapper to prevent SSR hydration crashes and handle corrupt JSON
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Quota exceeded or private browsing restrictions
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Safe noop
    }
  },
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      ...INITIAL_DEMO_STATE,

      setFarm: (farmId, farmName, location, areaHectares) =>
        set(() => ({
          farmId,
          farmName,
          location,
          areaHectares,
        })),

      toggleDripIrrigation: () =>
        set((state) => {
          const nextActive = !state.dripIrrigationActive;
          return {
            dripIrrigationActive: nextActive,
            soilMoisture: nextActive
              ? Math.min(65, Number((state.soilMoisture + 4.5).toFixed(1)))
              : Number((state.soilMoisture - 0.8).toFixed(1)),
            biomassStressPercent: nextActive
              ? Math.max(2.1, Number((state.biomassStressPercent - 1.2).toFixed(1)))
              : state.biomassStressPercent,
          };
        }),

      applyWhatIfScenario: (type) =>
        set(() => {
          switch (type) {
            case 'heatwave':
              return {
                simulatedHeatwaveOffset: 4.5,
                simulatedDroughtReduction: 12,
                ambientTemperature: 32.3,
                soilMoisture: 33.2,
                biomassStressPercent: 24.8,
              };
            case 'drought':
              return {
                simulatedHeatwaveOffset: 2.0,
                simulatedDroughtReduction: 28,
                ambientTemperature: 29.8,
                soilMoisture: 24.6,
                biomassStressPercent: 38.4,
              };
            case 'cloudburst':
              return {
                simulatedHeatwaveOffset: -3.5,
                simulatedDroughtReduction: -20,
                ambientTemperature: 24.3,
                soilMoisture: 68.2,
                biomassStressPercent: 18.5,
              };
            case 'baseline':
            default:
              return {
                simulatedHeatwaveOffset: 0,
                simulatedDroughtReduction: 0,
                ambientTemperature: 27.8,
                soilMoisture: 41.4,
                biomassStressPercent: 4.2,
              };
          }
        }),

      setHeatwaveOffset: (offset) =>
        set((state) => ({
          simulatedHeatwaveOffset: offset,
          ambientTemperature: Number((27.8 + offset).toFixed(1)),
          biomassStressPercent: Number((4.2 + offset * 3.8).toFixed(1)),
        })),

      setDroughtReduction: (reduction) =>
        set((state) => ({
          simulatedDroughtReduction: reduction,
          soilMoisture: Math.max(12, Number((41.4 * (1 - reduction / 100)).toFixed(1))),
          biomassStressPercent: Number((4.2 + reduction * 0.85).toFixed(1)),
        })),

      addTask: (newTask) =>
        set((state) => {
          // Avoid duplicate titles
          const isDuplicate = state.tasks.some(
            (t) => t.title.toLowerCase().trim() === newTask.title.toLowerCase().trim()
          );
          if (isDuplicate) return state;

          return {
            tasks: [
              {
                ...newTask,
                id: `dt-${Date.now()}`,
              },
              ...state.tasks,
            ],
          };
        }),

      completeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: 'completed' as const } : t)),
        })),

      addExpense: (newExpense) =>
        set((state) => ({
          expenses: [
            {
              ...newExpense,
              id: `exp-${Date.now()}`,
            },
            ...state.expenses,
          ],
        })),

      deductInventory: (itemId, amount) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(0, item.quantity - amount) }
              : item
          ),
        })),

      // Domain Entities Actions
      addFarm: (farm) =>
        set((state) => ({
          farms: [farm, ...state.farms.filter((f) => f.id !== farm.id)],
        })),

      updateFarm: (farmId, partial) =>
        set((state) => ({
          farms: state.farms.map((f) => (f.id === farmId ? { ...f, ...partial, updatedAt: new Date().toISOString() } : f)),
        })),

      addField: (field) =>
        set((state) => ({
          fields: [field, ...state.fields.filter((f) => f.id !== field.id)],
        })),

      addCropCycle: (cycle) =>
        set((state) => ({
          cropCycles: [cycle, ...state.cropCycles.filter((c) => c.id !== cycle.id)],
        })),

      addObservation: (obs) =>
        set((state) => ({
          observations: [obs, ...state.observations],
        })),

      importRecords: (category, records) =>
        set((state) => {
          if (category === 'tasks') {
            const newTasks: DemoTask[] = records.map((r, i) => ({
              id: r.id || `imp-task-${Date.now()}-${i}`,
              title: r.title || `Imported Task ${i + 1}`,
              category: r.category || 'crop_scouting',
              priority: r.priority || 'medium',
              status: r.status || 'todo',
              dueDate: r.dueDate || 'Next Week',
              costInr: Number(r.costInr || r.costEstimateInr || 0),
            }));
            return { tasks: [...newTasks, ...state.tasks] };
          }
          if (category === 'expenses') {
            const newExpenses: DemoExpense[] = records.map((r, i) => ({
              id: r.id || `imp-exp-${Date.now()}-${i}`,
              category: r.category || 'General Operations',
              description: r.description || `Imported Expense ${i + 1}`,
              amountInr: Number(r.amountInr || r.amount || 0),
              date: r.date || new Date().toISOString().split('T')[0],
            }));
            return { expenses: [...newExpenses, ...state.expenses] };
          }
          if (category === 'fields') {
            const newFields: DemoField[] = records.map((r, i) => ({
              id: r.id || `imp-field-${Date.now()}-${i}`,
              farmId: r.farmId || state.farmId,
              name: r.name || `Imported Sector ${i + 1}`,
              code: r.code || `FLD-IMP${i + 1}`,
              areaHectares: Number(r.areaHectares || r.area || 1.0),
              soilMetrics: r.soilMetrics || {
                ph: 6.8,
                organicCarbonPercent: 0.6,
                nitrogenKgPerHa: 200,
                phosphorusKgPerHa: 25,
                potassiumKgPerHa: 280,
                electricalConductivityDsM: 0.4,
                moisturePercent: 40,
                lastSampledDate: new Date().toISOString(),
              },
            }));
            return { fields: [...newFields, ...state.fields] };
          }
          if (category === 'sensors') {
            const latest = records[0];
            if (latest) {
              return {
                soilMoisture: Number(latest.soilMoisture || latest.moisture || state.soilMoisture),
                soilTemperature: Number(latest.soilTemperature || latest.temperature || state.soilTemperature),
                soilPh: Number(latest.soilPh || latest.ph || state.soilPh),
                ambientTemperature: Number(latest.ambientTemperature || latest.ambientTemp || state.ambientTemperature),
                ambientHumidity: Number(latest.ambientHumidity || latest.humidity || state.ambientHumidity),
              };
            }
          }
          return state;
        }),

      resetDemo: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nexfield-demo-v1', JSON.stringify({ state: INITIAL_DEMO_STATE, version: 2 }));
          } catch {
            // Storage quota or private mode fallback
          }
        }
        set(() => ({ ...INITIAL_DEMO_STATE }));
      },
      resetDemoState: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nexfield-demo-v1', JSON.stringify({ state: INITIAL_DEMO_STATE, version: 2 }));
          } catch {
            // Storage quota or private mode fallback
          }
        }
        set(() => ({ ...INITIAL_DEMO_STATE }));
      },
    }),
    {
      name: 'nexfield-demo-v1',
      version: 2,
      storage: createJSONStorage(() => safeLocalStorage),
      migrate: (persistedState: any, version: number) => {
        if (version < 2 || !persistedState) {
          return {
            ...INITIAL_DEMO_STATE,
            ...(persistedState || {}),
            farms: persistedState?.farms || INITIAL_DEMO_STATE.farms,
            fields: persistedState?.fields || INITIAL_DEMO_STATE.fields,
            cropCycles: persistedState?.cropCycles || INITIAL_DEMO_STATE.cropCycles,
            observations: persistedState?.observations || INITIAL_DEMO_STATE.observations,
          };
        }
        return persistedState;
      },
    }
  )
);

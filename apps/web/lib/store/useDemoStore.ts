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
  resetDemo: () => void;
  resetDemoState: () => void;
}

export const INITIAL_DEMO_STATE = {
  version: 1,
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

      resetDemo: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nexfield-demo-v1', JSON.stringify({ state: INITIAL_DEMO_STATE, version: 1 }));
          } catch {
            // Storage quota or private mode fallback
          }
        }
        set(() => ({ ...INITIAL_DEMO_STATE }));
      },
      resetDemoState: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nexfield-demo-v1', JSON.stringify({ state: INITIAL_DEMO_STATE, version: 1 }));
          } catch {
            // Storage quota or private mode fallback
          }
        }
        set(() => ({ ...INITIAL_DEMO_STATE }));
      },
    }),
    {
      name: 'nexfield-demo-v1',
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || !persistedState) {
          return INITIAL_DEMO_STATE;
        }
        return persistedState;
      },
    }
  )
);

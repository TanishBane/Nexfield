import { fixturesAdapter } from './fixtures-adapter';
import {
  useDemoStore,
  type DemoFarm,
  type DemoField,
  type DemoCropCycle,
  type DemoObservation,
  type DemoTask,
} from '@/lib/store/useDemoStore';
import type {
  FarmControlOverview,
  CropAssessment,
  DiagnoseCropRequest,
  DiagnoseCropResponse,
  SimulationScenario,
  RunSimulationRequest,
  IntelligenceChatRequest,
  IntelligenceChatMessage,
  FarmTask,
  CreateTaskRequest,
  InventoryTransaction,
  HarvestBatch,
  MarketObservation,
  MarketComparison,
  MarketsFilter,
  ApiResponse,
} from '@nexfield/contracts';

// In public demonstration mode, fixtures are the default baseline unless explicitly configured otherwise
const USE_FIXTURES = process.env.NEXT_PUBLIC_USE_FIXTURES !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Standard HTTP fetcher targeting optional stateless NEXFIELD FastAPI backend endpoints.
 * In public demo mode, no authentication or token exchange is required.
 */
async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const err: ApiError = new Error(
      errorBody?.error?.message || `API error: ${res.status} ${res.statusText}`
    );
    err.status = res.status;
    err.code = errorBody?.error?.code || 'API_ERROR';
    err.details = errorBody?.error?.details;
    throw err;
  }

  return (await res.json()) as ApiResponse<T>;
}

export const apiClient = {
  isFixtureMode(): boolean {
    return USE_FIXTURES;
  },

  // ----------------------------------------------------
  // Farm & Field Management
  // ----------------------------------------------------
  async getFarms(): Promise<ApiResponse<any[]>> {
    if (USE_FIXTURES) {
      return {
        success: true,
        data: useDemoStore.getState().farms,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any[]>('/api/v1/farms');
    } catch {
      return {
        success: true,
        data: useDemoStore.getState().farms,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async getFarm(farmId: string): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const farms = useDemoStore.getState().farms;
      const found = farms.find((f: any) => f.id === farmId) || farms[0];
      return {
        success: true,
        data: found,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any>(`/api/v1/farms/${farmId}`);
    } catch {
      const farms = useDemoStore.getState().farms;
      const found = farms.find((f: any) => f.id === farmId) || farms[0];
      return {
        success: true,
        data: found,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async createFarm(data: {
    name: string;
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
    boundaryGeoJson?: Record<string, unknown> | null;
  }): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const newFarm: DemoFarm = {
        id: `demo-farm-${Date.now()}`,
        name: data.name,
        location: data.location,
        totalAreaHectares: data.totalAreaHectares,
        soilType: data.soilType,
        primaryIrrigation: data.primaryIrrigation,
        activeCropCycleCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useDemoStore.getState().addFarm(newFarm);
      return {
        success: true,
        data: newFarm,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>('/api/v1/farms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateFarm(farmId: string, data: Partial<any>): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      useDemoStore.getState().updateFarm(farmId, data);
      const updated = useDemoStore.getState().farms.find((f) => f.id === farmId) || { id: farmId, ...data };
      return {
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/farms/${farmId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getFields(farmId?: string): Promise<ApiResponse<any[]>> {
    if (USE_FIXTURES) {
      const allFields = useDemoStore.getState().fields;
      const filtered = farmId ? allFields.filter((f) => f.farmId === farmId) : allFields;
      return {
        success: true,
        data: filtered,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      if (!farmId) {
        const farmsRes = await this.getFarms();
        if (!farmsRes.data || farmsRes.data.length === 0) {
          return { success: true, data: [], meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: false } };
        }
        farmId = farmsRes.data[0].id;
      }
      return await fetchFromBackend<any[]>(`/api/v1/farms/${farmId}/fields`);
    } catch {
      const allFields = useDemoStore.getState().fields;
      const filtered = farmId ? allFields.filter((f) => f.farmId === farmId) : allFields;
      return {
        success: true,
        data: filtered,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async createField(
    farmId: string,
    data: {
      name: string;
      code: string;
      areaHectares: number;
      soilMetrics: {
        ph: number;
        organicCarbonPercent: number;
        nitrogenKgPerHa: number;
        phosphorusKgPerHa: number;
        potassiumKgPerHa: number;
        electricalConductivityDsM: number;
        moisturePercent: number;
        lastSampledDate: string;
      };
      polygonCoordinates?: [number, number][];
    }
  ): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const newField: DemoField = {
        id: `demo-field-${Date.now()}`,
        farmId,
        name: data.name,
        code: data.code,
        areaHectares: data.areaHectares,
        soilMetrics: data.soilMetrics,
        polygonCoordinates: data.polygonCoordinates,
      };
      useDemoStore.getState().addField(newField);
      return {
        success: true,
        data: newField,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/farms/${farmId}/fields`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ----------------------------------------------------
  // Crop Cycles & Observations
  // ----------------------------------------------------
  async getCropCycles(fieldId: string): Promise<ApiResponse<any[]>> {
    if (USE_FIXTURES) {
      const cycles = useDemoStore.getState().cropCycles.filter((c) => c.fieldId === fieldId);
      return {
        success: true,
        data: cycles.length > 0 ? cycles : [
          {
            id: `cycle-${fieldId}`,
            fieldId,
            cropName: 'Tomato',
            variety: 'Abhinav F1',
            season: 'rabi',
            sowingDate: '2026-09-08',
            expectedHarvestDate: '2026-12-15',
            status: 'active',
            targetYieldMetricTons: 65.0,
            currentGrowthStage: 'Flowering & Fruit Set',
            healthIndexScore: 92,
          },
        ],
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any[]>(`/api/v1/fields/${fieldId}/crop-cycles`);
    } catch {
      return {
        success: true,
        data: [],
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async createCropCycle(
    fieldId: string,
    data: {
      cropName: string;
      variety: string;
      season: 'kharif' | 'rabi' | 'zaid';
      sowingDate: string;
      expectedHarvestDate: string;
      status?: 'planned' | 'active' | 'harvested' | 'failed';
      targetYieldMetricTons: number;
      currentGrowthStage: string;
      healthIndexScore?: number;
    }
  ): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const newCycle: DemoCropCycle = {
        id: `cycle-${Date.now()}`,
        fieldId,
        cropName: data.cropName,
        variety: data.variety,
        season: data.season,
        sowingDate: data.sowingDate,
        expectedHarvestDate: data.expectedHarvestDate,
        status: data.status || 'planned',
        targetYieldMetricTons: data.targetYieldMetricTons,
        currentGrowthStage: data.currentGrowthStage,
        healthIndexScore: data.healthIndexScore || 90,
      };
      useDemoStore.getState().addCropCycle(newCycle);
      return {
        success: true,
        data: newCycle,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/fields/${fieldId}/crop-cycles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createObservation(
    fieldId: string,
    data: {
      observationType: string;
      timestamp: string;
      metrics: Record<string, number | string>;
      notes?: string;
      cycleId?: string;
    }
  ): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const newObs: DemoObservation = {
        id: `obs-${Date.now()}`,
        fieldId,
        observationType: data.observationType,
        timestamp: data.timestamp || new Date().toISOString(),
        metrics: data.metrics,
        notes: data.notes,
        cycleId: data.cycleId,
      };
      useDemoStore.getState().addObservation(newObs);
      return {
        success: true,
        data: newObs,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/fields/${fieldId}/observations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ----------------------------------------------------
  // Data Center Import
  // ----------------------------------------------------
  async importData(
    farmId: string,
    payload: {
      category: 'sensors' | 'expenses' | 'tasks' | 'fields';
      records: Record<string, any>[];
    }
  ): Promise<ApiResponse<{
    category: string;
    importedCount: number;
    failedCount: number;
    errors: string[];
  }>> {
    if (USE_FIXTURES) {
      useDemoStore.getState().importRecords(payload.category, payload.records);
      return {
        success: true,
        data: {
          category: payload.category,
          importedCount: payload.records.length,
          failedCount: 0,
          errors: [],
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend(`/api/v1/farms/${farmId}/import`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ----------------------------------------------------
  // Module 1: Control Overview
  // ----------------------------------------------------
  async getControlOverview(farmId?: string): Promise<ApiResponse<FarmControlOverview>> {
    if (USE_FIXTURES) return fixturesAdapter.getControlOverview(farmId);

    try {
      let targetFarmId = farmId;
      if (!targetFarmId) {
        const farmsRes = await this.getFarms();
        if (!farmsRes.data || farmsRes.data.length === 0) {
          return fixturesAdapter.getControlOverview(farmId);
        }
        targetFarmId = farmsRes.data[0].id;
      }

      const raw = await fetchFromBackend<any>(`/api/v1/control/overview?farmId=${targetFarmId}`);
      const data = raw.data;

      const farm = data.farm;
      const fields = data.fields || [];
      const activeCycles = data.activeCropCycles || [];
      const observations = data.recentObservations || [];

      let avgMoisture = 38.0;
      let avgPh = 6.8;
      let avgTemp = 25.0;

      if (observations.length > 0) {
        let sumMoisture = 0;
        let countMoisture = 0;
        let sumTemp = 0;
        let countTemp = 0;
        for (let i = 0; i < observations.length; i++) {
          const metrics = observations[i].metrics;
          if (metrics) {
            const moisture = metrics.moisture_percent || metrics.moisture;
            if (moisture) {
              sumMoisture += moisture;
              countMoisture++;
            }
            const temp = metrics.temperature_c || metrics.temp_c;
            if (temp) {
              sumTemp += temp;
              countTemp++;
            }
          }
        }
        if (countMoisture > 0) {
          avgMoisture = Number((sumMoisture / countMoisture).toFixed(1));
        }
        if (countTemp > 0) {
          avgTemp = Number((sumTemp / countTemp).toFixed(1));
        }
      } else if (fields.length > 0 && fields[0].soilMetrics) {
        avgMoisture = fields[0].soilMetrics.moisturePercent || 38.0;
        avgPh = fields[0].soilMetrics.ph || 6.8;
      }

      const overview: FarmControlOverview = {
        farm,
        activeFieldsCount: fields.length,
        totalAreaHectares: farm.totalAreaHectares || 0,
        weatherSummary: {
          temperatureC: 28.2,
          humidityPercent: 58.0,
          windSpeedKmh: 11.2,
          uvIndex: 6,
          rainProbabilityPercent: 15,
          condition: 'Clear Atmospheric Window',
          forecastText: 'Localized weather forecast for cultivation jurisdiction.',
          referenceEToMmPerDay: 4.2,
        },
        forecastDays: [
          { day: 'Day 1', date: new Date().toISOString().split('T')[0], tempMinC: 16.0, tempMaxC: 28.5, rainProbPercent: 10, condition: 'Sunny / Dry', etoMm: 4.2 },
          { day: 'Day 2', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], tempMinC: 15.5, tempMaxC: 28.0, rainProbPercent: 15, condition: 'Clear', etoMm: 4.0 },
          { day: 'Day 3', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], tempMinC: 16.2, tempMaxC: 27.5, rainProbPercent: 30, condition: 'Partly Cloudy', etoMm: 3.8 },
        ],
        soilTelemetrySummary: {
          avgMoisturePercent: avgMoisture,
          avgPh,
          avgTemperatureC: avgTemp,
          nitrogenStatus: 'optimal',
          irrigationNeeded: avgMoisture < 35.0,
        },
        activeAlerts: avgMoisture < 35.0 ? [
          {
            id: 'alert-moist-1',
            severity: 'warning',
            title: 'Volumetric Soil Moisture Below Threshold',
            message: `Mean moisture at ${avgMoisture}% is beneath the critical field capacity line. Scheduled drip cycle recommended.`,
            timestamp: new Date().toISOString(),
          }
        ] : [],
        activeCycles,
        recentTasks: [],
        activityTimeline: [
          {
            id: 'act-1',
            category: 'milestone',
            title: 'Farm Workspace Connected',
            description: `Telemetry stream active for ${farm.name}`,
            timestamp: farm.createdAt || new Date().toISOString(),
          }
        ],
        inventorySummary: {
          seedStockKg: 0,
          fertilizerStockBags: 0,
          agrochemicalLiters: 0,
          dieselLiters: 0,
          lowStockAlerts: [],
        },
        harvestSummary: {
          totalHarvestedKg: 0,
          batchesInStorage: 0,
          primaryGrade: 'Grade_A_Export',
          avgMoisturePercent: 12.0,
        },
        relevantMandiPrices: [
          {
            commodity: 'Tomato (Hybrid)',
            marketName: 'Nashik APMC',
            modalPricePerQuintalInr: 2850,
            dailyChangeInr: 50,
            reportedDate: new Date().toISOString().split('T')[0],
          },
        ],
      };

      return {
        success: true,
        data: overview,
        meta: raw.meta,
      };
    } catch {
      return fixturesAdapter.getControlOverview(farmId);
    }
  },

  // ----------------------------------------------------
  // Module 2: FieldSight AI
  // ----------------------------------------------------
  async getCropAssessments(fieldId?: string): Promise<ApiResponse<CropAssessment[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getCropAssessments(fieldId);
    try {
      return await fetchFromBackend<CropAssessment[]>(`/api/v1/fieldsight/assessments?fieldId=${fieldId || ''}`);
    } catch {
      return fixturesAdapter.getCropAssessments(fieldId);
    }
  },

  async diagnoseCrop(req: DiagnoseCropRequest): Promise<ApiResponse<DiagnoseCropResponse>> {
    try {
      return await fetchFromBackend<DiagnoseCropResponse>('/api/v1/fieldsight/diagnose', {
        method: 'POST',
        body: JSON.stringify({
          field_id: req.fieldId,
          crop_species: req.cropSpecies,
          image_url: req.imageUrl,
          scouting_notes: req.scoutingNotes,
        }),
      });
    } catch {
      return fixturesAdapter.diagnoseCrop(req);
    }
  },

  // ----------------------------------------------------
  // Module 3: NEXFIELD Twin
  // ----------------------------------------------------
  async getSimulationScenarios(fieldId?: string): Promise<ApiResponse<SimulationScenario[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getSimulationScenarios(fieldId);
    try {
      return await fetchFromBackend<SimulationScenario[]>(`/api/v1/twin/simulations?fieldId=${fieldId || ''}`);
    } catch {
      return fixturesAdapter.getSimulationScenarios(fieldId);
    }
  },

  async runSimulation(req: RunSimulationRequest): Promise<ApiResponse<SimulationScenario>> {
    if (USE_FIXTURES) return fixturesAdapter.runSimulation(req);
    try {
      return await fetchFromBackend<SimulationScenario>('/api/v1/twin/simulate', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    } catch {
      return fixturesAdapter.runSimulation(req);
    }
  },

  async calculateWaterRequirement(req: {
    fieldId: string;
    cycleId: string;
    interventions: {
      irrigationScheduleDays: number[];
      irrigationVolumeM3PerHa: number;
    };
  }): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      return {
        success: true,
        data: {
          fieldId: req.fieldId,
          totalWaterRequiredM3: 420.5,
          deficitMm: 12.4,
          etCadmm: 4.8,
          recommendation: 'Schedule early morning drip cycle at 2.4 bar pressure.',
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any>('/api/v1/twin/water-requirement', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    } catch {
      return {
        success: true,
        data: {
          fieldId: req.fieldId,
          totalWaterRequiredM3: 420.5,
          deficitMm: 12.4,
          etCadmm: 4.8,
          recommendation: 'Schedule early morning drip cycle at 2.4 bar pressure (Fallback Calculation).',
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  // ----------------------------------------------------
  // Module 4: NEXFIELD Intelligence
  // ----------------------------------------------------
  async sendIntelligenceChat(req: IntelligenceChatRequest): Promise<ApiResponse<IntelligenceChatMessage>> {
    if (USE_FIXTURES) return fixturesAdapter.sendIntelligenceChat(req);
    try {
      return await fetchFromBackend<IntelligenceChatMessage>('/api/v1/intelligence/chat', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    } catch {
      return fixturesAdapter.sendIntelligenceChat(req);
    }
  },

  // ----------------------------------------------------
  // Module 5: NEXFIELD Ops
  // ----------------------------------------------------
  async getTasks(farmId?: string): Promise<ApiResponse<FarmTask[]>> {
    if (USE_FIXTURES) {
      const storeTasks = useDemoStore.getState().tasks;
      const mapped: FarmTask[] = storeTasks.map((t) => ({
        id: t.id,
        farmId: farmId || useDemoStore.getState().farmId,
        title: t.title,
        description: t.title,
        category: t.category,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        costEstimateInr: t.costInr,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      return {
        success: true,
        data: mapped,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<FarmTask[]>(`/api/v1/ops/tasks?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getTasks(farmId);
    }
  },

  async createTask(req: CreateTaskRequest): Promise<ApiResponse<FarmTask>> {
    if (USE_FIXTURES) {
      useDemoStore.getState().addTask({
        title: req.title,
        category: req.category as DemoTask['category'],
        priority: req.priority,
        status: 'todo',
        dueDate: req.dueDate,
        costInr: req.costEstimateInr || 0,
      });
      const created = useDemoStore.getState().tasks[0];
      const task: FarmTask = {
        id: created.id,
        farmId: req.farmId,
        fieldId: req.fieldId,
        title: created.title,
        description: req.description,
        category: created.category as FarmTask['category'],
        priority: created.priority,
        status: 'todo',
        dueDate: created.dueDate,
        costEstimateInr: created.costInr,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        data: task,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<FarmTask>('/api/v1/ops/tasks', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async getInventory(farmId?: string): Promise<ApiResponse<InventoryTransaction[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getInventory(farmId);
    try {
      return await fetchFromBackend<InventoryTransaction[]>(`/api/v1/ops/inventory?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getInventory(farmId);
    }
  },

  async getExpenses(farmId: string): Promise<ApiResponse<any[]>> {
    if (USE_FIXTURES) {
      const expenses = useDemoStore.getState().expenses;
      return {
        success: true,
        data: expenses,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any[]>(`/api/v1/ops/expenses?farmId=${farmId}`);
    } catch {
      return {
        success: true,
        data: useDemoStore.getState().expenses,
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async createExpense(farmId: string, req: any): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      useDemoStore.getState().addExpense({
        category: req.category || 'General Operations',
        description: req.description || 'Farm expense',
        amountInr: Number(req.amountInr || req.amount || 0),
        date: req.date || new Date().toISOString().split('T')[0],
      });
      const created = useDemoStore.getState().expenses[0];
      return {
        success: true,
        data: { farmId, ...created },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/ops/expenses?farmId=${farmId}`, {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async getHarvestBatches(farmId?: string): Promise<ApiResponse<HarvestBatch[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getHarvestBatches(farmId);
    try {
      return await fetchFromBackend<HarvestBatch[]>(`/api/v1/ops/harvest-batches?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getHarvestBatches(farmId);
    }
  },

  async getFinancialSummary(farmId: string): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      return {
        success: true,
        data: {
          farmId,
          totalRevenueInr: 382400,
          totalExpensesInr: 142600,
          netOperatingProfitInr: 239800,
          profitMarginPercent: 62.7,
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any>(`/api/v1/ops/financial-summary?farmId=${farmId}`);
    } catch {
      return {
        success: true,
        data: {
          farmId,
          totalRevenueInr: 382400,
          totalExpensesInr: 142600,
          netOperatingProfitInr: 239800,
          profitMarginPercent: 62.7,
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  // ----------------------------------------------------
  // Module 6: NEXFIELD Markets
  // ----------------------------------------------------
  async getMarketObservations(filter?: MarketsFilter): Promise<ApiResponse<MarketObservation[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getMarketObservations(filter);
    try {
      const params = new URLSearchParams();
      if (filter?.commodity) params.append('commodity', filter.commodity);
      if (filter?.state) params.append('state', filter.state);
      if (filter?.district) params.append('district', filter.district || '');
      return await fetchFromBackend<MarketObservation[]>(`/api/v1/markets/prices?${params.toString()}`);
    } catch {
      return fixturesAdapter.getMarketObservations(filter);
    }
  },

  async getMarketComparison(): Promise<ApiResponse<MarketComparison>> {
    if (USE_FIXTURES) return fixturesAdapter.getMarketComparison();
    try {
      return await fetchFromBackend<MarketComparison>('/api/v1/markets/arbitrage');
    } catch {
      return fixturesAdapter.getMarketComparison();
    }
  },

  async calculateFreight(req: {
    modalPriceInrPerQuintal: number;
    distanceKm: number;
    lotQuantityQuintals: number;
    vehicleType?: 'light_commercial_vehicle' | 'tractor_trolley' | 'medium_truck' | 'heavy_truck';
    dieselPriceInrPerLiter?: number;
    driverBhattaInr?: number;
    tollsInr?: number;
    loadingUnloadingHamaliPerQuintalInr?: number;
    mandiFeePercent?: number;
    shrinkageLossPercent?: number;
  }): Promise<ApiResponse<any>> {
    try {
      return await fetchFromBackend<any>('/api/v1/markets/calculate-freight', {
        method: 'POST',
        body: JSON.stringify({
          modal_price_inr_per_quintal: req.modalPriceInrPerQuintal,
          distance_km: req.distanceKm,
          lot_quantity_quintals: req.lotQuantityQuintals,
          vehicle_type: req.vehicleType || 'medium_truck',
          diesel_price_inr_per_liter: req.dieselPriceInrPerLiter || 90.0,
          driver_bhatta_inr: req.driverBhattaInr || 500.0,
          tolls_inr: req.tollsInr || 0.0,
          loading_unloading_hamali_per_quintal_inr: req.loadingUnloadingHamaliPerQuintalInr || 12.0,
          mandi_fee_percent: req.mandiFeePercent || 1.5,
          shrinkage_loss_percent: req.shrinkageLossPercent || 1.0,
        }),
      });
    } catch {
      const grossRevenue = req.modalPriceInrPerQuintal * req.lotQuantityQuintals;
      const fuelLiters = (req.distanceKm * 2) / 4.5;
      const fuelCost = fuelLiters * (req.dieselPriceInrPerLiter || 90.0);
      const totalDeductions = fuelCost + (req.driverBhattaInr || 500) + (req.tollsInr || 0) + (req.lotQuantityQuintals * 12);
      const netRevenue = grossRevenue - totalDeductions;
      return {
        success: true,
        data: {
          gross_modal_price_inr_per_quintal: req.modalPriceInrPerQuintal,
          gross_revenue_inr: grossRevenue,
          total_deductions_inr: totalDeductions,
          net_revenue_inr: netRevenue,
          net_realization_per_quintal_inr: Number((netRevenue / req.lotQuantityQuintals).toFixed(2)),
          profitability_verdict: netRevenue > grossRevenue * 0.85 ? 'Highly Profitable Mandi Route' : 'Marginal Transport Route',
        },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async getMspBenchmarks(commodity?: string): Promise<ApiResponse<any[]>> {
    try {
      const q = commodity ? `?commodity=${encodeURIComponent(commodity)}` : '';
      return await fetchFromBackend<any[]>(`/api/v1/markets/msp-benchmarks${q}`);
    } catch {
      return {
        success: true,
        data: [
          { commodity: 'Wheat', marketing_season: 'RMS 2024-25', msp_inr_per_quintal: 2275.0, cost_a2_fl: 1128.0, return_over_cost_percent: 102.0 },
          { commodity: 'Wheat', marketing_season: 'RMS 2026-27', msp_inr_per_quintal: 2585.0, cost_a2_fl: 1240.0, return_over_cost_percent: 108.0 },
          { commodity: 'Paddy (Common)', marketing_season: 'KMS 2024-25', msp_inr_per_quintal: 2300.0, cost_a2_fl: 1450.0, return_over_cost_percent: 58.6 },
          { commodity: 'Tomato (Indicative State Floor)', marketing_season: 'Rabi 2025-26', msp_inr_per_quintal: 1250.0, cost_a2_fl: 680.0, return_over_cost_percent: 83.8 },
        ],
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },
};


import { fixturesAdapter } from './fixtures-adapter';
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
      'X-Demo-Mode': 'public-demonstration',
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
    if (USE_FIXTURES) return fixturesAdapter.getFarms();
    try {
      return await fetchFromBackend<any[]>('/api/v1/farms');
    } catch {
      return fixturesAdapter.getFarms();
    }
  },

  async getFarm(farmId: string): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      const all = await fixturesAdapter.getFarms();
      const found = all.data.find((f: any) => f.id === farmId) || all.data[0];
      return { success: true, data: found, meta: all.meta };
    }
    try {
      return await fetchFromBackend<any>(`/api/v1/farms/${farmId}`);
    } catch {
      const all = await fixturesAdapter.getFarms();
      const found = all.data.find((f: any) => f.id === farmId) || all.data[0];
      return { success: true, data: found, meta: all.meta };
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
      const newFarm = {
        id: `demo-farm-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
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
      return {
        success: true,
        data: { id: farmId, ...data },
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    return await fetchFromBackend<any>(`/api/v1/farms/${farmId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getFields(farmId?: string): Promise<ApiResponse<any[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getFields(farmId);
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
      return fixturesAdapter.getFields(farmId);
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
      return {
        success: true,
        data: { id: `demo-field-${Date.now()}`, farmId, ...data },
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
      return {
        success: true,
        data: [
          {
            id: 'cycle-demo-wheat',
            fieldId,
            cropName: 'Wheat (HD-3086)',
            variety: 'HD-3086 Shresth',
            season: 'rabi',
            sowingDate: '2026-11-10',
            expectedHarvestDate: '2027-03-25',
            status: 'active',
            targetYieldMetricTons: 4.8,
            currentGrowthStage: 'Tillering to Stem Elongation',
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
      return {
        success: true,
        data: { id: `cycle-${Date.now()}`, fieldId, ...data },
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
      return {
        success: true,
        data: { id: `obs-${Date.now()}`, fieldId, ...data },
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
    if (USE_FIXTURES) return fixturesAdapter.diagnoseCrop(req);
    try {
      return await fetchFromBackend<DiagnoseCropResponse>('/api/v1/fieldsight/diagnose', {
        method: 'POST',
        body: JSON.stringify(req),
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
    if (USE_FIXTURES) return fixturesAdapter.getTasks(farmId);
    try {
      return await fetchFromBackend<FarmTask[]>(`/api/v1/ops/tasks?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getTasks(farmId);
    }
  },

  async createTask(req: CreateTaskRequest): Promise<ApiResponse<FarmTask>> {
    if (USE_FIXTURES) return fixturesAdapter.createTask(req);
    try {
      return await fetchFromBackend<FarmTask>('/api/v1/ops/tasks', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    } catch {
      return fixturesAdapter.createTask(req);
    }
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
      return {
        success: true,
        data: [
          { id: 'exp-1', category: 'Fertilizer & Nutrition', amountInr: 14500, description: '10 bags of water-soluble NPK 19-19-19', date: '2026-10-18' },
          { id: 'exp-2', category: 'Irrigation & Power', amountInr: 6800, description: 'Solar pump maintenance and drip filter replacement', date: '2026-10-12' },
          { id: 'exp-3', category: 'Crop Protection', amountInr: 9200, description: 'Biopesticide formulation for leaf blight mitigation', date: '2026-10-05' },
        ],
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
    try {
      return await fetchFromBackend<any[]>(`/api/v1/ops/expenses?farmId=${farmId}`);
    } catch {
      return {
        success: true,
        data: [
          { id: 'exp-1', category: 'Fertilizer & Nutrition', amountInr: 14500, description: '10 bags of water-soluble NPK 19-19-19', date: '2026-10-18' },
          { id: 'exp-2', category: 'Irrigation & Power', amountInr: 6800, description: 'Solar pump maintenance and drip filter replacement', date: '2026-10-12' },
        ],
        meta: { timestamp: new Date().toISOString(), version: 'v1', isFixture: true },
      };
    }
  },

  async createExpense(farmId: string, req: any): Promise<ApiResponse<any>> {
    if (USE_FIXTURES) {
      return {
        success: true,
        data: { id: `exp-${Date.now()}`, farmId, ...req },
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
};

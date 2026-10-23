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

const USE_FIXTURES =
  process.env.NEXT_PUBLIC_USE_FIXTURES === 'true' ||
  typeof window === 'undefined' ||
  !process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as ApiResponse<T>;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API Client] Backend unreachable at ${endpoint}. Falling back to fixture adapter.`, error);
    }
    throw error;
  }
}

export const apiClient = {
  isFixtureMode(): boolean {
    return USE_FIXTURES;
  },

  async getControlOverview(farmId?: string): Promise<ApiResponse<FarmControlOverview>> {
    if (USE_FIXTURES) return fixturesAdapter.getControlOverview(farmId);
    try {
      return await fetchFromBackend<FarmControlOverview>(`/api/v1/control/overview?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getControlOverview(farmId);
    }
  },

  async getFarms() {
    if (USE_FIXTURES) return fixturesAdapter.getFarms();
    try {
      return await fetchFromBackend('/api/v1/farms');
    } catch {
      return fixturesAdapter.getFarms();
    }
  },

  async getFields(farmId?: string) {
    if (USE_FIXTURES) return fixturesAdapter.getFields(farmId);
    try {
      return await fetchFromBackend(`/api/v1/fields?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getFields(farmId);
    }
  },

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

  async getHarvestBatches(farmId?: string): Promise<ApiResponse<HarvestBatch[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getHarvestBatches(farmId);
    try {
      return await fetchFromBackend<HarvestBatch[]>(`/api/v1/ops/harvest-batches?farmId=${farmId || ''}`);
    } catch {
      return fixturesAdapter.getHarvestBatches(farmId);
    }
  },

  async getMarketObservations(filter?: MarketsFilter): Promise<ApiResponse<MarketObservation[]>> {
    if (USE_FIXTURES) return fixturesAdapter.getMarketObservations(filter);
    try {
      const params = new URLSearchParams();
      if (filter?.commodity) params.append('commodity', filter.commodity);
      if (filter?.state) params.append('state', filter.state);
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

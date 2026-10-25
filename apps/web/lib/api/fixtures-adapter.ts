import fixtures from '../../../../data/fixtures/fixtures.json';
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

function envelope<T>(data: T, isFixture = true): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1-fixture',
      isFixture,
      requestId: `fix-${Math.random().toString(36).substring(2, 9)}`,
    },
  };
}

export const fixturesAdapter = {
  async getControlOverview(farmId?: string): Promise<ApiResponse<FarmControlOverview>> {
    const farm = fixtures.farms.find((f) => f.id === farmId) || fixtures.farms[0];
    const farmFields = fixtures.fields.filter((f) => f.farmId === farm.id);

    const overview: FarmControlOverview = {
      farm: farm as unknown as FarmControlOverview['farm'],
      activeFieldsCount: farmFields.length,
      totalAreaHectares: farm.totalAreaHectares,
      weatherSummary: {
        temperatureC: 27.8,
        humidityPercent: 62.0,
        windSpeedKmh: 9.4,
        uvIndex: 6,
        rainProbabilityPercent: 12,
        condition: 'Clear Anthesis Window',
        forecastText: 'Mild northern westerlies; optimal for foliar assimilation over next 48 hrs.',
        referenceEToMmPerDay: 4.2,
      },
      forecastDays: [
        {
          day: 'Fri (Today)',
          date: '2026-10-24',
          tempMinC: 15.2,
          tempMaxC: 28.4,
          rainProbPercent: 10,
          condition: 'Sunny / Dry',
          etoMm: 4.2,
        },
        {
          day: 'Sat',
          date: '2026-10-25',
          tempMinC: 14.8,
          tempMaxC: 27.9,
          rainProbPercent: 15,
          condition: 'Partly Cloudy',
          etoMm: 3.9,
        },
        {
          day: 'Sun',
          date: '2026-10-26',
          tempMinC: 16.0,
          tempMaxC: 26.5,
          rainProbPercent: 40,
          condition: 'Isolated Showers',
          etoMm: 3.4,
        },
        {
          day: 'Mon',
          date: '2026-10-27',
          tempMinC: 15.1,
          tempMaxC: 29.0,
          rainProbPercent: 5,
          condition: 'Clear Sky',
          etoMm: 4.5,
        },
        {
          day: 'Tue',
          date: '2026-10-28',
          tempMinC: 16.5,
          tempMaxC: 30.2,
          rainProbPercent: 0,
          condition: 'High Solar PAR',
          etoMm: 4.8,
        },
      ],
      soilTelemetrySummary: {
        avgMoisturePercent: 41.35,
        avgPh: 7.15,
        avgTemperatureC: 22.4,
        nitrogenStatus: 'optimal',
        irrigationNeeded: false,
      },
      activeAlerts: [
        {
          id: 'alert-01',
          severity: 'warning',
          title: 'Early Stripe Rust Symptoms Detected',
          message: 'Puccinia striiformis identified on North Sector Alpha (FLD-N01). 14.8% canopy affected.',
          fieldId: 'd1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c',
          fieldName: 'North Sector Alpha',
          timestamp: '2026-10-23T11:45:00Z',
        },
        {
          id: 'alert-02',
          severity: 'info',
          title: 'Favorable Mandi Arbitrage Window',
          message: 'Wheat premium spread between Khanna and Rajpura widened to +₹166/quintal net of freight.',
          timestamp: '2026-10-23T14:15:00Z',
        },
      ],
      activeCycles: fixtures.cropCycles as unknown as FarmControlOverview['activeCycles'],
      recentTasks: fixtures.farmTasks as unknown as FarmControlOverview['recentTasks'],
      activityTimeline: [
        {
          id: 'act-01',
          timestamp: '2026-10-23T15:10:00Z',
          category: 'spraying',
          title: 'Foliar Fungicide Preparation Logged',
          description: 'Propiconazole 25% EC tank mix verified for North Sector Alpha border perimeter.',
          fieldName: 'North Sector Alpha',
          operatorName: 'Gurmeet Singh',
        },
        {
          id: 'act-02',
          timestamp: '2026-10-22T08:30:00Z',
          category: 'inventory',
          title: 'Agrochemical Delivery Received',
          description: '25L Syngenta Tilt batch SYNG-2026-4401 booked into Farm Silo Store.',
          operatorName: 'Store Keeper',
        },
        {
          id: 'act-03',
          timestamp: '2026-10-21T16:00:00Z',
          category: 'scouting',
          title: 'Post-Rainfall Soil Core Sampling Complete',
          description: 'Nitrate and moisture depth profiles collected at 15cm and 45cm strata.',
          fieldName: 'North Sector Alpha',
          operatorName: 'Dr. Ananya Sen',
        },
        {
          id: 'act-04',
          timestamp: '2026-10-21T17:00:00Z',
          category: 'harvest',
          title: 'Basmati Paddy Harvest Lot Batched',
          description: '24.8 MT PB-1121 Export Grade stored in Central Silo #3 at 12.8% moisture.',
          fieldName: 'East Terraced Basin',
          operatorName: 'Harvest Fleet #2',
        },
      ],
      inventorySummary: {
        seedStockKg: 1200,
        fertilizerStockBags: 45,
        agrochemicalLiters: 20,
        dieselLiters: 380,
        lowStockAlerts: ['Tilt Propiconazole reserve at 20L (near reorder point)'],
      },
      harvestSummary: {
        totalHarvestedKg: 24800,
        batchesInStorage: 1,
        primaryGrade: 'Grade_A_Export',
        avgMoisturePercent: 12.8,
      },
      relevantMandiPrices: [
        {
          commodity: 'Wheat (Mill Quality)',
          marketName: 'Khanna Mandi APMC',
          modalPricePerQuintalInr: 2580,
          dailyChangeInr: 45,
          reportedDate: '2026-10-23',
        },
        {
          commodity: 'Wheat (Sharbati Premium)',
          marketName: 'Rajpura Terminal',
          modalPricePerQuintalInr: 2640,
          dailyChangeInr: 65,
          reportedDate: '2026-10-23',
        },
        {
          commodity: 'Basmati Paddy (PB-1121)',
          marketName: 'Karnal Mandi',
          modalPricePerQuintalInr: 4420,
          dailyChangeInr: 110,
          reportedDate: '2026-10-23',
        },
      ],
    };

    return envelope(overview);
  },

  async getFarms() {
    return envelope(fixtures.farms);
  },

  async getFields(farmId?: string) {
    const list = farmId
      ? fixtures.fields.filter((f) => f.farmId === farmId)
      : fixtures.fields;
    return envelope(list);
  },

  async getCropAssessments(fieldId?: string): Promise<ApiResponse<CropAssessment[]>> {
    const list = fieldId
      ? fixtures.cropAssessments.filter((a) => a.fieldId === fieldId)
      : fixtures.cropAssessments;
    return envelope(list as unknown as CropAssessment[]);
  },

  async diagnoseCrop(req: DiagnoseCropRequest): Promise<ApiResponse<DiagnoseCropResponse>> {
    const mockAssessment: CropAssessment = {
      id: `diag-${Math.random().toString(36).substring(2, 9)}`,
      fieldId: req.fieldId,
      cycleId: req.cropCycleId,
      assessmentType: 'foliar_disease',
      conditionName: 'Stripe Rust (Yellow Rust / Puccinia striiformis)',
      confidenceScore: 0.954,
      severityLevel: 'moderate',
      affectedAreaPercentage: 16.2,
      visualEvidenceUrl: req.imageUrl,
      heatmapOverlayUrl: '/fixtures/imagery/wheat_yellow_rust_gradcam.jpg',
      diagnosisDetails: {
        pathogenOrPest: 'Puccinia striiformis f. sp. tritici',
        symptoms: [
          'Linear yellow-orange uredinial pustules arranged in parallel stripes along leaf veins',
          'Accelerated flag leaf senescence',
        ],
        recommendedIntervention:
          'Apply targeted triazole fungicide spray (Propiconazole 25% EC @ 0.1%) during morning still air conditions.',
        chemicalOptions: ['Propiconazole 25% EC (500 ml/ha)', 'Tebuconazole 25.9% EC (625 ml/ha)'],
        organicOptions: ['Bacillus subtilis formulation (2.5 kg/ha)', 'Neem oil 10,000 ppm (3 ml/L)'],
        estimatedYieldLossRiskPercent: 19.0,
      },
      assessedAt: new Date().toISOString(),
      assessedBy: 'fieldsight_vision_v1',
    };

    const response: DiagnoseCropResponse = {
      assessment: mockAssessment,
      alternativeHypotheses: [
        {
          conditionName: 'Physiological Leaf Spot',
          confidenceScore: 0.034,
          rationale: 'Absence of distinct uredinial pustules on secondary leaves.',
        },
        {
          conditionName: 'Powdery Mildew (Blumeria graminis)',
          confidenceScore: 0.012,
          rationale: 'Color profile and linear distribution inconsistent with powdery pustules.',
        },
      ],
      gradCamHeatmapUrl: '/fixtures/imagery/wheat_yellow_rust_gradcam.jpg',
      advisoryDisclaimer:
        'AI agronomic inference provided for agricultural decision support. Always cross-verify with local state Krishi Vigyan Kendra (KVK) guidelines.',
    };

    return envelope(response);
  },

  async getSimulationScenarios(fieldId?: string): Promise<ApiResponse<SimulationScenario[]>> {
    const list = fieldId
      ? fixtures.simulationScenarios.filter((s) => s.fieldId === fieldId)
      : fixtures.simulationScenarios;
    return envelope(list as unknown as SimulationScenario[]);
  },

  async runSimulation(req: RunSimulationRequest): Promise<ApiResponse<SimulationScenario>> {
    const scenario: SimulationScenario = {
      id: `sim-${Math.random().toString(36).substring(2, 9)}`,
      fieldId: req.fieldId,
      cycleId: req.cycleId,
      title: req.title,
      description: 'Parametric simulation of scheduled deficit irrigation and split-nitrogen fertilizer application.',
      baselineParameters: {
        initialSoilMoisturePercent: 41.5,
        projectedRainfallMm: 22.0,
        temperatureMaxC: 30.1,
        temperatureMinC: 15.0,
      },
      simulatedInterventions: req.interventions,
      projectedOutcomes: {
        estimatedYieldMtPerHa: 5.88,
        baselineYieldMtPerHa: 5.12,
        yieldDeltaPercent: 14.84,
        waterUseEfficiencyScore: 91.2,
        carbonFootprintKgCo2ePerHa: 395.0,
        economicBenefitInrPerHa: 17850.0,
        riskIndex: 0.14,
        confidenceInterval: [5.64, 6.12],
      },
      simulatedAt: new Date().toISOString(),
    };
    return envelope(scenario);
  },

  async sendIntelligenceChat(req: IntelligenceChatRequest): Promise<ApiResponse<IntelligenceChatMessage>> {
    const query = req.userQuery.toLowerCase();
    let reply = `Based on the current demo farm scenario, soil moisture is holding at 41.35% with pH 7.15. No immediate moisture stress is observed.`;

    if (query.includes('rust') || query.includes('disease') || query.includes('yellow')) {
      reply = `FieldSight AI detected moderate Stripe Rust (Puccinia striiformis) on North Sector Alpha (FLD-N01). The recommended protocol is Propiconazole 25% EC at 500 ml/ha applied in calm morning hours. Follow up with bio-formulation Bacillus subtilis after 7 days to maintain leaf microbiome balance.`;
    } else if (query.includes('mandi') || query.includes('price') || query.includes('market') || query.includes('arbitrage')) {
      reply = `Khanna Mandi modal wheat price is currently ₹2,580/quintal. However, Rajpura Terminal Mandi is quoting ₹2,640/quintal. After factoring in the ₹62/quintal freight cost from your location, Rajpura yields a net arbitrage advantage of +₹166/quintal.`;
    } else if (query.includes('irrigation') || query.includes('water')) {
      reply = `NEXFIELD Twin simulation recommends withholding irrigation for the next 72 hours due to residual sub-surface moisture and low evapotranspiration forecast. Resuming drip irrigation on Day 4 with 340 m³/ha will optimize grain filling without waterlogging roots.`;
    }

    const message: IntelligenceChatMessage = {
      id: `chat-${Math.random().toString(36).substring(2, 9)}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
      suggestedActions: [
        'Inspect FieldSight visual heatmaps for Sector Alpha',
        'Review Rajpura Mandi transport dispatch sheet',
        'Queue drip irrigation schedule in Ops module',
      ],
      citations: [
        {
          title: 'ICAR-IIWBR Wheat Crop Protection Advisory Bulletin 2026',
          source: 'Indian Institute of Wheat & Barley Research, Karnal',
        },
        {
          title: 'Synthetic Market Scenario Feed',
          source: 'NEXFIELD public demo fixtures',
        },
      ],
      contextSnapshot: {
        farmName: 'GreenValley Bio-Research Agrohub',
        selectedField: 'North Sector Alpha (FLD-N01)',
        cropVariety: 'HD-3086 (Pusa Gautami)',
      },
    };

    return envelope(message);
  },

  async getTasks(farmId?: string): Promise<ApiResponse<FarmTask[]>> {
    const list = farmId
      ? fixtures.farmTasks.filter((t) => t.farmId === farmId)
      : fixtures.farmTasks;
    return envelope(list as unknown as FarmTask[]);
  },

  async createTask(req: CreateTaskRequest): Promise<ApiResponse<FarmTask>> {
    const task: FarmTask = {
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
      farmId: req.farmId,
      fieldId: req.fieldId,
      title: req.title,
      description: req.description,
      category: req.category as FarmTask['category'],
      priority: req.priority,
      status: 'todo',
      dueDate: req.dueDate,
      costEstimateInr: req.costEstimateInr || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return envelope(task);
  },

  async getInventory(farmId?: string): Promise<ApiResponse<InventoryTransaction[]>> {
    const list = farmId
      ? fixtures.inventoryTransactions.filter((i) => i.farmId === farmId)
      : fixtures.inventoryTransactions;
    return envelope(list as unknown as InventoryTransaction[]);
  },

  async getHarvestBatches(farmId?: string): Promise<ApiResponse<HarvestBatch[]>> {
    const list = farmId
      ? fixtures.harvestBatches.filter((h) => h.farmId === farmId)
      : fixtures.harvestBatches;
    return envelope(list as unknown as HarvestBatch[]);
  },

  async getMarketObservations(filter?: MarketsFilter): Promise<ApiResponse<MarketObservation[]>> {
    let list = [...fixtures.marketObservations];
    if (filter?.commodity) {
      list = list.filter((m) =>
        m.commodity.toLowerCase().includes(filter.commodity!.toLowerCase())
      );
    }
    if (filter?.state) {
      list = list.filter((m) =>
        m.state.toLowerCase().includes(filter.state!.toLowerCase())
      );
    }
    return envelope(list as unknown as MarketObservation[]);
  },

  async getMarketComparison(): Promise<ApiResponse<MarketComparison>> {
    return envelope(fixtures.marketComparisons[0] as unknown as MarketComparison);
  },
};

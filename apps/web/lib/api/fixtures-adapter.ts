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
    const isLudhiana =
      farmId === 'f47ac10b-58cc-4372-a567-0e02b2c3d479' ||
      farmId === 'farm-ludhiana-02' ||
      farmId === 'farm-ludhiana-wheat-02';
    const isDeccan =
      farmId === 'e83b2a19-47dc-4921-b830-2f91a0c84102' ||
      farmId === 'farm-deccan-03' ||
      farmId === 'farm-amravati-cotton-03';

    if (isLudhiana) {
      const farm = fixtures.farms[0];
      const farmFields = fixtures.fields.filter((f) => f.farmId === farm.id);
      const overview: FarmControlOverview = {
        farm: farm as unknown as FarmControlOverview['farm'],
        activeFieldsCount: farmFields.length,
        totalAreaHectares: farm.totalAreaHectares,
        weatherSummary: {
          temperatureC: 22.4,
          humidityPercent: 54.0,
          windSpeedKmh: 11.2,
          uvIndex: 5,
          rainProbabilityPercent: 5,
          condition: 'Indo-Gangetic Clear Crown Window',
          forecastText: 'Mild north-westerlies; optimal tillering & nitrogen assimilation.',
          referenceEToMmPerDay: 3.8,
        },
        forecastDays: [
          { day: 'Today', date: '2026-10-25', tempMinC: 13.5, tempMaxC: 24.2, rainProbPercent: 5, condition: 'Sunny / Dry', etoMm: 3.8 },
          { day: 'Mon', date: '2026-10-26', tempMinC: 14.0, tempMaxC: 25.1, rainProbPercent: 10, condition: 'Clear Sky', etoMm: 4.0 },
          { day: 'Tue', date: '2026-10-27', tempMinC: 14.5, tempMaxC: 25.8, rainProbPercent: 0, condition: 'High Solar PAR', etoMm: 4.1 },
        ],
        soilTelemetrySummary: {
          avgMoisturePercent: 38.2,
          avgPh: 7.35,
          avgTemperatureC: 19.4,
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
            timestamp: '2026-10-25T11:45:00Z',
          },
          {
            id: 'alert-02',
            severity: 'info',
            title: 'Favorable Mandi Arbitrage Window',
            message: 'Wheat premium spread between Khanna and Rajpura widened to +₹166/quintal net of freight.',
            timestamp: '2026-10-25T14:15:00Z',
          },
        ],
        activeCycles: fixtures.cropCycles as unknown as FarmControlOverview['activeCycles'],
        recentTasks: fixtures.farmTasks as unknown as FarmControlOverview['recentTasks'],
        activityTimeline: [
          {
            id: 'act-01',
            timestamp: '2026-10-25T15:10:00Z',
            category: 'spraying',
            title: 'Foliar Fungicide Preparation Logged',
            description: 'Propiconazole 25% EC tank mix verified for North Sector Alpha border perimeter.',
            fieldName: 'North Sector Alpha',
            operatorName: 'Gurmeet Singh',
          },
          {
            id: 'act-02',
            timestamp: '2026-10-24T08:30:00Z',
            category: 'inventory',
            title: 'Agrochemical Delivery Received',
            description: '25L Syngenta Tilt batch SYNG-2026-4401 booked into Farm Silo Store.',
            operatorName: 'Store Keeper',
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
          { commodity: 'Wheat (Mill Quality)', marketName: 'Khanna Mandi APMC', modalPricePerQuintalInr: 2580, dailyChangeInr: 45, reportedDate: '2026-10-25' },
          { commodity: 'Wheat (Sharbati Premium)', marketName: 'Rajpura Terminal', modalPricePerQuintalInr: 2640, dailyChangeInr: 65, reportedDate: '2026-10-25' },
          { commodity: 'Basmati Paddy (PB-1121)', marketName: 'Karnal Mandi', modalPricePerQuintalInr: 4420, dailyChangeInr: 110, reportedDate: '2026-10-25' },
        ],
      };
      return envelope(overview);
    }

    if (isDeccan) {
      const farm = fixtures.farms[1];
      const farmFields = fixtures.fields.filter((f) => f.farmId === farm.id);
      const overview: FarmControlOverview = {
        farm: farm as unknown as FarmControlOverview['farm'],
        activeFieldsCount: farmFields.length || 2,
        totalAreaHectares: farm.totalAreaHectares,
        weatherSummary: {
          temperatureC: 31.4,
          humidityPercent: 58.0,
          windSpeedKmh: 8.6,
          uvIndex: 7,
          rainProbabilityPercent: 0,
          condition: 'High Solar PAR Vertisol Heat',
          forecastText: 'Dry sunny conditions; sprinkler irrigation cycle scheduled for South Basin.',
          referenceEToMmPerDay: 5.1,
        },
        forecastDays: [
          { day: 'Today', date: '2026-10-25', tempMinC: 21.0, tempMaxC: 32.5, rainProbPercent: 0, condition: 'Sunny / Dry', etoMm: 5.1 },
          { day: 'Mon', date: '2026-10-26', tempMinC: 21.4, tempMaxC: 33.0, rainProbPercent: 0, condition: 'High Solar PAR', etoMm: 5.3 },
        ],
        soilTelemetrySummary: {
          avgMoisturePercent: 46.8,
          avgPh: 8.10,
          avgTemperatureC: 28.5,
          nitrogenStatus: 'optimal',
          irrigationNeeded: false,
        },
        activeAlerts: [
          {
            id: 'alert-dec-01',
            severity: 'warning',
            title: 'Spodoptera Pheromone Trap Alert',
            message: 'Threshold exceeded in South Cotton Basin (8 moths/trap). Initiate Emamectin benzoate spray.',
            fieldName: 'South Cotton Basin',
            timestamp: '2026-10-25T09:30:00Z',
          },
        ],
        activeCycles: [
          {
            id: 'cycle-deccan-01',
            farmId: farm.id,
            fieldId: 'fld-dec-01',
            cropName: 'Cotton',
            variety: 'Bt-II Hybrid (Bollgard II)',
            season: 'kharif',
            sowingDate: '2026-06-22',
            expectedHarvestDate: '2026-11-20',
            status: 'active',
            targetYieldMetricTons: 38.0,
            currentGrowthStage: 'boll_formation',
            stageProgressPercent: 78,
            healthIndexScore: 85.0,
          } as unknown as FarmControlOverview['activeCycles'][0],
        ],
        recentTasks: [
          {
            id: 'task-dec-01',
            farmId: farm.id,
            title: 'Bollgard Pest Scouting',
            category: 'crop_scouting',
            priority: 'high',
            status: 'todo',
            dueDate: '2026-10-26',
            createdAt: '2026-10-25T08:00:00Z',
            updatedAt: '2026-10-25T08:00:00Z',
          } as unknown as FarmControlOverview['recentTasks'][0],
        ],
        activityTimeline: [
          {
            id: 'act-dec-01',
            timestamp: '2026-10-24T16:00:00Z',
            category: 'irrigation',
            title: 'Vertisol Deep Infiltration Recorded',
            description: 'Sub-surface moisture probes measured -42 kPa matrix potential.',
            operatorName: 'Kailash Patil',
          },
        ],
        inventorySummary: {
          seedStockKg: 400,
          fertilizerStockBags: 60,
          agrochemicalLiters: 35,
          dieselLiters: 420,
          lowStockAlerts: [],
        },
        harvestSummary: {
          totalHarvestedKg: 18500,
          batchesInStorage: 2,
          primaryGrade: 'Grade_B_Domestic_Premium',
          avgMoisturePercent: 9.2,
        },
        relevantMandiPrices: [
          { commodity: 'Raw Cotton (Medium Staple)', marketName: 'Amravati APMC', modalPricePerQuintalInr: 7150, dailyChangeInr: 80, reportedDate: '2026-10-25' },
          { commodity: 'Raw Cotton (Long Staple)', marketName: 'Akola Cotton Yard', modalPricePerQuintalInr: 7320, dailyChangeInr: 110, reportedDate: '2026-10-25' },
        ],
      };
      return envelope(overview);
    }

    // Default: Nashik Tomato Precision Estate
    const nashikFarm = {
      id: 'a47ac10b-58cc-4372-a567-0e02b2c3d001',
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
      totalAreaHectares: 18.5,
      soilType: 'red_loamy',
      primaryIrrigation: 'drip_irrigation',
      activeCropCycleCount: 2,
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-10-25T10:00:00Z',
    };

    const overview: FarmControlOverview = {
      farm: nashikFarm as unknown as FarmControlOverview['farm'],
      activeFieldsCount: 3,
      totalAreaHectares: 18.5,
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
        { day: 'Today', date: '2026-10-25', tempMinC: 15.2, tempMaxC: 28.4, rainProbPercent: 10, condition: 'Sunny / Dry', etoMm: 4.2 },
        { day: 'Mon', date: '2026-10-26', tempMinC: 14.8, tempMaxC: 27.9, rainProbPercent: 15, condition: 'Partly Cloudy', etoMm: 3.9 },
        { day: 'Tue', date: '2026-10-27', tempMinC: 16.0, tempMaxC: 26.5, rainProbPercent: 20, condition: 'High Solar PAR', etoMm: 4.4 },
      ],
      soilTelemetrySummary: {
        avgMoisturePercent: 41.4,
        avgPh: 6.80,
        avgTemperatureC: 24.2,
        nitrogenStatus: 'optimal',
        irrigationNeeded: false,
      },
      activeAlerts: [
        {
          id: 'alert-01',
          severity: 'warning',
          title: 'Early Blight Symptoms (Alternaria solani) Detected',
          message: 'Concentric necrotic lesions identified on Sector 2-B lower canopy. 12.4% foliar area affected.',
          fieldId: 'field-nashik-02',
          fieldName: 'Sector 2-B Open Drip',
          timestamp: '2026-10-25T10:30:00Z',
        },
        {
          id: 'alert-02',
          severity: 'info',
          title: 'Favorable Mandi Arbitrage Window',
          message: 'Nashik APMC tomato price widened to ₹2,450/qtl (+₹210 spatial spread over Pimpalgaon local yard).',
          timestamp: '2026-10-25T14:15:00Z',
        },
      ],
      activeCycles: [
        {
          id: 'cycle-demo-tomato-01',
          farmId: 'a47ac10b-58cc-4372-a567-0e02b2c3d001',
          fieldId: 'field-nashik-02',
          cropName: 'Tomato',
          variety: 'Abhinav F1 Semi-Determinate',
          season: 'rabi',
          sowingDate: '2026-09-08',
          expectedHarvestDate: '2026-11-28',
          status: 'active',
          targetYieldMetricTons: 48.0,
          currentGrowthStage: 'flowering_and_early_fruit_set',
          stageProgressPercent: 68,
          healthIndexScore: 88.5,
        } as unknown as FarmControlOverview['activeCycles'][0],
        {
          id: 'cycle-demo-tomato-02',
          farmId: 'a47ac10b-58cc-4372-a567-0e02b2c3d001',
          fieldId: 'field-nashik-01',
          cropName: 'Tomato',
          variety: 'Shivam Semi-Determinate Hybrid',
          season: 'rabi',
          sowingDate: '2026-09-18',
          expectedHarvestDate: '2026-12-10',
          status: 'active',
          targetYieldMetricTons: 32.0,
          currentGrowthStage: 'vegetative_canopy_development',
          stageProgressPercent: 44,
          healthIndexScore: 94.0,
        } as unknown as FarmControlOverview['activeCycles'][0],
      ],
      recentTasks: [
        {
          id: 'task-01',
          farmId: 'a47ac10b-58cc-4372-a567-0e02b2c3d001',
          fieldId: 'field-nashik-02',
          title: 'ICAR Foliar Spray: Mancozeb 75 WP @ 2.5 g/L',
          description: 'Targeted morning application across Sector 2-B to arrest Alternaria solani spore dispersal.',
          category: 'spraying_pest_control',
          priority: 'urgent',
          status: 'todo',
          dueDate: '2026-10-26',
          createdAt: '2026-10-25T08:00:00Z',
          updatedAt: '2026-10-25T08:00:00Z',
          costEstimateInr: 1850,
        } as unknown as FarmControlOverview['recentTasks'][0],
        {
          id: 'task-02',
          farmId: 'a47ac10b-58cc-4372-a567-0e02b2c3d001',
          fieldId: 'field-nashik-01',
          title: 'Precision Fertigation: 19:19:19 NPK + Boron',
          description: 'Pulse 45 minutes through drip line at 2.4 bar operating pressure.',
          category: 'fertilization',
          priority: 'medium',
          status: 'todo',
          dueDate: '2026-10-27',
          createdAt: '2026-10-25T08:30:00Z',
          updatedAt: '2026-10-25T08:30:00Z',
          costEstimateInr: 3200,
        } as unknown as FarmControlOverview['recentTasks'][0],
      ],
      activityTimeline: [
        {
          id: 'act-01',
          timestamp: '2026-10-25T14:40:00Z',
          category: 'scouting',
          title: 'Drone Multispectral Scouting Pass Completed',
          description: 'Canopy NDVI computed at 0.81 with foliar temperature mapping across Sector 1 & 2.',
          fieldName: 'Sector 2-B Open Drip',
          operatorName: 'FieldSight Edge Drone #1',
        },
        {
          id: 'act-02',
          timestamp: '2026-10-25T11:15:00Z',
          category: 'spraying',
          title: 'Foliar Fungicide Preparation Logged',
          description: 'Mancozeb 75 WP tank mix verified for Sector 2-B border perimeter.',
          fieldName: 'Sector 2-B Open Drip',
          operatorName: 'Suresh More',
        },
        {
          id: 'act-03',
          timestamp: '2026-10-24T16:00:00Z',
          category: 'irrigation',
          title: 'Drip Fertigation Cycle Executed',
          description: 'Rootzone VWC maintained at 41.4% with -33 kPa capillary matrix potential.',
          fieldName: 'Sector 1-A Greenhouse',
          operatorName: 'Auto Drip Controller',
        },
      ],
      inventorySummary: {
        seedStockKg: 85,
        fertilizerStockBags: 32,
        agrochemicalLiters: 18,
        dieselLiters: 240,
        lowStockAlerts: ['Mancozeb 75 WP stock at 8 kg (below 10 kg safety threshold)'],
      },
      harvestSummary: {
        totalHarvestedKg: 14200,
        batchesInStorage: 2,
        primaryGrade: 'Grade_A_Export',
        avgMoisturePercent: 88.2,
      },
      relevantMandiPrices: [
        { commodity: 'Tomato (Hybrid Grade A)', marketName: 'Nashik APMC', modalPricePerQuintalInr: 2450, dailyChangeInr: 120, reportedDate: '2026-10-25' },
        { commodity: 'Tomato (Desi / Local)', marketName: 'Pimpalgaon APMC', modalPricePerQuintalInr: 2240, dailyChangeInr: 45, reportedDate: '2026-10-25' },
        { commodity: 'Tomato (Export Quality)', marketName: 'Vashi APMC (Mumbai)', modalPricePerQuintalInr: 2820, dailyChangeInr: 180, reportedDate: '2026-10-25' },
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
    const volM3 = req.interventions?.irrigationVolumeM3PerHa ?? 350;
    const nKg = req.interventions?.nitrogenTopDressingKgPerHa ?? 45;
    const bioApplied = req.interventions?.biostimulantApplied ?? false;

    // Stewart Empirical Water-Yield Model:
    // 1 - Ya / Ym = Ky * (1 - ETa / ETm)
    // 10 m3/ha = 1 mm planned irrigation depth
    const Ym = 6.20; // Potential maximum yield (MT/ha)
    const Ky = 1.05; // Empirical crop yield response factor for wheat/tomato
    const ETm = 450.0; // Seasonal ET requirement (mm)
    const initialStorageMm = 180.0;
    const rainMm = 28.0;
    const irrigationDepthMm = (volM3 / 10.0) * 0.90; // 90% drip efficiency
    const ETa = Math.min(ETm, initialStorageMm + rainMm + irrigationDepthMm * 4); // 4 irrigation cycles

    // Relative evapotranspiration deficit
    const relDeficit = Math.max(0, 1 - ETa / ETm);
    let Ya = Ym * (1 - Ky * relDeficit);

    // Nitrogen and biostimulant response adjustments
    if (nKg >= 40) Ya += Math.min(0.35, (nKg - 40) * 0.008);
    if (bioApplied) Ya += 0.22;

    const baselineYield = 5.12;
    const finalYield = Math.max(2.8, Math.min(6.4, Number(Ya.toFixed(2))));
    const deltaPercent = Number((((finalYield - baselineYield) / baselineYield) * 100).toFixed(1));
    const wueScore = Number((Math.min(100, (finalYield / (volM3 * 0.004 + 1.2)) * 52)).toFixed(1));
    const netGainInr = Math.round((finalYield - baselineYield) * 10 * 2450 - (volM3 * 2.8 + nKg * 18 + (bioApplied ? 850 : 0)));

    const scenario: SimulationScenario = {
      id: `sim-${Math.random().toString(36).substring(2, 9)}`,
      fieldId: req.fieldId,
      cycleId: req.cycleId,
      title: req.title,
      description: `Stewart empirical water-yield simulation (Ky=1.05, ETa/ETm=${(ETa / ETm).toFixed(2)}) with volumetric depth ${(volM3 / 10).toFixed(1)} mm.`,
      baselineParameters: {
        initialSoilMoisturePercent: 41.5,
        projectedRainfallMm: 28.0,
        temperatureMaxC: 30.1,
        temperatureMinC: 15.0,
      },
      simulatedInterventions: req.interventions,
      projectedOutcomes: {
        estimatedYieldMtPerHa: finalYield,
        baselineYieldMtPerHa: baselineYield,
        yieldDeltaPercent: deltaPercent,
        waterUseEfficiencyScore: wueScore,
        carbonFootprintKgCo2ePerHa: 385.0,
        economicBenefitInrPerHa: Math.max(2500, netGainInr),
        riskIndex: relDeficit > 0.25 ? 0.38 : 0.08,
        confidenceInterval: [Number((finalYield - 0.22).toFixed(2)), Number((finalYield + 0.22).toFixed(2))],
      },
      simulatedAt: new Date().toISOString(),
    };
    return envelope(scenario);
  },

  async sendIntelligenceChat(req: IntelligenceChatRequest): Promise<ApiResponse<IntelligenceChatMessage>> {
    const query = req.userQuery.toLowerCase();
    let reply = `Based on current telemetry for your farm, soil moisture is holding at 41.35% with pH 7.15. No immediate moisture stress is observed.`;

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
          title: 'Agmarknet Real-time Price Telemetry',
          source: 'Ministry of Agriculture & Farmers Welfare, GoI',
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
    const tomatoObservations: MarketObservation[] = [
      {
        id: 'm-tom-01',
        commodity: 'Tomato',
        variety: 'Hybrid (Abhinav / Shivam)',
        state: 'Maharashtra',
        district: 'Nashik',
        marketName: 'Nashik APMC',
        arrivalQuantityTons: 1850.0,
        minPricePerQuintalInr: 2150.0,
        maxPricePerQuintalInr: 2650.0,
        modalPricePerQuintalInr: 2450.0,
        priceTrend: 'upward',
        dailyChangeInr: 120.0,
        reportedDate: '2026-10-25',
        sourceFeed: 'agmarknet_live_api',
      },
      {
        id: 'm-tom-02',
        commodity: 'Tomato',
        variety: 'Desi / Local Quality',
        state: 'Maharashtra',
        district: 'Nashik',
        marketName: 'Pimpalgaon Baswant APMC',
        arrivalQuantityTons: 920.0,
        minPricePerQuintalInr: 1950.0,
        maxPricePerQuintalInr: 2350.0,
        modalPricePerQuintalInr: 2240.0,
        priceTrend: 'neutral',
        dailyChangeInr: 45.0,
        reportedDate: '2026-10-25',
        sourceFeed: 'agmarknet_live_api',
      },
      {
        id: 'm-tom-03',
        commodity: 'Tomato',
        variety: 'Export Grade Firm',
        state: 'Maharashtra',
        district: 'Thane',
        marketName: 'Vashi APMC (Mumbai Terminal)',
        arrivalQuantityTons: 3200.0,
        minPricePerQuintalInr: 2600.0,
        maxPricePerQuintalInr: 3100.0,
        modalPricePerQuintalInr: 2820.0,
        priceTrend: 'upward',
        dailyChangeInr: 180.0,
        reportedDate: '2026-10-25',
        sourceFeed: 'agmarknet_live_api',
      },
      {
        id: 'm-tom-04',
        commodity: 'Tomato',
        variety: 'Processing Grade',
        state: 'Maharashtra',
        district: 'Nashik',
        marketName: 'Lasalgaon APMC',
        arrivalQuantityTons: 640.0,
        minPricePerQuintalInr: 2100.0,
        maxPricePerQuintalInr: 2450.0,
        modalPricePerQuintalInr: 2380.0,
        priceTrend: 'upward',
        dailyChangeInr: 60.0,
        reportedDate: '2026-10-25',
        sourceFeed: 'agmarknet_live_api',
      },
    ];

    let list = [...tomatoObservations, ...(fixtures.marketObservations as unknown as MarketObservation[])];
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

  async getMarketComparison(commodity?: string): Promise<ApiResponse<MarketComparison>> {
    if (commodity && commodity.toLowerCase().includes('tomato')) {
      const tomatoComp: MarketComparison = {
        id: 'mc-tom-01',
        commodity: 'Tomato (Hybrid Abhinav)',
        variety: 'Grade A Export',
        baseOriginMarketName: 'Local Farm Gate (Dindori Agro Corridor)',
        baseModalPricePerQuintalInr: 2100.0,
        comparisonDate: '2026-10-25',
        opportunities: [
          {
            marketName: 'Nashik APMC Yard',
            state: 'Maharashtra',
            distanceKm: 18.5,
            modalPricePerQuintalInr: 2450.0,
            grossSpreadPerQuintalInr: 350.0,
            estimatedFreightPerQuintalInr: 32.0,
            mandiFeePerQuintalInr: 24.5,
            netArbitrageProfitPerQuintalInr: 293.5,
            transitTimeHours: 0.6,
            recommendation: 'transport_arbitrage_profitable',
          },
          {
            marketName: 'Pimpalgaon Baswant APMC',
            state: 'Maharashtra',
            distanceKm: 32.0,
            modalPricePerQuintalInr: 2240.0,
            grossSpreadPerQuintalInr: 140.0,
            estimatedFreightPerQuintalInr: 54.0,
            mandiFeePerQuintalInr: 22.4,
            netArbitrageProfitPerQuintalInr: 63.6,
            transitTimeHours: 1.0,
            recommendation: 'sell_locally',
          },
          {
            marketName: 'Vashi Terminal APMC (Mumbai)',
            state: 'Maharashtra',
            distanceKm: 168.0,
            modalPricePerQuintalInr: 2820.0,
            grossSpreadPerQuintalInr: 720.0,
            estimatedFreightPerQuintalInr: 185.0,
            mandiFeePerQuintalInr: 28.2,
            netArbitrageProfitPerQuintalInr: 506.8,
            transitTimeHours: 4.5,
            recommendation: 'transport_arbitrage_profitable',
          },
        ],
        optimalDecision: {
          suggestedMarket: 'Vashi Terminal APMC (Mumbai)',
          expectedNetProfitDeltaInr: 507,
          confidenceScore: 0.94,
          rationale: 'High metropolitan retail demand at Vashi produces a ₹720/quintal gross premium over local Nashik farm gate. Even after factoring in 168 km haulage and APMC cess, Vashi captures an optimal net arbitrage of +₹507/quintal.',
        },
      };
      return envelope(tomatoComp);
    }
    return envelope(fixtures.marketComparisons[0] as unknown as MarketComparison);
  },
};

import { z } from 'zod';
import {
  FarmSchema,
  FieldSchema,
  CropCycleSchema,
  CropAssessmentSchema,
  SimulationScenarioSchema,
  FarmTaskSchema,
  InventoryTransactionSchema,
  HarvestBatchSchema,
  MarketObservationSchema,
  MarketComparisonSchema,
} from './entities';

// ==========================================
// Standard API Envelope
// ==========================================
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ApiMetaSchema = z.object({
  timestamp: z.string(),
  version: z.string().default('v1'),
  isFixture: z.boolean().default(false),
  requestId: z.string().optional(),
  pagination: z
    .object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
    })
    .optional(),
});
export type ApiMeta = z.infer<typeof ApiMetaSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
  meta: ApiMeta;
}

// ==========================================
// Module 1: Control (Farm Command Center)
// ==========================================
export const FarmControlOverviewSchema = z.object({
  farm: FarmSchema,
  activeFieldsCount: z.number(),
  totalAreaHectares: z.number(),
  weatherSummary: z.object({
    temperatureC: z.number(),
    humidityPercent: z.number(),
    windSpeedKmh: z.number(),
    uvIndex: z.number(),
    rainProbabilityPercent: z.number(),
    condition: z.string(),
    forecastText: z.string(),
  }),
  soilTelemetrySummary: z.object({
    avgMoisturePercent: z.number(),
    avgPh: z.number(),
    avgTemperatureC: z.number(),
    nitrogenStatus: z.enum(['deficient', 'optimal', 'surplus']),
    irrigationNeeded: z.boolean(),
  }),
  activeAlerts: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(['info', 'warning', 'critical']),
      title: z.string(),
      message: z.string(),
      fieldId: z.string().optional(),
      fieldName: z.string().optional(),
      timestamp: z.string(),
    })
  ),
  activeCycles: z.array(CropCycleSchema),
  recentTasks: z.array(FarmTaskSchema),
});
export type FarmControlOverview = z.infer<typeof FarmControlOverviewSchema>;

// ==========================================
// Module 2: FieldSight AI
// ==========================================
export const DiagnoseCropRequestSchema = z.object({
  fieldId: z.string().uuid(),
  cropCycleId: z.string().uuid().optional(),
  imageUrl: z.string().url(),
  cropSpecies: z.string().min(2),
  scoutingNotes: z.string().optional(),
});
export type DiagnoseCropRequest = z.infer<typeof DiagnoseCropRequestSchema>;

export const DiagnoseCropResponseSchema = z.object({
  assessment: CropAssessmentSchema,
  alternativeHypotheses: z.array(
    z.object({
      conditionName: z.string(),
      confidenceScore: z.number(),
      rationale: z.string(),
    })
  ),
  gradCamHeatmapUrl: z.string().url().optional(),
  advisoryDisclaimer: z.string(),
});
export type DiagnoseCropResponse = z.infer<typeof DiagnoseCropResponseSchema>;

// ==========================================
// Module 3: NEXFIELD Twin
// ==========================================
export const RunSimulationRequestSchema = z.object({
  fieldId: z.string().uuid(),
  cycleId: z.string().uuid(),
  title: z.string().min(3),
  interventions: z.object({
    irrigationScheduleDays: z.array(z.number()),
    irrigationVolumeM3PerHa: z.number(),
    nitrogenTopDressingKgPerHa: z.number(),
    biostimulantApplied: z.boolean(),
  }),
});
export type RunSimulationRequest = z.infer<typeof RunSimulationRequestSchema>;

// ==========================================
// Module 4: NEXFIELD Intelligence
// ==========================================
export const IntelligenceChatMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
  suggestedActions: z.array(z.string()).optional(),
  citations: z
    .array(
      z.object({
        title: z.string(),
        source: z.string(),
        url: z.string().optional(),
      })
    )
    .optional(),
  contextSnapshot: z
    .object({
      farmName: z.string().optional(),
      selectedField: z.string().optional(),
      cropVariety: z.string().optional(),
    })
    .optional(),
});
export type IntelligenceChatMessage = z.infer<typeof IntelligenceChatMessageSchema>;

export const IntelligenceChatRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  farmId: z.string().uuid(),
  fieldId: z.string().uuid().optional(),
  userQuery: z.string().min(1),
  conversationHistory: z.array(IntelligenceChatMessageSchema).optional(),
});
export type IntelligenceChatRequest = z.infer<typeof IntelligenceChatRequestSchema>;

// ==========================================
// Module 5: NEXFIELD Ops
// ==========================================
export const CreateTaskRequestSchema = z.object({
  farmId: z.string().uuid(),
  fieldId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
  costEstimateInr: z.number().optional(),
});
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const OpsFinancialSummarySchema = z.object({
  farmId: z.string().uuid(),
  currentSeasonTotalExpensesInr: z.number(),
  projectedRevenueInr: z.number(),
  estimatedNetProfitInr: z.number(),
  expenseBreakdown: z.record(z.number()),
  inventoryValuationInr: z.number(),
});
export type OpsFinancialSummary = z.infer<typeof OpsFinancialSummarySchema>;

// ==========================================
// Module 6: NEXFIELD Markets
// ==========================================
export const MarketsFilterSchema = z.object({
  commodity: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  sortBy: z.enum(['modalPriceDesc', 'arrivalQuantityDesc', 'priceChangeDesc']).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type MarketsFilter = z.infer<typeof MarketsFilterSchema>;

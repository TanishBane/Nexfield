import { z } from 'zod';

// ==========================================
// 1. User Entity
// ==========================================
export const UserRoleSchema = z.enum(['farmer', 'agronomist', 'admin', 'field_officer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2),
  role: UserRoleSchema,
  phone: z.string().optional(),
  preferredLanguage: z.string().default('en'),
  farmIds: z.array(z.string().uuid()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// ==========================================
// 2. Farm Entity
// ==========================================
export const SoilTypeSchema = z.enum([
  'alluvial',
  'black_cotton',
  'red_loamy',
  'laterite',
  'clay_loam',
  'sandy_loam',
]);
export type SoilType = z.infer<typeof SoilTypeSchema>;

export const IrrigationSourceSchema = z.enum([
  'canal',
  'borewell',
  'drip_irrigation',
  'sprinkler',
  'rainfed',
]);
export type IrrigationSource = z.infer<typeof IrrigationSourceSchema>;

export const GeoLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string(),
  state: z.string(),
  district: z.string(),
  pinCode: z.string(),
});
export type GeoLocation = z.infer<typeof GeoLocationSchema>;

export const FarmSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  ownerId: z.string().uuid(),
  location: GeoLocationSchema,
  totalAreaHectares: z.number().positive(),
  soilType: SoilTypeSchema,
  primaryIrrigation: IrrigationSourceSchema,
  boundaryGeoJson: z.record(z.unknown()).optional(),
  activeCropCycleCount: z.number().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Farm = z.infer<typeof FarmSchema>;

// ==========================================
// 3. Field Entity
// ==========================================
export const SoilMetricsSchema = z.object({
  ph: z.number().min(0).max(14),
  organicCarbonPercent: z.number().min(0).max(10),
  nitrogenKgPerHa: z.number().nonnegative(),
  phosphorusKgPerHa: z.number().nonnegative(),
  potassiumKgPerHa: z.number().nonnegative(),
  electricalConductivityDsM: z.number().nonnegative(),
  moisturePercent: z.number().min(0).max(100),
  lastSampledDate: z.string().datetime(),
});
export type SoilMetrics = z.infer<typeof SoilMetricsSchema>;

export const FieldSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().min(1),
  areaHectares: z.number().positive(),
  soilMetrics: SoilMetricsSchema,
  currentCycleId: z.string().uuid().nullable().optional(),
  polygonCoordinates: z.array(z.tuple([z.number(), z.number()])).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Field = z.infer<typeof FieldSchema>;

// ==========================================
// 4. CropCycle Entity
// ==========================================
export const CropSeasonSchema = z.enum(['kharif', 'rabi', 'zaid']);
export type CropSeason = z.infer<typeof CropSeasonSchema>;

export const CropCycleStatusSchema = z.enum(['planned', 'active', 'harvested', 'failed']);
export type CropCycleStatus = z.infer<typeof CropCycleStatusSchema>;

export const GrowthStageSchema = z.enum([
  'seedling_germination',
  'tillering',
  'vegetative_growth',
  'flowering_panicle',
  'grain_filling',
  'physiological_maturity',
  'harvest_ready',
]);
export type GrowthStage = z.infer<typeof GrowthStageSchema>;

export const CropCycleSchema = z.object({
  id: z.string().uuid(),
  fieldId: z.string().uuid(),
  cropName: z.string().min(2),
  variety: z.string().min(1),
  season: CropSeasonSchema,
  sowingDate: z.string(),
  expectedHarvestDate: z.string(),
  actualHarvestDate: z.string().nullable().optional(),
  status: CropCycleStatusSchema,
  targetYieldMetricTons: z.number().positive(),
  actualYieldMetricTons: z.number().positive().nullable().optional(),
  currentGrowthStage: GrowthStageSchema,
  stageProgressPercent: z.number().min(0).max(100),
  healthIndexScore: z.number().min(0).max(100).default(85),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CropCycle = z.infer<typeof CropCycleSchema>;

// ==========================================
// 5. Observation Entity
// ==========================================
export const ObservationTypeSchema = z.enum([
  'iot_sensor_telemetry',
  'satellite_ndvi',
  'scouting_note',
  'weather_station',
  'drone_multispectral',
]);
export type ObservationType = z.infer<typeof ObservationTypeSchema>;

export const ObservationSchema = z.object({
  id: z.string().uuid(),
  fieldId: z.string().uuid(),
  cycleId: z.string().uuid().optional(),
  observerId: z.string().uuid().optional(),
  observationType: ObservationTypeSchema,
  timestamp: z.string().datetime(),
  metrics: z.record(z.union([z.number(), z.string()])),
  notes: z.string().optional(),
  geoTag: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  createdAt: z.string().datetime(),
});
export type Observation = z.infer<typeof ObservationSchema>;

// ==========================================
// 6. CropAssessment Entity (FieldSight AI)
// ==========================================
export const AssessmentTypeSchema = z.enum([
  'foliar_disease',
  'pest_damage',
  'nutrient_deficiency',
  'physiological_stress',
  'harvest_quality_grading',
]);
export type AssessmentType = z.infer<typeof AssessmentTypeSchema>;

export const SeverityLevelSchema = z.enum(['low', 'moderate', 'severe', 'critical']);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

export const DiagnosisDetailsSchema = z.object({
  pathogenOrPest: z.string().optional(),
  symptoms: z.array(z.string()),
  recommendedIntervention: z.string(),
  chemicalOptions: z.array(z.string()).optional(),
  organicOptions: z.array(z.string()).optional(),
  estimatedYieldLossRiskPercent: z.number().min(0).max(100).optional(),
});
export type DiagnosisDetails = z.infer<typeof DiagnosisDetailsSchema>;

export const CropAssessmentSchema = z.object({
  id: z.string().uuid(),
  fieldId: z.string().uuid(),
  cycleId: z.string().uuid().optional(),
  assessmentType: AssessmentTypeSchema,
  conditionName: z.string().min(2),
  confidenceScore: z.number().min(0).max(1),
  severityLevel: SeverityLevelSchema,
  affectedAreaPercentage: z.number().min(0).max(100),
  visualEvidenceUrl: z.string().url().optional(),
  heatmapOverlayUrl: z.string().url().optional(),
  diagnosisDetails: DiagnosisDetailsSchema,
  assessedAt: z.string().datetime(),
  assessedBy: z.string().default('fieldsight_vision_v1'),
});
export type CropAssessment = z.infer<typeof CropAssessmentSchema>;

// ==========================================
// 7. SimulationScenario Entity (NEXFIELD Twin)
// ==========================================
export const SimulationScenarioSchema = z.object({
  id: z.string().uuid(),
  fieldId: z.string().uuid(),
  cycleId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string(),
  baselineParameters: z.object({
    initialSoilMoisturePercent: z.number(),
    projectedRainfallMm: z.number(),
    temperatureMaxC: z.number(),
    temperatureMinC: z.number(),
  }),
  simulatedInterventions: z.object({
    irrigationScheduleDays: z.array(z.number()),
    irrigationVolumeM3PerHa: z.number(),
    nitrogenTopDressingKgPerHa: z.number(),
    biostimulantApplied: z.boolean(),
  }),
  projectedOutcomes: z.object({
    estimatedYieldMtPerHa: z.number().positive(),
    baselineYieldMtPerHa: z.number().positive(),
    yieldDeltaPercent: z.number(),
    waterUseEfficiencyScore: z.number().min(0).max(100),
    carbonFootprintKgCo2ePerHa: z.number(),
    economicBenefitInrPerHa: z.number(),
    riskIndex: z.number().min(0).max(1),
    confidenceInterval: z.tuple([z.number(), z.number()]),
  }),
  simulatedAt: z.string().datetime(),
});
export type SimulationScenario = z.infer<typeof SimulationScenarioSchema>;

// ==========================================
// 8. FarmTask Entity (NEXFIELD Ops)
// ==========================================
export const TaskCategorySchema = z.enum([
  'irrigation',
  'fertilization',
  'spraying_pest_control',
  'crop_scouting',
  'harvesting',
  'equipment_maintenance',
  'soil_testing',
]);
export type TaskCategory = z.infer<typeof TaskCategorySchema>;

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const FarmTaskSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  fieldId: z.string().uuid().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  category: TaskCategorySchema,
  priority: TaskPrioritySchema,
  status: TaskStatusSchema,
  assignedToUserId: z.string().uuid().optional(),
  assignedToName: z.string().optional(),
  dueDate: z.string(),
  completedAt: z.string().datetime().nullable().optional(),
  costEstimateInr: z.number().nonnegative().optional(),
  actualCostInr: z.number().nonnegative().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type FarmTask = z.infer<typeof FarmTaskSchema>;

// ==========================================
// 9. InventoryTransaction Entity (NEXFIELD Ops)
// ==========================================
export const InventoryItemTypeSchema = z.enum([
  'seed',
  'chemical_fertilizer',
  'organic_fertilizer',
  'pesticide_fungicide',
  'fuel_diesel',
  'machinery_spares',
]);
export type InventoryItemType = z.infer<typeof InventoryItemTypeSchema>;

export const TransactionTypeSchema = z.enum(['purchase', 'usage', 'return', 'wastage_adjustment']);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

export const InventoryTransactionSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  fieldId: z.string().uuid().optional(),
  itemType: InventoryItemTypeSchema,
  itemName: z.string().min(2),
  batchNumber: z.string().optional(),
  transactionType: TransactionTypeSchema,
  quantity: z.number().positive(),
  unit: z.enum(['kg', 'liter', 'bag_50kg', 'unit', 'meter']),
  unitPriceInr: z.number().positive(),
  totalAmountInr: z.number().positive(),
  balanceAfterQuantity: z.number().nonnegative(),
  supplierOrVendor: z.string().optional(),
  date: z.string(),
  createdAt: z.string().datetime(),
});
export type InventoryTransaction = z.infer<typeof InventoryTransactionSchema>;

// ==========================================
// 10. HarvestBatch Entity (NEXFIELD Ops)
// ==========================================
export const QualityGradeSchema = z.enum([
  'Grade_A_Export',
  'Grade_B_Domestic_Premium',
  'Grade_C_Standard_Mandi',
  'Grade_D_Processing_Feed',
]);
export type QualityGrade = z.infer<typeof QualityGradeSchema>;

export const DispatchStatusSchema = z.enum([
  'in_warehouse_storage',
  'consignment_booked',
  'in_transit',
  'settled_at_mandi',
]);
export type DispatchStatus = z.infer<typeof DispatchStatusSchema>;

export const HarvestBatchSchema = z.object({
  id: z.string().uuid(),
  farmId: z.string().uuid(),
  fieldId: z.string().uuid(),
  cycleId: z.string().uuid(),
  batchCode: z.string().min(4),
  cropName: z.string().min(2),
  variety: z.string().min(1),
  harvestDate: z.string(),
  totalQuantityKg: z.number().positive(),
  qualityGrade: QualityGradeSchema,
  moistureContentPercent: z.number().min(0).max(40),
  foreignMatterPercent: z.number().min(0).max(20),
  storageWarehouse: z.string(),
  dispatchStatus: DispatchStatusSchema,
  targetMandiPriceInrPerQuintal: z.number().positive().optional(),
  soldPriceInrPerQuintal: z.number().positive().nullable().optional(),
  buyerEntity: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type HarvestBatch = z.infer<typeof HarvestBatchSchema>;

// ==========================================
// 11. MarketObservation Entity (NEXFIELD Markets)
// ==========================================
export const PriceTrendSchema = z.enum(['upward', 'downward', 'neutral']);
export type PriceTrend = z.infer<typeof PriceTrendSchema>;

export const MarketObservationSchema = z.object({
  id: z.string().uuid(),
  commodity: z.string().min(2),
  variety: z.string().min(1),
  state: z.string().min(2),
  district: z.string().min(2),
  marketName: z.string().min(2),
  arrivalQuantityTons: z.number().nonnegative(),
  minPricePerQuintalInr: z.number().positive(),
  maxPricePerQuintalInr: z.number().positive(),
  modalPricePerQuintalInr: z.number().positive(),
  priceTrend: PriceTrendSchema,
  dailyChangeInr: z.number(),
  reportedDate: z.string(),
  sourceFeed: z.string().default('agmarket_live_api'),
});
export type MarketObservation = z.infer<typeof MarketObservationSchema>;

// ==========================================
// 12. MarketComparison Entity (NEXFIELD Markets)
// ==========================================
export const ArbitrageRecommendationSchema = z.enum([
  'sell_locally',
  'transport_arbitrage_profitable',
  'hold_in_climate_storage',
]);
export type ArbitrageRecommendation = z.infer<typeof ArbitrageRecommendationSchema>;

export const TargetMarketOpportunitySchema = z.object({
  marketName: z.string(),
  state: z.string(),
  distanceKm: z.number().nonnegative(),
  modalPricePerQuintalInr: z.number().positive(),
  grossSpreadPerQuintalInr: z.number(),
  estimatedFreightPerQuintalInr: z.number(),
  mandiFeePerQuintalInr: z.number(),
  netArbitrageProfitPerQuintalInr: z.number(),
  transitTimeHours: z.number(),
  recommendation: ArbitrageRecommendationSchema,
});
export type TargetMarketOpportunity = z.infer<typeof TargetMarketOpportunitySchema>;

export const MarketComparisonSchema = z.object({
  id: z.string().uuid(),
  commodity: z.string().min(2),
  variety: z.string(),
  baseOriginMarketName: z.string(),
  baseModalPricePerQuintalInr: z.number().positive(),
  comparisonDate: z.string(),
  opportunities: z.array(TargetMarketOpportunitySchema),
  optimalDecision: z.object({
    suggestedMarket: z.string(),
    expectedNetProfitDeltaInr: z.number(),
    confidenceScore: z.number().min(0).max(1),
    rationale: z.string(),
  }),
});
export type MarketComparison = z.infer<typeof MarketComparisonSchema>;

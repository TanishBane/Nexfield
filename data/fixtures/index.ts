import fixturesData from './fixtures.json';
import type {
  Farm,
  Field,
  CropCycle,
  CropAssessment,
  SimulationScenario,
  FarmTask,
  InventoryTransaction,
  HarvestBatch,
  MarketObservation,
  MarketComparison,
} from '@nexfield/contracts';

export interface NexfieldFixtures {
  farms: Farm[];
  fields: Field[];
  cropCycles: CropCycle[];
  cropAssessments: CropAssessment[];
  simulationScenarios: SimulationScenario[];
  farmTasks: FarmTask[];
  inventoryTransactions: InventoryTransaction[];
  harvestBatches: HarvestBatch[];
  marketObservations: MarketObservation[];
  marketComparisons: MarketComparison[];
}

export const fixtures: NexfieldFixtures = fixturesData as unknown as NexfieldFixtures;
export default fixtures;

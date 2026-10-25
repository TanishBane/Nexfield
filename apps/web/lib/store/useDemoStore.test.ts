import { describe, it, expect, beforeEach } from 'vitest';
import { useDemoStore, INITIAL_DEMO_STATE } from './useDemoStore';

describe('Public Demo State Store & Persistence Invariants', () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemoState();
  });

  it('initializes with clean, domain-accurate agronomic baseline', () => {
    const state = useDemoStore.getState();
    expect(state.farmName).toBe('Nashik Tomato Precision Estate');
    expect(state.isFixture).toBe(true);
    expect(state.tasks.length).toBeGreaterThanOrEqual(3);
    expect(state.inventory.length).toBeGreaterThanOrEqual(4);
    expect(state.expenses.length).toBeGreaterThanOrEqual(3);
  });

  it('persists task completion without mutating non-target tasks', () => {
    const state = useDemoStore.getState();
    const targetTaskId = state.tasks[1].id;

    state.completeTask(targetTaskId);

    const updatedState = useDemoStore.getState();
    const updatedTask = updatedState.tasks.find((t) => t.id === targetTaskId);
    expect(updatedTask?.status).toBe('completed');
  });

  it('prevents adding duplicate task titles', () => {
    const state = useDemoStore.getState();
    const initialCount = state.tasks.length;

    state.addTask({
      title: 'Inspect Drip Emitters in Sector 2-B',
      category: 'irrigation',
      priority: 'medium',
      status: 'todo',
      dueDate: 'Tomorrow',
      costInr: 500,
    });

    const updatedState = useDemoStore.getState();
    expect(updatedState.tasks.length).toBe(initialCount);
  });

  it('adds unique tasks correctly to demo queue', () => {
    const state = useDemoStore.getState();
    const initialCount = state.tasks.length;

    state.addTask({
      title: 'Scout Sector 4-C for Stem Borers',
      category: 'crop_scouting',
      priority: 'high',
      status: 'todo',
      dueDate: 'Tomorrow',
      costInr: 600,
    });

    const updatedState = useDemoStore.getState();
    expect(updatedState.tasks.length).toBe(initialCount + 1);
    expect(updatedState.tasks[0].title).toBe('Scout Sector 4-C for Stem Borers');
  });

  it('deducts inventory accurately and enforces non-negative boundary', () => {
    const state = useDemoStore.getState();
    state.deductInventory('inv-1', 5);

    const updatedState = useDemoStore.getState();
    const item = updatedState.inventory.find((i) => i.id === 'inv-1');
    expect(item?.quantity).toBe(13);

    // Over-deduct to test zero clamp
    state.deductInventory('inv-1', 50);
    const clampedState = useDemoStore.getState();
    const clampedItem = clampedState.inventory.find((i) => i.id === 'inv-1');
    expect(clampedItem?.quantity).toBe(0);
  });

  it('persists newly added and updated farms correctly', () => {
    const state = useDemoStore.getState();
    const initialFarmCount = state.farms.length;

    state.addFarm({
      id: 'demo-farm-test-1',
      name: 'Sahyadri Organic Orchard',
      location: {
        latitude: 19.9975,
        longitude: 73.7898,
        address: 'Trimbakeshwar Agro Belt',
        district: 'Nashik',
        state: 'Maharashtra',
        pinCode: '422212',
      },
      totalAreaHectares: 5.5,
      soilType: 'red_loamy',
      primaryIrrigation: 'drip_irrigation',
      createdAt: new Date().toISOString(),
    });

    const withFarm = useDemoStore.getState();
    expect(withFarm.farms.length).toBe(initialFarmCount + 1);
    expect(withFarm.farms[0].name).toBe('Sahyadri Organic Orchard');

    state.updateFarm('demo-farm-test-1', { name: 'Sahyadri Premium Organic Orchard' });
    const withUpdatedFarm = useDemoStore.getState();
    const updated = withUpdatedFarm.farms.find((f) => f.id === 'demo-farm-test-1');
    expect(updated?.name).toBe('Sahyadri Premium Organic Orchard');
  });

  it('persists newly created fields, crop cycles, and observations', () => {
    const state = useDemoStore.getState();
    const initialFieldCount = state.fields.length;
    const initialCycleCount = state.cropCycles.length;
    const initialObsCount = state.observations.length;

    state.addField({
      id: 'field-new-sector',
      farmId: 'farm-nashik-tomato-01',
      name: 'Sector 3-C Citrus Grove',
      code: 'FLD-C03',
      areaHectares: 2.0,
    });

    state.addCropCycle({
      id: 'cycle-new-citrus',
      fieldId: 'field-new-sector',
      cropName: 'Sweet Lime (Mosambi)',
      variety: 'Nagpur Mandarin Selection',
      season: 'kharif',
      sowingDate: '2026-06-15',
      expectedHarvestDate: '2026-11-30',
      status: 'active',
      targetYieldMetricTons: 18.0,
      currentGrowthStage: 'Fruit Maturity & Sizing',
      healthIndexScore: 95,
    });

    state.addObservation({
      id: 'obs-citrus-01',
      fieldId: 'field-new-sector',
      cycleId: 'cycle-new-citrus',
      observationType: 'scouting_note',
      timestamp: new Date().toISOString(),
      metrics: { brix_sugar: 10.5, moisture_percent: 38.2 },
      notes: 'Optimal sugar development. Ready for selective harvest.',
    });

    const updated = useDemoStore.getState();
    expect(updated.fields.length).toBe(initialFieldCount + 1);
    expect(updated.cropCycles.length).toBe(initialCycleCount + 1);
    expect(updated.observations.length).toBe(initialObsCount + 1);
  });

  it('imports batch records and updates store telemetry and entities', () => {
    const state = useDemoStore.getState();
    const initialTaskCount = state.tasks.length;
    const initialExpCount = state.expenses.length;

    state.importRecords('tasks', [
      { title: 'Calibrate Pressure Regulators', priority: 'high', category: 'irrigation', dueDate: 'Tomorrow', costInr: 500 },
      { title: 'Apply Foliar Micronutrients (Zinc/Boron)', priority: 'medium', category: 'fertilization', dueDate: 'Friday', costInr: 800 },
    ]);

    state.importRecords('expenses', [
      { category: 'Irrigation Supplies', description: 'Micro-sprinkler nozzles', amountInr: 1500, date: '2026-10-24' },
    ]);

    state.importRecords('sensors', [
      { soilMoisture: 45.2, soilTemperature: 22.8, soilPh: 6.9, ambientTemperature: 28.1, ambientHumidity: 60.5 },
    ]);

    const updated = useDemoStore.getState();
    expect(updated.tasks.length).toBe(initialTaskCount + 2);
    expect(updated.expenses.length).toBe(initialExpCount + 1);
    expect(updated.soilMoisture).toBe(45.2);
    expect(updated.soilTemperature).toBe(22.8);
    expect(updated.soilPh).toBe(6.9);
  });

  it('resets state completely back to initial baseline fixtures', () => {
    const state = useDemoStore.getState();
    state.addTask({
      title: 'Temporary demo test task',
      category: 'harvesting',
      priority: 'low',
      status: 'todo',
      dueDate: 'Next Week',
      costInr: 100,
    });
    state.toggleDripIrrigation();

    expect(useDemoStore.getState().tasks.length).toBe(4);

    state.resetDemoState();

    const resetState = useDemoStore.getState();
    expect(resetState.tasks.length).toBe(INITIAL_DEMO_STATE.tasks.length);
    expect(resetState.farms.length).toBe(INITIAL_DEMO_STATE.farms.length);
    expect(resetState.dripIrrigationActive).toBe(false);
  });
});


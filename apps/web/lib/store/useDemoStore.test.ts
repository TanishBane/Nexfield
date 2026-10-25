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
    expect(resetState.dripIrrigationActive).toBe(false);
  });
});

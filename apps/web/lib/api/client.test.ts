import { describe, it, expect, beforeEach } from 'vitest';
import { apiClient } from './client';
import { useDemoStore } from '../store/useDemoStore';

describe('apiClient', () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemoState();
  });

  it('reports isFixtureMode true by default in demo mode', () => {
    expect(apiClient.isFixtureMode()).toBe(true);
  });

  it('fetches baseline farms with strongly typed structures', async () => {
    const res = await apiClient.getFarms();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].id).toBeDefined();
    expect(res.data[0].name).toBeDefined();
    expect(res.data[0].location.state).toBeDefined();
  });

  it('fetches a single farm by id', async () => {
    const farmsRes = await apiClient.getFarms();
    const targetFarm = farmsRes.data[0];
    const res = await apiClient.getFarm(targetFarm.id);
    expect(res.success).toBe(true);
    expect(res.data.id).toBe(targetFarm.id);
    expect(res.data.name).toBe(targetFarm.name);
  });

  it('fetches control overview with complete agronomic telemetry and active cycles', async () => {
    const res = await apiClient.getControlOverview();
    expect(res.success).toBe(true);
    expect(res.data.farm).toBeDefined();
    expect(res.data.soilTelemetrySummary).toBeDefined();
    expect(res.data.weatherSummary).toBeDefined();
    expect(res.data.activeCycles.length).toBeGreaterThan(0);
    expect(res.data.activeCycles[0].cropName).toBeDefined();
  });

  it('calculates freight realizations accurately with tabular returns', async () => {
    const res = await apiClient.calculateFreight({
      modalPriceInrPerQuintal: 2800,
      distanceKm: 65,
      lotQuantityQuintals: 40,
    });
    expect(res.success).toBe(true);
    expect(res.data.gross_modal_price_inr_per_quintal).toBe(2800);
    expect(res.data.gross_revenue_inr).toBe(112000);
    expect(res.data.net_revenue_inr).toBeLessThan(112000);
    expect(res.data.profitability_verdict).toBeDefined();
  });

  it('returns valid MSP benchmarks with CACP metrics', async () => {
    const res = await apiClient.getMspBenchmarks();
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.some((b) => b.commodity === 'Wheat')).toBe(true);
  });
});

import React from 'react';
import { StatCard } from '@nexfield/ui';
import type { SimulationScenario } from '@nexfield/contracts';

export function OutcomeStatCards({ current }: { current: SimulationScenario }) {
  if (!current || !current.projectedOutcomes) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Simulated Yield Outcome"
        value={current.projectedOutcomes.estimatedYieldMtPerHa.toFixed(2)}
        unit="MT/ha"
        subValue={`Baseline: ${current.projectedOutcomes.baselineYieldMtPerHa.toFixed(2)} MT/ha`}
        trend="up"
        trendValue={`+${current.projectedOutcomes.yieldDeltaPercent.toFixed(1)}%`}
        variant="emerald"
      />
      <StatCard
        label="Water Use Efficiency (WUE)"
        value={current.projectedOutcomes.waterUseEfficiencyScore.toFixed(1)}
        unit="/ 100"
        subValue="Low sub-surface leaching"
        trend="up"
        trendValue="High Efficiency"
        variant="sky"
      />
      <StatCard
        label="Net Economic Advantage"
        value={`+₹${current.projectedOutcomes.economicBenefitInrPerHa.toLocaleString('en-IN')}`}
        unit="/ ha"
        subValue="Fertilizer & diesel savings"
        trend="up"
        trendValue="Optimal Arbitrage"
        variant="amber"
      />
    </div>
  );
}

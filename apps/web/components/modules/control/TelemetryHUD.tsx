import React from 'react';
import { Droplets, Activity, Thermometer, Sprout } from 'lucide-react';
import { StatCard } from '@nexfield/ui';

interface TelemetryHUDProps {
  soilTelemetrySummary: {
    avgMoisturePercent: number;
    avgPh: number;
    nitrogenStatus: string;
  };
}

export function TelemetryHUD({ soilTelemetrySummary }: TelemetryHUDProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Rootzone Soil Moisture"
        value={soilTelemetrySummary.avgMoisturePercent.toFixed(1)}
        unit="%"
        subValue="Capillary Retention: Optimal"
        trend="up"
        trendValue="+1.8% vs 24h"
        icon={<Droplets className="h-4 w-4" />}
        variant="sky"
      />

      <StatCard
        label="Canopy Vigor (NDVI)"
        value="0.74"
        unit="Index"
        subValue="Sentinel-2 L2A (Pass 3h ago)"
        trend="up"
        trendValue="+0.04 Healthy"
        icon={<Activity className="h-4 w-4" />}
        variant="emerald"
      />

      <StatCard
        label="Soil pH & Chemistry"
        value={soilTelemetrySummary.avgPh.toFixed(2)}
        unit="pH"
        subValue={`Nitrogen: ${soilTelemetrySummary.nitrogenStatus.toUpperCase()}`}
        trend="neutral"
        trendValue="Neutral Alluvial"
        icon={<Thermometer className="h-4 w-4" />}
        variant="default"
      />

      <StatCard
        label="Projected Harvest Yield"
        value="48.0"
        unit="MT"
        subValue="Target: 5.71 MT/ha (Rabi HD-3086)"
        trend="up"
        trendValue="+14.2% Delta"
        icon={<Sprout className="h-4 w-4" />}
        variant="amber"
      />
    </div>
  );
}

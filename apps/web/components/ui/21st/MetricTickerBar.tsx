'use client';

import React from 'react';
import { Droplets, Sprout, SunMedium, Activity, Compass, ShieldCheck } from 'lucide-react';

interface MetricItem {
  label: string;
  value: string;
  status: string;
  statusType: 'optimal' | 'warning' | 'normal';
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: MetricItem[] = [
  {
    label: 'Soil Moisture',
    value: '41.4%',
    status: 'Optimal Root Zone',
    statusType: 'optimal',
    icon: Droplets,
  },
  {
    label: 'Canopy NDVI',
    value: '0.81',
    status: 'High Vegetative Vigour',
    statusType: 'optimal',
    icon: Sprout,
  },
  {
    label: 'Foliar Temperature',
    value: '26.8°C',
    status: 'Transpiration Active',
    statusType: 'normal',
    icon: SunMedium,
  },
  {
    label: 'Vadose Matrix Potential',
    value: '-33 kPa',
    status: 'Capillary Infiltration',
    statusType: 'optimal',
    icon: Activity,
  },
  {
    label: 'Nashik APMC Price',
    value: '₹2,450 / qtl',
    status: '+₹210 Spatial Spread',
    statusType: 'optimal',
    icon: Compass,
  },
  {
    label: 'Grain Silo Moisture',
    value: '12.4%',
    status: 'Safe Storage (<14%)',
    statusType: 'optimal',
    icon: ShieldCheck,
  },
];

export function MetricTickerBar() {
  return (
    <div className="w-full rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 shadow-2xl space-y-4">
      {/* Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#18261E] text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
            Live Telemetry Stream
          </span>
          <span className="text-[#63796E]">·</span>
          <span className="text-[#9BB1A4]">Nashik Tomato Precision Estate (Field Sector 2-B)</span>
        </div>
        <span className="text-xs text-[#8EA698]">
          Sentinel-2 MSI & LoRa Probe Synced · Verified Fixtures
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 font-mono">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#9BB1A4] uppercase tracking-wide">
                <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{m.label}</span>
              </div>
              <div className="text-2xl font-bold text-[#FAF8F2] tabular-nums tracking-tight">
                {m.value}
              </div>
              <div className="text-xs font-medium text-emerald-400 truncate">
                {m.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Droplets, Sprout, SunMedium, Activity, Compass, ShieldCheck } from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';

export function MetricTickerBar() {
  const { farmName, soilMoisture, canopyNdvi, ambientTemperature } = useDemoStore();

  const metrics = [
    {
      label: 'Rootzone VWC',
      value: `${soilMoisture}%`,
      status: 'Optimal Moisture',
      icon: Droplets,
    },
    {
      label: 'Canopy NDVI',
      value: `${canopyNdvi}`,
      status: 'High Biomass Vigour',
      icon: Sprout,
    },
    {
      label: 'Foliar Temp',
      value: `${ambientTemperature}°C`,
      status: 'Transpiration Active',
      icon: SunMedium,
    },
    {
      label: 'Vadose Potential',
      value: '-33 kPa',
      status: 'Capillary Inflow',
      icon: Activity,
    },
    {
      label: 'APMC Price',
      value: '₹2,450/q',
      status: '+₹210 Mandi Spread',
      icon: Compass,
    },
    {
      label: 'Grain Silo Moisture',
      value: '12.4%',
      status: 'Safe Storage (<14%)',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0D1410] border border-[#1E2E25] p-4 sm:p-5 shadow-2xl space-y-3.5">
      {/* Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[#18251E] text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none shrink-0" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
            Live Telemetry Stream
          </span>
          <span className="text-[#6D8577]">·</span>
          <span className="text-[#9BB1A4] truncate">{farmName}</span>
        </div>
        <span className="text-[11px] text-[#8DA396] font-mono">
          Sentinel-2 MSI & LoRa Probe Synced · Baseline Provenance
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-mono">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-2 rounded-xl bg-[#111714] border border-[#18251E] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-[#8DA396] uppercase tracking-wide">
                <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{m.label}</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#F1F6F3] tabular-nums tracking-tight">
                {m.value}
              </div>
              <div className="text-[11px] font-medium text-emerald-400 truncate">
                {m.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

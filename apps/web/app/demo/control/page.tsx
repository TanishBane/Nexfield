'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Droplets,
  Activity,
  Thermometer,
  Sprout,
  AlertTriangle,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
  TrendingUp,
  X,
  Truck,
  Sun,
  Power,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Bot,
  Warehouse,
  ScanEye,
  CheckCircle,
  Calendar,
  Layers2,
} from 'lucide-react';
import { Badge, Button } from '@nexfield/ui';
import { useDemoStore } from '@/lib/store/useDemoStore';

export default function DemoControlPage() {
  const {
    farmName,
    location,
    areaHectares,
    cropName,
    cropVariety,
    sowingDaysAgo,
    growthStage,
    soilMoisture,
    soilTemperature,
    soilPh,
    nitrogenPpm,
    phosphorusPpm,
    potassiumPpm,
    canopyNdvi,
    ambientTemperature,
    ambientHumidity,
    solarRadiationWm2,
    dripIrrigationActive,
    biomassStressPercent,
    tasks,
    toggleDripIrrigation,
    completeTask,
  } = useDemoStore();

  const [dismissedPriorities, setDismissedPriorities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'soil' | 'crop' | 'storage'>('soil');

  // Today's Top Priorities (Strictly Max 3 Meaningful Actionable Items)
  const dismissedPrioritiesSet = new Set(dismissedPriorities);
  const priorities = [
    {
      id: 'p-1',
      category: 'Irrigation & Hydrology',
      title: 'Vadose Infiltration Window Active',
      description:
        'Soil moisture is at 41%. Drip fertigation with water-soluble 13-0-45 is recommended within 18 hours to sustain fruit enlargement and prevent blossom-end rot.',
      actionLabel: dripIrrigationActive ? 'Drip Running (Stop)' : 'Start Drip Irrigation',
      actionHandler: toggleDripIrrigation,
      actionHighlight: dripIrrigationActive,
      badgeColor: 'text-sky-300 border-sky-500/40 bg-sky-950/40',
      icon: Droplets,
    },
    {
      id: 'p-2',
      category: 'Crop Protection Alert',
      title: 'Early Blight Risk Elevated in Sector 2-B',
      description:
        'Canopy microclimate humidity has exceeded 85% for 6 consecutive hours. ICAR preventive bio-fungicide or copper oxychloride spray due.',
      actionLabel: 'Inspect Leaf Symptoms',
      actionHref: '/demo/fieldsight',
      badgeColor: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
      icon: AlertTriangle,
    },
    {
      id: 'p-3',
      category: 'Wholesale Market Opportunity',
      title: 'Nashik APMC Price Surge (+₹210 / qtl)',
      description:
        'Modal wholesale price jumped to ₹2,450/qtl due to low terminal arrivals. Favorable net realization after factoring ₹45 freight deduction.',
      actionLabel: 'Review Market Returns',
      actionHref: '/demo/markets',
      badgeColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
      icon: TrendingUp,
    },
  ].filter((p) => !dismissedPrioritiesSet.has(p.id));

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Soil Sensor Probe Synced',
      detail: 'Moisture 41.4% · Matrix potential -33 kPa (Optimal)',
      time: '4 mins ago',
      source: 'LoRa Soil Probe #2',
    },
    {
      id: 'act-2',
      title: 'Multispectral Baseline Processed',
      detail: 'Canopy vegetative index: 0.81 NDVI vigor',
      time: '32 mins ago',
      source: 'Satellite Pre-computation',
    },
    {
      id: 'act-3',
      title: 'Microclimate Weather Logged',
      detail: '28.4°C ambient with 62% relative humidity',
      time: '1 hour ago',
      source: 'Field Weather Station',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* =========================================================================
          A. FARM SUMMARY (TOP HERO)
      ========================================================================== */}
      <div className="rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B2A] border border-[#D7B678]/40 text-[#D7B678] font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Interactive Demo — Sample Farm Data
              </span>
              <span className="text-xs font-mono text-[#8FA396]">
                Nashik Valley · Silt Loam Soil
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FAF8F2] tracking-tight">
              {farmName}
            </h1>

            <p className="text-sm sm:text-base text-[#D7E5DC] flex flex-wrap items-center gap-2 font-medium">
              <Compass className="w-4 h-4 text-[#D7B678] shrink-0" />
              <span>{location}</span>
              <span className="text-[#63796E]">·</span>
              <span className="font-mono text-[#FAF8F2] font-semibold">{areaHectares} Hectares</span>
              <span className="text-[#63796E]">·</span>
              <span className="text-emerald-300 font-semibold">{cropName} ({cropVariety})</span>
            </p>
          </div>

          {/* Weather Summary & Drip Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#080D0A] border border-[#1E2E25] text-xs">
              <Sun className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-[#FAF8F2] font-bold text-sm tabular-nums">
                  {ambientTemperature}°C · {ambientHumidity}% RH
                </div>
                <div className="text-[#7B9587]">Clear Sky · Solar: {solarRadiationWm2} W/m²</div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={toggleDripIrrigation}
              className={`text-xs font-bold gap-2 py-5 px-4 rounded-2xl transition-all ${
                dripIrrigationActive
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#111A15] text-[#D7E5DC] border-[#22352A] hover:bg-[#16231C] hover:text-[#FAF8F2]'
              }`}
            >
              <Power className={`w-4 h-4 ${dripIrrigationActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
              <span>{dripIrrigationActive ? 'Drip Active' : 'Start Drip'}</span>
            </Button>
          </div>
        </div>

        {/* Growth Stage Progress Strip */}
        <div className="pt-4 border-t border-[#18261E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-[#8FA396]">Growth Milestone:</span>
            <span className="text-emerald-400 font-bold text-sm">{growthStage}</span>
            <span className="text-[#7B9587]">· Day {sowingDaysAgo} of 95</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#8FA396]">Cycle Progress:</span>
            <div className="w-32 h-2 rounded-full bg-[#18261E] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }} />
            </div>
            <span className="text-[#FAF8F2] font-bold tabular-nums">55%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          B. WHAT NEEDS ATTENTION (MAX 3 PRIMARY ACTIONS/ALERTS)
      ========================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#FAF8F2] tracking-tight">
              What Needs Attention
            </h2>
            <p className="text-xs text-[#8FA396] mt-0.5">
              Three critical observations requiring your decision today.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs text-[#D7B678] border-[#D7B678]/40">
            {priorities.length} Active Items
          </Badge>
        </div>

        {priorities.length === 0 ? (
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-[#FAF8F2]">All Priorities Addressed</h3>
            <p className="text-xs text-[#8FA396] max-w-md mx-auto">
              Your estate is operating within optimal agronomic thresholds. No immediate intervention required.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {priorities.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-[#273C30] p-5 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#16231C] border border-[#1F2E25] text-[#D7B678]">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${item.badgeColor}`}>
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDismissedPriorities((prev) => [...prev, item.id])}
                        className="text-[#63796E] hover:text-[#FAF8F2] p-1"
                        aria-label="Dismiss priority"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-[#FAF8F2] leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#A2B8AC] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#18261E]">
                    {item.actionHref ? (
                      <Link
                        href={item.actionHref}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 hover:bg-[#1F4C36] transition-colors"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={item.actionHandler}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          item.actionHighlight
                            ? 'bg-emerald-500 text-[#090D0B] border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-[#163B2A] text-[#FAF8F2] border-[#D7B678]/40 hover:bg-[#1F4C36]'
                        }`}
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          C. FARM AT A GLANCE (3 OR 4 SIMPLE, READABLE METRICS)
      ========================================================================== */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FAF8F2] tracking-tight">
            Farm at a Glance
          </h2>
          <p className="text-xs text-[#8FA396] mt-0.5">
            Key vital signs presented in plain agricultural language.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Soil Moisture */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8FA396]">Soil Moisture</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              {soilMoisture}%
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Optimal Root Zone Capacity</span>
            </div>
          </div>

          {/* Crop Condition */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8FA396]">Crop Condition</span>
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              94%
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Canopy NDVI: {canopyNdvi} (Vigorous)</span>
            </div>
          </div>

          {/* Microclimate Weather */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8FA396]">Today&apos;s Weather</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              {ambientTemperature}°C
            </div>
            <div className="text-xs text-[#D7E5DC]">
              {ambientHumidity}% Humidity · Safe Zone ({biomassStressPercent}% stress)
            </div>
          </div>

          {/* Season Progress */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8FA396]">Season Progress</span>
              <Activity className="w-4 h-4 text-[#D7B678]" />
            </div>
            <div className="text-3xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              55%
            </div>
            <div className="text-xs text-[#D7E5DC]">
              Day {sowingDaysAgo} of 95 (Fruit Enlargement)
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          D. QUICK ACTIONS (INSPECT CROP, OPEN DIGITAL TWIN, MANAGE TASKS, COMPARE MARKETS)
      ========================================================================== */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#FAF8F2] tracking-tight">
            Quick Actions
          </h2>
          <p className="text-xs text-[#8FA396] mt-0.5">
            Direct shortcuts to key farm workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Crop Health (FieldSight) */}
          <Link
            href="/demo/fieldsight"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-rose-500/50 p-5 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:bg-[#121B16]"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-400 w-fit">
                <ScanEye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FAF8F2] group-hover:text-rose-300 transition-colors">
                Inspect Crops
              </h3>
              <p className="text-xs text-[#8FA396] leading-relaxed">
                Run AI foliar diagnosis with Grad-CAM heatmaps and ICAR-certified protocols.
              </p>
            </div>
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 pt-2 border-t border-[#18261E]">
              <span>Scan Foliage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Digital Twin */}
          <Link
            href="/demo/twin"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-cyan-500/50 p-5 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:bg-[#121B16]"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FAF8F2] group-hover:text-cyan-300 transition-colors">
                Open Digital Twin
              </h3>
              <p className="text-xs text-[#8FA396] leading-relaxed">
                Explore 3D rootzone soil moisture and compare precision irrigation scenarios.
              </p>
            </div>
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 pt-2 border-t border-[#18261E]">
              <span>Open Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Farm Operations */}
          <Link
            href="/demo/ops"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-amber-500/50 p-5 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:bg-[#121B16]"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-400 w-fit">
                <Warehouse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FAF8F2] group-hover:text-amber-300 transition-colors">
                Manage Tasks
              </h3>
              <p className="text-xs text-[#8FA396] leading-relaxed">
                Dispatch field work orders, verify inventory stock, and monitor storage silos.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 pt-2 border-t border-[#18261E]">
              <span>Dispatch Orders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Mandi Markets */}
          <Link
            href="/demo/markets"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-500/50 p-5 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:bg-[#121B16]"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors">
                Compare Markets
              </h3>
              <p className="text-xs text-[#8FA396] leading-relaxed">
                Wholesale mandi price discovery and freight haulage net realization models.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-[#18261E]">
              <span>View Mandis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          E. RECENT ACTIVITY & PROGRESSIVE DISCLOSURE TABS
      ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Timeline (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#18261E]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D7B678]" />
              <h3 className="text-base font-bold text-[#FAF8F2]">Recent Activity</h3>
            </div>
            <span className="text-xs text-[#63796E] font-mono">Live feed</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#FAF8F2]">{act.title}</span>
                  <span className="text-[11px] text-[#63796E] font-mono">{act.time}</span>
                </div>
                <div className="text-xs text-[#8FA396]">{act.detail}</div>
                <div className="text-[10px] text-[#556D60] font-mono pt-0.5">{act.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure: Deep Agronomic Data (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#18261E]">
            <div>
              <h3 className="text-base font-bold text-[#FAF8F2]">Deep Agronomic Data</h3>
              <p className="text-xs text-[#8FA396]">Specialized sub-system telemetry</p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080D0A] border border-[#18261E]">
              <button
                type="button"
                onClick={() => setActiveTab('soil')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'soil'
                    ? 'bg-[#163B2A] text-[#D7B678] border border-[#D7B678]/40'
                    : 'text-[#8FA396] hover:text-[#FAF8F2]'
                }`}
              >
                Soil & Water
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('crop')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'crop'
                    ? 'bg-[#163B2A] text-[#D7B678] border border-[#D7B678]/40'
                    : 'text-[#8FA396] hover:text-[#FAF8F2]'
                }`}
              >
                NPK Nutrients
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('storage')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'storage'
                    ? 'bg-[#163B2A] text-[#D7B678] border border-[#D7B678]/40'
                    : 'text-[#8FA396] hover:text-[#FAF8F2]'
                }`}
              >
                Food Storage
              </button>
            </div>
          </div>

          {activeTab === 'soil' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">SOIL TEMPERATURE</span>
                <span className="text-[#FAF8F2] font-bold text-base tabular-nums mt-0.5 block">{soilTemperature}°C</span>
                <span className="text-emerald-400 text-[10px]">Normal range</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">SOIL PH LEVEL</span>
                <span className="text-[#FAF8F2] font-bold text-base tabular-nums mt-0.5 block">{soilPh}</span>
                <span className="text-emerald-400 text-[10px]">Optimal for Tomato</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">DRIP EMITTER FLOW</span>
                <span className="text-sky-400 font-bold text-base tabular-nums mt-0.5 block">2.2 LPH</span>
                <span className="text-[#7B9587] text-[10px]">Pressure-compensated</span>
              </div>
            </div>
          )}

          {activeTab === 'crop' && (
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">NITROGEN (N)</span>
                <span className="text-[#FAF8F2] font-bold text-base tabular-nums mt-0.5 block">{nitrogenPpm} ppm</span>
                <span className="text-emerald-400 text-[10px]">Adequate</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">PHOSPHORUS (P)</span>
                <span className="text-[#FAF8F2] font-bold text-base tabular-nums mt-0.5 block">{phosphorusPpm} ppm</span>
                <span className="text-emerald-400 text-[10px]">Optimal</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                <span className="text-[#63796E] block text-[11px]">POTASSIUM (K)</span>
                <span className="text-[#FAF8F2] font-bold text-base tabular-nums mt-0.5 block">{potassiumPpm} ppm</span>
                <span className="text-[#D7B678] text-[10px]">Target 45 kg/ha top</span>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-1">
                <span className="text-xs font-bold text-[#FAF8F2]">Grain Silo Moisture</span>
                <div className="text-lg font-bold text-sky-400 font-mono">12.4% EMC</div>
                <p className="text-[11px] text-[#7B9587]">&lt; 14% safe limit. Aspergillus mold suppressed.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] space-y-1">
                <span className="text-xs font-bold text-[#FAF8F2]">Cold Room Temp</span>
                <div className="text-lg font-bold text-cyan-400 font-mono">11.5°C</div>
                <p className="text-[11px] text-[#7B9587]">&gt; 10°C minimum to eliminate chilling injury.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

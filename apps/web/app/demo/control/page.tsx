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
  Calendar,
  Layers,
  TrendingUp,
  X,
  Truck,
  Sun,
  Power,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  Bot,
  Warehouse,
  ScanEye,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from '@nexfield/ui';
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
  const [showDeepTelemetry, setShowDeepTelemetry] = useState<boolean>(false);

  // Today's Top Priorities (Strictly Max 3 Actionable Cards)
  const priorities = [
    {
      id: 'p-1',
      type: 'irrigation',
      urgency: 'Immediate Action',
      title: 'Vadose Zone Infiltration Window',
      description:
        'Soil moisture at 41.4%. Drip fertigation with 13-0-45 recommended within 18 hours to sustain fruit enlargement and prevent blossom-end rot.',
      actionLabel: dripIrrigationActive ? 'Drip Running (Stop)' : 'Start Drip Irrigation',
      actionHandler: toggleDripIrrigation,
      actionHighlight: dripIrrigationActive,
      badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
      icon: Droplets,
    },
    {
      id: 'p-2',
      type: 'pathology',
      urgency: 'High Risk Alert',
      title: 'Early Blight Risk in Sector 2-B',
      description:
        'Foliar canopy microclimate humidity >85% for 6 consecutive hours. ICAR preventive spray with Mancozeb 75 WP or bio-fungicide due.',
      actionLabel: 'Launch FieldSight AI',
      actionHref: '/demo/fieldsight',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
      icon: AlertTriangle,
    },
    {
      id: 'p-3',
      type: 'market',
      urgency: 'Market Opportunity',
      title: 'Nashik APMC Price Surge (+₹210/qtl)',
      description:
        'Modal price surged to ₹2,450/qtl due to low Mumbai terminal market arrivals. Favorable net realization after ₹45 freight deduction.',
      actionLabel: 'Calculate Net Realization',
      actionHref: '/demo/markets',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
      icon: TrendingUp,
    },
  ].filter((p) => !dismissedPriorities.includes(p.id));

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Soil Telemetry Synced',
      detail: 'Moisture 41.4% · Vadose matrix potential -33 kPa',
      time: '4 mins ago',
      source: 'LoRa Soil Probe #2',
    },
    {
      id: 'act-2',
      title: 'Satellite NDVI Refresh',
      detail: 'Sentinel-2 MSI composite: 0.81 canopy index (High Vigour)',
      time: '32 mins ago',
      source: 'Copernicus Hub',
    },
    {
      id: 'act-3',
      title: 'Automated Microclimate Alert',
      detail: 'Relative humidity reached 62% with 28.4°C ambient',
      time: '1 hour ago',
      source: 'Weather Station NW',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          AREA A: FARM HERO & HIGH-LEVEL STATE
      ========================================================================== */}
      <div className="rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14231A] border border-emerald-600/40 text-emerald-400 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo Estate
              </span>
              <span className="text-xs font-mono text-[#63796E]">·</span>
              <span className="text-xs font-mono text-[#8EA698]">
                Sentinel-2 MSI (Updated 4m ago)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FAF8F2] font-serif tracking-tight">
              {farmName}
            </h1>

            <p className="text-sm text-[#8EA698] flex flex-wrap items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{location}</span>
              <span className="text-[#63796E]">·</span>
              <span className="font-mono text-[#FAF8F2] font-semibold">{areaHectares} ha</span>
              <span className="text-[#63796E]">·</span>
              <span className="text-emerald-300 font-medium">{cropName} ({cropVariety})</span>
            </p>
          </div>

          {/* Weather Pill & Drip Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#080D0A] border border-[#18261E] text-xs font-mono">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-[#FAF8F2] font-semibold tabular-nums">{ambientTemperature}°C · {ambientHumidity}% RH</div>
                <div className="text-[10px] text-[#63796E]">Clear Sky · Solar: {solarRadiationWm2} W/m²</div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={toggleDripIrrigation}
              className={`text-xs gap-2 py-5 px-4 rounded-xl transition-all ${
                dripIrrigationActive
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#111A15] text-[#8EA698] border-[#22352A] hover:bg-[#16231C] hover:text-[#FAF8F2]'
              }`}
            >
              <Power className={`w-4 h-4 ${dripIrrigationActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
              <span className="font-semibold">
                {dripIrrigationActive ? 'Drip Active (Running)' : 'Start Drip Irrigation'}
              </span>
            </Button>
          </div>
        </div>

        {/* Growth Stage Progress Strip */}
        <div className="pt-4 border-t border-[#18261E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#63796E]">Phenological Stage:</span>
            <span className="text-emerald-400 font-bold">{growthStage}</span>
            <span className="text-[#63796E]">• Day {sowingDaysAgo} of 95</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#63796E]">Season Progress:</span>
            <div className="w-32 h-2 rounded-full bg-[#18261E] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }} />
            </div>
            <span className="text-[#FAF8F2] font-semibold tabular-nums">55%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          AREA B + AREA C: PRIORITIES (LEFT) & HEALTH COMPOSITE (RIGHT)
      ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AREA B: TODAY'S PRIORITIES (2 Columns on Large Screens) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#FAF8F2] font-serif">Today&apos;s Priorities</h2>
              <p className="text-xs text-[#8EA698]">Maximum 3 urgent recommendations requiring your decision.</p>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/30">
              {priorities.length} Active
            </Badge>
          </div>

          {priorities.length === 0 ? (
            <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-8 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-[#FAF8F2]">All Priorities Addressed</h3>
              <p className="text-xs text-[#63796E] max-w-sm mx-auto">
                No immediate risks detected. Your Nashik Tomato estate is operating within optimal agronomic thresholds.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {priorities.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-[#273C30] p-5 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#16231C] border border-[#1F2E25] text-emerald-400">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${item.badgeColor}`}>
                            {item.urgency}
                          </span>
                          <h3 className="text-sm font-bold text-[#FAF8F2] mt-0.5">{item.title}</h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDismissedPriorities((prev) => [...prev, item.id])}
                        className="text-[#63796E] hover:text-[#FAF8F2] p-1 text-xs"
                        aria-label="Dismiss priority"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[#8EA698] leading-relaxed pl-1">
                      {item.description}
                    </p>

                    <div className="pt-1 flex items-center justify-end">
                      {item.actionHref ? (
                        <Link
                          href={item.actionHref}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#16231C] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/60 transition-colors"
                        >
                          <span>{item.actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={item.actionHandler}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            item.actionHighlight
                              ? 'bg-emerald-500 text-[#090D0B] border-emerald-400'
                              : 'bg-[#16231C] text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60'
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

        {/* AREA C: SIMPLE FARM HEALTH COMPOSITE (1 Column) */}
        <div className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#FAF8F2] font-serif">Farm Health Composite</h2>
            <p className="text-xs text-[#8EA698]">Unified agronomic condition index.</p>
          </div>

          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-6 text-center">
            {/* Circular Composite Health Gauge */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#18261E"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="314.16"
                  strokeDashoffset="18.8" // 94% full
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-3xl font-extrabold text-[#FAF8F2] tabular-nums">94</span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-sans font-bold">Optimal</span>
              </div>
            </div>

            {/* Sub-Metric Breakdown Bars */}
            <div className="space-y-3 font-mono text-xs text-left pt-2 border-t border-[#18261E]">
              <div className="space-y-1">
                <div className="flex justify-between text-[#8EA698]">
                  <span>Root Moisture (Vadose)</span>
                  <span className="text-[#FAF8F2] font-bold tabular-nums">{soilMoisture}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#18261E] overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${soilMoisture}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8EA698]">
                  <span>Canopy NDVI Vigour</span>
                  <span className="text-[#FAF8F2] font-bold tabular-nums">{canopyNdvi}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#18261E] overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${canopyNdvi * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8EA698]">
                  <span>Biomass Stress Offset</span>
                  <span className="text-purple-300 font-bold tabular-nums">{biomassStressPercent}% (Low)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#18261E] overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${biomassStressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          AREA D: DISCOVER MORE — FIVE CLEAN MODULE ROUTING CARDS
      ========================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#FAF8F2] font-serif">Explore Farm Modules</h2>
            <p className="text-xs text-[#8EA698]">Access deep specialized operational views for this estate.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/demo/fieldsight"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-rose-500/50 p-4 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/30 text-rose-400 w-fit">
                <ScanEye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF8F2] group-hover:text-rose-300 transition-colors">
                FieldSight AI
              </h3>
              <p className="text-xs text-[#7B9587] leading-relaxed">
                Foliar pathology scanner with Grad-CAM activation heatmaps and ICAR regimens.
              </p>
            </div>
            <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
              <span>Inspect Canopy</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/demo/twin"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-cyan-500/50 p-4 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-cyan-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF8F2] group-hover:text-cyan-300 transition-colors">
                Digital Twin
              </h3>
              <p className="text-xs text-[#7B9587] leading-relaxed">
                3D biophysical Vadose zone mesh simulating heatwave and drought what-if scenarios.
              </p>
            </div>
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
              <span>Simulate Mesh</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/demo/intelligence"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-500/50 p-4 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 w-fit">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors">
                Agronomic Copilot
              </h3>
              <p className="text-xs text-[#7B9587] leading-relaxed">
                Reasoning agent citing ICAR agronomy and FAO-56 irrigation crop water criteria.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span>Ask Copilot</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/demo/ops"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-amber-500/50 p-4 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/30 text-amber-400 w-fit">
                <Warehouse className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF8F2] group-hover:text-amber-300 transition-colors">
                Farm Operations
              </h3>
              <p className="text-xs text-[#7B9587] leading-relaxed">
                Work order dispatch queue, inventory tracking, and grain silo moisture storage.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
              <span>Dispatch Orders</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/demo/markets"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-500/50 p-4 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-emerald-400 w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors">
                Mandi Markets
              </h3>
              <p className="text-xs text-[#7B9587] leading-relaxed">
                Live Agmarknet mandi price comparisons with multi-factor freight arbitrage deductions.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span>Compare Mandis</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          AREA E: RECENT ACTIVITY FEED
      ========================================================================== */}
      <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#18261E]">
          <div className="flex items-center gap-2 text-sm font-bold text-[#FAF8F2] font-serif">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Recent Estate Activity</span>
          </div>
          <span className="text-[11px] font-mono text-[#63796E]">Audit Trail Verified</span>
        </div>

        <div className="divide-y divide-[#18261E]">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#FAF8F2]">{act.title}</div>
                <div className="text-[#8EA698]">{act.detail}</div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#63796E]">
                <span>{act.source}</span>
                <span>•</span>
                <span className="text-emerald-400/80">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PROGRESSIVE DISCLOSURE: DEEP SENSOR TELEMETRY & STRATA
      ========================================================================== */}
      <div className="pt-2 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeepTelemetry(!showDeepTelemetry)}
          className="text-xs text-[#8EA698] border-[#1E2E25] hover:text-[#FAF8F2] hover:bg-[#121B16] gap-2 font-mono"
        >
          {showDeepTelemetry ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide Deep Agronomic Strata</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Inspect Deep Telemetry & Soil Chemistry Strata</span>
            </>
          )}
        </Button>
      </div>

      {showDeepTelemetry && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Soil Chemistry Profile */}
            <Card className="border-[#1E2E25] bg-[#0E1511]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-[#FAF8F2]">
                  Soil Chemical Strata (0-30cm Depth)
                </CardTitle>
                <CardDescription className="text-xs text-[#7B9587]">
                  NPK macro-nutrients and electrical conductivity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#8EA698]">Soil Reaction (pH)</span>
                  <span className="text-purple-400 font-bold tabular-nums">{soilPh} pH (Neutral)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#8EA698]">Available Nitrogen (N)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{nitrogenPpm} ppm (Adequate)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#8EA698]">Phosphorus (P₂O₅)</span>
                  <span className="text-sky-400 font-bold tabular-nums">{phosphorusPpm} ppm (Target 40)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#8EA698]">Potassium (K₂O)</span>
                  <span className="text-amber-400 font-bold tabular-nums">{potassiumPpm} ppm (High)</span>
                </div>
              </CardContent>
            </Card>

            {/* Phenological Timeline Stages */}
            <Card className="border-[#1E2E25] bg-[#0E1511] lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-[#FAF8F2]">
                  Tomato Crop Phenology Timeline
                </CardTitle>
                <CardDescription className="text-xs text-[#7B9587]">
                  Target growth timeline calibrated for Abhinav F1 hybrid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
                  <div className="p-3 rounded-xl bg-[#090F0C] border border-[#19261E] text-emerald-400">
                    <div className="text-[9px] text-[#63796E]">STAGE 1</div>
                    <div className="font-semibold">Transplant</div>
                    <div className="text-[9px] text-[#556D60]">Days 0-15 ✓</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090F0C] border border-[#19261E] text-emerald-400">
                    <div className="text-[9px] text-[#63796E]">STAGE 2</div>
                    <div className="font-semibold">Vegetative</div>
                    <div className="text-[9px] text-[#556D60]">Days 16-35 ✓</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#14231A] border border-emerald-600/40 text-emerald-300 ring-1 ring-emerald-500/30">
                    <div className="text-[9px] text-emerald-400">CURRENT</div>
                    <div className="font-bold">Flowering</div>
                    <div className="text-[9px] text-emerald-400/80">Days 36-60</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090F0C] border border-[#19261E] text-[#63796E]">
                    <div className="text-[9px] text-[#556D60]">STAGE 4</div>
                    <div className="font-semibold">Fruit / Harvest</div>
                    <div className="text-[9px] text-[#556D60]">Days 61-95</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

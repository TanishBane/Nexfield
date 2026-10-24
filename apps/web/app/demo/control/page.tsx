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
  HelpCircle,
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
  const [showDeepTelemetry, setShowDeepTelemetry] = useState<boolean>(false);

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
      title: 'Satellite Multispectral Refresh',
      detail: 'Sentinel-2 MSI composite: 0.81 NDVI canopy vigor',
      time: '32 mins ago',
      source: 'Copernicus Hub',
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
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* =========================================================================
          SECTION 1: BEAUTIFUL FARM OVERVIEW (TOP HERO)
      ========================================================================== */}
      <div className="rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14231A] border border-emerald-600/50 text-emerald-300 font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demonstration Estate
              </span>
              <span className="text-xs font-mono text-[#8EA698]">
                Sentinel-2 Synced (4m ago) · Verified Fixtures
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif tracking-tight">
              {farmName}
            </h1>

            <p className="text-base sm:text-lg text-[#D7E5DC] flex flex-wrap items-center gap-2.5 font-medium">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{location}</span>
              <span className="text-[#63796E]">·</span>
              <span className="font-mono text-[#FAF8F2] font-bold">{areaHectares} Hectares</span>
              <span className="text-[#63796E]">·</span>
              <span className="text-emerald-300 font-semibold">{cropName} ({cropVariety})</span>
            </p>
          </div>

          {/* Weather Pill & Drip Action */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#080D0A] border border-[#1E2E25] text-sm font-mono">
              <Sun className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-[#FAF8F2] font-bold text-base tabular-nums">
                  {ambientTemperature}°C · {ambientHumidity}% RH
                </div>
                <div className="text-xs text-[#8EA698]">Clear Sky · Solar: {solarRadiationWm2} W/m²</div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={toggleDripIrrigation}
              className={`text-sm font-bold gap-2.5 py-6 px-5 rounded-2xl transition-all ${
                dripIrrigationActive
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/20'
                  : 'bg-[#111A15] text-[#D7E5DC] border-[#22352A] hover:bg-[#16231C] hover:text-[#FAF8F2]'
              }`}
            >
              <Power className={`w-5 h-5 ${dripIrrigationActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
              <span>{dripIrrigationActive ? 'Drip Active (Running)' : 'Start Drip Irrigation'}</span>
            </Button>
          </div>
        </div>

        {/* Growth Stage Progress Strip */}
        <div className="pt-5 border-t border-[#18261E] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-mono">
          <div className="flex items-center gap-3">
            <span className="text-[#9BB1A4]">Growth Milestone:</span>
            <span className="text-emerald-400 font-bold text-base">{growthStage}</span>
            <span className="text-[#8EA698]">• Day {sowingDaysAgo} of 95</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#9BB1A4]">Cycle Completed:</span>
            <div className="w-36 h-2.5 rounded-full bg-[#18261E] overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }} />
            </div>
            <span className="text-[#FAF8F2] font-bold tabular-nums text-sm">55%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: "YOUR FARM TODAY" (MAX 3 MEANINGFUL ACTIONABLE PRIORITIES)
      ========================================================================== */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F2] font-serif">
              Your Farm Today
            </h2>
            <p className="text-sm text-[#9BB1A4] mt-0.5">
              Three critical observations requiring your agronomic decision.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/40">
            {priorities.length} Active Items
          </Badge>
        </div>

        {priorities.length === 0 ? (
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-10 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">All Priorities Addressed</h3>
            <p className="text-sm text-[#9BB1A4] max-w-md mx-auto">
              Your estate is operating within optimal agronomic thresholds. No immediate action required.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priorities.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-[#273C30] p-6 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-[#16231C] border border-[#1F2E25] text-emerald-400">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${item.badgeColor}`}>
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDismissedPriorities((prev) => [...prev, item.id])}
                        className="text-[#63796E] hover:text-[#FAF8F2] p-1 text-xs"
                        aria-label="Dismiss priority"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-[#FAF8F2] font-serif leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#9BB1A4] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#18261E]">
                    {item.actionHref ? (
                      <Link
                        href={item.actionHref}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-[#16231C] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/60 transition-colors"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={item.actionHandler}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                          item.actionHighlight
                            ? 'bg-emerald-500 text-[#090D0B] border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-[#16231C] text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60'
                        }`}
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-4 h-4" />
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
          SECTION 3: "FARM AT A GLANCE" (READABLE PLAIN-LANGUAGE INDICATORS)
      ========================================================================== */}
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F2] font-serif">
            Farm at a Glance
          </h2>
          <p className="text-sm text-[#9BB1A4] mt-0.5">
            Key vital signs distilled into understandable agricultural terms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Soil Moisture */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#9BB1A4]">Soil Moisture</span>
              <Droplets className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              {soilMoisture}%
            </div>
            <div className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Optimal Root Zone Capacity</span>
            </div>
          </div>

          {/* Crop Condition */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#9BB1A4]">Crop Condition</span>
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              94%
            </div>
            <div className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Canopy NDVI: {canopyNdvi} (Vigorous)</span>
            </div>
          </div>

          {/* Microclimate Weather */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#9BB1A4]">Today&apos;s Weather</span>
              <Thermometer className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              {ambientTemperature}°C
            </div>
            <div className="text-sm text-[#D7E5DC] font-medium">
              {ambientHumidity}% Humidity · Low Heat Stress ({biomassStressPercent}%)
            </div>
          </div>

          {/* Season Progress */}
          <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#9BB1A4]">Season Progress</span>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F2] font-mono tabular-nums">
              55%
            </div>
            <div className="text-sm text-[#D7E5DC] font-medium">
              Day {sowingDaysAgo} of 95 (Fruit Enlargement)
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: "EXPLORE YOUR FARM" (PROMINENT DESTINATION CARDS)
      ========================================================================== */}
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F2] font-serif">
            Explore Your Farm
          </h2>
          <p className="text-sm text-[#9BB1A4] mt-0.5">
            Dive deeper into specialized agronomic modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Crop Health (FieldSight) */}
          <Link
            href="/demo/fieldsight"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-rose-500/50 p-6 transition-all flex flex-col justify-between space-y-5 shadow-xl hover:shadow-rose-950/20"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-400 w-fit">
                <ScanEye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] font-serif group-hover:text-rose-300 transition-colors">
                Inspect Crops
              </h3>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                FieldSight AI pathology scanner with Grad-CAM heatmaps and ICAR chemical rotation regimens.
              </p>
            </div>
            <div className="text-sm font-mono font-semibold text-rose-400 flex items-center gap-1.5 pt-2">
              <span>Inspect Foliage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Digital Twin */}
          <Link
            href="/demo/twin"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-cyan-500/50 p-6 transition-all flex flex-col justify-between space-y-5 shadow-xl hover:shadow-cyan-950/20"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] font-serif group-hover:text-cyan-300 transition-colors">
                Open Digital Twin
              </h3>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                3D biophysical Vadose zone mesh simulating drought, heatwaves, and irrigation what-if scenarios.
              </p>
            </div>
            <div className="text-sm font-mono font-semibold text-cyan-400 flex items-center gap-1.5 pt-2">
              <span>Simulate Scenarios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Farm Operations */}
          <Link
            href="/demo/ops"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-amber-500/50 p-6 transition-all flex flex-col justify-between space-y-5 shadow-xl hover:shadow-amber-950/20"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-400 w-fit">
                <Warehouse className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] font-serif group-hover:text-amber-300 transition-colors">
                Manage Tasks
              </h3>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                Operational work order dispatching, fertilizer inventory, and grain silo moisture assurance.
              </p>
            </div>
            <div className="text-sm font-mono font-semibold text-amber-400 flex items-center gap-1.5 pt-2">
              <span>Dispatch Orders</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Markets */}
          <Link
            href="/demo/markets"
            className="group rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-500/50 p-6 transition-all flex flex-col justify-between space-y-5 shadow-xl hover:shadow-emerald-950/20"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] font-serif group-hover:text-emerald-300 transition-colors">
                Explore Markets
              </h3>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                Live wholesale Agmarknet mandi spreads with multi-factor freight arbitrage deductions.
              </p>
            </div>
            <div className="text-sm font-mono font-semibold text-emerald-400 flex items-center gap-1.5 pt-2">
              <span>Compare Mandis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: "RECENT ACTIVITY" (VERIFIED AUDIT FEED)
      ========================================================================== */}
      <div className="rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#18261E]">
          <div className="flex items-center gap-2.5 text-lg font-bold text-[#FAF8F2] font-serif">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Recent Estate Activity</span>
          </div>
          <span className="text-xs font-mono text-[#8EA698]">Audit Trail Verified</span>
        </div>

        <div className="divide-y divide-[#18261E]">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#FAF8F2]">{act.title}</div>
                <div className="text-[#9BB1A4]">{act.detail}</div>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#8EA698]">
                <span>{act.source}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PROGRESSIVE DISCLOSURE: DEEP TELEMETRY & SOIL STRATA
      ========================================================================== */}
      <div className="pt-2 text-center">
        <Button
          variant="outline"
          size="md"
          onClick={() => setShowDeepTelemetry(!showDeepTelemetry)}
          className="text-sm text-[#9BB1A4] border-[#1E2E25] hover:text-[#FAF8F2] hover:bg-[#121B16] gap-2.5 font-mono py-3 px-6 rounded-xl"
        >
          {showDeepTelemetry ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Hide Deep Agronomic Strata</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>Inspect Deep Sensor Strata & Chemistry (0-30cm Depth)</span>
            </>
          )}
        </Button>
      </div>

      {showDeepTelemetry && (
        <div className="space-y-6 pt-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Soil Chemistry Profile */}
            <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">
                  Soil Chemical Profile (0-30cm)
                </h3>
                <p className="text-xs text-[#8EA698]">NPK macro-nutrients and electrical reaction</p>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#9BB1A4]">Soil Reaction (pH)</span>
                  <span className="text-purple-400 font-bold tabular-nums">{soilPh} pH (Neutral)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#9BB1A4]">Available Nitrogen (N)</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{nitrogenPpm} ppm (Adequate)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#9BB1A4]">Phosphorus (P₂O₅)</span>
                  <span className="text-sky-400 font-bold tabular-nums">{phosphorusPpm} ppm (Target 40)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#080D0A] border border-[#18261E]">
                  <span className="text-[#9BB1A4]">Potassium (K₂O)</span>
                  <span className="text-amber-400 font-bold tabular-nums">{potassiumPpm} ppm (High)</span>
                </div>
              </div>
            </div>

            {/* Phenological Timeline Stages */}
            <div className="rounded-2xl bg-[#0E1511] border border-[#1E2E25] p-6 space-y-4 lg:col-span-2">
              <div>
                <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">
                  Tomato Crop Phenology Stages
                </h3>
                <p className="text-xs text-[#8EA698]">Calibrated for Abhinav F1 hybrid (Target: 95 days)</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#090F0C] border border-[#19261E] text-emerald-400">
                  <div className="text-[10px] text-[#8EA698]">STAGE 1</div>
                  <div className="font-bold text-sm mt-0.5">Transplant</div>
                  <div className="text-xs text-[#556D60] mt-1">Days 0-15 ✓</div>
                </div>
                <div className="p-4 rounded-xl bg-[#090F0C] border border-[#19261E] text-emerald-400">
                  <div className="text-[10px] text-[#8EA698]">STAGE 2</div>
                  <div className="font-bold text-sm mt-0.5">Vegetative</div>
                  <div className="text-xs text-[#556D60] mt-1">Days 16-35 ✓</div>
                </div>
                <div className="p-4 rounded-xl bg-[#14231A] border border-emerald-600/50 text-emerald-300 ring-1 ring-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 font-bold">CURRENT</div>
                  <div className="font-bold text-sm mt-0.5">Flowering</div>
                  <div className="text-xs text-emerald-300 mt-1">Days 36-60</div>
                </div>
                <div className="p-4 rounded-xl bg-[#090F0C] border border-[#19261E] text-[#8EA698]">
                  <div className="text-[10px] text-[#63796E]">STAGE 4</div>
                  <div className="font-bold text-sm mt-0.5">Fruit / Harvest</div>
                  <div className="text-xs text-[#63796E] mt-1">Days 61-95</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

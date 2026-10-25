"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Badge, Button } from "@nexfield/ui";
import { useDemoStore } from "@/lib/store/useDemoStore";

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
  const [activeTab, setActiveTab] = useState<"soil" | "crop" | "storage">(
    "soil",
  );

  // Today's Top Priorities (Strictly Max 3 Meaningful Actionable Items)
  const dismissedPrioritiesSet = new Set(dismissedPriorities);
  const priorities = [
    {
      id: "p-1",
      category: "Irrigation & Hydrology",
      title: "Vadose Infiltration Window Active",
      description:
        "Soil moisture is at 41%. Drip fertigation with water-soluble 13-0-45 is recommended within 18 hours to sustain fruit enlargement and prevent blossom-end rot.",
      actionLabel: dripIrrigationActive
        ? "Drip Running (Stop)"
        : "Start Drip Irrigation",
      actionHandler: toggleDripIrrigation,
      actionHighlight: dripIrrigationActive,
      badgeColor: "text-sky-700 border-sky-500/40 bg-sky-50/40",
      icon: Droplets,
    },
    {
      id: "p-2",
      category: "Crop Protection Alert",
      title: "Early Blight Risk Elevated in Sector 2-B",
      description:
        "Canopy microclimate humidity has exceeded 85% for 6 consecutive hours. ICAR preventive bio-fungicide or copper oxychloride spray due.",
      actionLabel: "Inspect Leaf Symptoms",
      actionHref: "/demo/fieldsight",
      badgeColor: "text-amber-700 border-amber-500/40 bg-amber-50/40",
      icon: AlertTriangle,
    },
    {
      id: "p-3",
      category: "Wholesale Market Opportunity",
      title: "Nashik APMC Price Surge (+₹210 / qtl)",
      description:
        "Modal wholesale price jumped to ₹2,450/qtl due to low terminal arrivals. Favorable net realization after factoring ₹45 freight deduction.",
      actionLabel: "Review Market Returns",
      actionHref: "/demo/markets",
      badgeColor: "text-emerald-700 border-emerald-500/40 bg-emerald-50/40",
      icon: TrendingUp,
    },
  ].filter((p) => !dismissedPrioritiesSet.has(p.id));

  // Recent Activity Feed
  const recentActivities = [
    {
      id: "act-1",
      title: "Soil Sensor Probe Synced",
      detail: "Moisture 41.4% · Matrix potential -33 kPa (Optimal)",
      time: "4 mins ago",
      source: "LoRa Soil Probe #2",
    },
    {
      id: "act-2",
      title: "Multispectral Baseline Processed",
      detail: "Canopy vegetative index: 0.81 NDVI vigor",
      time: "32 mins ago",
      source: "Satellite Pre-computation",
    },
    {
      id: "act-3",
      title: "Microclimate Weather Logged",
      detail: "28.4°C ambient with 62% relative humidity",
      time: "1 hour ago",
      source: "Field Weather Station",
    },
  ];

  return (
    <div className="module-page module-overview space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* =========================================================================
          A. FARM SUMMARY (TOP HERO)
      ========================================================================== */}
      <div className="rounded-3xl bg-[#F7FAF2] border border-[#D1DDCD] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D7B678]/40 text-[#815414] font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Interactive Demo — Sample Farm Data
              </span>
              <span className="text-xs font-mono text-[#46604D]">
                Nashik Valley · Silt Loam Soil
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#09251A] tracking-tight">
              {farmName}
            </h1>

            <p className="text-sm sm:text-base text-[#09251A] flex flex-wrap items-center gap-2 font-medium">
              <Compass className="w-4 h-4 text-[#815414] shrink-0" />
              <span>{location}</span>
              <span className="text-[#46604D]">·</span>
              <span className="font-mono text-[#09251A] font-semibold">
                {areaHectares} Hectares
              </span>
              <span className="text-[#46604D]">·</span>
              <span className="text-emerald-700 font-semibold">
                {cropName} ({cropVariety})
              </span>
            </p>
          </div>

          {/* Weather Summary & Drip Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs">
              <Sun className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="space-y-0.5">
                <div className="text-[#09251A] font-bold text-sm tabular-nums">
                  {ambientTemperature}°C · {ambientHumidity}% RH
                </div>
                <div className="text-[#46604D]">
                  Clear Sky · Solar: {solarRadiationWm2} W/m²
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={toggleDripIrrigation}
              className={`text-xs font-bold gap-2 py-5 px-4 rounded-2xl transition-all ${
                dripIrrigationActive
                  ? "bg-emerald-50/90 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/40 shadow-lg shadow-emerald-500/20"
                  : "bg-[#F7FAF2] text-[#09251A] border-[#D1DDCD] hover:bg-[#F7FAF2] hover:text-[#09251A]"
              }`}
            >
              <Power
                className={`w-4 h-4 ${dripIrrigationActive ? "text-emerald-700 animate-pulse" : "text-zinc-500"}`}
              />
              <span>{dripIrrigationActive ? "Drip Active" : "Start Drip"}</span>
            </Button>
          </div>
        </div>

        {/* Growth Stage Progress Strip */}
        <div className="pt-4 border-t border-[#D1DDCD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-[#46604D]">Growth Milestone:</span>
            <span className="text-emerald-700 font-bold text-sm">
              {growthStage}
            </span>
            <span className="text-[#46604D]">· Day {sowingDaysAgo} of 95</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[#46604D]">Cycle Progress:</span>
            <div className="w-32 h-2 rounded-full bg-[#FFFFFF] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: "55%" }}
              />
            </div>
            <span className="text-[#09251A] font-bold tabular-nums">55%</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          B. WHAT NEEDS ATTENTION (MAX 3 PRIMARY ACTIONS/ALERTS)
      ========================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#09251A] tracking-tight">
              Today&apos;s priorities
            </h2>
            <p className="text-xs text-[#46604D] mt-0.5">
              Three critical observations requiring your decision today.
            </p>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-xs text-[#815414] border-[#D7B678]/40"
          >
            {priorities.length} Active Items
          </Badge>
        </div>

        {priorities.length === 0 ? (
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h3 className="text-base font-bold text-[#09251A]">
              All Priorities Addressed
            </h3>
            <p className="text-xs text-[#46604D] max-w-md mx-auto">
              Your estate is operating within optimal agronomic thresholds. No
              immediate intervention required.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {priorities.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-[#D1DDCD] p-5 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-[#815414]">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${item.badgeColor}`}
                        >
                          {item.category}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setDismissedPriorities((prev) => [...prev, item.id])
                        }
                        className="text-[#46604D] hover:text-[#09251A] p-1"
                        aria-label="Dismiss priority"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-[#09251A] leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#46604D] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#D1DDCD]">
                    {item.actionHref ? (
                      <Link
                        href={item.actionHref}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-[#FFFFFF] text-[#09251A] border border-[#D7B678]/40 hover:bg-[#EDF4E7] transition-colors"
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
                            ? "bg-emerald-500 text-[#090D0B] border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-[#FFFFFF] text-[#09251A] border-[#D7B678]/40 hover:bg-[#EDF4E7]"
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#09251A] tracking-tight">
            Your farm today
          </h2>
          <p className="text-xs text-[#46604D] mt-0.5">
            Key vital signs presented in plain agricultural language.
          </p>
        </div>

        <div className="overview-shortcuts grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Soil Moisture */}
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#46604D]">
                Soil Moisture
              </span>
              <Droplets className="w-4 h-4 text-sky-700" />
            </div>
            <div className="text-3xl font-extrabold text-[#09251A] font-mono tabular-nums">
              {soilMoisture}%
            </div>
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Optimal Root Zone Capacity</span>
            </div>
          </div>

          {/* Crop Condition */}
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#46604D]">
                Crop Condition
              </span>
              <Sprout className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-3xl font-extrabold text-[#09251A] font-mono tabular-nums">
              94%
            </div>
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Canopy NDVI: {canopyNdvi} (Vigorous)</span>
            </div>
          </div>

          {/* Microclimate Weather */}
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#46604D]">
                Today&apos;s Weather
              </span>
              <Thermometer className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-3xl font-extrabold text-[#09251A] font-mono tabular-nums">
              {ambientTemperature}°C
            </div>
            <div className="text-xs text-[#09251A]">
              {ambientHumidity}% Humidity · Safe Zone ({biomassStressPercent}%
              stress)
            </div>
          </div>

          {/* Season Progress */}
          <div className="rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#46604D]">
                Season Progress
              </span>
              <Activity className="w-4 h-4 text-[#815414]" />
            </div>
            <div className="text-3xl font-extrabold text-[#09251A] font-mono tabular-nums">
              55%
            </div>
            <div className="text-xs text-[#09251A]">
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#09251A] tracking-tight">
            Farm tools
          </h2>
          <p className="text-xs text-[#46604D] mt-0.5">
            Direct shortcuts to key farm workflows.
          </p>
        </div>

        <div className="overview-shortcuts grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Crop Health (FieldSight) */}
          <Link
            href="/demo/fieldsight"
            className="group rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-rose-500/50 p-5 transition-all flex flex-col justify-between space-y-4 hover:bg-white"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-800/40 text-rose-700 w-fit">
                <ScanEye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#09251A] group-hover:text-rose-700 transition-colors">
                Inspect Crops
              </h3>
              <p className="text-xs text-[#46604D] leading-relaxed">
                Run AI foliar diagnosis with Grad-CAM heatmaps and
                ICAR-certified protocols.
              </p>
            </div>
            <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 pt-2 border-t border-[#D1DDCD]">
              <span>Scan Foliage</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Digital Twin */}
          <Link
            href="/demo/twin"
            className="group rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-cyan-500/50 p-5 transition-all flex flex-col justify-between space-y-4 hover:bg-white"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-50/40 border border-cyan-800/40 text-cyan-700 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#09251A] group-hover:text-cyan-700 transition-colors">
                Open Digital Twin
              </h3>
              <p className="text-xs text-[#46604D] leading-relaxed">
                Explore 3D rootzone soil moisture and compare precision
                irrigation scenarios.
              </p>
            </div>
            <div className="text-xs font-semibold text-cyan-700 flex items-center gap-1.5 pt-2 border-t border-[#D1DDCD]">
              <span>Open Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Farm Operations */}
          <Link
            href="/demo/ops"
            className="group rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-amber-500/50 p-5 transition-all flex flex-col justify-between space-y-4 hover:bg-white"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50/40 border border-amber-800/40 text-amber-700 w-fit">
                <Warehouse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#09251A] group-hover:text-amber-700 transition-colors">
                Manage Tasks
              </h3>
              <p className="text-xs text-[#46604D] leading-relaxed">
                Dispatch field work orders, verify inventory stock, and monitor
                storage silos.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 pt-2 border-t border-[#D1DDCD]">
              <span>Dispatch Orders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Mandi Markets */}
          <Link
            href="/demo/markets"
            className="group rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] hover:border-emerald-500/50 p-5 transition-all flex flex-col justify-between space-y-4 hover:bg-white"
          >
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-800/40 text-emerald-700 w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#09251A] group-hover:text-emerald-700 transition-colors">
                Compare Markets
              </h3>
              <p className="text-xs text-[#46604D] leading-relaxed">
                Wholesale mandi price discovery and freight haulage net
                realization models.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-[#D1DDCD]">
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
        <div className="lg:col-span-5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D1DDCD]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#815414]" />
              <h3 className="text-base font-bold text-[#09251A]">
                Recent Activity
              </h3>
            </div>
            <span className="text-xs text-[#46604D] font-mono">Live feed</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#09251A]">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-[#46604D] font-mono">
                    {act.time}
                  </span>
                </div>
                <div className="text-xs text-[#46604D]">{act.detail}</div>
                <div className="text-[10px] text-[#46604D] font-mono pt-0.5">
                  {act.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Disclosure: Deep Agronomic Data (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D1DDCD]">
            <div>
              <h3 className="text-base font-bold text-[#09251A]">
                Deep Agronomic Data
              </h3>
              <p className="text-xs text-[#46604D]">
                Specialized sub-system telemetry
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
              <button
                type="button"
                onClick={() => setActiveTab("soil")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "soil"
                    ? "bg-[#FFFFFF] text-[#815414] border border-[#D7B678]/40"
                    : "text-[#46604D] hover:text-[#09251A]"
                }`}
              >
                Soil & Water
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("crop")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "crop"
                    ? "bg-[#FFFFFF] text-[#815414] border border-[#D7B678]/40"
                    : "text-[#46604D] hover:text-[#09251A]"
                }`}
              >
                NPK Nutrients
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("storage")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "storage"
                    ? "bg-[#FFFFFF] text-[#815414] border border-[#D7B678]/40"
                    : "text-[#46604D] hover:text-[#09251A]"
                }`}
              >
                Food Storage
              </button>
            </div>
          </div>

          {activeTab === "soil" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  SOIL TEMPERATURE
                </span>
                <span className="text-[#09251A] font-bold text-base tabular-nums mt-0.5 block">
                  {soilTemperature}°C
                </span>
                <span className="text-emerald-700 text-[10px]">
                  Normal range
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  SOIL PH LEVEL
                </span>
                <span className="text-[#09251A] font-bold text-base tabular-nums mt-0.5 block">
                  {soilPh}
                </span>
                <span className="text-emerald-700 text-[10px]">
                  Optimal for Tomato
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  DRIP EMITTER FLOW
                </span>
                <span className="text-sky-700 font-bold text-base tabular-nums mt-0.5 block">
                  2.2 LPH
                </span>
                <span className="text-[#46604D] text-[10px]">
                  Pressure-compensated
                </span>
              </div>
            </div>
          )}

          {activeTab === "crop" && (
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  NITROGEN (N)
                </span>
                <span className="text-[#09251A] font-bold text-base tabular-nums mt-0.5 block">
                  {nitrogenPpm} ppm
                </span>
                <span className="text-emerald-700 text-[10px]">Adequate</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  PHOSPHORUS (P)
                </span>
                <span className="text-[#09251A] font-bold text-base tabular-nums mt-0.5 block">
                  {phosphorusPpm} ppm
                </span>
                <span className="text-emerald-700 text-[10px]">Optimal</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <span className="text-[#46604D] block text-[11px]">
                  POTASSIUM (K)
                </span>
                <span className="text-[#09251A] font-bold text-base tabular-nums mt-0.5 block">
                  {potassiumPpm} ppm
                </span>
                <span className="text-[#815414] text-[10px]">
                  Target 45 kg/ha top
                </span>
              </div>
            </div>
          )}

          {activeTab === "storage" && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
                <span className="text-xs font-bold text-[#09251A]">
                  Grain Silo Moisture
                </span>
                <div className="text-lg font-bold text-sky-700 font-mono">
                  12.4% EMC
                </div>
                <p className="text-[11px] text-[#46604D]">
                  &lt; 14% safe limit. Aspergillus mold suppressed.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
                <span className="text-xs font-bold text-[#09251A]">
                  Cold Room Temp
                </span>
                <div className="text-lg font-bold text-cyan-700 font-mono">
                  11.5°C
                </div>
                <p className="text-[11px] text-[#46604D]">
                  &gt; 10°C minimum to eliminate chilling injury.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

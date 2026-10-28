"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sprout,
  ArrowRight,
  RefreshCw,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  ScanEye,
  TrendingUp,
  Warehouse,
  X,
} from "lucide-react";
import { Badge, Button, ModuleLoadingState } from "@nexfield/ui";
import { apiClient } from "@/lib/api";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { FarmProfileModal } from "@/components/modules/control/FarmProfileModal";
import { TelemetryHUD } from "@/components/modules/control/TelemetryHUD";
import { ControlFilterBar } from "@/components/modules/control/ControlFilterBar";
import { CultivationCycles } from "@/components/modules/control/CultivationCycles";
import { MicroclimateObservation } from "@/components/modules/control/MicroclimateObservation";
import { ActivityTimeline } from "@/components/modules/control/ActivityTimeline";
import { RiskAlerts } from "@/components/modules/control/RiskAlerts";
import { UpcomingTasks } from "@/components/modules/control/UpcomingTasks";
import { ResourceInventory } from "@/components/modules/control/ResourceInventory";
import { HarvestStorage } from "@/components/modules/control/HarvestStorage";
import { MandiPrices } from "@/components/modules/control/MandiPrices";
import Link from "next/link";

export default function ControlPage() {
  const {
    selectedFarmId,
    activeFieldFilter,
    setActiveFieldFilter,
    activeSeasonFilter,
    setActiveSeasonFilter,
    isFarmProfileOpen,
    setIsFarmProfileOpen,
    dismissedAlertIds,
    dismissAlert,
    lastRefreshedAt,
    setLastRefreshedAt,
  } = useFarmStore();

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "cycles" | "weather" | "soil" | "tasks" | "market"
  >("cycles");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["controlOverview", selectedFarmId],
    queryFn: () => apiClient.getControlOverview(selectedFarmId),
  });

  useEffect(() => {
    if (data) {
      setLastRefreshedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }
  }, [data, setLastRefreshedAt]);

  const filteredCycles = useMemo(() => {
    const cycles = data?.data?.activeCycles || [];
    return cycles.filter((c) => {
      if (activeFieldFilter && c.fieldId !== activeFieldFilter) return false;
      if (activeSeasonFilter && c.season !== activeSeasonFilter) return false;
      return true;
    });
  }, [data?.data?.activeCycles, activeFieldFilter, activeSeasonFilter]);

  if (isLoading) {
    return (
      <ModuleLoadingState message="Loading farm overview..." />
    );
  }

  if (error || !data?.data) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-[#E5F2CF] border border-[#B8D494] text-[#005B36]">
          <Sprout className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#09251A]">
            Farm data unavailable
          </h2>
          <p className="text-xs text-[#46604D] leading-relaxed max-w-md mx-auto">
            The farm overview could not be loaded. Try again, import farm
            records, or explore the sample farm.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => setIsFarmProfileOpen(true)}
            className="w-full sm:w-auto bg-[#048547] text-white hover:bg-[#005B36] font-bold text-xs gap-1.5 px-5 min-h-[44px]"
          >
            <span>Configure Farm Estate</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Link href="/data-center" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full text-xs text-[#09251A] border-[#D1DDCD] hover:bg-[#F7FAF2] min-h-[44px]"
            >
              Import Data (CSV/GeoJSON)
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => refetch()}
            className="w-full sm:w-auto text-xs text-[#005B36] hover:bg-[#EAF1E7] min-h-[44px]"
          >
            Reload Baseline Demo →
          </Button>
        </div>
      </div>
    );
  }

  const overview = data.data;
  const {
    farm,
    weatherSummary,
    forecastDays,
    soilTelemetrySummary,
    activeAlerts,
    activeCycles,
    recentTasks,
    activityTimeline,
    inventorySummary,
    harvestSummary,
    relevantMandiPrices,
  } = overview;

  // Filter alerts
  const dismissedAlertsSet = new Set(dismissedAlertIds);
  const visibleAlerts = activeAlerts.filter(
    (a) => !dismissedAlertsSet.has(a.id),
  );

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  return (
    <div className="module-page module-overview space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* =========================================================================
          A. FARM SUMMARY (TOP HERO)
      ========================================================================== */}
      <div className="rounded-3xl bg-[#F7FAF2] border border-[#D1DDCD] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F2CF] border border-[#B8D494] text-[#005B36] font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#048547]" />
                Your farm
              </span>
              <span className="text-xs font-mono text-[#46604D]">
                {farm.location.district}, {farm.location.state}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#09251A] tracking-tight">
                {farm.name}
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFarmProfileOpen(true)}
                className="h-8 text-xs px-2.5 text-[#46604D] hover:text-[#09251A] border-[#D1DDCD] hover:bg-white"
              >
                <Info className="h-3.5 w-3.5 mr-1.5 text-[#048547]" />
                Farm Profile
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-[#46604D] flex flex-wrap items-center gap-2">
              <span>{farm.location.address}</span>
              <span className="text-[#46604D]">·</span>
              <span>
                Total Area:{" "}
                <strong className="font-mono text-[#005B36] font-semibold tabular-nums">
                  {farm.totalAreaHectares} ha
                </strong>
              </span>
              <span className="text-[#46604D]">·</span>
              <span>
                Coordinates:{" "}
                <strong className="font-mono text-[#09251A] tabular-nums">
                  {farm.location.latitude.toFixed(4)}°N,{" "}
                  {farm.location.longitude.toFixed(4)}°E
                </strong>
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#D1DDCD] text-xs font-mono shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#048547] motion-safe:animate-pulse" />
              <span className="text-[#46604D]">
                Telemetry Synced:{" "}
                <strong className="text-[#005B36] font-medium tabular-nums" suppressHydrationWarning>
                  {lastRefreshedAt}
                </strong>
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 text-xs gap-1.5 border border-[#D1DDCD] bg-white text-[#09251A] hover:bg-[#EAF1E7] cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#048547] ${isFetching ? "motion-safe:animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Link href="/twin">
              <Button
                variant="primary"
                size="sm"
                className="h-9 text-xs gap-1.5 bg-[#048547] text-white hover:bg-[#005B36] border-transparent font-semibold shadow-xs cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 text-white" />
                Launch 3D Twin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          B. WHAT NEEDS ATTENTION (MAX 3 URGENT ALERTS)
      ========================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#09251A] tracking-tight">
              Today&apos;s priorities
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF0A6] text-[#92400E] font-mono font-bold tabular-nums border border-[#E7D57A]">
              {visibleAlerts.length} Active
            </span>
          </div>
          {visibleAlerts.length > 0 && (
            <p className="text-xs text-[#46604D]">
              Prioritized by agronomic urgency
            </p>
          )}
        </div>

        {visibleAlerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#D1DDCD] text-sm text-[#46604D] shadow-xs">
            <CheckCircle2 className="h-5 w-5 text-[#048547] shrink-0" />
            <span>
              All farm biological, hydrological, and storage parameters are
              within safe operational limits.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {visibleAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-[#D1DDCD] hover:border-[#B8D494] transition-all shadow-xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF0A6] text-[#92400E] border border-[#E7D57A] font-semibold">
                      <AlertTriangle className="h-3 w-3 text-[#D97706]" />
                      {alert.severity.toUpperCase()}
                    </span>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-[#46604D] hover:text-[#09251A] p-1.5 rounded-lg hover:bg-[#F7FAF2] transition-colors cursor-pointer"
                      title="Dismiss alert"
                      aria-label="Dismiss alert"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-[#09251A] line-clamp-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[#46604D] line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#D1DDCD] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#46604D]">
                    Field Alert
                  </span>
                  <Link
                    href="/fieldsight"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#005B36] hover:text-[#048547]"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          C. FARM AT A GLANCE (4 KEY METRICS)
      ========================================================================== */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#09251A] tracking-tight">
          Your farm today
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] space-y-1 shadow-xs hover:border-[#B8D494] transition-all">
            <span className="text-xs text-[#46604D] font-medium flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-[#048547]" />
              Active Crops
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#09251A] pt-1">
              {activeCycles.length > 0
                ? activeCycles[0].cropName
                : "None Active"}
            </div>
            <p className="text-[11px] text-[#46604D] font-mono tabular-nums">
              {activeCycles.length} active cycle
              {activeCycles.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] space-y-1 shadow-xs hover:border-[#A2C9E5] transition-all">
            <span className="text-xs text-[#46604D] font-medium flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-[#0284C7]" />
              Soil Moisture
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#09251A] pt-1 tabular-nums">
              {soilTelemetrySummary.avgMoisturePercent.toFixed(1)}%
            </div>
            <p className="text-[11px] text-[#46604D] font-mono tabular-nums">
              Temp: {soilTelemetrySummary.avgTemperatureC.toFixed(1)}°C
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] space-y-1 shadow-xs hover:border-[#E7D57A] transition-all">
            <span className="text-xs text-[#46604D] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#D97706]" />
              Scheduled Tasks
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#09251A] pt-1 tabular-nums">
              {recentTasks.length} Pending
            </div>
            <p className="text-[11px] text-[#46604D] font-mono tabular-nums">
              {completedTaskIds.length} completed today
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] space-y-1 shadow-xs hover:border-[#E9B4C4] transition-all">
            <span className="text-xs text-[#46604D] font-medium flex items-center gap-1.5">
              <Warehouse className="h-3.5 w-3.5 text-[#EA580C]" />
              Storage Stock
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#09251A] pt-1 tabular-nums">
              {harvestSummary.totalHarvestedKg.toLocaleString()} kg
            </div>
            <p className="text-[11px] text-[#46604D] font-mono tabular-nums">
              {harvestSummary.batchesInStorage} batch
              {harvestSummary.batchesInStorage !== 1 ? "es" : ""} stored
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          D. QUICK ACTIONS (4 CLEAN DESTINATIONS)
      ========================================================================== */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#09251A] tracking-tight">
          Farm tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/fieldsight"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] hover:border-[#048547] hover:shadow-sm transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-[#E5F2CF] border border-[#B8D494] text-[#005B36] w-fit group-hover:scale-105 transition-transform">
              <ScanEye className="h-5 w-5 text-[#048547]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#09251A] flex items-center justify-between">
                <span>AI Crop Health Scan</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#46604D] group-hover:text-[#048547] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#46604D] mt-1">
                Diagnose blight, pests & leaf deficiency with Grad-CAM
              </p>
            </div>
          </Link>

          <Link
            href="/twin"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] hover:border-[#048547] hover:shadow-sm transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-[#D5ECFD] border border-[#A2C9E5] text-[#0369A1] w-fit group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5 text-[#0284C7]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#09251A] flex items-center justify-between">
                <span>Digital Twin 3D</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#46604D] group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#46604D] mt-1">
                Simulate irrigation stress, canopy growth & harvest
              </p>
            </div>
          </Link>

          <Link
            href="/markets"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] hover:border-[#048547] hover:shadow-sm transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-[#FFF0A6] border border-[#E7D57A] text-[#92400E] w-fit group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5 text-[#D97706]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#09251A] flex items-center justify-between">
                <span>Mandi Market Rates</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#46604D] group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#46604D] mt-1">
                Wholesale APMC spot prices, net margins & logistics
              </p>
            </div>
          </Link>

          <Link
            href="/data-center"
            className="group p-4 sm:p-5 rounded-2xl bg-white border border-[#D1DDCD] hover:border-[#048547] hover:shadow-sm transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-[#FBE0E8] border border-[#E9B4C4] text-[#991B1B] w-fit group-hover:scale-105 transition-transform">
              <Warehouse className="h-5 w-5 text-[#DC2626]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#09251A] flex items-center justify-between">
                <span>Storage & Batches</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#46604D] group-hover:text-[#DC2626] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#46604D] mt-1">
                Cold storage telemetry, shelf-life risk & stock logs
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          E. RECENT ACTIVITY & DETAILED TELEMETRY (PROGRESSIVE DISCLOSURE TABS)
      ========================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1DDCD] pb-3">
          <h2 className="text-lg font-bold text-[#09251A] tracking-tight">
            Field conditions
          </h2>
          <div
            role="tablist"
            aria-label="Field condition categories"
            className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-[#D1DDCD] shadow-2xs"
          >
            <button
              role="tab"
              aria-selected={activeTab === "cycles"}
              onClick={() => setActiveTab("cycles")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "cycles"
                  ? "bg-[#E5F2CF] text-[#005B36] border border-[#B8D494] shadow-xs"
                  : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
              }`}
            >
              Crops & Cycles
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "weather"}
              onClick={() => setActiveTab("weather")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "weather"
                  ? "bg-[#E5F2CF] text-[#005B36] border border-[#B8D494] shadow-xs"
                  : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
              }`}
            >
              Weather & Microclimate
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "soil"}
              onClick={() => setActiveTab("soil")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "soil"
                  ? "bg-[#E5F2CF] text-[#005B36] border border-[#B8D494] shadow-xs"
                  : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
              }`}
            >
              Soil Sensors
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "tasks"}
              onClick={() => setActiveTab("tasks")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "tasks"
                  ? "bg-[#E5F2CF] text-[#005B36] border border-[#B8D494] shadow-xs"
                  : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
              }`}
            >
              Activity & Tasks
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "market"}
              onClick={() => setActiveTab("market")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "market"
                  ? "bg-[#E5F2CF] text-[#005B36] border border-[#B8D494] shadow-xs"
                  : "text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
              }`}
            >
              Storage & Markets
            </button>
          </div>
        </div>

        {activeTab === "cycles" && (
          <div role="tabpanel" className="space-y-4">
            <ControlFilterBar
              activeFieldFilter={activeFieldFilter}
              setActiveFieldFilter={setActiveFieldFilter}
              activeSeasonFilter={activeSeasonFilter}
              setActiveSeasonFilter={setActiveSeasonFilter}
            />
            <CultivationCycles cycles={filteredCycles} />
          </div>
        )}

        {activeTab === "weather" && (
          <div role="tabpanel">
            <MicroclimateObservation
              weatherSummary={weatherSummary}
              forecastDays={forecastDays}
            />
          </div>
        )}

        {activeTab === "soil" && (
          <div role="tabpanel">
            <TelemetryHUD soilTelemetrySummary={soilTelemetrySummary} />
          </div>
        )}

        {activeTab === "tasks" && (
          <div role="tabpanel" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityTimeline activityTimeline={activityTimeline} />
            <UpcomingTasks
              recentTasks={recentTasks}
              completedTaskIds={completedTaskIds}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </div>
        )}

        {activeTab === "market" && (
          <div role="tabpanel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <ResourceInventory inventorySummary={inventorySummary} />
              <HarvestStorage harvestSummary={harvestSummary} />
            </div>
            <div className="lg:col-span-2">
              <MandiPrices relevantMandiPrices={relevantMandiPrices} />
            </div>
          </div>
        )}
      </div>

      {/* Farm Profile Modal */}
      <FarmProfileModal
        farm={farm}
        isOpen={isFarmProfileOpen}
        onClose={() => setIsFarmProfileOpen(false)}
      />
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
} from 'lucide-react';
import {
  Badge,
  Button,
  ModuleLoadingState,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { FarmProfileModal } from '@/components/modules/control/FarmProfileModal';
import { TelemetryHUD } from '@/components/modules/control/TelemetryHUD';
import { ControlFilterBar } from '@/components/modules/control/ControlFilterBar';
import { CultivationCycles } from '@/components/modules/control/CultivationCycles';
import { MicroclimateObservation } from '@/components/modules/control/MicroclimateObservation';
import { ActivityTimeline } from '@/components/modules/control/ActivityTimeline';
import { RiskAlerts } from '@/components/modules/control/RiskAlerts';
import { UpcomingTasks } from '@/components/modules/control/UpcomingTasks';
import { ResourceInventory } from '@/components/modules/control/ResourceInventory';
import { HarvestStorage } from '@/components/modules/control/HarvestStorage';
import { MandiPrices } from '@/components/modules/control/MandiPrices';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState<'cycles' | 'weather' | 'soil' | 'tasks' | 'market'>('cycles');

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['controlOverview', selectedFarmId],
    queryFn: async () => {
      const res = await apiClient.getControlOverview(selectedFarmId);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return res;
    },
  });

  const filteredCycles = useMemo(() => {
    const cycles = data?.data?.activeCycles || [];
    return cycles.filter((c) => {
      if (activeFieldFilter && c.fieldId !== activeFieldFilter) return false;
      if (activeSeasonFilter && c.season !== activeSeasonFilter) return false;
      return true;
    });
  }, [data?.data?.activeCycles, activeFieldFilter, activeSeasonFilter]);

  if (isLoading) {
    return <ModuleLoadingState message="Connecting to farm IoT gateway, soil sensors & satellite feed..." />;
  }

  if (error || !data?.data) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-400">
          <Sprout className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[#F1F6F3]">
            No Farm Workspace Configured Yet
          </h2>
          <p className="text-xs text-[#8EA698] leading-relaxed max-w-md mx-auto">
            Welcome to NEXFIELD! You have not added a farm property yet. Launch our setup wizard, import telemetry records, or explore our pre-configured Nashik Tomato demonstration farm.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button className="w-full bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold text-xs gap-1.5 px-5">
              <span>Start Farm Setup Wizard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/data-center" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full text-xs text-[#E1ECE5] border-[#22352A] hover:bg-[#121B16]">
              Import Data (CSV/GeoJSON)
            </Button>
          </Link>
          <Link href="/demo/control" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full text-xs text-emerald-400 hover:bg-emerald-950/40">
              Explore Demo Farm →
            </Button>
          </Link>
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

  // Filter cycles (moved up)

  // Filter alerts
  const dismissedAlertsSet = new Set(dismissedAlertIds);
  const visibleAlerts = activeAlerts.filter((a) => !dismissedAlertsSet.has(a.id));

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

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
                Operational Farm Workspace
              </span>
              <span className="text-xs font-mono text-[#8FA396]">
                {farm.location.district}, {farm.location.state}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FAF8F2] tracking-tight">
                {farm.name}
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFarmProfileOpen(true)}
                className="h-7 text-xs px-2.5 text-[#99B2A4] hover:text-[#FAF8F2] border-[#253A2E] hover:bg-[#16241C]"
              >
                <Info className="h-3.5 w-3.5 mr-1.5 text-[#D7B678]" />
                Farm Profile
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-[#8DA295] flex flex-wrap items-center gap-2">
              <span>{farm.location.address}</span>
              <span className="text-[#516E5E]">·</span>
              <span>Total Area: <strong className="font-mono text-emerald-400 font-semibold">{farm.totalAreaHectares} ha</strong></span>
              <span className="text-[#516E5E]">·</span>
              <span>Coordinates: <strong className="font-mono text-[#D7B678]">{farm.location.latitude.toFixed(4)}°N, {farm.location.longitude.toFixed(4)}°E</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A100D] border border-[#1E2E25] text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#849F90]">
                Telemetry Synced: <strong className="text-emerald-300 font-medium">{lastRefreshedAt}</strong>
              </span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 text-xs gap-1.5 border border-[#253A2E] bg-[#142019] text-[#E1ECE5] hover:bg-[#1A2A21]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Link href="/twin">
              <Button variant="primary" size="sm" className="h-9 text-xs gap-1.5 bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 hover:bg-[#204E38]">
                <Layers className="h-3.5 w-3.5 text-[#D7B678]" />
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
            <h2 className="text-lg font-bold text-[#FAF8F2] tracking-tight">
              What Needs Attention Today
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A261F] text-[#D7B678] font-mono font-semibold border border-[#2A3E31]">
              {visibleAlerts.length} Active
            </span>
          </div>
          {visibleAlerts.length > 0 && (
            <p className="text-xs text-[#8DA295]">Prioritized by agronomic urgency</p>
          )}
        </div>

        {visibleAlerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0E1511] border border-[#1E2E25] text-sm text-[#8DA295]">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>All farm biological, hydrological, and storage parameters are within safe operational limits.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {visibleAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="relative flex flex-col justify-between p-4 rounded-2xl bg-[#0E1511] border border-[#2A1F1B] hover:border-amber-600/40 transition-colors group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-600/30">
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      {alert.severity.toUpperCase()}
                    </span>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-[#6B8576] hover:text-[#FAF8F2] p-1 rounded hover:bg-[#16241C]"
                      title="Dismiss alert"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-[#FAF8F2] line-clamp-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[#8DA295] line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1E2E25] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#516E5E]">Field Alert</span>
                  <Link
                    href="/fieldsight"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#D7B678] hover:text-[#FAF8F2]"
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
        <h2 className="text-lg font-bold text-[#FAF8F2] tracking-tight">
          Farm at a Glance
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-1">
            <span className="text-xs text-[#8DA295] font-medium flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-emerald-400" />
              Active Crops
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FAF8F2] pt-1">
              {activeCycles.length > 0 ? activeCycles[0].cropName : 'None Active'}
            </div>
            <p className="text-[11px] text-[#516E5E] font-mono">
              {activeCycles.length} active cycle{activeCycles.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-1">
            <span className="text-xs text-[#8DA295] font-medium flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              Soil Moisture
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FAF8F2] pt-1">
              {soilTelemetrySummary.avgMoisturePercent.toFixed(1)}%
            </div>
            <p className="text-[11px] text-[#516E5E] font-mono">
              Temp: {soilTelemetrySummary.avgTemperatureC.toFixed(1)}°C
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-1">
            <span className="text-xs text-[#8DA295] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#D7B678]" />
              Scheduled Tasks
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FAF8F2] pt-1">
              {recentTasks.length} Pending
            </div>
            <p className="text-[11px] text-[#516E5E] font-mono">
              {completedTaskIds.length} completed today
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] space-y-1">
            <span className="text-xs text-[#8DA295] font-medium flex items-center gap-1.5">
              <Warehouse className="h-3.5 w-3.5 text-amber-400" />
              Storage Stock
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#FAF8F2] pt-1">
              {harvestSummary.totalHarvestedKg.toLocaleString()} kg
            </div>
            <p className="text-[11px] text-[#516E5E] font-mono">
              {harvestSummary.batchesInStorage} batch{harvestSummary.batchesInStorage !== 1 ? 'es' : ''} stored
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          D. QUICK ACTIONS (4 CLEAN DESTINATIONS)
      ========================================================================== */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#FAF8F2] tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/fieldsight"
            className="group p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-600/40 hover:bg-[#121B16] transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/30 text-emerald-400 w-fit group-hover:scale-105 transition-transform">
              <ScanEye className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#FAF8F2] flex items-center justify-between">
                <span>AI Crop Health Scan</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#516E5E] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#8DA295] mt-1">Diagnose blight, pests & leaf deficiency with Grad-CAM</p>
            </div>
          </Link>

          <Link
            href="/twin"
            className="group p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-[#D7B678]/40 hover:bg-[#151D18] transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-[#163B2A] border border-[#D7B678]/30 text-[#D7B678] w-fit group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#FAF8F2] flex items-center justify-between">
                <span>Digital Twin 3D</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#516E5E] group-hover:text-[#D7B678] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#8DA295] mt-1">Simulate irrigation stress, canopy growth & harvest</p>
            </div>
          </Link>

          <Link
            href="/markets"
            className="group p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-emerald-600/40 hover:bg-[#121B16] transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-600/30 text-emerald-400 w-fit group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#FAF8F2] flex items-center justify-between">
                <span>Mandi Market Rates</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#516E5E] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#8DA295] mt-1">Wholesale APMC spot prices, net margins & logistics</p>
            </div>
          </Link>

          <Link
            href="/data-center"
            className="group p-4 sm:p-5 rounded-2xl bg-[#0E1511] border border-[#1E2E25] hover:border-amber-600/40 hover:bg-[#151D18] transition-all space-y-2"
          >
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/30 text-amber-400 w-fit group-hover:scale-105 transition-transform">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#FAF8F2] flex items-center justify-between">
                <span>Storage & Batches</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#516E5E] group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-[#8DA295] mt-1">Cold storage telemetry, shelf-life risk & stock logs</p>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          E. RECENT ACTIVITY & DETAILED TELEMETRY (PROGRESSIVE DISCLOSURE TABS)
      ========================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2E25] pb-3">
          <h2 className="text-lg font-bold text-[#FAF8F2] tracking-tight">
            Field Status & Agronomic Telemetry
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0A100D] border border-[#1E2E25]">
            <button
              onClick={() => setActiveTab('cycles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'cycles'
                  ? 'bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 shadow-sm'
                  : 'text-[#8DA295] hover:text-[#FAF8F2]'
              }`}
            >
              Crops & Cycles
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'weather'
                  ? 'bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 shadow-sm'
                  : 'text-[#8DA295] hover:text-[#FAF8F2]'
              }`}
            >
              Weather & Microclimate
            </button>
            <button
              onClick={() => setActiveTab('soil')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'soil'
                  ? 'bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 shadow-sm'
                  : 'text-[#8DA295] hover:text-[#FAF8F2]'
              }`}
            >
              Soil Sensors
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tasks'
                  ? 'bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 shadow-sm'
                  : 'text-[#8DA295] hover:text-[#FAF8F2]'
              }`}
            >
              Activity & Tasks
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'market'
                  ? 'bg-[#163B2A] text-[#FAF8F2] border border-[#D7B678]/40 shadow-sm'
                  : 'text-[#8DA295] hover:text-[#FAF8F2]'
              }`}
            >
              Storage & Markets
            </button>
          </div>
        </div>

        {activeTab === 'cycles' && (
          <div className="space-y-4">
            <ControlFilterBar
              activeFieldFilter={activeFieldFilter}
              setActiveFieldFilter={setActiveFieldFilter}
              activeSeasonFilter={activeSeasonFilter}
              setActiveSeasonFilter={setActiveSeasonFilter}
            />
            <CultivationCycles cycles={filteredCycles} />
          </div>
        )}

        {activeTab === 'weather' && (
          <MicroclimateObservation weatherSummary={weatherSummary} forecastDays={forecastDays} />
        )}

        {activeTab === 'soil' && (
          <TelemetryHUD soilTelemetrySummary={soilTelemetrySummary} />
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityTimeline activityTimeline={activityTimeline} />
            <UpcomingTasks
              recentTasks={recentTasks}
              completedTaskIds={completedTaskIds}
              toggleTaskCompletion={toggleTaskCompletion}
            />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

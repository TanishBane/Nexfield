'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sprout,
  ArrowRight,
  RefreshCw,
  Info,
  Layers,
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

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['controlOverview', selectedFarmId],
    queryFn: async () => {
      const res = await apiClient.getControlOverview(selectedFarmId);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return res;
    },
  });

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

  // Filter cycles
  const filteredCycles = activeCycles.filter((c) => {
    if (activeFieldFilter && c.fieldId !== activeFieldFilter) return false;
    if (activeSeasonFilter && c.season !== activeSeasonFilter) return false;
    return true;
  });

  // Filter alerts
  const dismissedAlertsSet = new Set(dismissedAlertIds);
  const visibleAlerts = activeAlerts.filter((a) => !dismissedAlertsSet.has(a.id));

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Farm Title & Global Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              {farm.name}
            </h1>
            <Badge variant="success" size="sm">
              Operational
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFarmProfileOpen(true)}
              className="h-6 text-[11px] px-2 text-[#99B2A4] hover:text-[#F1F6F3]"
            >
              <Info className="h-3 w-3 mr-1 text-emerald-400" />
              Holding Profile
            </Button>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            {farm.location.address}, {farm.location.district}, {farm.location.state} • Total Area:{' '}
            <span className="font-mono text-emerald-400 font-semibold">
              {farm.totalAreaHectares} ha
            </span>
          </p>
        </div>

        {/* Global Controls: Data Freshness, Refresh, Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Data Provenance & Freshness Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#849F90]">
              Source: <strong className="text-emerald-300 font-medium">Synthetic Baseline Fixtures</strong>
            </span>
            <span className="text-[#516E5E]">• Refreshed {lastRefreshedAt}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-xs gap-1.5"
            title="Poll farm telemetry"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/twin">
            <Button variant="primary" size="sm" className="h-8 text-xs gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Launch Digital Twin
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Agronomic Telemetry HUD */}
      <TelemetryHUD soilTelemetrySummary={soilTelemetrySummary} />

      {/* Filter Bar */}
      <ControlFilterBar
        activeFieldFilter={activeFieldFilter}
        setActiveFieldFilter={setActiveFieldFilter}
        activeSeasonFilter={activeSeasonFilter}
        setActiveSeasonFilter={setActiveSeasonFilter}
      />

      {/* Main Grid: Cultivation Cycles & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Phenological Growth & Microclimate Forecast */}
        <div className="lg:col-span-2 space-y-6">
          <CultivationCycles cycles={filteredCycles} />
          <MicroclimateObservation weatherSummary={weatherSummary} forecastDays={forecastDays} />
          <ActivityTimeline activityTimeline={activityTimeline} />
        </div>

        {/* Right Column (1 Col): Alerts, Tasks, Inventory, Harvest & Mandi */}
        <div className="space-y-6">
          <RiskAlerts visibleAlerts={visibleAlerts} dismissAlert={dismissAlert} />
          <UpcomingTasks
            recentTasks={recentTasks}
            completedTaskIds={completedTaskIds}
            toggleTaskCompletion={toggleTaskCompletion}
          />
          <ResourceInventory inventorySummary={inventorySummary} />
          <HarvestStorage harvestSummary={harvestSummary} />
          <MandiPrices relevantMandiPrices={relevantMandiPrices} />
        </div>
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

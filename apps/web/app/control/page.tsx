'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  RefreshCw,
  Info,
  Layers,
  Boxes,
  Archive,
  TrendingUp,
  X,
  Filter,
  CheckCircle,
  Truck,
  Sun,
  CloudRain,
  Wind,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatCard,
  Badge,
  Button,
  ModuleLoadingState,
  ErrorDisplay,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { FarmProfileModal } from '@/components/modules/control/FarmProfileModal';
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
      <ErrorDisplay
        title="Failed to load Farm Command Center"
        message="Could not retrieve farm telemetry. Verify your local backend or fixture configuration."
        onRetry={() => refetch()}
      />
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
  const visibleAlerts = activeAlerts.filter((a) => !dismissedAlertIds.includes(a.id));

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

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0C120F] border border-[#1E2E25] text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-[#CADCD1]">Filter Telemetry:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Field Filter */}
          <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2 py-1">
            <span className="text-[#749081]">Parcel:</span>
            <select
              value={activeFieldFilter || 'all'}
              onChange={(e) => setActiveFieldFilter(e.target.value === 'all' ? null : e.target.value)}
              className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#121B16] text-[#E1ECE5]">All Parcels (2)</option>
              <option value="d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c" className="bg-[#121B16] text-[#E1ECE5]">
                North Sector Alpha (FLD-N01)
              </option>
              <option value="b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e" className="bg-[#121B16] text-[#E1ECE5]">
                East Terraced Basin (FLD-E04)
              </option>
            </select>
          </div>

          {/* Season Filter */}
          <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2 py-1">
            <span className="text-[#749081]">Season:</span>
            <select
              value={activeSeasonFilter || 'all'}
              onChange={(e) => setActiveSeasonFilter(e.target.value === 'all' ? null : e.target.value)}
              className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#121B16] text-[#E1ECE5]">All Seasons</option>
              <option value="rabi" className="bg-[#121B16] text-[#E1ECE5]">Rabi (Current)</option>
              <option value="kharif" className="bg-[#121B16] text-[#E1ECE5]">Kharif (Stored)</option>
            </select>
          </div>

          {(activeFieldFilter || activeSeasonFilter) ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFieldFilter(null);
                setActiveSeasonFilter(null);
              }}
              className="h-7 text-[11px] text-[#A6C0B2]"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      </div>

      {/* Main Grid: Cultivation Cycles & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Phenological Growth & Microclimate Forecast */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Cultivation Cycles */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Field & Crop-Cycle Overview</CardTitle>
                  <CardDescription>
                    Real-time growth phenology, health index, and sowing-to-harvest milestones.
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm">
                  {filteredCycles.length} Displayed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredCycles.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7B9586]">
                  No crop cycles match the selected filter.
                </div>
              ) : (
                filteredCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="rounded-lg bg-[#0E1512] border border-[#1E2E25] p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-semibold text-sm text-[#F1F6F3] flex items-center gap-2">
                          {cycle.cropName} —{' '}
                          <span className="text-emerald-400 font-normal">{cycle.variety}</span>
                        </h4>
                        <p className="text-xs text-[#8BA093] mt-0.5">
                          Sown: {cycle.sowingDate} • Target Harvest: {cycle.expectedHarvestDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 font-semibold tabular-nums">
                          Health Score: {cycle.healthIndexScore}/100
                        </span>
                        <Badge variant="outline" size="sm">
                          {cycle.season.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[#A2B6AA] capitalize flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-400" />
                          Stage: {cycle.currentGrowthStage.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-[#D7E4DC] tabular-nums">
                          {cycle.stageProgressPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#18251F] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${cycle.stageProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-[#7A9385]">
                      <span>Target Yield: {cycle.targetYieldMetricTons} MT</span>
                      <Link
                        href="/twin"
                        className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                      >
                        Run Digital Twin <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* 5-Day Agronomic Weather Observation & Forecast */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  5-Day Microclimate Observation & Agro-Forecast
                </CardTitle>
                <span className="text-xs font-mono text-[#87A293]">
                  Reference ETo: {weatherSummary.referenceEToMmPerDay || 4.2} mm/day
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-[#0F1613] border border-[#1E2E25] p-3 text-xs md:text-sm text-[#A0B5A8] leading-relaxed">
                <span className="font-semibold text-emerald-400">Microclimate Advisory:</span>{' '}
                {weatherSummary.forecastText}
              </div>

              {/* Forecast Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {forecastDays.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-[#0E1511] border border-[#1E2E25] p-2.5 text-xs text-center space-y-1 font-mono"
                  >
                    <span className="text-[#8BA295] text-[11px] block font-sans font-semibold">
                      {f.day}
                    </span>
                    <span className="text-[#F1F6F3] font-bold text-sm block">
                      {f.tempMaxC}° / {f.tempMinC}°
                    </span>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-sky-400">
                      <CloudRain className="h-3 w-3" />
                      <span>{f.rainProbPercent}%</span>
                    </div>
                    <span className="text-[10px] text-[#698476] block truncate">
                      ETo: {f.etoMm}mm
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Farm Activity Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Farm Activity Timeline
              </CardTitle>
              <CardDescription>
                Auditable log of field machinery passes, agronomic spraying, and sampling events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityTimeline.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 pb-3 border-l-2 border-[#1E2E25] last:pb-0 text-xs space-y-1"
                >
                  <div className="absolute -left-[7px] top-0 h-3 w-3 rounded-full bg-emerald-500/80 border-2 border-[#0A0F0D]" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#F1F6F3]">{item.title}</span>
                    <span className="text-[#647C6E] font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#8FA597]">{item.description}</p>
                  <div className="text-[10px] text-[#637C6F] font-mono flex items-center gap-3">
                    {item.fieldName ? <span>Parcel: {item.fieldName}</span> : null}
                    {item.operatorName ? <span>Operator: {item.operatorName}</span> : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Alerts, Tasks, Inventory, Harvest & Mandi */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <Card className="border-[#2E3F34]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Agronomic Risk Alerts
                </CardTitle>
                <Badge variant="warning" size="sm">
                  {visibleAlerts.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {visibleAlerts.length === 0 ? (
                <div className="p-4 rounded-lg bg-[#0E1511] text-center text-xs text-[#7B9586]">
                  No active risk alerts at this holding.
                </div>
              ) : (
                visibleAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-lg bg-[#141B17] border border-[#23352A] p-3 text-xs space-y-2 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#F1F6F3] pr-4">{alert.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-5 w-5 text-[#637C6E] hover:text-[#E2ECE5] absolute top-2.5 right-2.5"
                        title="Dismiss alert"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-[#8FA597] leading-relaxed">{alert.message}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#637C6F] font-mono">
                        {alert.fieldName || 'Global Holding'}
                      </span>
                      <Link
                        href={alert.severity === 'warning' ? '/fieldsight' : '/markets'}
                        className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px]"
                      >
                        Investigate <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Field Dispatch Tasks with completion toggle */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  Upcoming Tasks
                </CardTitle>
                <Link href="/ops" className="text-xs text-emerald-400 hover:underline">
                  All Ops
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {recentTasks.slice(0, 3).map((task) => {
                const isCompleted = completedTaskIds.includes(task.id) || task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex items-start gap-2.5 rounded-lg bg-[#0E1511] border border-[#1E2E25] p-2.5 text-xs cursor-pointer hover:border-[#273B2F] transition-colors"
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-emerald-400"
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-[#486354]" />
                      )}
                    </button>
                    <div className="flex-1 overflow-hidden">
                      <p
                        className={`font-medium truncate ${
                          isCompleted ? 'line-through text-[#637C6F]' : 'text-[#E3ECE6]'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-[#789182] mt-0.5">
                        <span>Due: {task.dueDate}</span>
                        <span className="capitalize text-amber-300 font-mono">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Resource Inventory Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-emerald-400" />
                  Resource Inventory Stocks
                </CardTitle>
                <Link href="/ops" className="text-xs text-emerald-400 hover:underline">
                  Full Ledger
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Seed Foundation:</span>
                <span className="text-[#F1F6F3] font-bold">{inventorySummary.seedStockKg} kg</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Fertilizer Bags:</span>
                <span className="text-[#F1F6F3] font-bold">{inventorySummary.fertilizerStockBags} bags</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Diesel Reserve:</span>
                <span className="text-[#F1F6F3] font-bold">{inventorySummary.dieselLiters} L</span>
              </div>
              {inventorySummary.lowStockAlerts.length > 0 ? (
                <div className="p-2 rounded bg-amber-950/40 border border-amber-900/40 text-amber-300 text-[11px]">
                  ⚠️ {inventorySummary.lowStockAlerts[0]}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Harvest & Storage Silo Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Archive className="h-4 w-4 text-emerald-400" />
                Harvest Batch Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Total Siled Mass:</span>
                <span className="text-emerald-400 font-bold">
                  {(harvestSummary.totalHarvestedKg / 1000).toFixed(1)} MT
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Quality Grade:</span>
                <span className="text-[#F1F6F3]">{harvestSummary.primaryGrade.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <span className="text-[#8EA295]">Moisture Level:</span>
                <span className="text-sky-300">{harvestSummary.avgMoisturePercent}% (Safe)</span>
              </div>
            </CardContent>
          </Card>

          {/* Mandi Prices Summary for Farm Crops */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Mandi Benchmark Rates
                </CardTitle>
                <Link href="/markets" className="text-xs text-emerald-400 hover:underline">
                  Arbitrage
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {relevantMandiPrices.map((mp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-[#0E1511] border border-[#1E2E25] font-mono"
                >
                  <div>
                    <span className="text-[#E1ECE5] font-semibold block">{mp.commodity}</span>
                    <span className="text-[11px] text-[#718A7D]">{mp.marketName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">₹{mp.modalPricePerQuintalInr}/q</span>
                    <span className="text-[10px] text-emerald-500 block">+{mp.dailyChangeInr} ₹/q</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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

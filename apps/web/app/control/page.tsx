'use client';

import React from 'react';
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
import Link from 'next/link';

export default function ControlPage() {
  const { selectedFarmId } = useFarmStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['controlOverview', selectedFarmId],
    queryFn: () => apiClient.getControlOverview(selectedFarmId),
  });

  if (isLoading) {
    return <ModuleLoadingState message="Connecting to farm IoT gateway & satellite feed..." />;
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
  const { farm, weatherSummary, soilTelemetrySummary, activeAlerts, activeCycles, recentTasks } =
    overview;

  return (
    <div className="space-y-6">
      {/* Top Banner / Farm Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              {farm.name}
            </h1>
            <Badge variant="success" size="sm">
              Operational
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            {farm.location.address}, {farm.location.district}, {farm.location.state} —{' '}
            <span className="font-mono text-emerald-400 font-medium">
              {farm.totalAreaHectares} ha
            </span>{' '}
            total area under cultivation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/fieldsight">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-400" />
              Diagnose Crop
            </Button>
          </Link>
          <Link href="/twin">
            <Button variant="primary" size="sm" className="gap-1.5">
              Run Scenario
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Agronomic Telemetry HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Soil Moisture Index"
          value={soilTelemetrySummary.avgMoisturePercent.toFixed(1)}
          unit="%"
          subValue="Optimal Range (35-50%)"
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
          label="Rootzone Soil pH"
          value={soilTelemetrySummary.avgPh.toFixed(2)}
          unit="pH"
          subValue="Neutral Alluvial Profile"
          trend="neutral"
          trendValue="Stable"
          icon={<Thermometer className="h-4 w-4" />}
          variant="default"
        />

        <StatCard
          label="Projected Yield"
          value="48.0"
          unit="MT"
          subValue="Target: 5.71 MT/ha (Rabi)"
          trend="up"
          trendValue="+14.2% Delta"
          icon={<Sprout className="h-4 w-4" />}
          variant="amber"
        />
      </div>

      {/* Main Grid: Phenology & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Phenological Growth Tracking & Active Cycles */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Cultivation Cycles</CardTitle>
                  <CardDescription>
                    Real-time phenological growth stages and biomass progression
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm">
                  {activeCycles.length} Parcels Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {activeCycles.map((cycle) => (
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

                  {/* Growth Stage Progress Bar */}
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
                    <span>Target: {cycle.targetYieldMetricTons} MT</span>
                    <Link
                      href="/twin"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                    >
                      Simulate Interventions <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Microclimate Advisory */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-400" />
                Agronomic Weather Intelligence & Microclimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#0F1613] border border-[#1E2E25] p-3 text-xs md:text-sm text-[#A0B5A8] leading-relaxed">
                <span className="font-semibold text-emerald-400">48-Hour Microclimate Advisory:</span>{' '}
                {weatherSummary.forecastText}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-[#BACCC1]">
                  <div className="p-2 rounded bg-[#131D17]">
                    <span className="text-[#728B7E] block text-[10px]">CONDITION</span>
                    {weatherSummary.condition}
                  </div>
                  <div className="p-2 rounded bg-[#131D17]">
                    <span className="text-[#728B7E] block text-[10px]">WIND SPEED</span>
                    {weatherSummary.windSpeedKmh} km/h
                  </div>
                  <div className="p-2 rounded bg-[#131D17]">
                    <span className="text-[#728B7E] block text-[10px]">HUMIDITY</span>
                    {weatherSummary.humidityPercent}%
                  </div>
                  <div className="p-2 rounded bg-[#131D17]">
                    <span className="text-[#728B7E] block text-[10px]">RAIN RISK</span>
                    {weatherSummary.rainProbabilityPercent}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Agronomic Risk Alerts & Urgent Tasks */}
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
                  {activeAlerts.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg bg-[#141B17] border border-[#23352A] p-3 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-[#F1F6F3]">{alert.title}</span>
                    <Badge
                      variant={
                        alert.severity === 'critical'
                          ? 'destructive'
                          : alert.severity === 'warning'
                          ? 'warning'
                          : 'default'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-[#8FA597] leading-relaxed">{alert.message}</p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-[#637C6F] font-mono">
                      {alert.fieldName || 'Global Farm'}
                    </span>
                    <Link
                      href={alert.severity === 'warning' ? '/fieldsight' : '/markets'}
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px]"
                    >
                      Resolve <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Operations Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  Field Dispatch
                </CardTitle>
                <Link href="/ops" className="text-xs text-emerald-400 hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {recentTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 rounded-lg bg-[#0E1512] border border-[#1E2E25] p-2.5 text-xs"
                >
                  <CheckCircle2
                    className={
                      task.status === 'completed'
                        ? 'h-4 w-4 text-emerald-400 mt-0.5 shrink-0'
                        : 'h-4 w-4 text-[#597264] mt-0.5 shrink-0'
                    }
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-[#E3ECE6] truncate">{task.title}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#789182] mt-0.5">
                      <span>Due: {task.dueDate}</span>
                      <span className="capitalize">{task.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

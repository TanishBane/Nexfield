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
  RefreshCw,
  Info,
  Layers,
  Boxes,
  Archive,
  TrendingUp,
  X,
  CheckCircle,
  Truck,
  Sun,
  CloudRain,
  Wind,
  Power,
  Sparkles,
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
  StatusIndicator,
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
    resetDemo,
  } = useDemoStore();

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const alerts = [
    {
      id: 'al-1',
      severity: 'warning' as const,
      title: 'Vadose Zone Infiltration Window',
      message:
        'Soil moisture at 41.4%. Drip fertigation with 13-0-45 recommended within 18 hours to sustain fruit enlargement.',
      timestamp: '25 min ago',
    },
    {
      id: 'al-2',
      severity: 'info' as const,
      title: 'Mandi Arbitrage Opportunity Detected',
      message:
        'Nashik APMC modal price for Tomato surged to ₹2,450/qtl (+₹210 vs Pimpalgaon gate). Consider scheduling harvest lot tomorrow.',
      timestamp: '1 hour ago',
    },
  ];

  const dismissedAlertsSet = new Set(dismissedAlerts);
  const visibleAlerts = alerts.filter((a) => !dismissedAlertsSet.has(a.id));

  return (
    <div className="space-y-6">
      {/* 1. Header & Farm Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1A261F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F6F3]">
              {farmName}
            </h1>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-[10px]">
              Active Demo
            </Badge>
          </div>
          <p className="text-xs text-[#7B9587] mt-0.5 flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span>{location} · {areaHectares} ha · {cropName} ({cropVariety})</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDripIrrigation}
            className={`text-xs gap-1.5 transition-all ${
              dripIrrigationActive
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'text-[#8EA698] border-[#22352A] hover:bg-[#121B16]'
            }`}
          >
            <Power className={`h-3.5 w-3.5 ${dripIrrigationActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
            <span>{dripIrrigationActive ? 'Drip Active (Running)' : 'Start Drip Irrigation'}</span>
          </Button>

          <Link href="/demo/twin">
            <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:bg-cyan-950/40 gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>3D Twin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary KPI Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Root Zone Moisture"
          value={`${soilMoisture}%`}
          trendValue={dripIrrigationActive ? '+4.5% / hr' : '-0.2% / hr'}
          trend={dripIrrigationActive ? 'up' : 'neutral'}
          subValue={dripIrrigationActive ? 'Drip Emitters Active' : 'Optimal Field Capacity'}
          icon={<Droplets className="h-4 w-4 text-sky-400" />}
          variant="sky"
        />

        <StatCard
          label="Canopy NDVI Index"
          value={canopyNdvi.toString()}
          trendValue="+0.04"
          trend="up"
          subValue="Healthy Vegetative Vigour"
          icon={<Sprout className="h-4 w-4 text-emerald-400" />}
          variant="emerald"
        />

        <StatCard
          label="Microclimate Temp"
          value={`${ambientTemperature}°C`}
          trendValue={`${ambientHumidity}% RH`}
          trend="neutral"
          subValue={`Solar: ${solarRadiationWm2} W/m²`}
          icon={<Thermometer className="h-4 w-4 text-amber-400" />}
          variant="amber"
        />

        <StatCard
          label="Crop Stress Index"
          value={`${biomassStressPercent}%`}
          trendValue={biomassStressPercent > 10 ? 'Elevated' : 'Nominal'}
          trend={biomassStressPercent > 10 ? 'down' : 'up'}
          subValue="Biophysical Vadose Model"
          icon={<Activity className="h-4 w-4 text-purple-400" />}
        />
      </div>

      {/* 3. Active Agronomic Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                alert.severity === 'warning'
                  ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    alert.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                />
                <div>
                  <div className="text-xs font-bold">{alert.title}</div>
                  <div className="text-xs text-[#BDD1C6] mt-0.5 leading-relaxed">
                    {alert.message}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissedAlerts((prev) => [...prev, alert.id])}
                className="text-[#7B9587] hover:text-[#F1F6F3] p-1"
                aria-label="Dismiss Alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Crop Growth & Soil Chemistry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Stage Progress */}
        <Card className="border-[#1E2E25] bg-[#0E1511] lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                  Tomato Phenological Cycle
                </CardTitle>
                <CardDescription className="text-xs text-[#7B9587]">
                  {cropVariety} · Sown {sowingDaysAgo} days ago (Target Cycle: 95 days)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                Day {sowingDaysAgo} / 95
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8EA698]">{growthStage}</span>
                <span className="text-emerald-400 font-bold">51% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#16231C] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '51%' }} />
              </div>
            </div>

            {/* Phenological Timeline Stages */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-[#090F0C] border border-[#19261E] text-emerald-400">
                <div className="text-[9px] text-[#63796E]">STAGE 1</div>
                <div className="font-semibold">Transplant</div>
                <div className="text-[9px] text-[#556D60]">Days 0-15 ✓</div>
              </div>
              <div className="p-2 rounded-lg bg-[#090F0C] border border-[#19261E] text-emerald-400">
                <div className="text-[9px] text-[#63796E]">STAGE 2</div>
                <div className="font-semibold">Vegetative</div>
                <div className="text-[9px] text-[#556D60]">Days 16-35 ✓</div>
              </div>
              <div className="p-2 rounded-lg bg-[#14231A] border border-emerald-600/40 text-emerald-300 ring-1 ring-emerald-500/30">
                <div className="text-[9px] text-emerald-400">CURRENT</div>
                <div className="font-bold">Flowering</div>
                <div className="text-[9px] text-emerald-400/80">Days 36-60</div>
              </div>
              <div className="p-2 rounded-lg bg-[#090F0C] border border-[#19261E] text-[#63796E]">
                <div className="text-[9px] text-[#556D60]">STAGE 4</div>
                <div className="font-semibold">Fruit / Harvest</div>
                <div className="text-[9px] text-[#556D60]">Days 61-95</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Chemistry Profile */}
        <Card className="border-[#1E2E25] bg-[#0E1511]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#F1F6F3]">
              Soil Chemical Strata
            </CardTitle>
            <CardDescription className="text-xs text-[#7B9587]">
              NPK Macro-Nutrients & pH (0-30cm Depth)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
              <span className="text-[#8EA698]">Soil Reaction (pH)</span>
              <span className="text-purple-400 font-bold">{soilPh} pH (Neutral)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
              <span className="text-[#8EA698]">Available Nitrogen (N)</span>
              <span className="text-emerald-400 font-bold">{nitrogenPpm} ppm (Adequate)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
              <span className="text-[#8EA698]">Phosphorus (P₂O₅)</span>
              <span className="text-sky-400 font-bold">{phosphorusPpm} ppm (Target 40)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#080D0A] border border-[#18261E]">
              <span className="text-[#8EA698]">Potassium (K₂O)</span>
              <span className="text-amber-400 font-bold">{potassiumPpm} ppm (High)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Tasks & Operations Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demonstration Task Checklist */}
        <Card className="border-[#1E2E25] bg-[#0E1511]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                Agronomic Tasks
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Click task checkbox to test operational dispatch
              </CardDescription>
            </div>
            <Link href="/demo/ops" className="text-xs text-emerald-400 hover:underline">
              View Full Ops →
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => completeTask(task.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  task.status === 'completed'
                    ? 'bg-[#090F0C] border-[#18261E] opacity-60'
                    : 'bg-[#0D1612] border-[#22352B] hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-[#3D5C4A]'
                    }`}
                  >
                    {task.status === 'completed' && <CheckCircle className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-medium ${
                        task.status === 'completed'
                          ? 'line-through text-[#63796E]'
                          : 'text-[#E1ECE5]'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[10px] text-[#7B9587] font-mono mt-0.5">
                      {task.category} · Due: {task.dueDate} · Est: ₹{task.costInr}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[9px] font-mono uppercase ${
                    task.priority === 'urgent'
                      ? 'border-rose-700/60 text-rose-400'
                      : task.priority === 'high'
                      ? 'border-amber-700/60 text-amber-400'
                      : 'border-emerald-700/60 text-emerald-400'
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Mandi Benchmark */}
        <Card className="border-[#1E2E25] bg-[#0E1511]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-[#F1F6F3]">
                Agmarknet Mandi Spreads (Tomato)
              </CardTitle>
              <CardDescription className="text-xs text-[#7B9587]">
                Live benchmark for Nashik district wholesale markets
              </CardDescription>
            </div>
            <Link href="/demo/markets" className="text-xs text-emerald-400 hover:underline">
              Compare Mandis →
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] flex items-center justify-between">
              <div>
                <div className="text-[#F1F6F3] font-sans font-semibold">Nashik APMC Mandi</div>
                <div className="text-[10px] text-[#7B9587]">Arrivals: 420 Quintals · Quality: Grade A</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-emerald-400">₹2,450 / qtl</div>
                <div className="text-[10px] text-emerald-300 font-sans">+8.4% Spatial Spread</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] flex items-center justify-between">
              <div>
                <div className="text-[#F1F6F3] font-sans font-semibold">Pimpalgaon APMC</div>
                <div className="text-[10px] text-[#7B9587]">Arrivals: 680 Quintals · Quality: Standard</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-[#C9D6CE]">₹2,240 / qtl</div>
                <div className="text-[10px] text-[#7B9587] font-sans">Local Baseline</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#080D0A] border border-[#18261E] flex items-center justify-between">
              <div>
                <div className="text-[#F1F6F3] font-sans font-semibold">Lasalgaon APMC</div>
                <div className="text-[10px] text-[#7B9587]">Arrivals: 310 Quintals · Quality: Mixed</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-[#C9D6CE]">₹2,180 / qtl</div>
                <div className="text-[10px] text-rose-400 font-sans">-2.7% Spread</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

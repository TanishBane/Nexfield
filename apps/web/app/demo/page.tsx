'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Compass,
  Play,
  Layers,
  ScanEye,
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  CheckCircle2,
  MapPin,
  Calendar,
  Sprout,
  AlertCircle,
  Archive,
  Thermometer,
} from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { Button, Badge } from '@nexfield/ui';

interface TourStep {
  num: string;
  title: string;
  target: string;
  description: string;
  badge: string;
  metric: string;
  keyAction: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    num: '01',
    title: 'Meet the Farm',
    target: '/demo/control',
    description:
      'Nashik Tomato Precision Estate: 2.4 hectares in Dindori Block, Maharashtra. Sown 48 days ago (early flowering BBCH 65 stage) in silt loam soil.',
    badge: 'Command Center',
    metric: '2.4 ha · Silt Loam',
    keyAction: 'Inspect 3 priority recommendations and 4 farm-at-a-glance indicators.',
  },
  {
    num: '02',
    title: 'Observe Root-Zone Soil & Climate',
    target: '/demo/control',
    description:
      'Inspect stratified rootzone soil moisture (41.4% VWC), atmospheric Vapor Pressure Deficit (1.42 kPa), and solar radiation microclimate stations.',
    badge: 'Telemetry HUD',
    metric: '41.4% VWC · 27.8°C',
    keyAction: 'Review live crop phenology and NPK chemical profile drawer.',
  },
  {
    num: '03',
    title: 'Inspect Crop Foliage with AI',
    target: '/demo/fieldsight',
    description:
      'Run 5.13 ms foliar computer vision on tomato foliage, detecting Early Blight (Alternaria solani) with spatial Grad-CAM activation heatmap blending.',
    badge: 'FieldSight AI',
    metric: '94.6% Conf · 5.13 ms',
    keyAction: 'Adjust Grad-CAM slider and review ICAR-certified treatment protocols.',
  },
  {
    num: '04',
    title: 'Simulate Biophysical Hydrology in 3D',
    target: '/demo/twin',
    description:
      'Orbit the field parcel in 3D, inspect subterranean soil moisture gradients, and compare precision irrigation scenarios saving 38,400 L water.',
    badge: 'Digital Twin 3D',
    metric: 'FAO-56 Dual Kc',
    keyAction: 'Toggle Simple vs. Advanced mode and inspect the 40% water savings card.',
  },
  {
    num: '05',
    title: 'Dispatch Field Work Order',
    target: '/demo/ops',
    description:
      'Convert diagnostic advice directly into field work orders, assign field operators, and schedule precise chemical/fertilizer dosages.',
    badge: 'Operations Ledger',
    metric: 'Closed-Loop ERP',
    keyAction: 'Complete a work order and observe automatic warehouse stock deductions.',
  },
  {
    num: '06',
    title: 'Inspect Food Storage Quality & Silos',
    target: '/demo/ops',
    description:
      'Inspect grain silo moisture (<14%) and cold storage temperatures (>10°C) to eliminate Aspergillus aflatoxin risk and chilling injury.',
    badge: 'Food Quality Guard',
    metric: '0.0% Aflatoxin Risk',
    keyAction: 'Review Equilibrium Moisture Content (EMC) and ethylene scrubber readings.',
  },
  {
    num: '07',
    title: 'Compare APMC Mandi Net Returns',
    target: '/demo/markets',
    description:
      'Analyze wholesale mandi rates between Nashik APMC, Pimpalgaon, and Vashi Mumbai. Deduct road freight diesel costs to calculate real net in hand.',
    badge: 'Mandi Arbitrage',
    metric: '+₹297/q Net Spread',
    keyAction: 'Adjust consignment volume slider to see total arbitrage earnings.',
  },
];

export default function DemoGuidedLandingPage() {
  const router = useRouter();
  const demoStore = useDemoStore();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const activeStep = TOUR_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14231A] border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>ADAPPT 5.0 Jury & Evaluator Walkthrough</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif tracking-tight">
          The Guided Demo Journey
        </h1>
        <p className="text-base sm:text-lg text-[#8EA698] leading-relaxed">
          Experience NEXFIELD&apos;s complete closed-loop agricultural intelligence workflow on our verified baseline:{' '}
          <strong className="text-[#FAF8F2]">Nashik Tomato Precision Estate</strong> in Maharashtra.
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B120E] border border-[#1E2E25] text-xs text-[#7B9587]">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Development Mode: Synthetic Agronomic Baseline · No Login or Sensor Setup Required</span>
        </div>
      </div>

      {/* Interactive Guided Step Spotlight Card */}
      <div className="rounded-3xl bg-[#0E1511] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2E25]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/30">
              STEP {activeStep.num} OF 07
            </span>
            <Badge variant="outline" className="text-[#FAF8F2] border-[#273C30] text-xs">
              {activeStep.badge}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-xl border border-[#273C30] text-[#8EA698] hover:text-[#FAF8F2] hover:bg-[#16201B] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Previous Step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#63796E] px-2">
              {currentStepIdx + 1} / {TOUR_STEPS.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIdx === TOUR_STEPS.length - 1}
              className="p-2 rounded-xl border border-[#273C30] text-[#8EA698] hover:text-[#FAF8F2] hover:bg-[#16201B] disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Next Step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FAF8F2] font-serif">
              {activeStep.title}
            </h2>
            <p className="text-sm text-[#A2B8AC] leading-relaxed">
              {activeStep.description}
            </p>
            <div className="p-3 rounded-xl bg-[#080D0A] border border-[#1A261F] text-xs text-[#8EA698] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Action:</strong> {activeStep.keyAction}
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3 justify-center">
            <div className="p-4 rounded-2xl bg-[#080D0A] border border-[#1A261F] text-center">
              <span className="text-xs text-[#63796E] font-mono block">BENCHMARK METRIC</span>
              <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">
                {activeStep.metric}
              </span>
            </div>

            <Link
              href={activeStep.target}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 text-[#070B09] hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Launch {activeStep.badge}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.num}
              type="button"
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-2 rounded-full transition-all ${
                currentStepIdx === idx
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-[#203227] hover:bg-[#344E3F]'
              }`}
              title={`Jump to Step ${step.num}: ${step.title}`}
            />
          ))}
        </div>
      </div>

      {/* Complete 7-Step Tour Roadmap Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#FAF8F2] font-serif">Curated 7-Step Journey Roadmap</h3>
          <span className="text-xs text-[#63796E] font-mono">Estimated time: 4 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOUR_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={step.num}
                onClick={() => setCurrentStepIdx(idx)}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#121E17] border-emerald-500/70 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/20'
                    : 'bg-[#0E1511] border-[#1E2E25] hover:border-[#2D4536] hover:bg-[#111A15]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20">
                      Step {step.num}
                    </span>
                    <span className="text-[11px] font-mono text-[#8EA698] px-2 py-0.5 rounded bg-[#16201B]">
                      {step.metric}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#FAF8F2] font-serif">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#8DA396] leading-relaxed line-clamp-3">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1F2E25] flex items-center justify-between">
                  <span className="text-[11px] text-[#63796E] font-medium">{step.badge}</span>
                  <Link
                    href={step.target}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Farm Profile & Reset Card */}
      <div className="rounded-2xl bg-[#0B120E] border border-[#1E2E25] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono text-emerald-400 uppercase">Verified Evaluation Baseline</span>
          <div className="text-base font-bold text-[#FAF8F2]">{demoStore.farmName}</div>
          <div className="text-xs text-[#7B9587]">
            2.4 ha Silt Loam · Sown 48 days ago · Flowering BBCH 65 stage
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => demoStore.resetDemo()}
            className="text-xs gap-1.5 text-[#8EA698] border-[#22352A] hover:bg-[#121B16] hover:text-[#FAF8F2]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </Button>
          <Link
            href="/demo/control"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-[#070B09] hover:bg-emerald-400 transition-all"
          >
            <span>Enter Farm Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

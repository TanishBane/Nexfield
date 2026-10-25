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
  ExternalLink,
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
  previewDetails: {
    label: string;
    value: string;
    highlight: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    num: '01',
    title: 'Meet the Farm',
    target: '/control',
    description:
      'Nashik Tomato Precision Estate: 2.4 hectares in Dindori Block, Maharashtra. Sown 48 days ago (early flowering BBCH 65 stage) in silt loam soil.',
    badge: 'NEXFIELD Control',
    metric: '2.4 ha · Silt Loam',
    keyAction: 'Inspect 3 priority recommendations and 4 farm-at-a-glance indicators.',
    previewDetails: {
      label: 'Target Estate',
      value: 'Nashik Tomato Precision Estate (2.4 ha)',
      highlight: 'Maharashtra (20.0059° N, 73.7901° E)',
    },
  },
  {
    num: '02',
    title: 'Observe Root-Zone Soil & Climate',
    target: '/control',
    description:
      'Inspect stratified rootzone soil moisture (41.4% VWC), atmospheric Vapor Pressure Deficit (1.42 kPa), and solar radiation microclimate stations.',
    badge: 'Telemetry HUD',
    metric: '41.4% VWC · 27.8°C',
    keyAction: 'Review live crop phenology and NPK chemical profile drawer.',
    previewDetails: {
      label: 'Hydrology Sensor',
      value: '41.4% Volumetric Water Content',
      highlight: 'Optimal Rootzone Transpiration Active',
    },
  },
  {
    num: '03',
    title: 'Inspect Crop Foliage with AI',
    target: '/fieldsight',
    description:
      'Run 5.13 ms foliar computer vision on tomato foliage, detecting Early Blight (Alternaria solani) with spatial Grad-CAM activation heatmap blending.',
    badge: 'FieldSight AI',
    metric: '94.6% Conf · 5.13 ms',
    keyAction: 'Adjust Grad-CAM slider and review ICAR-certified treatment protocols.',
    previewDetails: {
      label: 'AI Diagnostic',
      value: 'Alternaria solani (Early Blight)',
      highlight: 'ICAR Azoxystrobin + Difenoconazole Protocol',
    },
  },
  {
    num: '04',
    title: 'Simulate Biophysical Hydrology in 3D',
    target: '/twin',
    description:
      'Orbit the field parcel in 3D, inspect subterranean soil moisture gradients, and compare precision irrigation scenarios saving 38,400 L water via Stewart water-yield modeling.',
    badge: 'NEXFIELD Twin',
    metric: 'Stewart Water-Yield',
    keyAction: 'Adjust scenario parameters and inspect the counterfactual comparison table.',
    previewDetails: {
      label: 'Yield Sensitivity',
      value: '(1 - Ya/Ym) = Ky(1 - ETa/ETm)',
      highlight: 'Ky = 1.05 Monotonic Response for Wheat',
    },
  },
  {
    num: '05',
    title: 'Dispatch Field Work Order',
    target: '/ops',
    description:
      'Convert diagnostic advice directly into field work orders, assign field operators, and schedule precise chemical/fertilizer dosages.',
    badge: 'NEXFIELD Ops',
    metric: 'Work Orders & ERP',
    keyAction: 'Complete a work order and observe automatic warehouse stock deductions.',
    previewDetails: {
      label: 'Workforce Dispatch',
      value: 'Apply Potassium Nitrate Fertigation (13-0-45)',
      highlight: 'Est. ₹1,200 · Due Tomorrow',
    },
  },
  {
    num: '06',
    title: 'Inspect Food Storage Quality & Silos',
    target: '/ops',
    description:
      'Inspect grain silo moisture (<14%) and cold storage temperatures (>10°C) to eliminate Aspergillus aflatoxin risk and chilling injury.',
    badge: 'Food Quality Guard',
    metric: '0.0% Aflatoxin Risk',
    keyAction: 'Review Equilibrium Moisture Content (EMC) and ethylene scrubber readings.',
    previewDetails: {
      label: 'Grain Silo Custody',
      value: '12.4% Equilibrium Moisture',
      highlight: 'Safe Threshold (<14%) Confirmed',
    },
  },
  {
    num: '07',
    title: 'Compare APMC Mandi Net Returns',
    target: '/markets',
    description:
      'Analyze wholesale mandi rates between Nashik APMC, Pimpalgaon, and Vashi Mumbai. Deduct road freight diesel costs to calculate real net in hand.',
    badge: 'NEXFIELD Markets',
    metric: '+₹297/q Net Spread',
    keyAction: 'Adjust consignment volume slider to see total arbitrage earnings.',
    previewDetails: {
      label: 'Spatial Arbitrage',
      value: 'Pimpalgaon Yard (+₹297/q Net)',
      highlight: 'Net ₹5,940 on 20 Quintal Consignment',
    },
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
          <Sparkles className="w-4 h-4 text-[#D7B678]" />
          <span>ADAPPT 5.0 Jury & Evaluator Walkthrough</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F1F6F3] font-serif tracking-tight">
          The Guided Demo Journey
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          Experience NEXFIELD’s complete closed-loop agricultural intelligence workflow on our verified baseline: <strong className="text-[#F1F6F3]">Nashik Tomato Precision Estate</strong> in Maharashtra.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#111714] border border-[#203127] text-xs font-mono text-[#D7B678]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Login Required · Local Demo Persistence Enabled</span>
        </div>
      </div>

      {/* Interactive Step Navigator Card */}
      <div className="rounded-3xl bg-[#111714] border border-[#203127] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-[#18251E] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold">
              STEP {activeStep.num} OF 07
            </span>
            <span className="text-xs text-[#9BB1A4] font-medium hidden sm:inline-block">
              {activeStep.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-lg bg-[#16201B] border border-[#203127] text-[#9BB1A4] hover:text-[#F1F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-[#8DA396] px-1">
              {currentStepIdx + 1} / 7
            </span>
            <button
              onClick={handleNext}
              disabled={currentStepIdx === TOUR_STEPS.length - 1}
              className="p-2 rounded-lg bg-[#16201B] border border-[#203127] text-[#9BB1A4] hover:text-[#F1F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next step"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F1F6F3] font-serif">
              {activeStep.title}
            </h2>
            <p className="text-sm sm:text-base text-[#CADCD1] leading-relaxed">
              {activeStep.description}
            </p>

            <div className="p-3.5 rounded-xl bg-[#0D1410] border border-[#1E2E25] text-xs text-[#8DA396] space-y-1">
              <span className="font-semibold text-emerald-400 block font-mono uppercase tracking-wider text-[10px]">
                Recommended Evaluator Action:
              </span>
              <p>{activeStep.keyAction}</p>
            </div>
          </div>

          {/* Metric & Preview Action Box */}
          <div className="p-5 rounded-2xl bg-[#0D1410] border border-[#1E2E25] space-y-4 text-center md:text-left flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D8577] block">
                {activeStep.previewDetails.label}
              </span>
              <div className="font-mono text-lg font-bold text-[#F1F6F3]">
                {activeStep.previewDetails.value}
              </div>
              <div className="text-xs text-[#D7B678] font-medium">
                {activeStep.previewDetails.highlight}
              </div>
            </div>

            <Link
              href={activeStep.target}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.num}
              onClick={() => setCurrentStepIdx(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentStepIdx === idx
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-[#203127] hover:bg-[#3D5C4A]'
              }`}
              aria-label={`Go to step ${step.num}`}
            />
          ))}
        </div>
      </div>

      {/* Complete 7-Step Roadmap Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#F1F6F3] font-serif">Curated 7-Step Journey Roadmap</h2>
          <span className="text-xs font-mono text-[#8DA396]">Estimated time: 4 minutes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOUR_STEPS.map((step, idx) => (
            <div
              key={step.num}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                currentStepIdx === idx
                  ? 'bg-[#163B2A]/40 border-emerald-500/50 shadow-md'
                  : 'bg-[#111714] border-[#203127] hover:border-[#2E4638]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#16201B] text-emerald-400 border border-[#203127]">
                  Step {step.num}
                </span>
                <span className="text-xs font-mono text-[#D7B678]">{step.metric}</span>
              </div>
              <h3 className="font-bold text-sm text-[#F1F6F3]">{step.title}</h3>
              <p className="text-xs text-[#9BB1A4] leading-relaxed line-clamp-2">
                {step.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#6D8577]">{step.badge}</span>
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  Preview <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
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
} from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';

export default function DemoGuidedLandingPage() {
  const router = useRouter();
  const demoStore = useDemoStore();
  const [selectedStep, setSelectedStep] = useState(0);

  const tourSteps = [
    {
      num: '01',
      title: 'Meet the Farm',
      target: '/demo/control',
      description: 'Nashik Tomato Precision Estate: 2.4 ha in Dindori Block, Maharashtra. Sown 48 days ago (early flowering BBCH 65 stage).',
      badge: 'Command Center',
      metric: '2.4 ha · Silt Loam',
    },
    {
      num: '02',
      title: 'Observe Conditions',
      target: '/demo/control',
      description: 'Read stratified rootzone soil moisture (41.4% VWC), atmospheric Vapor Pressure Deficit (1.42 kPa), and microclimate stations.',
      badge: 'Telemetry HUD',
      metric: '41.4% VWC · 27.8°C',
    },
    {
      num: '03',
      title: 'Inspect a Crop with AI',
      target: '/demo/fieldsight',
      description: 'Run 5.13 ms foliar computer vision on tomato foliage, detecting Early Blight (Alternaria solani) with spatial Grad-CAM activation heatmaps.',
      badge: 'FieldSight AI',
      metric: '94.2% Conf · 5.13 ms',
    },
    {
      num: '04',
      title: 'Simulate Biophysical Hydrology',
      target: '/demo/twin',
      description: 'Orbit the field parcel in 3D, inspect subterranean soil moisture gradients, and compare precision irrigation scenarios saving 38,400 L water.',
      badge: 'Digital Twin 3D',
      metric: 'FAO-56 Dual $K_c$',
    },
    {
      num: '05',
      title: 'Review Copilot Insights',
      target: '/demo/intelligence',
      description: 'Interact with the Agronomic Copilot to receive chemical spray timings conditioned on local wind, humidity, and 7-day withholding periods.',
      badge: 'Agronomic Copilot',
      metric: 'Weather-Grounded AI',
    },
    {
      num: '06',
      title: 'Create & Dispatch Field Tasks',
      target: '/demo/ops',
      description: 'Convert diagnostic advice directly into field work order WO-2026-104 and automatically deduct 4.8 kg Mancozeb from warehouse custody.',
      badge: 'Ops Ledger',
      metric: 'Closed-Loop Tasks',
    },
    {
      num: '07',
      title: 'Inspect Harvest Storage Quality',
      target: '/demo/ops',
      description: 'Inspect grain silo moisture (<14%) and cold storage temperatures (>10°C) to eliminate Aspergillus aflatoxin risk and chilling injury.',
      badge: 'Food Quality',
      metric: 'Storage Mold Guard',
    },
    {
      num: '08',
      title: 'Compare APMC Market Returns',
      target: '/demo/markets',
      description: 'Analyze wholesale mandi rates between Nashik APMC and Pimpalgaon, subtract road freight diesel costs, and realize +₹280/q extra income.',
      badge: 'Mandi Arbitrage',
      metric: '+₹280/q Net Spread',
    },
  ];

  const handleResetDemo = () => {
    demoStore.resetDemo();
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14231A] border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ADAPPT 5.0 Jury & Evaluator Walkthrough</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          The Guided Demo Tour
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          Experience NEXFIELD&apos;s full capabilities on our verified demonstration baseline: the{' '}
          <strong className="text-[#F0F5F2]">Nashik Tomato Precision Estate</strong> in Maharashtra.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#111714] border border-[#273C30] text-xs text-[#63796E]">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Development Mode: Synthetic Agronomic Baseline · No Login or Sensor Setup Required</span>
        </div>
      </div>

      {/* Farm Profile Card */}
      <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase">
              Baseline Estate
            </span>
            <span className="text-xs text-[#63796E]">Sector 2-B, Dindori Block</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F0F5F2] font-serif">{demoStore.farmName}</h2>
          <p className="text-xs sm:text-sm text-[#8DA396] max-w-lg">
            A 2.4-hectare semi-determinate hybrid table tomato parcel planted in silt loam soil with pressure-compensated drip irrigation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleResetDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-[#9BB1A4] bg-[#16201B] hover:text-[#F0F5F2] hover:bg-[#1E2B24] border border-[#273C30] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
          <Link
            href="/demo/control"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Enter Farm Now</span>
          </Link>
        </div>
      </div>

      {/* 8-Step Interactive Tour Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Curated 8-Step Evaluator Journey</h3>
          <span className="text-xs text-[#63796E] font-mono">Estimated time: 5 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tourSteps.map((step, idx) => (
            <div
              key={step.num}
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 hover:bg-[#131C17] transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20">
                    Step {step.num}
                  </span>
                  <span className="text-[11px] font-mono text-[#9BB1A4] px-2 py-0.5 rounded bg-[#16201B]">
                    {step.metric}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#F0F5F2] font-serif group-hover:text-emerald-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-[#8DA396] leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-3 border-t border-[#1F2E25] flex items-center justify-between">
                <span className="text-[11px] text-[#63796E] font-medium">{step.badge}</span>
                <Link
                  href={step.target}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Experience Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jury Quick FAQ */}
      <div className="rounded-2xl bg-[#0E1411] border border-[#1A2820] p-6 sm:p-8 space-y-4">
        <h4 className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-semibold">
          Evaluator Quick Answers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#8DA396]">
          <div>
            <strong className="text-[#F0F5F2] block mb-1">Is this live sensor data?</strong>
            When running in demonstration mode, NEXFIELD uses synthetic baseline fixtures adhering to Collaboration Law 3 in AGENTS.md, clearly labeled at all times.
          </div>
          <div>
            <strong className="text-[#F0F5F2] block mb-1">How is ADAPPT 5.0 Domain 2 covered?</strong>
            AI foliar diagnosis stops disease spreading to harvest crops, and post-harvest storage monitoring guards grain from aflatoxin mold and chilling injury.
          </div>
        </div>
      </div>
    </div>
  );
}

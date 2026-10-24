'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ScanEye,
  Layers,
  Sparkles,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Workflow,
  ExternalLink,
} from 'lucide-react';

export default function PlatformOverviewPage() {
  const modules = [
    {
      id: 'control',
      title: 'Command Center',
      tagline: 'Observe Your Field in Real-Time',
      description:
        'Unified telemetry ingestion for soil moisture, atmospheric vapor pressure deficit (VPD), canopy NDVI, and prioritized farm alerts.',
      icon: LayoutDashboard,
      color: 'emerald',
      href: '/platform/control',
      demoHref: '/demo/control',
      features: [
        'Rootzone soil matric potential (0-60 cm profile)',
        'Ambient microclimate station tracking & GDD accumulation',
        'Multi-parcel switching & live threshold triage',
      ],
    },
    {
      id: 'fieldsight',
      title: 'FieldSight AI',
      tagline: 'Edge Computer Vision Foliar Pathology',
      description:
        'Single-digit millisecond ONNX inference for foliar diseases, leaf spot, early blight, and nutrient deficiencies with spatial Grad-CAM activation heatmaps.',
      icon: ScanEye,
      color: 'rose',
      href: '/platform/fieldsight',
      demoHref: '/demo/fieldsight',
      features: [
        '5.13 ms CPU inference via compiled ONNX graph',
        'ICAR-grounded chemical & bio-rational treatment protocols',
        'Pre-harvest safety intervals and withholding schedules',
      ],
    },
    {
      id: 'twin',
      title: 'Digital Twin 3D',
      tagline: 'Simulate Biophysical Hydrology Before Irrigating',
      description:
        'Interactive 3D WebGL field simulation implementing FAO-56 dual crop coefficient hydrology and vadose zone infiltration regimes.',
      icon: Layers,
      color: 'cyan',
      href: '/platform/twin',
      demoHref: '/demo/twin',
      features: [
        'Subterranean 3D moisture horizon cutaways',
        'Comparative irrigation scenario builder (Deficit vs Precision)',
        'Quantified water conservation & stress penalty prevention',
      ],
    },
    {
      id: 'intelligence',
      title: 'Agronomic Copilot',
      tagline: 'Context-Aware Agricultural Intelligence',
      description:
        'Specialized agronomic assistant citing real farm telemetry, microclimate conditions, and university agronomic extension literature.',
      icon: Sparkles,
      color: 'violet',
      href: '/platform/intelligence',
      demoHref: '/demo/intelligence',
      features: [
        'Direct grounding against farm soil and weather observations',
        'Chemical rotation schedules to prevent fungicide resistance',
        'Evidence citation chips and actionable work order triggers',
      ],
    },
    {
      id: 'operations',
      title: 'Operations & Custody',
      tagline: 'Work Orders, Inputs & Food Quality Ledger',
      description:
        'Closed-loop farm management linking diagnostics to field tasks, agrochemical inventory deductions, and post-harvest storage safety.',
      icon: ClipboardList,
      color: 'amber',
      href: '/platform/operations',
      demoHref: '/demo/ops',
      features: [
        'Auto-generated work orders from diagnostic triggers',
        'Grain silo equilibrium moisture (<14%) spoilage guards',
        'Cold storage chilling injury & mold risk index',
      ],
    },
    {
      id: 'markets',
      title: 'Mandi Arbitrage',
      tagline: 'Optimize Harvest Revenue Across APMCs',
      description:
        'Real-time Agmarknet wholesale mandi price spreads with multi-factor freight hauling calculations and CACP MSP benchmarks.',
      icon: TrendingUp,
      color: 'emerald',
      href: '/platform/markets',
      demoHref: '/demo/markets',
      features: [
        'Live wholesale arrivals and modal rates across APMC yards',
        'Road distance freight deduction (diesel + vehicle tare)',
        'Net farm gate realization calculator for lot scheduling',
      ],
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <Workflow className="w-3.5 h-3.5" />
          <span>Six Connected Agronomic Modules</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F0F5F2] font-serif">
          The Platform Architecture
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          NEXFIELD replaces fragmented point solutions with an interconnected agronomic operating system.
          Observations flow seamlessly into simulations, tasks, and market decisions.
        </p>
      </div>

      {/* Grid of 6 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#16201B] border border-[#273C30] flex items-center justify-center text-emerald-400 group-hover:bg-emerald-950/80 group-hover:scale-105 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#63796E] px-2 py-0.5 rounded bg-[#16201B]">
                    Module
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#F0F5F2] group-hover:text-emerald-300 transition-colors mb-1 font-serif">
                  {mod.title}
                </h3>
                <p className="text-xs text-emerald-400/90 font-medium mb-3">{mod.tagline}</p>
                <p className="text-sm text-[#8DA396] leading-relaxed mb-6">{mod.description}</p>

                <ul className="space-y-2 border-t border-[#1F2E25] pt-4 mb-6">
                  {mod.features.map((feat, i) => (
                    <li key={i} className="text-xs text-[#9BB1A4] flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1F2E25]">
                <Link
                  href={mod.href}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-[#16201B] hover:bg-[#1C2822] text-[#F0F5F2] border border-[#273C30] transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={mod.demoHref}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Callout */}
      <div className="rounded-3xl bg-gradient-to-b from-[#14231A] to-[#101713] border border-[#273C30] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0F5F2] font-serif">
          Experience the Closed-Loop Workflow
        </h2>
        <p className="text-sm sm:text-base text-[#9BB1A4] max-w-2xl mx-auto leading-relaxed">
          See how an early foliar scan of Alternaria solani in North Block automatically updates the 3D digital twin,
          triggers a Mancozeb work order, deducts stock from inventory, and calculates net mandi realizations in Pimpalgaon.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Guided Demo Tour</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-[#16201B] text-[#F0F5F2] border border-[#273C30] hover:bg-[#1D2B24] transition-colors"
          >
            <span>Read How It Works</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

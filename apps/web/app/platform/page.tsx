'use client';

import React, { useState } from 'react';
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
  Database,
  Terminal,
  Activity,
} from 'lucide-react';
import { Button } from '@nexfield/ui';

export default function PlatformOverviewPage() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'perception' | 'simulation' | 'market'>('all');

  const modules = [
    {
      id: 'control',
      title: 'NEXFIELD Control',
      layer: 'perception',
      tagline: 'Observe Your Field in Real-Time',
      description:
        'Unified telemetry ingestion for soil moisture, atmospheric vapor pressure deficit (VPD), canopy NDVI, and prioritized farm alerts.',
      icon: LayoutDashboard,
      color: 'emerald',
      href: '/platform/control',
      demoHref: '/control',
      features: [
        'Rootzone soil matric potential (0-60 cm profile)',
        'Ambient microclimate station tracking & GDD accumulation',
        'Multi-parcel switching & live threshold triage',
      ],
    },
    {
      id: 'fieldsight',
      title: 'FieldSight AI',
      layer: 'perception',
      tagline: 'Edge Computer Vision Foliar Pathology',
      description:
        'Single-digit millisecond ONNX inference for foliar diseases, leaf spot, early blight, and nutrient deficiencies with spatial Grad-CAM activation heatmaps.',
      icon: ScanEye,
      color: 'rose',
      href: '/platform/fieldsight',
      demoHref: '/fieldsight',
      features: [
        '5.13 ms CPU inference via compiled ONNX graph',
        'ICAR-grounded chemical & bio-rational treatment protocols',
        'Pre-harvest safety intervals and withholding schedules',
      ],
    },
    {
      id: 'twin',
      title: 'NEXFIELD Twin',
      layer: 'simulation',
      tagline: 'Simulate Biophysical Hydrology Before Irrigating',
      description:
        'Interactive 3D WebGL field simulation implementing Stewart water-yield production modeling, planned volumetric application depth calculations (10 m³/ha = 1 mm), and counterfactual scenario comparison grids.',
      icon: Layers,
      color: 'cyan',
      href: '/platform/twin',
      demoHref: '/twin',
      features: [
        'Subterranean 3D moisture horizon cutaways & 2D fallback',
        'Comparative irrigation scenario builder (Deficit vs Precision)',
        'Stewart empirical water-yield production calculations',
      ],
    },
    {
      id: 'intelligence',
      title: 'NEXFIELD Intelligence',
      layer: 'simulation',
      tagline: 'Context-Aware Agronomic AI Copilot',
      description:
        'Specialized agronomic assistant citing real farm telemetry, microclimate conditions, and university agronomic extension literature.',
      icon: Sparkles,
      color: 'violet',
      href: '/platform/intelligence',
      demoHref: '/intelligence',
      features: [
        'Direct grounding against farm soil and weather observations',
        'Chemical rotation schedules to prevent fungicide resistance',
        'Evidence citation chips and actionable work order triggers',
      ],
    },
    {
      id: 'operations',
      title: 'NEXFIELD Ops',
      layer: 'market',
      tagline: 'Work Orders, Inputs & Food Quality Ledger',
      description:
        'Closed-loop farm management linking diagnostics to field tasks, agrochemical inventory deductions, and post-harvest storage safety.',
      icon: ClipboardList,
      color: 'amber',
      href: '/platform/operations',
      demoHref: '/ops',
      features: [
        'Dual-mode List & Kanban Board task dispatch workflows',
        'Grain silo equilibrium moisture (<14%) spoilage guards',
        'Cold storage chilling injury & mold risk index',
      ],
    },
    {
      id: 'markets',
      title: 'NEXFIELD Markets',
      layer: 'market',
      tagline: 'Mandi Price Discovery & Freight Arbitrage',
      description:
        'Wholesale APMC terminal price intelligence calculating gross modal spreads minus road freight and loading labor for maximum farm-gate realization.',
      icon: TrendingUp,
      color: 'emerald',
      href: '/platform/markets',
      demoHref: '/markets',
      features: [
        'Agmarknet terminal mandi price feeds & historic seasonal trends',
        'Distance-based multi-factor freight deduction engine',
        'Mandi spatial proximity radar and net profit calculator',
      ],
    },
  ];

  const filteredModules = modules.filter(
    (m) => activeLayer === 'all' || m.layer === activeLayer
  );

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111714] border border-[#203127] text-xs font-mono text-emerald-400">
          <Workflow className="w-3.5 h-3.5 text-[#D7B678]" />
          <span>Closed-Loop Agronomic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F1F6F3] font-serif">
          The NEXFIELD Platform
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          Six synchronized operational workspaces unifying in-field IoT sensing, edge computer vision pathology, 3D biophysical simulation, and wholesale mandi market realization into one cohesive system.
        </p>
      </div>

      {/* Layer Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-xl bg-[#111714] border border-[#203127] gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeLayer === 'all'
                ? 'bg-emerald-600 text-[#090D0B] font-bold'
                : 'text-[#8DA396] hover:text-[#F1F6F3]'
            }`}
          >
            All Workspaces (6)
          </button>
          <button
            onClick={() => setActiveLayer('perception')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeLayer === 'perception'
                ? 'bg-emerald-600 text-[#090D0B] font-bold'
                : 'text-[#8DA396] hover:text-[#F1F6F3]'
            }`}
          >
            Observe & Diagnose
          </button>
          <button
            onClick={() => setActiveLayer('simulation')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeLayer === 'simulation'
                ? 'bg-emerald-600 text-[#090D0B] font-bold'
                : 'text-[#8DA396] hover:text-[#F1F6F3]'
            }`}
          >
            Simulate & Reason
          </button>
          <button
            onClick={() => setActiveLayer('market')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeLayer === 'market'
                ? 'bg-emerald-600 text-[#090D0B] font-bold'
                : 'text-[#8DA396] hover:text-[#F1F6F3]'
            }`}
          >
            Execute & Monetize
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="rounded-2xl bg-[#111714] border border-[#203127] p-6 space-y-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#D7B678] uppercase tracking-wider px-2 py-0.5 rounded bg-[#16201B] border border-[#203127]">
                    Module 0{modules.findIndex((x) => x.id === m.id) + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#F1F6F3] font-serif group-hover:text-emerald-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#D7B678] font-medium mt-0.5">{m.tagline}</p>
                </div>

                <p className="text-xs sm:text-sm text-[#CADCD1] leading-relaxed">
                  {m.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#18251E]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D8577] block">
                    Key Capabilities
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#9BB1A4]">
                    {m.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#18251E] flex items-center justify-between">
                <Link
                  href={m.href}
                  className="text-xs font-semibold text-[#8DA396] hover:text-[#F1F6F3] inline-flex items-center gap-1 transition-colors"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={m.demoHref}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technical Architecture Overview */}
      <div className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#F1F6F3] font-serif">
            System Topology & Architectural Invariants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#111714] border border-[#203127] space-y-2">
            <div className="flex items-center gap-2 font-mono text-emerald-400 font-semibold">
              <Database className="w-4 h-4" />
              <span>Zero-Cloud Client Storage</span>
            </div>
            <p className="text-[#9BB1A4] leading-relaxed">
              In public demonstration mode, mutations (farms, cycles, tasks, inventory) persist locally in browser localStorage (<code className="text-emerald-300 font-mono">nexfield-demo-v1</code>) with Zod contract schema validation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111714] border border-[#203127] space-y-2">
            <div className="flex items-center gap-2 font-mono text-cyan-400 font-semibold">
              <Activity className="w-4 h-4" />
              <span>Compiled Edge ONNX Engine</span>
            </div>
            <p className="text-[#9BB1A4] leading-relaxed">
              FieldSight executes compiled ONNX graph inference with SSRF-safe URL streaming validation (rejecting loopback, private, and CGNAT IP blocks) and 10 MB maximum payload constraints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111714] border border-[#203127] space-y-2">
            <div className="flex items-center gap-2 font-mono text-[#D7B678] font-semibold">
              <Terminal className="w-4 h-4" />
              <span>Stewart Yield Production</span>
            </div>
            <p className="text-[#9BB1A4] leading-relaxed">
              Simulation scenarios execute the Stewart empirical water-yield production model (<code className="text-[#D7B678] font-mono">Ky = 1.05</code> for wheat), returning true non-fixture DTOs with verified provenance.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#14231A] to-[#101713] border border-[#203127] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F1F6F3] font-serif">
          Ready to Experience the Closed-Loop System?
        </h2>
        <p className="text-sm sm:text-base text-[#9BB1A4] max-w-xl mx-auto leading-relaxed">
          Walk through all six modules in our guided evaluator tour, or launch directly into the operational Command Center.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Guided Demo Tour</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/control"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#111714] text-[#F1F6F3] hover:bg-[#16201B] border border-[#203127] transition-all"
          >
            <span>Open Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

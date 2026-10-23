'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  ScanEye,
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  TrendingUp,
  Cpu,
  Database,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Activity,
  Droplets,
  SunMedium,
  Sprout,
  BarChart3,
  Flame,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, StatusIndicator } from '@nexfield/ui';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

export default function LandingPage() {
  const modules = [
    {
      id: 'control',
      title: 'NEXFIELD Control',
      badge: 'HQ',
      subtitle: 'Central Farm Command & Telemetry HUD',
      description:
        'Real-time aggregation of soil matric potential, microclimate stations, canopy NDVI indices, and mission-critical agronomic threshold alerts.',
      icon: LayoutDashboard,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      demoUrl: '/demo/control',
      stats: '14 Telemetry Metrics · Multi-Field Switching · Offline-First',
    },
    {
      id: 'fieldsight',
      title: 'FieldSight AI',
      badge: 'Vision',
      subtitle: 'Multi-Spectral Disease & Quality Diagnostics',
      description:
        'In-browser computer vision inference for foliar pathogens, early blight, powdery mildew, and nutrient deficiencies with Grad-CAM heatmaps.',
      icon: ScanEye,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      demoUrl: '/demo/fieldsight',
      stats: '96.4% Pathology Accuracy · Treatment Prescriptions · Severity %',
    },
    {
      id: 'twin',
      title: 'NEXFIELD Twin',
      badge: 'Sim',
      subtitle: '3D Biophysical Digital Twin & What-If Engine',
      description:
        'Physics-informed simulation of 3D soil strata, root-zone moisture infiltration, canopy transpiration, and stress response under climate shocks.',
      icon: Layers,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      demoUrl: '/demo/twin',
      stats: 'Van Genuchten Hydrology · Heatwave Scenarios · Real-Time 3D Mesh',
    },
    {
      id: 'intelligence',
      title: 'NEXFIELD Intelligence',
      badge: 'LLM',
      subtitle: 'Context-Aware Agricultural AI Copilot',
      description:
        'Agronomic reasoning model grounded in your actual field sensor readings, soil chemistry history, crop growth stages, and localized weather forecasts.',
      icon: Sparkles,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      demoUrl: '/demo/intelligence',
      stats: 'Telemetry-Conditioned Prompting · Integrated ICAR & Agronomic Knowledge',
    },
    {
      id: 'ops',
      title: 'NEXFIELD Ops',
      badge: 'Ledger',
      subtitle: 'Resource Ledger, Tasks & Traceable Harvests',
      description:
        'End-to-end farm operations tracking: inventory consumption, task scheduling, operational expenditure accounting, and export-grade harvest batch codes.',
      icon: ClipboardList,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      demoUrl: '/demo/ops',
      stats: 'Batch QR Traceability · Cost/Hectare Calculation · FIFO Inventory',
    },
    {
      id: 'markets',
      title: 'NEXFIELD Markets',
      badge: 'Mandi',
      subtitle: 'Agmarknet Intelligence & Commodity Arbitrage',
      description:
        'Live wholesale mandi arrivals, inter-mandi price spreads, modal rate predictions, and financial timing models to maximize harvest net margin.',
      icon: TrendingUp,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      demoUrl: '/demo/markets',
      stats: 'Real Agmarknet Feeds · Price Volatility Index · Logistics Net Margin',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B09] text-[#F0F5F2] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Public Marketing Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1A261F] bg-[#070B09]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <NexfieldLogo size="md" showWordmark={true} href="/" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#9BB1A4]">
            <a href="#modules" className="hover:text-emerald-400 transition-colors">
              Platform Modules
            </a>
            <a href="#digital-twin" className="hover:text-emerald-400 transition-colors">
              3D Digital Twin
            </a>
            <a href="#provenance" className="hover:text-emerald-400 transition-colors">
              Provenance & Security
            </a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              ADAPPT 5.0
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/demo/control"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-900/50 hover:border-emerald-500 transition-all shadow-sm"
            >
              <span>Explore Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] text-[#070B09] hover:bg-[#34D399] transition-all font-sans shadow-md shadow-emerald-900/30"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Domain & Hackathon Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111A15] border border-[#23352B] text-xs text-[#9BB1A4]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">ADAPPT 5.0</span>
              <span className="text-[#63796E]">·</span>
              <span>Domain 2: AI in Food Technology</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F0F5F2] leading-[1.12]">
              The Agricultural Intelligence <br />
              <span className="bg-gradient-to-r from-emerald-400 via-[#34D399] to-teal-200 bg-clip-text text-transparent">
                Operating System.
              </span>
            </h1>

            {/* Tagline & Subtitle */}
            <p className="text-lg sm:text-xl font-medium text-emerald-300/90 font-mono tracking-wide">
              Observe. Predict. Simulate. Optimize. Grow.
            </p>

            {/* Descriptive Pitch */}
            <p className="text-sm sm:text-base text-[#9BB1A4] max-w-2xl leading-relaxed">
              NEXFIELD unifies biophysical soil sensors, computer-vision foliar pathology,
              first-principles 3D digital twins, operational farm ledgers, and live Mandi market
              intelligence into a single high-performance SaaS platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/demo/control"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold bg-[#10B981] text-[#070B09] hover:bg-[#34D399] hover:scale-[1.02] transition-all shadow-lg shadow-emerald-950/60"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#111A15] text-[#F0F5F2] border border-[#273C30] hover:bg-[#16231C] hover:border-emerald-600/50 transition-all"
              >
                <span>Access Farm Workspace</span>
              </Link>
            </div>

            {/* Live Telemetry Bar Preview */}
            <div className="w-full pt-10">
              <div className="rounded-2xl bg-[#0E1512] border border-[#203026] p-4 sm:p-6 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A261F]">
                  <div className="flex items-center gap-2">
                    <StatusIndicator status="online" label="Active Demonstration Feed" pulse />
                    <span className="text-xs text-[#7B9587]">
                      Nashik Tomato Estate · Maharashtra (Field Sector 2-B)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span>Provenance: Verified Telemetry</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-left font-mono">
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Soil Moisture</div>
                    <div className="text-lg font-bold text-sky-400 mt-1 tabular-nums">41.4%</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-sans">Optimal Root Zone</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Canopy NDVI</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1 tabular-nums">0.81</div>
                    <div className="text-[10px] text-[#9BB1A4] mt-0.5 font-sans">Vigorous Foliage</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Microclimate</div>
                    <div className="text-lg font-bold text-amber-400 mt-1 tabular-nums">27.8°C</div>
                    <div className="text-[10px] text-[#9BB1A4] mt-0.5 font-sans">64% Ambient RH</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Soil pH</div>
                    <div className="text-lg font-bold text-purple-400 mt-1 tabular-nums">6.8 pH</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-sans">Neutral Loam</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Pathology Risk</div>
                    <div className="text-lg font-bold text-emerald-300 mt-1 tabular-nums">4.2%</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-sans">Low Spore Count</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080D0A] border border-[#19261E]">
                    <div className="text-[10px] text-[#63796E] uppercase font-sans">Mandi Modal</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1 tabular-nums">₹2,450</div>
                    <div className="text-[10px] text-emerald-300 mt-0.5 font-sans">+8.4% Arbitrage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem & Solution Breakdown */}
      <section className="py-16 sm:py-24 border-y border-[#18261E] bg-[#0A100C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300 font-mono">
                The Agricultural Technology Gap
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F5F2] tracking-tight leading-snug">
                Fragmented Data Leads to Catastrophic Yield & Margin Losses.
              </h2>
              <div className="space-y-4 text-sm text-[#9BB1A4] leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <p>
                    <strong className="text-[#E1ECE5]">Delayed Pathology Detection:</strong> By the time leaf blight or fungal spores are visible to the naked eye, over 25% of yield potential is already irreversibly compromised.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <p>
                    <strong className="text-[#E1ECE5]">Irrigation Guesswork:</strong> Scheduled watering wastes up to 40% of ground water or causes root rot without deep vadose-zone matric potential measurements.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✕
                  </div>
                  <p>
                    <strong className="text-[#E1ECE5]">Opaque Mandi Auctions:</strong> Growers sell blindly at the nearest gate, losing ₹300-₹600 per quintal in spatial price arbitrage across adjacent district mandis.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0F1713] border border-[#22352A] p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-300 font-mono">
                The NEXFIELD Answer
              </div>
              <h3 className="text-2xl font-bold text-[#F0F5F2] tracking-tight">
                A Unified Cyber-Physical Operating System
              </h3>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                NEXFIELD fuses in-situ soil IoT, high-resolution computer vision, biophysical 3D simulation, and real-time market scrapers into one continuous feedback loop.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#E1ECE5]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Sub-second edge diagnosis with organic biopesticide recommendations</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#E1ECE5]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>3D Digital Twin stress modeling before committing expensive fertilizer</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#E1ECE5]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Real-time Agmarknet mandi price comparison with freight-adjusted net realization</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#E1ECE5]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cryptographic tenant data isolation with zero synthetic bleed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Six Interconnected Modules */}
      <section id="modules" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F5F2] tracking-tight">
              Six Interconnected Agronomic Modules
            </h2>
            <p className="text-sm text-[#9BB1A4] leading-relaxed">
              Every module feeds live agronomic state into the shared telemetry bus, creating an intelligent loop from sensor to ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="group relative rounded-2xl bg-[#0D1410] border border-[#1E2E25] p-6 hover:border-emerald-500/50 hover:bg-[#111A15] transition-all duration-300 flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#080D0A] border border-[#203227] text-emerald-400 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14231A] text-emerald-400 border border-[#21382A]">
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#F0F5F2] group-hover:text-emerald-300 transition-colors">
                        {mod.title}
                      </h3>
                      <div className="text-xs font-medium text-emerald-400/80 mt-0.5">
                        {mod.subtitle}
                      </div>
                    </div>

                    <p className="text-xs text-[#9BB1A4] leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#18261E] space-y-3">
                    <div className="text-[10px] font-mono text-[#63796E] truncate">
                      {mod.stats}
                    </div>
                    <Link
                      href={mod.demoUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Explore in Demo Mode</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 3D Digital Twin Showcase */}
      <section id="digital-twin" className="py-20 bg-[#090F0C] border-y border-[#18261E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                First-Principles Physics
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F5F2] tracking-tight">
                Simulate What-If Scenarios Before Risking Your Crops.
              </h2>
              <p className="text-sm text-[#9BB1A4] leading-relaxed">
                NEXFIELD Twin renders an interactive 3D mesh of field topography, root layer vadose zones, and canopy transpiration. Run biophysical stress projections under extreme weather shocks.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0E1612] border border-[#1E2E25]">
                  <div className="text-[#63796E] text-[10px]">HYDROLOGY SOLVER</div>
                  <div className="text-sm font-bold text-cyan-400 mt-1">Van Genuchten ODE</div>
                  <div className="text-[10px] text-[#9BB1A4] mt-0.5">3-Stratum Soil Dynamics</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0E1612] border border-[#1E2E25]">
                  <div className="text-[#63796E] text-[10px]">SCENARIO ENGINE</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">+4.5°C Heatwave</div>
                  <div className="text-[10px] text-[#9BB1A4] mt-0.5">Stomatal Stress Projection</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/demo/twin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-600/40 hover:bg-cyan-900/60 transition-all"
                >
                  <Layers className="h-4 w-4" />
                  <span>Launch 3D Twin Simulator</span>
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl bg-[#060907] border border-[#1E2E25] p-6 shadow-2xl overflow-hidden min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#8BA093] pb-3 border-b border-[#18261E]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-300 font-semibold">3D Biophysical Visualizer</span>
                </div>
                <span>Three.js WebGL 2.0</span>
              </div>

              <div className="my-auto py-8 text-center space-y-3">
                <div className="inline-flex p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                  <Layers className="h-12 w-12" />
                </div>
                <div className="text-sm font-bold text-[#E1ECE5]">
                  Topography Mesh: Field Sector 2-B (2.4 Hectares)
                </div>
                <p className="text-xs text-[#7B9587] max-w-sm mx-auto">
                  Soil Infiltration: 14.2 mm/hr · Vadose Saturation: 76% · Wilting Point Margin: +18%
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#18261E] text-center font-mono text-[11px]">
                <div className="text-cyan-400 font-bold">Moisture 41.4%</div>
                <div className="text-amber-400 font-bold">Temp 27.8°C</div>
                <div className="text-emerald-400 font-bold">Biomass 88%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Provenance & Multi-Tenant Security */}
      <section id="provenance" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Enterprise Trust & Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F0F5F2] tracking-tight">
              Honest Data Provenance & Cryptographic Tenant Isolation
            </h2>
            <p className="text-sm text-[#9BB1A4] leading-relaxed">
              We never fabricate simulated sensor readings in live farmer workspaces. NEXFIELD maintains strict physical separation between demo fixtures and real agronomic telemetries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#0D1410] border border-[#1E2E25] p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F5F2]">Row-Level Security (RLS)</h3>
              <p className="text-xs text-[#9BB1A4] leading-relaxed">
                Every farm, field polygon, sensor observation, and harvest record is cryptographically bound to the authenticated grower’s UUID in Supabase PostgreSQL.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0D1410] border border-[#1E2E25] p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-600/40 text-cyan-400 flex items-center justify-center">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F5F2]">Zero Synthetic Bleed</h3>
              <p className="text-xs text-[#9BB1A4] leading-relaxed">
                Synthetic fixtures reside exclusively in isolated demo sandboxes clearly badged with domain origin. Real accounts start clean with guided multi-format data ingestion.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0D1410] border border-[#1E2E25] p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-400 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F5F2]">Local Edge Processing</h3>
              <p className="text-xs text-[#9BB1A4] leading-relaxed">
                FieldSight computer vision and digital twin calculations run client-side via ONNX and WebGL, preserving farm confidentiality and operating in intermittent connectivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About Team & ADAPPT 5.0 */}
      <section id="about" className="py-16 bg-[#090E0B] border-t border-[#18261E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0C120E] border border-[#1E2E25] p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-600/40 text-xs text-emerald-400 font-mono">
                  ADAPPT 5.0 · Round 2 Submission
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F2] tracking-tight">
                  Engineered with Scientific Rigor for Real-World Indian Agriculture.
                </h3>
                <p className="text-xs sm:text-sm text-[#9BB1A4] leading-relaxed">
                  Developed by Tanish Bane (Frontend Lead & UX Architect) and Rohan Panchal (Backend Lead & AI Systems Architect) under the open-source governance framework for Domain 2: AI in Food Technology.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="https://github.com/TanishBane/Nexfield"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 font-mono"
                  >
                    <span>GitHub: TanishBane/Nexfield</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-[#4D6557]">·</span>
                  <a
                    href="https://github.com/panchalrohan44"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#8FA899] hover:text-[#E1ECE5] font-mono"
                  >
                    <span>Backend Architect: @panchalrohan44</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/demo/control"
                  className="w-full text-center py-3 px-4 rounded-xl text-xs font-bold bg-[#10B981] text-[#070B09] hover:bg-[#34D399] transition-all shadow-md"
                >
                  Start Demonstration
                </Link>
                <Link
                  href="/login"
                  className="w-full text-center py-3 px-4 rounded-xl text-xs font-semibold bg-[#121B16] text-[#E1ECE5] border border-[#23352B] hover:bg-[#18261E] transition-all"
                >
                  Sign In to Real Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Public Footer */}
      <footer className="border-t border-[#15201A] bg-[#050806] py-12 text-xs text-[#7B9587]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <NexfieldLogo size="sm" showWordmark={true} href="/" />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#9BB1A4]">
            <Link href="/demo/control" className="hover:text-emerald-400 transition-colors">
              Interactive Demo
            </Link>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Workspace Access
            </Link>
            <Link href="/data-center" className="hover:text-emerald-400 transition-colors">
              Data Ingestion
            </Link>
            <a
              href="https://github.com/TanishBane/Nexfield"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              Source Code
            </a>
          </div>

          <div className="font-mono text-[11px] text-[#556D60]">
            © 2026 NEXFIELD · Agricultural Intelligence OS
          </div>
        </div>
      </footer>
    </div>
  );
}

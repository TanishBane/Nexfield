'use client';

import React, { useRef, useState } from 'react';
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
  Droplets,
  SunMedium,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Warehouse,
  Truck,
  IndianRupee,
  Play,
  RotateCcw,
  Zap,
  Leaf,
  Compass,
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, StatusIndicator, cn } from '@nexfield/ui';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CinematicLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive Live State on Landing Page
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'scan' | 'twin' | 'market'>('scan');
  const [camHeatmapActive, setCamHeatmapActive] = useState(true);
  const [irrigationRegime, setIrrigationRegime] = useState<'standard' | 'precision'>('precision');
  const [harvestVolume, setHarvestVolume] = useState<number>(20); // quintals

  // GSAP ScrollTrigger Animations
  useGSAP(
    () => {
      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Animate Section Titles & Cards on Scroll
      const revealElements = containerRef.current?.querySelectorAll('.gsap-reveal');
      revealElements?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full bg-[#090D0B] text-[#F1F5F2] overflow-x-clip selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* =========================================================================
          SECTION 1: THE LAND — HERO VIEWPORT
      ========================================================================== */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1F2E25] overflow-hidden">
        {/* Ambient Agronomic Glows (Restrained & Calibrated) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-b from-emerald-950/30 via-[#173C2C]/20 to-transparent blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C2A06A]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Hero Top Tag */}
        <div className="max-w-4xl mx-auto text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ADAPPT 5.0 · Domain 2: AI in Food Technology</span>
          </div>

          {/* Primary Cinematic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#FAF8F2] font-serif leading-[1.08]">
            Understand the land.<br />
            <span className="italic font-normal text-[#C2A06A]">Shape what comes next.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-[#9BB1A4] max-w-2xl mx-auto font-sans font-normal leading-relaxed">
            Observe your fields, explore possibilities, and make more informed agricultural decisions.
            NEXFIELD unifies biophysical sensors, edge foliar computer vision, 3D digital twins, and Mandi price arbitrage into one closed-loop operating system.
          </p>

          {/* Official Tagline */}
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#C2A06A]">
            Observe. Predict. Simulate. Optimize. Grow.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore the Demo</span>
            </Link>

            <Link
              href="/demo/control"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-medium text-[#FAF8F2] bg-[#111714] hover:bg-[#16201B] border border-[#273C30] hover:border-[#3D5C4A] transition-all"
            >
              <span>Launch Control HUD</span>
              <ArrowRight className="w-4 h-4 text-[#9BB1A4]" />
            </Link>

            <Link
              href="/platform"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-[#9BB1A4] hover:text-emerald-400 transition-colors py-2 px-3"
            >
              <span>Discover the Platform</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Ambient Telemetry HUD Ticker */}
        <div className="max-w-5xl mx-auto w-full pt-12">
          <div className="rounded-2xl bg-[#111714]/90 border border-[#273C30] backdrop-blur-md p-4 sm:p-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F2E25] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                  Demonstration Feed
                </span>
                <span className="text-[#63796E]">·</span>
                <span className="text-[#9BB1A4]">Nashik Tomato Estate · Maharashtra (Field Sector 2-B)</span>
              </div>
              <span className="text-[11px] font-mono text-[#63796E]">
                Provenance: Verified Synthetic Fixtures
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-3 font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Soil Moisture</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">41.4%</div>
                <span className="text-[10px] text-emerald-400">Optimal Root Zone</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Canopy NDVI</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">0.81</div>
                <span className="text-[10px] text-emerald-400">Vigorous Foliage</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Microclimate</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">27.8°C</div>
                <span className="text-[10px] text-amber-400">64% Ambient RH</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Soil Reaction</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">6.8 pH</div>
                <span className="text-[10px] text-[#9BB1A4]">Neutral Silt Loam</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Pathology Risk</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">4.2%</div>
                <span className="text-[10px] text-emerald-400">Low Spore Count</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#63796E] uppercase">Mandi Modal</span>
                <div className="text-xl font-bold text-[#FAF8F2] tabular-nums">₹2,450</div>
                <span className="text-[10px] text-emerald-400">+₹210 vs Pimpalgaon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE CHALLENGE — BRIDGING AGRICULTURAL SILOS
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto gsap-reveal">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C2A06A] font-semibold">
            01 · The Agronomic Challenge
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif leading-tight">
            Indian agriculture is trapped in fragmented silos.
          </h2>
          <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
            Weather applications report abstract rain percentages. Crop diseases are diagnosed too late on messaging apps.
            Fertilizer is tallied in paper notebooks, and farmers accept lower prices at local yards because hauling math is opaque.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
            <span className="text-3xl font-serif text-rose-400">40%</span>
            <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">Water & Nutrient Inefficiency</h3>
            <p className="text-xs sm:text-sm text-[#8DA396] leading-relaxed">
              Irrigation based on surface dryness wastes millions of liters and leeches nitrogen into deep strata without benefiting shallow feeder roots.
            </p>
          </div>

          <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
            <span className="text-3xl font-serif text-amber-400">7 Days</span>
            <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">Diagnostic Blindspot</h3>
            <p className="text-xs sm:text-sm text-[#8DA396] leading-relaxed">
              Early Blight and leaf spots spread across parcels days before visual chlorosis becomes obvious to the naked eye.
            </p>
          </div>

          <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
            <span className="text-3xl font-serif text-[#C2A06A]">₹280/q</span>
            <h3 className="text-lg font-bold text-[#FAF8F2] font-serif">Mandi Arbitrage Gap</h3>
            <p className="text-xs sm:text-sm text-[#8DA396] leading-relaxed">
              Wholesale modal prices differ substantially between neighboring APMC yards, but farmers lack instant freight realization calculators.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE INTELLIGENCE — TURNING OBSERVATIONS INTO ACTION
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[#1F2E25] bg-[#0C120F] gsap-reveal">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              02 · The Connected Platform
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              Six Specialized Modules. One Operating System.
            </h2>
            <p className="text-base text-[#9BB1A4]">
              Every observation moves through a closed-loop chain of custody from field sensor to market realization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/platform/control"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-emerald-500/40 hover:bg-[#131E18] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 01</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors font-serif mb-2">
                Command Center
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Stratified soil volumetric water content, vapor pressure deficit, and today&apos;s actionable farm priorities.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                Explore Control →
              </span>
            </Link>

            <Link
              href="/platform/fieldsight"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-rose-500/40 hover:bg-[#181516] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 flex items-center justify-center">
                  <ScanEye className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 02</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-rose-300 transition-colors font-serif mb-2">
                FieldSight AI
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Single-digit millisecond ONNX foliar pathology with spatial Grad-CAM activation heatmaps and ICAR protocols.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                Explore FieldSight →
              </span>
            </Link>

            <Link
              href="/platform/twin"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-cyan-500/40 hover:bg-[#121A1B] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 03</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-cyan-300 transition-colors font-serif mb-2">
                Digital Twin 3D
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Interactive WebGL field terrain, subterranean moisture profiles, and FAO-56 dual crop coefficient simulations.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400">
                Explore Twin →
              </span>
            </Link>

            <Link
              href="/platform/intelligence"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-violet-500/40 hover:bg-[#16141B] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-950/80 text-violet-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 04</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-violet-300 transition-colors font-serif mb-2">
                Agronomic Copilot
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Contextual agricultural assistant citing live telemetry, microclimate conditions, and withholding intervals.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400">
                Explore Copilot →
              </span>
            </Link>

            <Link
              href="/platform/operations"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-amber-500/40 hover:bg-[#1A1813] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 05</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-amber-300 transition-colors font-serif mb-2">
                Operations & Custody
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Field task dispatching, automatic warehouse stock reconciliation, and grain silo moisture storage safety.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                Explore Ops →
              </span>
            </Link>

            <Link
              href="/platform/markets"
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 hover:border-emerald-500/40 hover:bg-[#131E18] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#63796E]">Module 06</span>
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F2] group-hover:text-emerald-300 transition-colors font-serif mb-2">
                Mandi Arbitrage
              </h3>
              <p className="text-xs text-[#8DA396] leading-relaxed mb-4">
                Real-time Agmarknet wholesale prices, road freight diesel deduction, and net farm gate realization.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                Explore Markets →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE DIGITAL TWIN — INTERACTIVE HYDRAULIC SIMULATOR
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto gsap-reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              03 · The Biophysical Simulator
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif leading-tight">
              Simulate subterranean moisture before opening valves.
            </h2>
            <p className="text-sm sm:text-base text-[#8DA396] leading-relaxed">
              NEXFIELD Twin translates soil sensor arrays and atmospheric evaporative demand ($ET_0$) into a 3D WebGL cutaway.
              Inspect the rootzone horizon and compare irrigation regimes side by side.
            </p>

            {/* Interactive Regime Switcher */}
            <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-4 space-y-3">
              <span className="text-xs font-mono text-[#9BB1A4]">Interactive Irrigation Test:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIrrigationRegime('standard')}
                  className={cn(
                    'p-2.5 rounded-xl text-xs font-medium border text-left transition-all',
                    irrigationRegime === 'standard'
                      ? 'bg-[#18261F] text-[#FAF8F2] border-emerald-500/50'
                      : 'bg-[#141C17] text-[#63796E] border-transparent'
                  )}
                >
                  <span className="font-semibold block text-[#FAF8F2]">Standard Flood</span>
                  <span>120,000 L / ha</span>
                </button>
                <button
                  onClick={() => setIrrigationRegime('precision')}
                  className={cn(
                    'p-2.5 rounded-xl text-xs font-medium border text-left transition-all',
                    irrigationRegime === 'precision'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-[#141C17] text-[#63796E] border-transparent'
                  )}
                >
                  <span className="font-semibold block text-emerald-400">Precision Drip (FAO-56)</span>
                  <span>81,600 L / ha (-32%)</span>
                </button>
              </div>

              <div className="pt-2 text-xs font-mono flex items-center justify-between text-[#8DA396]">
                <span>Water Conserved:</span>
                <strong className={irrigationRegime === 'precision' ? 'text-emerald-400 text-sm' : 'text-[#63796E]'}>
                  {irrigationRegime === 'precision' ? '+38,400 Liters / Cycle' : '0 Liters'}
                </strong>
              </div>
            </div>

            <Link
              href="/demo/twin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500 text-[#090D0B] hover:bg-cyan-400 transition-all"
            >
              <span>Orbit the 3D Estate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3D Representation Preview */}
          <div className="relative rounded-3xl bg-[#111714] border border-[#273C30] p-6 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2E25] text-xs">
              <span className="font-mono text-cyan-400">WebGL Parcel Cutaway</span>
              <span className="font-mono text-[#63796E]">Sector 2-B · 0-60cm Profile</span>
            </div>

            {/* Visual Strata Representation */}
            <div className="py-8 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[#FAF8F2] font-semibold block">Surface Crust (0-15 cm)</span>
                  <span className="text-[11px] text-emerald-400">Volumetric Water: 41.4% (Field Capacity)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">Optimal</span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-sky-950/50 to-sky-900/30 border border-sky-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[#FAF8F2] font-semibold block">Active Root Zone (15-35 cm)</span>
                  <span className="text-[11px] text-sky-400">Volumetric Water: 38.2% · Drip Emitters</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 text-[10px]">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-[#17201B] to-[#121815] border border-[#273C30] flex items-center justify-between">
                <div>
                  <span className="text-[#9BB1A4] font-semibold block">Deep Vadose Zone (35-60 cm)</span>
                  <span className="text-[11px] text-[#63796E]">Volumetric Water: 34.0% · Capillary Rise</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#16201B] text-[#9BB1A4] text-[10px]">Subsurface</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F2E25] flex items-center justify-between text-xs text-[#63796E]">
              <span>FAO-56 Dual Crop Model</span>
              <span className="font-mono text-emerald-400">$K_y = 1.05$ (Zero Vegetative Penalty)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: THE CROP — FIELDSIGHT AI INSPECTION STUDIO
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[#1F2E25] bg-[#0A100D] gsap-reveal">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                04 · Edge Computer Vision
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif leading-tight">
                Explainable Foliar Pathology in 5.13 Milliseconds.
              </h2>
              <p className="text-base text-[#9BB1A4] leading-relaxed">
                Test the Grad-CAM activation heatmap below. FieldSight highlights necrotic fungal lesions on tomato foliage,
                verifying diagnosis before recommending chemical or bio-rational treatments.
              </p>
            </div>
            <Link
              href="/demo/fieldsight"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-rose-500 text-white hover:bg-rose-400 transition-all self-start"
            >
              <span>Test Image Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Inspection Canvas Card */}
          <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Scan Simulated Box */}
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl bg-[#090D0B] border border-[#273C30] overflow-hidden flex items-center justify-center">
              {/* Simulated Leaf Blade Artwork */}
              <div className="relative w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-[#16291E] via-[#0E1B13] to-[#0A100C]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#63796E]">
                  <span>Foliar Scan #SOL-2026-88</span>
                  <span className="text-emerald-400">94.2% Confidence</span>
                </div>

                {/* Simulated Leaf Lamina with Grad-CAM Overlay */}
                <div className="relative flex-1 flex items-center justify-center my-4">
                  <div className="w-44 h-44 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center relative">
                    <Leaf className="w-28 h-28 text-emerald-500/40" />
                    {/* Grad-CAM Lesion Heatmap Spot */}
                    {camHeatmapActive && (
                      <div className="absolute top-10 right-12 w-16 h-16 rounded-full bg-gradient-to-r from-red-500/80 via-amber-500/60 to-transparent blur-md animate-pulse ring-2 ring-red-500/50" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1F2E25] text-xs">
                  <button
                    onClick={() => setCamHeatmapActive(!camHeatmapActive)}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#14231A] border border-emerald-500/30 text-emerald-300 font-mono text-xs hover:bg-emerald-950 transition-colors"
                  >
                    <span>Grad-CAM: {camHeatmapActive ? 'ON' : 'OFF'}</span>
                  </button>
                  <span className="font-mono text-xs text-[#9BB1A4]">Inference: 5.13 ms (CPU)</span>
                </div>
              </div>
            </div>

            {/* Diagnosis & Prescriptions Info */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-xs font-mono text-rose-400">
                <span>Alternaria solani (Early Blight)</span>
              </div>
              <h3 className="text-2xl font-bold text-[#FAF8F2] font-serif">
                Necrotic Target-Spot Lesion Detected
              </h3>
              <p className="text-xs sm:text-sm text-[#8DA396] leading-relaxed">
                Concentric dark rings identified on the lower foliage lamina. Prompt intervention recommended within 24 hours
                to safeguard early flowering fruit set on the Nashik parcel.
              </p>

              {/* Protocol Specs */}
              <div className="rounded-xl bg-[#0E1411] border border-[#1A2820] p-4 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C2A06A] font-semibold block">
                  ICAR / CIBRC Treatment Protocol:
                </span>
                <div className="flex items-start gap-2 text-[#FAF8F2]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Chemical:</strong> Mancozeb 75 WP @ 2.5 g/L or Chlorothalonil 75 WP</span>
                </div>
                <div className="flex items-start gap-2 text-[#FAF8F2]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Bio-Rational:</strong> Trichoderma viride @ 5.0 g/L foliar spray</span>
                </div>
                <div className="flex items-start gap-2 text-[#FAF8F2]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Safety Interval:</strong> 7-day pre-harvest withholding period (PHI)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: THE HARVEST — POST-HARVEST FOOD QUALITY
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto gsap-reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              05 · Post-Harvest Food Technology
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif leading-tight">
              Food quality begins before harvest and continues in storage.
            </h2>
            <p className="text-sm sm:text-base text-[#8DA396] leading-relaxed">
              Addressing ADAPPT 5.0 Domain 2: AI in Food Technology. NEXFIELD links foliar disease prevention directly
              to grain silo moisture monitoring and tomato cold storage temperature maintenance, eliminating post-harvest spoilage.
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#111714] border border-[#273C30] flex items-start gap-3">
                <Warehouse className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#FAF8F2] font-serif">Grain Silo Equilibrium Moisture (&lt;14%)</h4>
                  <p className="text-xs text-[#8DA396] mt-0.5">
                    Guards wheat, corn, and pulses against Aspergillus flavus aflatoxin synthesis during monsoon humidity spikes.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#111714] border border-[#273C30] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#FAF8F2] font-serif">Cold Storage Temperature Decay (&gt;10°C)</h4>
                  <p className="text-xs text-[#8DA396] mt-0.5">
                    Prevents chilling injury, pitting, and Alternaria storage decay in table tomatoes during transit and warehousing.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/platform/operations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#16201B] hover:bg-[#1E2B24] text-[#FAF8F2] border border-[#273C30] transition-colors"
            >
              <span>Learn About Food Quality Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Food Quality Metrics Panel */}
          <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2E25]">
              <span className="font-serif text-lg font-bold text-[#FAF8F2]">Post-Harvest Safety Standards</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/20">
                ICAR & FAO
              </span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[#8DA396]">
                  <span>Grain Silo Moisture:</span>
                  <span className="text-[#FAF8F2] font-bold">12.8% (Target &lt;14.0%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18261F] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#8DA396]">
                  <span>Tomato Cold Storage Temp:</span>
                  <span className="text-[#FAF8F2] font-bold">11.4°C (Target &gt;10.0°C)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18261F] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1411] border border-[#1A2820] text-[#9BB1A4] leading-relaxed">
                Zero aflatoxin risk detected across Nashik batch lots #LOT-2026-N4. Harvest ready for market dispatch.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: THE MARKET — LIVE MANDI ARBITRAGE CALCULATOR
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[#1F2E25] bg-[#0C120F] gsap-reveal">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              06 · Harvest Economics & Arbitrage
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              Know where to sell before loading the truck.
            </h2>
            <p className="text-base text-[#9BB1A4]">
              Adjust harvest volume below to calculate freight haulage deduction and net profit realization.
            </p>
          </div>

          <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
            {/* Volume Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#9BB1A4] uppercase">
                  Harvest Lot Volume (Quintals):
                </label>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {harvestVolume} quintals ({harvestVolume / 10} metric tons)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={harvestVolume}
                onChange={(e) => setHarvestVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-5 rounded-2xl bg-[#16201B] border border-[#273C30] space-y-2">
                <span className="text-xs font-mono text-[#63796E] uppercase">Local APMC (Nashik - 12 km)</span>
                <div className="text-2xl font-bold font-mono text-[#FAF8F2]">₹2,420 / qtl</div>
                <p className="text-xs text-[#8DA396]">Freight cost: ₹400 total (₹20/qtl)</p>
                <div className="pt-2 border-t border-[#1F2E25] text-xs font-mono flex justify-between">
                  <span>Net Farm Gate Revenue:</span>
                  <strong className="text-[#FAF8F2]">₹{((2420 - 20) * harvestVolume).toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 ring-1 ring-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-300 uppercase">Pimpalgaon APMC (34 km)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-[#090D0B] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-300">₹2,780 / qtl (+₹360/q)</div>
                <p className="text-xs text-emerald-400/80">Freight cost: ₹1,600 total (₹80/qtl)</p>
                <div className="pt-2 border-t border-emerald-500/30 text-xs font-mono flex justify-between">
                  <span className="text-emerald-200">Net Farm Gate Revenue:</span>
                  <strong className="text-emerald-300 font-bold">
                    ₹{((2780 - 80) * harvestVolume).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* Arbitrage Net Spread Banner */}
            <div className="rounded-xl bg-[#0E1411] border border-emerald-500/30 p-4 text-center text-xs font-mono text-emerald-300">
              Net Arbitrage Advantage: <strong className="text-base text-emerald-400">+₹{((2700 - 2400) * harvestVolume).toLocaleString()} Extra Income</strong> by routing to Pimpalgaon yard.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: THE CONNECTED WORKFLOW — STEP-BY-STEP REACTION
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto gsap-reveal">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-[#C2A06A] font-semibold">
            07 · Closed-Loop Synchronization
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
            How One Observation Cascades Across the System
          </h2>
          <p className="text-sm sm:text-base text-[#9BB1A4]">
            When an anomaly is detected, every connected module immediately responds.
          </p>
        </div>

        <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#16201B] border border-[#273C30] space-y-2">
              <span className="text-rose-400 font-bold block">1. Ingestion</span>
              <p className="text-[#8DA396] font-sans">
                Leaf photo uploaded to FieldSight AI detects Alternaria solani at 94.2% confidence.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#16201B] border border-[#273C30] space-y-2">
              <span className="text-cyan-400 font-bold block">2. Twin Simulation</span>
              <p className="text-[#8DA396] font-sans">
                3D Digital Twin updates Sector 2-B parcel status and suspends overhead sprinkler irrigation.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#16201B] border border-[#273C30] space-y-2">
              <span className="text-amber-400 font-bold block">3. Work Order</span>
              <p className="text-[#8DA396] font-sans">
                NEXFIELD Ops creates WO-2026-104 and automatically deducts Mancozeb stock from warehouse.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#16201B] border border-[#273C30] space-y-2">
              <span className="text-emerald-400 font-bold block">4. Market Timing</span>
              <p className="text-[#8DA396] font-sans">
                7-day pre-harvest safety interval scheduled; lot harvest dispatch aligned with peak APMC price window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: THE EXPERIENCE — GUIDED DEMO INVITATION
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-[#1F2E25] bg-gradient-to-b from-[#14231A] via-[#101713] to-[#090D0B] text-center gsap-reveal">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Evaluator Experience</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-extrabold text-[#FAF8F2] font-serif leading-tight">
            Step Into the Nashik Estate.
          </h2>

          <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed max-w-2xl mx-auto">
            Experience all six modules pre-configured with authentic agronomic data.
            Zero login required. Zero hardware installation. Instant, reproducible evaluation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 8-Step Guided Tour</span>
            </Link>

            <Link
              href="/demo/control"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium text-[#FAF8F2] bg-[#111714] hover:bg-[#16201B] border border-[#273C30] transition-colors"
            >
              <span>Explore Farm Freely</span>
              <ArrowRight className="w-4 h-4 text-[#9BB1A4]" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: THE FUTURE — OPEN SOURCE & MISSION
      ========================================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1F2E25] bg-[#090D0B] text-center text-xs text-[#63796E] space-y-4 gsap-reveal">
        <p className="max-w-2xl mx-auto leading-relaxed">
          NEXFIELD is an open-source initiative built by Tanish Bane and Rohan Panchal for ADAPPT 5.0.
          We believe precision agriculture, explainable computer vision, and transparent market economics should be in the hands of every farmer.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#9BB1A4]">
          <Link href="/about" className="hover:text-emerald-400 transition-colors">About Team</Link>
          <Link href="/solutions" className="hover:text-emerald-400 transition-colors">Solutions</Link>
          <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
          <a href="https://github.com/TanishBane/Nexfield" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a>
          <a href="https://nexfield-agritech.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Production Cloud</a>
        </div>
      </section>
    </div>
  );
}

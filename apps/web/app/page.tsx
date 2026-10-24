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
  ChevronRight,
  Warehouse,
  Truck,
  IndianRupee,
  Play,
  RotateCcw,
  Compass,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button, cn } from '@nexfield/ui';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import { CinematicEntrance } from '@/components/branding/CinematicEntrance';
import {
  FeatureComparisonCurtain,
  InteractiveStoryTabs,
  MetricTickerBar,
} from '@/components/ui/21st';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CinematicLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive Live State on Landing Page
  const [activeStoryChapter, setActiveStoryChapter] = useState<string>('observe');
  const [camHeatmapActive, setCamHeatmapActive] = useState<boolean>(true);
  const [irrigationRegime, setIrrigationRegime] = useState<'standard' | 'precision'>('precision');
  const [harvestVolume, setHarvestVolume] = useState<number>(20); // quintals

  // GSAP ScrollTrigger Animations
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const revealElements = containerRef.current?.querySelectorAll('.gsap-reveal');
      revealElements?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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

  const storyTabs = [
    { id: 'observe', label: 'Field Pathology', chapter: 'CH 02', badge: '5.13ms CV' },
    { id: 'simulate', label: 'Biophysical Twin', chapter: 'CH 04', badge: 'FAO-56' },
    { id: 'act', label: 'Mandi Arbitrage', chapter: 'CH 05', badge: 'Agmarknet' },
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#090D0B] text-[#FAF8F2] overflow-x-clip selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Signature Entrance Animation ("The Land Awakens") */}
      <CinematicEntrance />

      {/* =========================================================================
          CHAPTER 1: THE LAND — HERO VIEWPORT
      ========================================================================== */}
      <section className="relative min-h-[92vh] flex flex-col justify-between pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1F2E25] overflow-hidden">
        {/* Ambient Agronomic Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-950/30 via-[#173C2C]/20 to-transparent blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-12 right-12 w-[420px] h-[420px] bg-[#C2A06A]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Hero Top Content */}
        <div className="max-w-5xl mx-auto text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111714] border border-[#273C30] text-sm font-mono text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ADAPPT 5.0 · Domain 2: AI in Food Technology</span>
          </div>

          {/* Primary Editorial Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#FAF8F2] font-serif leading-[1.06]">
            Understand the land.<br />
            <span className="italic font-normal text-[#C2A06A]">Shape what comes next.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#9BB1A4] max-w-3xl mx-auto font-sans font-normal leading-relaxed">
            Observe your fields, simulate possibilities, and make decisive agricultural decisions.
            NEXFIELD unifies biophysical soil sensors, foliar computer vision, 3D digital twins, and wholesale mandi arbitrage into one closed-loop operating system.
          </p>

          {/* Official Tagline */}
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#C2A06A]">
            Observe. Predict. Simulate. Optimize. Grow.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore Guided Demo</span>
            </Link>

            <Link
              href="/demo/control"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-medium text-[#FAF8F2] bg-[#111714] hover:bg-[#16201B] border border-[#273C30] hover:border-[#3D5C4A] transition-all"
            >
              <span>Launch Control HUD</span>
              <ArrowRight className="w-4 h-4 text-[#9BB1A4]" />
            </Link>

            <Link
              href="/platform"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-[#9BB1A4] hover:text-emerald-400 transition-colors py-2 px-3"
            >
              <span>Discover the Platform</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Ambient Telemetry Ticker (21st.dev Component) */}
        <div className="max-w-6xl mx-auto w-full pt-16">
          <MetricTickerBar />
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 2: OBSERVE — MULTISPECTRAL FOLIAR COMPUTER VISION
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#1F2E25] relative">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Chapter Header */}
          <div className="gsap-reveal text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#C2A06A]">
              Chapter 2 · Observe
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              See What the Human Eye Misses
            </h2>
            <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
              Pathogens establish fungal colonies days before necrosis is visible to the naked eye.
              FieldSight AI captures multi-spectral foliar images, generating class-activation heatmaps in 5.13ms.
            </p>
          </div>

          {/* Interactive Foliar Diagnostic Visualizer */}
          <div className="gsap-reveal rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl">
            {/* Left: Leaf Inspection Canvas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#18261E]">
                <div className="flex items-center gap-2.5">
                  <ScanEye className="w-5 h-5 text-rose-400" />
                  <span className="text-sm font-bold text-[#FAF8F2]">FieldSight AI Foliar Studio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCamHeatmapActive(!camHeatmapActive)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    camHeatmapActive
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                      : 'bg-[#121B16] border-[#22352A] text-[#8EA698]'
                  }`}
                >
                  {camHeatmapActive ? 'Grad-CAM Heatmap: ON' : 'Grad-CAM Heatmap: OFF'}
                </button>
              </div>

              {/* Synthetic Leaf Viewport with Bounding Boxes */}
              <div className="relative aspect-[4/3] rounded-2xl bg-[#080D0A] border border-[#18261E] overflow-hidden flex items-center justify-center">
                {/* Botanical Leaf Art */}
                <svg viewBox="0 0 200 200" className="w-56 h-56 text-emerald-800/80 fill-current">
                  <path d="M100,10 C140,40 180,90 170,140 C160,180 120,195 100,195 C80,195 40,180 30,140 C20,90 60,40 100,10 Z" />
                </svg>

                {/* Concentric Lesion Spots (Alternaria Solani) */}
                <div className="absolute top-[42%] left-[45%] w-14 h-14 rounded-full border-2 border-amber-500/80 bg-amber-900/40 animate-pulse" />
                <div className="absolute top-[48%] left-[50%] w-6 h-6 rounded-full bg-rose-600/90" />
                <div className="absolute top-[58%] left-[36%] w-10 h-10 rounded-full border border-amber-500/70 bg-amber-900/30" />

                {/* Grad-CAM Heatmap Layer */}
                {camHeatmapActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rose-500/30 to-amber-500/40 mix-blend-screen transition-opacity duration-300" />
                )}

                {/* High-Tech Reticle Bounding Box */}
                <div className="absolute top-[38%] left-[40%] w-24 h-24 border border-rose-500/80 rounded-lg pointer-events-none flex flex-col justify-between p-1 text-[10px] font-mono text-rose-400">
                  <span className="bg-rose-950/90 px-1 w-fit rounded">Alternaria solani</span>
                  <span className="self-end bg-rose-950/90 px-1 rounded">Conf: 94.6%</span>
                </div>
              </div>
            </div>

            {/* Right: Diagnosis & ICAR Regimen */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-800/40">
                  Phytopathology Alert · Early Blight
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF8F2]">
                  Tomato Foliar Blight (Alternaria solani)
                </h3>
                <p className="text-sm sm:text-base text-[#9BB1A4] leading-relaxed">
                  Concentric target-like necrotic rings detected on lower canopy of Sector 2-B. High humidity (&gt;85% for 6h) promotes spore dispersal.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111714] border border-[#1F2E25] space-y-3">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  ICAR Recommended Chemical Rotation:
                </div>
                <div className="space-y-2 text-sm text-[#D7E5DC]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Mancozeb 75 WP @ 2.5 g/L foliar spray with uniform coverage.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Alternate with Azoxystrobin 23 SC @ 1 ml/L after 10 days.</span>
                  </div>
                </div>
              </div>

              <Link
                href="/demo/fieldsight"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Open Complete Inspection Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 3: UNDERSTAND — BEFORE/AFTER COMPARISON CURTAIN
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#1F2E25] relative">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Chapter Header */}
          <div className="gsap-reveal text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#C2A06A]">
              Chapter 3 · Understand
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              From Raw Data to Biological Ground Truth
            </h2>
            <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
              Data alone does not grow crops. NEXFIELD bridges the gap between sensor streams and agronomic action, replacing guesswork with deterministic biophysical certainty.
            </p>
          </div>

          {/* 21st.dev Component: FeatureComparisonCurtain */}
          <div className="gsap-reveal">
            <FeatureComparisonCurtain />
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 4: SIMULATE — 3D BIOPHYSICAL DIGITAL TWIN
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#1F2E25] relative">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Chapter Header */}
          <div className="gsap-reveal text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#C2A06A]">
              Chapter 4 · Simulate
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              Test Decisions Before Applying Them
            </h2>
            <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
              Every irrigation cycle alters soil matrix potential and root respiration.
              Simulate heatwave stress, drought tolerance, and fertigation regimes in our 3D biophysical mesh.
            </p>
          </div>

          {/* Interactive Simulation Preview Box */}
          <div className="gsap-reveal rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl">
            {/* Interactive Regime Switcher */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  FAO-56 Vadose Zone Hydrology
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF8F2]">
                  Irrigation Regime Comparison
                </h3>
                <p className="text-sm sm:text-base text-[#9BB1A4] leading-relaxed">
                  Switch between conventional scheduled flood irrigation and NEXFIELD precision drip fertigation to observe vadose matrix potential in real time.
                </p>
              </div>

              {/* Regime Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIrrigationRegime('standard')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    irrigationRegime === 'standard'
                      ? 'bg-amber-950/40 border-amber-600/60 text-[#FAF8F2]'
                      : 'bg-[#111714] border-[#1F2E25] text-[#9BB1A4] hover:border-[#273C30]'
                  }`}
                >
                  <div className="text-xs font-mono text-amber-400 font-semibold">Regime A</div>
                  <div className="font-bold text-sm sm:text-base mt-0.5">Conventional Flood</div>
                  <div className="text-xs text-[#8EA698] mt-1">Calendar-based flood</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIrrigationRegime('precision')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    irrigationRegime === 'precision'
                      ? 'bg-emerald-950/50 border-emerald-500 text-[#FAF8F2] ring-1 ring-emerald-500/30'
                      : 'bg-[#111714] border-[#1F2E25] text-[#9BB1A4] hover:border-[#273C30]'
                  }`}
                >
                  <div className="text-xs font-mono text-emerald-400 font-semibold">Regime B</div>
                  <div className="font-bold text-sm sm:text-base mt-0.5">Precision Drip</div>
                  <div className="text-xs text-emerald-400 mt-1">Matrix potential -33 kPa</div>
                </button>
              </div>

              {/* Calculated Results */}
              <div className="p-5 rounded-2xl bg-[#111714] border border-[#1F2E25] grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-[#8EA698] uppercase">Water Consumed:</span>
                  <div className="text-xl font-bold text-[#FAF8F2] tabular-nums mt-0.5">
                    {irrigationRegime === 'precision' ? '3,840 L / ha' : '5,820 L / ha'}
                  </div>
                  <span className={irrigationRegime === 'precision' ? 'text-emerald-400' : 'text-amber-400'}>
                    {irrigationRegime === 'precision' ? '34% Water Conserved' : 'Excess Percolation'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8EA698] uppercase">Root Matric Potential:</span>
                  <div className="text-xl font-bold text-[#FAF8F2] tabular-nums mt-0.5">
                    {irrigationRegime === 'precision' ? '-33 kPa' : '-12 kPa'}
                  </div>
                  <span className="text-emerald-400">
                    {irrigationRegime === 'precision' ? 'Optimal Field Capacity' : 'Saturated Vadose Zone'}
                  </span>
                </div>
              </div>

              <Link
                href="/demo/twin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Launch Interactive 3D Digital Twin</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: 3D Twin Preview Visual */}
            <div className="relative aspect-square rounded-2xl bg-[#080D0A] border border-[#18261E] overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
                <Layers className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#FAF8F2] font-serif">
                  WebGL 3D Soil Strata Mesh
                </h4>
                <p className="text-xs text-[#8EA698] max-w-xs">
                  Campbell-Norman soil hydraulic conductivity modeling for clay-loam substrates.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>R3F Hardware Accelerated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CHAPTER 5: ACT & EXPLORE — OPERATIONS, MARKETS & DEMO LAUNCH
      ========================================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Chapter Header */}
          <div className="gsap-reveal text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#C2A06A]">
              Chapter 5 · Act & Grow
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FAF8F2] font-serif">
              Close the Loop with Precision Realization
            </h2>
            <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
              Agronomic optimization is meaningless if market value is lost.
              Calculate real-time net realization across wholesale APMC mandis after freight, cess, and spoilage deductions.
            </p>
          </div>

          {/* Interactive Mandi Realization Slider */}
          <div className="gsap-reveal rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#18261E]">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#FAF8F2]">
                  Live Agmarknet Mandi Arbitrage Calculator
                </h3>
                <p className="text-xs sm:text-sm text-[#8EA698]">
                  Crop: Hybrid Tomato (Abhinav F1) · Baseline: Pimpalgaon APMC (₹2,240/qtl)
                </p>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#8EA698]">Lot Volume:</span>
                <span className="text-base font-bold text-[#FAF8F2] tabular-nums">{harvestVolume} Qtl</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={harvestVolume}
                  onChange={(e) => setHarvestVolume(Number(e.target.value))}
                  className="w-32 accent-emerald-500"
                />
              </div>
            </div>

            {/* APMC Yards Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
              {/* Nashik APMC */}
              <div className="p-6 rounded-2xl bg-[#111714] border border-emerald-600/40 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#FAF8F2] font-sans">Nashik APMC</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Optimal Market
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-[#8EA698]">Modal Price</div>
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums">₹2,450 / qtl</div>
                </div>
                <div className="space-y-1 text-xs text-[#8EA698] border-t border-[#18261E] pt-3">
                  <div className="flex justify-between">
                    <span>Freight (14 km):</span>
                    <span className="text-[#FAF8F2]">₹45 / qtl</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#FAF8F2] pt-1">
                    <span>Net Lot Realization:</span>
                    <span className="text-emerald-400">₹{(harvestVolume * 2368).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Pimpalgaon APMC */}
              <div className="p-6 rounded-2xl bg-[#111714] border border-[#1F2E25] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#FAF8F2] font-sans">Pimpalgaon APMC</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#16231C] text-[#8EA698] border border-[#273C30]">
                    Local Yard
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-[#8EA698]">Modal Price</div>
                  <div className="text-2xl font-bold text-[#D7E5DC] tabular-nums">₹2,240 / qtl</div>
                </div>
                <div className="space-y-1 text-xs text-[#8EA698] border-t border-[#18261E] pt-3">
                  <div className="flex justify-between">
                    <span>Freight (6 km):</span>
                    <span className="text-[#FAF8F2]">₹25 / qtl</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#FAF8F2] pt-1">
                    <span>Net Lot Realization:</span>
                    <span className="text-[#FAF8F2]">₹{(harvestVolume * 2182).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Vashi APMC */}
              <div className="p-6 rounded-2xl bg-[#111714] border border-[#1F2E25] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#FAF8F2] font-sans">Vashi APMC (Mumbai)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#16231C] text-cyan-400 border border-cyan-800/40">
                    Terminal Hub
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-[#8EA698]">Modal Price</div>
                  <div className="text-2xl font-bold text-[#FAF8F2] tabular-nums">₹2,820 / qtl</div>
                </div>
                <div className="space-y-1 text-xs text-[#8EA698] border-t border-[#18261E] pt-3">
                  <div className="flex justify-between">
                    <span>Freight (168 km):</span>
                    <span className="text-[#FAF8F2]">₹240 / qtl</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#FAF8F2] pt-1">
                    <span>Net Lot Realization:</span>
                    <span className="text-cyan-400">₹{(harvestVolume * 2538).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Demo Invitation Banner */}
          <div className="gsap-reveal rounded-3xl bg-gradient-to-r from-[#111C16] via-[#16241D] to-[#101713] border border-emerald-500/40 p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                ADAPPT 5.0 Demonstration Hub
              </span>
              <h3 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#FAF8F2]">
                Experience Living Earth Intelligence
              </h3>
              <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
                Take an interactive 8-step guided walkthrough across our pre-calibrated Nashik Tomato Precision Estate or launch your own farm workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Guided Demo Walkthrough</span>
              </Link>
              <Link
                href="/demo/control"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-[#FAF8F2] bg-[#111714] hover:bg-[#16201B] border border-[#273C30]"
              >
                <span>Direct Command HUD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

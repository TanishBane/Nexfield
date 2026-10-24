'use client';

import React from 'react';
import Link from 'next/link';
import {
  Droplets,
  AlertTriangle,
  TrendingDown,
  Warehouse,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';

export default function SolutionsPage() {
  const challenges = [
    {
      problem: 'Agricultural Water Scarcity & Over-Irrigation',
      impact:
        'Farmers flood fields based on visual soil surface dryness, wasting up to 40% of irrigation water and leeching nitrogen into groundwater.',
      solution: 'FAO-56 Biophysical Vadose Zone Modeling',
      mechanism:
        'NEXFIELD Twin calculates real rootzone volumetric water content (VWC %) across soil strata (0-60 cm) and determines exactly when the Management Allowed Depletion (MAD) threshold is crossed.',
      icon: Droplets,
      metric: '38,400 L Water Saved per Hectare',
    },
    {
      problem: 'Late Foliar Pathology Diagnosis & Crop Failure',
      impact:
        'Fungal pathogens like Early Blight (Alternaria solani) and Late Blight destroy entire harvests when symptoms are identified too late on leaf canopies.',
      solution: '5.13 ms Edge AI Inference with Grad-CAM',
      mechanism:
        'FieldSight AI runs local ONNX computer vision models in-browser, detecting microscopic necrotic lesions and prescribing ICAR-compliant chemical rotations before epidemic spread.',
      icon: AlertTriangle,
      metric: '96.4% Pathology Diagnostic Precision',
    },
    {
      problem: 'Opaque Mandi Price Information & Middleman Exploitation',
      impact:
        'Farmers sell to immediate local APMC yards at depressed rates because freight hauling expenses and distant mandi price spreads are difficult to calculate.',
      solution: 'Agmarknet Arbitrage & Freight Realization Engine',
      mechanism:
        'NEXFIELD Markets queries neighboring APMC wholesale modal prices, deducts vehicle diesel and toll expenses, and calculates net realization at the farm gate.',
      icon: TrendingDown,
      metric: '+₹280/q Net Revenue Realization',
    },
    {
      problem: 'Post-Harvest Grain & Fruit Storage Spoilage',
      impact:
        'Over 20% of Indian agricultural yield is lost post-harvest due to aflatoxin mold in high-moisture grain silos and chilling injury in cold storage.',
      solution: 'FAO & ICAR Storage Equilibrium Guard',
      mechanism:
        'NEXFIELD Ops monitors equilibrium moisture content (<14%) for wheat/corn and storage temperatures (>10°C) for solanaceous fruits to eliminate mold risk.',
      icon: Warehouse,
      metric: 'Eliminates Silo Aflatoxin Spoilage',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <Scale className="w-3.5 h-3.5" />
          <span>Agronomic Problem & Solution Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          Solutions for Real Agricultural Challenges
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          How NEXFIELD applies artificial intelligence and biophysical simulation to solve the most costly bottlenecks in Indian agriculture.
        </p>
      </div>

      {/* Challenge / Solution Cards */}
      <div className="space-y-8">
        {challenges.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="rounded-3xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1F2E25]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#18261F] text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F0F5F2] font-serif">
                    {c.problem}
                  </h3>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  {c.metric}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                    The Problem & Economic Loss
                  </h4>
                  <p className="text-[#8DA396] leading-relaxed">{c.impact}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    The NEXFIELD Solution: {c.solution}
                  </h4>
                  <p className="text-[#A7B5A0] leading-relaxed">{c.mechanism}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#14231A] to-[#101713] border border-[#273C30] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0F5F2] font-serif">
          Experience the Solutions Live
        </h2>
        <p className="text-sm sm:text-base text-[#9BB1A4] max-w-xl mx-auto leading-relaxed">
          See how these solutions are applied on the Nashik Tomato Precision Estate in our interactive demo.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Interactive Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

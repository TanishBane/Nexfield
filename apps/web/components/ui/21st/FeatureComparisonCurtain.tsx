'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Check, AlertCircle } from 'lucide-react';

interface ComparisonFeature {
  title: string;
  traditional: string;
  nexfield: string;
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    title: 'Foliar Crop Protection',
    traditional: 'Visual scouting 5–10 days after infection; broadcast blanket pesticide spray.',
    nexfield: '5.13ms edge computer vision with Grad-CAM localization & ICAR bio-remediation.',
  },
  {
    title: 'Root-Zone Irrigation',
    traditional: 'Fixed calendar flood scheduling; up to 45% water lost to deep vadose percolation.',
    nexfield: 'FAO-56 Penman-Monteith biophysical vadose matrix potential sensing; 34% water conserved.',
  },
  {
    title: 'Harvest Storage & Silo Quality',
    traditional: 'Unmeasured silo humidity; post-harvest grain spoilage losses averaging 18%.',
    nexfield: 'Equilibrium moisture monitoring (<14% critical threshold) & smart aeration triggers.',
  },
  {
    title: 'Wholesale Mandi Realization',
    traditional: 'Selling at local gate with zero freight arbitrage awareness; high middleman cess.',
    nexfield: 'Multi-APMC spatial price discovery with real-time freight deduction & MSP guarantee.',
  },
];

export function FeatureComparisonCurtain() {
  const [activeMode, setActiveMode] = useState<'nexfield' | 'traditional' | 'split'>('split');

  return (
    <div className="rounded-3xl bg-[#0E1511] border border-[#1E2E25] p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#18261E]">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C2A06A]">
            Chapter 3 · Understand
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#FAF8F2]">
            Conventional Practice vs. Living Earth Intelligence
          </h3>
        </div>

        {/* 21st-style Mode Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#090D0B] border border-[#1E2E25] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'split'
                ? 'bg-emerald-500 text-[#090D0B] font-bold shadow-md'
                : 'text-[#9BB1A4] hover:text-[#FAF8F2]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('nexfield')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'nexfield'
                ? 'bg-emerald-500 text-[#090D0B] font-bold shadow-md'
                : 'text-[#9BB1A4] hover:text-[#FAF8F2]'
            }`}
          >
            NEXFIELD
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('traditional')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'traditional'
                ? 'bg-rose-500/90 text-[#FAF8F2] font-bold shadow-md'
                : 'text-[#9BB1A4] hover:text-[#FAF8F2]'
            }`}
          >
            Conventional
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        {COMPARISON_FEATURES.map((feat, idx) => (
          <div
            key={feat.title}
            className="rounded-2xl bg-[#111714] border border-[#1F2E25] p-5 sm:p-6 space-y-4 hover:border-[#273C30] transition-colors"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base sm:text-lg font-bold text-[#FAF8F2] font-serif">
                {feat.title}
              </h4>
              <span className="text-xs font-mono text-[#63796E]">0{idx + 1} / 04</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Conventional Practice */}
              {(activeMode === 'split' || activeMode === 'traditional') && (
                <div className="p-4 rounded-xl bg-[#181113] border border-rose-900/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Conventional Guesswork</span>
                  </div>
                  <p className="text-sm text-[#BD9FA3] leading-relaxed">
                    {feat.traditional}
                  </p>
                </div>
              )}

              {/* NEXFIELD Intelligence */}
              {(activeMode === 'split' || activeMode === 'nexfield') && (
                <div className={`p-4 rounded-xl bg-[#0F1E16] border border-emerald-600/40 space-y-2 ${
                  activeMode === 'nexfield' ? 'md:col-span-2' : ''
                }`}>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>NEXFIELD Closed-Loop OS</span>
                  </div>
                  <p className="text-sm text-[#D1E7DA] leading-relaxed font-medium">
                    {feat.nexfield}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

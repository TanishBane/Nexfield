'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';

export function DemoBanner() {
  const { farmName, location, areaHectares, cropName, resetDemo } = useDemoStore();

  return (
    <div className="sticky top-0 z-50 bg-[#161D18] border-b border-[#2B3F33] px-3 sm:px-4 py-2 text-xs text-[#E1ECE5] select-none backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator & Domain Notice */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold text-[10px] tracking-wide border border-emerald-600/40 uppercase">
            <Sparkles className="h-3 w-3" />
            Interactive Demo
          </span>

          <span className="font-semibold text-emerald-300">
            {farmName}
          </span>
          <span className="text-[#7B9587] hidden md:inline">
            ({cropName} · {areaHectares} ha · {location})
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-[#1C2C23] border border-[#273E31] transition-colors"
            title="Reset simulated sensors and tasks back to initial baseline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>

          <Link
            href="/login"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-[#10B981] text-[#070B09] hover:bg-[#34D399] transition-all shadow-sm"
          >
            <span>Exit to Real Workspace</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

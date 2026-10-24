'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowRight, CheckCircle2, Droplets, Sun, Activity, Zap, ExternalLink } from 'lucide-react';

export default function PlatformControlPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Module 01</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          NEXFIELD Control: Farm Command Center
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          The central pulse of your agricultural estate. Real-time telemetry synthesis that answers the only four questions that matter:
          Which farm? What is happening today? What needs attention? What action should I take next?
        </p>
      </div>

      {/* Feature Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Rootzone Soil Hydrology</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Continuous monitoring of volumetric water content (VWC %) across stratified soil layers (0-15 cm, 15-30 cm, 30-60 cm).
            Calibrated against specific soil texture types (silt loam, clay loam, alluvial) to maintain moisture within the Management Allowed Depletion (MAD) window.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time Vadose Zone Infiltration tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Permanent wilting point (PWP) avoidance alerts</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Microclimate & Phenology</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Local weather telemetry aggregated with Growing Degree Day (GDD) calculations and BBCH growth stage tracking.
            Monitors atmospheric Vapor Pressure Deficit (VPD) to identify transpiration stress windows.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>BBCH 65 Flowering & Fruit Set timeline tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Solar irradiance ($W/m^2$) & ambient relative humidity</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-emerald-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Explore Control in the Interactive Demo</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Experience the live Nashik Tomato Precision Estate command center with zero setup.
          </p>
        </div>
        <Link
          href="/demo/control"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch Demo Control</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, CheckCircle2, Droplets, Compass, Box } from 'lucide-react';

export default function PlatformTwinPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Module 03</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          NEXFIELD Twin: 3D Biophysical Field Simulator
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          Simulate before you irrigate. An interactive 3D WebGL digital twin implementing FAO-56 dual crop coefficient hydrology,
          vadose zone infiltration profiles, and scenario comparison grids to eliminate agricultural water waste.
        </p>
      </div>

      {/* 3D Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Subterranean Soil Cutaway</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Orbit and inspect your field parcel in 3D. Toggle subterranean cutaways revealing the multi-layer soil moisture horizon
            (surface crust, upper rootzone, deep taproot recharge zone).
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-time color contour mapping of volumetric water content</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pressure-compensated drip line emitter visualization</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Scenario Comparison Engine</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Compare irrigation regimes before opening valves. Benchmark standard scheduled flooding against regulated deficit
            and precision sensor-driven fertigation to quantify water savings and yield impacts.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>FAO-56 yield response factor ($K_y$) penalty modeling</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct conversion of optimal scenarios into dispatched work orders</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-cyan-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Interact with the 3D Twin</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Explore the Nashik Tomato 3D estate, orbit the canopy, and inspect soil layers live in browser.
          </p>
        </div>
        <Link
          href="/demo/twin"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch 3D Twin Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowRight, CheckCircle2, ShieldCheck, Thermometer, Warehouse } from 'lucide-react';

export default function PlatformOperationsPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-amber-400">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Module 05</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          NEXFIELD Ops: Operations, Inputs & Food Quality
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          Closing the loop between field observations and harvest realization. NEXFIELD Ops combines farm work orders,
          agrochemical stock custody, and post-harvest storage safety into a unified chain-of-custody ledger.
        </p>
      </div>

      {/* Feature Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Operational Ledger & Tasks</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Manage field tasks, fertigation dispatches, and pest scouting work orders. Completing a spray order automatically
            deducts the required agrochemical dosage from the warehouse inventory and logs the operator, lot, and timestamp.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-time warehouse inventory reconciliation upon task completion</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Pre-harvest withholding period (PHI) compliance tracking</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
            <Warehouse className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Post-Harvest Food Quality Guard</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Addressing ADAPPT 5.0 Domain 2: AI in Food Technology. Monitors grain silo equilibrium moisture content (&lt;14%)
            to prevent Aspergillus aflatoxin development, and cold storage temperatures (&gt;10°C for tomatoes) to prevent chilling injury and storage mold.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grain silo moisture and equilibrium relative humidity safety alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cold storage temperature decay & condensation risk modeling</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-amber-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Manage Tasks & Harvests in Demo</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Review active work orders, inventory deductions, and food quality checks on the Nashik Tomato estate.
          </p>
        </div>
        <Link
          href="/demo/ops"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch Ops Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

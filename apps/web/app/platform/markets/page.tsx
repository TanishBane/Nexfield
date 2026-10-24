'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, CheckCircle2, Truck, IndianRupee, BarChart3 } from 'lucide-react';

export default function PlatformMarketsPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Module 06</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          NEXFIELD Markets: APMC Mandi Price Intelligence
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          Where should you sell your harvest today? NEXFIELD Markets compares live regional APMC wholesale prices,
          deducts vehicle freight and toll expenses, and calculates true net realization at the farm gate.
        </p>
      </div>

      {/* Feature Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Agmarknet Wholesale Comparison</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Direct aggregation of wholesale arrivals, minimum, maximum, and modal trading prices across neighboring district mandis
            (e.g., Nashik APMC vs Pimpalgaon vs Lasalgaon). Benchmarked against official CACP Minimum Support Prices (MSP).
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time modal price spread highlighting regional price premiums</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arrival volume (quintals) trends to avoid market gluts and crashes</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 text-sky-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Freight-Adjusted Net Realization</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            A higher price in a distant mandi is only valuable if it exceeds the freight haulage costs.
            NEXFIELD calculates vehicle diesel cost, loading fees, and road tolls per quintal, revealing true net profit.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Multi-tier transport engine (mini-truck, tractor-trolley, 10-wheeler)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Net profit spread calculation with clear &ldquo;Sell Here&rdquo; recommendation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-emerald-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Compare Mandi Spreads in Demo</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Evaluate the ₹2,780/q Pimpalgaon vs ₹2,420/q Nashik spread and calculate net farm revenue gains.
          </p>
        </div>
        <Link
          href="/demo/markets"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch Markets Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, MessageSquare, ShieldCheck, Database } from 'lucide-react';

export default function PlatformIntelligencePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-violet-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 04</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          NEXFIELD Intelligence: Agronomic Copilot
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          An agricultural copilot designed specifically for estate managers and agronomists.
          Unlike generic chat assistants, NEXFIELD Intelligence cites your farm&apos;s real sensor telemetry,
          crop phenological stage, and verified agronomic literature before proposing any action.
        </p>
      </div>

      {/* Feature Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-violet-950/80 text-violet-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Telemetry Grounding</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            Every recommendation is conditioned on current farm variables: relative humidity, solar radiation, soil volumetric water content,
            and growth stage (BBCH). If weather indicates thermal inversion or impending rain, fungicide spray recommendations are automatically delayed.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              <span>Real-time weather window verification before agrochemical application</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
              <span>FRAC fungicide mode-of-action rotation to prevent resistance</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Actionable Work Order Generation</h3>
          <p className="text-sm text-[#8DA396] leading-relaxed">
            The copilot does not stop at answering questions. When you agree with a recommendation, you can dispatch it directly
            into NEXFIELD Ops as a tracked work order with assigned parcel, dosage, and safety withholding interval.
          </p>
          <ul className="space-y-2 pt-2 text-xs text-[#9BB1A4]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>One-click conversion of conversational advice into field tasks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Automatic inventory check and agrochemical stock verification</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-violet-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Chat with the Copilot</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Test preset agronomic prompts on the Nashik Tomato estate in our interactive demo.
          </p>
        </div>
        <Link
          href="/demo/intelligence"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch Copilot Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

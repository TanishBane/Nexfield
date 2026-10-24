'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  Cpu,
  Layers,
  Wrench,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Observe',
      subtitle: 'In-Field Ingestion & Telemetry',
      desc: 'Connect soil capacitance probes, microclimate weather stations, and drone/smartphone foliar images. Data is ingested with full provenance and timestamping.',
      icon: Eye,
      color: 'emerald',
      detail: 'Sensors record soil volumetric water content (VWC %), vapor pressure deficit (VPD), canopy NDVI, and temperature.',
    },
    {
      num: '02',
      title: 'Predict',
      subtitle: 'Edge AI Foliar Pathology',
      desc: 'FieldSight AI executes 5.13 ms in-browser ONNX inference on crop leaf photos, diagnosing fungal pathogens and generating explainable Grad-CAM heatmaps.',
      icon: Cpu,
      color: 'rose',
      detail: 'Detects Early Blight (Alternaria solani), Late Blight, and nutrient chlorosis before necrosis spreads across parcels.',
    },
    {
      num: '03',
      title: 'Simulate',
      subtitle: '3D Biophysical Digital Twin',
      desc: 'Run first-principles FAO-56 dual crop coefficient simulations to test irrigation regimens and stress thresholds before turning on drip lines.',
      icon: Layers,
      color: 'cyan',
      detail: 'Compares deficit irrigation vs precision scheduling to conserve tens of thousands of liters of water without vegetative yield penalties.',
    },
    {
      num: '04',
      title: 'Optimize',
      subtitle: 'Field Tasks & Food Storage Quality',
      desc: 'Convert recommendations directly into work orders. Track agrochemical stock custody, pre-harvest withholding intervals, and grain silo moisture.',
      icon: Wrench,
      color: 'amber',
      detail: 'Monitors grain equilibrium moisture (<14%) to eliminate Aspergillus mold and cold storage temperatures to stop chilling injury.',
    },
    {
      num: '05',
      title: 'Grow & Realize',
      subtitle: 'Mandi Arbitrage & Farm Gate Realization',
      desc: 'Compare wholesale APMC market prices across district yards, deduct diesel freight and vehicle tare, and sell your harvest where net returns are highest.',
      icon: TrendingUp,
      color: 'emerald',
      detail: 'Uncovers price spreads like +₹280/quintal net gain between Nashik and Pimpalgaon mandis, putting real extra revenue in the farmer&apos;s hands.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <Workflow className="w-3.5 h-3.5" />
          <span>The Closed-Loop Agronomic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          How NEXFIELD Works
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          From first soil moisture reading to final APMC mandi sale. Here is how NEXFIELD turns everyday agricultural observations into optimized harvest income.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-[#1F2E25] before:hidden md:before:block">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative flex flex-col md:flex-row items-start gap-6 rounded-2xl bg-[#111714] border border-[#273C30] p-6 sm:p-8 hover:border-emerald-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-mono font-extrabold text-base">
                {step.num}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-2xl font-bold text-[#F0F5F2] font-serif">{step.title}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{step.subtitle}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#16201B] border border-[#273C30] flex items-center justify-center text-[#9BB1A4]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-sm text-[#8DA396] leading-relaxed">{step.desc}</p>

                <div className="rounded-xl bg-[#0E1411] border border-[#1A2820] p-3 text-xs text-[#9BB1A4] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step.detail}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#14231A] to-[#101713] border border-[#273C30] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F0F5F2] font-serif">
          Ready to Experience the Journey?
        </h2>
        <p className="text-sm sm:text-base text-[#9BB1A4] max-w-xl mx-auto leading-relaxed">
          Walk through all five steps with our interactive demonstration of the Nashik Tomato Precision Estate.
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

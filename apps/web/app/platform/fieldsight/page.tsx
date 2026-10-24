'use client';

import React from 'react';
import Link from 'next/link';
import { ScanEye, ArrowRight, CheckCircle2, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function PlatformFieldSightPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link href="/platform" className="text-xs font-mono text-emerald-400 hover:underline">
          ← Back to Platform Overview
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-rose-400">
          <ScanEye className="w-3.5 h-3.5" />
          <span>Module 02</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          FieldSight AI: Visual Foliar Pathology
        </h1>
        <p className="text-lg text-[#9BB1A4] leading-relaxed max-w-3xl">
          Edge-optimized computer vision that detects foliar disease lesions before necrotic spread causes irreversible harvest loss.
          Transparent, explainable AI featuring Grad-CAM activation heatmaps and ICAR-approved chemical prescriptions.
        </p>
      </div>

      {/* Technical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
          <div className="text-2xl font-mono font-extrabold text-emerald-400">5.13 ms</div>
          <h4 className="text-base font-bold text-[#F0F5F2] font-serif">ONNX Edge Inference</h4>
          <p className="text-xs text-[#8DA396] leading-relaxed">
            Compiled graph executed on CPU without GPU overhead, designed for rural edge nodes and low-bandwidth connections.
          </p>
        </div>
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
          <div className="text-2xl font-mono font-extrabold text-rose-400">Grad-CAM</div>
          <h4 className="text-base font-bold text-[#F0F5F2] font-serif">Spatial Explainability</h4>
          <p className="text-xs text-[#8DA396] leading-relaxed">
            Gradient-weighted Class Activation Maps highlight the exact pixel regions driving the diagnostic prediction.
          </p>
        </div>
        <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-3">
          <div className="text-2xl font-mono font-extrabold text-cyan-400">ICAR & CIBRC</div>
          <h4 className="text-base font-bold text-[#F0F5F2] font-serif">Agronomic Grounding</h4>
          <p className="text-xs text-[#8DA396] leading-relaxed">
            Prescriptions comply with Indian Council of Agricultural Research guidelines, withholding periods, and bio-alternatives.
          </p>
        </div>
      </div>

      {/* Pathogens Covered */}
      <div className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4">
        <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Validated Crop Foliar Pathogens</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-[#9BB1A4]">
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Tomato Early Blight</span>
            <span className="font-mono text-[#63796E]">Alternaria solani</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Tomato Late Blight</span>
            <span className="font-mono text-[#63796E]">Phytophthora infestans</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Tomato Yellow Leaf Curl</span>
            <span className="font-mono text-[#63796E]">TYLCV (Begomovirus)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Septoria Leaf Spot</span>
            <span className="font-mono text-[#63796E]">Septoria lycopersici</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Wheat Yellow Rust</span>
            <span className="font-mono text-[#63796E]">Puccinia striiformis</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16201B] border border-[#273C30]">
            <span className="font-semibold text-[#F0F5F2] block mb-1">Nitrogen Deficiency Chlorosis</span>
            <span className="font-mono text-[#63796E]">Nutritional Chlorosis</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-[#14231A] border border-emerald-500/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#F0F5F2] font-serif">Test Foliar Pathology in Demo Mode</h3>
          <p className="text-sm text-[#9BB1A4] mt-1">
            Analyze sample foliar scans and toggle real Grad-CAM heatmaps interactively.
          </p>
        </div>
        <Link
          href="/demo/fieldsight"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shrink-0"
        >
          <span>Launch FieldSight Demo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

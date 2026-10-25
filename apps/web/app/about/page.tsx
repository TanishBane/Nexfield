'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  Award,
  Code2,
  Users,
  BookOpen,
  Cpu,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@nexfield/ui';

export default function AboutPage() {
  const team = [
    {
      name: 'Tanish Bane',
      handle: '@TanishBane',
      role: 'Frontend Lead & Product Architect',
      github: 'https://github.com/TanishBane',
      bio: 'Architect of the Next.js App Router experience, 3D WebGL field visualizations, design system tokens, and zero-login public demo engine. Co-author of the multi-agent collaboration governance matrix.',
    },
    {
      name: 'Rohan Panchal',
      handle: '@panchalrohan44',
      role: 'Backend Lead & ML Systems Architect',
      github: 'https://github.com/panchalrohan44',
      bio: 'Architect of the FastAPI async engine, PostGIS spatial models, compiled ONNX foliar diagnostic pipelines, and wholesale Agmarknet APMC mandi market scraping adapters.',
    },
  ];

  const scientificFoundations = [
    {
      title: 'ICAR Agronomic Protocols',
      org: 'Indian Council of Agricultural Research',
      desc: 'Disease diagnosis and chemical rotation schedules strictly follow published ICAR crop protection bulletins (IIWBR Karnal for Wheat, IIVR Varanasi for Tomato), avoiding fungicide resistance.',
      icon: BookOpen,
    },
    {
      title: 'Stewart Water-Yield Production',
      org: 'FAO Irrigation & Drainage Series',
      desc: 'Digital Twin simulates yield sensitivity to moisture stress via the empirical water-production function (1 - Ya/Ym) = Ky(1 - ETa/ETm), parameterized with crop response factors (Ky = 1.05 for wheat).',
      icon: Cpu,
    },
    {
      title: 'Edge Computer Vision & Saliency',
      org: 'ONNX Runtime & Grad-CAM',
      desc: 'FieldSight AI operates in-browser/edge inference on quantized MobileNetV3 architectures, computing spatial gradient activations to highlight exact pathological lesions for human inspection.',
      icon: ShieldCheck,
    },
    {
      title: 'APMC Wholesale Price Discovery',
      org: 'Agmarknet & CEDA Market Spreads',
      desc: 'Live terminal market modal prices cross-referenced against Government Minimum Support Price (MSP) benchmarks, with realistic multi-factor freight deduction models.',
      icon: Compass,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#203127] text-xs font-mono text-emerald-400">
          <Users className="w-3.5 h-3.5" />
          <span>The Engineering Team & Scientific Pedigree</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F1F6F3] font-serif">
          About NEXFIELD
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          Developed for ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology.
          NEXFIELD is an open-source agricultural intelligence operating system dedicated to empowering farmers with transparent, explainable technology.
        </p>
      </div>

      {/* Hackathon Mission Box */}
      <div className="rounded-3xl bg-[#111714] border border-[#203127] p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3 text-emerald-400 font-mono text-sm">
          <Award className="w-5 h-5 text-[#D7B678]" />
          <span className="text-[#D7B678]">ADAPPT 5.0 Problem Statement</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F6F3] font-serif">
          Domain 2: Artificial Intelligence in Food Technology
        </h2>
        <p className="text-sm sm:text-base text-[#CADCD1] leading-relaxed">
          The challenge tasks engineering teams with deploying AI, machine learning, and environmental data to solve real food security challenges.
          NEXFIELD addresses the complete agricultural lifecycle:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-[#0D1410] border border-[#1E2E25] space-y-1">
            <h3 className="font-semibold text-emerald-400">On-Field Crop Protection</h3>
            <p className="text-[#9BB1A4] leading-relaxed">
              Preventing fungal epidemics with 5.13 ms foliar pathology and ICAR-approved chemical rotation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1410] border border-[#1E2E25] space-y-1">
            <h3 className="font-semibold text-emerald-400">Water Conservation</h3>
            <p className="text-[#9BB1A4] leading-relaxed">
              Biophysical 3D simulation of planned irrigation volume and Stewart water-yield modeling to eliminate waste.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1410] border border-[#1E2E25] space-y-1">
            <h3 className="font-semibold text-emerald-400">Post-Harvest Quality</h3>
            <p className="text-[#9BB1A4] leading-relaxed">
              Monitoring grain silo equilibrium moisture (&lt;14%) and cold storage temperatures to stop Aspergillus spoilage.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Foundations */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#F1F6F3] font-serif">Scientific Foundations & Domain Models</h2>
          <p className="text-sm text-[#9BB1A4]">
            Grounding AI recommendations in peer-reviewed agronomy rather than unverified black-box outputs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scientificFoundations.map((foundation) => {
            const Icon = foundation.icon;
            return (
              <div
                key={foundation.title}
                className="p-5 rounded-2xl bg-[#111714] border border-[#203127] space-y-2.5 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#F1F6F3]">{foundation.title}</h3>
                    <span className="text-[11px] font-mono text-[#D7B678] block">{foundation.org}</span>
                  </div>
                </div>
                <p className="text-xs text-[#9BB1A4] leading-relaxed">{foundation.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#F1F6F3] font-serif text-center">Core Engineering Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-[#111714] border border-[#203127] p-6 space-y-4 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#F1F6F3]">{member.name}</h3>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{member.handle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#16201B] text-[#D7B678] border border-[#203127]">
                    ADAPPT 5.0
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#34D399] uppercase tracking-wider">{member.role}</p>
                <p className="text-xs sm:text-sm text-[#CADCD1] leading-relaxed">{member.bio}</p>
              </div>
              <div className="pt-3 border-t border-[#18251E]">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#9BB1A4] hover:text-[#F1F6F3] transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect GitHub Commits</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#14231A] to-[#101713] border border-[#203127] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F1F6F3] font-serif">
          Experience NEXFIELD in Action
        </h2>
        <p className="text-sm sm:text-base text-[#9BB1A4] max-w-xl mx-auto leading-relaxed">
          Open the zero-login public demonstration to inspect real farm observations, run foliar computer vision, and simulate irrigation scenarios.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Launch Interactive Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/control"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#111714] text-[#F1F6F3] hover:bg-[#16201B] border border-[#203127] transition-all"
          >
            <span>Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

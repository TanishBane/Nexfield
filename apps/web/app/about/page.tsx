'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Award, Code2, Users, Heart } from 'lucide-react';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

export default function AboutPage() {
  const team = [
    {
      name: 'Tanish Bane',
      handle: '@TanishBane',
      role: 'Frontend Lead & Product Architect',
      github: 'https://github.com/TanishBane',
      bio: 'Leads the Next.js App Router frontend, 3D WebGL field visualizations, design systems, and user experience. Architectural author of NEXFIELD’s multi-agent governance and digital twin experience.',
    },
    {
      name: 'Rohan Panchal',
      handle: '@panchalrohan44',
      role: 'Backend Lead & ML Systems Architect',
      github: 'https://github.com/panchalrohan44',
      bio: 'Leads the FastAPI async backend, PostGIS spatial models, ONNX foliar diagnostic model inference, and live Agmarknet mandi scraping pipelines.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
          <Users className="w-3.5 h-3.5" />
          <span>The Team Behind NEXFIELD</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0F5F2] font-serif">
          About NEXFIELD
        </h1>
        <p className="text-base sm:text-lg text-[#9BB1A4] leading-relaxed">
          Developed for ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology.
          NEXFIELD is an open-source agricultural intelligence operating system dedicated to empowering farmers with transparent, explainable technology.
        </p>
      </div>

      {/* Hackathon Mission Box */}
      <div className="rounded-3xl bg-[#111714] border border-[#273C30] p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-3 text-emerald-400 font-mono text-sm">
          <Award className="w-5 h-5" />
          <span>ADAPPT 5.0 Hackathon Problem Statement</span>
        </div>
        <h3 className="text-2xl font-bold text-[#F0F5F2] font-serif">
          Domain 2: Artificial Intelligence in Food Technology
        </h3>
        <p className="text-sm sm:text-base text-[#8DA396] leading-relaxed">
          The challenge tasks engineering teams with deploying AI, machine learning, and environmental data to solve real food security challenges.
          NEXFIELD addresses the complete agricultural lifecycle:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-[#9BB1A4]">
          <div className="p-4 rounded-xl bg-[#16201B] border border-[#1F2E25]">
            <h4 className="font-semibold text-[#F0F5F2] mb-1">On-Field Crop Protection</h4>
            <p className="text-[#63796E]">Preventing fungal epidemics with 5.13 ms foliar pathology and ICAR-approved chemical rotation.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#16201B] border border-[#1F2E25]">
            <h4 className="font-semibold text-[#F0F5F2] mb-1">Water Conservation</h4>
            <p className="text-[#63796E]">Biophysical 3D simulation of vadose zone infiltration to eliminate over-irrigation.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#16201B] border border-[#1F2E25]">
            <h4 className="font-semibold text-[#F0F5F2] mb-1">Post-Harvest Quality</h4>
            <p className="text-[#63796E]">Monitoring grain silo equilibrium moisture (&lt;14%) and cold storage temperatures to stop spoilage.</p>
          </div>
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#F0F5F2] font-serif text-center">Core Contributors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-[#111714] border border-[#273C30] p-6 space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#F0F5F2]">{member.name}</h3>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-emerald-400 hover:underline"
                  >
                    {member.handle}
                  </a>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#16201B] text-[#9BB1A4] border border-[#273C30]">
                  Maintainer
                </span>
              </div>
              <p className="text-xs font-semibold text-[#34D399] uppercase tracking-wider">{member.role}</p>
              <p className="text-xs sm:text-sm text-[#8DA396] leading-relaxed">{member.bio}</p>
              <div className="pt-2 border-t border-[#1F2E25]">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#9BB1A4] hover:text-[#F0F5F2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>View GitHub Profile</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source Notice */}
      <div className="rounded-2xl bg-[#0E1411] border border-[#1A2820] p-6 text-center space-y-3">
        <p className="text-xs text-[#63796E]">
          NEXFIELD is released under the permissive <strong className="text-[#9BB1A4]">MIT License</strong>.
          We believe agricultural intelligence should be open, verifiable, and accessible to farmers everywhere.
        </p>
        <a
          href="https://github.com/TanishBane/Nexfield"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
        >
          <span>Star & Fork on GitHub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-[#1C2C22] bg-[#0A0F0D] text-[#8FA396] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Logo & Short Description (4 cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <Link href="/" className="inline-flex items-center group">
              <NexfieldLogo size="md" subtitle="Agricultural Intelligence OS" />
            </Link>
            <p className="text-sm text-[#7D9487] leading-relaxed max-w-sm">
              The closed-loop agricultural intelligence platform unifying biophysical soil physics, foliar AI diagnostics, 3D field twins, farm operations, and wholesale mandi price intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A15] border border-[#1E2E25] text-xs text-[#8FA396]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ADAPPT 5.0 · AI in Food Technology</span>
            </div>
          </div>

          {/* CENTER: Platform, Explore, Resources (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {/* Platform */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F2]">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/platform/control" className="hover:text-emerald-400 transition-colors">
                    Command Center
                  </Link>
                </li>
                <li>
                  <Link href="/platform/fieldsight" className="hover:text-emerald-400 transition-colors">
                    FieldSight AI
                  </Link>
                </li>
                <li>
                  <Link href="/platform/twin" className="hover:text-emerald-400 transition-colors">
                    Digital Twin 3D
                  </Link>
                </li>
                <li>
                  <Link href="/platform/intelligence" className="hover:text-emerald-400 transition-colors">
                    Agronomic Copilot
                  </Link>
                </li>
                <li>
                  <Link href="/platform/operations" className="hover:text-emerald-400 transition-colors">
                    Operations Ledger
                  </Link>
                </li>
                <li>
                  <Link href="/platform/markets" className="hover:text-emerald-400 transition-colors">
                    Mandi Markets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F2]">
                Explore
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/demo" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors inline-flex items-center gap-1">
                    <span>Guided Tour</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/demo/control" className="hover:text-emerald-400 transition-colors">
                    Interactive Demo
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-emerald-400 transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-emerald-400 transition-colors">
                    About & Team
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F2]">
                Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/data-center" className="hover:text-emerald-400 transition-colors">
                    Data Center
                  </Link>
                </li>
                <li>
                  <Link href="/control" className="hover:text-emerald-400 transition-colors">
                    Farm Command Center
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-emerald-400 transition-colors">
                    Interactive Showcase
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Project & Source Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF8F2]">
              Open Technology
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/TanishBane/Nexfield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TanishBane/Nexfield/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  MIT Open Source License
                </a>
              </li>
              <li>
                <a
                  href="https://nexfield-agritech.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Live Production Cloud
                </a>
              </li>
              <li className="pt-1 text-[#647C6E]">
                <span>Architected by Tanish Bane & Rohan Panchal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM: Copyright, License, Contributors */}
        <div className="pt-6 border-t border-[#1C2C22] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#647C6E]">
          <div>
            <span>© 2026 NEXFIELD · MIT Licensed · Open-Source Agricultural Intelligence</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#556D60]">
            <span>Next.js 15 · Three.js · FastAPI · ONNX Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

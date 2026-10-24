'use client';

import React from 'react';
import Link from 'next/link';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import { ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-[#1F2E25] bg-[#090D0B] text-[#9BB1A4] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <NexfieldLogo size="md" />
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold tracking-tight text-[#F0F5F2] text-base">
                  NEXFIELD
                </span>
                <span className="text-[#63796E] font-medium tracking-wide uppercase text-[9px]">
                  Agricultural Intelligence Operating System
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#8DA396] max-w-sm leading-relaxed">
              Understand the land. Shape what comes next. Unifying biophysical sensors, foliar pathology,
              first-principles 3D digital twins, operational ledgers, and Mandi arbitrage into one closed-loop platform.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111714] border border-[#273C30] text-xs text-[#9BB1A4]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ADAPPT 5.0 · Domain 2: AI in Food Technology</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F0F5F2] font-semibold mb-4">
              Platform Modules
            </h4>
            <ul className="space-y-2.5 text-sm">
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
                  Farm Operations
                </Link>
              </li>
              <li>
                <Link href="/platform/markets" className="hover:text-emerald-400 transition-colors">
                  Mandi Markets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Experience */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F0F5F2] font-semibold mb-4">
              Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/demo" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1">
                  <span>Guided Demo Tour</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-emerald-400 transition-colors">
                  Agronomic Solutions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About & Mission
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Farmer Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Open Source */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F0F5F2] font-semibold mb-4">
              Open Technology
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/TanishBane/Nexfield"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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
                  Production Vercel Cloud
                </a>
              </li>
              <li>
                <span className="text-[#63796E] text-xs">
                  Maintained by Tanish Bane & Rohan Panchal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1F2E25] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#63796E]">
          <div className="flex items-center gap-2">
            <span>© 2026 NEXFIELD</span>
            <span>·</span>
            <span>The Agricultural Intelligence Operating System</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[#556D60]">
              Built with Next.js 15, Three.js, GSAP & FastAPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

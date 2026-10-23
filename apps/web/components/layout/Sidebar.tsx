'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanEye,
  Layers,
  Sparkles,
  ClipboardList,
  TrendingUp,
  Sprout,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';

export const NAVIGATION_ITEMS = [
  {
    name: 'NEXFIELD Control',
    href: '/control',
    icon: LayoutDashboard,
    badge: 'HQ',
    description: 'Farm Command Center',
  },
  {
    name: 'FieldSight AI',
    href: '/fieldsight',
    icon: ScanEye,
    badge: 'Vision',
    description: 'Crop Pathology & Heatmaps',
  },
  {
    name: 'NEXFIELD Twin',
    href: '/twin',
    icon: Layers,
    badge: 'Sim',
    description: 'Biophysical Simulator',
  },
  {
    name: 'NEXFIELD Intelligence',
    href: '/intelligence',
    icon: Sparkles,
    badge: 'LLM',
    description: 'Agronomic Copilot',
  },
  {
    name: 'NEXFIELD Ops',
    href: '/ops',
    icon: ClipboardList,
    badge: 'Ops',
    description: 'Tasks, Stocks & Harvests',
  },
  {
    name: 'NEXFIELD Markets',
    href: '/markets',
    icon: TrendingUp,
    badge: 'Mandi',
    description: 'Prices & Arbitrage',
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#1B2921] bg-[#0A0F0D] transition-all duration-200 select-none',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header — Fixed Height: 56px */}
      <div className="flex h-14 items-center gap-3 border-b border-[#1B2921] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 shadow-sm shadow-emerald-950">
          <Sprout className="h-5 w-5" />
        </div>
        {isSidebarOpen ? (
          <div className="flex flex-col overflow-hidden">
            <span className="font-sans font-bold tracking-wider text-[#F1F6F3] text-sm flex items-center gap-1.5">
              NEXFIELD
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                v1.0
              </span>
            </span>
            <span className="text-[11px] text-[#768F80] truncate">
              Agricultural Intelligence OS
            </span>
          </div>
        ) : null}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2">
          {isSidebarOpen ? (
            <span className="text-[10px] font-semibold tracking-wider text-[#5A7365] uppercase">
              Core Modules
            </span>
          ) : (
            <div className="h-px bg-[#18261E] my-1" />
          )}
        </div>

        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[#14231A] text-emerald-300 border border-[#21382A] shadow-inner font-semibold'
                  : 'text-[#96ACA0] hover:bg-[#101A14] hover:text-[#E2ECE5] border border-transparent'
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-emerald-400' : 'text-[#647C6E] group-hover:text-emerald-400'
                )}
              />

              {isSidebarOpen ? (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <div className="flex flex-col truncate">
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] text-[#5C7467] group-hover:text-[#7A9687] font-normal truncate">
                      {item.description}
                    </span>
                  </div>
                  {isActive ? (
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-1" />
                  ) : null}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* Footer System Status — Fixed Chrome */}
      <div className="border-t border-[#1B2921] p-3">
        {isSidebarOpen ? (
          <div className="rounded-lg bg-[#0F1713] border border-[#1E2E25] p-3 text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#869E90]">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                ADAPPT 5.0 R2
              </span>
              <span className="font-mono text-[10px] text-[#597365]">Domain 2</span>
            </div>
            <p className="mt-1 text-[11px] text-[#71897C] leading-relaxed">
              AI in Food Technology & Agronomic Operations
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
        )}
      </div>
    </aside>
  );
}

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
  UploadCloud,
  Compass,
  ShieldCheck,
  MapPin,
  Sprout,
} from 'lucide-react';
import { cn } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

export interface NavItem {
  name: string;
  shortName: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    name: 'NEXFIELD Control',
    shortName: 'Control Center',
    href: '/control',
    icon: LayoutDashboard,
    tooltip: 'Agricultural Command Center & Operational Telemetry',
  },
  {
    name: 'FieldSight AI',
    shortName: 'Crop Pathology',
    href: '/fieldsight',
    icon: ScanEye,
    tooltip: 'Foliar Computer Vision Diagnostic Studio & Grad-CAM',
  },
  {
    name: 'NEXFIELD Twin',
    shortName: '3D Twin Simulator',
    href: '/twin',
    icon: Layers,
    tooltip: '3D WebGL Field Parcel & Stewart Water-Yield Simulator',
  },
  {
    name: 'NEXFIELD Intelligence',
    shortName: 'AI Copilot',
    href: '/intelligence',
    icon: Sparkles,
    tooltip: 'Grounded Agronomic LLM Copilot & Research Advisory',
  },
  {
    name: 'NEXFIELD Ops',
    shortName: 'Operations & Stock',
    href: '/ops',
    icon: ClipboardList,
    tooltip: 'Field Work Orders, Stock Ledger & Food Storage Quality',
  },
  {
    name: 'NEXFIELD Markets',
    shortName: 'Mandi Arbitrage',
    href: '/markets',
    icon: TrendingUp,
    tooltip: 'Wholesale APMC Mandi Rates & Spatial Freight Arbitrage',
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    name: 'Guided Demo Tour',
    shortName: 'Guided Demo',
    href: '/demo',
    icon: Compass,
    tooltip: '7-Step Interactive Closed-Loop Agronomic Walkthrough',
  },
  {
    name: 'Data Center & Fixtures',
    shortName: 'Data Center',
    href: '/data-center',
    icon: UploadCloud,
    tooltip: 'Inspect Synthetic Agronomic Baseline Fixtures & Telemetry',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();
  const demoStore = useDemoStore();
  const isDemo = pathname.startsWith('/demo');

  return (
    <aside
      className={cn(
        'hidden md:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-[#1E2E25] bg-[#090D0B] transition-all duration-200 select-none',
        isSidebarOpen ? 'w-64' : 'w-18'
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="flex h-15 items-center border-b border-[#1E2E25] px-4 overflow-hidden shrink-0">
        <NexfieldLogo
          size={isSidebarOpen ? 'md' : 'sm'}
          showWordmark={isSidebarOpen}
          href={isDemo ? '/demo' : '/'}
          subtitle={isDemo ? 'Public Demo' : 'Agri-Intelligence'}
        />
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Modules */}
        <div className="space-y-1">
          {isSidebarOpen && (
            <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6D8577]">
              Agronomic Workspaces
            </div>
          )}

          {PRIMARY_NAV_ITEMS.map((item) => {
            const targetHref = isDemo && item.href !== '/demo' ? `/demo${item.href}` : item.href;
            const isActive =
              pathname === item.href ||
              (item.href !== '/control' && pathname.startsWith(item.href + '/')) ||
              pathname === `/demo${item.href}` ||
              (item.href !== '/control' && pathname.startsWith(`/demo${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={targetHref}
                title={!isSidebarOpen ? `${item.name}: ${item.tooltip}` : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#163B2A] text-[#F1F6F3] font-semibold border-l-2 border-[#D7B678] shadow-sm'
                    : 'text-[#8DA396] hover:bg-[#111714] hover:text-[#F1F6F3]'
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 shrink-0 transition-colors',
                    isActive ? 'text-[#D7B678]' : 'text-[#6D8577] group-hover:text-emerald-400'
                  )}
                />

                {isSidebarOpen && (
                  <div className="min-w-0 flex-1">
                    <span className="truncate block font-medium">{item.name}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-3 border-t border-[#18251E]">
          {isSidebarOpen && (
            <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6D8577]">
              Platform & Tour
            </div>
          )}

          {SECONDARY_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isSidebarOpen ? `${item.name}: ${item.tooltip}` : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer',
                  isActive
                    ? 'bg-[#163B2A] text-[#F1F6F3] font-semibold border-l-2 border-[#D7B678]'
                    : 'text-[#7A9384] hover:bg-[#111714] hover:text-[#F1F6F3]'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-[#D7B678]' : 'text-[#6D8577] group-hover:text-emerald-400'
                  )}
                />

                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Active Estate Snippet (Expanded Mode Only) */}
        {isSidebarOpen && (
          <div className="pt-2">
            <div className="rounded-xl bg-[#0D1410] border border-[#1E2E25] p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#CADCD1]">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-[#D7B678] shrink-0" />
                  <span className="truncate">{demoStore.farmName}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8DA396] pt-1 border-t border-[#18251E]">
                <div className="flex items-center gap-1">
                  <Sprout className="h-3 w-3 text-emerald-400" />
                  <span className="truncate">{demoStore.cropName}</span>
                </div>
                <div className="text-right font-mono tabular-nums text-emerald-300">
                  {demoStore.areaHectares} ha
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer ADAPPT 5.0 Competition Badge */}
      <div className="border-t border-[#1E2E25] p-3 shrink-0">
        {isSidebarOpen ? (
          <div className="rounded-xl bg-[#111714] border border-[#203127] p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-[#D7B678]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                ADAPPT 5.0
              </span>
              <span className="text-[10px] font-mono text-[#8DA396]">Domain 2</span>
            </div>
            <p className="mt-1 text-[11px] text-[#8DA396] leading-snug">
              AI in Food Technology · Round 2
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2 text-[#D7B678]" title="ADAPPT 5.0 Domain 2: AI in Food Technology">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
}

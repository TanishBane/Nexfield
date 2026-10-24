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
  ChevronRight,
  ShieldCheck,
  UploadCloud,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    name: 'Overview',
    href: '/control',
    icon: LayoutDashboard,
    tooltip: 'Farm Command Center & Daily Priorities',
  },
  {
    name: 'Crop Health',
    href: '/fieldsight',
    icon: ScanEye,
    tooltip: 'Foliar Computer Vision & Disease Diagnosis',
  },
  {
    name: 'Digital Twin',
    href: '/twin',
    icon: Layers,
    tooltip: '3D Soil Vadose Zone & Irrigation Simulator',
  },
  {
    name: 'Insights',
    href: '/intelligence',
    icon: Sparkles,
    tooltip: 'Agronomic Copilot & Weather Advisory',
  },
  {
    name: 'Operations',
    href: '/ops',
    icon: ClipboardList,
    tooltip: 'Field Work Orders & Silo Storage Monitoring',
  },
  {
    name: 'Markets',
    href: '/markets',
    icon: TrendingUp,
    tooltip: 'Wholesale APMC Mandi Rates & Freight Arbitrage',
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    name: 'Farm Data',
    href: '/data-center',
    icon: UploadCloud,
    tooltip: 'Import CSV, GeoJSON & IoT Sensor Feeds',
  },
  {
    name: 'Add Farm',
    href: '/onboarding',
    icon: PlusCircle,
    tooltip: 'Register New Acreage & Soil Profiles',
  },
];

export const NAVIGATION_SECTIONS = [
  {
    category: 'Core Navigation',
    items: PRIMARY_NAV_ITEMS.map((item) => ({
      ...item,
      badge: '',
      description: item.tooltip,
    })),
  },
  {
    category: 'Management',
    items: SECONDARY_NAV_ITEMS.map((item) => ({
      ...item,
      badge: '',
      description: item.tooltip,
    })),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();
  const isDemo = pathname.startsWith('/demo');

  return (
    <aside
      className={cn(
        'hidden md:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-[#1B2921] bg-[#0A0F0D] transition-all duration-200 select-none',
        isSidebarOpen ? 'w-60' : 'w-18'
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header: Single Logo Symbol + Wordmark */}
      <div className="flex h-15 items-center border-b border-[#1B2921] px-3.5 overflow-hidden shrink-0">
        <NexfieldLogo
          size={isSidebarOpen ? 'md' : 'sm'}
          showWordmark={isSidebarOpen}
          href={isDemo ? '/demo/control' : '/control'}
          subtitle={isDemo ? 'Interactive Demo' : 'Agri-Intelligence'}
        />
      </div>

      {/* Primary Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        {/* Core Section */}
        <div className="space-y-1">
          {isSidebarOpen && (
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#688172]">
              Farm Operations
            </div>
          )}

          {PRIMARY_NAV_ITEMS.map((item) => {
            const targetHref = isDemo ? `/demo${item.href}` : item.href;
            const isActive =
              pathname === targetHref || (targetHref !== '/control' && pathname.startsWith(targetHref + '/'));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={targetHref}
                title={!isSidebarOpen ? `${item.name}: ${item.tooltip}` : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#163B2A] text-[#FAF8F2] font-semibold border-l-2 border-[#D7B678] shadow-sm'
                    : 'text-[#8FA396] hover:bg-[#121B16] hover:text-[#FAF8F2]'
                )}
              >
                <Icon
                  className={cn(
                    'h-4.5 w-4.5 shrink-0 transition-colors',
                    isActive ? 'text-[#D7B678]' : 'text-[#6B8576] group-hover:text-emerald-400'
                  )}
                />

                {isSidebarOpen && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary / Management Section */}
        <div className="space-y-1 pt-2 border-t border-[#16241D]">
          {isSidebarOpen && (
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#688172]">
              Workspace
            </div>
          )}

          {SECONDARY_NAV_ITEMS.map((item) => {
            const targetHref = isDemo && item.href === '/control' ? `/demo${item.href}` : item.href;
            const isActive = pathname === targetHref;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={targetHref}
                title={!isSidebarOpen ? `${item.name}: ${item.tooltip}` : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-[#163B2A] text-[#FAF8F2] font-semibold border-l-2 border-[#D7B678]'
                    : 'text-[#7B9587] hover:bg-[#121B16] hover:text-[#FAF8F2]'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-[#D7B678]' : 'text-[#63796E] group-hover:text-emerald-400'
                  )}
                />

                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="border-t border-[#1B2921] p-3 shrink-0">
        {isSidebarOpen ? (
          <div className="rounded-xl bg-[#0F1713] border border-[#1E2E25] p-2.5 text-xs">
            <div className="flex items-center justify-between text-[#869E90]">
              <span className="flex items-center gap-1.5 font-semibold text-[#D7B678]">
                <ShieldCheck className="h-3.5 w-3.5" />
                ADAPPT 5.0
              </span>
              <span className="text-[10px] font-mono text-[#597365]">Domain 2</span>
            </div>
            <p className="mt-1 text-[11px] text-[#71897C] leading-snug">
              AI in Food Technology
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2 text-[#D7B678]">
            <ShieldCheck className="h-4 w-4" />
          </div>
        )}
      </div>
    </aside>
  );
}

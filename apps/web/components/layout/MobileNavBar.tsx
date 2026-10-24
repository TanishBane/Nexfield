'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanEye,
  Layers,
  ClipboardList,
  MoreHorizontal,
  X,
  TrendingUp,
  Sparkles,
  UploadCloud,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { ContextualTaskDrawer } from './ContextualTaskDrawer';
import { cn } from '@nexfield/ui';

export function MobileNavBar() {
  const pathname = usePathname();
  const isDemo = pathname.startsWith('/demo');
  const demoStore = useDemoStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);

  const pendingCount = demoStore.tasks.filter((t) => t.status !== 'completed').length;

  const mainTabs = [
    {
      label: 'Overview',
      href: isDemo ? '/demo/control' : '/control',
      icon: LayoutDashboard,
    },
    {
      label: 'Crop Health',
      href: isDemo ? '/demo/fieldsight' : '/fieldsight',
      icon: ScanEye,
    },
    {
      label: 'Twin 3D',
      href: isDemo ? '/demo/twin' : '/twin',
      icon: Layers,
    },
  ];

  const moreItems = [
    {
      label: 'Agronomic Insights',
      href: isDemo ? '/demo/intelligence' : '/intelligence',
      icon: Sparkles,
      desc: 'AI Copilot & Weather Advisory',
    },
    {
      label: 'Farm Operations',
      href: isDemo ? '/demo/ops' : '/ops',
      icon: ClipboardList,
      desc: 'Work Orders & Storage',
    },
    {
      label: 'Mandi Markets',
      href: isDemo ? '/demo/markets' : '/markets',
      icon: TrendingUp,
      desc: 'APMC Rates & Arbitrage',
    },
    {
      label: 'Farm Data',
      href: '/data-center',
      icon: UploadCloud,
      desc: 'CSV / GeoJSON Ingestion',
    },
    {
      label: 'Register Farm',
      href: '/onboarding',
      icon: PlusCircle,
      desc: 'Add New Acreage',
    },
  ];

  return (
    <>
      {/* Fixed Bottom Bar on Small Screens */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0A0F0D]/95 border-t border-[#1C2C22] backdrop-blur-md flex items-center justify-around px-2 select-none"
        aria-label="Mobile Navigation"
      >
        {mainTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors',
                isActive ? 'text-[#D7B678]' : 'text-[#7B9587] hover:text-[#FAF8F2]'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-0.5', isActive ? 'text-[#D7B678]' : 'text-[#63796E]')} />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {/* Tasks Button */}
        <button
          type="button"
          onClick={() => setTaskDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-[#7B9587] hover:text-[#FAF8F2] relative"
        >
          <div className="relative">
            <ClipboardList className="h-5 w-5 mb-0.5 text-[#63796E]" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-[#D7B678] text-[#17251B] text-[9px] font-bold font-mono flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <span>Tasks</span>
        </button>

        {/* More Menu Toggle */}
        <button
          type="button"
          onClick={() => setMoreMenuOpen(true)}
          className={cn(
            'flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors',
            moreMenuOpen ? 'text-[#D7B678]' : 'text-[#7B9587] hover:text-[#FAF8F2]'
          )}
        >
          <MoreHorizontal className="h-5 w-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* "More" Bottom Sheet Modal */}
      {moreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreMenuOpen(false)}
          />
          <div className="relative z-10 bg-[#0E1511] border-t border-[#1E2E25] rounded-t-3xl p-5 space-y-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#18261E]">
              <h3 className="text-sm font-bold text-[#FAF8F2]">All Modules</h3>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="p-1 rounded-lg text-[#7B9587] hover:text-[#FAF8F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-all',
                      isActive
                        ? 'bg-[#163B2A] border-[#D7B678]/40 text-[#FAF8F2]'
                        : 'bg-[#080D0A] border-[#18261E] text-[#8FA396] hover:bg-[#121B16] hover:text-[#FAF8F2]'
                    )}
                  >
                    <Icon className="h-5 w-5 text-[#D7B678] shrink-0" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#FAF8F2]">{item.label}</div>
                      <div className="text-[11px] text-[#63796E]">{item.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contextual Task Drawer */}
      <ContextualTaskDrawer isOpen={taskDrawerOpen} onClose={() => setTaskDrawerOpen(false)} />
    </>
  );
}

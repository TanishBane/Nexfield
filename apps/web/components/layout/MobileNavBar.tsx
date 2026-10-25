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
  Compass,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { ContextualTaskDrawer } from './ContextualTaskDrawer';
import { cn, Modal, Button } from '@nexfield/ui';

export function MobileNavBar() {
  const pathname = usePathname();
  const isDemo = pathname.startsWith('/demo');
  const demoStore = useDemoStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const pendingCount = demoStore.tasks.filter((t) => t.status !== 'completed').length;

  const mainTabs = [
    {
      label: 'Control',
      href: isDemo ? '/demo/control' : '/control',
      icon: LayoutDashboard,
    },
    {
      label: 'FieldSight',
      href: isDemo ? '/demo/fieldsight' : '/fieldsight',
      icon: ScanEye,
    },
    {
      label: 'Twin 3D',
      href: isDemo ? '/demo/twin' : '/twin',
      icon: Layers,
    },
    {
      label: 'Tasks',
      onClick: () => setTaskDrawerOpen(true),
      icon: ClipboardList,
      badge: pendingCount,
    },
    {
      label: 'Menu',
      onClick: () => setMoreMenuOpen(true),
      icon: MoreHorizontal,
    },
  ];

  const moreItems = [
    {
      label: 'NEXFIELD Intelligence',
      href: isDemo ? '/demo/intelligence' : '/intelligence',
      icon: Sparkles,
      desc: 'Agronomic AI Copilot',
    },
    {
      label: 'NEXFIELD Ops',
      href: isDemo ? '/demo/ops' : '/ops',
      icon: ClipboardList,
      desc: 'Work Orders & Storage Quality',
    },
    {
      label: 'NEXFIELD Markets',
      href: isDemo ? '/demo/markets' : '/markets',
      icon: TrendingUp,
      desc: 'Wholesale APMC Arbitrage',
    },
    {
      label: 'Guided Demo Tour',
      href: '/demo',
      icon: Compass,
      desc: '7-Step Evaluator Tour',
    },
    {
      label: 'Data Center & Fixtures',
      href: '/data-center',
      icon: UploadCloud,
      desc: 'Synthetic Data Ingestion',
    },
  ];

  const handleReset = () => {
    demoStore.resetDemoState();
    setResetConfirmOpen(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Bar on Small Screens */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#090D0B]/95 border-t border-[#1E2E25] backdrop-blur-md flex items-center justify-around px-2 select-none safe-bottom"
        aria-label="Mobile Bottom Navigation"
      >
        {mainTabs.map((tab) => {
          if (tab.onClick) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.onClick}
                className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-[#8DA396] hover:text-[#F1F6F3] transition-colors relative cursor-pointer"
              >
                <div className="relative">
                  <tab.icon className="h-5 w-5" />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-[#D7B678] text-[#090D0B] text-[9px] font-mono font-bold leading-none">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="mt-1">{tab.label}</span>
              </button>
            );
          }

          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                isActive ? 'text-[#D7B678]' : 'text-[#8DA396] hover:text-[#F1F6F3]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Slide-out Menu Modal for Mobile */}
      <Modal
        isOpen={moreMenuOpen}
        onClose={() => setMoreMenuOpen(false)}
        title="NEXFIELD Workspaces"
        description={`Active: ${demoStore.farmName} (${demoStore.cropName})`}
        maxWidth="md"
        footer={
          <div className="w-full flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirmOpen(true)}
              className="text-[#D7B678] border-[#203127] text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset Demo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMoreMenuOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3.5 p-3 rounded-xl border transition-colors',
                  isActive
                    ? 'bg-[#163B2A] border-[#D7B678]/50 text-[#F1F6F3]'
                    : 'bg-[#0D1410] border-[#1E2E25] text-[#CADCD1] hover:bg-[#141F18]'
                )}
              >
                <div className="w-9 h-9 rounded-lg bg-[#111714] border border-[#203127] flex items-center justify-center text-[#D7B678] shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-xs block text-[#F1F6F3]">{item.label}</span>
                  <span className="text-[11px] text-[#8DA396] truncate block">{item.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Modal>

      {/* Reset Confirmation */}
      <Modal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset Demo State?"
        description="Restores all local demo entities back to clean agronomic fixtures."
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="wheat" size="sm" onClick={handleReset}>
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#8DA396]">
          All local task completions and state changes will be reset to initial baseline values.
        </p>
      </Modal>

      {/* Task Drawer */}
      <ContextualTaskDrawer isOpen={taskDrawerOpen} onClose={() => setTaskDrawerOpen(false)} />
    </>
  );
}

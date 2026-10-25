'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  MapPin,
  RotateCcw,
  Command,
  ClipboardList,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Button, Modal } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './Sidebar';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ContextualTaskDrawer } from './ContextualTaskDrawer';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useFarmStore();
  const demoStore = useDemoStore();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  const allItems = useMemo(() => [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS], []);

  const currentModule = useMemo(() => {
    return (
      allItems.find((item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`) ||
        pathname.startsWith(`/demo${item.href}`)
      ) || allItems[0]
    );
  }, [pathname, allItems]);

  const pendingTasksCount = demoStore.tasks.filter((t) => t.status !== 'completed').length;

  const handleResetConfirm = () => {
    demoStore.resetDemoState();
    setResetConfirmOpen(false);
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  const handleEstateChange = (estateId: string) => {
    demoStore.setFarm(estateId);
  };

  // Dynamically map farms from demo store
  const estates = useMemo(() => {
    if (demoStore.farms && demoStore.farms.length > 0) {
      return demoStore.farms.map((f) => ({
        id: f.id,
        name: f.name,
        district: `${f.location.district}, ${
          f.location.state === 'Maharashtra'
            ? 'MH'
            : f.location.state === 'Punjab'
            ? 'PB'
            : f.location.state
        }`,
        area: f.totalAreaHectares,
      }));
    }
    return [
      {
        id: 'farm-nashik-tomato-01',
        name: 'Nashik Tomato Precision Estate',
        district: 'Nashik, MH',
        area: 2.4,
      },
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        name: 'GreenValley Bio-Research Agrohub',
        district: 'Ludhiana, PB',
        area: 28.5,
      },
      {
        id: 'e83b2a19-47dc-4921-b830-2f91a0c84102',
        name: 'Deccan Agro-Ecology Precision Estate',
        district: 'Amravati, MH',
        area: 42.0,
      },
    ];
  }, [demoStore.farms]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-15 w-full items-center justify-between border-b border-[#1E2E25] bg-[#090D0B]/95 px-3 sm:px-4 backdrop-blur-md select-none">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="text-[#8DA396] hover:text-[#F1F6F3] hover:bg-[#141F18] shrink-0"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-[#1E2E25] hidden sm:block shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            {currentModule.icon && (
              <currentModule.icon className="h-4 w-4 text-[#D7B678] shrink-0" />
            )}
            <h1 className="font-semibold text-[#F1F6F3] text-xs sm:text-sm truncate">
              {currentModule.name}
            </h1>
          </div>
        </div>

        {/* Right: Farm Selector, Command Palette, Task Drawer, Demo State Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Demonstration Farm Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg bg-[#111714] border border-[#203127] px-2 py-1 text-xs hover:border-[#2E4638] transition-colors">
            <MapPin className="h-3.5 w-3.5 text-[#D7B678] shrink-0" />
            <select
              value={demoStore.farmId}
              onChange={(e) => handleEstateChange(e.target.value)}
              className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none rounded cursor-pointer pr-1 text-xs max-w-[120px] sm:max-w-[180px] md:max-w-[210px] truncate"
              title="Select active farm estate"
              aria-label="Select active farm estate"
            >
              {estates.map((estate) => (
                <option key={estate.id} value={estate.id} className="bg-[#111714] text-[#E1ECE5]">
                  {estate.name} ({estate.district})
                </option>
              ))}
            </select>
          </div>

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-[#111714] border border-[#203127] text-xs text-[#8DA396] hover:text-[#F1F6F3] hover:border-[#2E4638] transition-colors cursor-pointer"
            title="Search screens, fields and actions (Ctrl+K)"
            aria-label="Search screens and actions"
          >
            <Command className="w-3.5 h-3.5 text-[#D7B678]" />
            <span className="hidden md:inline-block">Search</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono rounded bg-[#16201B] text-[#8DA396] border border-[#203127]">
              ⌘K
            </kbd>
          </button>

          {/* Contextual Tasks Drawer Trigger */}
          <button
            type="button"
            data-testid="task-drawer-button"
            onClick={() => setTaskDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-[#163B2A] border border-[#D7B678]/40 hover:bg-[#1D4A35] text-[#F1F6F3] transition-colors text-xs font-medium cursor-pointer"
            title="Open Contextual Tasks Drawer"
            aria-label="Open tasks drawer"
          >
            <ClipboardList className="h-3.5 w-3.5 text-[#D7B678]" />
            <span className="hidden sm:inline">Tasks</span>
            {pendingTasksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D7B678] text-[#090D0B] text-[10px] font-bold font-mono">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Demo Provenance Badge */}
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111714] border border-[#203127] text-xs text-[#8DA396]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7B678] animate-pulse motion-reduce:animate-none" />
            <span>Public Demo</span>
          </span>

          {/* Reset Demo Action */}
          <div className="flex items-center gap-1 pl-1 border-l border-[#1E2E25]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirmOpen(true)}
              className={`h-7 px-2 text-xs border-[#203127] transition-all duration-200 ${
                resetFeedback
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500'
                  : 'text-[#D7B678] hover:bg-[#163B2A]/40 hover:border-[#D7B678]/50'
              }`}
              title="Reset demonstration state to clean baseline fixtures"
            >
              <RotateCcw className={`h-3 w-3 mr-1 ${resetFeedback ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{resetFeedback ? 'Reset Done' : 'Reset Demo'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Reset Demo */}
      <Modal
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset Public Demonstration State?"
        description="This will restore all local farms, field parcels, crop cycles, work order tasks, and agrochemical inventory back to initial baseline fixtures."
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="wheat" size="sm" onClick={handleResetConfirm}>
              Confirm Reset
            </Button>
          </>
        }
      >
        <div className="p-3 rounded-xl bg-[#090D0B] border border-[#203127] space-y-2 text-xs text-[#8DA396]">
          <p>
            <strong className="text-[#D7B678]">Zero-Cloud Local Storage:</strong> All changes made during your session are stored in your browser's local storage (<code className="text-emerald-400 font-mono">nexfield-demo-v1</code>).
          </p>
          <p>
            Clicking <strong className="text-[#F1F6F3]">Confirm Reset</strong> will restore the verified baseline estate without requiring any network reload.
          </p>
        </div>
      </Modal>

      {/* Slide-over Contextual Task Drawer */}
      <ContextualTaskDrawer isOpen={taskDrawerOpen} onClose={() => setTaskDrawerOpen(false)} />

      {/* Global Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

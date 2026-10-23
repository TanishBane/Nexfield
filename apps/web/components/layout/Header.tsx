'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  CloudSun,
  Droplets,
  Activity,
  Layers,
  MapPin,
} from 'lucide-react';
import { Button, StatusIndicator, cn } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { NAVIGATION_ITEMS } from './Sidebar';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar, selectedFarmId, setSelectedFarmId } = useFarmStore();

  const currentModule =
    NAVIGATION_ITEMS.find((item) => pathname.startsWith(item.href)) || NAVIGATION_ITEMS[0];

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#1B2921] bg-[#0A0F0D]/95 px-4 backdrop-blur-md select-none">
      {/* Left: Sidebar Toggle & Module Indicator */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-[#88A092] hover:text-[#E2ECE5] hover:bg-[#131D16]"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px bg-[#1D2B23]" />

        <div className="flex items-center gap-2">
          <currentModule.icon className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-[#F1F6F3] text-sm hidden sm:inline-block">
            {currentModule.name}
          </span>
          <span className="text-xs text-[#6B8576] hidden md:inline-block">
            — {currentModule.description}
          </span>
        </div>
      </div>

      {/* Center / Right: Farm Selector & Telemetry HUD Bar */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Farm Switcher */}
        <div className="flex items-center gap-2 rounded-lg bg-[#111A15] border border-[#203026] px-2.5 py-1 text-xs">
          <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="f47ac10b-58cc-4372-a567-0e02b2c3d479" className="bg-[#111A15] text-[#E1ECE5]">
              Punjab Agrohub (Khanna)
            </option>
            <option value="e83b2a19-47dc-4921-b830-2f91a0c84102" className="bg-[#111A15] text-[#E1ECE5]">
              Maharashtra Precision Estate (Amravati)
            </option>
          </select>
        </div>

        {/* Ambient Telemetry Chips (Constant Width / No Wrapping) */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-[#8BA093] font-mono tabular-nums">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <CloudSun className="h-3.5 w-3.5 text-amber-400" />
            <span>27.8°C</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span>41.4% Moist</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>NDVI 0.74</span>
          </div>
        </div>

        {/* Development Fixture Mode Indicator */}
        <StatusIndicator
          status="fixture"
          label="Development Fixtures"
          pulse={false}
          className="hidden sm:inline-flex"
        />
      </div>
    </header>
  );
}

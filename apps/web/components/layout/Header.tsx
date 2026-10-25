"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, MapPin, RotateCcw, Command, ClipboardList } from "lucide-react";
import { Button } from "@nexfield/ui";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "./Sidebar";
import { useDemoStore } from "@/lib/store/useDemoStore";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { ContextualTaskDrawer } from "./ContextualTaskDrawer";

const DEMO_ESTATES = [
  {
    id: "farm-nashik-tomato-01",
    name: "Nashik Precision Estate",
    district: "Nashik, MH",
    area: 2.4,
  },
  {
    id: "farm-baramati-cane-02",
    name: "Baramati Agro-Canopy",
    district: "Pune, MH",
    area: 42.0,
  },
  {
    id: "farm-punjab-wheat-03",
    name: "Malwa Agronomic Hub",
    district: "Ludhiana, PB",
    area: 18.5,
  },
];

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useFarmStore();
  const demoStore = useDemoStore();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "k" &&
        !paletteOpen
      ) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, [paletteOpen]);

  const allItems = useMemo(
    () => [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS],
    [],
  );

  const currentModule = useMemo(() => {
    return (
      allItems.find(
        (item) =>
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`) ||
          pathname.startsWith(`/demo${item.href}`),
      ) || allItems[0]
    );
  }, [pathname, allItems]);

  const pendingTasksCount = demoStore.tasks.filter(
    (t) => t.status !== "completed",
  ).length;

  const handleResetDemo = () => {
    demoStore.resetDemoState();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2000);
  };

  const handleEstateChange = (estateId: string) => {
    const estate = DEMO_ESTATES.find((e) => e.id === estateId);
    if (estate) {
      demoStore.setFarm(
        estate.id,
        estate.name,
        `${estate.district} (${estate.area} ha)`,
        estate.area,
      );
    }
  };

  return (
    <>
      <header className="workspace-header sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#D1DDCD] bg-[#F7FAF2]/95 px-4 backdrop-blur-md select-none">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:inline-flex h-8 w-8 text-[#46604D] hover:text-[#09251A] hover:bg-[#F7FAF2]"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-[#FFFFFF]" />

          <div className="flex items-center gap-2">
            <currentModule.icon className="h-4 w-4 text-[#815414]" />
            <p className="font-semibold text-[#09251A] text-sm hidden sm:block">
              {currentModule.name}
            </p>
          </div>
        </div>

        {/* Right: Farm Selector, Command Palette, Task Drawer, Demo State Reset */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#46604D] hover:text-[#09251A] hover:border-[#D1DDCD] transition-colors"
            title="Search screens and actions (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-[#815414]" />
            <span className="hidden sm:inline-block">Search</span>
            <kbd className="hidden sm:inline-block px-1 py-0.5 text-[10px] font-mono rounded bg-[#F7FAF2] text-[#46604D] border border-[#D1DDCD]">
              ⌘K
            </kbd>
          </button>

          {/* Demonstration Farm Switcher */}
          <div className="flex items-center gap-2 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] px-2.5 py-1 text-xs">
            <MapPin className="h-3.5 w-3.5 text-[#815414] shrink-0" />
            <select
              value={demoStore.farmId || DEMO_ESTATES[0].id}
              onChange={(e) => handleEstateChange(e.target.value)}
              className="bg-transparent text-[#09251A] font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D7B678]/80 rounded cursor-pointer pr-1 text-xs max-w-20 sm:max-w-[170px] truncate"
              aria-label="Select sample farm"
            >
              {DEMO_ESTATES.map((estate) => (
                <option
                  key={estate.id}
                  value={estate.id}
                  className="bg-[#F7FAF2] text-[#09251A]"
                >
                  {estate.name} ({estate.district})
                </option>
              ))}
            </select>
          </div>

          {/* Contextual Tasks Drawer Trigger */}
          <button
            type="button"
            data-testid="task-drawer-button"
            onClick={() => setTaskDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D7B678]/40 hover:bg-[#EDF4E7] text-[#09251A] transition-colors text-xs font-medium"
            title="Open Contextual Tasks Drawer"
          >
            <ClipboardList className="h-3.5 w-3.5 text-[#815414]" />
            <span className="hidden sm:inline">Tasks</span>
            {pendingTasksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FFDB3D] text-[#17251B] text-[10px] font-bold font-mono">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Demo Provenance Badge */}
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#46604D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7B678] animate-pulse" />
            <span>Public Demo Mode</span>
          </span>

          {/* Reset Demo Action */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-[#D1DDCD]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              className={`h-7 text-xs border-[#D1DDCD] transition-all duration-200 ${
                resetFeedback
                  ? "bg-emerald-50/60 text-emerald-700 border-emerald-500"
                  : "text-[#815414] hover:bg-[#EDF4E7]"
              }`}
              title="Reset sample farm"
              aria-label="Reset sample farm"
            >
              <RotateCcw
                className={`h-3.5 w-3.5 mr-1 ${resetFeedback ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {resetFeedback ? "Reset Done" : "Reset Demo"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-over Contextual Task Drawer */}
      <ContextualTaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}

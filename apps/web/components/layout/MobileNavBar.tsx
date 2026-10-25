"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useDemoStore } from "@/lib/store/useDemoStore";
import { ContextualTaskDrawer } from "./ContextualTaskDrawer";
import { useDialogFocus } from "@/components/ui/useDialogFocus";
import { cn } from "@nexfield/ui";

export function MobileNavBar() {
  const pathname = usePathname();
  const isDemo = pathname.startsWith("/demo");
  const demoStore = useDemoStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);

  const pendingCount = demoStore.tasks.filter(
    (t) => t.status !== "completed",
  ).length;
  const menuRef = useDialogFocus(moreMenuOpen, () => setMoreMenuOpen(false));

  const mainTabs = [
    {
      label: "Overview",
      href: isDemo ? "/demo/control" : "/control",
      icon: LayoutDashboard,
    },
    {
      label: "Crop Health",
      href: isDemo ? "/demo/fieldsight" : "/fieldsight",
      icon: ScanEye,
    },
    {
      label: "Water plan",
      href: isDemo ? "/demo/twin" : "/twin",
      icon: Layers,
    },
  ];

  const moreItems = [
    {
      label: "Farm insights",
      href: isDemo ? "/demo/intelligence" : "/intelligence",
      icon: Sparkles,
      desc: "AI Copilot & Weather Advisory",
    },
    {
      label: "Daily tasks",
      href: isDemo ? "/demo/ops" : "/ops",
      icon: ClipboardList,
      desc: "Work Orders & Storage",
    },
    {
      label: "Market prices",
      href: isDemo ? "/demo/markets" : "/markets",
      icon: TrendingUp,
      desc: "APMC Rates & Arbitrage",
    },
    {
      label: "Farm Data",
      href: "/data-center",
      icon: UploadCloud,
      desc: "CSV / GeoJSON Ingestion",
    },
    {
      label: "Register Farm",
      href: "/how-it-works",
      icon: PlusCircle,
      desc: "Add New Acreage",
    },
  ];

  return (
    <>
      {/* Fixed Bottom Bar on Small Screens */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 min-h-[4rem] pb-[env(safe-area-inset-bottom,0px)] bg-[#F7FAF2]/95 border-t border-[#D1DDCD] backdrop-blur-md flex items-center justify-around px-2 select-none"
        aria-label="Mobile Navigation"
      >
        {mainTabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-[#005B36] font-bold"
                  : "text-[#46604D] hover:text-[#09251A]",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-0.5",
                  isActive ? "text-[#048547]" : "text-[#46604D]",
                )}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {/* Tasks Button */}
        <button
          type="button"
          onClick={() => setTaskDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 text-[11px] font-medium text-[#46604D] hover:text-[#09251A] relative cursor-pointer"
        >
          <div className="relative">
            <ClipboardList className="h-5 w-5 mb-0.5 text-[#46604D]" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-[#FFDB3D] text-[#09251A] text-[9px] font-bold font-mono tabular-nums flex items-center justify-center border border-[#E7D57A]">
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
          aria-expanded={moreMenuOpen}
          aria-controls="mobile-more-menu"
          className={cn(
            "flex flex-col items-center justify-center flex-1 min-h-[44px] py-1 text-[11px] font-medium transition-colors cursor-pointer",
            moreMenuOpen
              ? "text-[#005B36] font-bold"
              : "text-[#46604D] hover:text-[#09251A]",
          )}
        >
          <MoreHorizontal
            className={cn(
              "h-5 w-5 mb-0.5",
              moreMenuOpen ? "text-[#048547]" : "text-[#46604D]",
            )}
          />
          <span>More</span>
        </button>
      </nav>

      {/* "More" Bottom Sheet Modal */}
      {moreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreMenuOpen(false)}
          />
          <div
            ref={menuRef}
            id="mobile-more-menu"
            role="dialog"
            aria-modal="true"
            aria-label="All farm tools"
            className="relative z-10 bg-[#F7FAF2] border-t border-[#D1DDCD] rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] space-y-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D1DDCD]">
              <h3 className="text-sm font-bold text-[#09251A]">
                All farm tools
              </h3>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                aria-label="Close navigation"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#46604D] hover:text-[#09251A] cursor-pointer"
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
                      "flex items-center gap-3 p-3 rounded-xl border transition-all min-h-[48px]",
                      isActive
                        ? "bg-white border-[#B8D494] text-[#005B36] font-semibold shadow-xs"
                        : "bg-white border-[#D1DDCD] text-[#46604D] hover:bg-[#EAF1E7] hover:text-[#09251A]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-[#048547]" : "text-[#46604D]",
                      )}
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#09251A]">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#46604D]">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contextual Task Drawer */}
      <ContextualTaskDrawer
        isOpen={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
      />
    </>
  );
}

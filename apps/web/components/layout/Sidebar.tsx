"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@nexfield/ui";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { NexfieldLogo } from "@/components/branding/NexfieldLogo";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    name: "Overview",
    href: "/control",
    icon: LayoutDashboard,
    tooltip: "Farm Command Center & Daily Priorities",
  },
  {
    name: "Crop health",
    href: "/fieldsight",
    icon: ScanEye,
    tooltip: "Foliar Computer Vision & Disease Diagnosis",
  },
  {
    name: "Water planning",
    href: "/twin",
    icon: Layers,
    tooltip: "3D Soil Vadose Zone & Irrigation Simulator",
  },
  {
    name: "Insights",
    href: "/intelligence",
    icon: Sparkles,
    tooltip: "Agronomic Copilot & Weather Advisory",
  },
  {
    name: "Daily tasks",
    href: "/ops",
    icon: ClipboardList,
    tooltip: "Field Work Orders & Silo Storage Monitoring",
  },
  {
    name: "Markets",
    href: "/markets",
    icon: TrendingUp,
    tooltip: "Wholesale APMC Mandi Rates & Freight Arbitrage",
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    name: "Farm data",
    href: "/data-center",
    icon: UploadCloud,
    tooltip: "Import CSV, GeoJSON & IoT Sensor Feeds",
  },
  {
    name: "Farm guide",
    href: "/how-it-works",
    icon: PlusCircle,
    tooltip: "Learn how the farm tools work",
  },
];

export const NAVIGATION_SECTIONS = [
  {
    category: "Core Navigation",
    items: PRIMARY_NAV_ITEMS.map((item) => ({
      ...item,
      badge: "",
      description: item.tooltip,
    })),
  },
  {
    category: "Management",
    items: SECONDARY_NAV_ITEMS.map((item) => ({
      ...item,
      badge: "",
      description: item.tooltip,
    })),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();
  const isDemo = pathname.startsWith("/demo/");
  return (
    <aside
      className={cn("workspace-sidebar", !isSidebarOpen && "is-collapsed")}
      aria-label="Farm navigation"
    >
      <div className="sidebar-brand">
        <NexfieldLogo href="/" showWordmark={isSidebarOpen} />
      </div>
      <nav aria-label="Workspace">
        <p className="nav-group-label">{isSidebarOpen ? "Your farm" : ""}</p>
        {PRIMARY_NAV_ITEMS.map((item) => {
          const href = isDemo ? `/demo${item.href}` : item.href;
          return (
            <Link
              key={href}
              href={href}
              className="sidebar-link"
              aria-current={pathname === href ? "page" : undefined}
              title={item.name}
            >
              <item.icon />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
        <div className="sidebar-secondary">
          {isSidebarOpen && <p className="nav-group-label">Manage</p>}
          {SECONDARY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              aria-current={pathname === item.href ? "page" : undefined}
              title={item.name}
            >
              <item.icon />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </nav>
      {isSidebarOpen && (
        <div className="sidebar-help">
          <HelpCircle size={22} />
          <p>Make yourself at home.</p>
          <Link href="/how-it-works" className="text-link">
            Get to know the tools <ChevronRight size={15} />
          </Link>
        </div>
      )}
    </aside>
  );
}

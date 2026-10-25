"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@nexfield/ui";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const ROUTE_LABELS: Record<string, string> = {
  control: "Command Center",
  fieldsight: "Crop Inspection Studio",
  twin: "Digital Twin 3D",
  intelligence: "Agronomic Copilot",
  ops: "Farm Operations",
  markets: "Mandi Arbitrage",
  "data-center": "Data Center",
  farms: "My Farms",
  settings: "Farm Settings",
  demo: "Interactive Demo",
  platform: "Platform Overview",
  solutions: "Agronomic Solutions",
  "how-it-works": "How It Works",
  about: "About NEXFIELD",
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = segments.map((seg, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    return { label, href };
  });

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn(
        "flex items-center space-x-1.5 text-xs text-[#46604D] font-medium py-1 mb-3",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#09251A] transition-colors"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="w-3 h-3 text-[#46604D]" />
            {isLast ? (
              <span
                className="text-[#09251A] font-semibold tracking-wide"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-emerald-700 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

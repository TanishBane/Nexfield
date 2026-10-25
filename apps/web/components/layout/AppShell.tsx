"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavBar } from "./MobileNavBar";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { DemoBanner } from "@/components/demo/DemoBanner";
import { cn } from "@nexfield/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();

  // Public editorial marketing routes
  const isPublicPage =
    pathname === "/" ||
    pathname === "/demo" ||
    pathname.startsWith("/platform") ||
    pathname === "/how-it-works" ||
    pathname === "/solutions" ||
    pathname === "/about";

  if (isPublicPage) {
    return (
      <div className="public-shell flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PublicNavbar />
        <main id="main-content" className="w-full flex-1">
          {children}
        </main>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="workspace-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <div className={cn("workspace-frame", !isSidebarOpen && "is-collapsed")}>
        <DemoBanner />
        <Header />
        <main id="main-content" className="workspace-main">
          <Breadcrumbs />
          {children}
        </main>
      </div>
      <MobileNavBar />
    </div>
  );
}

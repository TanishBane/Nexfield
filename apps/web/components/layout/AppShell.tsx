'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { cn } from '@nexfield/ui';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen } = useFarmStore();

  // Public editorial marketing routes
  const isPublicPage =
    pathname === '/' ||
    pathname === '/demo' ||
    pathname.startsWith('/platform') ||
    pathname === '/how-it-works' ||
    pathname === '/solutions' ||
    pathname === '/about';

  // Minimal standalone auth/onboarding routes
  const isMinimalAuthPage = pathname === '/login' || pathname === '/onboarding';

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#090D0B] text-[#F1F6F3] flex flex-col">
        <PublicNavbar />
        <main className="w-full flex-1">{children}</main>
        <PublicFooter />
      </div>
    );
  }

  if (isMinimalAuthPage) {
    return (
      <div className="min-h-screen bg-[#070B09] text-[#F1F6F3]">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  const isDemo = pathname.startsWith('/demo/');

  return (
    <div className="min-h-screen bg-[#090D0B] text-[#F1F6F3]">
      {isDemo && <DemoBanner />}
      <Sidebar />
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200',
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}

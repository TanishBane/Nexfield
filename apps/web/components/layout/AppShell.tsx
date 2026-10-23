'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { cn } from '@nexfield/ui';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useFarmStore();

  return (
    <div className="min-h-screen bg-[#090D0B] text-[#F1F6F3]">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-200',
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

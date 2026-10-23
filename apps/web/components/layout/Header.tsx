'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  ChevronDown,
  CloudSun,
  Droplets,
  Activity,
  Layers,
  MapPin,
  User as UserIcon,
  LogOut,
  LogIn,
} from 'lucide-react';
import { Button, StatusIndicator, cn } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { NAVIGATION_ITEMS } from './Sidebar';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, selectedFarmId, setSelectedFarmId } = useFarmStore();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) {
          setUserEmail(data.user.email);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      setUserEmail('demo@nexfield.ag');
    }
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUserEmail(null);
    router.push('/login');
    router.refresh();
  };

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
      <div className="flex items-center gap-2 md:gap-3">
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
        <div className="hidden xl:flex items-center gap-2 text-xs text-[#8BA093] font-mono tabular-nums">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <CloudSun className="h-3.5 w-3.5 text-amber-400" />
            <span>27.8°C</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span>41.4%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#101813] border border-[#1C2A21]">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>NDVI 0.74</span>
          </div>
        </div>

        {/* Development Fixture Mode Indicator */}
        <StatusIndicator
          status="fixture"
          label="Fixtures"
          pulse={false}
          className="hidden sm:inline-flex"
        />

        {/* User Profile / Auth Action */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#1D2B23]">
          {userEmail ? (
            <div className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#121B16] border border-[#1F2F24] text-xs text-[#BDD1C5]"
                title={`Signed in as ${userEmail}`}
              >
                <UserIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="hidden md:inline-block max-w-[120px] truncate">{userEmail}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="h-7 w-7 text-[#768F81] hover:text-red-400 hover:bg-red-950/30"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-emerald-700/50 text-emerald-400 hover:bg-emerald-950/40"
              >
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

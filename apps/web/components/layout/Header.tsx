'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  MapPin,
  User as UserIcon,
  LogOut,
  LogIn,
  Command,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { Button } from '@nexfield/ui';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './Sidebar';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useDemoStore } from '@/lib/store/useDemoStore';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ContextualTaskDrawer } from './ContextualTaskDrawer';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isDemo = pathname.startsWith('/demo');
  const { toggleSidebar, selectedFarmId, setSelectedFarmId } = useFarmStore();
  const demoStore = useDemoStore();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && !isDemo) {
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
    } else if (isDemo) {
      setUserEmail(null);
    } else {
      setUserEmail('operator@nexfield.ag');
    }
  }, [isDemo]);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUserEmail(null);
    router.push('/login');
  };

  const allItems = useMemo(() => [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS], []);

  const currentModule = useMemo(() => {
    return (
      allItems.find((item) =>
        isDemo ? pathname.startsWith(`/demo${item.href}`) : pathname.startsWith(item.href)
      ) || allItems[0]
    );
  }, [pathname, isDemo, allItems]);

  const pendingTasksCount = demoStore.tasks.filter((t) => t.status !== 'completed').length;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#1B2921] bg-[#0A0F0D]/95 px-4 backdrop-blur-md select-none">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-[#88A092] hover:text-[#FAF8F2] hover:bg-[#131D16]"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-[#1D2B23]" />

          <div className="flex items-center gap-2">
            <currentModule.icon className="h-4 w-4 text-[#D7B678]" />
            <h1 className="font-semibold text-[#FAF8F2] text-sm">
              {currentModule.name}
            </h1>
          </div>
        </div>

        {/* Right: Farm Selector, Command Palette, Task Drawer, User */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111A15] border border-[#203026] text-xs text-[#7B9587] hover:text-[#FAF8F2] hover:border-[#3D5C4A] transition-colors"
            title="Search screens and actions (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-[#D7B678]" />
            <span className="hidden sm:inline-block">Search</span>
            <kbd className="px-1 py-0.5 text-[10px] font-mono rounded bg-[#16201B] text-[#9BB1A4] border border-[#273C30]">
              ⌘K
            </kbd>
          </button>

          {/* Farm Switcher */}
          {isDemo ? (
            <div className="flex items-center gap-2 rounded-lg bg-[#14231A] border border-[#2D6546]/50 px-2.5 py-1 text-xs">
              <MapPin className="h-3.5 w-3.5 text-[#D7B678] shrink-0" />
              <span className="text-[#FAF8F2] font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {demoStore.farmName}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-[#111A15] border border-[#203026] px-2.5 py-1 text-xs">
              <MapPin className="h-3.5 w-3.5 text-[#D7B678] shrink-0" />
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D7B678]/80 rounded cursor-pointer pr-1 text-xs"
              >
                <option value="f47ac10b-58cc-4372-a567-0e02b2c3d479" className="bg-[#111A15] text-[#E1ECE5]">
                  Punjab Agrohub (Khanna)
                </option>
                <option value="e83b2a19-47dc-4921-b830-2f91a0c84102" className="bg-[#111A15] text-[#E1ECE5]">
                  Maharashtra Precision Estate (Amravati)
                </option>
              </select>
            </div>
          )}

          {/* Contextual Tasks Drawer Trigger */}
          <button
            type="button"
            data-testid="task-drawer-button"
            onClick={() => setTaskDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#163B2A] border border-[#D7B678]/40 hover:bg-[#1D4A35] text-[#FAF8F2] transition-colors text-xs font-medium"
            title="Open Contextual Tasks Drawer"
          >
            <ClipboardList className="h-3.5 w-3.5 text-[#D7B678]" />
            <span className="hidden sm:inline">Tasks</span>
            {pendingTasksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D7B678] text-[#17251B] text-[10px] font-bold font-mono">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Demo Mode Truthful Indicator */}
          {isDemo && (
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs text-[#849F90]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7B678]" />
              <span>Interactive Demo</span>
            </span>
          )}

          {/* User Profile / Auth Action */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-[#1D2B23]">
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
                  className="h-7 text-xs border-[#2D6546] text-[#D7B678] hover:bg-[#163B2A]/40"
                >
                  <LogIn className="h-3.5 w-3.5 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Slide-over Contextual Task Drawer */}
      <ContextualTaskDrawer isOpen={taskDrawerOpen} onClose={() => setTaskDrawerOpen(false)} />

      {/* Global Command Palette */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}

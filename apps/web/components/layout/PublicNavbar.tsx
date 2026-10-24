'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  Command,
  Sparkles,
  Layers,
  ScanEye,
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import { NexfieldLogo } from '@/components/branding/NexfieldLogo';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { cn } from '@nexfield/ui';

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const navLinks = [
    { label: 'Platform', href: '/platform' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090D0B]/80 border-b border-[#1F2E25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <NexfieldLogo size="md" />
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-[#F0F5F2] group-hover:text-emerald-400 transition-colors text-base font-sans">
                  NEXFIELD
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono">
                  OS
                </span>
              </div>
              <span className="text-[#63796E] font-medium tracking-wide uppercase text-[9px]">
                Agricultural Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-emerald-400 font-semibold' : 'text-[#9BB1A4] hover:text-[#F0F5F2]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#111714] border border-[#273C30] text-xs text-[#63796E] hover:text-[#F0F5F2] hover:border-[#3D5C4A] transition-colors"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="px-1 py-0.5 text-[10px] font-mono rounded bg-[#16201B] text-[#9BB1A4] border border-[#273C30]">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 transition-all shadow-sm shadow-emerald-500/20 active:scale-95"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#F0F5F2] bg-[#111714] hover:bg-[#16201B] border border-[#273C30] transition-colors"
            >
              Sign In
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#9BB1A4] hover:text-[#F0F5F2] hover:bg-[#16201B] transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1F2E25] bg-[#0E1411] px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#9BB1A4] hover:text-[#F0F5F2] hover:bg-[#16201B] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#1F2E25] flex flex-col gap-2">
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-[#090D0B]"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-[#F0F5F2] bg-[#111714] border border-[#273C30]"
              >
                Sign In to Farm Workspace
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
}

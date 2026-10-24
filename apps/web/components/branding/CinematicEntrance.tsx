'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CinematicEntranceProps {
  onComplete?: () => void;
}

export function CinematicEntrance({ onComplete }: CinematicEntranceProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const [fading, setFading] = useState<boolean>(false);
  const [stage, setStage] = useState<number>(0);

  const dismiss = React.useCallback(() => {
    setFading(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('nexfield_earth_intro_played', 'true');
    }
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 300);
  }, [onComplete]);

  useEffect(() => {
    // 1. Honor prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const seen = window.sessionStorage.getItem('nexfield_earth_intro_played');
      if (prefersReduced || seen === 'true') {
        setVisible(false);
        onComplete?.();
        return;
      }
    }

    // 2. Play Sequence
    // Stage 1: Logo & Emblem bloom (0ms - 400ms)
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Tagline & Golden Horizon (400ms - 900ms)
    const t2 = setTimeout(() => setStage(2), 500);
    // Stage 3: Fade out entrance overlay (1100ms - 1500ms)
    const t3 = setTimeout(() => {
      setFading(true);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('nexfield_earth_intro_played', 'true');
      }
    }, 1100);
    // Stage 4: Unmount overlay completely (1500ms)
    const t4 = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);

    // Escape key listener to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss, onComplete]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="NEXFIELD Cinematic Welcome"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D0B] text-[#FAF8F2] transition-opacity duration-500 select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Soil & Horizon Aura */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-[#0E1511]/40 to-[#090D0B] pointer-events-none" />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-t from-emerald-600/10 via-[#C2A06A]/10 to-transparent rounded-full blur-[120px] transition-all duration-1000 ${
          stage >= 1 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
        }`}
      />

      {/* Skip Button */}
      <button
        onClick={dismiss}
        type="button"
        className="absolute top-6 right-6 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111714]/80 hover:bg-[#16201B] border border-[#273C30] text-xs font-mono text-[#9BB1A4] hover:text-[#FAF8F2] transition-colors"
        aria-label="Skip cinematic entrance"
      >
        <span>Skip</span>
        <kbd className="px-1 text-[10px] bg-[#16201B] rounded border border-[#273C30]">ESC</kbd>
        <ArrowRight className="w-3 h-3 text-emerald-400" />
      </button>

      {/* Centerpiece Emblem & Branding */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md px-6">
        {/* Logo Mark Reveal */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-[#FAF8F2] shadow-2xl shadow-emerald-950/50 transition-all duration-700 transform ${
            stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
          }`}
        >
          <Image
            src="/branding/nexfield-logo.jpg"
            alt="NEXFIELD Official Emblem"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-xl"
            priority
          />
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-[#C2A06A]/20 blur-md pointer-events-none -z-10" />
        </div>

        {/* Brand Name & Tagline */}
        <div
          className={`space-y-2 transition-all duration-700 delay-150 transform ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111714] border border-[#273C30] text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PROJECT EARTH 2.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-[#FAF8F2]">
            NEXFIELD
          </h2>

          <p
            className={`text-sm sm:text-base font-serif italic text-[#C2A06A] tracking-wide transition-all duration-500 delay-300 ${
              stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            The Land Awakens.
          </p>

          <p className="text-xs font-mono text-[#9BB1A4] tracking-widest uppercase pt-1">
            Observe. Predict. Simulate. Optimize. Grow.
          </p>
        </div>

        {/* Horizon Light Beam */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 rounded-full" />
      </div>
    </div>
  );
}

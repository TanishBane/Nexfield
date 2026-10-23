'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@nexfield/ui';

interface NexfieldLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  href?: string;
  badgeMode?: 'dark' | 'authentic' | 'ghost';
  subtitle?: string;
}

export function NexfieldLogo({
  className,
  size = 'md',
  showWordmark = true,
  href,
  badgeMode = 'authentic',
  subtitle,
}: NexfieldLogoProps) {
  const sizeMap = {
    sm: { box: 28, img: 24, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 36, img: 32, text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 48, img: 44, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 64, img: 58, text: 'text-2xl', sub: 'text-xs' },
  };

  const { box, text, sub } = sizeMap[size];

  const logoMark = (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105',
        badgeMode === 'authentic' && 'bg-[#F5EEE6] border border-[#273C30]/50 ring-1 ring-emerald-500/20',
        badgeMode === 'dark' && 'bg-[#111714] border border-[#273C30] p-1',
        badgeMode === 'ghost' && 'bg-transparent'
      )}
      style={{ width: `${box}px`, height: `${box}px` }}
    >
      <Image
        src="/branding/nexfield-logo.jpg"
        alt="NEXFIELD Official Logo"
        width={box}
        height={box}
        className="w-full h-full object-cover rounded-lg"
        priority
      />
    </div>
  );

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group select-none', className)}>
      {logoMark}

      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'font-extrabold tracking-tight text-[#F0F5F2] group-hover:text-emerald-400 transition-colors',
                text
              )}
            >
              NEXFIELD
            </span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              OS
            </span>
          </div>
          {subtitle ? (
            <span className={cn('text-[#9BB1A4] font-medium tracking-wide uppercase', sub)}>
              {subtitle}
            </span>
          ) : (
            <span className={cn('text-[#63796E] font-medium tracking-wide uppercase', sub)}>
              Agricultural Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}

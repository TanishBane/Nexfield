import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'outline'
    | 'hydrology'
    | 'spectral'
    | 'harvest'
    | 'wheat'
    | 'provenance'
    | 'fixture'
    | 'optimal';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[#18251E] text-[#B5C8BC] border border-[#263A2F]',
    success: 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60',
    optimal: 'bg-[#0E291C] text-emerald-400 border border-[#1C5238]',
    warning: 'bg-amber-950/70 text-amber-300 border border-amber-800/60',
    destructive: 'bg-rose-950/70 text-rose-300 border border-rose-800/60',
    outline: 'border border-[#2C3F34] text-[#A6BCB0] bg-transparent',
    hydrology: 'bg-sky-950/70 text-sky-300 border border-sky-800/60',
    spectral: 'bg-purple-950/70 text-purple-300 border border-purple-800/60',
    harvest: 'bg-[#2E220D] text-amber-400 border border-[#543D17]',
    wheat: 'bg-[#D7B678]/15 text-[#E6CD9E] border border-[#D7B678]/40',
    provenance: 'bg-[#121B16] text-[#8DA396] border border-[#1F2E25] font-mono',
    fixture: 'bg-[#2B210B] text-amber-300 border border-[#4D3A15] font-mono',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-md tracking-wide transition-colors whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

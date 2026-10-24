import React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'hydrology' | 'spectral';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#18251E] text-[#B5C8BC] border border-[#263A2F]',
    success: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50',
    warning: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
    destructive: 'bg-rose-950/60 text-rose-300 border border-rose-800/50',
    outline: 'border border-[#2C3F34] text-[#A6BCB0]',
    hydrology: 'bg-sky-950/60 text-sky-300 border border-sky-800/50',
    spectral: 'bg-purple-950/60 text-purple-300 border border-purple-800/50',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-md tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

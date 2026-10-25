import React from 'react';
import { cn } from './utils';
import { Card, CardContent } from './card';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'emerald' | 'amber' | 'sky' | 'rose' | 'wheat';
  className?: string;
  provenance?: string;
}

export function StatCard({
  label,
  value,
  unit,
  subValue,
  trend,
  trendValue,
  icon,
  variant = 'default',
  className,
  provenance,
}: StatCardProps) {
  const borderVariants = {
    default: 'border-[#203127] hover:border-[#2E4638] bg-[#111714]',
    emerald: 'border-emerald-900/40 hover:border-emerald-600/60 bg-[#0F1914]',
    amber: 'border-amber-900/40 hover:border-amber-600/60 bg-[#1A160F]',
    sky: 'border-sky-900/40 hover:border-sky-600/60 bg-[#0F1820]',
    rose: 'border-rose-900/40 hover:border-rose-600/60 bg-[#1A1013]',
    wheat: 'border-[#D7B678]/30 hover:border-[#D7B678]/60 bg-[#151410]',
  };

  const iconVariants = {
    default: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    emerald: 'text-emerald-300 bg-emerald-950/80 border-emerald-700/50',
    amber: 'text-amber-300 bg-amber-950/80 border-amber-700/50',
    sky: 'text-sky-300 bg-sky-950/80 border-sky-700/50',
    rose: 'text-rose-300 bg-rose-950/80 border-rose-700/50',
    wheat: 'text-[#D7B678] bg-[#D7B678]/10 border-[#D7B678]/30',
  };

  return (
    <Card className={cn('relative overflow-hidden transition-all duration-200 group', borderVariants[variant], className)}>
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
        {/* Header: Label and Icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-medium tracking-wide text-[#9BB1A4] truncate">{label}</span>
            {provenance && (
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-[#6D8577] bg-[#16221B] border border-[#203127]">
                {provenance}
              </span>
            )}
          </div>
          {icon && (
            <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105', iconVariants[variant])}>
              {icon}
            </div>
          )}
        </div>

        {/* Value & Unit with Tabular Figures */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F1F6F3] tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs sm:text-sm font-medium text-[#8DA396]">
              {unit}
            </span>
          )}
        </div>

        {/* Footer: Subtitle and Trend Pill with guaranteed non-overlap */}
        {(trendValue || subValue) && (
          <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#18251E]/80 text-xs">
            {subValue ? (
              <span className="text-[#8DA396] text-[11px] sm:text-xs truncate max-w-[65%]" title={subValue}>
                {subValue}
              </span>
            ) : <span />}

            {trendValue && (
              <span
                className={cn(
                  'font-mono font-semibold tabular-nums px-2 py-0.5 rounded text-[11px] shrink-0 border flex items-center gap-1',
                  trend === 'up' && 'text-emerald-300 bg-emerald-950/80 border-emerald-800/60',
                  trend === 'down' && 'text-rose-300 bg-rose-950/80 border-rose-800/60',
                  trend === 'neutral' && 'text-[#9BB1A4] bg-[#16221B] border-[#273C30]'
                )}
              >
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trendValue}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

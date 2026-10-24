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
  variant?: 'default' | 'emerald' | 'amber' | 'sky' | 'rose';
  className?: string;
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
}: StatCardProps) {
  const borderVariants = {
    default: 'hover:border-[#2C4235]',
    emerald: 'border-emerald-900/40 hover:border-emerald-700/60',
    amber: 'border-amber-900/40 hover:border-amber-700/60',
    sky: 'border-sky-900/40 hover:border-sky-700/60',
    rose: 'border-rose-900/40 hover:border-rose-700/60',
  };

  return (
    <Card className={cn('relative overflow-hidden transition-all', borderVariants[variant], className)}>
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-semibold tracking-wide text-[#9BB1A4]">{label}</p>
          {icon ? <div className="text-emerald-400">{icon}</div> : null}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-[#FAF8F2] tabular-nums">
            {value}
          </span>
          {unit ? <span className="text-sm font-medium text-[#A7B5A0]">{unit}</span> : null}
        </div>

        {(trendValue || subValue) ? (
          <div className="mt-3 flex items-center justify-between text-sm">
            {subValue ? <span className="text-[#9BB1A4] truncate">{subValue}</span> : <span />}
            {trendValue ? (
              <span
                className={cn(
                  'font-mono font-semibold tabular-nums px-2 py-0.5 rounded text-xs',
                  trend === 'up' && 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/60',
                  trend === 'down' && 'text-rose-300 bg-rose-950/80 border border-rose-800/60',
                  trend === 'neutral' && 'text-[#9BB1A4] bg-[#16221B] border border-[#273C30]'
                )}
              >
                {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : ''}
                {trendValue}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

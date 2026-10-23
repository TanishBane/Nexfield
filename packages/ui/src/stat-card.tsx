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
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[#8CA194]">{label}</p>
          {icon ? <div className="text-[#647C6E]">{icon}</div> : null}
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl md:text-3xl font-bold tracking-tight text-[#F1F6F3] tabular-nums">
            {value}
          </span>
          {unit ? <span className="text-xs md:text-sm font-medium text-[#7C9385]">{unit}</span> : null}
        </div>

        {(trendValue || subValue) ? (
          <div className="mt-2.5 flex items-center justify-between text-xs">
            {subValue ? <span className="text-[#8AA092] truncate">{subValue}</span> : <span />}
            {trendValue ? (
              <span
                className={cn(
                  'font-mono font-medium tabular-nums px-1.5 py-0.5 rounded text-[11px]',
                  trend === 'up' && 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/40',
                  trend === 'down' && 'text-rose-400 bg-rose-950/60 border border-rose-900/40',
                  trend === 'neutral' && 'text-[#96ACA0] bg-[#16221B]'
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

import React from 'react';
import { cn } from './utils';

export interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'error' | 'syncing' | 'fixture';
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({ status, label, pulse = true, className }: StatusIndicatorProps) {
  const configs = {
    online: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-500',
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/40 border-emerald-800/40',
      defaultLabel: 'Live Telemetry Active',
    },
    warning: {
      dot: 'bg-amber-400',
      ping: 'bg-amber-500',
      text: 'text-amber-300',
      bg: 'bg-amber-950/40 border-amber-800/40',
      defaultLabel: 'Alert Detected',
    },
    error: {
      dot: 'bg-rose-400',
      ping: 'bg-rose-500',
      text: 'text-rose-300',
      bg: 'bg-rose-950/40 border-rose-800/40',
      defaultLabel: 'Sensor Disconnected',
    },
    syncing: {
      dot: 'bg-sky-400',
      ping: 'bg-sky-500',
      text: 'text-sky-300',
      bg: 'bg-sky-950/40 border-sky-800/40',
      defaultLabel: 'Model Simulating...',
    },
    fixture: {
      dot: 'bg-amber-300',
      ping: 'bg-amber-400',
      text: 'text-amber-200',
      bg: 'bg-amber-950/50 border-amber-700/60',
      defaultLabel: 'Synthetic Baseline Fixtures',
    },
  };

  const current = configs[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border',
        current.bg,
        current.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse ? (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              current.ping
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>
      <span>{label || current.defaultLabel}</span>
    </div>
  );
}

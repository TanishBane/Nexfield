import React from 'react';
import { cn } from './utils';

export interface StatusIndicatorProps {
  status: 'online' | 'warning' | 'error' | 'syncing' | 'fixture' | 'optimal';
  label?: string;
  pulse?: boolean;
  className?: string;
  showIcon?: boolean;
}

export function StatusIndicator({
  status,
  label,
  pulse = true,
  className,
  showIcon = false,
}: StatusIndicatorProps) {
  const configs = {
    online: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-500',
      text: 'text-emerald-300',
      bg: 'bg-emerald-950/40 border-emerald-800/50',
      defaultLabel: 'Live Telemetry Active',
      iconChar: '●',
    },
    optimal: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-500',
      text: 'text-emerald-300',
      bg: 'bg-[#0E291C] border-[#1C5238]',
      defaultLabel: 'Optimal Biometrics',
      iconChar: '✓',
    },
    warning: {
      dot: 'bg-amber-400',
      ping: 'bg-amber-500',
      text: 'text-amber-300',
      bg: 'bg-amber-950/40 border-amber-800/50',
      defaultLabel: 'Alert Detected',
      iconChar: '▲',
    },
    error: {
      dot: 'bg-rose-400',
      ping: 'bg-rose-500',
      text: 'text-rose-300',
      bg: 'bg-rose-950/40 border-rose-800/50',
      defaultLabel: 'Sensor Disconnected',
      iconChar: '✕',
    },
    syncing: {
      dot: 'bg-sky-400',
      ping: 'bg-sky-500',
      text: 'text-sky-300',
      bg: 'bg-sky-950/40 border-sky-800/50',
      defaultLabel: 'Model Simulating...',
      iconChar: '↻',
    },
    fixture: {
      dot: 'bg-[#D7B678]',
      ping: 'bg-[#E5C68A]',
      text: 'text-[#E6CD9E]',
      bg: 'bg-[#2E220D] border-[#543D17]',
      defaultLabel: 'Synthetic Baseline Fixtures',
      iconChar: '⛁',
    },
  };

  const current = configs[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border select-none transition-colors',
        current.bg,
        current.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {pulse ? (
          <span
            className={cn(
              'animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-75',
              current.ping
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', current.dot)} />
      </span>
      {showIcon && (
        <span className="text-[10px] font-mono leading-none opacity-80" aria-hidden="true">
          {current.iconChar}
        </span>
      )}
      <span className="truncate">{label || current.defaultLabel}</span>
    </div>
  );
}

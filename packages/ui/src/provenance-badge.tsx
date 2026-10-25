import React from 'react';
import { cn } from './utils';

export type ProvenanceType =
  | 'live_model'
  | 'live_sensor'
  | 'fixture'
  | 'calculated'
  | 'synthetic_scenario';

export interface ProvenanceBadgeProps {
  type: ProvenanceType;
  modelName?: string;
  source?: string;
  className?: string;
  compact?: boolean;
}

export function ProvenanceBadge({
  type,
  modelName,
  source,
  className,
  compact = false,
}: ProvenanceBadgeProps) {
  const configs: Record<
    ProvenanceType,
    { label: string; dotColor: string; bg: string; text: string; border: string }
  > = {
    live_model: {
      label: modelName || 'ONNX Model Inference',
      dotColor: 'bg-emerald-400',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-300',
      border: 'border-emerald-800/50',
    },
    live_sensor: {
      label: source || 'Telemetry Feed',
      dotColor: 'bg-sky-400',
      bg: 'bg-sky-950/40',
      text: 'text-sky-300',
      border: 'border-sky-800/50',
    },
    fixture: {
      label: source ? `Synthetic Fixture: ${source}` : 'Baseline Agronomic Fixture (Demo)',
      dotColor: 'bg-[#D7B678]',
      bg: 'bg-[#2E220D]',
      text: 'text-[#E6CD9E]',
      border: 'border-[#543D17]',
    },
    calculated: {
      label: modelName ? `Parametric: ${modelName}` : 'Deterministic Calculation',
      dotColor: 'bg-purple-400',
      bg: 'bg-purple-950/40',
      text: 'text-purple-300',
      border: 'border-purple-800/50',
    },
    synthetic_scenario: {
      label: 'Stewart Water-Yield Simulation',
      dotColor: 'bg-cyan-400',
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-300',
      border: 'border-cyan-800/50',
    },
  };

  const current = configs[type];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium border select-none transition-colors',
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        current.bg,
        current.text,
        current.border,
        className
      )}
      title={`Provenance: ${current.label}`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', current.dotColor)} />
      </span>
      <span className="truncate max-w-[200px] sm:max-w-none">{current.label}</span>
    </div>
  );
}

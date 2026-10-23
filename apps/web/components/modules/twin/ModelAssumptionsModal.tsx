'use client';

import React from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@nexfield/ui';

interface ModelAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelAssumptionsModal({ isOpen, onClose }: ModelAssumptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-xl border border-[#273B2F] bg-[#0E1512] shadow-2xl overflow-hidden text-[#E2ECE5]">
        <div className="flex items-center justify-between p-4 border-b border-[#1E2E25] bg-[#111A15]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-base text-[#F1F6F3]">
              Digital Twin Biophysical Model Assumptions
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-[#8BA193]" aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4 text-xs leading-relaxed max-h-[70vh] overflow-y-auto text-[#B0C5B8]">
          <div className="p-3 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-1">
            <span className="font-semibold text-emerald-400 block uppercase font-mono text-[10px]">
              1. Evapotranspiration Dynamics (FAO-56 Dual Kc)
            </span>
            <p>
              Reference evapotranspiration (ETo) is parameterized according to the Penman-Monteith method using hourly sensor station temperature, solar radiation, relative humidity, and wind speed at 2m.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-1">
            <span className="font-semibold text-emerald-400 block uppercase font-mono text-[10px]">
              2. Water-Yield Response Function (Stewart et al.)
            </span>
            <p>
              Yield reduction under moisture deficit is governed by empirical yield response factor $K_y = 1.15$ during flowering and $K_y = 0.5$ during grain filling:
              <br />
              <code className="text-emerald-300 font-mono text-[11px] block mt-1">
                (1 - Ya / Ym) = Ky * (1 - ETa / ETm)
              </code>
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-1">
            <span className="font-semibold text-emerald-400 block uppercase font-mono text-[10px]">
              3. Split Nitrogen Mineralization Dynamics
            </span>
            <p>
              Top-dressing application efficiency assumes 78% uptake under drip fertigation compared to 42% standard broadcast flooding.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0C120F] border border-[#1B2921] text-[11px] text-[#789383] space-y-1">
            <span className="font-semibold text-[#CADCD1] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Contract & Provenance Integrity
            </span>
            <p>
              All scenario outputs generated during frontend offline execution are labeled synthetic demonstrations adhering strictly to the <code className="text-emerald-400">SimulationScenarioSchema</code> contract.
            </p>
          </div>
        </div>

        <div className="p-3.5 border-t border-[#1E2E25] bg-[#111A15] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
}

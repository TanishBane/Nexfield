"use client";

import React from "react";
import { X, BookOpen, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@nexfield/ui";

interface ModelAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelAssumptionsModal({
  isOpen,
  onClose,
}: ModelAssumptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-xl border border-[#D1DDCD] bg-[#F7FAF2] shadow-sm overflow-hidden text-[#09251A]">
        <div className="flex items-center justify-between p-4 border-b border-[#D1DDCD] bg-[#F7FAF2]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-base text-[#09251A]">
              Digital Twin Biophysical Model Assumptions & Provenance
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-[#46604D]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4 text-xs leading-relaxed max-h-[70vh] overflow-y-auto text-[#46604D]">
          <div className="p-3 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
            <span className="font-semibold text-emerald-700 block uppercase font-mono text-[10px]">
              1. Scheduled Volumetric Water Calculation
            </span>
            <p>
              The water requirement calculation computes planned application
              volume (V = Field Area × Events × Application Depth, where 10
              m³/ha = 1 mm). Dynamic atmospheric evapotranspiration (ET₀), soil
              hydraulic conductivity, and conveyance losses are not modeled in
              this scheduled volumetric calculation.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
            <span className="font-semibold text-emerald-700 block uppercase font-mono text-[10px]">
              2. Parametric Water-Yield Production Function (Stewart et al.)
            </span>
            <p>
              Simulated yield reduction under moisture deficit is governed by
              the empirical water-production function (1 - Ya / Ym) = Ky × (1 -
              ETa / ETm) with crop yield response factor Ky = 1.05 for wheat.
              Note: Full dynamic daily FAO-56 Penman-Monteith soil rootzone
              tracking requires continuous hourly weather station sensor
              telemetry.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] space-y-1">
            <span className="font-semibold text-emerald-700 block uppercase font-mono text-[10px]">
              3. Split Nitrogen Mineralization Dynamics
            </span>
            <p>
              Top-dressing application efficiency models diminishing marginal
              yield returns according to Mitscherlich-Baule response curves,
              reflecting fertigation uptake dynamics.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-[11px] text-[#46604D] space-y-1">
            <span className="font-semibold text-[#46604D] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
              Contract & Provenance Integrity
            </span>
            <p>
              In public demonstration and offline mode, scenario outputs are
              domain-accurate baseline fixtures marked{" "}
              <code className="text-emerald-700">isFixture: true</code> adhering
              strictly to the{" "}
              <code className="text-emerald-700">SimulationScenarioSchema</code>{" "}
              contract. Live simulations from the backend declare{" "}
              <code className="text-emerald-700">isFixture: false</code>.
            </p>
          </div>
        </div>

        <div className="p-3.5 border-t border-[#D1DDCD] bg-[#F7FAF2] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
}

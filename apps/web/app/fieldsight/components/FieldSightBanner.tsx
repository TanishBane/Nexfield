import React from 'react';
import { ScanEye } from 'lucide-react';
import { Badge } from '@nexfield/ui';

export function FieldSightBanner() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
            <ScanEye className="h-6 w-6 text-emerald-400" />
            FieldSight AI — Visual Crop Pathology & Diagnostic Workspace
          </h1>
          <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/40">
            Vision CNN v1
          </Badge>
        </div>
        <p className="text-xs md:text-sm text-[#8DA295] mt-1">
          Foliar pathology detection, supported-class taxonomy, confidence calibration, and agronomic mitigation protocols.
        </p>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[#849F90]">
          Inference: <strong className="text-emerald-300 font-medium">Developer Z ONNX Pipeline (Fixture Mode)</strong>
        </span>
      </div>
    </div>
  );
}

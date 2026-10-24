'use client';

import React from 'react';
import {
  X,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  Calendar,
  ShieldCheck,
  Compass,
  Building,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@nexfield/ui';
import type { Farm } from '@nexfield/contracts';

interface FarmProfileModalProps {
  farm: Farm;
  isOpen: boolean;
  onClose: () => void;
}

export function FarmProfileModal({ farm, isOpen, onClose }: FarmProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-xl border border-[#273B2F] bg-[#0E1512] shadow-2xl overflow-hidden text-[#E2ECE5]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E2E25] bg-[#111A15]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg text-[#F1F6F3]">
                {farm.name}
              </h3>
              <p className="text-xs text-[#8BA193]">
                Enterprise Agronomic Profile & Holding Specifications
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[#8BA193] hover:text-[#F1F6F3]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Geospatial Holding Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#738D7E] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                Geospatial Coordinates
              </span>
              <p className="font-mono text-xs text-[#F1F6F3] font-semibold">
                {farm.location.latitude.toFixed(4)}° N, {farm.location.longitude.toFixed(4)}° E
              </p>
              <p className="text-[11px] text-[#869E90]">
                {farm.location.address}, {farm.location.district}, {farm.location.state} — PIN {farm.location.pinCode}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#738D7E] flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-emerald-400" />
                Operational Area
              </span>
              <p className="font-mono text-sm text-emerald-400 font-bold">
                {farm.totalAreaHectares} Hectares
              </p>
              <p className="text-[11px] text-[#869E90]">
                Delineated into 2 active parcels • Alluvial floodplain basin
              </p>
            </div>
          </div>

          {/* Soil & Irrigation Taxonomy */}
          <div className="p-4 rounded-lg bg-[#121B16] border border-[#1E2E25] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#CADCD1] flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              Agronomic Biophysical Baseline
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1B2921]">
                <span className="text-[10px] text-[#698476] block">SOIL TAXONOMY</span>
                <span className="capitalize text-[#E3EDE6] font-medium">
                  {farm.soilType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1B2921]">
                <span className="text-[10px] text-[#698476] block">PRIMARY IRRIGATION</span>
                <span className="capitalize text-[#E3EDE6] font-medium">
                  {farm.primaryIrrigation.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1B2921]">
                <span className="text-[10px] text-[#698476] block">STATUS</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  KVK Verified
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Compliance */}
          <div className="p-3.5 rounded-lg bg-[#0C120F] border border-[#1B2921] text-xs text-[#8EA395] leading-relaxed">
            <span className="font-semibold text-emerald-400">Precision Standard:</span> This holding participates in the ADAPPT 5.0 sensor telemetry grid. Microclimate station data is polled every 15 minutes and reconciled against Sentinel-2 multispectral passes.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2E25] bg-[#111A15] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

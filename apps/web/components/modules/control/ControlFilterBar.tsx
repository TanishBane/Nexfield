import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@nexfield/ui';

interface ControlFilterBarProps {
  activeFieldFilter: string | null;
  setActiveFieldFilter: (value: string | null) => void;
  activeSeasonFilter: string | null;
  setActiveSeasonFilter: (value: string | null) => void;
}

export function ControlFilterBar({
  activeFieldFilter,
  setActiveFieldFilter,
  activeSeasonFilter,
  setActiveSeasonFilter,
}: ControlFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0C120F] border border-[#1E2E25] text-xs">
      <div className="flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-emerald-400" />
        <span className="font-semibold text-[#CADCD1]">Filter Telemetry:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Field Filter */}
        <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2 py-1">
          <span className="text-[#749081]">Parcel:</span>
          <select
            value={activeFieldFilter || 'all'}
            onChange={(e) => setActiveFieldFilter(e.target.value === 'all' ? null : e.target.value)}
            className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#121B16] text-[#E1ECE5]">All Parcels (2)</option>
            <option value="d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c" className="bg-[#121B16] text-[#E1ECE5]">
              North Sector Alpha (FLD-N01)
            </option>
            <option value="b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e" className="bg-[#121B16] text-[#E1ECE5]">
              East Terraced Basin (FLD-E04)
            </option>
          </select>
        </div>

        {/* Season Filter */}
        <div className="flex items-center gap-1.5 bg-[#121B16] border border-[#203227] rounded-lg px-2 py-1">
          <span className="text-[#749081]">Season:</span>
          <select
            value={activeSeasonFilter || 'all'}
            onChange={(e) => setActiveSeasonFilter(e.target.value === 'all' ? null : e.target.value)}
            className="bg-transparent text-[#E1ECE5] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#121B16] text-[#E1ECE5]">All Seasons</option>
            <option value="rabi" className="bg-[#121B16] text-[#E1ECE5]">Rabi (Current)</option>
            <option value="kharif" className="bg-[#121B16] text-[#E1ECE5]">Kharif (Stored)</option>
          </select>
        </div>

        {(activeFieldFilter || activeSeasonFilter) ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveFieldFilter(null);
              setActiveSeasonFilter(null);
            }}
            className="h-7 text-[11px] text-[#A6C0B2]"
          >
            Clear Filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

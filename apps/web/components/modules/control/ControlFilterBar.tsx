import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@nexfield/ui";

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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs">
      <div className="flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-emerald-700" />
        <span className="font-semibold text-[#46604D]">Filter Telemetry:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Field Filter */}
        <div className="flex items-center gap-1.5 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg px-2 py-1">
          <span className="text-[#46604D]">Parcel:</span>
          <select
            value={activeFieldFilter || "all"}
            onChange={(e) =>
              setActiveFieldFilter(
                e.target.value === "all" ? null : e.target.value,
              )
            }
            className="bg-transparent text-[#09251A] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#F7FAF2] text-[#09251A]">
              All Parcels (2)
            </option>
            <option
              value="d1a8f93e-2b5c-4d7e-9f0a-1b3c5e7a9b1c"
              className="bg-[#F7FAF2] text-[#09251A]"
            >
              North Sector Alpha (FLD-N01)
            </option>
            <option
              value="b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e"
              className="bg-[#F7FAF2] text-[#09251A]"
            >
              East Terraced Basin (FLD-E04)
            </option>
          </select>
        </div>

        {/* Season Filter */}
        <div className="flex items-center gap-1.5 bg-[#F7FAF2] border border-[#D1DDCD] rounded-lg px-2 py-1">
          <span className="text-[#46604D]">Season:</span>
          <select
            value={activeSeasonFilter || "all"}
            onChange={(e) =>
              setActiveSeasonFilter(
                e.target.value === "all" ? null : e.target.value,
              )
            }
            className="bg-transparent text-[#09251A] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#F7FAF2] text-[#09251A]">
              All Seasons
            </option>
            <option value="rabi" className="bg-[#F7FAF2] text-[#09251A]">
              Rabi (Current)
            </option>
            <option value="kharif" className="bg-[#F7FAF2] text-[#09251A]">
              Kharif (Stored)
            </option>
          </select>
        </div>

        {activeFieldFilter || activeSeasonFilter ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveFieldFilter(null);
              setActiveSeasonFilter(null);
            }}
            className="h-7 text-[11px] text-[#46604D]"
          >
            Clear Filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

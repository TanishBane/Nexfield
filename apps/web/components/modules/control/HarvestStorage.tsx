import React from "react";
import { Archive } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@nexfield/ui";

interface HarvestStorageProps {
  harvestSummary: {
    totalHarvestedKg: number;
    primaryGrade: string;
    avgMoisturePercent: number;
  };
}

export function HarvestStorage({ harvestSummary }: HarvestStorageProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Archive className="h-4 w-4 text-emerald-700" />
          Harvest Batch Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs font-mono">
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Total Siled Mass:</span>
          <span className="text-emerald-700 font-bold">
            {(harvestSummary.totalHarvestedKg / 1000).toFixed(1)} MT
          </span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Quality Grade:</span>
          <span className="text-[#09251A]">
            {harvestSummary.primaryGrade.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex justify-between p-2 rounded bg-[#F7FAF2] border border-[#D1DDCD]">
          <span className="text-[#46604D]">Moisture Level:</span>
          <span className="text-sky-700">
            {harvestSummary.avgMoisturePercent}% (Safe)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

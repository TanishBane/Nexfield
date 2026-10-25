import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "@nexfield/ui";

interface CultivationCycle {
  id: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  healthIndexScore: number;
  season: string;
  currentGrowthStage: string;
  stageProgressPercent: number;
  targetYieldMetricTons: number;
}

interface CultivationCyclesProps {
  cycles: CultivationCycle[];
}

export function CultivationCycles({ cycles }: CultivationCyclesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              Field & Crop-Cycle Overview
            </CardTitle>
            <CardDescription>
              Real-time growth phenology, health index, and sowing-to-harvest
              milestones.
            </CardDescription>
          </div>
          <Badge variant="outline" size="sm">
            {cycles.length} Displayed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cycles.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#46604D]">
            No crop cycles match the selected filter.
          </div>
        ) : (
          cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="font-semibold text-sm text-[#09251A] flex items-center gap-2">
                    {cycle.cropName} —{" "}
                    <span className="text-emerald-700 font-normal">
                      {cycle.variety}
                    </span>
                  </h4>
                  <p className="text-xs text-[#46604D] mt-0.5">
                    Sown: {cycle.sowingDate} • Target Harvest:{" "}
                    {cycle.expectedHarvestDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
                    Health Score: {cycle.healthIndexScore}/100
                  </span>
                  <Badge variant="outline" size="sm">
                    {cycle.season.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#46604D] capitalize flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-700" />
                    Stage: {cycle.currentGrowthStage.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono text-[#09251A] tabular-nums">
                    {cycle.stageProgressPercent}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#F7FAF2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${cycle.stageProgressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-[#46604D]">
                <span>Target Yield: {cycle.targetYieldMetricTons} MT</span>
                <Link
                  href="/twin"
                  className="text-emerald-700 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                >
                  Run Digital Twin <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

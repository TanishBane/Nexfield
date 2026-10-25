import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, ScanEye, Layers, Sprout, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, getConcentricRadius } from '@nexfield/ui';

interface CultivationCycle {
  id: string;
  fieldId?: string;
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
    <Card className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] shadow-xl">
      <CardHeader className="pb-3 border-b border-[#18251E]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-bold text-[#F1F6F3]">
              Spatial Field Parcels & Crop Phenology
            </CardTitle>
            <CardDescription className="text-xs text-[#9BB1A4]">
              Real-time growth phenology, health index scores, and sowing-to-harvest milestones.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#D7B678] bg-[#162B1F] border border-[#234230] px-2.5 py-1 rounded-full">
              {cycles.length} Active Parcels
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {cycles.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#8DA396] font-mono">
            No crop cycles match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cycles.map((cycle, idx) => {
              const isHealthy = cycle.healthIndexScore >= 85;
              return (
                <div
                  key={cycle.id || idx}
                  className="rounded-2xl bg-[#111714] border border-[#1E2E25] p-5 space-y-4 hover:border-emerald-600/40 transition-colors"
                >
                  {/* Parcel Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#18251E]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/30 text-emerald-400">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#F1F6F3]">
                          {cycle.cropName} — <span className="text-[#D7B678] font-normal">{cycle.variety}</span>
                        </h4>
                        <span className="text-[11px] font-mono text-[#8DA396]">
                          Parcel #{idx + 1} · {cycle.fieldId || 'Sector 2-B'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                          isHealthy
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/30'
                            : 'bg-amber-950/60 text-amber-300 border-amber-600/30'
                        }`}
                      >
                        Health: {cycle.healthIndexScore}/100
                      </span>
                      <Badge variant="outline" size="sm" className="uppercase text-[10px]">
                        {cycle.season}
                      </Badge>
                    </div>
                  </div>

                  {/* Growth Stage Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9BB1A4] capitalize flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" />
                        Stage: <strong className="text-[#F1F6F3]">{cycle.currentGrowthStage.replace(/_/g, ' ')}</strong>
                      </span>
                      <span className="font-mono text-emerald-400 font-bold tabular-nums">
                        {cycle.stageProgressPercent}% Accumulated
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#18251E] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${cycle.stageProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Phenology Milestones */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#0B100D] border border-[#18251E] text-[11px] font-mono">
                    <div>
                      <span className="text-[#8DA396]">Sowing Date:</span>
                      <div className="text-[#F1F6F3] font-semibold">{cycle.sowingDate}</div>
                    </div>
                    <div>
                      <span className="text-[#8DA396]">Expected Harvest:</span>
                      <div className="text-[#D7B678] font-semibold">{cycle.expectedHarvestDate}</div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#18251E] text-xs">
                    <span className="font-mono text-[#8DA396]">
                      Target: <strong className="text-[#F1F6F3] font-bold">{cycle.targetYieldMetricTons} MT</strong>
                    </span>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/fieldsight"
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 transition-colors"
                      >
                        <ScanEye className="w-3.5 h-3.5" />
                        <span>Foliar Scan</span>
                      </Link>
                      <Link
                        href="/twin"
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#D7B678]" />
                        <span>Simulate 3D</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

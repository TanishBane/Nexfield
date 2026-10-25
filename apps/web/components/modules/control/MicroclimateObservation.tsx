import React from "react";
import { Sun, CloudRain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@nexfield/ui";

interface ForecastDay {
  day: string;
  tempMaxC: number;
  tempMinC: number;
  rainProbPercent: number;
  etoMm: number;
}

interface MicroclimateObservationProps {
  weatherSummary: {
    referenceEToMmPerDay?: number;
    forecastText: string;
  };
  forecastDays: ForecastDay[];
}

export function MicroclimateObservation({
  weatherSummary,
  forecastDays,
}: MicroclimateObservationProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-700" />
            5-Day Microclimate Observation & Agro-Forecast
          </CardTitle>
          <span className="text-xs font-mono text-[#46604D]">
            Reference ETo: {weatherSummary.referenceEToMmPerDay || 4.2} mm/day
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] p-3 text-xs md:text-sm text-[#46604D] leading-relaxed">
          <span className="font-semibold text-emerald-700">
            Microclimate Advisory:
          </span>{" "}
          {weatherSummary.forecastText}
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {forecastDays.map((f, i) => (
            <div
              key={i}
              className="rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] p-2.5 text-xs text-center space-y-1 font-mono"
            >
              <span className="text-[#46604D] text-[11px] block font-sans font-semibold">
                {f.day}
              </span>
              <span className="text-[#09251A] font-bold text-sm block">
                {f.tempMaxC}° / {f.tempMinC}°
              </span>
              <div className="flex items-center justify-center gap-1 text-[11px] text-sky-700">
                <CloudRain className="h-3 w-3" />
                <span>{f.rainProbPercent}%</span>
              </div>
              <span className="text-[10px] text-[#46604D] block truncate">
                ETo: {f.etoMm}mm
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { cn } from "./utils";
import { Card, CardContent } from "./card";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "emerald" | "amber" | "sky" | "rose";
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  subValue,
  trend,
  trendValue,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const borderVariants = {
    default: "bg-white hover:border-[#A3BD94]",
    emerald: "bg-[#E5F2CF] border-[#B8D494]",
    amber: "bg-[#FFF0A6] border-[#E7D57A]",
    sky: "bg-[#D5ECFD] border-[#A2C9E5]",
    rose: "bg-[#FBE0E8] border-[#E9B4C4]",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        borderVariants[variant],
        className,
      )}
    >
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-semibold tracking-wide text-[#46604D]">
            {label}
          </p>
          {icon ? <div className="text-emerald-700">{icon}</div> : null}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-[#09251A] tabular-nums">
            {value}
          </span>
          {unit ? (
            <span className="text-sm font-medium text-[#46604D]">{unit}</span>
          ) : null}
        </div>

        {trendValue || subValue ? (
          <div className="mt-3 flex items-center justify-between text-sm">
            {subValue ? (
              <span className="text-[#46604D] truncate">{subValue}</span>
            ) : (
              <span />
            )}
            {trendValue ? (
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums px-2 py-0.5 rounded text-xs",
                  trend === "up" &&
                    "text-emerald-700 bg-emerald-50/80 border border-emerald-800/60",
                  trend === "down" &&
                    "text-rose-700 bg-rose-50/80 border border-rose-800/60",
                  trend === "neutral" &&
                    "text-[#46604D] bg-[#F7FAF2] border border-[#D1DDCD]",
                )}
              >
                {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}
                {trendValue}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

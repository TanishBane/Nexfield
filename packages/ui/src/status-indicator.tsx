import React from "react";
import { cn } from "./utils";

export interface StatusIndicatorProps {
  status: "online" | "warning" | "error" | "syncing" | "fixture";
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  pulse = true,
  className,
}: StatusIndicatorProps) {
  const configs = {
    online: {
      dot: "bg-[#048547]",
      ping: "bg-[#048547]",
      text: "text-[#005B36]",
      bg: "bg-[#E5F2CF] border-[#B8D494]",
      defaultLabel: "Live Telemetry Active",
    },
    warning: {
      dot: "bg-[#D97706]",
      ping: "bg-[#D97706]",
      text: "text-[#92400E]",
      bg: "bg-[#FFF0A6] border-[#E7D57A]",
      defaultLabel: "Alert Detected",
    },
    error: {
      dot: "bg-[#DC2626]",
      ping: "bg-[#DC2626]",
      text: "text-[#991B1B]",
      bg: "bg-[#FBE0E8] border-[#E9B4C4]",
      defaultLabel: "Sensor Disconnected",
    },
    syncing: {
      dot: "bg-[#0284C7]",
      ping: "bg-[#0284C7]",
      text: "text-[#0369A1]",
      bg: "bg-[#D5ECFD] border-[#A2C9E5]",
      defaultLabel: "Model Simulating...",
    },
    fixture: {
      dot: "bg-[#D97706]",
      ping: "bg-[#D97706]",
      text: "text-[#92400E]",
      bg: "bg-[#FFF0A6] border-[#E7D57A]",
      defaultLabel: "Synthetic Baseline Fixtures",
    },
  };

  const current = configs[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs",
        current.bg,
        current.text,
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse ? (
          <span
            className={cn(
              "motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              current.ping,
            )}
          />
        ) : null}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            current.dot,
          )}
        />
      </span>
      <span>{label || current.defaultLabel}</span>
    </div>
  );
}

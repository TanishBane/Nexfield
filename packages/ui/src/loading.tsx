import React from "react";
import { cn } from "./utils";

export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-emerald-500 border-t-transparent",
        sizeMap[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#F7FAF2]/80 border border-[#D1DDCD]/50",
        className,
      )}
      {...props}
    />
  );
}

export function ModuleLoadingState({
  message = "Synchronizing agronomic telemetry...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 space-y-4">
      <div className="relative">
        <LoadingSpinner size="lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-50" />
        </div>
      </div>
      <p className="text-sm font-medium text-[#46604D] tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}

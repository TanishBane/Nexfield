import React from "react";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "outline"
    | "hydrology"
    | "spectral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-[#F7FAF2] text-[#46604D] border border-[#D1DDCD]",
    success: "bg-emerald-50/60 text-emerald-700 border border-emerald-800/50",
    warning: "bg-amber-50/60 text-amber-700 border border-amber-800/50",
    destructive: "bg-rose-50/60 text-rose-700 border border-rose-800/50",
    outline: "border border-[#D1DDCD] text-[#46604D]",
    hydrology: "bg-sky-50/60 text-sky-700 border border-sky-800/50",
    spectral: "bg-purple-50/60 text-purple-700 border border-purple-800/50",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-md tracking-wide transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

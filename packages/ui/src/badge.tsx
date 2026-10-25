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
    default: "bg-[#FFFFFF] text-[#46604D] border border-[#D1DDCD]",
    success: "bg-[#EAF6ED] text-[#005B36] border border-[#A3D9B5]",
    warning: "bg-[#FFF9DB] text-[#854D0E] border border-[#EBD377]",
    destructive: "bg-[#FFF1F2] text-[#BE123C] border border-[#FDA4AF]",
    outline: "border border-[#D1DDCD] bg-transparent text-[#46604D]",
    hydrology: "bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC]",
    spectral: "bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE]",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 font-medium",
    md: "text-xs sm:text-sm px-3 py-1 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center font-medium rounded-md tracking-wide transition-colors select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

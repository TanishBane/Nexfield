import React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg text-sm";

    const variants = {
      primary:
        "bg-[#048547] hover:bg-[#005B36] text-white font-semibold active:bg-[#005B36] border border-transparent",
      secondary:
        "bg-[#F7FAF2] hover:bg-[#FFFFFF] text-[#09251A] border border-[#D1DDCD] active:bg-[#F7FAF2]",
      outline:
        "border border-[#D1DDCD] hover:bg-[#F7FAF2] text-[#46604D] hover:border-[#D1DDCD] active:bg-[#F7FAF2]",
      ghost:
        "hover:bg-[#F7FAF2] text-[#46604D] hover:text-[#09251A] active:bg-[#F7FAF2]",
      destructive:
        "bg-rose-50/60 hover:bg-rose-100 text-rose-700 border border-rose-700/50 active:bg-rose-50",
      subtle:
        "bg-emerald-50/40 hover:bg-emerald-50/50 text-emerald-700 border border-emerald-800/40",
    };

    const sizes = {
      sm: "min-h-9 px-3 text-sm gap-1.5",
      md: "min-h-11 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

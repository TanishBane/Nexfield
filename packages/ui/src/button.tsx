import React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "subtle";
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
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg text-sm cursor-pointer active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#048547] hover:bg-[#005B36] text-white font-semibold active:bg-[#005B36] border border-transparent shadow-sm",
      secondary:
        "bg-[#FFFFFF] hover:bg-[#F7FAF2] text-[#09251A] border border-[#D1DDCD] hover:border-[#B8CDB3] active:bg-[#EDF4E7] shadow-sm",
      outline:
        "border border-[#D1DDCD] bg-transparent hover:bg-[#F7FAF2] text-[#46604D] hover:text-[#09251A] hover:border-[#B8CDB3] active:bg-[#EDF4E7]",
      ghost:
        "bg-transparent hover:bg-[#F7FAF2] text-[#46604D] hover:text-[#09251A] active:bg-[#EDF4E7]",
      destructive:
        "bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-300 active:bg-rose-100/80 font-medium",
      subtle:
        "bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 border border-emerald-200 active:bg-emerald-100 font-medium",
    };

    const sizes = {
      sm: "min-h-[36px] px-3 text-xs sm:text-sm gap-1.5",
      md: "min-h-[44px] px-4 text-sm gap-2",
      lg: "min-h-[48px] px-6 text-base gap-2.5",
      icon: "min-h-[44px] min-w-[44px] p-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? "true" : undefined}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 shrink-0"
          />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

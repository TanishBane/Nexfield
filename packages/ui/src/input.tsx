import React from "react";
import { cn } from "./utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-[44px] w-full rounded-lg border border-[#D1DDCD] bg-[#FFFFFF] px-3.5 py-2.5 text-base md:text-sm text-[#09251A] placeholder:text-[#526750] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#048547] focus-visible:ring-offset-1 focus-visible:border-[#048547] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

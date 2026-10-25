import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'subtle' | 'wheat';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D0B] disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg text-sm';

    const variants = {
      primary:
        'bg-emerald-600 hover:bg-emerald-500 text-[#090D0B] font-semibold shadow-md shadow-emerald-950/50 active:bg-emerald-700 border border-emerald-400/30',
      secondary:
        'bg-[#18231C] hover:bg-[#202E26] text-[#E2ECE5] border border-[#273C30] active:bg-[#131D16]',
      outline:
        'border border-[#2C3F34] hover:bg-[#141F18] text-[#D1E0D7] hover:border-[#3E594A] active:bg-[#101913]',
      ghost:
        'hover:bg-[#18231C] text-[#B0C4B8] hover:text-[#E8F1EC] active:bg-[#131D16]',
      destructive:
        'bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border border-rose-800/60 active:bg-rose-950',
      subtle:
        'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40',
      wheat:
        'bg-[#D7B678] hover:bg-[#E5C68A] text-[#17251B] font-semibold shadow-md shadow-[#D7B678]/10 active:bg-[#C9A665] border border-[#D7B678]/40',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
      icon: 'h-9 w-9 p-0',
      'icon-sm': 'h-8 w-8 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0 mr-1.5" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

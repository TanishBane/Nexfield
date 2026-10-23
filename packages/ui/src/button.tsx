import React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg text-sm';

    const variants = {
      primary:
        'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm shadow-emerald-950/50 active:bg-emerald-700 border border-emerald-500/30',
      secondary:
        'bg-[#18231C] hover:bg-[#202E26] text-[#E2ECE5] border border-[#273C30] active:bg-[#131D16]',
      outline:
        'border border-[#2C3F34] hover:bg-[#141F18] text-[#D1E0D7] hover:border-[#3E594A] active:bg-[#101913]',
      ghost:
        'hover:bg-[#18231C] text-[#B0C4B8] hover:text-[#E8F1EC] active:bg-[#131D16]',
      destructive:
        'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/50 active:bg-rose-950',
      subtle:
        'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
      icon: 'h-9 w-9 p-0',
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
  }
);

Button.displayName = 'Button';

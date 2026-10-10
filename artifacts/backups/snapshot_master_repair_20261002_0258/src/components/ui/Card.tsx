import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'flat' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-5',
      lg: 'p-5 sm:p-6',
    };

    const variantStyles = {
      default: 'bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-sm',
      interactive:
        'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 rounded-2xl transition-all cursor-pointer active:scale-[0.99] hover:bg-slate-850',
      flat: 'bg-slate-900/40 border border-slate-800/60 text-slate-100 rounded-2xl',
      accent: 'bg-gradient-to-b from-slate-850 to-slate-900 border border-rose-500/20 text-slate-100 rounded-2xl shadow-sm',
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

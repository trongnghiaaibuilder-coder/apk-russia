import React from 'react';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'default' | 'subtle' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      variant = 'default',
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Ensures min 44x44 touch target size on mobile
    const sizeClasses = {
      sm: 'w-11 h-11 text-sm rounded-xl',
      md: 'w-12 h-12 text-base rounded-xl',
      lg: 'w-14 h-14 text-lg rounded-2xl',
    };

    const variantClasses = {
      default: 'bg-slate-800 v2-text border border-slate-750 hover:bg-slate-700 active:bg-slate-850',
      subtle: 'v2-bg-soft/60 v2-text-muted border v2-divider/80 hover:bg-slate-800 hover:opacity-70',
      ghost: 'bg-transparent v2-text-muted hover:opacity-70 hover:bg-slate-850',
      danger: 'v2-accent-soft v2-accent-text border border-red-500/20 hover:bg-red-500/20',
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="shrink-0">{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

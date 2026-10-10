import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const sizeStyles = {
      sm: 'min-h-[40px] px-3 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'min-h-[48px] px-4 py-2.5 text-sm rounded-xl gap-2',
      lg: 'min-h-[52px] px-5 py-3 text-base rounded-2xl gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/40',
      secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700/60',
      outline: 'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700',
      danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-950/40',
      ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span className="whitespace-nowrap truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

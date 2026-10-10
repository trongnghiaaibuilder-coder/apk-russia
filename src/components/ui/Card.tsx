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
      default: 'v2-card v2-text rounded-3xl shadow-sm',
      interactive:
        'v2-card v2-text rounded-3xl transition-all cursor-pointer active:scale-[0.99]',
      flat: 'v2-card v2-text rounded-3xl',
      accent: 'v2-accent-soft border v2-divider v2-text rounded-3xl shadow-sm',
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

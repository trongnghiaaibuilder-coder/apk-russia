import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  kicker?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  kicker,
  className,
}) => {
  return (
    <div className={cn('flex items-end justify-between gap-3 mb-3.5', className)}>
      <div className="space-y-0.5 min-w-0">
        {kicker && (
          <p className="text-xs font-medium tracking-wide v2-accent-text uppercase">
            {kicker}
          </p>
        )}
        <h2 className="text-base sm:text-lg font-semibold v2-text tracking-tight truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs v2-text-muted line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

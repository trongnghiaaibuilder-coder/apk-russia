import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl v2-bg-soft/30 border v2-divider/60',
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl v2-accent-soft v2-text-muted mb-3 border v2-divider">
        {icon || <Inbox className="w-5 h-5 v2-text-muted" />}
      </div>
      <h3 className="text-sm font-semibold v2-text">{title}</h3>
      <p className="text-xs v2-text-muted mt-1 max-w-xs leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

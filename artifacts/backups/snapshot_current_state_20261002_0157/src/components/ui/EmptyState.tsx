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
        'flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-slate-900/30 border border-slate-800/60',
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mb-3 border border-slate-750">
        {icon || <Inbox className="w-5 h-5 text-slate-400" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed mb-4">
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

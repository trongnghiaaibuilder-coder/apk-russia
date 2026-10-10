import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  description,
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60',
        className
      )}
    >
      <div className="relative flex items-center justify-center w-12 h-12 mb-3">
        <div className="w-10 h-10 border-2 border-slate-750 rounded-full" />
        <div className="absolute top-1 left-1 w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-200">{message}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
      )}
    </div>
  );
};

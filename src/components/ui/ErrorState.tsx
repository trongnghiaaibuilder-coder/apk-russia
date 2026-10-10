import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-red-950/20 border border-red-500/20',
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl v2-accent-soft v2-accent-text mb-3 border border-red-500/20">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold v2-text">{title}</h3>
      <p className="text-xs v2-text-muted mt-1 max-w-sm leading-relaxed mb-4">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

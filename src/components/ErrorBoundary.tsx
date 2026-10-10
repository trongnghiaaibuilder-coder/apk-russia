import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button } from './ui/Button';
import { logger } from '../services/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary', error.message, { error, componentStack: errorInfo.componentStack });
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen v2-bg v2-text flex items-center justify-center p-4">
          <div className="w-full max-w-sm v2-bg-soft border border-red-500/30 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl v2-accent-soft border border-red-500/30 flex items-center justify-center v2-accent-text">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h1 className="text-lg font-bold v2-text">
              Application Error
            </h1>
            <p className="text-xs v2-text-muted mt-2 leading-relaxed">
              Russia AI Support encountered an unexpected error. Your state has been preserved safely.
            </p>
            {this.state.error && (
              <div className="mt-3 p-3 v2-bg/80 rounded-xl border v2-divider text-left overflow-x-auto text-[11px] font-mono text-red-300 max-h-24">
                {this.state.error.name}: {this.state.error.message}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={this.handleReset}
                leftIcon={<Home className="w-4 h-4" />}
                fullWidth
              >
                Return to Safe Home
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                fullWidth
              >
                Reload Application
              </Button>
            </div>
            <p className="text-[10px] v2-text-faint mt-4">
              Nước Nga Trong Tầm Tay
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Application Error
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Russia AI Support encountered an unexpected error. Your state has been preserved safely.
            </p>
            {this.state.error && (
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-red-300 max-h-24">
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
            <p className="text-[10px] text-slate-500 mt-4">
              Russia AI Support • Xương Rồng AI developer
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

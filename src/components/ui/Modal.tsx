import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={cn(
          'w-full max-w-lg v2-bg-soft border v2-divider rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-200',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b v2-divider">
          <div className="min-w-0 pr-3">
            <h3 id="modal-headline" className="text-base font-semibold v2-text truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs v2-text-muted mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <IconButton
            icon={<X className="w-5 h-5" />}
            label="Close dialog"
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm v2-text-muted">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 v2-bg-soft/90 border-t v2-divider flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '../../utils/cn';

export interface NavigationItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badge?: string | number;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  icon,
  isActive,
  onClick,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 px-1 transition-all cursor-pointer select-none focus-visible:outline-none',
        isActive
          ? 'v2-accent-text font-semibold'
          : 'v2-text-muted hover:opacity-70 font-normal'
      )}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={cn(
            'transition-transform duration-150',
            isActive ? 'scale-110 v2-accent-text' : 'v2-text-muted'
          )}
        >
          {icon}
        </span>
        {badge !== undefined && (
          <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 text-[10px] font-bold leading-none flex items-center justify-center v2-accent-bg rounded-full">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] tracking-tight mt-1 truncate max-w-[64px]">
        {label}
      </span>
      {isActive && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-500" />
      )}
    </button>
  );
};

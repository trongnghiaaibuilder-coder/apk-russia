import React from 'react';
import { ShieldAlert, Wifi, WifiOff, Info } from 'lucide-react';
import { TabId } from '../../types/navigation';
import { cn } from '../../utils/cn';

export interface HeaderProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
  isOnline: boolean;
  onOpenInfo: () => void;
  onTriggerEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isOnline,
  onOpenInfo,
  onTriggerEmergency,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full v2-nav-bg border-b v2-divider">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer"
        >
          <span className="w-9 h-9 rounded-2xl v2-hero flex items-center justify-center text-lg shadow-lg">
            🇷🇺
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight v2-text leading-tight">
              Nước Nga Trong Tầm Tay
            </span>
            <span className="text-[11px] v2-text-muted leading-tight">
              Học tiếng Nga mỗi ngày
            </span>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium',
              isOnline
                ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/10'
                : 'text-amber-600 border-amber-500/30 bg-amber-500/10'
            )}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </span>
          <button
            type="button"
            onClick={onOpenInfo}
            className="w-9 h-9 flex items-center justify-center rounded-xl v2-text-muted hover:v2-text hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            aria-label="Thông tin ứng dụng"
          >
            <Info className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            onClick={onTriggerEmergency}
            className={cn(
              'h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95',
              currentTab === 'emergency'
                ? 'v2-accent-bg shadow-lg'
                : 'v2-accent-soft v2-accent-text border v2-divider'
            )}
            aria-label="SOS khẩn cấp"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

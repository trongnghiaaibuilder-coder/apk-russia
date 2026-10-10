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
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="text-xl select-none" role="img" aria-label="Russian flag">
            🇷🇺
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-100 group-hover:text-rose-400 transition-colors whitespace-nowrap">
              Russia AI Support
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              Xương Rồng AI
            </span>
          </div>
        </button>

        {/* Network / Offline indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border',
              isOnline
                ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20'
                : 'text-amber-400 border-amber-500/20 bg-amber-950/20'
            )}
            title={isOnline ? 'Network connected' : 'Offline mode active'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Offline</span>
              </>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenInfo}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            aria-label="Application specifications and developer credit"
            title="App Specifications"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onTriggerEmergency}
            className={cn(
              'h-9 px-2.5 flex items-center gap-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all active:scale-95',
              currentTab === 'emergency'
                ? 'bg-red-600 text-white shadow-sm shadow-red-950/40'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
            )}
            aria-label="Direct emergency quick access"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="hidden xs:inline font-bold">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

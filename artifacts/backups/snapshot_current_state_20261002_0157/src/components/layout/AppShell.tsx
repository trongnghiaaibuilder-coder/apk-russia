import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { TabId } from '../../types/navigation';

export interface AppShellProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
  isOnline: boolean;
  onOpenInfo: () => void;
  onTriggerEmergency: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onNavigate,
  isOnline,
  onOpenInfo,
  onTriggerEmergency,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center selection:bg-rose-500/25 selection:text-rose-200">
      {/* Mobile-first frame container */}
      <div className="w-full max-w-md bg-slate-950 min-h-screen flex flex-col relative sm:border-x sm:border-slate-800/80 sm:shadow-2xl">
        <Header
          currentTab={currentTab}
          onNavigate={onNavigate}
          isOnline={isOnline}
          onOpenInfo={onOpenInfo}
          onTriggerEmergency={onTriggerEmergency}
        />
        <main className="flex-1 px-4 py-5 pb-24 overflow-x-hidden">
          {children}
        </main>
        <BottomNav currentTab={currentTab} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

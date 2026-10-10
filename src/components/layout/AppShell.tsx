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
    <div className="min-h-screen v2-bg v2-text flex justify-center">
      <div className="w-full max-w-md v2-bg min-h-screen flex flex-col relative">
        <Header
          currentTab={currentTab}
          onNavigate={onNavigate}
          isOnline={isOnline}
          onOpenInfo={onOpenInfo}
          onTriggerEmergency={onTriggerEmergency}
        />
        <main className="flex-1 px-4 py-5 pb-28 v2-scroll overflow-x-hidden">
          {children}
        </main>
        <BottomNav currentTab={currentTab} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

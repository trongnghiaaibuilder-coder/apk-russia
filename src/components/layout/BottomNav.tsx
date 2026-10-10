import React from 'react';
import { Home, BookOpen, Languages, Mic, Camera, Bot, ShieldAlert, Settings } from 'lucide-react';
import { TabId } from '../../types/navigation';
import { cn } from '../../utils/cn';

export interface BottomNavProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
}

const NAV_ITEMS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
  { id: 'learn', label: 'Học', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'translate', label: 'Dịch', icon: <Languages className="w-5 h-5" /> },
  { id: 'voice', label: 'Nói', icon: <Mic className="w-5 h-5" /> },
  { id: 'camera', label: 'Quét', icon: <Camera className="w-5 h-5" /> },
  { id: 'assistant', label: 'Trợ lý', icon: <Bot className="w-5 h-5" /> },
  { id: 'emergency', label: 'SOS', icon: <ShieldAlert className="w-5 h-5" /> },
  { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        <div className="mx-3 mb-3 rounded-3xl v2-nav-bg border v2-divider shadow-2xl px-1 py-2">
          <div className="grid grid-cols-8 gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95',
                    isActive ? 'v2-accent-text' : 'v2-text-faint'
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-10 h-8 rounded-xl transition-all',
                      isActive && 'v2-accent-soft'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className={cn('text-[10px] font-medium leading-none', isActive && 'font-bold')}>
                    {item.label}
                  </span>
                  {isActive && <span className="w-1 h-1 rounded-full v2-accent-bg" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

import React from 'react';
import { Home, BookOpen, Languages, Mic, Camera, Bot, ShieldAlert, Settings } from 'lucide-react';
import { TabId, NavItemConfig } from '../../types/navigation';
import { NavigationItem } from '../ui/NavigationItem';

export interface BottomNavProps {
  currentTab: TabId;
  onNavigate: (tab: TabId) => void;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home', iconName: 'Home', description: 'Application overview' },
  { id: 'learn', label: 'Học', iconName: 'BookOpen', description: 'Russian lessons & vocabulary' },
  { id: 'translate', label: 'Dịch', iconName: 'Languages', description: 'Bilingual text translator' },
  { id: 'voice', label: 'Voice', iconName: 'Mic', description: 'Voice translation & 2-way conversation' },
  { id: 'camera', label: 'OCR', iconName: 'Camera', description: 'Camera viewfinder & optical recognition' },
  { id: 'assistant', label: 'Trợ lý', iconName: 'Bot', description: 'Russia practical guide & AI assistant' },
  { id: 'emergency', label: 'SOS', iconName: 'ShieldAlert', description: 'Emergency contacts & offline cards' },
  { id: 'settings', label: 'Cài đặt', iconName: 'Settings', description: 'App preferences & system' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const getIcon = (id: TabId) => {
    const iconClass = 'w-4 h-4 sm:w-5 sm:h-5';
    switch (id) {
      case 'home':
        return <Home className={iconClass} />;
      case 'learn':
        return <BookOpen className={iconClass} />;
      case 'translate':
        return <Languages className={iconClass} />;
      case 'voice':
        return <Mic className={iconClass} />;
      case 'camera':
        return <Camera className={iconClass} />;
      case 'assistant':
        return <Bot className={iconClass} />;
      case 'emergency':
        return <ShieldAlert className={iconClass} />;
      case 'settings':
        return <Settings className={iconClass} />;
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 pb-[max(env(safe-area-inset-bottom),8px)] pt-1"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto px-0.5 flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => (
          <NavigationItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={getIcon(item.id)}
            isActive={currentTab === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

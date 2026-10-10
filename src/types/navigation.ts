/**
 * Navigation types for Russia AI Support
 * Developer credit: Xương Rồng AI developer
 */
export type TabId = 'home' | 'learn' | 'translate' | 'voice' | 'camera' | 'assistant' | 'emergency' | 'settings' | 'maps' | 'currency';

export interface NavItemConfig {
  id: TabId;
  label: string;
  iconName: string;
  badge?: string | number;
  description: string;
}

export type ModalType = 
  | 'voice_preview'
  | 'camera_preview'
  | 'offline_status'
  | 'dev_info'
  | 'test_error'
  | null;

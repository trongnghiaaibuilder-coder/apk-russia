/**
 * Architecture contracts and module interfaces for Russia AI Support
 * Developer credit: Xương Rồng AI developer
 */
export type ModuleStatus = 'planned' | 'foundation' | 'active' | 'verified';

export interface BaseModuleManifest {
  id: string;
  name: string;
  version: string;
  status: ModuleStatus;
  description: string;
  offlineCapable: boolean;
  capabilities: string[];
}

export interface LearningModuleState {
  currentLevel: 'A1' | 'A2' | 'B1' | 'B2';
  completedLessons: number;
  savedVocabularyCount: number;
  offlinePacksDownloaded: boolean;
}

export interface TranslationModuleState {
  sourceLanguage: string;
  targetLanguage: string;
  historyCount: number;
  isOfflineDictReady: boolean;
}

export interface VoiceModuleState {
  isListening: boolean;
  isSpeaking: boolean;
  audioInputDeviceAvailable: boolean;
  mode: 'translation' | 'conversation';
}

export interface CameraModuleState {
  hasCameraPermission: boolean;
  ocrProcessing: boolean;
}

export interface AssistantModuleState {
  conversationId: string | null;
  messageCount: number;
  isThinking: boolean;
}

export interface EmergencyModuleState {
  activeHelplineCount: number;
  offlineEmergencyCardsReady: boolean;
  locationAccessGranted: boolean;
}

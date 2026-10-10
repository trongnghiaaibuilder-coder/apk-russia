/**
 * Russia AI Support - Translation Engine Types
 * Developer: Xương Rồng AI developer
 * Phase: P3 — TRANSLATION SYSTEM
 */

export type SupportedLanguage = 'vi' | 'ru';

export interface TranslationResult {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  provider: 'local_fallback_demo' | 'external_provider';
  timestamp: string;
  isFallback: boolean;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  timestamp: string;
  provider: string;
}

export interface TranslationRequest {
  text: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
}

export interface TranslationResponse {
  success: boolean;
  result?: TranslationResult;
  error?: string;
  isFallback?: boolean;
}

export interface TranslationProviderConfig {
  providerName: string;
  isConfigured: boolean;
  endpoint?: string;
  timeoutMs?: number;
}

export interface TranslatorModuleProps {
  initialText?: string;
  initialSourceLang?: SupportedLanguage;
  onOpenVoice?: () => void;
  onOpenCamera?: () => void;
}

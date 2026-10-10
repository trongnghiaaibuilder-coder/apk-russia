/**
 * Russia AI Support - AI Assistant Types & Contracts
 * Developer: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 */

export type AssistantRole = 'user' | 'assistant' | 'system';

export type AssistantProviderType = 
  | 'gemini-2.5-flash'
  | 'groq-gpt-oss'
  | 'offline_local_knowledge'
  | 'mock_test_provider';

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  content: string;
  timestamp: string;
  provider: AssistantProviderType;
  isFallback?: boolean;
  error?: boolean;
}

export interface AssistantContext {
  currentTopic?: string;
  userLanguage?: 'vi' | 'ru';
  isOnline?: boolean;
}

export interface AssistantResponse {
  success: boolean;
  message?: AssistantMessage;
  error?: string;
  errorCode?: 'EMPTY_PROMPT' | 'PROMPT_TOO_LONG' | 'NETWORK_ERROR' | 'TIMEOUT' | 'PROVIDER_ERROR' | 'INVALID_RESPONSE' | 'INVALID_API_KEY' | 'RATE_LIMITED' | 'EMPTY_RESPONSE';
  durationMs: number;
}

export interface PresetAssistantTopic {
  id: string;
  labelVi: string;
  descriptionVi: string;
  sampleQuestion: string;
  category: 'visa_legal' | 'daily_life' | 'survival' | 'medical_health' | 'studying_in_russia';
}

export interface IAIAssistantProvider {
  readonly providerId: AssistantProviderType;
  readonly providerName: string;
  sendMessage(
    messages: AssistantMessage[], 
    context?: AssistantContext
  ): Promise<AssistantResponse>;
}

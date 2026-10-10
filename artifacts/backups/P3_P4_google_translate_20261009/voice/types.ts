/**
 * Russia AI Support - Voice & 2-Way Conversation Types
 * Developer: Xương Rồng AI developer
 * Phase: P4 — VOICE TRANSLATION & 2-WAY CONVERSATION
 */

export type VoiceMode = 'translation' | 'conversation';
export type VoiceModeType = VoiceMode;
export type VoiceDirection = 'vi_to_ru' | 'ru_to_vi';

export type VoiceState =
  | 'idle'
  | 'requesting_permission'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'translating'
  | 'ready_to_play'
  | 'playing'
  | 'error';

export type SpeechRecognitionErrorCode =
  | 'not-supported'
  | 'permission-denied'
  | 'audio-capture'
  | 'no-speech'
  | 'network'
  | 'aborted'
  | 'unknown';

export type ConversationSpeaker = 'user' | 'russianSpeaker';

export interface ConversationMessage {
  id: string;
  speaker: ConversationSpeaker;
  sourceLanguage: 'vi' | 'ru';
  targetLanguage: 'vi' | 'ru';
  sourceText: string;
  translatedText: string;
  timestamp: number;
  audioAvailable?: boolean;
}

export type ConversationMessageData = ConversationMessage;

export interface SpeechRecognitionResultEvent {
  transcript: string;
  isFinal: boolean;
}

export interface SpeechRecognitionService {
  startListening(
    language: string,
    onResult: (e: SpeechRecognitionResultEvent) => void,
    onError: (code: SpeechRecognitionErrorCode, message: string) => void,
    onEnd: () => void
  ): Promise<void>;
  stopListening(): Promise<void>;
  cancelListening(): Promise<void>;
  isListening(): boolean;
  getTranscript(): string;
  isSupported(): boolean;
}

export interface TextToSpeechService {
  speak(
    text: string,
    language: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<boolean>;
  stop(): Promise<void>;
  pause?(): Promise<void>;
  resume?(): Promise<void>;
  isSpeaking(): boolean;
  isSupported(): boolean;
  resolveLanguageTag(lang: 'vi' | 'ru' | string): string;
}

export interface VoiceModuleProps {
  initialMode?: VoiceMode;
  onClose?: () => void;
}

/**
 * Voice Translation & Conversation Orchestrator
 * Russia AI Support - Phase P4
 * Strict Requirement:
 * - REUSES P3 Translation Engine (translationService.translate).
 * - DOES NOT duplicate translation code.
 * - Orchestrates Speech Recognition -> Transcript -> P3 Translation -> Text-to-Speech.
 * - Manages conversation history in memory for current session without deleting other modules' data.
 */
import {
  ConversationMessage,
  ConversationSpeaker,
  VoiceDirection,
  VoiceState,
  SpeechRecognitionErrorCode,
} from '../types';
import { translationService } from '../../translator/services/translationService';
import { speechRecognitionService } from './speechRecognitionService';
import { textToSpeechService } from './textToSpeechService';
import { logger } from '../../../services/logger';

export interface VoiceOrchestratorListener {
  onStateChange: (state: VoiceState, message?: string) => void;
  onTranscriptUpdate: (transcript: string, isFinal: boolean) => void;
  onTranslationResult: (sourceText: string, translatedText: string) => void;
  onNewConversationMessage?: (message: ConversationMessage) => void;
}

class VoiceTranslationOrchestrator {
  private currentState: VoiceState = 'idle';
  private conversationHistory: ConversationMessage[] = [];
  private activeDirection: VoiceDirection = 'vi_to_ru';
  private listeners: Set<VoiceOrchestratorListener> = new Set();
  private lastTranscript: string = '';
  private lastTranslatedText: string = '';

  getState(): VoiceState {
    return this.currentState;
  }

  getDirection(): VoiceDirection {
    return this.activeDirection;
  }

  setDirection(direction: VoiceDirection) {
    this.activeDirection = direction;
  }

  getConversationHistory(): readonly ConversationMessage[] {
    return this.conversationHistory;
  }

  getLastTranscript(): string {
    return this.lastTranscript;
  }

  getLastTranslatedText(): string {
    return this.lastTranslatedText;
  }

  subscribe(listener: VoiceOrchestratorListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyState(state: VoiceState, message?: string) {
    this.currentState = state;
    this.listeners.forEach((l) => l.onStateChange(state, message));
  }

  private notifyTranscript(transcript: string, isFinal: boolean) {
    this.lastTranscript = transcript;
    this.listeners.forEach((l) => l.onTranscriptUpdate(transcript, isFinal));
  }

  private notifyTranslation(sourceText: string, translatedText: string) {
    this.lastTranslatedText = translatedText;
    this.listeners.forEach((l) => l.onTranslationResult(sourceText, translatedText));
  }

  /**
   * Translates text using the official P3 Translation Engine.
   */
  async executeTranslation(
    text: string,
    sourceLang: 'vi' | 'ru',
    targetLang: 'vi' | 'ru'
  ): Promise<{ success: boolean; translatedText: string; error?: string }> {
    if (!text || !text.trim()) {
      return { success: false, translatedText: '', error: 'Không có nội dung để dịch.' };
    }

    try {
      const response = await translationService.translate({
        text: text.trim(),
        sourceLang,
        targetLang,
      });

      if (response.success && response.result) {
        return { success: true, translatedText: response.result.translatedText };
      }

      return {
        success: false,
        translatedText: '',
        error: response.error || 'Dịch vụ dịch thuật P3 không thể hoàn thành yêu cầu.',
      };
    } catch (err: any) {
      return {
        success: false,
        translatedText: '',
        error: err?.message || 'Lỗi không xác định khi gọi động cơ dịch P3.',
      };
    }
  }

  /**
   * Mode A: Starts 1-Way Voice Translation Flow
   * Speech -> Final Transcript -> P3 Translation -> TTS
   */
  async startVoiceTranslation(direction: VoiceDirection): Promise<void> {
    this.activeDirection = direction;
    this.notifyState('listening');

    const sourceLangCode = direction === 'vi_to_ru' ? 'vi' : 'ru';
    const targetLangCode = direction === 'vi_to_ru' ? 'ru' : 'vi';
    const speechLangTag = direction === 'vi_to_ru' ? 'vi-VN' : 'ru-RU';
    const ttsLangTag = direction === 'vi_to_ru' ? 'ru-RU' : 'vi-VN';

    await speechRecognitionService.startListening(
      speechLangTag,
      async (result) => {
        this.notifyTranscript(result.transcript, result.isFinal);
        if (result.isFinal && result.transcript.trim()) {
          await this.processFinalTranscript(
            result.transcript.trim(),
            sourceLangCode,
            targetLangCode,
            ttsLangTag
          );
        }
      },
      (code: SpeechRecognitionErrorCode, msg: string) => {
        this.notifyState('error', msg);
      },
      () => {
        if (this.currentState === 'listening') {
          // Ended without final speech
          if (!this.lastTranscript.trim()) {
            this.notifyState('error', 'Không phát hiện nội dung giọng nói. Vui lòng thử lại.');
          }
        }
      }
    );
  }

  /**
   * Mode B: Starts 2-Way Conversation Speaker Flow
   * @param speaker 'user' (Vietnamese speaker) or 'russianSpeaker' (Russian speaker)
   */
  async startConversationTurn(speaker: ConversationSpeaker): Promise<void> {
    const isUser = speaker === 'user';
    const sourceLang: 'vi' | 'ru' = isUser ? 'vi' : 'ru';
    const targetLang: 'vi' | 'ru' = isUser ? 'ru' : 'vi';
    const speechLangTag = isUser ? 'vi-VN' : 'ru-RU';
    const ttsLangTag = isUser ? 'ru-RU' : 'vi-VN';

    this.notifyState('listening');

    await speechRecognitionService.startListening(
      speechLangTag,
      async (result) => {
        this.notifyTranscript(result.transcript, result.isFinal);
        if (result.isFinal && result.transcript.trim()) {
          await this.processConversationTurn(
            speaker,
            result.transcript.trim(),
            sourceLang,
            targetLang,
            ttsLangTag
          );
        }
      },
      (code, msg) => {
        this.notifyState('error', msg);
      },
      () => {
        if (this.currentState === 'listening' && !this.lastTranscript.trim()) {
          this.notifyState('error', 'Không phát hiện nội dung. Vui lòng nói to và rõ hơn.');
        }
      }
    );
  }

  /**
   * Helper for text-driven simulated turn (e.g., testing or quick demo phrase tap)
   */
  async submitManualTurn(speaker: ConversationSpeaker, text: string): Promise<boolean> {
    if (!text || !text.trim()) {
      this.notifyState('error', 'Nội dung trống, không thể dịch.');
      return false;
    }

    const isUser = speaker === 'user';
    const sourceLang: 'vi' | 'ru' = isUser ? 'vi' : 'ru';
    const targetLang: 'vi' | 'ru' = isUser ? 'ru' : 'vi';
    const ttsLangTag = isUser ? 'ru-RU' : 'vi-VN';

    this.notifyTranscript(text.trim(), true);
    await this.processConversationTurn(
      speaker,
      text.trim(),
      sourceLang,
      targetLang,
      ttsLangTag
    );
    return true;
  }

  private async processFinalTranscript(
    transcript: string,
    sourceLang: 'vi' | 'ru',
    targetLang: 'vi' | 'ru',
    ttsLangTag: string
  ): Promise<void> {
    this.notifyState('translating');
    const transRes = await this.executeTranslation(transcript, sourceLang, targetLang);

    if (transRes.success) {
      this.notifyTranslation(transcript, transRes.translatedText);
      this.notifyState('ready_to_play');

      // Attempt TTS
      this.notifyState('playing');
      const spoke = await textToSpeechService.speak(
        transRes.translatedText,
        ttsLangTag,
        undefined,
        () => {
          this.notifyState('ready');
        },
        (err) => {
          logger.warn('VoiceTranslationOrchestrator', 'TTS playback unavailable or failed', err);
          this.notifyState('ready', 'Không thể phát âm thanh. Bản dịch hiển thị trên màn hình.');
        }
      );
      if (!spoke) {
        this.notifyState('ready');
      }
    } else {
      this.notifyState('error', transRes.error || 'Dịch thuật thất bại.');
    }
  }

  private async processConversationTurn(
    speaker: ConversationSpeaker,
    transcript: string,
    sourceLang: 'vi' | 'ru',
    targetLang: 'vi' | 'ru',
    ttsLangTag: string
  ): Promise<void> {
    this.notifyState('translating');
    const transRes = await this.executeTranslation(transcript, sourceLang, targetLang);

    if (transRes.success) {
      const message: ConversationMessage = {
        id: `conv-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        speaker,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        sourceText: transcript,
        translatedText: transRes.translatedText,
        timestamp: Date.now(),
        audioAvailable: textToSpeechService.isSupported(),
      };
      this.conversationHistory.push(message);
      this.notifyTranslation(transcript, transRes.translatedText);
      this.listeners.forEach((l) => l.onNewConversationMessage?.(message));

      // Play TTS for counter-party
      this.notifyState('playing');
      await textToSpeechService.speak(
        transRes.translatedText,
        ttsLangTag,
        undefined,
        () => {
          this.notifyState('ready');
        },
        () => {
          this.notifyState('ready', 'Không thể phát âm thanh. Bản dịch hiển thị trên màn hình.');
        }
      );
    } else {
      this.notifyState('error', transRes.error || 'Không thể dịch lời nói này.');
    }
  }

  async stop(): Promise<void> {
    await speechRecognitionService.stopListening();
    await textToSpeechService.stop();
    this.notifyState('idle');
  }

  async cancel(): Promise<void> {
    await speechRecognitionService.cancelListening();
    await textToSpeechService.stop();
    this.lastTranscript = '';
    this.lastTranslatedText = '';
    this.notifyState('idle');
  }

  clearConversationHistory(): void {
    this.conversationHistory = [];
  }

  async replayMessageAudio(message: ConversationMessage): Promise<boolean> {
    if (!message.translatedText) return false;
    const ttsLangTag = message.targetLanguage === 'ru' ? 'ru-RU' : 'vi-VN';
    return await textToSpeechService.speak(message.translatedText, ttsLangTag);
  }
}

export const voiceOrchestrator = new VoiceTranslationOrchestrator();

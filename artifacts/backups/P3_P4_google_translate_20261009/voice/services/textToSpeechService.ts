/**
 * Text-to-Speech Abstraction Service
 * Russia AI Support - Phase P4
 * Strict "No Fake AI":
 * - Uses window.speechSynthesis & SpeechSynthesisUtterance.
 * - Correct language resolution: vi -> vi-VN, ru -> ru-RU.
 * - Transparently handles unsupported environments and playback errors.
 * - NEVER claims audio played successfully if it was not.
 */
import { TextToSpeechService } from '../types';
import { logger } from '../../../services/logger';

class BrowserTextToSpeechService implements TextToSpeechService {
  private speaking: boolean = false;

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined');
  }

  isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking || this.speaking;
  }

  resolveLanguageTag(lang: 'vi' | 'ru' | string): string {
    const clean = lang.toLowerCase().trim();
    if (clean === 'vi' || clean.startsWith('vi')) {
      return 'vi-VN';
    }
    if (clean === 'ru' || clean.startsWith('ru')) {
      return 'ru-RU';
    }
    return lang;
  }

  async speak(
    text: string,
    language: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: Error) => void
  ): Promise<boolean> {
    if (!text || !text.trim()) {
      return false;
    }

    if (!this.isSupported()) {
      const err = new Error('Trình duyệt hiện tại chưa hỗ trợ Text-to-Speech (speechSynthesis).');
      logger.warn('TextToSpeechService', err.message);
      if (onError) onError(err);
      return false;
    }

    try {
      // Cancel previous speech if running
      window.speechSynthesis.cancel();

      const langTag = this.resolveLanguageTag(language);
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = langTag;
      utterance.rate = 0.95; // Clear rate for learners
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.speaking = true;
        logger.info('TextToSpeechService', `Started speaking text with lang=${langTag}`);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.speaking = false;
        logger.info('TextToSpeechService', 'Finished speaking text');
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.speaking = false;
        const err = new Error(`Lỗi phát âm thanh: ${e.error || 'unknown'}`);
        logger.warn('TextToSpeechService', err.message);
        if (onError) onError(err);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: any) {
      this.speaking = false;
      logger.error('TextToSpeechService', 'Exception in speak()', err);
      if (onError) onError(err);
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.speaking = false;
  }

  async pause(): Promise<void> {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // ignore
      }
    }
  }

  async resume(): Promise<void> {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // ignore
      }
    }
  }
}

export const textToSpeechService: TextToSpeechService = new BrowserTextToSpeechService();

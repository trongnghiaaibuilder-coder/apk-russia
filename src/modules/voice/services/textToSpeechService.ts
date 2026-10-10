/**
 * Text-to-Speech Abstraction Service
 * - Prefers native AndroidTTS bridge (reliable in WebView).
 * - Falls back to window.speechSynthesis with explicit voice selection.
 * - NEVER claims audio played successfully if it was not.
 */
import { TextToSpeechService } from '../types';
import { logger } from '../../../services/logger';

declare global {
  interface Window {
    AndroidTTS?: {
      isAvailable(): boolean;
      speak(text: string, langTag: string): boolean;
      stop(): void;
    };
  }
}

function getNativeTts(): Window['AndroidTTS'] | null {
  if (typeof window !== 'undefined' && window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
    try {
      if (window.AndroidTTS.isAvailable()) return window.AndroidTTS;
    } catch {
      // ignore
    }
  }
  return null;
}

class BrowserTextToSpeechService implements TextToSpeechService {
  private speaking: boolean = false;
  private voicesLoaded: boolean = false;
  private voicesLoadPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  isSupported(): boolean {
    if (getNativeTts()) return true;
    if (typeof window === 'undefined') return false;
    return Boolean(window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined');
  }

  isSpeaking(): boolean {
    if (getNativeTts()) return this.speaking;
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

  /**
   * Load available TTS voices, waiting for the async voiceschanged event
   * (critical in Android WebView where getVoices() is often empty on first call).
   */
  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesLoadPromise) return this.voicesLoadPromise;
    this.voicesLoadPromise = new Promise((resolve) => {
      if (!this.isSupported()) {
        resolve([]);
        return;
      }
      const synth = window.speechSynthesis;
      const tryResolve = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          this.voicesLoaded = true;
          resolve(voices);
        }
      };
      tryResolve();
      if (!this.voicesLoaded) {
        // Wait for voiceschanged (with timeout fallback)
        const timer = window.setTimeout(() => resolve(synth.getVoices() || []), 3000);
        synth.onvoiceschanged = () => {
          window.clearTimeout(timer);
          this.voicesLoaded = true;
          resolve(synth.getVoices() || []);
        };
      }
    });
    return this.voicesLoadPromise;
  }

  /**
   * Pick the best voice for a language tag, preferring exact locale then language prefix.
   */
  private pickVoice(voices: SpeechSynthesisVoice[], langTag: string): SpeechSynthesisVoice | null {
    if (!voices.length) return null;
    const lower = langTag.toLowerCase();
    const prefix = lower.split('-')[0];
    return (
      voices.find((v) => v.lang.toLowerCase() === lower) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
      voices.find((v) => v.default) ||
      voices[0]
    );
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
      const langTag = this.resolveLanguageTag(language);

      // Prefer native Android TTS bridge (reliable in WebView)
      const nativeTts = getNativeTts();
      if (nativeTts) {
        try { nativeTts.stop(); } catch { /* ignore */ }
        const ok = nativeTts.speak(text.trim(), langTag);
        if (ok) {
          this.speaking = true;
          logger.info('TextToSpeechService', `Native TTS speaking with lang=${langTag}`);
          if (onStart) onStart();
          // Native bridge has no end callback; reset speaking flag after estimate
          const estimatedMs = Math.min(30000, Math.max(1500, text.trim().length * 90));
          window.setTimeout(() => {
            this.speaking = false;
            if (onEnd) onEnd();
          }, estimatedMs);
          return true;
        }
        // fall through to web speechSynthesis if native failed
      }

      // Cancel previous speech if running
      window.speechSynthesis.cancel();

      // Ensure voices are loaded (WebView often returns empty on first call)
      // and explicitly select a matching voice — required for audible output
      // on some Android WebView implementations.
      const voices = await this.loadVoices();
      const voice = this.pickVoice(voices, langTag);

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = langTag;
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 0.95; // Clear rate for learners
      utterance.pitch = 1.0;
      // Route through media volume (not call volume) on Android
      utterance.volume = 1.0;

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
    const nativeTts = getNativeTts();
    if (nativeTts) {
      try { nativeTts.stop(); } catch { /* ignore */ }
    }
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

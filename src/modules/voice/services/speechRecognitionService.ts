/**
 * Speech Recognition Abstraction Service
 * Russia AI Support - Phase P4
 * Strict "No Fake AI":
 * - Wraps Web Speech API (window.SpeechRecognition / window.webkitSpeechRecognition)
 * - NEVER creates fake transcript or hardcodes words to simulate microphone success.
 * - Accurately reports browser support, permission denial, and empty speech.
 */
import {
  SpeechRecognitionService,
  SpeechRecognitionResultEvent,
  SpeechRecognitionErrorCode,
} from '../types';
import { logger } from '../../../services/logger';

// Browser Web Speech API type declarations
type SpeechRecognitionType = any;

class BrowserSpeechRecognitionService implements SpeechRecognitionService {
  private recognition: SpeechRecognitionType | null = null;
  private listening: boolean = false;
  private currentTranscript: string = '';

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (err) {
        logger.warn('SpeechRecognitionService', 'Failed to initialize SpeechRecognition instance', err);
        this.recognition = null;
      }
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  isListening(): boolean {
    return this.listening;
  }

  getTranscript(): string {
    return this.currentTranscript;
  }

  async startListening(
    language: string,
    onResult: (e: SpeechRecognitionResultEvent) => void,
    onError: (code: SpeechRecognitionErrorCode, message: string) => void,
    onEnd: () => void
  ): Promise<void> {
    this.currentTranscript = '';

    if (!this.isSupported()) {
      onError('not-supported', 'Trình duyệt hiện tại chưa hỗ trợ Web Speech Recognition API.');
      return;
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError('unknown', 'Không thể khởi tạo nhận dạng giọng nói.');
      return;
    }

    // Stop prior instance if any
    try {
      this.recognition.abort();
    } catch {
      // ignore
    }

    this.recognition.lang = language;

    this.recognition.onstart = () => {
      this.listening = true;
      logger.info('SpeechRecognitionService', `Speech recognition started with lang=${language}`);
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      this.currentTranscript = text;
      onResult({
        transcript: text,
        isFinal: Boolean(finalTranscript),
      });
    };

    this.recognition.onerror = (event: any) => {
      this.listening = false;
      const errorStr = event.error || 'unknown';
      logger.warn('SpeechRecognitionService', `Speech recognition error: ${errorStr}`);

      let code: SpeechRecognitionErrorCode = 'unknown';
      let message = 'Không nhận dạng được giọng nói. Vui lòng thử lại.';

      switch (errorStr) {
        case 'not-allowed':
        case 'permission-denied':
          code = 'permission-denied';
          message = 'Không có quyền sử dụng microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.';
          break;
        case 'no-speech':
          code = 'no-speech';
          message = 'Không phát hiện nội dung giọng nói. Vui lòng thử lại.';
          break;
        case 'audio-capture':
          code = 'audio-capture';
          message = 'Microphone hiện không khả dụng hoặc bị xung đột phần cứng.';
          break;
        case 'network':
          code = 'network';
          message = 'Lỗi mạng khi xử lý giọng nói.';
          break;
        case 'aborted':
          code = 'aborted';
          message = 'Đã hủy phiên ghi âm.';
          break;
        default:
          code = 'unknown';
          message = `Lỗi nhận dạng: ${errorStr}. Vui lòng thử lại.`;
      }

      onError(code, message);
    };

    this.recognition.onend = () => {
      this.listening = false;
      logger.info('SpeechRecognitionService', 'Speech recognition ended');
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      this.listening = false;
      logger.error('SpeechRecognitionService', 'Error starting recognition', err);
      onError('unknown', err?.message || 'Không thể bật microphone.');
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition && this.listening) {
      try {
        this.recognition.stop();
      } catch (err) {
        logger.warn('SpeechRecognitionService', 'Error in stopListening', err);
      }
    }
    this.listening = false;
  }

  async cancelListening(): Promise<void> {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (err) {
        logger.warn('SpeechRecognitionService', 'Error in cancelListening', err);
      }
    }
    this.listening = false;
    this.currentTranscript = '';
  }
}

export const speechRecognitionService: SpeechRecognitionService = new BrowserSpeechRecognitionService();

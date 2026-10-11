/**
 * Russia AI Support - Assistant State & Orchestration Service
 * Developer: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 */

import { 
  IAIAssistantProvider, 
  AssistantMessage, 
  AssistantResponse, 
  AssistantContext 
} from '../types';
import { geminiAssistantProvider } from './geminiAssistantProvider';
import { groqAssistantProvider } from './groqAssistantProvider';
import { appSettings } from '../../../services/appSettings';
import { safeStorage } from '../../../services/storage';
import { logger } from '../../../services/logger';

const STORAGE_KEY_MESSAGES = 'russia_ai_assistant_history_v1';

export class AssistantService {
  private provider: IAIAssistantProvider = geminiAssistantProvider;
  private manualProviderOverride = false;

  /** Chọn provider: ưu tiên Groq (miễn phí, nhanh), sau đó Gemini, cuối cùng offline */
  refreshProvider(): void {
    if (this.manualProviderOverride) return;
    if (appSettings.hasGroqApiKey()) {
      this.provider = groqAssistantProvider;
    } else {
      this.provider = geminiAssistantProvider;
    }
  }

  getProviderName(): string {
    this.refreshProvider();
    return this.provider.providerName;
  }
  private messages: AssistantMessage[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    try {
      const saved = safeStorage.getItem<AssistantMessage[]>(STORAGE_KEY_MESSAGES, []);
      if (Array.isArray(saved) && saved.length > 0) {
        this.messages = saved;
      } else {
        this.messages = [this.getWelcomeMessage()];
      }
    } catch {
      this.messages = [this.getWelcomeMessage()];
    }
  }

  private saveHistory(): void {
    try {
      // Keep up to 50 recent messages
      const slice = this.messages.slice(-50);
      safeStorage.setItem(STORAGE_KEY_MESSAGES, slice);
    } catch (err) {
      logger.error('AssistantService', 'Failed to persist assistant history', err);
    }
  }

  getWelcomeMessage(): AssistantMessage {
    return {
      id: 'msg_welcome_init',
      role: 'assistant',
      content: `👋 **Xin chào! Tôi là Trợ lý AI Hỗ trợ nước Nga.**

Tôi sẵn sàng giải đáp và hướng dẫn bạn về mọi khía cạnh cuộc sống tại Liên bang Nga:
• **Pháp lý & Visa:** Đăng ký tạm trú (Регистрация), Thẻ di trú, gia hạn Visa.
• **Giao thông:** Cách đi tàu điện ngầm Metro Moskva, mua thẻ Troika.
• **Đời sống:** Mua sắm siêu thị, sim điện thoại, tài khoản thẻ Mir.
• **Y tế & Khẩn cấp:** Số cứu trợ 112, mua thuốc thông dụng tại hiệu thuốc (Аптека).
• **Kinh nghiệm mùa đông:** Cách mặc ấm, giày chống trượt tuyết.

Hãy chọn một chủ đề gợi ý bên dưới hoặc đặt câu hỏi bất kỳ!`,
      timestamp: new Date().toISOString(),
      provider: this.provider.providerId,
      isFallback: true
    };
  }

  getHistory(): AssistantMessage[] {
    return [...this.messages];
  }

  setProvider(provider: IAIAssistantProvider): void {
    this.provider = provider;
    this.manualProviderOverride = true;
  }

  /** Xóa ghi đè thủ công, cho phép tự chọn provider theo key */
  clearProviderOverride(): void {
    this.manualProviderOverride = false;
  }

  getProvider(): IAIAssistantProvider {
    return this.provider;
  }

  async ask(prompt: string, context?: AssistantContext): Promise<AssistantResponse> {
    this.refreshProvider();
    const trimmed = prompt.trim();
    if (!trimmed) {
      return {
        success: false,
        durationMs: 0,
        errorCode: 'EMPTY_PROMPT',
        error: 'Vui lòng nhập nội dung câu hỏi.'
      };
    }

    const userMessage: AssistantMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
      provider: this.provider.providerId
    };

    // Add user message to history immediately
    this.messages.push(userMessage);
    this.saveHistory();

    try {
      const response = await this.provider.sendMessage(this.messages, context);

      if (response.success && response.message) {
        this.messages.push(response.message);
        this.saveHistory();
      }

      return response;
    } catch (err: any) {
      logger.error('AssistantService error during ask', err);
      return {
        success: false,
        durationMs: 0,
        errorCode: 'PROVIDER_ERROR',
        error: err.message || 'Lỗi không xác định khi trò chuyện cùng trợ lý.'
      };
    }
  }

  clearHistory(): void {
    this.messages = [this.getWelcomeMessage()];
    this.saveHistory();
  }
}

export const assistantService = new AssistantService();

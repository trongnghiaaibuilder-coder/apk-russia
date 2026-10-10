/**
 * Russia AI Support - Gemini AI Assistant Provider
 * Developer: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 * 
 * Production AI Provider interfacing with server-side Gemini 2.5 Flash proxy.
 * Enforces zero secrets in frontend, timeout handling, and automatic offline fallback.
 */

import { 
  IAIAssistantProvider, 
  AssistantMessage, 
  AssistantResponse, 
  AssistantContext 
} from '../types';
import { localKnowledgeProvider } from './localKnowledgeProvider';
import { connectivityService } from '../../../services/connectivity';
import { appSettings } from '../../../services/appSettings';
import { logger } from '../../../services/logger';

export class GeminiAssistantProvider implements IAIAssistantProvider {
  readonly providerId = 'gemini-2.5-flash';
  readonly providerName = 'Google Gemini 2.5 Flash (Trực tuyến)';

  private apiEndpoint = '/api/assistant/chat';
  private timeoutMs = 12000;

  /**
   * Set custom endpoint or timeout for testing
   */
  configure(config: { endpoint?: string; timeoutMs?: number }) {
    if (config.endpoint) this.apiEndpoint = config.endpoint;
    if (config.timeoutMs) this.timeoutMs = config.timeoutMs;
  }

  async sendMessage(
    messages: AssistantMessage[],
    context?: AssistantContext
  ): Promise<AssistantResponse> {
    const startTime = Date.now();

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content.trim()) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'EMPTY_PROMPT',
        error: 'Vui lòng nhập nội dung câu hỏi.'
      };
    }

    if (lastUserMessage.content.length > 1500) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'PROMPT_TOO_LONG',
        error: 'Câu hỏi quá dài (giới hạn 1500 ký tự). Vui lòng rút ngắn nội dung.'
      };
    }

    // Check online connectivity
    const isOnline = connectivityService.getStatus();
    if (!isOnline) {
      logger.info('GeminiAssistantProvider', 'Device is offline, routing assistant query to Local Knowledge Provider');
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return {
        ...fallbackResp,
        durationMs: Date.now() - startTime
      };
    }

    // Online request: prefer direct Gemini API if user provided a key,
    // otherwise try the (web-only) proxy endpoint, then fall back to local knowledge.
    try {
      const apiKey = appSettings.getGeminiApiKey();
      if (apiKey) {
        return await this.callGeminiDirect(apiKey, messages, context, startTime);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const requestPayload = {
        messages: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        })),
        topic: context?.currentTopic,
        userLanguage: context?.userLanguage || 'vi'
      };

      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`Máy chủ AI phản hồi mã lỗi ${res.status}`);
      }

      const data = await res.json();
      if (!data || typeof data.content !== 'string' || !data.content.trim()) {
        throw new Error('Dữ liệu trả về từ máy chủ AI không hợp lệ.');
      }

      const assistantMsg: AssistantMessage = {
        id: `msg_gemini_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
        provider: this.providerId,
        isFallback: false
      };

      return {
        success: true,
        message: assistantMsg,
        durationMs: Date.now() - startTime
      };
    } catch (err: any) {
      logger.warn('GeminiAssistantProvider', 'Gemini proxy request failed, falling back to local knowledge base', err);

      if (err.name === 'AbortError') {
        // Fallback on timeout
        const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
        return {
          ...fallbackResp,
          error: 'Kết nối mạng tới dịch vụ AI bị chậm. Đã chuyển sang Cơ sở tri thức ngoại tuyến.',
          durationMs: Date.now() - startTime
        };
      }

      // Fallback on server/network error
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return {
        ...fallbackResp,
        error: 'Không thể kết nối tới máy chủ AI trực tuyến. Đã chuyển sang Cơ sở tri thức ngoại tuyến.',
        durationMs: Date.now() - startTime
      };
    }
  }

  /**
   * Call Google Gemini API directly with a user-provided API key.
   * Works from file:// in the Android app (no backend needed).
   */
  private async callGeminiDirect(
    apiKey: string,
    messages: AssistantMessage[],
    context: AssistantContext | undefined,
    startTime: number
  ): Promise<AssistantResponse> {
    const systemPrompt =
      'Bạn là trợ lý AI thân thiện của ứng dụng "Nước Nga Trong Tầm Tay", giúp người Việt học tiếng Nga và sinh sống tại Nga. ' +
      'Trả lời bằng tiếng Việt, ngắn gọn, rõ ràng. Khi dạy tiếng Nga, luôn kèm phiên âm và nghĩa tiếng Việt.';
    const contents = messages
      .filter((m) => m.content && m.content.trim())
      .slice(-10)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timer);
      if (!res.ok) {
        throw new Error(`Gemini API lỗi ${res.status}`);
      }
      const data = await res.json();
      const text: string | undefined =
        data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim();
      if (!text) throw new Error('Gemini không trả về nội dung.');
      const assistantMsg: AssistantMessage = {
        id: `msg_gemini_${Date.now()}`,
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString(),
        provider: this.providerId,
        isFallback: false,
      };
      return { success: true, message: assistantMsg, durationMs: Date.now() - startTime };
    } catch (err: any) {
      clearTimeout(timer);
      logger.warn('GeminiAssistantProvider', 'Direct Gemini API failed, falling back to local', err);
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return {
        ...fallbackResp,
        error: 'Không kết nối được Gemini. Đã chuyển sang tri thức ngoại tuyến.',
        durationMs: Date.now() - startTime,
      };
    }
  }
}

export const geminiAssistantProvider = new GeminiAssistantProvider();

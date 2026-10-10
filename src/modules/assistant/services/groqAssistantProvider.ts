/**
 * Groq AI Assistant Provider — miễn phí, tốc độ cao.
 * Dùng API tương thích OpenAI: https://api.groq.com/openai/v1/chat/completions
 * Lấy key miễn phí tại: https://console.groq.com
 * Developer: Xương Rồng AI Developer
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

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const SYSTEM_PROMPT = `Bạn là trợ lý AI thân thiện của ứng dụng "Nước Nga Trong Tầm Tay", giúp người Việt học tiếng Nga và sinh sống tại Nga.
Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu. Khi đưa ra câu tiếng Nga, kèm phiên âm cho người Việt đọc theo.
Ưu tiên thông tin thực tế: visa, đăng ký tạm trú, metro, mua sắm, y tế, số khẩn cấp 112.`;

export class GroqAssistantProvider implements IAIAssistantProvider {
  readonly providerId = 'groq-llama-3.3';
  readonly providerName = 'Groq Llama 3.3 (Trực tuyến, miễn phí)';

  private timeoutMs = 15000;

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
        error: 'Câu hỏi quá dài (giới hạn 1500 ký tự).'
      };
    }

    const isOnline = connectivityService.getStatus();
    if (!isOnline) {
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return { ...fallbackResp, durationMs: Date.now() - startTime };
    }

    const apiKey = appSettings.getGroqApiKey();
    if (!apiKey) {
      // Không có key Groq → dùng tri thức offline
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return { ...fallbackResp, durationMs: Date.now() - startTime };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      // Chuyển đổi sang định dạng OpenAI chat
      const chatMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map(m => ({ role: m.role, content: m.content })),
      ];

      let response: Response | null = null;
      let lastStatus = 0;
      // Thử từng model cho đến khi thành công
      for (const model of GROQ_MODELS) {
        controller.signal.throwIfAborted();
        const tryController = new AbortController();
        const tryTimeout = setTimeout(() => tryController.abort(), this.timeoutMs);
        try {
          const r = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: chatMessages,
              max_tokens: 1000,
              temperature: 0.7,
            }),
            signal: tryController.signal,
          });
          clearTimeout(tryTimeout);
          lastStatus = r.status;
          if (r.ok) {
            response = r;
            break;
          }
          // 404 = model không tồn tại → thử model tiếp theo
          // 401/429 → không thử tiếp, báo lỗi luôn
          if (r.status !== 404) {
            response = r;
            break;
          }
        } catch {
          clearTimeout(tryTimeout);
        }
      }
      clearTimeout(timeout);

      if (!response) {
        const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
        return { ...fallbackResp, durationMs: Date.now() - startTime };
      }

      // Gán lại để code bên dưới dùng
      const finalResponse = response;
      response = finalResponse;

      if (!finalResponse.ok) {
        const errText = await finalResponse.text().catch(() => '');
        logger.warn('GroqAssistantProvider', `API error ${response.status}: ${errText.slice(0, 200)}`);
        // Key sai (401) hoặc hết quota → báo lỗi rõ ràng
        if (finalResponse.status === 401) {
          return {
            success: false,
            durationMs: Date.now() - startTime,
            errorCode: 'PROVIDER_ERROR',
            error: 'Groq API key không đúng. Bạn kiểm tra lại key tại console.groq.com nhé.'
          };
        }
        if (finalResponse.status === 429) {
          return {
            success: false,
            durationMs: Date.now() - startTime,
            errorCode: 'PROVIDER_ERROR',
            error: 'Bạn hỏi quá nhanh, đợi một chút rồi thử lại nhé.'
          };
        }
        // Lỗi khác → fallback offline
        const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
        return { ...fallbackResp, durationMs: Date.now() - startTime };
      }

      const data = await finalResponse.json();
      const text = data?.choices?.[0]?.message?.content?.trim();

      if (!text) {
        return {
          success: false,
          durationMs: Date.now() - startTime,
          errorCode: 'PROVIDER_ERROR',
          error: 'Groq không trả về kết quả. Bạn thử lại nhé.'
        };
      }

      return {
        success: true,
        durationMs: Date.now() - startTime,
        message: {
          id: `msg_groq_${Date.now()}`,
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
        } as AssistantMessage,
      };
    } catch (err: any) {
      logger.warn('GroqAssistantProvider', 'Request failed, using offline fallback', err?.message);
      const fallbackResp = await localKnowledgeProvider.sendMessage(messages, context);
      return { ...fallbackResp, durationMs: Date.now() - startTime };
    }
  }
}

export const groqAssistantProvider = new GroqAssistantProvider();

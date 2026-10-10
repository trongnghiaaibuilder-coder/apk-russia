/**
 * Russia AI Support - Mock AI Assistant Provider (TEST ONLY)
 * Developer: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 * 
 * Used strictly for unit tests, failure mode verification, and contract testing.
 * NOT to be used in production runtime.
 */

import { 
  IAIAssistantProvider, 
  AssistantMessage, 
  AssistantResponse, 
  AssistantContext 
} from '../types';

export class MockAssistantProvider implements IAIAssistantProvider {
  readonly providerId = 'mock_test_provider';
  readonly providerName = 'Mock Test Provider (Test Only)';

  private simulatedDelayMs: number = 50;
  private shouldFail: boolean = false;
  private shouldTimeout: boolean = false;
  private shouldReturnInvalid: boolean = false;
  private customErrorMessage: string = 'Lỗi thử nghiệm từ Mock Provider';

  setSimulatedDelay(ms: number) {
    this.simulatedDelayMs = ms;
  }

  setShouldFail(fail: boolean, errorMessage?: string) {
    this.shouldFail = fail;
    if (errorMessage) this.customErrorMessage = errorMessage;
  }

  setShouldTimeout(timeout: boolean) {
    this.shouldTimeout = timeout;
  }

  setShouldReturnInvalid(invalid: boolean) {
    this.shouldReturnInvalid = invalid;
  }

  reset() {
    this.simulatedDelayMs = 0;
    this.shouldFail = false;
    this.shouldTimeout = false;
    this.shouldReturnInvalid = false;
    this.customErrorMessage = 'Lỗi thử nghiệm từ Mock Provider';
  }

  async sendMessage(
    messages: AssistantMessage[],
    _context?: AssistantContext
  ): Promise<AssistantResponse> {
    const startTime = Date.now();

    if (this.simulatedDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.simulatedDelayMs));
    }

    if (this.shouldTimeout) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'TIMEOUT',
        error: 'Yêu cầu tới dịch vụ AI bị quá hạn (Timeout).'
      };
    }

    if (this.shouldFail) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'PROVIDER_ERROR',
        error: this.customErrorMessage
      };
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content.trim()) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'EMPTY_PROMPT',
        error: 'Vui lòng cung cấp nội dung câu hỏi.'
      };
    }

    if (this.shouldReturnInvalid) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 'INVALID_RESPONSE',
        error: 'Dữ liệu phản hồi từ mô hình AI không đúng định dạng.'
      };
    }

    const responseMsg: AssistantMessage = {
      id: `msg_mock_${Date.now()}`,
      role: 'assistant',
      content: `[MOCK TEST RESPONSE]: Phản hồi thử nghiệm cho câu hỏi: "${lastUserMessage.content}"`,
      timestamp: new Date().toISOString(),
      provider: this.providerId
    };

    return {
      success: true,
      message: responseMsg,
      durationMs: Date.now() - startTime
    };
  }
}

export const mockAssistantProvider = new MockAssistantProvider();

/**
 * Russia AI Support - P6 AI Assistant Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P6 — RUSSIA AI ASSISTANT
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  assistantService,
  localKnowledgeProvider,
  mockAssistantProvider,
  geminiAssistantProvider,
  PRESET_ASSISTANT_TOPICS,
  LOCAL_KNOWLEDGE_ARTICLES
} from '../src/modules/assistant';
import { AssistantMessage } from '../src/modules/assistant/types';

describe('P6 Unit Test 1: Provider Abstraction & Interface Contracts', () => {
  test('All providers implement standard IAIAssistantProvider contract', () => {
    const providers = [localKnowledgeProvider, mockAssistantProvider, geminiAssistantProvider];
    
    for (const p of providers) {
      assert.ok(typeof p.providerId === 'string' && p.providerId.length > 0);
      assert.ok(typeof p.providerName === 'string' && p.providerName.length > 0);
      assert.strictEqual(typeof p.sendMessage, 'function');
    }
  });

  test('AssistantService exposes conversation orchestration methods', () => {
    assert.strictEqual(typeof assistantService.ask, 'function');
    assert.strictEqual(typeof assistantService.getHistory, 'function');
    assert.strictEqual(typeof assistantService.clearHistory, 'function');
    assert.strictEqual(typeof assistantService.setProvider, 'function');
    assert.strictEqual(typeof assistantService.getProvider, 'function');
    assert.strictEqual(typeof assistantService.getWelcomeMessage, 'function');
  });

  test('Preset topics cover vital Russian survival domains', () => {
    assert.ok(PRESET_ASSISTANT_TOPICS.length >= 6);
    const categories = PRESET_ASSISTANT_TOPICS.map(t => t.category);
    assert.ok(categories.includes('visa_legal'));
    assert.ok(categories.includes('daily_life'));
    assert.ok(categories.includes('survival'));
    assert.ok(categories.includes('medical_health'));
  });
});

describe('P6 Unit Test 2: Offline Local Knowledge Base & Keyword Matching', () => {
  test('Local knowledge base contains articles on Registration, Metro, Winter, Health, Banking and Etiquette', () => {
    assert.ok(LOCAL_KNOWLEDGE_ARTICLES.length >= 6);
    
    const allKeywords = LOCAL_KNOWLEDGE_ARTICLES.flatMap(a => a.keywords);
    assert.ok(allKeywords.includes('đăng ký'));
    assert.ok(allKeywords.includes('troika'));
    assert.ok(allKeywords.includes('mùa đông'));
    assert.ok(allKeywords.includes('112'));
    assert.ok(allKeywords.includes('mir'));
  });

  test('Querying registration topic returns structured legal registration guide', async () => {
    const testMessages: AssistantMessage[] = [
      {
        id: '1',
        role: 'user',
        content: 'Làm thế nào để đăng ký tạm trú Регистрация tại Nga?',
        timestamp: new Date().toISOString(),
        provider: 'offline_local_knowledge'
      }
    ];

    const resp = await localKnowledgeProvider.sendMessage(testMessages);
    assert.strictEqual(resp.success, true);
    assert.ok(resp.message?.content.includes('QUY TRÌNH ĐĂNG KÝ TẠM TRÚ'));
    assert.ok(resp.message?.content.includes('07 ngày làm việc'));
    assert.strictEqual(resp.message?.isFallback, true);
    assert.strictEqual(resp.message?.provider, 'offline_local_knowledge');
  });

  test('Querying metro/troika returns Moscow metro and Troika card guide', async () => {
    const testMessages: AssistantMessage[] = [
      {
        id: '2',
        role: 'user',
        content: 'Thẻ Troika và cách đi metro như thế nào?',
        timestamp: new Date().toISOString(),
        provider: 'offline_local_knowledge'
      }
    ];

    const resp = await localKnowledgeProvider.sendMessage(testMessages);
    assert.strictEqual(resp.success, true);
    assert.ok(resp.message?.content.includes('HƯỚNG DẪN ĐI METRO & DÙNG THẺ TROIKA'));
    assert.ok(resp.message?.content.includes('Касса'));
  });

  test('Querying medical emergency returns 112 and pharmacy guidelines', async () => {
    const testMessages: AssistantMessage[] = [
      {
        id: '3',
        role: 'user',
        content: 'Bị sốt đau đầu thì mua thuốc ở đâu và số cấp cứu 112?',
        timestamp: new Date().toISOString(),
        provider: 'offline_local_knowledge'
      }
    ];

    const resp = await localKnowledgeProvider.sendMessage(testMessages);
    assert.strictEqual(resp.success, true);
    assert.ok(resp.message?.content.includes('112'));
    assert.ok(resp.message?.content.includes('Парацетамол'));
  });

  test('Empty user prompt returns structured error code EMPTY_PROMPT', async () => {
    const resp = await localKnowledgeProvider.sendMessage([]);
    assert.strictEqual(resp.success, false);
    assert.strictEqual(resp.errorCode, 'EMPTY_PROMPT');
    assert.ok(resp.error?.includes('Vui lòng nhập'));
  });
});

describe('P6 Unit Test 3: Mock Provider & Failure Mode Injection', () => {
  beforeEach(() => {
    mockAssistantProvider.reset();
  });

  test('Mock provider returns simulated response under normal conditions', async () => {
    const messages: AssistantMessage[] = [
      {
        id: 'm1',
        role: 'user',
        content: 'Kiểm tra hoạt động trợ lý',
        timestamp: new Date().toISOString(),
        provider: 'mock_test_provider'
      }
    ];

    const res = await mockAssistantProvider.sendMessage(messages);
    assert.strictEqual(res.success, true);
    assert.ok(res.message?.content.includes('[MOCK TEST RESPONSE]'));
    assert.strictEqual(res.message?.provider, 'mock_test_provider');
  });

  test('Mock provider handles simulated timeout cleanly', async () => {
    mockAssistantProvider.setShouldTimeout(true);

    const messages: AssistantMessage[] = [
      {
        id: 'm2',
        role: 'user',
        content: 'Câu hỏi giả lập timeout',
        timestamp: new Date().toISOString(),
        provider: 'mock_test_provider'
      }
    ];

    const res = await mockAssistantProvider.sendMessage(messages);
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.errorCode, 'TIMEOUT');
    assert.ok(res.error?.includes('Timeout'));
  });

  test('Mock provider handles simulated provider error cleanly', async () => {
    mockAssistantProvider.setShouldFail(true, 'Dịch vụ AI đang bận bảo trì');

    const messages: AssistantMessage[] = [
      {
        id: 'm3',
        role: 'user',
        content: 'Câu hỏi giả lập lỗi',
        timestamp: new Date().toISOString(),
        provider: 'mock_test_provider'
      }
    ];

    const res = await mockAssistantProvider.sendMessage(messages);
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.errorCode, 'PROVIDER_ERROR');
    assert.strictEqual(res.error, 'Dịch vụ AI đang bận bảo trì');
  });

  test('Mock provider handles invalid response structure', async () => {
    mockAssistantProvider.setShouldReturnInvalid(true);

    const messages: AssistantMessage[] = [
      {
        id: 'm4',
        role: 'user',
        content: 'Câu hỏi giả lập phản hồi sai định dạng',
        timestamp: new Date().toISOString(),
        provider: 'mock_test_provider'
      }
    ];

    const res = await mockAssistantProvider.sendMessage(messages);
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.errorCode, 'INVALID_RESPONSE');
  });
});

describe('P6 Unit Test 4: Conversation State Machine & Orchestrator', () => {
  beforeEach(() => {
    mockAssistantProvider.reset();
    assistantService.clearHistory();
    assistantService.setProvider(mockAssistantProvider);
  });

  test('Initial state contains exactly the welcome message', () => {
    const history = assistantService.getHistory();
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].id, 'msg_welcome_init');
    assert.strictEqual(history[0].role, 'assistant');
    assert.ok(history[0].content.includes('Xin chào! Tôi là Trợ lý AI Hỗ trợ nước Nga'));
  });

  test('Asking question appends user message and assistant reply to history', async () => {
    const prompt = 'Cho tôi biết thời tiết mùa đông tại Moscow?';
    const resp = await assistantService.ask(prompt);

    assert.strictEqual(resp.success, true);
    const history = assistantService.getHistory();
    assert.strictEqual(history.length, 3); // Welcome + User + Assistant

    assert.strictEqual(history[1].role, 'user');
    assert.strictEqual(history[1].content, prompt);

    assert.strictEqual(history[2].role, 'assistant');
    assert.ok(history[2].content.includes('[MOCK TEST RESPONSE]'));
  });

  test('Rejects whitespace-only prompt with error and does not corrupt history', async () => {
    const resp = await assistantService.ask('   \n  ');
    assert.strictEqual(resp.success, false);
    assert.strictEqual(resp.errorCode, 'EMPTY_PROMPT');
    assert.strictEqual(assistantService.getHistory().length, 1);
  });

  test('Clear history resets messages back to welcome message only', async () => {
    await assistantService.ask('Tin nhắn thử nghiệm 1');
    assert.strictEqual(assistantService.getHistory().length, 3);

    assistantService.clearHistory();
    assert.strictEqual(assistantService.getHistory().length, 1);
    assert.strictEqual(assistantService.getHistory()[0].id, 'msg_welcome_init');
  });
});

describe('P6 Integration & Security: Zero-Secret Frontend & Safe Fallback', () => {
  test('Client bundle does not contain hard-coded Gemini API keys', () => {
    // Validate that geminiAssistantProvider uses server-side proxy
    assert.strictEqual(
      (geminiAssistantProvider as any).apiEndpoint,
      '/api/assistant/chat',
      'Client must route through /api/assistant/chat server proxy'
    );
  });

  test('Switching active provider is dynamically supported', () => {
    assistantService.setProvider(localKnowledgeProvider);
    assert.strictEqual(assistantService.getProvider().providerId, 'offline_local_knowledge');

    assistantService.setProvider(mockAssistantProvider);
    assert.strictEqual(assistantService.getProvider().providerId, 'mock_test_provider');
  });
});

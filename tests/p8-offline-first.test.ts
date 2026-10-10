/**
 * Russia AI Support - P8 Offline-First Hardening Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P8 — OFFLINE-FIRST HARDENING
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { connectivityService } from '../src/services/connectivity';
import { offlineCapabilitiesService } from '../src/services/offlineCapabilities';
import { RUSSIAN_ALPHABET, TOPIC_LESSONS, quizService, RUSSIAN_VOCABULARY } from '../src/modules/learning';
import { DICTIONARY_DATASET } from '../src/data/dictionary/data';
import { REAL_LIFE_SCENARIOS, EMERGENCY_CONTACTS } from '../src/modules/reallife/data/scenariosData';
import { translationService, translationHistory } from '../src/modules/translator';
import { assistantService, localKnowledgeProvider } from '../src/modules/assistant';
import { safeStorage } from '../src/services/storage';

describe('P8 Unit Test 1: Offline Capability Registry & Verification', () => {
  test('Explicit capability registry identifies offline vs online features', () => {
    const capabilities = offlineCapabilitiesService.getCapabilities();
    assert.ok(capabilities.length >= 8);

    const stats = offlineCapabilitiesService.getOfflineCapableRatio();
    assert.ok(stats.ratioPercent >= 85, 'At least 85% of features must be offline-capable');
    assert.ok(stats.offlineCapable >= 7);
  });

  test('All core educational content is offline-resident in memory', () => {
    assert.strictEqual(RUSSIAN_ALPHABET.length, 33, '33 Cyrillic letters must be in memory offline');
    assert.ok(TOPIC_LESSONS.length >= 16, '16 Lessons must be in memory offline');
    const quizQuestions = quizService.generateQuizQuestions(25);
    assert.ok(quizQuestions.length >= 25, 'Quiz questions must be generated offline');
    assert.ok(RUSSIAN_VOCABULARY.length >= 100, '100+ Vocabulary entries must be in memory offline');
    assert.ok(DICTIONARY_DATASET.length >= 15, 'Dictionary foundation entries must be in memory offline');
    assert.ok(REAL_LIFE_SCENARIOS.length >= 8, '8+ Scenarios must be in memory offline');
    assert.ok(EMERGENCY_CONTACTS.length >= 5, 'Emergency hotlines must be in memory offline');
  });
});

describe('P8 Unit Test 2: Local Storage & Offline Persistence', () => {
  test('SafeStorage operates deterministically in offline memory fallback', () => {
    safeStorage.setItem('test_offline_key', { mode: 'offline_active' });
    const read = safeStorage.getItem('test_offline_key', { mode: 'default' });
    assert.strictEqual(read.mode, 'offline_active');
  });

  test('Translation history persists and restores in offline mode', () => {
    translationHistory.clearHistory();
    const item = {
      id: 'test-off-1',
      sourceText: 'Xin chào',
      translatedText: 'Здравствуйте',
      sourceLanguage: 'vi' as const,
      targetLanguage: 'ru' as const,
      timestamp: new Date().toISOString(),
      provider: 'local_fallback_demo' as const,
      isFallback: true
    };
    translationHistory.addHistoryItem(item);
    
    const history = translationHistory.getHistory();
    assert.ok(history.length >= 1);
    assert.strictEqual(history[0].translatedText, 'Здравствуйте');
  });
});

describe('P8 Integration: The Mandatory 5-Step Offline Lifecycle Gate', () => {
  /**
   * Required Verification Sequence:
   * Online → Network failure → Offline fallback → Recovery → Online restored
   */
  test('Step 1: System is initialized in Online state', () => {
    connectivityService.setSimulatedStatus(true);
    assert.strictEqual(connectivityService.getStatus(), true);
  });

  test('Step 2: Network failure occurs (offline simulated)', () => {
    connectivityService.setSimulatedStatus(false);
    assert.strictEqual(connectivityService.getStatus(), false);
  });

  test('Step 3: Offline Fallback behaves correctly across subsystems', async () => {
    connectivityService.setSimulatedStatus(false);

    // 3.1 Translation fallback works on local dictionary
    const trans = await translationService.translate({
      text: 'Cảm ơn',
      sourceLang: 'vi',
      targetLang: 'ru'
    });
    assert.strictEqual(trans.success, true);
    assert.strictEqual(trans.result?.translatedText, 'Спасибо');
    assert.strictEqual(trans.isFallback, true);

    // 3.2 AI Assistant gracefully falls back to local knowledge base
    assistantService.setProvider(localKnowledgeProvider);
    const aiResp = await assistantService.ask('Thủ tục làm đăng ký tạm trú');
    assert.strictEqual(aiResp.success, true);
    assert.ok(aiResp.message?.content.includes('QUY TRÌNH ĐĂNG KÝ TẠM TRÚ'));
    assert.strictEqual(aiResp.message?.isFallback, true);

    // 3.3 Real-life emergency contacts remain instantly accessible
    assert.ok(EMERGENCY_CONTACTS.some(c => c.phone === '112'));
  });

  test('Step 4 & 5: Recovery and Online connectivity restored', () => {
    // Step 4: Network recovers
    let notifiedState: boolean | null = null;
    const unsub = connectivityService.subscribe((state) => {
      notifiedState = state;
    });

    connectivityService.setSimulatedStatus(true);

    // Step 5: Online restored
    assert.strictEqual(connectivityService.getStatus(), true);
    assert.strictEqual(notifiedState, true);

    unsub();
  });
});

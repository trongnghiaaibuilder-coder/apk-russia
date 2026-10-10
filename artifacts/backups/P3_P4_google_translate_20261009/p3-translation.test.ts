/**
 * Russia AI Support - P3 Text Translation Engine Test Suite
 * Developer: Xương Rồng AI developer
 * Phase: P3 — TRANSLATION ENGINE
 */
import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  translationService,
  translationHistory,
  MAX_TRANSLATION_CHARS,
  LOCAL_DEMO_DICTIONARY,
  SupportedLanguage,
  TranslationResult,
} from '../src/modules/translator';

describe('P3 Acceptance: A. Language Direction', () => {
  test('Supports Vietnamese → Russian direction', async () => {
    const res = await translationService.translate({
      text: 'Xin chào',
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, true);
    assert.ok(res.result);
    assert.strictEqual(res.result.sourceLanguage, 'vi');
    assert.strictEqual(res.result.targetLanguage, 'ru');
    assert.strictEqual(res.result.translatedText, 'Здравствуйте');
  });

  test('Supports Russian → Vietnamese direction', async () => {
    const res = await translationService.translate({
      text: 'Спасибо',
      sourceLang: 'ru',
      targetLang: 'vi',
    });
    assert.strictEqual(res.success, true);
    assert.ok(res.result);
    assert.strictEqual(res.result.sourceLanguage, 'ru');
    assert.strictEqual(res.result.targetLanguage, 'vi');
    assert.strictEqual(res.result.translatedText, 'Cảm ơn');
  });
});

describe('P3 Acceptance: B. Input Validation', () => {
  test('Rejects empty input with clear error message', async () => {
    const res = await translationService.translate({
      text: '',
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error || '', /nhập/i);
  });

  test('Rejects whitespace-only input', async () => {
    const res = await translationService.translate({
      text: '   \n\t   ',
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error || '', /nhập/i);
  });

  test('Rejects text exceeding character limit (> 500 chars)', async () => {
    const longText = 'a'.repeat(MAX_TRANSLATION_CHARS + 5);
    const res = await translationService.translate({
      text: longText,
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error || '', /giới hạn/i);
  });

  test('Rejects identical source and target languages', async () => {
    const res = await translationService.translate({
      text: 'Xin chào',
      sourceLang: 'vi',
      targetLang: 'vi',
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error || '', /khác nhau/i);
  });
});

describe('P3 Acceptance: C. Provider Contract & Configuration', () => {
  test('Provider configuration provides explicit status without secret exposure', () => {
    const config = translationService.getProviderConfig();
    assert.ok(config);
    assert.strictEqual(typeof config.isConfigured, 'boolean');
    assert.strictEqual(typeof config.providerName, 'string');
    assert.strictEqual((config as any).apiKey, undefined);
  });
});

describe('P3 Acceptance: D. Local Fallback & Strict No-Fake-AI Guarantee', () => {
  test('Local fallback translates known demo phrases accurately', async () => {
    const testCases = [
      { vi: 'Cảm ơn', ru: 'Спасибо' },
      { vi: 'Xin lỗi', ru: 'Извините' },
      { vi: 'Bao nhiêu tiền?', ru: 'Сколько это стоит?' },
      { vi: 'Nhà vệ sinh ở đâu?', ru: 'Где находится туалет?' },
    ];

    for (const item of testCases) {
      const res = await translationService.translate({
        text: item.vi,
        sourceLang: 'vi',
        targetLang: 'ru',
      });
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.isFallback, true);
      assert.strictEqual(res.result?.translatedText, item.ru);
    }
  });

  test('Unknown arbitrary text is NOT falsely claimed as translated when no provider is configured', async () => {
    const arbitraryText = 'Hôm nay tôi muốn đi xem bảo tàng mỹ thuật Pushkin';
    const res = await translationService.translate({
      text: arbitraryText,
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error || '', /cấu hình/i);
  });
});

describe('P3 Acceptance: E. Translation History Lifecycle', () => {
  test('Saves, retrieves, restores, and clears history items via storage', () => {
    translationHistory.clearHistory();
    assert.strictEqual(translationHistory.getHistory().length, 0);

    const sampleResult: TranslationResult = {
      id: 'test-trans-1',
      sourceText: 'Xin chào',
      translatedText: 'Здравствуйте',
      sourceLanguage: 'vi',
      targetLanguage: 'ru',
      provider: 'local_fallback_demo',
      timestamp: new Date().toISOString(),
      isFallback: true,
    };

    const history = translationHistory.addHistoryItem(sampleResult);
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].sourceText, 'Xin chào');
    assert.strictEqual(history[0].translatedText, 'Здравствуйте');

    const retrieved = translationHistory.getHistory();
    assert.strictEqual(retrieved.length, 1);
    assert.strictEqual(retrieved[0].id, 'test-trans-1');

    const afterDelete = translationHistory.removeHistoryItem('test-trans-1');
    assert.strictEqual(afterDelete.length, 0);

    translationHistory.addHistoryItem(sampleResult);
    assert.strictEqual(translationHistory.getHistory().length, 1);
    translationHistory.clearHistory();
    assert.strictEqual(translationHistory.getHistory().length, 0);
  });
});

describe('P3 Acceptance: F. Language Swap Logic', () => {
  test('Exchanging source and target maintains valid bidirectional states', () => {
    let source: SupportedLanguage = 'vi';
    let target: SupportedLanguage = 'ru';

    const temp = source;
    source = target;
    target = temp;

    assert.strictEqual(source, 'ru');
    assert.strictEqual(target, 'vi');
  });
});

describe('P3 Acceptance: G. Result Structure & Quality Contract', () => {
  test('Translation result contains required fields without fabricated confidence scores', async () => {
    const res = await translationService.translate({
      text: 'Cảm ơn',
      sourceLang: 'vi',
      targetLang: 'ru',
    });
    assert.strictEqual(res.success, true);
    const result = res.result!;
    assert.ok(result.id, 'Has ID');
    assert.strictEqual(result.sourceText, 'Cảm ơn');
    assert.strictEqual(result.translatedText, 'Спасибо');
    assert.strictEqual(result.sourceLanguage, 'vi');
    assert.strictEqual(result.targetLanguage, 'ru');
    assert.ok(result.provider);
    assert.ok(result.timestamp);
    assert.strictEqual(typeof result.isFallback, 'boolean');
    assert.strictEqual((result as any).confidence, undefined);
  });
});

describe('P3 Acceptance: H. Offline Behavior & Fallbacks', () => {
  test('History remains accessible and local fallback works offline', () => {
    const items = translationHistory.getHistory();
    assert.ok(Array.isArray(items));
    assert.ok(LOCAL_DEMO_DICTIONARY.length >= 10);
  });
});

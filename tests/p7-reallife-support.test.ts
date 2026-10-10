/**
 * Russia AI Support - P7 Real-Life Russia Support Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P7 — REAL-LIFE RUSSIA SUPPORT
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  realLifeService,
  REAL_LIFE_SCENARIOS,
  EMERGENCY_CONTACTS,
  validateRealLifeDataset
} from '../src/modules/reallife';

describe('P7 Unit Test 1: Real-Life Dataset 100% Validation Gate', () => {
  test('Automated dataset validation returns 100% valid with zero errors', () => {
    const report = validateRealLifeDataset();
    if (!report.isValid) {
      console.error('Validation errors:', report.errors);
    }
    assert.strictEqual(report.isValid, true, 'Dataset validation must be 100% error-free');
    assert.strictEqual(report.errors.length, 0);
    assert.ok(report.stats.scenariosCount >= 8, 'Must have at least 8 real-life scenarios');
    assert.ok(report.stats.phrasesCount >= 30, 'Must have at least 30 practical phrases');
    assert.ok(report.stats.emergencyContactsCount >= 5, 'Must have at least 5 emergency hotlines');
  });

  test('All scenarios cover required real-life categories', () => {
    const categories = REAL_LIFE_SCENARIOS.map(s => s.category);
    assert.ok(categories.includes('emergency'), 'Must include emergency');
    assert.ok(categories.includes('transportation'), 'Must include transportation');
    assert.ok(categories.includes('food'), 'Must include food');
    assert.ok(categories.includes('shopping'), 'Must include shopping');
    assert.ok(categories.includes('accommodation'), 'Must include accommodation');
    assert.ok(categories.includes('medical'), 'Must include medical');
    assert.ok(categories.includes('administrative'), 'Must include administrative');
    assert.ok(categories.includes('communication'), 'Must include communication');
  });

  test('Emergency hotlines include national 112, 103, 102, 101 and Vietnam Embassy in Moscow', () => {
    const phones = EMERGENCY_CONTACTS.map(c => c.phone);
    assert.ok(phones.includes('112'));
    assert.ok(phones.includes('103'));
    assert.ok(phones.includes('102'));
    assert.ok(phones.includes('101'));
    assert.ok(phones.some(p => p.includes('499 245 10 92')));
  });
});

describe('P7 Unit Test 2: RealLifeService Retrieval & Navigation', () => {
  test('getAllScenarios returns complete scenario list', () => {
    const scenarios = realLifeService.getAllScenarios();
    assert.strictEqual(scenarios.length, REAL_LIFE_SCENARIOS.length);
  });

  test('getScenarioById retrieves correct scenario', () => {
    const sc = realLifeService.getScenarioById('sc_emergency');
    assert.ok(sc);
    assert.strictEqual(sc?.category, 'emergency');
    assert.ok(sc?.phrases.length > 0);
  });

  test('getScenarioById returns undefined for non-existent ID without throw', () => {
    const sc = realLifeService.getScenarioById('non_existent_scenario_123');
    assert.strictEqual(sc, undefined);
  });

  test('getPhrasesByCategory returns phrases for valid category', () => {
    const phrases = realLifeService.getPhrasesByCategory('transportation');
    assert.ok(phrases.length >= 4);
    assert.ok(phrases.some(p => p.russian.includes('Тройка') || p.russian.includes('билет')));
  });
});

describe('P7 Unit Test 3: Search & Keyword Filter Logic', () => {
  test('Empty search query returns all scenarios and empty phrase list', () => {
    const res = realLifeService.search('');
    assert.strictEqual(res.scenarios.length, REAL_LIFE_SCENARIOS.length);
    assert.strictEqual(res.phrases.length, 0);
  });

  test('Searching "112" finds emergency scenario and phrases', () => {
    const res = realLifeService.search('112');
    assert.ok(res.scenarios.some(s => s.category === 'emergency') || res.phrases.length > 0);
  });

  test('Searching Russian keyword "паспорт" finds passport loss and administrative phrases', () => {
    const res = realLifeService.search('паспорт');
    assert.ok(res.phrases.length >= 1);
    assert.ok(res.phrases.some(p => p.russian.toLowerCase().includes('паспорт')));
  });

  test('Searching Vietnamese keyword "thuốc" finds medical scenario and phrases', () => {
    const res = realLifeService.search('thuốc');
    assert.ok(res.phrases.length >= 1 || res.scenarios.some(s => s.category === 'medical'));
  });

  test('Searching non-matching string returns empty results gracefully', () => {
    const res = realLifeService.search('xyz_non_existent_query_999');
    assert.strictEqual(res.scenarios.length, 0);
    assert.strictEqual(res.phrases.length, 0);
  });
});

describe('P7 Integration: Voice & Translation Service Integration', () => {
  test('speakPhrase delegates to speech synthesis gracefully', async () => {
    const emergencyPhrase = REAL_LIFE_SCENARIOS[0].phrases[0];
    assert.ok(emergencyPhrase);

    // In node environment, should resolve without crashing
    const spoke = await realLifeService.speakPhrase(emergencyPhrase);
    assert.strictEqual(typeof spoke, 'boolean');
  });

  test('translateCustom translates real-life Russian text through P3 engine', async () => {
    const res = await realLifeService.translateCustom('Спасибо');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.result?.translatedText, 'Cảm ơn');
  });
});

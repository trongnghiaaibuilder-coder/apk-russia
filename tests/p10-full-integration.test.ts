/**
 * Russia AI Support - P10 Full Integration Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P10 — FULL INTEGRATION
 * 
 * Verifies all 6 mandatory critical cross-feature workflows.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';

// Core imports across all modules
import { RUSSIAN_ALPHABET, TOPIC_LESSONS, quizService } from '../src/modules/learning';
import { learningStorage } from '../src/modules/learning/services/learningStorage';
import { ocrService } from '../src/modules/camera/services/ocrService';
import { translationService, translationHistory } from '../src/modules/translator';
import { voiceOrchestrator, textToSpeechService } from '../src/modules/voice';
import { assistantService, mockAssistantProvider } from '../src/modules/assistant';
import { connectivityService } from '../src/services/connectivity';
import { realLifeService } from '../src/modules/reallife';

describe('P10 Critical Flow 1: Learning → Quiz → Progress', () => {
  beforeEach(() => {
    learningStorage.resetProgress();
  });

  test('User studies Cyrillic and lesson, takes quiz, and updates progress tracking', () => {
    // 1. Study Cyrillic letter
    const letter = RUSSIAN_ALPHABET[0];
    assert.strictEqual(letter.upper, 'А');

    // 2. Study lesson 1
    const lesson = TOPIC_LESSONS[0];
    assert.strictEqual(lesson.id, 'les-01');

    // 3. Complete lesson in storage
    learningStorage.markLessonCompleted('les-01');
    const progress = learningStorage.getProgress();
    assert.ok(progress.completedLessonIds.includes('les-01'));

    // 4. Generate and complete quiz
    const questions = quizService.generateQuizQuestions(5);
    assert.strictEqual(questions.length, 5);

    // 5. Save quiz score
    learningStorage.recordQuizResult(5, 5);
    const updatedProgress = learningStorage.getProgress();
    assert.strictEqual(updatedProgress.quizAttempts, 5);
    assert.strictEqual(updatedProgress.quizCorrectAnswers, 5);
  });
});

describe('P10 Critical Flow 2: Camera → OCR → Translation', () => {
  test('User captures Russian signage, OCR extracts Cyrillic text, and translation decodes it', async () => {
    // 1. OCR scans sample Metro sign
    const ocrResult = ocrService.recognizeFromSample('sample_metro_ploshchad');
    assert.strictEqual(ocrResult.success, true);
    assert.ok(ocrResult.rawText.includes('СТАНЦИЯ ПЛОЩАДЬ РЕВОЛЮЦИИ'));

    // 2. Prepare extracted text for translation
    const textToTranslate = ocrService.prepareForTranslation(ocrResult);
    assert.ok(textToTranslate.length > 0);

    // 3. Pipe to translation engine
    const transResult = await translationService.translate({
      text: textToTranslate,
      sourceLang: 'ru',
      targetLang: 'vi'
    });

    assert.strictEqual(transResult.success, true);
    assert.ok(transResult.result?.translatedText);
    assert.strictEqual(transResult.result?.sourceLanguage, 'ru');
    assert.strictEqual(transResult.result?.targetLanguage, 'vi');
  });
});

describe('P10 Critical Flow 3: Voice → STT → Translation → TTS', () => {
  test('Voice transcript feeds into translation engine and triggers text-to-speech', async () => {
    // 1. Simulated voice input from user: "Xin chào"
    const voiceInput = 'Xin chào';

    // 2. Voice translation orchestrator translates using P3 engine
    const transResp = await voiceOrchestrator.executeTranslation(voiceInput, 'vi', 'ru');
    assert.strictEqual(transResp.success, true);
    assert.strictEqual(transResp.translatedText, 'Здравствуйте');

    // 3. Audio synthesis speaks translated text
    const audioSpoken = await textToSpeechService.speak(transResp.translatedText, 'ru-RU');
    assert.strictEqual(typeof audioSpoken, 'boolean');
  });
});

describe('P10 Critical Flow 4: Translation → History → Restore', () => {
  beforeEach(() => {
    translationHistory.clearHistory();
  });

  test('Translation adds to history, survives retrieval, and restores correctly', async () => {
    // 1. Perform translation
    const resp = await translationService.translate({
      text: 'Cảm ơn rất nhiều',
      sourceLang: 'vi',
      targetLang: 'ru'
    });
    assert.strictEqual(resp.success, true);
    assert.ok(resp.result);

    // 2. Save to history
    translationHistory.addHistoryItem(resp.result);
    const history = translationHistory.getHistory();
    assert.strictEqual(history.length, 1);
    assert.strictEqual(history[0].sourceText, 'Cảm ơn rất nhiều');
    assert.strictEqual(history[0].translatedText, 'Большое спасибо');

    // 3. Restore translation from history
    const restored = history[0];
    assert.strictEqual(restored.sourceLanguage, 'vi');
    assert.strictEqual(restored.targetLanguage, 'ru');
  });
});

describe('P10 Critical Flow 5: Assistant → AI Provider → Response', () => {
  beforeEach(() => {
    mockAssistantProvider.reset();
    assistantService.clearHistory();
    assistantService.setProvider(mockAssistantProvider);
  });

  test('Assistant accepts legal query, queries provider, and maintains conversation chain', async () => {
    // 1. Ask question about visa/registration
    const question = 'Quy định đăng ký tạm trú 7 ngày tại Nga là gì?';
    const resp = await assistantService.ask(question);

    assert.strictEqual(resp.success, true);
    assert.ok(resp.message?.content);

    // 2. History contains both user turn and assistant reply
    const history = assistantService.getHistory();
    assert.strictEqual(history.length, 3); // Welcome + User + Assistant
    assert.strictEqual(history[1].content, question);
  });
});

describe('P10 Critical Flow 6: Offline → Fallback → Recovery', () => {
  test('Network drops, offline fallbacks activate, network recovers without error', async () => {
    // 1. Network drop
    connectivityService.setSimulatedStatus(false);
    assert.strictEqual(connectivityService.getStatus(), false);

    // 2. Emergency contacts and phrases are instantly usable offline
    const emergencySc = realLifeService.getScenarioById('sc_emergency');
    assert.ok(emergencySc && emergencySc.phrases.length > 0);

    // 3. Translation works on offline dictionary
    const offTrans = await translationService.translate({
      text: 'Xin lỗi',
      sourceLang: 'vi',
      targetLang: 'ru'
    });
    assert.strictEqual(offTrans.success, true);
    assert.strictEqual(offTrans.result?.translatedText, 'Извините');

    // 4. Network recovery
    connectivityService.setSimulatedStatus(true);
    assert.strictEqual(connectivityService.getStatus(), true);
  });
});

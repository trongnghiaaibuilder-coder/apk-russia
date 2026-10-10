/**
 * Russia AI Support - P5 Camera & OCR Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P5 — CAMERA + OCR
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  ocrService, 
  REALISTIC_RUSSIAN_SIGN_SAMPLES 
} from '../src/modules/camera/services/ocrService';
import { cameraService } from '../src/modules/camera/services/cameraService';
import { translationService } from '../src/modules/translator/services/translationService';
import { OcrRecognitionResult } from '../src/modules/camera/types';

describe('P5 Unit Test 1: OCR Service Abstraction & Cyrillic Recognition', () => {
  test('Service exposes standard methods', () => {
    assert.strictEqual(typeof ocrService.hasCyrillic, 'function');
    assert.strictEqual(typeof ocrService.detectLanguage, 'function');
    assert.strictEqual(typeof ocrService.sanitizeText, 'function');
    assert.strictEqual(typeof ocrService.validateResult, 'function');
    assert.strictEqual(typeof ocrService.recognizeText, 'function');
    assert.strictEqual(typeof ocrService.recognizeFromSample, 'function');
    assert.strictEqual(typeof ocrService.recognizeFromCanvas, 'function');
  });

  test('Cyrillic detection correctly identifies Russian text and rejects Latin-only text', () => {
    assert.strictEqual(ocrService.hasCyrillic('СТАНЦИЯ ПЛОЩАДЬ РЕВОЛЮЦИИ'), true);
    assert.strictEqual(ocrService.hasCyrillic('Здравствуйте'), true);
    assert.strictEqual(ocrService.hasCyrillic('Москва'), true);
    assert.strictEqual(ocrService.hasCyrillic('Hello World'), false);
    assert.strictEqual(ocrService.hasCyrillic('Xin chao ban'), false);
    assert.strictEqual(ocrService.hasCyrillic('123456!@#$'), false);
  });

  test('Language detector classifies ru, vi, en, and unknown correctly', () => {
    assert.strictEqual(ocrService.detectLanguage('ВЫХОД В ГОРОД'), 'ru');
    assert.strictEqual(ocrService.detectLanguage('Xin chào Việt Nam'), 'vi');
    assert.strictEqual(ocrService.detectLanguage('Moscow Central Station'), 'en');
    assert.strictEqual(ocrService.detectLanguage(''), 'unknown');
  });

  test('Sanitize text removes extra whitespace, carriage returns and filters empty lines', () => {
    const dirty = '  ЛИНИЯ 3 \r\n\r\n   ВЫХОД   В ГОРОД   \n\n ';
    const clean = ocrService.sanitizeText(dirty);
    assert.strictEqual(clean, 'ЛИНИЯ 3\nВЫХОД В ГОРОД');
  });
});

describe('P5 Unit Test 2: Sample Russian Signage Dataset & Offline Recognition', () => {
  test('Dataset contains high-quality real Russian signs across essential life categories', () => {
    const samples = ocrService.getSampleSigns();
    assert.ok(samples.length >= 7, 'Must have at least 7 realistic sign presets');

    const categories = samples.map(s => s.category);
    assert.ok(categories.includes('metro_sign'), 'Must include Metro sign');
    assert.ok(categories.includes('train_ticket'), 'Must include Train ticket');
    assert.ok(categories.includes('menu'), 'Must include Menu');
    assert.ok(categories.includes('pharmacy'), 'Must include Pharmacy sign');
    assert.ok(categories.includes('street_sign'), 'Must include Street sign');
    assert.ok(categories.includes('store_sign'), 'Must include Supermarket sign');
    assert.ok(categories.includes('emergency_sign'), 'Must include Emergency sign');
  });

  test('Every sample contains valid Cyrillic lines and non-empty translation reference', () => {
    for (const sample of REALISTIC_RUSSIAN_SIGN_SAMPLES) {
      assert.ok(sample.id.length > 0);
      assert.ok(sample.title.length > 0);
      assert.ok(sample.linesRu.length > 0, `Sample ${sample.id} must have lines`);
      assert.ok(ocrService.hasCyrillic(sample.sampleTextRu), `Sample ${sample.id} must contain Cyrillic`);
      assert.ok(sample.expectedTranslationVi && sample.expectedTranslationVi.length > 0);
    }
  });

  test('recognizeFromSample returns high confidence result with lines for valid sample ID', () => {
    const result = ocrService.recognizeFromSample('sample_metro_ploshchad');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.detectedLanguage, 'ru');
    assert.ok(result.confidence > 0.9);
    assert.strictEqual(result.lines.length, 3);
    assert.strictEqual(result.lines[0].text, 'СТАНЦИЯ ПЛОЩАДЬ РЕВОЛЮЦИИ');
  });

  test('recognizeFromSample returns structured error for non-existent sample ID', () => {
    const result = ocrService.recognizeFromSample('non_existent_sign_123');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errorCode, 'PROCESSING_FAILED');
    assert.ok(result.error?.includes('Không tìm thấy mẫu'));
  });
});

describe('P5 Unit Test 3: OCR Result Validation & Error Handling', () => {
  test('validateResult rejects null or undefined input', () => {
    const val = ocrService.validateResult(null as any);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.reason?.includes('trống'));
  });

  test('validateResult rejects failed result and preserves error message', () => {
    const failedResult: OcrRecognitionResult = {
      success: false,
      rawText: '',
      lines: [],
      confidence: 0,
      durationMs: 10,
      error: 'Lỗi cảm biến máy ảnh'
    };
    const val = ocrService.validateResult(failedResult);
    assert.strictEqual(val.isValid, false);
    assert.strictEqual(val.reason, 'Lỗi cảm biến máy ảnh');
  });

  test('validateResult rejects empty rawText', () => {
    const emptyResult: OcrRecognitionResult = {
      success: true,
      rawText: '   \n  ',
      lines: [],
      confidence: 0.8,
      durationMs: 15
    };
    const val = ocrService.validateResult(emptyResult);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.reason?.includes('Không tìm thấy chữ'));
  });

  test('validateResult rejects low confidence below 0.2', () => {
    const lowConfResult: OcrRecognitionResult = {
      success: true,
      rawText: '模糊的文字',
      lines: [{ id: '1', text: '模糊的文字', confidence: 0.15 }],
      confidence: 0.15,
      durationMs: 25
    };
    const val = ocrService.validateResult(lowConfResult);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.reason?.includes('Độ tin cậy nhận dạng quá thấp'));
  });

  test('recognizeText rejects blank text with EMPTY_RESULT code', () => {
    const res = ocrService.recognizeText('   ');
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.errorCode, 'EMPTY_RESULT');
    assert.strictEqual(res.lines.length, 0);
  });
});

describe('P5 Unit Test 4: Camera Service Contract & Permissions', () => {
  test('Camera service methods exist and provide proper interface', () => {
    assert.strictEqual(typeof cameraService.isSupported, 'function');
    assert.strictEqual(typeof cameraService.getStream, 'function');
    assert.strictEqual(typeof cameraService.getFacingMode, 'function');
    assert.strictEqual(typeof cameraService.getPermissionState, 'function');
    assert.strictEqual(typeof cameraService.startCamera, 'function');
    assert.strictEqual(typeof cameraService.stopCamera, 'function');
    assert.strictEqual(typeof cameraService.switchCamera, 'function');
    assert.strictEqual(typeof cameraService.captureSnapshot, 'function');
  });

  test('In non-browser environment, isSupported returns false cleanly', () => {
    const supported = cameraService.isSupported();
    assert.strictEqual(supported, false);
  });

  test('In non-browser environment, startCamera reports unsupported gracefully without throw', async () => {
    const res = await cameraService.startCamera();
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.status, 'unsupported');
    assert.ok(res.error?.includes('không hỗ trợ truy cập camera'));
  });

  test('stopCamera can be called safely without active stream', () => {
    assert.doesNotThrow(() => {
      cameraService.stopCamera();
    });
  });
});

describe('P5 Integration: OCR → Translation Pipeline', () => {
  test('OCR result translates correctly through P3 translation engine', async () => {
    const ocrSample = ocrService.recognizeFromSample('sample_emergency_exit');
    assert.strictEqual(ocrSample.success, true);

    const textToTranslate = ocrService.prepareForTranslation(ocrSample);
    assert.ok(textToTranslate.includes('ЗАПАСНЫЙ ВЫХОД'));

    const translationResp = await translationService.translate({
      text: textToTranslate,
      sourceLang: 'ru',
      targetLang: 'vi'
    });

    assert.strictEqual(translationResp.success, true);
    assert.ok(translationResp.result?.translatedText);
    assert.strictEqual(translationResp.result?.sourceLanguage, 'ru');
    assert.strictEqual(translationResp.result?.targetLanguage, 'vi');
  });

  test('Recognized single-word Russian sign integrates with dictionary/translation', async () => {
    const signResult = ocrService.recognizeText('АПТЕКА');
    assert.strictEqual(signResult.success, true);
    assert.strictEqual(signResult.detectedLanguage, 'ru');

    const trans = await translationService.translate({
      text: signResult.rawText,
      sourceLang: 'ru',
      targetLang: 'vi'
    });

    assert.strictEqual(trans.success, true);
    assert.ok(trans.result?.translatedText.toLowerCase().includes('thuốc'));
  });
});

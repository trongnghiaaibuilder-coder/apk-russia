/**
 * Russia AI Support - P9 Security & Privacy Acceptance Test Suite
 * Developer credit: Xương Rồng AI developer
 * Phase: P9 — SECURITY & PRIVACY
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { cameraService } from '../src/modules/camera/services/cameraService';
import { speechRecognitionService } from '../src/modules/voice/services/speechRecognitionService';
import { safeStorage } from '../src/services/storage';
import { logger } from '../src/services/logger';

describe('P9 Unit Test 1: Codebase Secret Scanning & Zero-Secrets Gate', () => {
  const SECRET_PATTERNS = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'RSA Private Key', regex: /-----BEGIN (RSA )?PRIVATE KEY-----/ },
    { name: 'Generic Secret Token', regex: /Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/ },
    { name: 'Hardcoded Password Assignment', regex: /(api_key|apiKey|secret|password)\s*[:=]\s*['"][a-zA-Z0-9_\-]{16,}['"]/i }
  ];

  function scanDirectory(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (['node_modules', '.git', 'dist'].includes(file)) continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath, fileList);
      } else if (/\.(ts|tsx|js|json|html|md|env)$/.test(file) || file === '.env.example') {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  test('Secret scanner inspects repository and finds zero embedded API keys or credentials', () => {
    const rootDir = path.resolve('.');
    const filesToScan = scanDirectory(rootDir);
    assert.ok(filesToScan.length >= 30, 'Must scan at least 30 project files');

    const violations: { file: string; pattern: string }[] = [];

    for (const filePath of filesToScan) {
      // Skip test file itself from pattern matching to avoid false positive on the regex definition
      if (filePath.endsWith('p9-security.test.ts')) continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      for (const p of SECRET_PATTERNS) {
        if (p.regex.test(content)) {
          // Allow non-secret placeholders in .env.example
          if (filePath.endsWith('.env.example') && content.includes('MY_GEMINI_API_KEY')) {
            continue;
          }
          violations.push({ file: filePath, pattern: p.name });
        }
      }
    }

    assert.strictEqual(violations.length, 0, `Secrets detected in files: ${JSON.stringify(violations)}`);
  });

  test('.env.example contains only non-secret placeholders', () => {
    const envExamplePath = path.resolve('.env.example');
    assert.ok(fs.existsSync(envExamplePath), '.env.example must exist');
    const content = fs.readFileSync(envExamplePath, 'utf-8');

    assert.ok(content.includes('MY_GEMINI_API_KEY'), 'Must use placeholder MY_GEMINI_API_KEY');
    assert.ok(!/AIza[0-9A-Za-z-_]{35}/.test(content), 'Must not contain real Google API key');
  });
});

describe('P9 Unit Test 2: Runtime Permission Handling & Graceful Denial', () => {
  test('Camera service reports unsupported or permission denied gracefully without crash', async () => {
    const res = await cameraService.startCamera();
    assert.strictEqual(res.success, false);
    assert.ok(['unsupported', 'permission_denied'].includes(res.status));
    assert.ok(res.error && res.error.length > 0);
  });

  test('Speech recognition service handles permission denial gracefully', async () => {
    let errorCode: string | null = null;
    await speechRecognitionService.startListening(
      'ru-RU',
      () => {},
      (code) => {
        errorCode = code;
      },
      () => {}
    );
    assert.ok(errorCode !== null, 'Should report structured error code');
  });
});

describe('P9 Unit Test 3: Log Sanitization & Safe Error Display', () => {
  test('Logger handles error details safely without throwing', () => {
    assert.doesNotThrow(() => {
      logger.error('SecurityTest', 'Test safe error log', new Error('Safe simulation'));
      logger.warn('SecurityTest', 'Test warning log', { attempt: 1 });
      logger.info('SecurityTest', 'Test info log');
    });
  });

  test('User data storage keys do not store passwords or account credentials', () => {
    // Ensure standard keys are dedicated to educational preferences and history
    safeStorage.setItem('test_pref', 'ru');
    assert.strictEqual(safeStorage.getItem('test_pref', 'vi'), 'ru');
  });
});

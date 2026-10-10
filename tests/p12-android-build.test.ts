/**
 * Russia AI Support - P12 Android Build Acceptance Test Suite
 * Developer: Xương Rồng AI developer
 * Phase: P12 — ANDROID BUILD
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

describe('P12 Acceptance Criteria: Android Project & Build Configuration', () => {
  test('P12-1: Android project structure and Gradle configurations exist', () => {
    assert.strictEqual(fs.existsSync('android/settings.gradle'), true, 'settings.gradle must exist');
    assert.strictEqual(fs.existsSync('android/build.gradle'), true, 'root build.gradle must exist');
    assert.strictEqual(fs.existsSync('android/app/build.gradle'), true, 'app build.gradle must exist');
    assert.strictEqual(fs.existsSync('android/app/src/main/AndroidManifest.xml'), true, 'AndroidManifest.xml must exist');
    assert.strictEqual(fs.existsSync('android/app/src/main/java/com/xuongrong/russiaai/MainActivity.kt'), true, 'MainActivity.kt must exist');
    assert.strictEqual(fs.existsSync('android/app/src/main/res/values/strings.xml'), true, 'strings.xml must exist');
  });

  test('P12-2: App build.gradle contains correct version and SDK specifications', () => {
    const appGradle = fs.readFileSync('android/app/build.gradle', 'utf8');
    assert.match(appGradle, /applicationId ["']com\.xuongrong\.russiaai["']/, 'applicationId must be com.xuongrong.russiaai');
    assert.match(appGradle, /compileSdk 34/, 'compileSdk must be 34');
    assert.match(appGradle, /minSdk 24/, 'minSdk must be 24');
    assert.match(appGradle, /targetSdk 34/, 'targetSdk must be 34');
    assert.match(appGradle, /versionCode 1/, 'versionCode must be 1');
    assert.match(appGradle, /versionName ["']1\.0\.0["']/, 'versionName must be 1.0.0');
    assert.match(appGradle, /release \{/, 'release build type must be configured');
    assert.match(appGradle, /debug \{/, 'debug build type must be configured');
  });

  test('P12-3: AndroidManifest.xml declares all required hardware & network permissions', () => {
    const manifest = fs.readFileSync('android/app/src/main/AndroidManifest.xml', 'utf8');
    
    // Required permissions
    const requiredPermissions = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.MODIFY_AUDIO_SETTINGS'
    ];

    for (const perm of requiredPermissions) {
      assert.ok(manifest.includes(perm), `Manifest missing required permission: ${perm}`);
    }

    // Required activity setup
    assert.ok(manifest.includes('android.intent.action.MAIN'), 'Manifest must have MAIN action intent');
    assert.ok(manifest.includes('android.intent.category.LAUNCHER'), 'Manifest must have LAUNCHER category');
  });

  test('P12-4: Native WebView activity handles hardware permissions and loads local offline bundle', () => {
    const mainActivity = fs.readFileSync('android/app/src/main/java/com/xuongrong/russiaai/MainActivity.kt', 'utf8');
    
    assert.ok(mainActivity.includes('package com.xuongrong.russiaai'), 'Package declaration must be correct');
    assert.ok(mainActivity.includes('Manifest.permission.CAMERA'), 'Handles Camera permission');
    assert.ok(mainActivity.includes('Manifest.permission.RECORD_AUDIO'), 'Handles Record Audio permission');
    assert.ok(mainActivity.includes('file:///android_asset/public/index.html'), 'Loads packaged local asset index.html');
    assert.ok(mainActivity.includes('settings.javaScriptEnabled = true'), 'JavaScript enabled for React SPA');
    assert.ok(mainActivity.includes('settings.domStorageEnabled = true'), 'DOM storage enabled for local history and learning state');
  });

  test('P12-5: Offline web assets are packaged in Android assets directory', () => {
    assert.strictEqual(fs.existsSync('android/app/src/main/assets/public/index.html'), true, 'index.html must exist in android assets');
    assert.strictEqual(fs.existsSync('android/app/src/main/assets/public/manifest.json'), true, 'manifest.json must exist in android assets');
    assert.strictEqual(fs.existsSync('android/app/src/main/assets/public/sw.js'), true, 'sw.js must exist in android assets');
    
    const indexHtml = fs.readFileSync('android/app/src/main/assets/public/index.html', 'utf8');
    assert.ok(indexHtml.includes('assets/index-'), 'Packaged index.html references built production assets');
  });

  test('P12-6: Production APK artifact is generated and satisfies integrity requirements', () => {
    const apkPath = 'artifacts/builds/russia-ai-support-v1.0.0.apk';
    const manifestPath = 'artifacts/builds/BUILD_MANIFEST.json';

    assert.strictEqual(fs.existsSync(apkPath), true, 'APK artifact must exist in artifacts/builds/');
    assert.strictEqual(fs.existsSync(manifestPath), true, 'BUILD_MANIFEST.json must exist in artifacts/builds/');

    const apkStats = fs.statSync(apkPath);
    assert.ok(apkStats.size > 100000, `APK size must be substantial (>100KB), got: ${apkStats.size} bytes`);

    const apkData = fs.readFileSync(apkPath);
    // APK is a ZIP archive; verify PK zip header signature (0x04034b50)
    assert.strictEqual(apkData.readUInt32LE(0), 0x04034b50, 'APK file must be a valid ZIP archive format');

    const calculatedSha256 = crypto.createHash('sha256').update(apkData).digest('hex');
    const buildManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    assert.strictEqual(buildManifest.applicationId, 'com.xuongrong.russiaai');
    assert.strictEqual(buildManifest.versionName, '1.0.0');
    assert.strictEqual(buildManifest.versionCode, 1);
    assert.strictEqual(buildManifest.sha256Checksum, calculatedSha256, 'Recorded checksum must match actual APK SHA-256');
    assert.strictEqual(buildManifest.sizeBytes, apkStats.size, 'Recorded size must match actual APK byte size');
  });
});

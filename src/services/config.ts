/**
 * Application Configuration Service
 * Russia AI Support - Master Build
 * Developer credit: Xương Rồng AI developer
 */
import { AppConfig } from '../types/config';

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env) {
      const val = (import.meta as unknown as { env: Record<string, string> }).env[key];
      if (val) return val;
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
    }
  } catch {
    // ignore
  }
  return '';
};

export const APP_CONFIG: AppConfig = {
  appName: 'Russia AI Support',
  appVersion: '1.0.0',
  developerCredit: 'Xương Rồng AI developer',
  phase: 'P0-P16 Master Verification',
  environment: (getEnvVar('MODE') as 'development' | 'production' | 'test') || 'development',
  features: {
    offlineModeSupported: true,
    voiceModulePrepared: true,
    cameraModulePrepared: true,
    learnModulePrepared: true,
    assistantModulePrepared: true,
    emergencyModulePrepared: true,
  },
  api: {
    // Only check presence, NEVER expose raw key values in client objects
    geminiConfigured: Boolean(getEnvVar('VITE_GEMINI_API_KEY') || getEnvVar('GEMINI_API_KEY')),
    appUrl: getEnvVar('VITE_APP_URL') || getEnvVar('APP_URL') || '',
  },
};

export function getAppConfig(): AppConfig {
  return APP_CONFIG;
}

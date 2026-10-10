/**
 * Application configuration types
 * Developer credit: Xương Rồng AI developer
 */
export interface AppConfig {
  appName: string;
  appVersion: string;
  developerCredit: string;
  phase: string;
  environment: 'development' | 'production' | 'test';
  features: {
    offlineModeSupported: boolean;
    voiceModulePrepared: boolean;
    cameraModulePrepared: boolean;
    learnModulePrepared: boolean;
    assistantModulePrepared: boolean;
    emergencyModulePrepared: boolean;
  };
  api: {
    geminiConfigured: boolean;
    appUrl?: string;
  };
}

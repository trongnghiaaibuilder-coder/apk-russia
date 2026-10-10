/**
 * Russia AI Support - Camera & OCR Types
 * Developer: Xương Rồng AI developer
 * Phase: P5 — CAMERA + OCR
 */

export interface OcrTextLine {
  id: string;
  text: string;
  confidence: number;
}

export type OcrErrorCode = 
  | 'NO_IMAGE'
  | 'EMPTY_RESULT'
  | 'LOW_CONFIDENCE'
  | 'PERMISSION_DENIED'
  | 'UNSUPPORTED'
  | 'PROCESSING_FAILED'
  | 'TIMEOUT';

export interface OcrRecognitionResult {
  success: boolean;
  rawText: string;
  lines: OcrTextLine[];
  detectedLanguage?: 'ru' | 'vi' | 'en' | 'unknown';
  confidence: number;
  durationMs: number;
  errorCode?: OcrErrorCode;
  error?: string;
  warning?: string;
}

export type SampleCategory = 'metro_sign' | 'train_ticket' | 'menu' | 'street_sign' | 'pharmacy' | 'store_sign' | 'emergency_sign';

export interface SampleOcrImage {
  id: string;
  title: string;
  category: SampleCategory;
  categoryLabelVi: string;
  description: string;
  sampleTextRu: string;
  linesRu: string[];
  expectedTranslationVi?: string;
}

export type CameraStatus = 
  | 'idle' 
  | 'initializing' 
  | 'active' 
  | 'capturing' 
  | 'processing' 
  | 'error' 
  | 'permission_denied' 
  | 'unsupported';

export type CameraPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';
export type CameraFacingMode = 'environment' | 'user';

export interface CameraModuleProps {
  onSendToTranslate?: (text: string) => void;
  onClose?: () => void;
}

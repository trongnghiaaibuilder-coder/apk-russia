/**
 * OCR native qua AndroidOCR bridge (Tesseract native + tiền xử lý ảnh).
 * Nhanh và ổn định hơn Tesseract.js trong WebView.
 */
import { logger } from '../../../services/logger';
import type { OcrLine } from './realOcrService';

export interface NativeOcrResult {
  success: boolean;
  lines: OcrLine[];
  error?: string;
}

declare global {
  interface Window {
    AndroidOCR?: {
      isAvailable(): boolean;
      recognizeText(base64Image: string, callbackId: string): void;
    };
    __ocrNativeCallback?: (callbackId: string, jsonResult: string) => void;
  }
}

const pendingCallbacks = new Map<string, (result: NativeOcrResult) => void>();

// Đăng ký callback global một lần
if (typeof window !== 'undefined' && !window.__ocrNativeCallback) {
  window.__ocrNativeCallback = (callbackId: string, jsonResult: string) => {
    const resolve = pendingCallbacks.get(callbackId);
    if (resolve) {
      pendingCallbacks.delete(callbackId);
      try {
        const parsed = JSON.parse(jsonResult);
        const lines: OcrLine[] = (parsed.lines || []).map((l: any) => ({
          text: String(l.text || ''),
          bbox: {
            x0: Number(l.x0) || 0,
            y0: Number(l.y0) || 0,
            x1: Number(l.x1) || 0,
            y1: Number(l.y1) || 0,
          },
          confidence: 90,
          words: [],
        }));
        resolve({ success: !!parsed.success, lines, error: parsed.error });
      } catch (err) {
        logger.warn('NativeOcr', 'Parse native OCR result failed', err);
        resolve({ success: false, lines: [], error: 'Lỗi đọc kết quả OCR' });
      }
    }
  };
}

function isNativeOcrAvailable(): boolean {
  try {
    return !!window.AndroidOCR && window.AndroidOCR.isAvailable();
  } catch {
    return false;
  }
}

function canvasToBase64(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const commaIdx = dataUrl.indexOf(',');
  return commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
}

/**
 * Nhận diện chữ bằng OCR native. Timeout 60s.
 * Ném lỗi nếu native không khả dụng để caller fallback sang Tesseract.js.
 */
export async function recognizeWithNativeOcr(canvas: HTMLCanvasElement): Promise<NativeOcrResult> {
  if (!isNativeOcrAvailable()) {
    throw new Error('Native OCR không khả dụng');
  }
  const base64 = canvasToBase64(canvas);
  const callbackId = `ocr_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  return new Promise<NativeOcrResult>((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingCallbacks.delete(callbackId);
      reject(new Error('OCR native hết thời gian chờ'));
    }, 60000);

    pendingCallbacks.set(callbackId, (result) => {
      clearTimeout(timer);
      resolve(result);
    });

    try {
      window.AndroidOCR!.recognizeText(base64, callbackId);
    } catch (err) {
      clearTimeout(timer);
      pendingCallbacks.delete(callbackId);
      reject(err);
    }
  });
}

export function hasNativeOcr(): boolean {
  return isNativeOcrAvailable();
}

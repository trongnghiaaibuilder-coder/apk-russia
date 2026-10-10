/**
 * Real OCR Service dùng Tesseract.js — đọc chữ Nga thật từ ảnh.
 * Developer: Xương Rồng AI Developer
 *
 * - Dùng Tesseract.js (WASM) chạy ngay trên máy, hỗ trợ tiếng Nga (Cyrillic).
 * - Lần đầu cần mạng để tải dữ liệu ngôn ngữ (~12MB), sau đó cache lại dùng offline.
 * - Nếu không tải được (offline lần đầu), trả về lỗi rõ ràng thay vì kết quả giả.
 */
import { createWorker, Worker } from 'tesseract.js';

export interface OcrWord {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export interface OcrLine {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  words: OcrWord[];
}

export interface RealOcrResult {
  success: boolean;
  fullText: string;
  lines: OcrLine[];
  confidence: number;
  durationMs: number;
  error?: string;
}

let workerPromise: Promise<Worker> | null = null;
let workerFailed = false;

async function getWorker(): Promise<Worker> {
  if (workerPromise) return workerPromise;
  if (workerFailed) throw new Error('OCR chưa sẵn sàng.');

  workerPromise = (async () => {
    const worker = await createWorker('rus', undefined, {
      // Dùng CDN mặc định của Tesseract.js cho worker, core và language data
      logger: () => {},
    });
    return worker;
  })();

  try {
    await workerPromise;
  } catch (err) {
    workerFailed = true;
    workerPromise = null;
    throw err;
  }
  return workerPromise;
}

export const realOcrService = {
  /** Kiểm tra OCR đã sẵn sàng chưa (đã tải xong dữ liệu tiếng Nga) */
  isReady(): boolean {
    return workerPromise !== null && !workerFailed;
  },

  /**
   * Khởi động trước OCR (tải dữ liệu ngôn ngữ). Gọi khi mở tab camera.
   * Trả về true nếu sẵn sàng, false nếu lỗi (vd: mất mạng lần đầu).
   */
  async warmup(): Promise<boolean> {
    try {
      await getWorker();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Đọc chữ từ canvas. Trả về text + vị trí từng dòng để vẽ đè bản dịch lên ảnh.
   */
  async recognizeFromCanvas(canvas: HTMLCanvasElement): Promise<RealOcrResult> {
    const startTime = Date.now();

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      return {
        success: false, fullText: '', lines: [], confidence: 0,
        durationMs: Date.now() - startTime, error: 'Không có ảnh để đọc.',
      };
    }

    let worker: Worker;
    try {
      worker = await getWorker();
    } catch {
      return {
        success: false, fullText: '', lines: [], confidence: 0,
        durationMs: Date.now() - startTime,
        error: 'Chưa tải được bộ nhận dạng tiếng Nga (cần mạng lần đầu). Bạn thử lại khi có mạng nhé.',
      };
    }

    try {
      // Thu nhỏ ảnh nếu quá lớn để OCR nhanh hơn
      const MAX_SIDE = 1600;
      let srcCanvas = canvas;
      const scale = Math.min(1, MAX_SIDE / Math.max(canvas.width, canvas.height));
      if (scale < 1) {
        srcCanvas = document.createElement('canvas');
        srcCanvas.width = Math.round(canvas.width * scale);
        srcCanvas.height = Math.round(canvas.height * scale);
        const ctx = srcCanvas.getContext('2d');
        ctx?.drawImage(canvas, 0, 0, srcCanvas.width, srcCanvas.height);
      }
      const backScale = 1 / scale;

      const { data } = await worker.recognize(srcCanvas);

      const rawText = (data.text || '').trim();
      if (!rawText) {
        return {
          success: false, fullText: '', lines: [], confidence: 0,
          durationMs: Date.now() - startTime,
          error: 'Không đọc được chữ trong ảnh. Bạn chụp gần hơn, đủ sáng và giữ máy chắc nhé.',
        };
      }

      // Kiểm tra có chữ Cyrillic không
      const hasCyrillic = /[А-Яа-яЁё]/.test(rawText);

      const lines: OcrLine[] = (data.lines || [])
        .filter((l: any) => l.text && l.text.trim())
        .map((l: any) => ({
          text: l.text.trim(),
          confidence: (l.confidence || 0) / 100,
          bbox: {
            x0: l.bbox.x0 * backScale,
            y0: l.bbox.y0 * backScale,
            x1: l.bbox.x1 * backScale,
            y1: l.bbox.y1 * backScale,
          },
          words: (l.words || []).map((w: any) => ({
            text: w.text,
            confidence: (w.confidence || 0) / 100,
            bbox: {
              x0: w.bbox.x0 * backScale,
              y0: w.bbox.y0 * backScale,
              x1: w.bbox.x1 * backScale,
              y1: w.bbox.y1 * backScale,
            },
          })),
        }));

      return {
        success: true,
        fullText: rawText,
        lines,
        confidence: (data.confidence || 0) / 100,
        durationMs: Date.now() - startTime,
        error: !hasCyrillic ? 'Lưu ý: Ảnh có vẻ không chứa chữ tiếng Nga.' : undefined,
      };
    } catch (err: any) {
      return {
        success: false, fullText: '', lines: [], confidence: 0,
        durationMs: Date.now() - startTime,
        error: err?.message || 'Lỗi khi đọc ảnh.',
      };
    }
  },

  /** Giải phóng worker khi không dùng nữa */
  async terminate(): Promise<void> {
    if (workerPromise) {
      try {
        const w = await workerPromise;
        await w.terminate();
      } catch {}
      workerPromise = null;
    }
  },
};

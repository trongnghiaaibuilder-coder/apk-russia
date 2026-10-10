import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Languages, RotateCcw, X } from 'lucide-react';
import { realOcrService, OcrLine } from '../services/realOcrService';
import { translationService } from '../../translator/services/translationService';

export interface ImageTranslationOverlayProps {
  /** Canvas chứa ảnh vừa chụp */
  canvas: HTMLCanvasElement;
  onClose: () => void;
  onRetake: () => void;
}

interface TranslatedLine extends OcrLine {
  translatedText: string;
}

export const ImageTranslationOverlay: React.FC<ImageTranslationOverlayProps> = ({
  canvas,
  onClose,
  onRetake,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<'ocr' | 'translating' | 'done' | 'error'>('ocr');
  const [statusText, setStatusText] = useState('Đang đọc chữ trong ảnh...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [translatedLines, setTranslatedLines] = useState<TranslatedLine[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Tạo URL hiển thị cho ảnh
    const url = canvas.toDataURL('image/jpeg', 0.85);
    setImageUrl(url);

    let cancelled = false;

    async function process() {
      // Bước 1: OCR đọc chữ Nga + vị trí
      setStage('ocr');
      setStatusText('Đang đọc chữ trong ảnh...');
      const ocrResult = await realOcrService.recognizeFromCanvas(canvas);
      if (cancelled) return;

      if (!ocrResult.success || ocrResult.lines.length === 0) {
        setStage('error');
        setErrorMessage(ocrResult.error || 'Không đọc được chữ trong ảnh.');
        return;
      }

      // Bước 2: Dịch từng dòng sang tiếng Việt
      setStage('translating');
      setStatusText(`Đang dịch ${ocrResult.lines.length} dòng...`);
      const translated: TranslatedLine[] = [];
      for (let i = 0; i < ocrResult.lines.length; i++) {
        const line = ocrResult.lines[i];
        setStatusText(`Đang dịch dòng ${i + 1}/${ocrResult.lines.length}...`);
        try {
          const res = await translationService.translate({
            text: line.text,
            sourceLang: 'ru',
            targetLang: 'vi',
          });
          translated.push({
            ...line,
            translatedText: res.success && res.result ? res.result.translatedText : line.text,
          });
        } catch {
          translated.push({ ...line, translatedText: line.text });
        }
        if (cancelled) return;
      }

      setTranslatedLines(translated);
      setStage('done');
    }

    process();
    return () => { cancelled = true; };
  }, [canvas]);

  // Tính scale để vẽ overlay khớp với ảnh hiển thị
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setScale(w / canvas.width);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvas, imageUrl]);

  return (
    <div className="v2-fade-up space-y-3">
      {/* Ảnh với bản dịch đè trực tiếp */}
      <div className="relative rounded-3xl overflow-hidden v2-card">
        <div ref={containerRef} className="relative w-full">
          {imageUrl && (
            <img src={imageUrl} alt="Ảnh vừa chụp" className="w-full h-auto block" />
          )}

          {/* Overlay bản dịch tiếng Việt đè lên từng dòng */}
          {stage === 'done' && translatedLines.map((line, idx) => {
            const { x0, y0, x1, y1 } = line.bbox;
            const left = x0 * scale;
            const top = y0 * scale;
            const width = (x1 - x0) * scale;
            const height = (y1 - y0) * scale;
            // Cỡ chữ theo chiều cao dòng
            const fontSize = Math.max(10, Math.min(18, height * 0.55));
            return (
              <div
                key={idx}
                className="absolute rounded-md px-1.5 py-0.5 overflow-hidden"
                style={{
                  left, top, width,
                  minHeight: height,
                  backgroundColor: 'rgba(0, 0, 0, 0.78)',
                  border: '1px solid rgba(236, 72, 153, 0.5)',
                }}
              >
                <p
                  className="text-white font-medium leading-tight"
                  style={{ fontSize }}
                >
                  {line.translatedText}
                </p>
              </div>
            );
          })}

          {/* Loading overlay */}
          {(stage === 'ocr' || stage === 'translating') && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <p className="text-white text-sm font-medium px-6 text-center">{statusText}</p>
            </div>
          )}
        </div>

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lỗi */}
      {stage === 'error' && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            <p className="text-[12px] v2-text-muted mt-1">
              Mẹo: chụp gần biển hiệu hơn, đảm bảo đủ sáng và giữ máy chắc tay.
            </p>
          </div>
        </div>
      )}

      {/* Danh sách dòng đã dịch (dự phòng nếu overlay khó đọc) */}
      {stage === 'done' && translatedLines.length > 0 && (
        <div className="rounded-3xl v2-card p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Languages className="w-4 h-4 v2-accent-text" />
            <span className="text-[13px] font-bold v2-text">
              Đã dịch {translatedLines.length} dòng
            </span>
          </div>
          {translatedLines.map((line, idx) => (
            <div key={idx} className="py-2 border-b v2-divider last:border-0">
              <p className="text-[12px] v2-text-muted">{line.text}</p>
              <p className="text-[14px] font-semibold v2-text mt-0.5">{line.translatedText}</p>
            </div>
          ))}
        </div>
      )}

      {/* Nút chụp lại */}
      <button
        onClick={onRetake}
        className="w-full py-3.5 rounded-2xl v2-accent-soft v2-accent-text text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Chụp ảnh khác</span>
      </button>
    </div>
  );
};

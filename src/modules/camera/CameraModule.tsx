import React, { useState } from 'react';
import { Camera, Sparkles, ShieldCheck, Languages, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { CameraModuleProps, OcrRecognitionResult } from './types';
import { CameraViewfinder } from './components/CameraViewfinder';
import { ImageTranslationOverlay } from './components/ImageTranslationOverlay';
import { realOcrService } from './services/realOcrService';
import { SampleImageSelector } from './components/SampleImageSelector';
import { OcrResultView } from './components/OcrResultView';
import { ocrService } from './services/ocrService';
import { translationService } from '../translator/services/translationService';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';

export const CameraModule: React.FC<CameraModuleProps> = ({
  onSendToTranslate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'samples'>('camera');
  const [ocrResult, setOcrResult] = useState<OcrRecognitionResult | null>(null);
  const [capturedCanvas, setCapturedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Khởi động OCR thật khi vào tab camera (tải dữ liệu tiếng Nga)
  React.useEffect(() => {
    if (activeTab === 'camera') {
      realOcrService.warmup();
    }
  }, [activeTab]);

  // Quick inline translation state when viewing OCR result
  const [inlineTranslation, setInlineTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Handle capture from camera viewfinder — dịch trực tiếp trên ảnh
  const handleCaptureCanvas = async (canvas: HTMLCanvasElement) => {
    setErrorMessage(null);
    setInlineTranslation(null);
    setOcrResult(null);
    // Mở ngay màn hình dịch trên ảnh (OCR + dịch chạy bên trong)
    setCapturedCanvas(canvas);
  };

  // Handle selecting a preset sample
  const handleSelectSample = (sampleId: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setInlineTranslation(null);

    try {
      const result = ocrService.recognizeFromSample(sampleId);
      const validation = ocrService.validateResult(result);

      if (!validation.isValid) {
        setErrorMessage(validation.reason || 'Không đọc được mẫu biển này.');
        setOcrResult(null);
      } else {
        setOcrResult(result);
        translateRussianText(result.rawText);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi khi mở mẫu biển.');
      setOcrResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to translate extracted Russian text
  const translateRussianText = async (text: string) => {
    if (!text || text.trim().length === 0) return;
    setIsTranslating(true);

    try {
      const resp = await translationService.translate({
        text,
        sourceLang: 'ru',
        targetLang: 'vi'
      });
      if (resp.success && resp.result) {
        setInlineTranslation(resp.result.translatedText);
      }
    } catch {
      // Inline translation error handled silently, full translation still accessible
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setOcrResult(null);
    setCapturedCanvas(null);
    setErrorMessage(null);
    setInlineTranslation(null);
  };

  const handleSendToTranslationTab = (text: string) => {
    if (onSendToTranslate) {
      onSendToTranslate(text);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-12">
      {/* Header with Navigation */}
      <div className="v2-fade-up flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1.5 v2-text-muted hover:opacity-70"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <SectionHeader
            title="Quét biển báo"
            subtitle="Chụp ảnh biển hiệu, vé tàu, thực đơn để dịch tiếng Nga sang tiếng Việt"
          />
        </div>
      </div>

      {/* Tab bar: Camera vs Sample Signs */}
      <div className="v2-fade-up v2-fade-up-1 flex p-1.5 v2-card rounded-2xl">
        <button
          onClick={() => {
            setActiveTab('camera');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            activeTab === 'camera'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
              : 'v2-text-muted hover:opacity-70'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Chụp ảnh</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('samples');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            activeTab === 'samples'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
              : 'v2-text-muted hover:opacity-70'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Biển báo mẫu</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="v2-fade-up p-4 v2-accent-soft border border-red-500/20 rounded-2xl text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 v2-accent-text mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="text-red-300 underline font-semibold mt-1 hover:opacity-70 block"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Main View Area — dịch trực tiếp trên ảnh sau khi chụp */}
      {capturedCanvas ? (
        <ImageTranslationOverlay
          canvas={capturedCanvas}
          onClose={handleReset}
          onRetake={handleReset}
        />
      ) : ocrResult ? (
        <div className="space-y-4">
          <OcrResultView
            result={ocrResult}
            onSendToTranslate={handleSendToTranslationTab}
            onReset={handleReset}
          />

          {/* Quick Translation Box Preview */}
          <div className="v2-fade-up v2-fade-up-2 rounded-3xl v2-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold v2-text-muted flex items-center gap-1.5">
                <Languages className="w-4 h-4 v2-accent-text" />
                Nghĩa tiếng Việt:
              </span>
              {isTranslating && (
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Đang dịch...
                </span>
              )}
            </div>

            {inlineTranslation ? (
              <p className="text-sm font-medium text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {inlineTranslation}
              </p>
            ) : (
              <p className="text-xs v2-text-muted italic">
                {isTranslating ? 'Đang chuẩn bị bản dịch...' : 'Bấm nút "Dịch sang tiếng Việt" để xem chi tiết.'}
              </p>
            )}
          </div>
        </div>
      ) : activeTab === 'camera' ? (
        <div className="space-y-3">
          <CameraViewfinder
            onCaptureCanvas={handleCaptureCanvas}
            onSelectSampleTab={() => setActiveTab('samples')}
            isProcessing={isProcessing}
          />

          {/* Privacy Badge */}
          <div className="v2-fade-up v2-fade-up-2 flex items-center justify-center text-[11px] v2-text-muted px-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ảnh chỉ xử lý trên máy bạn, không tải lên mạng
            </span>
          </div>
        </div>
      ) : (
        <SampleImageSelector onSelectSample={handleSelectSample} />
      )}
    </div>
  );
};

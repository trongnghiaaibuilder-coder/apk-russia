import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, AlertCircle, RefreshCw, ScanLine } from 'lucide-react';
import { captureNativePhoto, getNativeCamera } from '../services/cameraService';
import { CameraStatus } from '../types';
import { Button } from '../../../components/ui/Button';

export interface CameraViewfinderProps {
  onCaptureCanvas: (canvas: HTMLCanvasElement) => void;
  onSelectSampleTab: () => void;
  isProcessing: boolean;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onCaptureCanvas,
  onSelectSampleTab,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasNativeCamera = getNativeCamera() !== null;

  const handleNativeCapture = async () => {
    if (isProcessing) return;
    setCameraStatus('capturing');
    setErrorMessage(null);
    try {
      const canvas = await captureNativePhoto();
      onCaptureCanvas(canvas);
    } catch (err: any) {
      const msg = err?.message || 'Không chụp được ảnh.';
      // "Đã hủy" is not an error worth showing
      if (!msg.includes('hủy')) {
        setErrorMessage(msg);
      }
    } finally {
      setCameraStatus('idle');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { cameraService } = await import('../services/cameraService');
      const canvas = await cameraService.loadImageFileToCanvas(file);
      onCaptureCanvas(canvas);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc tệp ảnh.');
    }
    // reset input so the same file can be picked again
    e.target.value = '';
  };

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Main capture card */}
      <div className="v2-fade-up relative overflow-hidden rounded-3xl v2-card p-6 text-center">
        <div className="mx-auto w-20 h-20 rounded-3xl v2-hero flex items-center justify-center mb-4 shadow-xl">
          <ScanLine className="w-10 h-10 v2-text" />
        </div>
        <h3 className="text-lg font-bold v2-text mb-2">Quét biển báo tiếng Nga</h3>
        <p className="text-[13px] v2-text-muted leading-relaxed mb-5 max-w-[280px] mx-auto">
          Chụp ảnh biển hiệu, bảng chỉ dẫn hoặc thực đơn — app sẽ đọc chữ Nga và dịch sang tiếng Việt.
        </p>

        {hasNativeCamera ? (
          <button
            onClick={handleNativeCapture}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl v2-accent-bg font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-60 shadow-xl"
          >
            {isProcessing || cameraStatus === 'capturing' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Chụp ảnh ngay</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl v2-accent-bg font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-60 shadow-xl"
          >
            <Camera className="w-5 h-5" />
            <span>Chụp / Chọn ảnh</span>
          </button>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 rounded-2xl v2-accent-soft v2-accent-text text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Chọn ảnh có sẵn</span>
          </button>
          <button
            onClick={onSelectSampleTab}
            className="flex-1 py-3 rounded-2xl v2-accent-soft v2-accent-text text-[13px] font-semibold active:scale-[0.98] transition-transform cursor-pointer"
          >
            Biển báo mẫu
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl v2-accent-soft border border-red-500/20 text-red-500 text-[12px] flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="v2-fade-up v2-fade-up-1 mt-3 rounded-2xl v2-accent-soft p-3.5">
        <p className="text-[12px] v2-text-muted leading-relaxed">
          💡 <strong className="v2-text">Mẹo:</strong> Giữ máy chắc tay, đảm bảo chữ Nga rõ nét và đủ sáng để app đọc chính xác nhất.
        </p>
      </div>
    </div>
  );
};

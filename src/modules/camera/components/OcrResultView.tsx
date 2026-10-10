import React, { useState } from 'react';
import {
  Check,
  Copy,
  Languages,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { OcrRecognitionResult } from '../types';
import { Button } from '../../../components/ui/Button';

export interface OcrResultViewProps {
  result: OcrRecognitionResult;
  onSendToTranslate: (text: string) => void;
  onReset: () => void;
}

export const OcrResultView: React.FC<OcrResultViewProps> = ({
  result,
  onSendToTranslate,
  onReset
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result.rawText) return;
    navigator.clipboard.writeText(result.rawText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const confidencePercent = Math.round((result.confidence || 0) * 100);

  return (
    <div className="v2-fade-up w-full rounded-3xl v2-card p-5 shadow-xl flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b v2-divider pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold v2-text">Đã đọc được chữ</h3>
            <p className="text-xs v2-text-muted">{result.lines.length} dòng chữ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full font-medium v2-accent-soft text-red-300 border border-red-500/20">
            {result.detectedLanguage === 'ru' ? 'Tiếng Nga' : 'Ngôn ngữ khác'}
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Chắc chắn: {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Warning if any */}
      {result.warning && (
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{result.warning}</span>
        </div>
      )}

      {/* Extracted Text Box */}
      <div className="relative v2-bg/80 rounded-2xl p-4 border v2-divider">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium v2-text-muted flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 v2-text-muted" />
            Chữ trong ảnh:
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs v2-text-muted hover:opacity-70 px-2 py-1 rounded-lg v2-accent-soft transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Chép</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-sm font-sans font-medium v2-text whitespace-pre-wrap leading-relaxed tracking-wide">
          {result.rawText}
        </pre>
      </div>

      {/* Detailed Lines Breakdown */}
      {result.lines.length > 1 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          <p className="text-[11px] font-medium v2-text-muted">Từng dòng:</p>
          {result.lines.map((line, idx) => (
            <div
              key={line.id || idx}
              className="flex items-center justify-between p-2 rounded-xl v2-card text-xs border border-white/5"
            >
              <span className="v2-text font-medium truncate max-w-[80%]">{line.text}</span>
              <span className="text-[10px] v2-text-muted">
                {Math.round(line.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t v2-divider">
        <Button
          variant="primary"
          onClick={() => onSendToTranslate(result.rawText)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30"
        >
          <Languages className="w-4 h-4" />
          <span>Dịch sang tiếng Việt</span>
        </Button>

        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Quét ảnh khác</span>
        </Button>
      </div>
    </div>
  );
};

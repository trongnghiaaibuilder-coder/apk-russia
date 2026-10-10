import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { TranslationResult } from '../types';

interface TranslationResultCardProps {
  result: TranslationResult | null;
  error?: string | null;
}

export const TranslationResultCard: React.FC<TranslationResultCardProps> = ({
  result,
  error,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const handleCopy = async () => {
    if (!result?.translatedText) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(result.translatedText);
        setCopied(true);
        setCopyFeedback('Đã sao chép vào bộ nhớ tạm!');
        setTimeout(() => {
          setCopied(false);
          setCopyFeedback(null);
        }, 2500);
      } else {
        setCopyFeedback('Trình duyệt không hỗ trợ sao chép tự động.');
        setTimeout(() => setCopyFeedback(null), 3000);
      }
    } catch {
      setCopyFeedback('Không thể sao chép.');
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  if (error) {
    return (
      <Card variant="default" padding="md" className="border-amber-500/30 bg-amber-950/10 space-y-2 animate-in fade-in">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-amber-300">
              Thông báo dịch thuật
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card variant="accent" padding="md" className="space-y-3 border-rose-500/30 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white">
            Kết quả dịch
          </span>
          {result.isFallback ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20 font-medium">
              Demo có sẵn
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-medium">
              API ngoại vi
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
          }`}
          aria-label="Sao chép kết quả"
          title="Sao chép kết quả"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      <div className="py-1">
        <p className="text-base sm:text-lg font-bold text-white leading-relaxed select-text font-sans">
          {result.translatedText}
        </p>
      </div>

      {copyFeedback && (
        <p className="text-[11px] text-emerald-400 italic">
          {copyFeedback}
        </p>
      )}

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Gốc: “{result.sourceText}”</span>
        <span className="text-slate-500 font-mono text-[10px]">
          {new Date(result.timestamp).toLocaleTimeString('vi-VN')}
        </span>
      </div>
    </Card>
  );
};

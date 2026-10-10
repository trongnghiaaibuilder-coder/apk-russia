import React from 'react';
import { Send, X, Mic, Camera, Sparkles } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { SupportedLanguage } from '../types';
import { MAX_TRANSLATION_CHARS } from '../services/translationService';

interface TranslationInputProps {
  text: string;
  sourceLang: SupportedLanguage;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isLoading: boolean;
  onOpenVoice?: () => void;
  onOpenCamera?: () => void;
  onSelectSuggestion?: (phrase: string) => void;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({
  text,
  sourceLang,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  onOpenVoice,
  onOpenCamera,
  onSelectSuggestion,
}) => {
  const charCount = text.length;
  const isOverLimit = charCount > MAX_TRANSLATION_CHARS;

  const suggestions =
    sourceLang === 'vi'
      ? ['Xin chào', 'Cảm ơn', 'Xin lỗi', 'Bao nhiêu tiền?', 'Nhà vệ sinh ở đâu?']
      : ['Здравствуйте', 'Спасибо', 'Извините', 'Сколько это стоит?', 'Где находится туалет?'];

  const placeholder =
    sourceLang === 'vi'
      ? 'Nhập văn bản tiếng Việt để dịch sang tiếng Nga...'
      : 'Введите текст на русском для перевода на вьетнамский...';

  return (
    <div className="space-y-2">
      <Card variant="default" padding="sm" className="space-y-2 border-slate-800">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            disabled={isLoading}
            className="w-full bg-transparent border-0 resize-none text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0 p-2 font-sans"
          />
          {text && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Xóa nội dung"
              aria-label="Xóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-1">
          <div className="flex items-center gap-1.5">
            {onOpenVoice && (
              <button
                type="button"
                onClick={onOpenVoice}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Khung giọng nói"
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Giọng nói</span>
              </button>
            )}
            {onOpenCamera && (
              <button
                type="button"
                onClick={onOpenCamera}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Khung máy ảnh"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Máy ảnh</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-mono tabular-nums ${
                isOverLimit ? 'text-red-400 font-bold' : 'text-slate-400'
              }`}
            >
              {charCount} / {MAX_TRANSLATION_CHARS}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmit}
              disabled={!text.trim() || isOverLimit || isLoading}
              isLoading={isLoading}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="min-h-[40px] px-4 font-semibold"
            >
              Dịch
            </Button>
          </div>
        </div>

        {isOverLimit && (
          <p className="text-[11px] text-red-400 px-1">
            Vượt quá giới hạn {MAX_TRANSLATION_CHARS} ký tự. Vui lòng rút ngắn nội dung.
          </p>
        )}
      </Card>

      {onSelectSuggestion && (
        <div className="space-y-1 px-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>Mẫu thử nghiệm nhanh (Demo P3):</span>
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {suggestions.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(phrase)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

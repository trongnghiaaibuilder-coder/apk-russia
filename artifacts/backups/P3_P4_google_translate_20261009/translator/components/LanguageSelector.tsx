import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  onSwap: () => void;
  onSelectSource?: (lang: SupportedLanguage) => void;
  onSelectTarget?: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSwap,
  disabled = false,
}) => {
  const getLangMeta = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'vi':
        return { flag: '🇻🇳', name: 'Tiếng Việt', code: 'VI' };
      case 'ru':
        return { flag: '🇷🇺', name: 'Русский', code: 'RU' };
      default:
        return { flag: '🌐', name: lang, code: lang };
    }
  };

  const source = getLangMeta(sourceLang);
  const target = getLangMeta(targetLang);

  return (
    <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <span className="text-xl select-none" role="img" aria-label={source.name}>
          {source.flag}
        </span>
        <div className="text-left">
          <span className="text-xs font-semibold text-white block">
            {source.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            Nguồn ({source.code})
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSwap}
        disabled={disabled}
        className="w-11 h-11 mx-2 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 border border-slate-700/60"
        aria-label="Đổi chiều ngôn ngữ"
        title="Đổi chiều dịch (Tiếng Việt ↔ Tiếng Nga)"
      >
        <ArrowLeftRight className="w-4 h-4 text-rose-400" />
      </button>

      <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <span className="text-xl select-none" role="img" aria-label={target.name}>
          {target.flag}
        </span>
        <div className="text-left">
          <span className="text-xs font-semibold text-white block">
            {target.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block">
            Đích ({target.code})
          </span>
        </div>
      </div>
    </div>
  );
};

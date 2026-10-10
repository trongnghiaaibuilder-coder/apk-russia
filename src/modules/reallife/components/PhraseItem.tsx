import React, { useState } from 'react';
import { Volume2, Copy, Check, AlertCircle } from 'lucide-react';
import { RealLifePhrase } from '../types';
import { realLifeService } from '../services/realLifeService';

export interface PhraseItemProps {
  phrase: RealLifePhrase;
}

export const PhraseItem: React.FC<PhraseItemProps> = ({ phrase }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSpeak = async () => {
    setIsPlaying(true);
    await realLifeService.speakPhrase(phrase);
    setIsPlaying(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${phrase.russian}\n(${phrase.vietnamese})`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className={`v2-fade-up p-4 rounded-2xl border flex flex-col gap-2 transition ${
      phrase.importance === 'critical'
        ? 'bg-red-950/20 border-red-800/60'
        : 'v2-card'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {/* Russian text */}
          <h4 className="text-sm font-semibold v2-text tracking-wide">
            {phrase.russian}
          </h4>

          {/* Phonetic Pronunciation */}
          <p className="text-xs text-red-300/90 font-mono mt-0.5">
            🗣 {phrase.pronunciation}
          </p>

          {/* Vietnamese meaning */}
          <p className="text-xs v2-text-muted mt-1">
            {phrase.vietnamese}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSpeak}
            title="Nghe phát âm tiếng Nga"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              isPlaying
                ? 'v2-accent-bg animate-pulse'
                : 'bg-slate-800 v2-text-muted hover:opacity-70 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            title="Sao chép câu nói"
            className="w-8 h-8 rounded-lg bg-slate-800 v2-text-muted hover:opacity-70 hover:bg-slate-700 flex items-center justify-center transition"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {phrase.importance === 'critical' && (
        <div className="flex items-center gap-1 text-[11px] v2-accent-text font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>Mẫu câu khẩn cấp ưu tiên ghi nhớ</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Volume2 } from 'lucide-react';
import { ConversationMessage as MessageType } from '../types';
import { transliterateRussian, containsCyrillic } from '../../../services/transliterationService';

interface ConversationMessageProps {
  message: MessageType;
  onReplay: (msg: MessageType) => void;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({
  message,
  onReplay,
}) => {
  const isUser = message.speaker === 'user';

  return (
    <div
      className={`flex flex-col space-y-1.5 max-w-[88%] ${
        isUser ? 'ml-auto items-end' : 'mr-auto items-start'
      }`}
    >
      {/* Speaker header */}
      <div className="flex items-center gap-1.5 text-[11px] v2-text-muted px-1">
        {isUser ? (
          <>
            <span className="v2-accent-text font-semibold">Anh nói (Bạn)</span>
            <span>🇻🇳</span>
          </>
        ) : (
          <>
            <span className="text-sky-400 font-semibold">Người Nga nói</span>
            <span>🇷🇺</span>
          </>
        )}
        <span className="v2-text-faint">•</span>
        <span className="font-mono text-[10px] v2-text-faint">
          {new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(
            new Date(message.timestamp)
          )}
        </span>
        {message.isOnline ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-medium">
            Google Dịch
          </span>
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full v2-accent-soft v2-text-muted font-medium">
            Kho câu
          </span>
        )}
      </div>

      {/* Bubble card */}
      <div
        className={`p-3.5 rounded-3xl border text-sm shadow-sm space-y-2 select-text ${
          isUser
            ? 'bg-rose-950/30 border-rose-500/30 rounded-tr-md v2-text'
            : 'v2-bg-soft v2-divider rounded-tl-md v2-text'
        }`}
      >
        {/* Source Text */}
        <p className="text-xs v2-text-muted italic">
          “{message.sourceText}”
        </p>

        {/* Translated Text (Prominent) */}
        <div className="pt-1 border-t v2-divider/80 flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm sm:text-base font-bold v2-text leading-relaxed font-sans">
              {message.translatedText}
            </p>
            {containsCyrillic(message.translatedText) && (
              <p className="mt-1 text-xs v2-text-muted italic">
                📖 {transliterateRussian(message.translatedText)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onReplay(message)}
            className="w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-750 v2-text-muted hover:opacity-70 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all border border-slate-700/60"
            title="Nghe lại phát âm"
            aria-label="Phát âm thanh"
          >
            <Volume2 className="w-3.5 h-3.5 v2-accent-text" />
          </button>
        </div>
      </div>
    </div>
  );
};

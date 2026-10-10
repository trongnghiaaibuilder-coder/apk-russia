import React from 'react';
import { Volume2 } from 'lucide-react';
import { ConversationMessage as MessageType } from '../types';

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
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
        {isUser ? (
          <>
            <span className="text-rose-400 font-semibold">Anh nói (Bạn)</span>
            <span>🇻🇳</span>
          </>
        ) : (
          <>
            <span className="text-sky-400 font-semibold">Người Nga nói</span>
            <span>🇷🇺</span>
          </>
        )}
        <span className="text-slate-600">•</span>
        <span className="font-mono text-[10px] text-slate-500">
          {new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(
            new Date(message.timestamp)
          )}
        </span>
      </div>

      {/* Bubble card */}
      <div
        className={`p-3.5 rounded-2xl border text-sm shadow-sm space-y-2 select-text ${
          isUser
            ? 'bg-rose-950/30 border-rose-500/30 rounded-tr-sm text-slate-100'
            : 'bg-slate-900 border-slate-800 rounded-tl-sm text-slate-100'
        }`}
      >
        {/* Source Text */}
        <p className="text-xs text-slate-300 italic">
          “{message.sourceText}”
        </p>

        {/* Translated Text (Prominent) */}
        <div className="pt-1 border-t border-slate-800/80 flex items-start justify-between gap-3">
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed font-sans">
            {message.translatedText}
          </p>
          <button
            type="button"
            onClick={() => onReplay(message)}
            className="w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all border border-slate-700/60"
            title="Nghe lại phát âm (TTS)"
            aria-label="Phát âm thanh"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

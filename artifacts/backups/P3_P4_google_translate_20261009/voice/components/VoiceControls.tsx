import React from 'react';
import { Mic, Square, RotateCcw, Volume2 } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceControlsProps {
  state: VoiceState;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
  onReplay?: () => void;
  disabled?: boolean;
  activeSpeakerLabel?: string;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  state,
  onStart,
  onStop,
  onCancel,
  onReplay,
  disabled = false,
  activeSpeakerLabel,
}) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing' || state === 'translating';
  const isPlaying = state === 'playing';

  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-3">
      {activeSpeakerLabel && (
        <p className="text-xs font-medium text-rose-300 animate-pulse">
          {activeSpeakerLabel}
        </p>
      )}

      {/* Main Big Microphone Button */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Ripple Circle when listening */}
        {isListening && (
          <>
            <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
            <div className="absolute w-28 h-28 rounded-full border border-rose-500/30 animate-pulse" />
          </>
        )}

        <button
          type="button"
          onClick={isListening ? onStop : onStart}
          disabled={disabled || isProcessing}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer select-none active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/40 disabled:opacity-50 disabled:pointer-events-none ${
            isListening
              ? 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-rose-500/40'
              : isPlaying
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-950/50'
          }`}
          aria-label={isListening ? 'Dừng thu âm' : 'Bắt đầu nói'}
          title={isListening ? 'Chạm để dừng thu âm' : 'Chạm để nói'}
        >
          {isListening ? (
            <Square className="w-8 h-8 fill-current" />
          ) : isPlaying ? (
            <Volume2 className="w-8 h-8 animate-bounce" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </button>
      </div>

      <p className="text-xs font-medium text-slate-300">
        {isListening
          ? 'Chạm để dừng & dịch'
          : isProcessing
          ? 'Đang xử lý...'
          : isPlaying
          ? 'Đang phát âm thanh...'
          : 'Chạm vào micro để nói'}
      </p>

      {/* Secondary Controls: Cancel, Retry, Replay */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {(isListening || isProcessing) && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            aria-label="Hủy thu âm"
          >
            <span>Hủy</span>
          </button>
        )}
        {state === 'error' && (
          <button
            type="button"
            onClick={onStart}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        )}
        {onReplay && !isListening && (
          <button
            type="button"
            onClick={onReplay}
            disabled={isPlaying}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700/60"
            title="Nghe lại bản dịch"
          >
            <Volume2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Nghe lại</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PRONUNCIATION_GUIDES } from '../data/pronunciation';
import { textToSpeechService } from '../../voice/services/textToSpeechService';

export const PronunciationSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PRONUNCIATION_GUIDES[0].id);
  const [showAudioNotice, setShowAudioNotice] = useState(false);

  const currentGuide = PRONUNCIATION_GUIDES.find((g) => g.id === selectedId) || PRONUNCIATION_GUIDES[0];

  const handleSpeak = (text: string) => {
    textToSpeechService.speak(text, 'ru', undefined, undefined, () => setShowAudioNotice(true));
  };

  return (
    <div className="space-y-4 v2-fade-up">
      <div className="p-3.5 rounded-3xl v2-card text-xs v2-text-muted space-y-1">
        <div className="flex items-center gap-2 v2-accent-text font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Cẩm nang phát âm tiếng Nga cho người Việt</span>
        </div>
        <p className="v2-text-muted leading-relaxed text-[11px]">
          Tiếng Nga có âm thanh phong phú với quy tắc cứng/mềm. Dưới đây là 10 hướng dẫn khẩu hình chuẩn xác nhất.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PRONUNCIATION_GUIDES.map((guide) => {
          const isSelected = guide.id === selectedId;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedId(guide.id)}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'v2-accent-bg font-semibold shadow-sm shadow-rose-950/40'
                  : 'v2-bg-soft border v2-divider v2-text-muted hover:bg-slate-800'
              }`}
            >
              {guide.soundRu}
            </button>
          );
        })}
      </div>

      <Card variant="accent" padding="md" className="space-y-4 v2-divider">
        <div className="flex items-center justify-between border-b v2-divider pb-3">
          <div>
            <h3 className="text-base font-bold v2-text flex items-center gap-2">
              <span className="v2-accent-text text-lg font-mono">
                {currentGuide.soundRu}
              </span>
              <span>— {currentGuide.name}</span>
            </h3>
            <span className="text-[11px] v2-text-muted capitalize">
              Phân loại: {currentGuide.category.replace('_', ' ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSpeak(currentGuide.examples[0]?.ru || currentGuide.soundRu)}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 v2-text-muted hover:opacity-70 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
            title="Nghe phát âm chuẩn"
            aria-label="Thông báo âm thanh"
          >
            <Volume2 className="w-5 h-5 v2-accent-text" />
          </button>
        </div>

        {showAudioNotice && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-left flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Quy tắc chuẩn:</p>
              <p className="v2-text-muted text-[11px] mt-0.5 leading-relaxed">
                Ứng dụng cung cấp phiên âm tiếng Việt gần đúng. Giọng nói STT/TTS có trong tab Voice.
              </p>
            </div>
            <button
              onClick={() => setShowAudioNotice(false)}
              className="v2-text-muted hover:opacity-70 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="p-3 rounded-xl v2-bg/80 border v2-divider">
            <h4 className="text-xs font-semibold v2-accent-text uppercase tracking-wider mb-1">
              Mô tả âm
            </h4>
            <p className="text-xs v2-text-muted leading-relaxed">
              {currentGuide.descriptionVi}
            </p>
          </div>
          <div className="p-3 rounded-xl v2-bg/80 border v2-divider">
            <h4 className="text-xs font-semibold v2-accent-text uppercase tracking-wider mb-1">
              Khẩu hình & Cách đọc cho người Việt
            </h4>
            <p className="text-xs v2-text leading-relaxed font-sans">
              {currentGuide.howToPronounceVi}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-semibold v2-text-muted uppercase tracking-wider">
            Các từ ví dụ (Chạm để nghe)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentGuide.examples.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(ex.ru)}
                className="p-2.5 rounded-xl v2-bg-soft hover:bg-slate-800 border v2-divider flex items-center justify-between gap-2 cursor-pointer transition-colors"
              >
                <div>
                  <span className="text-sm font-bold v2-text block">
                    {ex.ru}
                  </span>
                  <span className="text-xs v2-accent-text/90 block font-mono">
                    [{ex.pronunciation}]
                  </span>
                  <span className="text-xs v2-text-muted mt-1 block">
                    {ex.vi}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(ex.ru);
                  }}
                  className="min-h-[38px] min-w-[38px] rounded-lg bg-slate-800 hover:opacity-80 v2-accent-text hover:opacity-70 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title={`Phát âm ${ex.ru}`}
                  aria-label={`Phát âm ${ex.ru}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { PRONUNCIATION_GUIDES } from '../data/pronunciation';

export const PronunciationSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PRONUNCIATION_GUIDES[0].id);
  const [showAudioNotice, setShowAudioNotice] = useState(false);

  const currentGuide = PRONUNCIATION_GUIDES.find((g) => g.id === selectedId) || PRONUNCIATION_GUIDES[0];

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      setShowAudioNotice(true);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Cẩm nang phát âm tiếng Nga cho người Việt</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
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
                  ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-950/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {guide.soundRu}
            </button>
          );
        })}
      </div>

      <Card variant="accent" padding="md" className="space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-rose-400 text-lg font-mono">
                {currentGuide.soundRu}
              </span>
              <span>— {currentGuide.name}</span>
            </h3>
            <span className="text-[11px] text-slate-400 capitalize">
              Phân loại: {currentGuide.category.replace('_', ' ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSpeak(currentGuide.examples[0]?.ru || currentGuide.soundRu)}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
            title="Nghe phát âm chuẩn"
            aria-label="Thông báo âm thanh"
          >
            <Volume2 className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        {showAudioNotice && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-left flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Quy tắc chuẩn:</p>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Ứng dụng cung cấp phiên âm tiếng Việt gần đúng. Giọng nói STT/TTS có trong tab Voice.
              </p>
            </div>
            <button
              onClick={() => setShowAudioNotice(false)}
              className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-1">
              Mô tả âm
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentGuide.descriptionVi}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-1">
              Khẩu hình & Cách đọc cho người Việt
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {currentGuide.howToPronounceVi}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Các từ ví dụ
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentGuide.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-bold text-white block">
                    {ex.ru}
                  </span>
                  <span className="text-xs text-rose-300/90 block font-mono">
                    [{ex.pronunciation}]
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  {ex.vi}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

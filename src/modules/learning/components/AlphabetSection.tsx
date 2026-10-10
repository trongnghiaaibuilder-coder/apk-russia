import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Info } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { textToSpeechService } from '../../voice/services/textToSpeechService';
import { RUSSIAN_ALPHABET } from '../data/alphabet';
import { LetterType } from '../types';

export const AlphabetSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState<'all' | LetterType>('all');
  const [showAudioNotice, setShowAudioNotice] = useState(false);

  const filteredLetters = RUSSIAN_ALPHABET.filter((l) => {
    if (filterType === 'all') return true;
    return l.type === filterType;
  });

  const currentLetter = filteredLetters[selectedIndex] || filteredLetters[0] || RUSSIAN_ALPHABET[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredLetters.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < filteredLetters.length - 1 ? prev + 1 : 0));
  };

  const handleSpeak = (text: string) => {
    textToSpeechService.speak(text, 'ru', undefined, undefined, () => setShowAudioNotice(true));
  };

  return (
    <div className="space-y-4 v2-fade-up">
      <div className="flex items-center gap-1.5 p-1 v2-bg-soft border v2-divider rounded-xl overflow-x-auto">
        <button
          onClick={() => { setFilterType('all'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'all' ? 'bg-slate-800 v2-text font-semibold shadow-sm' : 'v2-text-muted hover:opacity-70'
          }`}
        >
          Tất cả ({RUSSIAN_ALPHABET.length})
        </button>
        <button
          onClick={() => { setFilterType('vowel'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'vowel' ? 'bg-slate-800 v2-text font-semibold shadow-sm' : 'v2-text-muted hover:opacity-70'
          }`}
        >
          Nguyên âm (10)
        </button>
        <button
          onClick={() => { setFilterType('consonant'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'consonant' ? 'bg-slate-800 v2-text font-semibold shadow-sm' : 'v2-text-muted hover:opacity-70'
          }`}
        >
          Phụ âm (21)
        </button>
        <button
          onClick={() => { setFilterType('sign'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'sign' ? 'bg-slate-800 v2-text font-semibold shadow-sm' : 'v2-text-muted hover:opacity-70'
          }`}
        >
          Dấu (2)
        </button>
      </div>

      <Card variant="accent" padding="lg" className="border-rose-500/30 text-center space-y-4">
        <div className="flex items-center justify-between text-xs v2-text-muted border-b v2-divider/80 pb-2">
          <span>Chữ cái Cyrillic</span>
          <span className="font-mono tabular-nums">
            {selectedIndex + 1} / {filteredLetters.length}
          </span>
          <span className="capitalize v2-accent-text font-medium">
            {currentLetter.type === 'vowel' ? 'Nguyên âm' : currentLetter.type === 'consonant' ? 'Phụ âm' : 'Ký hiệu'}
          </span>
        </div>

        <div className="py-2">
          <div className="text-6xl sm:text-7xl font-bold v2-text tracking-wider flex items-center justify-center gap-3">
            <span>{currentLetter.upper}</span>
            <span className="v2-accent-text text-5xl sm:text-6xl">{currentLetter.lower}</span>
          </div>
          <p className="text-sm font-mono v2-text-muted mt-2">
            La-tinh: {currentLetter.latin}
          </p>
        </div>

        <div className="p-3 rounded-xl v2-bg/70 border v2-divider text-left space-y-1">
          <p className="text-[11px] font-semibold v2-accent-text uppercase tracking-wider">
            Hướng dẫn phát âm (Gần đúng cho người Việt)
          </p>
          <p className="text-xs sm:text-sm v2-text leading-relaxed">
            {currentLetter.vietnamesePronunciation}
          </p>
        </div>

        <div className="p-3 rounded-xl v2-bg/70 border v2-divider text-left flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] v2-text-muted uppercase tracking-wider block">
              Từ ví dụ
            </span>
            <span className="text-base font-bold v2-text">
              {currentLetter.exampleWordRu}
            </span>
            <span className="text-xs v2-accent-text/90 block">
              [{currentLetter.exampleWordPronunciation}]
            </span>
            <span className="text-xs v2-text-muted block mt-0.5">
              Nghĩa: {currentLetter.exampleWordMeaningVi}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSpeak(currentLetter.exampleWordRu)}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 v2-text-muted hover:opacity-70 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
            aria-label="Nghe phát âm"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5 v2-accent-text" />
          </button>
        </div>

        {showAudioNotice && (
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-left flex items-start gap-2 text-xs v2-fade-up">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Lưu ý âm thanh:</p>
              <p className="v2-text-muted text-[11px] mt-0.5 leading-relaxed">
                Trình duyệt chưa hỗ trợ Text-to-Speech tự động. Hướng dẫn phiên âm tiếng Việt ở trên giúp phát âm chính xác.
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

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrev}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="flex-1 min-h-[48px]"
          >
            Chữ trước
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            rightIcon={<ChevronRight className="w-4 h-4" />}
            className="flex-1 min-h-[48px]"
          >
            Chữ tiếp theo
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        <p className="text-xs font-semibold v2-text-muted uppercase tracking-wider">
          Bảng 33 chữ cái nhanh
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
          {filteredLetters.map((l, index) => {
            const isSelected = currentLetter.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setSelectedIndex(index)}
                className={`h-11 flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'v2-accent-bg scale-105 shadow-sm shadow-rose-950/50'
                    : 'v2-bg-soft border v2-divider v2-text-muted hover:bg-slate-800 hover:opacity-70'
                }`}
              >
                <span>{l.upper}</span>
                <span className="text-[10px] opacity-75 font-normal">{l.lower}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

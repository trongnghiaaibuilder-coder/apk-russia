import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Info } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
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
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => { setFilterType('all'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'all' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Tất cả ({RUSSIAN_ALPHABET.length})
        </button>
        <button
          onClick={() => { setFilterType('vowel'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'vowel' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Nguyên âm (10)
        </button>
        <button
          onClick={() => { setFilterType('consonant'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'consonant' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Phụ âm (21)
        </button>
        <button
          onClick={() => { setFilterType('sign'); setSelectedIndex(0); }}
          className={`flex-1 min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filterType === 'sign' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dấu (2)
        </button>
      </div>

      <Card variant="accent" padding="lg" className="border-rose-500/30 text-center space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
          <span>Chữ cái Cyrillic</span>
          <span className="font-mono tabular-nums">
            {selectedIndex + 1} / {filteredLetters.length}
          </span>
          <span className="capitalize text-rose-400 font-medium">
            {currentLetter.type === 'vowel' ? 'Nguyên âm' : currentLetter.type === 'consonant' ? 'Phụ âm' : 'Ký hiệu'}
          </span>
        </div>

        <div className="py-2">
          <div className="text-6xl sm:text-7xl font-bold text-white tracking-wider flex items-center justify-center gap-3">
            <span>{currentLetter.upper}</span>
            <span className="text-rose-400 text-5xl sm:text-6xl">{currentLetter.lower}</span>
          </div>
          <p className="text-sm font-mono text-slate-300 mt-2">
            La-tinh: {currentLetter.latin}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left space-y-1">
          <p className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
            Hướng dẫn phát âm (Gần đúng cho người Việt)
          </p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {currentLetter.vietnamesePronunciation}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Từ ví dụ
            </span>
            <span className="text-base font-bold text-white">
              {currentLetter.exampleWordRu}
            </span>
            <span className="text-xs text-rose-300/90 block">
              [{currentLetter.exampleWordPronunciation}]
            </span>
            <span className="text-xs text-slate-300 block mt-0.5">
              Nghĩa: {currentLetter.exampleWordMeaningVi}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSpeak(currentLetter.exampleWordRu)}
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
            aria-label="Nghe phát âm"
            title="Nghe phát âm"
          >
            <Volume2 className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        {showAudioNotice && (
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-left flex items-start gap-2 text-xs animate-in fade-in">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-200 font-medium">Lưu ý âm thanh:</p>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Trình duyệt chưa hỗ trợ Text-to-Speech tự động. Hướng dẫn phiên âm tiếng Việt ở trên giúp phát âm chính xác.
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
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                    ? 'bg-rose-600 text-white scale-105 shadow-sm shadow-rose-950/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
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

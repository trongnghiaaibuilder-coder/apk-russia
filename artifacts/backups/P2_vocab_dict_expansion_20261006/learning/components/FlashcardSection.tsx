import React, { useState } from 'react';
import { CheckCircle, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { learningStorage } from '../services/learningStorage';

export const FlashcardSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progress, setProgress] = useState(() => learningStorage.getProgress());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const total = RUSSIAN_VOCABULARY.length;
  const currentCard = RUSSIAN_VOCABULARY[currentIndex] || RUSSIAN_VOCABULARY[0];

  const isKnown = progress.knownWordIds.includes(currentCard.id);
  const isReview = progress.reviewWordIds.includes(currentCard.id);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleNext = () => {
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleMarkKnown = () => {
    const updated = learningStorage.markWordKnown(currentCard.id);
    setProgress(updated);
    showToast('Đã đánh dấu thuộc!');
    handleNext();
  };

  const handleMarkReview = () => {
    const updated = learningStorage.markWordNeedReview(currentCard.id);
    setProgress(updated);
    showToast('Đã thêm vào danh sách cần ôn');
    handleNext();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full shadow-lg animate-in fade-in slide-in-from-top duration-150">
          {toastMessage}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Thẻ flashcard từ vựng</span>
        <span className="font-mono text-white font-bold">
          {currentIndex + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">✓ {progress.knownWordIds.length}</span>
          <span className="text-amber-400">★ {progress.reviewWordIds.length}</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <div
        onClick={() => setIsRevealed((v) => !v)}
        className="cursor-pointer select-none active:scale-[0.99] transition-transform"
      >
        <Card
          variant="accent"
          padding="lg"
          className="min-h-[260px] flex flex-col justify-between text-center relative border-rose-500/30 overflow-hidden"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-400 font-medium">
              {currentCard.category}
            </span>
            <div className="flex items-center gap-1.5">
              {isKnown && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                  Đã thuộc
                </span>
              )}
              {isReview && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold border border-amber-500/30">
                  Cần ôn
                </span>
              )}
            </div>
          </div>

          <div className="py-4 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
              {currentCard.ru}
            </h2>
            <p className="text-sm text-rose-300 font-mono">
              [{currentCard.pronunciation}]
            </p>
          </div>

          {isRevealed ? (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 animate-in fade-in zoom-in-95">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Nghĩa tiếng Việt
              </span>
              <p className="text-base sm:text-lg font-bold text-white">
                {currentCard.vi}
              </p>
              {currentCard.examplePhraseRu && (
                <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800/60">
                  Ví dụ: {currentCard.examplePhraseRu}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-4">
              <Eye className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Chạm vào thẻ để lật xem nghĩa</span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
            {isRevealed ? 'Chạm lại để úp thẻ' : 'Nhấn nút dưới để chuyển tiếp'}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleMarkReview}
          leftIcon={<Star className="w-4 h-4 text-amber-400" />}
          className="min-h-[50px] border-amber-500/30 hover:bg-amber-950/20 text-amber-300"
        >
          Cần ôn
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleMarkKnown}
          leftIcon={<CheckCircle className="w-4 h-4" />}
          className="min-h-[50px] bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50"
        >
          Đã thuộc
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          variant="secondary"
          size="md"
          onClick={handlePrev}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
          className="flex-1 min-h-[48px]"
        >
          Thẻ trước
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="flex-1 min-h-[48px]"
        >
          Thẻ tiếp theo
        </Button>
      </div>
    </div>
  );
};

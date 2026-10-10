import React, { useState } from 'react';
import { CheckCircle, Star, ChevronLeft, ChevronRight, Eye, Volume2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { learningStorage } from '../services/learningStorage';
import { textToSpeechService } from '../../voice/services/textToSpeechService';

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

  const handleSpeak = (text: string) => {
    if (!text) return;
    const cleanText = text.split('/')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim();
    textToSpeechService.speak(cleanText, 'ru');
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
    <div className="space-y-4 v2-fade-up">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 v2-accent-bg text-xs font-semibold rounded-full shadow-lg v2-fade-up">
          {toastMessage}
        </div>
      )}

      <div className="flex items-center justify-between text-xs v2-text-muted px-1">
        <span>Thẻ flashcard từ vựng</span>
        <span className="font-mono v2-text font-bold">
          {currentIndex + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">✓ {progress.knownWordIds.length}</span>
          <span className="text-amber-400">★ {progress.reviewWordIds.length}</span>
        </div>
      </div>

      <div className="w-full h-1.5 v2-bg-soft rounded-full overflow-hidden">
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
            <span className="v2-accent-text font-medium">
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
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black v2-text tracking-wide">
                {currentCard.ru}
              </h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(currentCard.ru);
                }}
                className="min-h-[44px] min-w-[44px] rounded-xl bg-rose-950/50 border border-rose-500/40 v2-accent-text hover:opacity-80 hover:opacity-70 flex items-center justify-center transition-colors cursor-pointer"
                title={`Phát âm ${currentCard.ru}`}
                aria-label={`Phát âm ${currentCard.ru}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm v2-accent-text font-mono">
              [{currentCard.pronunciation}]
            </p>
          </div>

          {isRevealed ? (
            <div className="p-3.5 rounded-3xl v2-card space-y-2 v2-fade-up">
              <span className="text-[10px] v2-text-muted uppercase tracking-wider block">
                Nghĩa tiếng Việt
              </span>
              <p className="text-base sm:text-lg font-bold v2-text">
                {currentCard.vi}
              </p>
              {currentCard.examplePhraseRu && (
                <p className="text-xs v2-text-muted italic pt-1 border-t v2-divider/60">
                  Ví dụ: {currentCard.examplePhraseRu}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs v2-text-muted py-4">
              <Eye className="w-4 h-4 v2-accent-text animate-pulse" />
              <span>Chạm vào thẻ để lật xem nghĩa</span>
            </div>
          )}

          <div className="text-[10px] v2-text-faint pt-2 border-t v2-divider/80">
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

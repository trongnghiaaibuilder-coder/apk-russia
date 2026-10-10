import React, { useState } from 'react';
import { CheckCircle, Inbox, Eye } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { reviewService } from '../services/reviewService';
import { learningStorage } from '../services/learningStorage';

export const ReviewSection: React.FC = () => {
  const [reviewItems, setReviewItems] = useState(() => reviewService.getReviewItems());
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const handleToggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkAsKnown = (wordId: string) => {
    learningStorage.markWordKnown(wordId);
    setReviewItems(reviewService.getReviewItems());
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block">Danh sách từ cần ôn tập:</span>
          <span className="font-bold text-amber-300 text-sm">
            {reviewItems.length} từ trong hàng đợi
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
          ★
        </div>
      </div>

      {reviewItems.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-6 h-6 text-slate-400" />}
          title="Hàng đợi ôn tập trống"
          description="Bạn chưa có từ nào cần ôn tập. Hãy đánh dấu ngôi sao ★ trong mục Từ vựng hoặc Thẻ Flashcard!"
        />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Mẹo: Nhấn vào từ để xem nghĩa tiếng Việt. Khi đã thuộc, nhấn "Đã thuộc" để đưa ra khỏi hàng đợi.
          </p>
          <div className="space-y-2.5">
            {reviewItems.map((item) => {
              const isRevealed = Boolean(revealedIds[item.id]);

              return (
                <Card
                  key={item.id}
                  variant="default"
                  padding="md"
                  className="space-y-2 border-amber-500/20 bg-slate-900/90"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => handleToggleReveal(item.id)}
                    >
                      <div className="flex items-center gap-2 mb-0.5 text-xs text-rose-400">
                        <span>{item.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {item.ru}
                      </h3>
                      <p className="text-xs text-rose-300 font-mono">
                        [{item.pronunciation}]
                      </p>
                      {isRevealed ? (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-emerald-300 font-medium animate-in fade-in">
                          👉 {item.vi}
                        </div>
                      ) : (
                        <span className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Chạm để hiện nghĩa tiếng Việt
                        </span>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarkAsKnown(item.id)}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      className="shrink-0 min-h-[44px]"
                    >
                      Đã thuộc
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

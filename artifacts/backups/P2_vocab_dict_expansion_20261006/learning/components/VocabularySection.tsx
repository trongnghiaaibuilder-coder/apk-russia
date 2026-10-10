import React, { useState } from 'react';
import { Search, Star, CheckCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { VocabularyCategory } from '../types';
import { learningStorage } from '../services/learningStorage';

const ALL_CATEGORIES: ('All' | VocabularyCategory)[] = [
  'All',
  'Greetings',
  'Basic communication',
  'People',
  'Numbers',
  'Time',
  'Food',
  'Drinks',
  'Transport',
  'Taxi',
  'Hotel',
  'Shopping',
  'Money',
  'Work',
  'Directions',
  'Places',
  'Emergency',
];

export const VocabularySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | VocabularyCategory>('All');
  const [progress, setProgress] = useState(() => learningStorage.getProgress());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleKnown = (wordId: string) => {
    if (progress.knownWordIds.includes(wordId)) {
      const updated = {
        ...progress,
        knownWordIds: progress.knownWordIds.filter((id) => id !== wordId),
      };
      learningStorage.saveProgress(updated);
      setProgress(updated);
      showToast('Đã bỏ đánh dấu nhớ từ');
    } else {
      const updated = learningStorage.markWordKnown(wordId);
      setProgress(updated);
      showToast('Đã đánh dấu thuộc từ này!');
    }
  };

  const handleToggleReview = (wordId: string) => {
    if (progress.reviewWordIds.includes(wordId)) {
      const updated = {
        ...progress,
        reviewWordIds: progress.reviewWordIds.filter((id) => id !== wordId),
      };
      learningStorage.saveProgress(updated);
      setProgress(updated);
      showToast('Đã xóa khỏi danh sách cần ôn');
    } else {
      const updated = learningStorage.markWordNeedReview(wordId);
      setProgress(updated);
      showToast('Đã thêm vào danh sách cần ôn');
    }
  };

  const filteredWords = RUSSIAN_VOCABULARY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.ru.toLowerCase().includes(query) ||
      item.vi.toLowerCase().includes(query) ||
      item.pronunciation.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full shadow-lg animate-in fade-in slide-in-from-top duration-150">
          {toastMessage}
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm từ vựng bằng tiếng Nga hoặc tiếng Việt..."
          className="w-full h-11 pl-10 pr-4 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-950/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'Tất cả' : cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Hiển thị <strong className="text-white font-mono">{filteredWords.length}</strong> từ
          {selectedCategory !== 'All' ? ` trong "${selectedCategory}"` : ''}
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-medium">
            ✓ Đã thuộc: {progress.knownWordIds.length}
          </span>
          <span className="text-amber-400 font-medium">
            ★ Cần ôn: {progress.reviewWordIds.length}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredWords.map((item) => {
          const isKnown = progress.knownWordIds.includes(item.id);
          const isReview = progress.reviewWordIds.includes(item.id);

          return (
            <Card
              key={item.id}
              variant="default"
              padding="md"
              className="space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-rose-400 font-medium">
                      {item.category}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {item.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide truncate">
                    {item.ru}
                  </h3>
                  <p className="text-xs text-rose-300/90 font-mono">
                    [{item.pronunciation}]
                  </p>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    {item.vi}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleReview(item.id)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isReview
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-750'
                    }`}
                    title={isReview ? 'Bỏ cần ôn' : 'Thêm vào cần ôn'}
                    aria-label="Cần ôn"
                  >
                    <Star className={`w-4 h-4 ${isReview ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleToggleKnown(item.id)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isKnown
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-emerald-300 hover:bg-slate-750'
                    }`}
                    title={isKnown ? 'Bỏ đã thuộc' : 'Đánh dấu đã thuộc'}
                    aria-label="Đã thuộc"
                  >
                    <CheckCircle className={`w-4 h-4 ${isKnown ? 'fill-emerald-500/20' : ''}`} />
                  </button>
                </div>
              </div>

              {item.examplePhraseRu && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-0.5">
                  <p className="text-slate-300 italic">
                    Ví dụ: {item.examplePhraseRu}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Dịch: {item.examplePhraseVi}
                  </p>
                </div>
              )}
            </Card>
          );
        })}

        {filteredWords.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-xs">
            Không tìm thấy từ vựng nào khớp từ khóa "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

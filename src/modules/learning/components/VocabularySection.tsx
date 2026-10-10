import React, { useState } from 'react';
import { Search, Star, CheckCircle, Volume2, Gauge } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { VocabularyCategory } from '../types';
import { learningStorage } from '../services/learningStorage';
import { removeVietnameseDiacritics } from '../../../data/dictionary';
import { textToSpeechService } from '../../voice/services/textToSpeechService';

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
  'Health & Pharmacy',
  'Documents & Visa',
  'Education',
  'Weather & Nature',
  'Housing & Daily Life',
  'Verbs & Actions',
  'Adjectives & Colors',
];

const CATEGORY_LABELS: Record<'All' | VocabularyCategory, string> = {
  'All': 'Tất cả',
  'Greetings': 'Greetings · Chào hỏi',
  'Basic communication': 'Giao tiếp cơ bản',
  'People': 'People · Con người & Gia đình',
  'Numbers': 'Numbers · Số đếm',
  'Time': 'Time · Thời gian',
  'Food': 'Food · Ẩm thực',
  'Drinks': 'Drinks · Đồ uống',
  'Transport': 'Transport · Giao thông',
  'Taxi': 'Taxi · Gọi xe',
  'Hotel': 'Hotel · Khách sạn',
  'Shopping': 'Shopping · Mua sắm',
  'Money': 'Money · Tiền tệ & Ngân hàng',
  'Work': 'Work · Công việc',
  'Directions': 'Directions · Phương hướng',
  'Places': 'Places · Địa điểm',
  'Emergency': 'Emergency · Khẩn cấp',
  'Health & Pharmacy': 'Y tế & Hiệu thuốc',
  'Documents & Visa': 'Giấy tờ & Visa',
  'Education': 'Giáo dục & Đại học',
  'Weather & Nature': 'Thời tiết & Mùa',
  'Housing & Daily Life': 'Nhà ở & Sinh hoạt',
  'Verbs & Actions': 'Động từ thông dụng',
  'Adjectives & Colors': 'Tính từ & Màu sắc',
};

export const VocabularySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | VocabularyCategory>('All');
  const [progress, setProgress] = useState(() => learningStorage.getProgress());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [slowMode, setSlowMode] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSpeak = (text: string, key: string) => {
    if (!text || !text.trim()) return;
    // Strip parenthetical acronyms or slash alternatives for cleaner speech if needed
    const cleanText = text.split('/')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim();

    setSpeakingKey(key);
    textToSpeechService.speak(
      cleanText,
      'ru',
      undefined,
      () => setSpeakingKey((prev) => (prev === key ? null : prev)),
      () => {
        setSpeakingKey((prev) => (prev === key ? null : prev));
        showToast('Thiết bị hiện chưa sẵn sàng phát âm thanh');
      }
    );
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
    if (!query) return matchesCategory;

    const queryNoAccent = removeVietnameseDiacritics(query);
    const viNoAccent = removeVietnameseDiacritics(item.vi.toLowerCase());
    const matchesSearch =
      item.ru.toLowerCase().includes(query) ||
      item.vi.toLowerCase().includes(query) ||
      viNoAccent.includes(queryNoAccent) ||
      item.pronunciation.toLowerCase().includes(query) ||
      (item.examplePhraseRu && item.examplePhraseRu.toLowerCase().includes(query)) ||
      (item.examplePhraseVi && item.examplePhraseVi.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 v2-fade-up">
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 v2-accent-bg text-xs font-semibold rounded-full shadow-lg v2-fade-up">
          {toastMessage}
        </div>
      )}

      {/* Search & Voice Rate Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 v2-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm từ vựng tiếng Nga, tiếng Việt hoặc phiên âm..."
            aria-label="Tìm từ vựng tiếng Nga hoặc tiếng Việt"
            className="w-full h-11 pl-10 pr-8 v2-bg-soft border v2-divider rounded-xl text-xs sm:text-sm v2-text placeholder:v2-text-faint focus:outline-none focus:border-rose-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Xóa tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 v2-text-muted hover:opacity-70 text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setSlowMode((v) => !v);
            showToast(!slowMode ? 'Đã bật chế độ phát âm chậm (0.7x)' : 'Đã bật tốc độ phát âm chuẩn (0.9x)');
          }}
          className={`min-h-[44px] px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
            slowMode
              ? 'bg-rose-950/50 border-rose-500/40 v2-accent-text font-semibold'
              : 'v2-bg-soft v2-divider v2-text-muted hover:bg-slate-800'
          }`}
          title="Chuyển tốc độ giọng đọc tiếng Nga"
          aria-label={slowMode ? 'Tốc độ đọc chậm 0.7x' : 'Tốc độ đọc chuẩn'}
        >
          <Gauge className="w-3.5 h-3.5 v2-accent-text" />
          <span className="hidden sm:inline">{slowMode ? 'Đọc chậm 0.7x' : 'Chuẩn 1.0x'}</span>
          <span className="sm:hidden">{slowMode ? '0.7x' : '1.0x'}</span>
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'v2-accent-bg font-semibold shadow-sm shadow-rose-950/40'
                  : 'v2-bg-soft border v2-divider v2-text-muted hover:bg-slate-800'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          );
        })}
      </div>

      {/* Status & Progress Summary */}
      <div className="flex items-center justify-between text-xs v2-text-muted px-1">
        <span>
          Hiển thị <strong className="v2-text font-mono tabular-nums">{filteredWords.length}</strong> /{' '}
          <span className="font-mono tabular-nums">{RUSSIAN_VOCABULARY.length}</span> từ
          {selectedCategory !== 'All' ? ` (${CATEGORY_LABELS[selectedCategory]})` : ''}
        </span>
        <div className="flex items-center gap-3 text-[11px] tabular-nums">
          <span className="text-emerald-400 font-medium">
            ✓ Đã thuộc: {progress.knownWordIds.length}
          </span>
          <span className="text-amber-400 font-medium">
            ★ Cần ôn: {progress.reviewWordIds.length}
          </span>
        </div>
      </div>

      {/* Vocabulary Cards List */}
      <div className="space-y-2.5">
        {filteredWords.map((item) => {
          const isKnown = progress.knownWordIds.includes(item.id);
          const isReview = progress.reviewWordIds.includes(item.id);
          const wordSpeakKey = `word-${item.id}`;
          const exampleSpeakKey = `ex-${item.id}`;
          const isWordSpeaking = speakingKey === wordSpeakKey;
          const isExSpeaking = speakingKey === exampleSpeakKey;

          return (
            <Card
              key={item.id}
              variant="default"
              padding="md"
              className="space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs v2-accent-text font-medium">
                      {item.category}
                    </span>
                    <span className="v2-text-faint text-xs" aria-hidden="true">•</span>
                    <span className="text-[11px] v2-text-muted capitalize">
                      {item.difficulty === 'beginner' ? 'Cơ bản (A1)' : 'Trung cấp (A2)'}
                    </span>
                    {item.partOfSpeech && (
                      <>
                        <span className="v2-text-faint text-xs" aria-hidden="true">•</span>
                        <span className="text-[11px] v2-text-muted">
                          {item.partOfSpeech}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <h3
                      onClick={() => handleSpeak(item.ru, wordSpeakKey)}
                      className="text-base sm:text-lg font-bold v2-text tracking-wide cursor-pointer hover:opacity-70 transition-colors"
                      title="Chạm để nghe phát âm tiếng Nga"
                    >
                      {item.ru}
                    </h3>
                  </div>
                  <p className="text-xs v2-accent-text/90 font-mono">
                    [{item.pronunciation}]
                  </p>
                  <p className="text-xs sm:text-sm v2-text mt-1 font-medium">
                    {item.vi}
                  </p>
                </div>

                {/* Action Buttons: Speak (TTS), Need Review, Mark Known */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSpeak(item.ru, wordSpeakKey)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isWordSpeaking
                        ? 'v2-accent-bg shadow-md shadow-rose-950/60 ring-2 ring-rose-400/50'
                        : 'v2-accent-soft border border-rose-500/30 v2-accent-text hover:opacity-80 hover:opacity-70'
                    }`}
                    title={`Phát âm từ "${item.ru}"`}
                    aria-label={`Phát âm ${item.ru}`}
                  >
                    <Volume2 className={`w-4 h-4 ${isWordSpeaking ? 'animate-pulse' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleReview(item.id)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isReview
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 v2-text-muted hover:text-amber-300 hover:bg-slate-750'
                    }`}
                    title={isReview ? 'Bỏ cần ôn' : 'Thêm vào cần ôn'}
                    aria-label={`Cần ôn ${item.ru}`}
                  >
                    <Star className={`w-4 h-4 ${isReview ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleKnown(item.id)}
                    className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      isKnown
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 v2-text-muted hover:text-emerald-300 hover:bg-slate-750'
                    }`}
                    title={isKnown ? 'Bỏ đã thuộc' : 'Đánh dấu đã thuộc'}
                    aria-label={`Đã thuộc ${item.ru}`}
                  >
                    <CheckCircle className={`w-4 h-4 ${isKnown ? 'fill-emerald-500/20' : ''}`} />
                  </button>
                </div>
              </div>

              {item.examplePhraseRu && (
                <div className="pt-2 border-t v2-divider/80 flex items-center justify-between gap-2 text-xs v2-text-muted">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="v2-text-muted italic">
                      Ví dụ: {item.examplePhraseRu}
                    </p>
                    <p className="text-[11px] v2-text-muted">
                      Dịch: {item.examplePhraseVi}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(item.examplePhraseRu!, exampleSpeakKey)}
                    className={`min-h-[36px] min-w-[36px] px-2 rounded-lg flex items-center gap-1 text-[11px] transition-colors shrink-0 cursor-pointer ${
                      isExSpeaking
                        ? 'v2-accent-bg'
                        : 'bg-slate-800/80 v2-text-muted hover:bg-slate-800 hover:opacity-70'
                    }`}
                    title="Nghe phát âm câu ví dụ"
                    aria-label={`Phát âm ví dụ ${item.examplePhraseRu}`}
                  >
                    <Volume2 className="w-3.5 h-3.5 v2-accent-text" />
                    <span className="hidden sm:inline">Nghe câu</span>
                  </button>
                </div>
              )}
            </Card>
          );
        })}

        {filteredWords.length === 0 && (
          <div className="py-10 text-center v2-text-muted text-xs">
            Không tìm thấy từ vựng nào khớp từ khóa "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

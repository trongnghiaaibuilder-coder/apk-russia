import React, { useState } from 'react';
import { Search, ShieldAlert, Info, Volume2, Star } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RUSSIAN_PHRASES } from '../data/phrases';
import { textToSpeechService } from '../../voice/services/textToSpeechService';
import { getFavorites, toggleFavorite, phraseId } from '../../../services/favoritesService';

export const PhrasesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = ['All', ...Array.from(new Set(RUSSIAN_PHRASES.map((p) => p.category)))];

  const handleSpeak = (text: string, id: string) => {
    setSpeakingId(id);
    textToSpeechService.speak(
      text,
      'ru',
      undefined,
      () => setSpeakingId((prev) => (prev === id ? null : prev)),
      () => setSpeakingId((prev) => (prev === id ? null : prev))
    );
  };

  const filteredPhrases = RUSSIAN_PHRASES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesFavorite = !showFavoritesOnly || favorites.includes(phraseId(item.vi, item.ru));
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.ru.toLowerCase().includes(query) ||
      item.vi.toLowerCase().includes(query) ||
      item.pronunciation.toLowerCase().includes(query) ||
      item.situation.toLowerCase().includes(query);
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  return (
    <div className="space-y-4 v2-fade-up">
      <div className="relative">
        <Search className="w-4 h-4 v2-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm câu theo tình huống hoặc nghĩa..."
          className="w-full h-11 pl-10 pr-4 v2-bg-soft border v2-divider rounded-xl text-xs sm:text-sm v2-text placeholder:v2-text-faint focus:outline-none focus:border-rose-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 v2-text-muted hover:opacity-70 text-xs p-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            showFavoritesOnly
              ? 'v2-accent-bg font-semibold shadow-sm shadow-rose-950/40'
              : 'v2-bg-soft border v2-divider v2-text-muted hover:bg-slate-800'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Yêu thích ({favorites.length})
        </button>
        {categories.map((cat) => {
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
              {cat === 'All' ? 'Tất cả tình huống' : cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs v2-text-muted px-1">
        <span>
          Tìm thấy <strong className="v2-text font-mono">{filteredPhrases.length}</strong> mẫu sinh tồn
        </span>
        <span className="text-[11px] v2-text-faint">
          Toàn bộ lưu trữ ngoại tuyến 100%
        </span>
      </div>

      <div className="space-y-3">
        {filteredPhrases.map((phrase) => {
          const isSpeaking = speakingId === phrase.id;
          return (
            <Card
              key={phrase.id}
              variant="default"
              padding="md"
              className={phrase.isEmergency ? 'border-red-500/30 bg-red-950/10 space-y-2.5' : 'space-y-2.5'}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium v2-accent-text">
                  {phrase.category}
                </span>
                <div className="flex items-center gap-2">
                  {phrase.isEmergency && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold v2-accent-text v2-accent-soft border border-red-500/20 px-2 py-0.5 rounded-full">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Khẩn cấp</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const nowFav = toggleFavorite(phrase.vi, phrase.ru);
                      setFavorites(nowFav ? [...favorites, phraseId(phrase.vi, phrase.ru)] : favorites.filter(f => f !== phraseId(phrase.vi, phrase.ru)));
                    }}
                    className={`min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      favorites.includes(phraseId(phrase.vi, phrase.ru))
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'v2-bg-soft border v2-divider v2-text-muted hover:opacity-70'
                    }`}
                    title="Lưu vào yêu thích"
                    aria-label="Lưu vào yêu thích"
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(phraseId(phrase.vi, phrase.ru)) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeak(phrase.ru, phrase.id)}
                    className={`min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                      isSpeaking
                        ? 'v2-accent-bg shadow-md shadow-rose-950/60'
                        : 'v2-accent-soft border border-rose-500/30 v2-accent-text hover:opacity-80 hover:opacity-70'
                    }`}
                    title={`Phát âm câu "${phrase.ru}"`}
                    aria-label={`Phát âm ${phrase.ru}`}
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>

              <div>
                <h3
                  onClick={() => handleSpeak(phrase.ru, phrase.id)}
                  className="text-sm sm:text-base font-bold v2-text leading-snug cursor-pointer hover:opacity-70 transition-colors"
                  title="Chạm để nghe phát âm tiếng Nga"
                >
                  {phrase.ru}
                </h3>
                <p className="text-xs v2-accent-text/90 font-mono mt-0.5">
                  [{phrase.pronunciation}]
                </p>
                <p className="text-xs sm:text-sm v2-text font-medium mt-1">
                  {phrase.vi}
                </p>
              </div>

              <div className="pt-2 border-t v2-divider/80 text-[11px] v2-text-muted flex items-center gap-1.5">
                <Info className="w-3 h-3 v2-text-faint shrink-0" />
                <span className="truncate">Tình huống: {phrase.situation}</span>
              </div>
            </Card>
          );
        })}

        {filteredPhrases.length === 0 && (
          <div className="py-10 text-center v2-text-muted text-xs">
            Không tìm thấy câu nào cho "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

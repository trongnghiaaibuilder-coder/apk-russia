import React, { useState } from 'react';
import { Search, ShieldAlert, Info, Volume2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { RUSSIAN_PHRASES } from '../data/phrases';

export const PhrasesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(RUSSIAN_PHRASES.map((p) => p.category)))];

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredPhrases = RUSSIAN_PHRASES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.ru.toLowerCase().includes(query) ||
      item.vi.toLowerCase().includes(query) ||
      item.pronunciation.toLowerCase().includes(query) ||
      item.situation.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm câu theo tình huống hoặc nghĩa..."
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
        {categories.map((cat) => {
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
              {cat === 'All' ? 'Tất cả tình huống' : cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Tìm thấy <strong className="text-white font-mono">{filteredPhrases.length}</strong> mẫu sinh tồn
        </span>
        <span className="text-[11px] text-slate-500">
          Toàn bộ lưu trữ ngoại tuyến 100%
        </span>
      </div>

      <div className="space-y-3">
        {filteredPhrases.map((phrase) => {
          return (
            <Card
              key={phrase.id}
              variant="default"
              padding="md"
              className={phrase.isEmergency ? 'border-red-500/30 bg-red-950/10 space-y-2.5' : 'space-y-2.5'}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-rose-400">
                  {phrase.category}
                </span>
                <div className="flex items-center gap-2">
                  {phrase.isEmergency && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Khẩn cấp</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSpeak(phrase.ru)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {phrase.ru}
                </h3>
                <p className="text-xs text-rose-300/90 font-mono mt-0.5">
                  [{phrase.pronunciation}]
                </p>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
                  {phrase.vi}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">Tình huống: {phrase.situation}</span>
              </div>
            </Card>
          );
        })}

        {filteredPhrases.length === 0 && (
          <div className="py-10 text-center text-slate-400 text-xs">
            Không tìm thấy câu nào cho "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

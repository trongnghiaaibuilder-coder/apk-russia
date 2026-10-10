import React, { useState, useMemo } from 'react';
import {
  dictionaryService,
  DictionaryTopic,
  PartOfSpeech,
  RUSSIAN_CASES,
  CONJUGATION_PATTERNS,
  COMMON_ASPECTUAL_PAIRS,
} from '../../../data/dictionary';
import { Card } from '../../../components/ui/Card';
import { Search, BookOpen, Layers, RefreshCw, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';

type ViewMode = 'search' | 'cases' | 'conjugations' | 'phrases';

const TOPIC_CHIPS: Array<{ id: DictionaryTopic; label: string }> = [
  { id: 'metro', label: '🚇 Metro' },
  { id: 'pharmacy', label: '💊 Hiệu thuốc' },
  { id: 'hospital', label: '🏥 Viện / Y tế' },
  { id: 'transport', label: '🚊 Giao thông' },
  { id: 'documents', label: '📄 Giấy tờ / Visa' },
  { id: 'banking', label: '💳 Ngân hàng' },
  { id: 'shopping', label: '🛒 Mua sắm' },
  { id: 'daily-life', label: '🏡 Sinh hoạt' },
];

export const DictionarySection: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<DictionaryTopic | undefined>();
  const [selectedPos] = useState<PartOfSpeech | undefined>();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Search execution
  const searchResult = useMemo(() => {
    return dictionaryService.search(query, {
      topic: selectedTopic,
      partOfSpeech: selectedPos,
      limit: 30,
    });
  }, [query, selectedTopic, selectedPos]);

  // Statistics
  const stats = useMemo(() => dictionaryService.getStatistics(), []);

  // Practical phrases
  const phrases = useMemo(() => dictionaryService.getPhrases(selectedTopic), [selectedTopic]);

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-navigation tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium text-slate-400 gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setViewMode('search')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'search' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'hover:text-slate-200'
          }`}
        >
          <Search size={14} className="text-rose-400" /> Tra từ & Biến dạng
        </button>
        <button
          onClick={() => setViewMode('cases')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'cases' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'hover:text-slate-200'
          }`}
        >
          <Layers size={14} className="text-rose-400" /> 6 Cách tiếng Nga
        </button>
        <button
          onClick={() => setViewMode('conjugations')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'conjugations' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'hover:text-slate-200'
          }`}
        >
          <RefreshCw size={14} className="text-rose-400" /> Chia động từ
        </button>
        <button
          onClick={() => setViewMode('phrases')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'phrases' ? 'bg-slate-800 text-white font-semibold shadow-xs' : 'hover:text-slate-200'
          }`}
        >
          <BookOpen size={14} className="text-rose-400" /> Mẫu câu ({phrases.length})
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>
            <strong>{stats.totalEntries}</strong> từ • <strong>{stats.totalForms}</strong> dạng biến cách 100% Offline
          </span>
        </div>
        <span className="text-[10px] text-rose-400 font-mono">Wiktionary & OpenCorpora</span>
      </div>

      {/* VIEW: SEARCH & MORPHOLOGY */}
      {viewMode === 'search' && (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập tiếng Nga (аптека) hoặc tiếng Việt (nhà thuốc)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Topic Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedTopic(undefined)}
              className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                !selectedTopic
                  ? 'bg-rose-600 text-white border-rose-500 font-medium'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Tất cả
            </button>
            {TOPIC_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedTopic(selectedTopic === chip.id ? undefined : chip.id)}
                className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  selectedTopic === chip.id
                    ? 'bg-rose-600 text-white border-rose-500 font-medium'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Tìm thấy <strong className="text-white font-mono">{searchResult.totalMatches}</strong> kết quả
            </span>
            {searchResult.lookupTimeMs > 0 && (
              <span className="font-mono text-[10px] text-slate-500">{searchResult.lookupTimeMs}ms</span>
            )}
          </div>

          {/* Match List */}
          <div className="space-y-2.5">
            {searchResult.matches.map((match) => {
              const { entry, matchType, matchedFormFeatures } = match;
              const isExpanded = selectedEntryId === entry.id;

              return (
                <Card
                  key={entry.id}
                  className={`p-3.5 transition-all cursor-pointer ${
                    isExpanded ? 'border-rose-500/50 bg-slate-850' : 'hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedEntryId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-white tracking-tight">
                          {entry.pronunciation?.stress || entry.lemma}
                        </span>
                        <span className="text-[11px] text-rose-300 font-mono bg-rose-950/40 border border-rose-500/30 px-1.5 py-0.5 rounded-md">
                          {entry.partOfSpeech}
                          {entry.gender ? ` (${entry.gender.slice(0, 1)})` : ''}
                        </span>
                        {entry.difficulty && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-semibold">
                            {entry.difficulty}
                          </span>
                        )}
                        {matchType === 'exact_form' && (
                          <span className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
                            Dạng biến đổi ({matchedFormFeatures?.case || 'chia'})
                          </span>
                        )}
                      </div>
                      {entry.pronunciation?.phonetic && (
                        <div className="text-xs text-rose-300/80 font-mono">[{entry.pronunciation.phonetic}]</div>
                      )}
                      <div className="text-xs sm:text-sm font-medium text-slate-200 pt-1">
                        {entry.meanings.map((m, i) => (
                          <span key={m.id} className="inline-block mr-2">
                            {i > 0 && '; '}
                            <strong>{m.vi}</strong>
                            {m.context && <span className="text-slate-400 text-xs font-normal"> ({m.context})</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(entry.lemma);
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl shrink-0 cursor-pointer"
                      title="Phát âm tiếng Nga"
                    >
                      <Volume2 size={16} className="text-rose-400" />
                    </button>
                  </div>

                  {/* Expanded View: Forms, Examples, Aspect Pairs */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2.5 animate-in fade-in duration-150">
                      {/* Declension / Inflected Forms */}
                      {entry.forms && entry.forms.length > 0 && (
                        <div>
                          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                            <Layers size={12} className="text-rose-400" /> Các dạng biến cách:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.forms.map((f, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md font-mono text-[11px] border border-slate-800"
                              >
                                {f.form}
                                {f.grammaticalFeatures?.case && (
                                  <span className="text-slate-500 text-[10px] ml-1">
                                    ({f.grammaticalFeatures.case.slice(0, 3)})
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Examples */}
                      {entry.examples && entry.examples.length > 0 && (
                        <div>
                          <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                            <BookOpen size={12} className="text-rose-400" /> Câu ví dụ:
                          </div>
                          <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                            {entry.examples.map((ex) => (
                              <div key={ex.id} className="space-y-0.5">
                                <div className="text-white font-medium">{ex.ru}</div>
                                <div className="text-slate-400 text-[11px]">{ex.vi}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Phrases */}
                      {entry.phrases && entry.phrases.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap text-slate-400">
                          <span className="font-semibold text-slate-300">Cụm từ hay gặp:</span>
                          {entry.phrases.map((p, idx) => (
                            <span key={idx} className="bg-slate-950 text-rose-300 border border-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: 6 CASES */}
      {viewMode === 'cases' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
            Hệ thống 6 biến cách là xương sống ngữ pháp tiếng Nga. Mỗi cách trả lời câu hỏi và biến đổi đuôi danh từ/tính từ khác nhau.
          </div>
          <div className="space-y-2.5">
            {RUSSIAN_CASES.map((c, index) => (
              <Card key={c.caseName} className="p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono">
                      Cách {index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{c.vietnameseName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{c.russianName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-md">
                      {c.questionRu}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.questionVi}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Ý nghĩa & công dụng:</strong> {c.primaryUsage}
                </div>
                {c.prepositions.length > 0 && (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-300">Giới từ đi kèm:</span>
                    {c.prepositions.map((prep, i) => (
                      <span key={i} className="bg-slate-950 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[11px]">
                        {prep}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: CONJUGATIONS */}
      {viewMode === 'conjugations' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
            Động từ tiếng Nga có 2 nhóm chia chính (Nhóm 1 & Nhóm 2) cùng cặp thể chưa hoàn thành / hoàn thành.
          </div>
          <div className="space-y-2.5">
            {CONJUGATION_PATTERNS.map((p) => (
              <Card key={p.conjugationType} className="p-3.5 space-y-2">
                <h4 className="text-sm font-bold text-white">{p.nameVi}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-semibold text-slate-300">Đuôi chia số ít:</div>
                    <div>я: <span className="font-mono font-bold text-rose-400">{p.endings['1stSingular']}</span></div>
                    <div>ты: <span className="font-mono font-bold text-rose-400">{p.endings['2ndSingular']}</span></div>
                    <div>он/она: <span className="font-mono font-bold text-rose-400">{p.endings['3rdSingular']}</span></div>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-semibold text-slate-300">Đuôi chia số nhiều:</div>
                    <div>мы: <span className="font-mono font-bold text-rose-400">{p.endings['1stPlural']}</span></div>
                    <div>вы: <span className="font-mono font-bold text-rose-400">{p.endings['2ndPlural']}</span></div>
                    <div>они: <span className="font-mono font-bold text-rose-400">{p.endings['3rdPlural']}</span></div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-300">Ví dụ:</span>
                  {p.examples.map((ex, i) => (
                    <span key={i} className="bg-slate-950 border border-slate-800 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">
                      {ex}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Aspectual Pairs Table */}
          <Card className="p-3.5 space-y-2.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <RefreshCw size={14} className="text-rose-400" /> Cặp thể động từ quan trọng
            </h4>
            <div className="space-y-1.5">
              {COMMON_ASPECTUAL_PAIRS.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold font-mono text-white">{pair.imperfective}</span>
                    <ArrowRight size={12} className="text-slate-500" />
                    <span className="font-semibold font-mono text-rose-400">{pair.perfective}</span>
                  </div>
                  <span className="text-slate-400">{pair.meaningVi}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* VIEW: PHRASES */}
      {viewMode === 'phrases' && (
        <div className="space-y-2.5">
          {phrases.map((phrase) => (
            <Card key={phrase.id} className="p-3.5 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">{phrase.ru}</div>
                  <div className="text-xs text-rose-300/80 font-mono">[{phrase.phonetic}]</div>
                  <div className="text-sm font-medium text-slate-200 mt-0.5">{phrase.vi}</div>
                  {phrase.literalMeaningVi && (
                    <div className="text-[11px] text-slate-400">Nghĩa đen: {phrase.literalMeaningVi}</div>
                  )}
                  <div className="text-[11px] text-slate-400 pt-0.5">Ngữ cảnh: {phrase.context}</div>
                </div>
                <button
                  onClick={() => handleSpeak(phrase.ru)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg shrink-0 cursor-pointer"
                  title="Phát âm"
                >
                  <Volume2 size={16} className="text-rose-400" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

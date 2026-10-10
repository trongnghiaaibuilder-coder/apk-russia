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
import { Search, BookOpen, Layers, RefreshCw, Volume2, ShieldCheck, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { textToSpeechService } from '../../voice/services/textToSpeechService';

type ViewMode = 'search' | 'cases' | 'conjugations' | 'phrases';
type DictDirection = 'auto' | 'vi-ru' | 'ru-vi';

const TOPIC_CHIPS: Array<{ id: DictionaryTopic; label: string }> = [
  { id: 'greetings', label: 'Chào hỏi' },
  { id: 'communication', label: 'Giao tiếp' },
  { id: 'daily-life', label: 'Sinh hoạt' },
  { id: 'food', label: 'Ẩm thực' },
  { id: 'shopping', label: 'Mua sắm' },
  { id: 'metro', label: 'Metro' },
  { id: 'transport', label: 'Giao thông' },
  { id: 'taxi', label: 'Taxi' },
  { id: 'hotel', label: 'Khách sạn' },
  { id: 'pharmacy', label: 'Hiệu thuốc' },
  { id: 'hospital', label: 'Y tế / Viện' },
  { id: 'documents', label: 'Giấy tờ / Visa' },
  { id: 'banking', label: 'Ngân hàng' },
  { id: 'work', label: 'Công việc' },
  { id: 'education', label: 'Giáo dục' },
  { id: 'weather', label: 'Thời tiết' },
  { id: 'emergency', label: 'Khẩn cấp' },
];

const POS_CHIPS: Array<{ id: PartOfSpeech | undefined; label: string }> = [
  { id: undefined, label: 'Tất cả từ loại' },
  { id: 'noun', label: 'Danh từ' },
  { id: 'verb', label: 'Động từ' },
  { id: 'adjective', label: 'Tính từ' },
  { id: 'adverb', label: 'Trạng từ' },
  { id: 'numeral', label: 'Số từ' },
  { id: 'pronoun', label: 'Đại từ' },
  { id: 'preposition', label: 'Giới từ' },
  { id: 'interjection', label: 'Cụm giao tiếp' },
];

const POS_LABELS_VI: Record<string, string> = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  pronoun: 'Đại từ',
  preposition: 'Giới từ',
  conjunction: 'Liên từ',
  particle: 'Trợ từ',
  numeral: 'Số từ',
  interjection: 'Thán từ / Cụm từ',
  other: 'Từ loại khác',
};

export const DictionarySection: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [direction, setDirection] = useState<DictDirection>('vi-ru');
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<DictionaryTopic | undefined>();
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | undefined>();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Search or browse execution
  const searchResult = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return dictionaryService.browse({
        topic: selectedTopic,
        partOfSpeech: selectedPos,
        limit: 300,
      });
    }
    return dictionaryService.search(trimmed, {
      topic: selectedTopic,
      partOfSpeech: selectedPos,
      limit: 150,
    });
  }, [query, selectedTopic, selectedPos]);

  // Statistics
  const stats = useMemo(() => dictionaryService.getStatistics(), []);

  // Practical phrases
  const phrases = useMemo(() => dictionaryService.getPhrases(selectedTopic), [selectedTopic]);

  const handleSpeak = (text: string) => {
    if (!text || !text.trim()) return;
    const cleanText = text.split('/')[0].replace(/\s*\(.*?\)\s*/g, ' ').trim();
    setSpeakingText(cleanText);
    textToSpeechService.speak(
      cleanText,
      'ru',
      undefined,
      () => setSpeakingText((prev) => (prev === cleanText ? null : prev)),
      () => setSpeakingText((prev) => (prev === cleanText ? null : prev))
    );
  };

  return (
    <div className="space-y-4">
      {/* Sub-navigation tabs */}
      <div className="flex v2-bg-soft border v2-divider p-1 rounded-xl text-xs font-medium v2-text-muted gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setViewMode('search')}
          className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'search' ? 'bg-slate-800 v2-text font-semibold shadow-xs' : 'hover:opacity-70'
          }`}
        >
          <Search size={14} className="v2-accent-text" /> Từ điển Việt - Nga
        </button>
        <button
          onClick={() => setViewMode('cases')}
          className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'cases' ? 'bg-slate-800 v2-text font-semibold shadow-xs' : 'hover:opacity-70'
          }`}
        >
          <Layers size={14} className="v2-accent-text" /> 6 Cách tiếng Nga
        </button>
        <button
          onClick={() => setViewMode('conjugations')}
          className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'conjugations' ? 'bg-slate-800 v2-text font-semibold shadow-xs' : 'hover:opacity-70'
          }`}
        >
          <RefreshCw size={14} className="v2-accent-text" /> Chia động từ
        </button>
        <button
          onClick={() => setViewMode('phrases')}
          className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === 'phrases' ? 'bg-slate-800 v2-text font-semibold shadow-xs' : 'hover:opacity-70'
          }`}
        >
          <BookOpen size={14} className="v2-accent-text" /> Mẫu câu ({phrases.length})
        </button>
      </div>

      {/* Header Info Banner & Direction Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] v2-text-muted v2-bg-soft/60 border v2-divider rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span className="tabular-nums">
            <strong className="v2-text">{stats.totalEntries}</strong> mục từ Việt - Nga •{' '}
            <strong className="v2-text">{stats.totalForms}</strong> dạng biến cách 100% Offline
          </span>
        </div>

        <div className="flex items-center gap-1 v2-bg border v2-divider p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setDirection('vi-ru')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              direction === 'vi-ru' ? 'v2-accent-bg font-semibold' : 'v2-text-muted hover:opacity-70'
            }`}
          >
            Việt → Nga
          </button>
          <button
            type="button"
            onClick={() => setDirection('ru-vi')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              direction === 'ru-vi' ? 'v2-accent-bg font-semibold' : 'v2-text-muted hover:opacity-70'
            }`}
          >
            Nga → Việt
          </button>
          <button
            type="button"
            onClick={() => setDirection('auto')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              direction === 'auto' ? 'v2-accent-bg font-semibold' : 'v2-text-muted hover:opacity-70'
            }`}
          >
            <ArrowLeftRight size={11} /> Song ngữ
          </button>
        </div>
      </div>

      {/* VIEW: SEARCH & MORPHOLOGY */}
      {viewMode === 'search' && (
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 v2-text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                direction === 'vi-ru'
                  ? 'Tra từ tiếng Việt sang tiếng Nga (vd: xin chào, nhà thuốc, hộ chiếu, đại học)...'
                  : 'Nhập tiếng Nga (аптека, университет) hoặc tiếng Việt (nhà thuốc)...'
              }
              aria-label="Tra từ điển Việt - Nga"
              className="w-full h-11 v2-bg-soft border v2-divider rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm v2-text placeholder:v2-text-faint focus:outline-none focus:border-rose-500/60 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Xóa từ khóa tra cứu"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 v2-text-muted hover:opacity-70 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Topic Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedTopic(undefined)}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                !selectedTopic
                  ? 'v2-accent-bg border-rose-500 font-medium'
                  : 'v2-bg-soft v2-text-muted v2-divider hover:bg-slate-800'
              }`}
            >
              Tất cả chủ đề
            </button>
            {TOPIC_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedTopic(selectedTopic === chip.id ? undefined : chip.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  selectedTopic === chip.id
                    ? 'v2-accent-bg border-rose-500 font-medium'
                    : 'v2-bg-soft v2-text-muted v2-divider hover:bg-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Part of Speech Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {POS_CHIPS.map((pos) => {
              const isSelected = selectedPos === pos.id;
              return (
                <button
                  key={pos.label}
                  onClick={() => setSelectedPos(pos.id)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'v2-accent-soft v2-accent-text border v2-divider font-semibold'
                      : 'v2-bg/60 v2-text-muted v2-divider/80 hover:opacity-70'
                  }`}
                >
                  {pos.label}
                </button>
              );
            })}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs v2-text-muted px-1">
            <span>
              {query.trim() ? 'Tìm thấy ' : 'Hiển thị '}
              <strong className="v2-text font-mono tabular-nums">{searchResult.totalMatches}</strong> mục từ điển
            </span>
            {searchResult.lookupTimeMs > 0 && (
              <span className="font-mono text-[10px] v2-text-faint tabular-nums">{searchResult.lookupTimeMs}ms</span>
            )}
          </div>

          {/* Match List */}
          <div className="space-y-2.5">
            {searchResult.matches.map((match) => {
              const { entry, matchType, matchedFormFeatures } = match;
              const isExpanded = selectedEntryId === entry.id;
              const isSpeakingEntry = speakingText === entry.lemma;
              const primaryVi = entry.meanings.map((m) => m.vi).join('; ');

              return (
                <Card
                  key={entry.id}
                  className={`p-3.5 transition-all cursor-pointer ${
                    isExpanded ? 'border-rose-500/50 bg-slate-850' : 'hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedEntryId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      {/* Metadata Row (Unboxed clean typography) */}
                      <div className="flex items-center gap-2 flex-wrap text-[11px] v2-text-muted">
                        <span className="v2-accent-text font-medium">
                          {POS_LABELS_VI[entry.partOfSpeech] || entry.partOfSpeech}
                          {entry.gender ? ` · giống ${entry.gender === 'masculine' ? 'đực' : entry.gender === 'feminine' ? 'cái' : 'trung'}` : ''}
                        </span>
                        {entry.difficulty && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-400 font-mono">{entry.difficulty}</span>
                          </>
                        )}
                        {matchType === 'exact_form' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-300">
                              Dạng biến đổi ({matchedFormFeatures?.case || 'chia động từ'})
                            </span>
                          </>
                        )}
                      </div>

                      {direction === 'vi-ru' ? (
                        /* Vietnamese -> Russian Priority Layout */
                        <>
                          <div className="text-sm sm:text-base font-bold v2-text leading-snug">
                            {primaryVi}
                          </div>
                          <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
                            <span className="text-base sm:text-lg font-bold v2-accent-text tracking-wide">
                              {entry.pronunciation?.stress || entry.lemma}
                            </span>
                            {entry.pronunciation?.phonetic && (
                              <span className="text-xs v2-text-muted font-mono">
                                [{entry.pronunciation.phonetic}]
                              </span>
                            )}
                            {entry.pronunciation?.ipa && (
                              <span className="text-[11px] v2-text-faint font-mono">
                                {entry.pronunciation.ipa}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Russian -> Vietnamese / Bilingual Layout */
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-bold v2-text tracking-tight">
                              {entry.pronunciation?.stress || entry.lemma}
                            </span>
                            {entry.pronunciation?.phonetic && (
                              <span className="text-xs v2-accent-text/90 font-mono">
                                [{entry.pronunciation.phonetic}]
                              </span>
                            )}
                            {entry.pronunciation?.ipa && (
                              <span className="text-[11px] v2-text-faint font-mono">
                                {entry.pronunciation.ipa}
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-medium v2-text pt-0.5">
                            {entry.meanings.map((m, i) => (
                              <span key={m.id} className="inline-block mr-2">
                                {i > 0 && '; '}
                                <strong>{m.vi}</strong>
                                {m.context && <span className="v2-text-muted text-xs font-normal"> ({m.context})</span>}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(entry.lemma);
                      }}
                      className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-95 ${
                        isSpeakingEntry
                          ? 'v2-accent-bg shadow-md shadow-rose-950/60'
                          : 'v2-accent-soft border border-rose-500/30 v2-accent-text hover:opacity-80 hover:opacity-70'
                      }`}
                      title={`Phát âm tiếng Nga: ${entry.lemma}`}
                      aria-label={`Phát âm ${entry.lemma}`}
                    >
                      <Volume2 size={18} className={isSpeakingEntry ? 'animate-pulse' : ''} />
                    </button>
                  </div>

                  {/* Expanded View: Forms, Examples, Phrases */}
                  {isExpanded && (
                    <div
                      className="mt-3 pt-3 border-t v2-divider text-xs space-y-2.5 v2-fade-up"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Declension / Inflected Forms */}
                      {entry.forms && entry.forms.length > 0 && (
                        <div>
                          <div className="font-semibold v2-text-muted mb-1.5 flex items-center gap-1.5">
                            <Layers size={12} className="v2-accent-text" /> Các dạng biến cách / chia từ (chạm để nghe):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.forms.map((f, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handleSpeak(f.form)}
                                className="v2-bg hover:bg-slate-800 v2-text px-2.5 py-1 rounded-lg font-mono text-[11px] border v2-divider flex items-center gap-1 transition-colors cursor-pointer"
                                title={`Nghe phát âm: ${f.form}`}
                              >
                                <Volume2 size={11} className="v2-accent-text" />
                                <span>{f.form}</span>
                                {f.grammaticalFeatures?.case && (
                                  <span className="v2-text-faint text-[10px]">
                                    ({f.grammaticalFeatures.case.slice(0, 3)})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Examples */}
                      {entry.examples && entry.examples.length > 0 && (
                        <div>
                          <div className="font-semibold v2-text-muted mb-1.5 flex items-center gap-1.5">
                            <BookOpen size={12} className="v2-accent-text" /> Câu ví dụ song ngữ:
                          </div>
                          <div className="space-y-1.5 v2-bg/60 p-2.5 rounded-xl border v2-divider">
                            {entry.examples.map((ex) => (
                              <div key={ex.id} className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="v2-text font-medium">{ex.ru}</div>
                                  <div className="v2-text-muted text-[11px]">{ex.vi}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSpeak(ex.ru)}
                                  className="min-h-[34px] min-w-[34px] px-2 rounded-lg bg-slate-800 hover:opacity-80 v2-accent-text hover:opacity-70 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                  title="Nghe câu ví dụ"
                                  aria-label={`Phát âm câu ${ex.ru}`}
                                >
                                  <Volume2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Phrases */}
                      {entry.phrases && entry.phrases.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap v2-text-muted">
                          <span className="font-semibold v2-text-muted">Cụm từ hay gặp:</span>
                          {entry.phrases.map((p, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleSpeak(p)}
                              className="v2-bg hover:bg-slate-800 v2-accent-text border v2-divider px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 size={11} className="v2-accent-text" />
                              <span>{p}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}

            {searchResult.matches.length === 0 && (
              <div className="py-10 text-center v2-text-muted text-xs">
                Không tìm thấy mục từ nào khớp "{query}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: 6 CASES */}
      {viewMode === 'cases' && (
        <div className="space-y-3">
          <div className="text-xs v2-text-muted v2-bg-soft/60 p-3 rounded-xl border v2-divider leading-relaxed">
            Hệ thống 6 biến cách là xương sống ngữ pháp tiếng Nga. Mỗi cách trả lời câu hỏi và biến đổi đuôi danh từ/tính từ khác nhau.
          </div>
          <div className="space-y-2.5">
            {RUSSIAN_CASES.map((c, index) => (
              <Card key={c.caseName} className="p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b v2-divider pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider v2-accent-text font-mono">
                      Cách {index + 1}
                    </span>
                    <h4 className="text-sm font-bold v2-text">{c.vietnameseName}</h4>
                    <p className="text-xs v2-text-muted font-mono">{c.russianName}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-xs font-semibold v2-accent-text v2-accent-soft border border-rose-500/30 px-2 py-0.5 rounded-md">
                        {c.questionRu}
                      </span>
                      <p className="text-[10px] v2-text-muted mt-0.5">{c.questionVi}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeak(c.russianName)}
                      className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-800 hover:opacity-80 v2-accent-text hover:opacity-70 flex items-center justify-center cursor-pointer"
                      title="Nghe tên cách tiếng Nga"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs v2-text-muted leading-relaxed">
                  <strong className="v2-text">Ý nghĩa & công dụng:</strong> {c.primaryUsage}
                </div>
                {c.prepositions.length > 0 && (
                  <div className="text-xs v2-text-muted flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold v2-text-muted">Giới từ đi kèm:</span>
                    {c.prepositions.map((prep, i) => (
                      <span key={i} className="v2-bg border v2-divider v2-text-muted px-1.5 py-0.5 rounded font-mono text-[11px]">
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
          <div className="text-xs v2-text-muted v2-bg-soft/60 p-3 rounded-xl border v2-divider leading-relaxed">
            Động từ tiếng Nga có 2 nhóm chia chính (Nhóm 1 & Nhóm 2) cùng cặp thể chưa hoàn thành / hoàn thành.
          </div>
          <div className="space-y-2.5">
            {CONJUGATION_PATTERNS.map((p) => (
              <Card key={p.conjugationType} className="p-3.5 space-y-2">
                <h4 className="text-sm font-bold v2-text">{p.nameVi}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="v2-bg/70 p-2.5 rounded-xl border v2-divider space-y-1">
                    <div className="font-semibold v2-text-muted">Đuôi chia số ít:</div>
                    <div>я: <span className="font-mono font-bold v2-accent-text">{p.endings['1stSingular']}</span></div>
                    <div>ты: <span className="font-mono font-bold v2-accent-text">{p.endings['2ndSingular']}</span></div>
                    <div>он/она: <span className="font-mono font-bold v2-accent-text">{p.endings['3rdSingular']}</span></div>
                  </div>
                  <div className="v2-bg/70 p-2.5 rounded-xl border v2-divider space-y-1">
                    <div className="font-semibold v2-text-muted">Đuôi chia số nhiều:</div>
                    <div>мы: <span className="font-mono font-bold v2-accent-text">{p.endings['1stPlural']}</span></div>
                    <div>вы: <span className="font-mono font-bold v2-accent-text">{p.endings['2ndPlural']}</span></div>
                    <div>они: <span className="font-mono font-bold v2-accent-text">{p.endings['3rdPlural']}</span></div>
                  </div>
                </div>
                <div className="text-xs v2-text-muted flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold v2-text-muted">Ví dụ (chạm để nghe):</span>
                  {p.examples.map((ex, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleSpeak(ex)}
                      className="v2-bg hover:bg-slate-800 border v2-divider v2-accent-text px-2 py-0.5 rounded font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={11} className="v2-accent-text" />
                      <span>{ex}</span>
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Aspectual Pairs Table */}
          <Card className="p-3.5 space-y-2.5">
            <h4 className="text-sm font-bold v2-text flex items-center gap-1.5">
              <RefreshCw size={14} className="v2-accent-text" /> Cặp thể động từ quan trọng
            </h4>
            <div className="space-y-1.5">
              {COMMON_ASPECTUAL_PAIRS.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl v2-bg/60 border v2-divider gap-2"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSpeak(pair.imperfective)}
                      className="font-semibold font-mono v2-text hover:opacity-70 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={12} className="v2-accent-text" />
                      {pair.imperfective}
                    </button>
                    <ArrowRight size={12} className="v2-text-faint" />
                    <button
                      type="button"
                      onClick={() => handleSpeak(pair.perfective)}
                      className="font-semibold font-mono v2-accent-text hover:opacity-70 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 size={12} className="v2-accent-text" />
                      {pair.perfective}
                    </button>
                  </div>
                  <span className="v2-text-muted font-medium">{pair.meaningVi}</span>
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
                  <div className="text-sm font-bold v2-text">{phrase.ru}</div>
                  <div className="text-xs v2-accent-text/80 font-mono">[{phrase.phonetic}]</div>
                  <div className="text-sm font-medium v2-text mt-0.5">{phrase.vi}</div>
                  {phrase.literalMeaningVi && (
                    <div className="text-[11px] v2-text-muted">Nghĩa đen: {phrase.literalMeaningVi}</div>
                  )}
                  <div className="text-[11px] v2-text-muted pt-0.5">Ngữ cảnh: {phrase.context}</div>
                </div>
                <button
                  onClick={() => handleSpeak(phrase.ru)}
                  className="min-h-[44px] min-w-[44px] v2-accent-soft border border-rose-500/30 v2-accent-text hover:opacity-80 hover:opacity-70 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="Phát âm câu tiếng Nga"
                  aria-label={`Phát âm ${phrase.ru}`}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

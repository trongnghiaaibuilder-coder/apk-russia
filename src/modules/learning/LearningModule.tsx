import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { AlphabetSection } from './components/AlphabetSection';
import { PronunciationSection } from './components/PronunciationSection';
import { VocabularySection } from './components/VocabularySection';
import { PhrasesSection } from './components/PhrasesSection';
import { LessonsSection } from './components/LessonsSection';
import { FlashcardSection } from './components/FlashcardSection';
import { ReviewSection } from './components/ReviewSection';
import { QuizSection } from './components/QuizSection';
import { ProgressSummary } from './components/ProgressSummary';
import { DictionarySection } from './components/DictionarySection';
import { reviewService } from './services/reviewService';
import { RUSSIAN_VOCABULARY } from './data/vocabulary';
import { RUSSIAN_PHRASES } from './data/phrases';
import { RUSSIAN_ALPHABET } from './data/alphabet';
import { PRONUNCIATION_GUIDES } from './data/pronunciation';
import { TOPIC_LESSONS } from './data/lessons';
import { DICTIONARY_DATASET } from '../../data/dictionary';

export type LearnTabId =
  | 'alphabet'
  | 'pronunciation'
  | 'vocabulary'
  | 'phrases'
  | 'dictionary'
  | 'lessons'
  | 'flashcards'
  | 'review'
  | 'quiz'
  | 'progress';

interface SubTabConfig {
  id: LearnTabId;
  label: string;
  shortLabel: string;
  badge?: number;
}

export const LearningModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LearnTabId>('vocabulary');
  const reviewCount = reviewService.getReviewCount();

  const SUB_TABS: SubTabConfig[] = [
    { id: 'alphabet', label: `Chữ cái (${RUSSIAN_ALPHABET.length})`, shortLabel: 'Chữ cái' },
    { id: 'pronunciation', label: `Phát âm (${PRONUNCIATION_GUIDES.length})`, shortLabel: 'Phát âm' },
    { id: 'vocabulary', label: `Từ vựng (${RUSSIAN_VOCABULARY.length})`, shortLabel: 'Từ vựng' },
    { id: 'dictionary', label: `Từ điển Việt - Nga (${DICTIONARY_DATASET.length})`, shortLabel: 'Từ điển' },
    { id: 'phrases', label: `Câu sinh tồn (${RUSSIAN_PHRASES.length})`, shortLabel: 'Mẫu câu' },
    { id: 'lessons', label: `Bài học (${TOPIC_LESSONS.length})`, shortLabel: 'Bài học' },
    { id: 'flashcards', label: 'Thẻ Flashcard', shortLabel: 'Thẻ' },
    { id: 'review', label: 'Cần ôn', shortLabel: 'Cần ôn', badge: reviewCount > 0 ? reviewCount : undefined },
    { id: 'quiz', label: 'Trắc nghiệm', shortLabel: 'Trắc nghiệm' },
    { id: 'progress', label: 'Tiến độ', shortLabel: 'Tiến độ' },
  ];

  return (
    <div className="space-y-4 v2-fade-up">
      <SectionHeader
        kicker="Học tiếng Nga"
        title="Học mỗi ngày, tiến bộ mỗi ngày"
        subtitle="Học tiếng Nga căn bản, ngoại tuyến 100% dành cho người Việt"
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`v2-fade-up min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 select-none ${
                isActive
                  ? 'v2-accent-bg font-semibold shadow-lg shadow-rose-950/50'
                  : 'v2-card v2-text-muted hover:opacity-70'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-1">
        {activeTab === 'alphabet' && <AlphabetSection />}
        {activeTab === 'pronunciation' && <PronunciationSection />}
        {activeTab === 'vocabulary' && <VocabularySection />}
        {activeTab === 'dictionary' && <DictionarySection />}
        {activeTab === 'phrases' && <PhrasesSection />}
        {activeTab === 'lessons' && <LessonsSection />}
        {activeTab === 'flashcards' && <FlashcardSection />}
        {activeTab === 'review' && <ReviewSection />}
        {activeTab === 'quiz' && <QuizSection />}
        {activeTab === 'progress' && <ProgressSummary />}
      </div>
    </div>
  );
};

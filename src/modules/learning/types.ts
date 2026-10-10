/**
 * Russia AI Support - Russian Learning Engine Types
 * Developer: Xương Rồng AI developer
 * Phase: P2 — RUSSIAN LEARNING ENGINE
 */

export interface RussianLesson {
  id: string;
  category: 'alphabet' | 'greetings' | 'survival' | 'transport' | 'emergency';
  titleRu: string;
  titleEn: string;
  estimatedMinutes: number;
}

export interface LearningModuleProps {
  onSelectLesson?: (lessonId: string) => void;
}

export type LetterType = 'vowel' | 'consonant' | 'sign';

export interface RussianLetter {
  id: string;
  upper: string;
  lower: string;
  latin: string;
  vietnamesePronunciation: string;
  exampleWordRu: string;
  exampleWordPronunciation: string;
  exampleWordMeaningVi: string;
  type: LetterType;
  notes?: string;
}

export interface PronunciationGuideItem {
  id: string;
  soundRu: string;
  name: string;
  category: 'vowels' | 'consonants' | 'difficult_sounds' | 'signs' | 'iotated';
  descriptionVi: string;
  howToPronounceVi: string;
  examples: Array<{
    ru: string;
    pronunciation: string;
    vi: string;
  }>;
}

export type VocabularyCategory =
  | 'Greetings'
  | 'People'
  | 'Numbers'
  | 'Time'
  | 'Food'
  | 'Drinks'
  | 'Transport'
  | 'Taxi'
  | 'Hotel'
  | 'Shopping'
  | 'Money'
  | 'Work'
  | 'Directions'
  | 'Places'
  | 'Emergency'
  | 'Basic communication'
  | 'Health & Pharmacy'
  | 'Documents & Visa'
  | 'Education'
  | 'Weather & Nature'
  | 'Housing & Daily Life'
  | 'Verbs & Actions'
  | 'Adjectives & Colors';

export interface VocabularyItem {
  id: string;
  ru: string;
  pronunciation: string;
  vi: string;
  category: VocabularyCategory;
  examplePhraseRu?: string;
  examplePhraseVi?: string;
  difficulty: 'beginner' | 'intermediate';
  partOfSpeech?: string;
  gender?: 'masculine' | 'feminine' | 'neuter';
  notes?: string;
}

export interface PhraseItem {
  id: string;
  ru: string;
  pronunciation: string;
  vi: string;
  category: string;
  situation: string;
  isEmergency?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'ru_to_vi' | 'vi_to_ru' | 'phrase_meaning' | 'vocabulary_recognition';
  question: string;
  prompt?: string;
  options: string[];
  correctIndex: number;
  explanationVi: string;
}

export interface TopicLesson {
  id: string;
  topicIndex: number;
  titleVi: string;
  titleRu: string;
  descriptionVi: string;
  category: VocabularyCategory | 'General';
  vocabularyIds: string[];
  phraseIds: string[];
  practiceQuestions: QuizQuestion[];
  estimatedMinutes: number;
}

export interface LearningProgress {
  completedLessonIds: string[];
  knownWordIds: string[];
  reviewWordIds: string[];
  learnedPhraseIds: string[];
  quizAttempts: number;
  quizCorrectAnswers: number;
  lastUpdated: string;
}

/**
 * Learning Engine Persistent Storage Service
 * Developer: Xương Rồng AI developer
 */
import { safeStorage } from '../../../services/storage';
import { LearningProgress } from '../types';

const STORAGE_KEY = 'russia_ai_learning_progress_v1';

export const INITIAL_PROGRESS: LearningProgress = {
  completedLessonIds: [],
  knownWordIds: [],
  reviewWordIds: [],
  learnedPhraseIds: [],
  quizAttempts: 0,
  quizCorrectAnswers: 0,
  lastUpdated: new Date().toISOString(),
};

export const learningStorage = {
  getProgress(): LearningProgress {
    try {
      const stored = safeStorage.getItem<LearningProgress>(STORAGE_KEY, INITIAL_PROGRESS);
      if (!stored || typeof stored !== 'object') {
        return { ...INITIAL_PROGRESS };
      }
      return {
        completedLessonIds: Array.isArray(stored.completedLessonIds) ? stored.completedLessonIds : [],
        knownWordIds: Array.isArray(stored.knownWordIds) ? stored.knownWordIds : [],
        reviewWordIds: Array.isArray(stored.reviewWordIds) ? stored.reviewWordIds : [],
        learnedPhraseIds: Array.isArray(stored.learnedPhraseIds) ? stored.learnedPhraseIds : [],
        quizAttempts: typeof stored.quizAttempts === 'number' ? stored.quizAttempts : 0,
        quizCorrectAnswers: typeof stored.quizCorrectAnswers === 'number' ? stored.quizCorrectAnswers : 0,
        lastUpdated: stored.lastUpdated || new Date().toISOString(),
      };
    } catch {
      return { ...INITIAL_PROGRESS };
    }
  },

  saveProgress(progress: LearningProgress): boolean {
    const updated = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };
    return safeStorage.setItem(STORAGE_KEY, updated);
  },

  markLessonCompleted(lessonId: string): LearningProgress {
    const progress = this.getProgress();
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
      this.saveProgress(progress);
    }
    return progress;
  },

  markWordKnown(wordId: string): LearningProgress {
    const progress = this.getProgress();
    progress.reviewWordIds = progress.reviewWordIds.filter((id) => id !== wordId);
    if (!progress.knownWordIds.includes(wordId)) {
      progress.knownWordIds.push(wordId);
    }
    this.saveProgress(progress);
    return progress;
  },

  markWordNeedReview(wordId: string): LearningProgress {
    const progress = this.getProgress();
    progress.knownWordIds = progress.knownWordIds.filter((id) => id !== wordId);
    if (!progress.reviewWordIds.includes(wordId)) {
      progress.reviewWordIds.push(wordId);
    }
    this.saveProgress(progress);
    return progress;
  },

  recordQuizResult(correctCount: number, totalQuestions: number): LearningProgress {
    const progress = this.getProgress();
    progress.quizAttempts += totalQuestions;
    progress.quizCorrectAnswers += correctCount;
    this.saveProgress(progress);
    return progress;
  },

  resetProgress(): LearningProgress {
    this.saveProgress(INITIAL_PROGRESS);
    return { ...INITIAL_PROGRESS };
  },
};

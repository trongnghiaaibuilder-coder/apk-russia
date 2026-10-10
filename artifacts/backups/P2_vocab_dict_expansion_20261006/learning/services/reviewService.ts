/**
 * Review Queue Service (Deterministic P2 Review Engine)
 * Developer: Xương Rồng AI developer
 */
import { learningStorage } from './learningStorage';
import { RUSSIAN_VOCABULARY } from '../data/vocabulary';
import { VocabularyItem } from '../types';

export const reviewService = {
  getReviewItems(): VocabularyItem[] {
    const progress = learningStorage.getProgress();
    const reviewIdSet = new Set(progress.reviewWordIds);
    return RUSSIAN_VOCABULARY.filter((item) => reviewIdSet.has(item.id));
  },

  getReviewCount(): number {
    const progress = learningStorage.getProgress();
    return progress.reviewWordIds.length;
  },

  getKnownCount(): number {
    const progress = learningStorage.getProgress();
    return progress.knownWordIds.length;
  },

  markItemKnown(wordId: string): void {
    learningStorage.markWordKnown(wordId);
  },

  markItemNeedReview(wordId: string): void {
    learningStorage.markWordNeedReview(wordId);
  },
};

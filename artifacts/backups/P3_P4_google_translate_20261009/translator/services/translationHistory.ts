/**
 * Translation History Persistent Storage Service
 * Developer: Xương Rồng AI developer
 */
import { safeStorage } from '../../../services/storage';
import { TranslationHistoryItem, TranslationResult } from '../types';

const HISTORY_STORAGE_KEY = 'russia_ai_translation_history_v1';
const MAX_HISTORY_ITEMS = 30;

export const translationHistory = {
  getHistory(): TranslationHistoryItem[] {
    try {
      const stored = safeStorage.getItem<TranslationHistoryItem[]>(HISTORY_STORAGE_KEY, []);
      if (!Array.isArray(stored)) {
        return [];
      }
      return stored;
    } catch {
      return [];
    }
  },

  addHistoryItem(result: TranslationResult): TranslationHistoryItem[] {
    const current = this.getHistory();
    const newItem: TranslationHistoryItem = {
      id: result.id || `hist-${Date.now()}`,
      sourceText: result.sourceText,
      translatedText: result.translatedText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage,
      timestamp: result.timestamp || new Date().toISOString(),
      provider: result.provider,
    };

    const filtered = current.filter(
      (item) =>
        !(
          item.sourceText === newItem.sourceText &&
          item.sourceLanguage === newItem.sourceLanguage &&
          item.targetLanguage === newItem.targetLanguage
        )
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    safeStorage.setItem(HISTORY_STORAGE_KEY, updated);
    return updated;
  },

  clearHistory(): boolean {
    return safeStorage.setItem(HISTORY_STORAGE_KEY, []);
  },

  removeHistoryItem(id: string): TranslationHistoryItem[] {
    const current = this.getHistory();
    const updated = current.filter((item) => item.id !== id);
    safeStorage.setItem(HISTORY_STORAGE_KEY, updated);
    return updated;
  },
};

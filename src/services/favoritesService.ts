/**
 * Quản lý câu yêu thích — lưu local, đồng bộ đơn giản.
 * Developer: Xương Rồng AI Developer
 */
import { safeStorage } from './storage';

const FAVORITES_KEY = 'favorite_phrases';

/** Định danh duy nhất của một câu: vi|ru */
export function phraseId(vi: string, ru: string): string {
  return `${vi}|||${ru}`;
}

export function getFavorites(): string[] {
  try {
    return safeStorage.getItem<string[]>(FAVORITES_KEY, []);
  } catch {
    return [];
  }
}

export function isFavorite(vi: string, ru: string): boolean {
  return getFavorites().includes(phraseId(vi, ru));
}

export function toggleFavorite(vi: string, ru: string): boolean {
  const id = phraseId(vi, ru);
  let favs = getFavorites();
  const exists = favs.includes(id);
  favs = exists ? favs.filter(f => f !== id) : [...favs, id];
  try {
    safeStorage.setItem(FAVORITES_KEY, favs);
  } catch {}
  return !exists;
}

export function parsePhraseId(id: string): { vi: string; ru: string } {
  const [vi, ru] = id.split('|||');
  return { vi: vi || '', ru: ru || '' };
}

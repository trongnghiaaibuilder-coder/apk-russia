/**
 * Normalization Utility for Russian & Vietnamese Lexical Search
 * Handles:
 * - Cyrillic preservation & case-insensitivity
 * - Russian letter 'ё' -> 'е' normalization for search indexing
 * - Vietnamese diacritics stripping for accent-free search
 * - Whitespace & punctuation stripping
 */

export function normalizeRussian(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u0300\u0301]/g, '') // remove combining acute/grave stress marks only
    .replace(/[ё]/g, 'е')
    .replace(/[.,!?;:"'«»\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function removeVietnameseDiacritics(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function normalizeVietnamese(input: string, removeAccents = false): string {
  if (!input) return '';
  let str = input.trim().toLowerCase().normalize('NFC');
  if (removeAccents) {
    str = removeVietnameseDiacritics(str);
  }
  return str
    .replace(/[.,!?;:"'()«»\-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCyrillic(input: string): boolean {
  return /[\u0400-\u04FF]/i.test(input);
}

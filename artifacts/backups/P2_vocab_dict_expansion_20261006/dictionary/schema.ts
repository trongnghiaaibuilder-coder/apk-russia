/**
 * Dictionary Schema Validation Utilities
 * Ensures data integrity and rejects invalid entries
 */
import { DictionaryEntry, PartOfSpeech } from './types';

const VALID_POS: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'particle',
  'numeral',
  'interjection',
  'other',
];

export function validateDictionaryEntry(entry: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Entry must be a non-null object'] };
  }

  const e = entry as Record<string, unknown>;

  if (!e.id || typeof e.id !== 'string') {
    errors.push('Missing or invalid "id"');
  }

  if (!e.lemma || typeof e.lemma !== 'string' || !e.lemma.trim()) {
    errors.push('Missing or invalid "lemma"');
  }

  if (e.language !== 'ru') {
    errors.push('Language must be "ru"');
  }

  if (!e.partOfSpeech || !VALID_POS.includes(e.partOfSpeech as PartOfSpeech)) {
    errors.push(`Invalid partOfSpeech: ${String(e.partOfSpeech)}`);
  }

  if (!Array.isArray(e.meanings) || e.meanings.length === 0) {
    errors.push('Entry must have at least one meaning in "meanings" array');
  } else {
    e.meanings.forEach((m: any, idx: number) => {
      if (!m || typeof m !== 'object') {
        errors.push(`Meaning at index ${idx} is not an object`);
      } else if (!m.vi || typeof m.vi !== 'string' || !m.vi.trim()) {
        errors.push(`Meaning at index ${idx} missing Vietnamese translation "vi"`);
      }
    });
  }

  if (!Array.isArray(e.sourceRefs) || e.sourceRefs.length === 0) {
    errors.push('Entry must have at least one source in "sourceRefs"');
  }

  if (!e.dataVersion || typeof e.dataVersion !== 'string') {
    errors.push('Missing "dataVersion"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

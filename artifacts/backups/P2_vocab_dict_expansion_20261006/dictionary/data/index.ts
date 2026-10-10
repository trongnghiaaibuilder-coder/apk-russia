/**
 * Russian Dictionary Data Aggregator
 */
import { FOUNDATION_ENTRIES } from './words';
import { DictionaryEntry } from '../types';

export const DICTIONARY_DATASET: DictionaryEntry[] = FOUNDATION_ENTRIES;

export function getAllEntries(): DictionaryEntry[] {
  return DICTIONARY_DATASET;
}

export function getEntryById(id: string): DictionaryEntry | undefined {
  return DICTIONARY_DATASET.find((e) => e.id === id);
}

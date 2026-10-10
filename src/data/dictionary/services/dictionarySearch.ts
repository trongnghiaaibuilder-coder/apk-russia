/**
 * Dictionary Search Service
 * Coordinates searchIndex queries, filtering, and performance measurement
 */
import { searchIndex } from '../index/searchIndex';
import { SearchOptions, SearchResult } from '../types';
import { DICTIONARY_DATASET } from '../data';

let isIndexInitialized = false;

function ensureIndex() {
  if (!isIndexInitialized) {
    searchIndex.init(DICTIONARY_DATASET);
    isIndexInitialized = true;
  }
}

export function searchDictionary(query: string, options: SearchOptions = {}): SearchResult {
  ensureIndex();
  return searchIndex.search(query, options);
}

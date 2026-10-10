/**
 * Multi-Stage Dictionary Search Index
 * Implements strict ranking priorities:
 * 1. Exact Russian lemma
 * 2. Exact inflected form (morphology)
 * 3. Vietnamese meaning (exact or diacritic-free)
 * 4. Phrases containing word
 * 5. Prefix / partial match
 * 6. Related words & synonyms
 */
import { DictionaryEntry, SearchMatch, SearchOptions, SearchResult } from '../types';
import { normalizeRussian, normalizeVietnamese, isCyrillic } from './normalize';
import { morphologyIndex } from './morphologyIndex';

class SearchIndex {
  private entries: DictionaryEntry[] = [];
  private lemmaMap = new Map<string, DictionaryEntry>();

  public init(dataset: DictionaryEntry[]) {
    this.entries = dataset;
    this.lemmaMap.clear();
    for (const e of dataset) {
      const norm = normalizeRussian(e.lemma);
      this.lemmaMap.set(norm, e);
    }
    morphologyIndex.buildIndex(dataset);
  }

  public search(query: string, options: SearchOptions = {}): SearchResult {
    const startTime = performance.now();
    const raw = (query || '').trim();
    if (!raw) {
      return {
        query: raw,
        matches: [],
        totalMatches: 0,
        lookupTimeMs: 0,
      };
    }

    const isRu = isCyrillic(raw);
    const normRu = normalizeRussian(raw);
    const normViWithAccents = normalizeVietnamese(raw, false);
    const normViNoAccents = normalizeVietnamese(raw, true);

    const matchesMap = new Map<string, SearchMatch>();

    const addMatch = (entry: DictionaryEntry, matchType: SearchMatch['matchType'], matchedTerm: string, score: number, formFeatures?: any) => {
      const existing = matchesMap.get(entry.id);
      if (!existing || existing.score < score) {
        matchesMap.set(entry.id, {
          entry,
          matchType,
          matchedTerm,
          score,
          matchedFormFeatures: formFeatures,
        });
      }
    };

    if (isRu) {
      // 1. Exact Russian lemma (Score: 100)
      const exactLemma = this.lemmaMap.get(normRu);
      if (exactLemma) {
        addMatch(exactLemma, 'exact_lemma', exactLemma.lemma, 100);
      }

      // 2. Exact inflected form via morphology (Score: 90)
      const formHits = morphologyIndex.lookupForm(normRu);
      for (const hit of formHits) {
        addMatch(hit.entry, 'exact_form', hit.form, 90, hit.grammaticalFeatures);
      }

      // 4. Phrases (Score: 70)
      for (const entry of this.entries) {
        if (entry.phrases && entry.phrases.some((p) => normalizeRussian(p).includes(normRu))) {
          addMatch(entry, 'phrase', normRu, 70);
        }
      }

      // 5. Prefix / partial match (Score: 60)
      for (const entry of this.entries) {
        const normL = normalizeRussian(entry.lemma);
        if (normL.startsWith(normRu) && normL !== normRu) {
          addMatch(entry, 'prefix', entry.lemma, 60);
        } else if (normL.includes(normRu) && normL !== normRu) {
          addMatch(entry, 'prefix', entry.lemma, 50);
        }
      }
    } else {
      // 3. Vietnamese meaning search (exact match Score: 85, no-accents match Score: 75)
      for (const entry of this.entries) {
        let hasExactVi = false;
        let hasUnaccentedVi = false;
        for (const m of entry.meanings) {
          const mNorm = normalizeVietnamese(m.vi, false);
          const mNoAcc = normalizeVietnamese(m.vi, true);

          if (mNorm === normViWithAccents || mNorm.split(',').map((s) => s.trim()).includes(normViWithAccents)) {
            hasExactVi = true;
          } else if (mNoAcc === normViNoAccents || mNoAcc.split(',').map((s) => s.trim()).includes(normViNoAccents)) {
            hasUnaccentedVi = true;
          } else if (mNorm.includes(normViWithAccents)) {
            hasExactVi = true;
          } else if (mNoAcc.includes(normViNoAccents)) {
            hasUnaccentedVi = true;
          }
        }

        if (hasExactVi) {
          addMatch(entry, 'vietnamese_meaning', raw, 85);
        } else if (hasUnaccentedVi) {
          addMatch(entry, 'vietnamese_meaning', raw, 75);
        }

        // Check examples Vietnamese translation (Score: 65)
        if (entry.examples) {
          for (const ex of entry.examples) {
            const exViNorm = normalizeVietnamese(ex.vi, true);
            if (exViNorm.includes(normViNoAccents)) {
              addMatch(entry, 'phrase', ex.vi, 65);
              break;
            }
          }
        }
      }
    }

    // Apply filtering options
    let results = Array.from(matchesMap.values());
    if (options.topic) {
      results = results.filter((m) => m.entry.topics && m.entry.topics.includes(options.topic!));
    }
    if (options.partOfSpeech) {
      results = results.filter((m) => m.entry.partOfSpeech === options.partOfSpeech);
    }
    if (options.difficulty) {
      results = results.filter((m) => m.entry.difficulty === options.difficulty);
    }

    // Sort by score descending, then by lemma
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.lemma.localeCompare(b.entry.lemma, 'ru');
    });

    const limit = options.limit || 50;
    const paginated = results.slice(0, limit);
    const lookupTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      query: raw,
      matches: paginated,
      totalMatches: results.length,
      lookupTimeMs,
    };
  }
}

export const searchIndex = new SearchIndex();

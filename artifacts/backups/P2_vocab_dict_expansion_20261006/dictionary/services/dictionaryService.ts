/**
 * Russian Dictionary Service (P2 Expansion Facade)
 * Developer: Xương Rồng AI developer
 * Principles: WIDE DATA + OFFLINE-FIRST + MORPHOLOGY-AWARE + SOURCE-TRACEABLE
 * Provides comprehensive unified methods for learning, search, translation, voice, and assistant modules.
 */
import { DICTIONARY_DATASET, getEntryById } from '../data';
import { searchIndex } from '../index/searchIndex';
import { morphologyIndex } from '../index/morphologyIndex';
import { morphologyService, MorphologyAnalysisResult } from './morphologyService';
import { dictionarySourceService } from './dictionarySourceService';
import { PRACTICAL_PHRASES, PracticalPhrase } from '../data/phrases';
import { PRACTICAL_EXAMPLES } from '../data/examples';
import {
  DictionaryEntry,
  DictionaryTopic,
  PartOfSpeech,
  SearchOptions,
  SearchResult,
  CEFRDifficulty,
} from '../types';
import { normalizeRussian } from '../index/normalize';

export class DictionaryService {
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!this.initialized) {
      searchIndex.init(DICTIONARY_DATASET);
      this.initialized = true;
    }
  }

  /**
   * Search Russian or Vietnamese query with morphology awareness
   */
  public search(query: string, options: SearchOptions = {}): SearchResult {
    this.ensureInitialized();
    return searchIndex.search(query, options);
  }

  /**
   * Lookup exact lemma
   */
  public getByLemma(lemma: string): DictionaryEntry | undefined {
    const norm = normalizeRussian(lemma);
    return DICTIONARY_DATASET.find((e) => normalizeRussian(e.lemma) === norm);
  }

  /**
   * Get entry by unique ID
   */
  public getById(id: string): DictionaryEntry | undefined {
    return getEntryById(id);
  }

  /**
   * Analyze word morphology (case, number, tense, aspect, lemma)
   */
  public analyzeMorphology(word: string): MorphologyAnalysisResult {
    this.ensureInitialized();
    return morphologyService.analyzeWord(word);
  }

  /**
   * Get all entries filtered by topic
   */
  public getByTopic(topic: DictionaryTopic): DictionaryEntry[] {
    return DICTIONARY_DATASET.filter((e) => e.topics && e.topics.includes(topic));
  }

  /**
   * Get all entries filtered by part of speech
   */
  public getByPartOfSpeech(pos: PartOfSpeech): DictionaryEntry[] {
    return DICTIONARY_DATASET.filter((e) => e.partOfSpeech === pos);
  }

  /**
   * Get practical survival phrases for a topic or difficulty
   */
  public getPhrases(topic?: DictionaryTopic, difficulty?: CEFRDifficulty): PracticalPhrase[] {
    let result = PRACTICAL_PHRASES;
    if (topic) {
      result = result.filter((p) => p.topics.includes(topic));
    }
    if (difficulty) {
      result = result.filter((p) => p.difficulty === difficulty);
    }
    return result;
  }

  /**
   * Get all practical examples
   */
  public getExamples(topic?: DictionaryTopic) {
    if (topic) {
      return PRACTICAL_EXAMPLES.filter((ex) => ex.topics && ex.topics.includes(topic));
    }
    return PRACTICAL_EXAMPLES;
  }

  /**
   * Get random word for daily study
   */
  public getRandomWord(difficulty?: CEFRDifficulty): DictionaryEntry {
    const pool = difficulty
      ? DICTIONARY_DATASET.filter((e) => e.difficulty === difficulty)
      : DICTIONARY_DATASET;
    const list = pool.length > 0 ? pool : DICTIONARY_DATASET;
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  /**
   * Summary metrics and coverage
   */
  public getStatistics() {
    this.ensureInitialized();
    const totalEntries = DICTIONARY_DATASET.length;
    const totalForms = morphologyIndex.getFormCount();
    const totalPhrases = PRACTICAL_PHRASES.length;
    const totalExamples = PRACTICAL_EXAMPLES.length;
    const topicSet = new Set<string>();
    const posCounts: Record<string, number> = {};

    for (const e of DICTIONARY_DATASET) {
      posCounts[e.partOfSpeech] = (posCounts[e.partOfSpeech] || 0) + 1;
      if (e.topics) {
        e.topics.forEach((t) => topicSet.add(t));
      }
    }

    return {
      totalEntries,
      totalForms,
      totalPhrases,
      totalExamples,
      topicsCovered: Array.from(topicSet),
      posBreakdown: posCounts,
      isOfflineCompliant: dictionarySourceService.isFullyOfflineCompliant(),
    };
  }

  // ========================================================
  // Integration Bridges for P3, P4, P6 & P9
  // ========================================================

  /**
   * P3 Translation Bridge: Enriches token stream with base lemmas & definitions
   */
  public enrichTranslationTokens(tokens: string[]): Array<{ token: string; lemma?: string; vi?: string }> {
    this.ensureInitialized();
    return tokens.map((token) => {
      const morph = morphologyService.analyzeWord(token);
      if (morph.isRecognized && morph.matches.length > 0) {
        return {
          token,
          lemma: morph.matches[0].lemma,
          vi: morph.matches[0].meanings[0],
        };
      }
      return { token };
    });
  }

  /**
   * P4 Voice Bridge: Instant word lookup for transcribed voice turns
   */
  public lookupTranscriptWord(word: string) {
    this.ensureInitialized();
    const morph = morphologyService.analyzeWord(word);
    if (morph.isRecognized && morph.matches.length > 0) {
      const primary = morph.matches[0];
      const entry = this.getById(primary.lemmaId);
      return {
        word,
        lemma: primary.lemma,
        grammaticalFeatures: primary.grammaticalFeatures,
        meanings: primary.meanings,
        entry,
      };
    }
    return null;
  }

  /**
   * P6 Assistant Bridge: Keywords retrieval by living category
   */
  public getAssistantKeywords(category: DictionaryTopic): string[] {
    const entries = this.getByTopic(category);
    return entries.map((e) => e.lemma);
  }
}

export const dictionaryService = new DictionaryService();
